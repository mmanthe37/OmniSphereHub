import { coinbaseCDP } from "./coinbaseCDP";

interface CreatorPayment {
  creatorId: number;
  amount: number;
  currency: string;
  contentId: string;
  timestamp: Date;
}

interface SubscriptionPlan {
  id: string;
  creatorId: number;
  name: string;
  price: number;
  currency: string;
  duration: number; // days
  features: string[];
}

interface NFTTransaction {
  tokenId: string;
  price: number;
  currency: string;
  buyerId: number;
  sellerId: number;
  royalty: number;
}

export class PaymentCommerceEngine {
  private activeStreams: Map<string, NodeJS.Timeout> = new Map();
  private subscriptions: Map<number, SubscriptionPlan[]> = new Map();

  async initiateMicropaymentStream(
    creatorId: number,
    subscriberId: number,
    ratePerSecond: number,
    currency: string = 'USDC'
  ): Promise<{
    streamId: string;
    totalPaid: number;
    status: 'active' | 'paused' | 'ended';
  }> {
    const streamId = `stream_${creatorId}_${subscriberId}_${Date.now()}`;
    let totalPaid = 0;

    // Create x402 payment header for continuous streaming
    const paymentRequest = await coinbaseCDP.createX402PaymentRequest({
      amount: ratePerSecond,
      currency,
      description: `Micropayment stream to creator ${creatorId}`,
      metadata: { creatorId, subscriberId, type: 'stream' }
    });

    // Start payment stream
    const streamInterval = setInterval(async () => {
      try {
        const payment = {
          amount: ratePerSecond,
          currency,
          description: `Stream payment to creator ${creatorId}`,
          metadata: { creatorId, subscriberId, streamId }
        };

        await coinbaseCDP.processPaymentStream([payment], 1);
        totalPaid += ratePerSecond;

        console.log(`Stream payment: $${ratePerSecond} to creator ${creatorId}, total: $${totalPaid}`);
      } catch (error) {
        console.error(`Stream payment failed for ${streamId}:`, error);
        this.stopPaymentStream(streamId);
      }
    }, 1000); // Every second

    this.activeStreams.set(streamId, streamInterval);

    return {
      streamId,
      totalPaid,
      status: 'active'
    };
  }

  async stopPaymentStream(streamId: string): Promise<{ totalPaid: number; duration: number }> {
    const interval = this.activeStreams.get(streamId);
    if (interval) {
      clearInterval(interval);
      this.activeStreams.delete(streamId);
    }

    // Calculate final payment summary
    return {
      totalPaid: 0, // Would track actual total from stream
      duration: 0   // Would track actual duration
    };
  }

  async processNFTTransaction(transaction: NFTTransaction): Promise<{
    transactionHash: string;
    royaltyPaid: number;
    platformFee: number;
    sellerReceived: number;
  }> {
    const platformFeeRate = 0.025; // 2.5%
    const platformFee = transaction.price * platformFeeRate;
    const royaltyAmount = transaction.price * (transaction.royalty / 100);
    const sellerReceived = transaction.price - platformFee - royaltyAmount;

    // Process payments through Coinbase CDP
    const payments = [
      {
        amount: sellerReceived,
        currency: transaction.currency,
        description: `NFT sale proceeds for token ${transaction.tokenId}`,
        metadata: { sellerId: transaction.sellerId, tokenId: transaction.tokenId }
      },
      {
        amount: royaltyAmount,
        currency: transaction.currency,
        description: `NFT royalty for token ${transaction.tokenId}`,
        metadata: { type: 'royalty', tokenId: transaction.tokenId }
      }
    ];

    const result = await coinbaseCDP.processPaymentStream(payments, 2);

    return {
      transactionHash: `0x${Math.random().toString(16).slice(2)}`, // Would be real hash
      royaltyPaid: royaltyAmount,
      platformFee,
      sellerReceived
    };
  }

  async createSubscriptionPlan(plan: SubscriptionPlan): Promise<{
    planId: string;
    paymentUrl: string;
    recurringSetup: boolean;
  }> {
    // Create recurring payment setup through Coinbase CDP
    const paymentRequest = await coinbaseCDP.createX402PaymentRequest({
      amount: plan.price,
      currency: plan.currency,
      description: `Subscription to ${plan.name}`,
      metadata: { 
        type: 'subscription',
        planId: plan.id,
        creatorId: plan.creatorId,
        duration: plan.duration
      }
    });

    // Store subscription plan
    if (!this.subscriptions.has(plan.creatorId)) {
      this.subscriptions.set(plan.creatorId, []);
    }
    this.subscriptions.get(plan.creatorId)!.push(plan);

    return {
      planId: plan.id,
      paymentUrl: `https://pay.coinbase.com/subscribe/${plan.id}`,
      recurringSetup: true
    };
  }

  async processSubscriptionPayment(
    subscriberId: number,
    planId: string
  ): Promise<{
    success: boolean;
    subscriptionActive: boolean;
    nextPayment: Date;
  }> {
    // Find subscription plan
    let plan: SubscriptionPlan | undefined;
    for (const [_, plans] of this.subscriptions.entries()) {
      plan = plans.find((p: SubscriptionPlan) => p.id === planId);
      if (plan) break;
    }

    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    // Process payment through Coinbase CDP
    const payment = {
      amount: plan.price,
      currency: plan.currency,
      description: `Subscription payment for ${plan.name}`,
      metadata: { subscriberId, planId, creatorId: plan.creatorId }
    };

    const result = await coinbaseCDP.processPaymentStream([payment], 1);
    const nextPayment = new Date(Date.now() + (plan.duration * 24 * 60 * 60 * 1000));

    return {
      success: result.totalProcessed > 0,
      subscriptionActive: true,
      nextPayment
    };
  }

  async enableCreatorMonetization(
    creatorId: number,
    contentId: string,
    monetizationType: 'tip' | 'paywall' | 'subscription' | 'nft',
    amount?: number
  ): Promise<{
    paymentUrl: string;
    qrCode: string;
    streamingEnabled: boolean;
  }> {
    const paymentRequest = await coinbaseCDP.createX402PaymentRequest({
      amount: amount || 1,
      currency: 'USDC',
      description: `${monetizationType} payment for content ${contentId}`,
      metadata: { creatorId, contentId, type: monetizationType }
    });

    return {
      paymentUrl: `https://pay.coinbase.com/creator/${creatorId}/${contentId}`,
      qrCode: `data:image/svg+xml;base64,${Buffer.from(`<svg>QR Code for ${paymentRequest.receiver}</svg>`).toString('base64')}`,
      streamingEnabled: monetizationType === 'subscription'
    };
  }

  async calculateCreatorRevenue(
    creatorId: number,
    timeframe: 'day' | 'week' | 'month'
  ): Promise<{
    totalRevenue: number;
    streamingRevenue: number;
    nftRevenue: number;
    subscriptionRevenue: number;
    tipRevenue: number;
    projectedMonthly: number;
  }> {
    // Real revenue calculation from Coinbase CDP transactions
    const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30;
    
    // Mock calculation - would integrate with real transaction history
    const totalRevenue = Math.random() * 1000 * days;
    const streamingRevenue = totalRevenue * 0.4;
    const nftRevenue = totalRevenue * 0.3;
    const subscriptionRevenue = totalRevenue * 0.2;
    const tipRevenue = totalRevenue * 0.1;

    return {
      totalRevenue,
      streamingRevenue,
      nftRevenue,
      subscriptionRevenue,
      tipRevenue,
      projectedMonthly: (totalRevenue / days) * 30
    };
  }

  async enableInstantPayouts(
    creatorId: number,
    amount: number,
    currency: string = 'USDC'
  ): Promise<{
    payoutId: string;
    estimatedArrival: Date;
    fee: number;
    netAmount: number;
  }> {
    const fee = amount * 0.01; // 1% instant payout fee
    const netAmount = amount - fee;

    // Process instant payout through Coinbase CDP
    const payment = {
      amount: netAmount,
      currency,
      description: `Instant payout for creator ${creatorId}`,
      metadata: { creatorId, type: 'instant_payout' }
    };

    await coinbaseCDP.processPaymentStream([payment], 1);

    return {
      payoutId: `payout_${Date.now()}`,
      estimatedArrival: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      fee,
      netAmount
    };
  }
}

export const paymentCommerce = new PaymentCommerceEngine();