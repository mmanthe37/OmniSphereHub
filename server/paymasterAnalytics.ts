interface PaymasterTransaction {
  createdAt: string;
  chainId: number;
  organizationId: string;
  projectId: string;
  userOpHash: string;
  transactionHash: string;
  sender: string;
  paymaster: string;
  blockNumber: number;
  gasCost: number;
  gasUsed: number;
  gasCostUSD: number;
  tokenAddress: string;
  tokenAmount: number;
  receiverAddress: string;
}

interface PaymasterMetrics {
  totalTransactions: number;
  totalGasSponsored: number;
  totalCostUSD: number;
  uniqueUsers: number;
  averageGasPerTx: number;
  last24HoursTxs: number;
  topSpenders: Array<{
    address: string;
    txCount: number;
    totalGasUsed: number;
    totalCostUSD: number;
  }>;
}

export class PaymasterAnalytics {
  private transactions: PaymasterTransaction[] = [];

  constructor() {
    // Initialize with authentic transaction data
    this.loadAuthenticTransactionData();
  }

  private loadAuthenticTransactionData() {
    // Real transaction data from your paymaster CSV
    this.transactions = [
      {
        createdAt: "2025-06-05T05:44:07Z",
        chainId: 8453,
        organizationId: "6d1bbddf-3620-4c26-b013-6a27b4c36fa9",
        projectId: "2882580f-df7e-4375-a8e2-319596b899aa",
        userOpHash: "0x4c1ee15b5d34df78f536f8c8a2ddaea500a727deefcf2452efa667be6a553dda",
        transactionHash: "0x080b1eb5789c2aa6382ec26a431e73b88c352434c4cdb730962703a782dbe539",
        sender: "0x2D45014917C4BCE08b6Fb2b3A53960692b5B744b",
        paymaster: "0x2FAEB0760D4230Ef2aC21496Bb4F0b47D634FD4c",
        blockNumber: 31156450,
        gasCost: 571,
        gasUsed: 219306,
        gasCostUSD: 0.001502931955,
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenAmount: 0,
        receiverAddress: ""
      },
      {
        createdAt: "2025-06-05T05:16:33Z",
        chainId: 8453,
        organizationId: "6d1bbddf-3620-4c26-b013-6a27b4c36fa9",
        projectId: "2882580f-df7e-4375-a8e2-319596b899aa",
        userOpHash: "0x6abd48f60ee2ce8b22a69064174b194de8d51084ba182ea460c097676f015c3c",
        transactionHash: "0x687338e99b25affc7cd109dd9a5be62275d85a83dedf53aa6d2625d199e20981",
        sender: "0xc0D34dE5117CBAbE6Ee0070B1Fa3eEB33266AC51",
        paymaster: "0x2FAEB0760D4230Ef2aC21496Bb4F0b47D634FD4c",
        blockNumber: 31155623,
        gasCost: 702,
        gasUsed: 294282,
        gasCostUSD: 0.00184362399,
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenAmount: 0,
        receiverAddress: ""
      }
    ];
  }

  getPaymasterMetrics(): PaymasterMetrics {
    const uniqueSenders = new Set(this.transactions.map(tx => tx.sender.toLowerCase()));
    const totalGasUsed = this.transactions.reduce((sum, tx) => sum + tx.gasUsed, 0);
    const totalCostUSD = this.transactions.reduce((sum, tx) => sum + tx.gasCostUSD, 0);
    
    // Calculate last 24 hours transactions
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last24HoursTxs = this.transactions.filter(tx => 
      new Date(tx.createdAt) > yesterday
    ).length;

    // Calculate top spenders
    const spenderStats = new Map<string, {
      txCount: number;
      totalGasUsed: number;
      totalCostUSD: number;
    }>();

    this.transactions.forEach(tx => {
      const address = tx.sender.toLowerCase();
      const existing = spenderStats.get(address) || {
        txCount: 0,
        totalGasUsed: 0,
        totalCostUSD: 0
      };
      
      existing.txCount++;
      existing.totalGasUsed += tx.gasUsed;
      existing.totalCostUSD += tx.gasCostUSD;
      
      spenderStats.set(address, existing);
    });

    const topSpenders = Array.from(spenderStats.entries())
      .map(([address, stats]) => ({
        address,
        ...stats
      }))
      .sort((a, b) => b.totalCostUSD - a.totalCostUSD)
      .slice(0, 10);

    return {
      totalTransactions: this.transactions.length,
      totalGasSponsored: totalGasUsed,
      totalCostUSD,
      uniqueUsers: uniqueSenders.size,
      averageGasPerTx: totalGasUsed / this.transactions.length,
      last24HoursTxs,
      topSpenders
    };
  }

  getRecentTransactions(limit: number = 10): PaymasterTransaction[] {
    return this.transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  getTransactionsByWallet(walletAddress: string): PaymasterTransaction[] {
    return this.transactions.filter(tx => 
      tx.sender.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  addTransaction(transaction: PaymasterTransaction) {
    this.transactions.push(transaction);
  }

  getGasSavingsForWallet(walletAddress: string): {
    totalSavingsUSD: number;
    transactionCount: number;
    avgSavingsPerTx: number;
  } {
    const walletTxs = this.getTransactionsByWallet(walletAddress);
    const totalSavingsUSD = walletTxs.reduce((sum, tx) => sum + tx.gasCostUSD, 0);
    
    return {
      totalSavingsUSD,
      transactionCount: walletTxs.length,
      avgSavingsPerTx: walletTxs.length > 0 ? totalSavingsUSD / walletTxs.length : 0
    };
  }

  getDailyStats(days: number = 7): Array<{
    date: string;
    transactions: number;
    gasUsed: number;
    costUSD: number;
  }> {
    const now = new Date();
    const stats: Array<{
      date: string;
      transactions: number;
      gasUsed: number;
      costUSD: number;
    }> = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayTxs = this.transactions.filter(tx => {
        const txDate = new Date(tx.createdAt);
        return txDate >= dayStart && txDate <= dayEnd;
      });

      stats.unshift({
        date: dayStart.toISOString().split('T')[0],
        transactions: dayTxs.length,
        gasUsed: dayTxs.reduce((sum, tx) => sum + tx.gasUsed, 0),
        costUSD: dayTxs.reduce((sum, tx) => sum + tx.gasCostUSD, 0)
      });
    }

    return stats;
  }
}

export const paymasterAnalytics = new PaymasterAnalytics();