// Real-time streaming data from Xano MCP server
export class XanoStreamingService {
  private baseUrl = 'https://x8ki-letl-twmt.n7.xano.io/x2/mcp/XLRQ8o0R/mcp';
  private sessionId: string | null = null;
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Initialize MCP session and connect to market data stream
  async connectMarketDataStream(onData: (data: any) => void, onError?: (error: any) => void) {
    try {
      // First establish MCP session
      const sessionResponse = await fetch(`${this.baseUrl}/sse?stream=market_data`);
      const sessionText = await sessionResponse.text();
      
      // Extract session ID from SSE response
      const sessionMatch = sessionText.match(/sessionId=([a-f0-9-]+)/);
      if (sessionMatch) {
        this.sessionId = sessionMatch[1];
        console.log('Xano MCP session established:', this.sessionId);
      }

      // Connect to the session-specific endpoint
      if (this.sessionId) {
        this.eventSource = new EventSource(`${this.baseUrl}/messages?sessionId=${this.sessionId}`, {
          withCredentials: false
        });

        this.eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onData(data);
            this.reconnectAttempts = 0;
          } catch (error) {
            console.error('Error parsing MCP stream data:', error);
            onError?.(error);
          }
        };

        this.eventSource.onerror = (error) => {
          console.error('MCP stream connection error:', error);
          this.handleReconnection(() => this.connectMarketDataStream(onData, onError));
        };

        this.eventSource.onopen = () => {
          console.log('Connected to Xano MCP real-time stream');
        };
      }
    } catch (error) {
      console.error('Failed to establish MCP session:', error);
      onError?.(error);
    }
  }

  // Connect to portfolio updates stream via MCP
  async connectPortfolioStream(userId: number, onData: (data: any) => void, onError?: (error: any) => void) {
    try {
      if (!this.sessionId) {
        await this.establishMCPSession();
      }

      if (this.sessionId) {
        // Send portfolio subscription request via MCP
        await this.sendMCPMessage({
          type: 'subscribe',
          stream: 'portfolio',
          userId: userId
        });

        // Use existing event source for all streams
        if (!this.eventSource) {
          this.eventSource = new EventSource(`${this.baseUrl}/messages?sessionId=${this.sessionId}`);
          this.setupEventHandlers(onData, onError);
        }
      }
    } catch (error) {
      console.error('Failed to connect to portfolio stream:', error);
      onError?.(error);
    }
  }

  // Connect to AI trading signals stream via MCP
  async connectAITradingStream(onData: (data: any) => void, onError?: (error: any) => void) {
    try {
      if (!this.sessionId) {
        await this.establishMCPSession();
      }

      if (this.sessionId) {
        await this.sendMCPMessage({
          type: 'subscribe',
          stream: 'ai_trading'
        });

        if (!this.eventSource) {
          this.eventSource = new EventSource(`${this.baseUrl}/messages?sessionId=${this.sessionId}`);
          this.setupEventHandlers(onData, onError);
        }
      }
    } catch (error) {
      console.error('Failed to connect to AI trading stream:', error);
      onError?.(error);
    }
  }

  // Handle reconnection logic
  private handleReconnection(reconnectFn: Function, onError?: (error: any) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.disconnect();
        reconnectFn();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      onError?.('Connection failed after maximum retry attempts');
    }
  }

  // Helper methods for MCP communication
  private async establishMCPSession(): Promise<void> {
    const sessionResponse = await fetch(`${this.baseUrl}/sse?stream=market_data`);
    const sessionText = await sessionResponse.text();
    
    const sessionMatch = sessionText.match(/sessionId=([a-f0-9-]+)/);
    if (sessionMatch) {
      this.sessionId = sessionMatch[1];
    }
  }

  private async sendMCPMessage(message: any): Promise<void> {
    if (!this.sessionId) return;

    const response = await fetch(`${this.baseUrl}/messages?sessionId=${this.sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_XANO_API_TOKEN}`,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`MCP message failed: ${response.statusText}`);
    }
  }

  private setupEventHandlers(onData: (data: any) => void, onError?: (error: any) => void): void {
    if (!this.eventSource) return;

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onData(data);
        this.reconnectAttempts = 0;
      } catch (error) {
        console.error('Error parsing MCP stream data:', error);
        onError?.(error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('MCP stream connection error:', error);
      this.handleReconnection(() => this.connectMarketDataStream(onData, onError));
    };

    this.eventSource.onopen = () => {
      console.log('Connected to Xano MCP real-time stream');
    };
  }

  // Disconnect from all streams
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Check if currently connected
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

export const xanoStreaming = new XanoStreamingService();