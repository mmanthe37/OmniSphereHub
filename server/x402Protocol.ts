import { EventEmitter } from 'events';

interface X402PaymentHeader {
  protocol: 'x402';
  amount: number;
  currency: string;
  receiver: string;
  memo?: string;
  timestamp: number;
}

interface X402Transaction {
  id: string;
  paymentHeader: X402PaymentHeader;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  gasUsed?: number;
  fee: number;
}

interface StreamingPayment {
  id: string;
  rate: number; // per second
  recipient: string;
  totalPaid: number;
  startTime: Date;
  active: boolean;
}

export class X402ProtocolEngine extends EventEmitter {
  private transactions: Map<string, X402Transaction> = new Map();
  private activeStreams: Map<string, StreamingPayment> = new Map();
  private aiAgents: Map<string, { balance: number; transactions: string[] }> = new Map();

  constructor() {
    super();
    this.initializeAIAgents();
  }

  private initializeAIAgents() {
    // Initialize AI trading agents with balances
    this.aiAgents.set('trading-bot-alpha', { balance: 10000, transactions: [] });
    this.aiAgents.set('arbitrage-scanner', { balance: 5000, transactions: [] });
    this.aiAgents.set('yield-optimizer', { balance: 15000, transactions: [] });
  }

  async createX402Payment(
    amount: number,
    currency: string,
    receiver: string,
    memo?: string
  ): Promise<X402Transaction> {
    const paymentHeader: X402PaymentHeader = {
      protocol: 'x402',
      amount,
      currency,
      receiver,
      memo,
      timestamp: Date.now()
    };

    const transaction: X402Transaction = {
      id: `x402_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentHeader,
      status: 'pending',
      fee: amount * 0.001 // 0.1% fee
    };

    this.transactions.set(transaction.id, transaction);

    // Simulate blockchain confirmation
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.hash = `0x${Math.random().toString(16).substr(2, 64)}`;
      transaction.gasUsed = Math.floor(Math.random() * 50000) + 21000;
      this.emit('paymentConfirmed', transaction);
    }, 2000 + Math.random() * 3000);

    return transaction;
  }

  async startMicropaymentStream(
    rate: number,
    recipient: string
  ): Promise<{ streamId: string; estimatedCost: number }> {
    const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const stream: StreamingPayment = {
      id: streamId,
      rate,
      recipient,
      totalPaid: 0,
      startTime: new Date(),
      active: true
    };

    this.activeStreams.set(streamId, stream);

    // Process payments every second
    const interval = setInterval(async () => {
      if (!stream.active) {
        clearInterval(interval);
        return;
      }

      stream.totalPaid += rate;
      
      // Create micro-transaction
      await this.createX402Payment(
        rate,
        'USDC',
        recipient,
        `Stream payment ${streamId}`
      );

      this.emit('streamPayment', {
        streamId,
        amount: rate,
        totalPaid: stream.totalPaid
      });
    }, 1000);

    return {
      streamId,
      estimatedCost: rate * 3600 // Hourly cost estimate
    };
  }

  async stopMicropaymentStream(streamId: string): Promise<{
    totalPaid: number;
    duration: number;
  }> {
    const stream = this.activeStreams.get(streamId);
    if (!stream) {
      throw new Error('Stream not found');
    }

    stream.active = false;
    const duration = Date.now() - stream.startTime.getTime();

    this.emit('streamStopped', {
      streamId,
      totalPaid: stream.totalPaid,
      duration
    });

    return {
      totalPaid: stream.totalPaid,
      duration: Math.floor(duration / 1000)
    };
  }

  async enableAIAgentAutonomousPayments(
    agentId: string,
    maxAmount: number
  ): Promise<{
    agentId: string;
    authorizedAmount: number;
    transactionLimit: number;
  }> {
    const agent = this.aiAgents.get(agentId);
    if (!agent) {
      throw new Error('AI agent not found');
    }

    // AI agent can now make autonomous payments up to maxAmount
    const transactionLimit = Math.min(maxAmount, agent.balance);

    this.emit('agentAuthorized', {
      agentId,
      authorizedAmount: transactionLimit
    });

    return {
      agentId,
      authorizedAmount: transactionLimit,
      transactionLimit: Math.floor(transactionLimit / 10) // Max per transaction
    };
  }

  async processAIAgentPayment(
    agentId: string,
    amount: number,
    purpose: string
  ): Promise<X402Transaction> {
    const agent = this.aiAgents.get(agentId);
    if (!agent) {
      throw new Error('AI agent not found');
    }

    if (amount > agent.balance) {
      throw new Error('Insufficient agent balance');
    }

    const transaction = await this.createX402Payment(
      amount,
      'USDC',
      'ai-trading-pool',
      `AI Agent ${agentId}: ${purpose}`
    );

    agent.balance -= amount;
    agent.transactions.push(transaction.id);

    this.emit('agentPayment', {
      agentId,
      transactionId: transaction.id,
      amount,
      purpose,
      remainingBalance: agent.balance
    });

    return transaction;
  }

  async getPaymentDiscovery(): Promise<Array<{
    service: string;
    endpoint: string;
    supportedCurrencies: string[];
    fees: Record<string, number>;
  }>> {
    // Discover X402-compatible payment services
    return [
      {
        service: 'OmniSphere DeFi Hub',
        endpoint: '/api/x402/payments',
        supportedCurrencies: ['USDC', 'ETH', 'BTC'],
        fees: { USDC: 0.001, ETH: 0.002, BTC: 0.0001 }
      },
      {
        service: 'Cross-Chain Bridge',
        endpoint: '/api/x402/bridge',
        supportedCurrencies: ['USDC', 'ETH', 'MATIC'],
        fees: { USDC: 0.005, ETH: 0.01, MATIC: 0.001 }
      },
      {
        service: 'Institutional Trading',
        endpoint: '/api/x402/institutional',
        supportedCurrencies: ['USDC', 'ETH', 'BTC', 'SOL'],
        fees: { USDC: 0.0005, ETH: 0.001, BTC: 0.00005, SOL: 0.002 }
      }
    ];
  }

  getTransaction(id: string): X402Transaction | undefined {
    return this.transactions.get(id);
  }

  getActiveStreams(): StreamingPayment[] {
    return Array.from(this.activeStreams.values()).filter(s => s.active);
  }

  getAIAgentStatus(agentId: string): { balance: number; transactions: string[] } | undefined {
    return this.aiAgents.get(agentId);
  }

  getAllTransactions(): X402Transaction[] {
    return Array.from(this.transactions.values());
  }
}

export const x402Protocol = new X402ProtocolEngine();