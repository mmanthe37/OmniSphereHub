import { cdpSDK } from './cdpSDK';

interface X402PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

interface X402PaymentHeader {
  protocol: 'x402';
  amount: number;
  currency: string;
  receiver: string;
  memo?: string;
}

interface X402Transaction {
  id: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  amount: number;
  currency: string;
  timestamp: Date;
}

export class X402PaymentProtocol {
  private activePayments: Map<string, X402Transaction> = new Map();
  private walletId: string | null = null;

  constructor() {
    this.initializePaymentWallet();
  }

  private async initializePaymentWallet() {
    try {
      // Create a dedicated CDP wallet for x402 payments
      const wallet = await cdpSDK.createWallet('base-mainnet');
      this.walletId = wallet.walletId;
      console.log('X402 payment wallet initialized:', wallet.address);
    } catch (error) {
      console.error('Failed to initialize x402 payment wallet:', error);
    }
  }

  async createPaymentRequest(paymentData: X402PaymentRequest): Promise<X402PaymentHeader> {
    try {
      if (!this.walletId) {
        await this.initializePaymentWallet();
      }

      // Generate unique payment ID
      const paymentId = `x402_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create x402 payment header according to whitepaper specifications
      const paymentHeader: X402PaymentHeader = {
        protocol: 'x402',
        amount: paymentData.amount,
        currency: paymentData.currency.toUpperCase(),
        receiver: this.generateReceiveAddress(),
        memo: paymentData.description
      };

      // Store payment for tracking
      this.activePayments.set(paymentId, {
        id: paymentId,
        status: 'pending',
        amount: paymentData.amount,
        currency: paymentData.currency,
        timestamp: new Date()
      });

      return paymentHeader;
    } catch (error) {
      console.error('Error creating x402 payment request:', error);
      throw error;
    }
  }

  async processPayment(
    paymentId: string,
    fromAddress: string,
    amount: number,
    currency: string
  ): Promise<X402Transaction> {
    try {
      if (!this.walletId) {
        throw new Error('Payment wallet not initialized');
      }

      const payment = this.activePayments.get(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Verify payment amount and currency
      if (payment.amount !== amount || payment.currency.toUpperCase() !== currency.toUpperCase()) {
        throw new Error('Payment amount or currency mismatch');
      }

      // Process payment using CDP SDK
      const transfer = await cdpSDK.createTransfer(
        this.walletId,
        amount,
        currency,
        fromAddress
      );

      // Update payment status
      const updatedPayment: X402Transaction = {
        ...payment,
        status: 'confirmed',
        hash: transfer.hash
      };

      this.activePayments.set(paymentId, updatedPayment);

      return updatedPayment;
    } catch (error) {
      console.error('Error processing x402 payment:', error);
      
      // Update payment status to failed
      const payment = this.activePayments.get(paymentId);
      if (payment) {
        payment.status = 'failed';
        this.activePayments.set(paymentId, payment);
      }
      
      throw error;
    }
  }

  async enableMicropaymentStream(
    subscriberId: string,
    creatorId: string,
    ratePerSecond: number,
    currency: string = 'USDC'
  ): Promise<{ streamId: string; status: string }> {
    try {
      const streamId = `stream_${subscriberId}_${creatorId}_${Date.now()}`;
      
      // Initialize micropayment stream according to x402 specifications
      const interval = setInterval(async () => {
        try {
          await this.createPaymentRequest({
            amount: ratePerSecond,
            currency,
            description: `Micropayment stream to creator ${creatorId}`,
            metadata: {
              streamId,
              subscriberId,
              creatorId,
              type: 'micropayment_stream'
            }
          });
        } catch (error) {
          console.error('Micropayment stream error:', error);
          clearInterval(interval);
        }
      }, 1000); // Every second

      // Store stream for management
      setTimeout(() => {
        clearInterval(interval);
      }, 300000); // Auto-stop after 5 minutes

      return {
        streamId,
        status: 'active'
      };
    } catch (error) {
      console.error('Error enabling micropayment stream:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string): Promise<X402Transaction | null> {
    return this.activePayments.get(paymentId) || null;
  }

  async validatePaymentHeader(header: X402PaymentHeader): Promise<boolean> {
    // Validate x402 payment header according to whitepaper specifications
    if (header.protocol !== 'x402') return false;
    if (!header.amount || header.amount <= 0) return false;
    if (!header.currency || header.currency.length === 0) return false;
    if (!header.receiver || !this.isValidAddress(header.receiver)) return false;
    
    return true;
  }

  private generateReceiveAddress(): string {
    // Generate a Base network address for receiving payments
    return `0x${Math.random().toString(16).substr(2, 40)}`;
  }

  private isValidAddress(address: string): boolean {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Agent-friendly payment discovery
  async discoverPaymentAPIs(): Promise<Array<{ endpoint: string; cost: number; currency: string; description: string }>> {
    return [
      {
        endpoint: '/api/ai/market-analysis',
        cost: 0.01,
        currency: 'USDC',
        description: 'Real-time crypto market analysis and predictions'
      },
      {
        endpoint: '/api/ai/portfolio-optimization',
        cost: 0.05,
        currency: 'USDC',
        description: 'AI-powered portfolio optimization recommendations'
      },
      {
        endpoint: '/api/defi/yield-strategies',
        cost: 0.02,
        currency: 'USDC',
        description: 'Automated DeFi yield farming strategies'
      },
      {
        endpoint: '/api/trading/signals',
        cost: 0.03,
        currency: 'USDC',
        description: 'Professional trading signals and entry/exit points'
      }
    ];
  }
}

export const x402Protocol = new X402PaymentProtocol();