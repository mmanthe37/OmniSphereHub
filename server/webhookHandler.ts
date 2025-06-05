import { Express } from "express";
import { 
  isWalletAllowlisted, 
  getWalletPrivileges, 
  logWalletActivity 
} from "./walletAllowlist";

// OAuth webhook configuration
export const OAUTH_WEBHOOK_UUID = "6828e920d9199168d6549bab";

interface OAuthWebhookPayload {
  event: string;
  user_id: string;
  wallet_address?: string;
  timestamp: string;
  metadata?: any;
}

interface AuthenticationEvent {
  userId: string;
  walletAddress: string;
  isAllowlisted: boolean;
  privileges: any;
  timestamp: Date;
  sessionId: string;
}

class WebhookHandler {
  private authenticatedSessions: Map<string, AuthenticationEvent> = new Map();

  async handleOAuthWebhook(payload: OAuthWebhookPayload): Promise<{
    success: boolean;
    sessionId?: string;
    privileges?: any;
    message: string;
  }> {
    try {
      const { event, user_id, wallet_address, timestamp } = payload;

      switch (event) {
        case 'user.authenticated':
          return await this.handleUserAuthentication(user_id, wallet_address, timestamp);
        
        case 'wallet.connected':
          return await this.handleWalletConnection(user_id, wallet_address, timestamp);
        
        case 'session.created':
          return await this.handleSessionCreation(user_id, wallet_address, timestamp);
        
        default:
          return {
            success: false,
            message: `Unknown event type: ${event}`
          };
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        message: 'Webhook processing failed'
      };
    }
  }

  private async handleUserAuthentication(
    userId: string, 
    walletAddress?: string, 
    timestamp?: string
  ): Promise<any> {
    if (!walletAddress) {
      return {
        success: false,
        message: 'Wallet address required for authentication'
      };
    }

    const isAllowlisted = isWalletAllowlisted(walletAddress);
    const privileges = getWalletPrivileges(walletAddress);
    const sessionId = this.generateSessionId();

    const authEvent: AuthenticationEvent = {
      userId,
      walletAddress,
      isAllowlisted,
      privileges,
      timestamp: new Date(timestamp || Date.now()),
      sessionId
    };

    this.authenticatedSessions.set(sessionId, authEvent);

    logWalletActivity(walletAddress, 'OAUTH_AUTHENTICATION', {
      userId,
      isAllowlisted,
      sessionId
    });

    return {
      success: true,
      sessionId,
      privileges,
      message: `Authentication successful${isAllowlisted ? ' with premium privileges' : ''}`
    };
  }

  private async handleWalletConnection(
    userId: string, 
    walletAddress?: string, 
    timestamp?: string
  ): Promise<any> {
    if (!walletAddress) {
      return {
        success: false,
        message: 'Wallet address required for connection'
      };
    }

    const isAllowlisted = isWalletAllowlisted(walletAddress);
    const privileges = getWalletPrivileges(walletAddress);

    logWalletActivity(walletAddress, 'WALLET_CONNECTED', {
      userId,
      isAllowlisted,
      timestamp
    });

    return {
      success: true,
      privileges,
      message: `Wallet connected${isAllowlisted ? ' with premium access' : ''}`
    };
  }

  private async handleSessionCreation(
    userId: string, 
    walletAddress?: string, 
    timestamp?: string
  ): Promise<any> {
    const sessionId = this.generateSessionId();

    if (walletAddress) {
      const isAllowlisted = isWalletAllowlisted(walletAddress);
      const privileges = getWalletPrivileges(walletAddress);

      const authEvent: AuthenticationEvent = {
        userId,
        walletAddress,
        isAllowlisted,
        privileges,
        timestamp: new Date(timestamp || Date.now()),
        sessionId
      };

      this.authenticatedSessions.set(sessionId, authEvent);

      logWalletActivity(walletAddress, 'SESSION_CREATED', {
        userId,
        sessionId,
        isAllowlisted
      });
    }

    return {
      success: true,
      sessionId,
      message: 'Session created successfully'
    };
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getAuthenticatedSession(sessionId: string): AuthenticationEvent | undefined {
    return this.authenticatedSessions.get(sessionId);
  }

  getAllowlistedSessions(): AuthenticationEvent[] {
    return Array.from(this.authenticatedSessions.values())
      .filter(session => session.isAllowlisted);
  }

  cleanupExpiredSessions(): void {
    const now = new Date();
    const oneHour = 60 * 60 * 1000;

    for (const [sessionId, session] of this.authenticatedSessions.entries()) {
      if (now.getTime() - session.timestamp.getTime() > oneHour) {
        this.authenticatedSessions.delete(sessionId);
      }
    }
  }
}

export const webhookHandler = new WebhookHandler();

export function setupWebhookRoutes(app: Express): void {
  // OAuth webhook endpoint
  app.post(`/api/webhook/oauth/${OAUTH_WEBHOOK_UUID}`, async (req, res) => {
    try {
      const payload: OAuthWebhookPayload = req.body;
      
      console.log(`[WEBHOOK] Received OAuth event: ${payload.event} from ${payload.user_id}`);
      
      const result = await webhookHandler.handleOAuthWebhook(payload);
      
      res.json({
        success: result.success,
        sessionId: result.sessionId,
        privileges: result.privileges,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal webhook processing error'
      });
    }
  });

  // Session validation endpoint
  app.get('/api/session/:sessionId/validate', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = webhookHandler.getAuthenticatedSession(sessionId);

      if (!session) {
        return res.status(404).json({
          valid: false,
          message: 'Session not found'
        });
      }

      res.json({
        valid: true,
        session: {
          userId: session.userId,
          walletAddress: session.walletAddress,
          isAllowlisted: session.isAllowlisted,
          privileges: session.privileges,
          timestamp: session.timestamp
        }
      });
    } catch (error) {
      res.status(500).json({
        valid: false,
        message: 'Session validation failed'
      });
    }
  });

  // Allowlisted sessions endpoint
  app.get('/api/sessions/allowlisted', async (req, res) => {
    try {
      const sessions = webhookHandler.getAllowlistedSessions();
      
      res.json({
        count: sessions.length,
        sessions: sessions.map(session => ({
          sessionId: session.sessionId,
          userId: session.userId,
          walletAddress: session.walletAddress,
          timestamp: session.timestamp,
          privileges: session.privileges
        }))
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch allowlisted sessions'
      });
    }
  });

  // Cleanup expired sessions every hour
  setInterval(() => {
    webhookHandler.cleanupExpiredSessions();
  }, 60 * 60 * 1000);
}