import { EventEmitter } from 'events';

interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'browser' | 'mobile' | 'hardware' | 'institutional';
  supported: boolean;
  deepLink?: string;
  downloadUrl?: string;
}

interface ConnectedWallet {
  address: string;
  provider: string;
  chainId: number;
  balance: number;
  network: string;
  isConnected: boolean;
  lastConnected: Date;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'crypto' | 'wallet' | 'payment_service';
  name: string;
  description: string;
  icon: string;
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  limits: {
    min: number;
    max: number;
    daily: number;
  };
  processingTime: string;
  supported: boolean;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fees: number;
  destinationAddress: string;
  timestamp: Date;
  confirmations?: number;
  txHash?: string;
}

export class WalletConnectorEngine extends EventEmitter {
  private connectedWallets: Map<string, ConnectedWallet> = new Map();
  private paymentTransactions: Map<string, PaymentTransaction> = new Map();
  private supportedWallets: WalletProvider[] = [];
  private paymentMethods: PaymentMethod[] = [];

  constructor() {
    super();
    this.initializeWalletProviders();
    this.initializePaymentMethods();
  }

  private initializeWalletProviders() {
    this.supportedWallets = [
      // Browser Extension Wallets
      {
        id: 'metamask',
        name: 'MetaMask',
        icon: '/icons/metamask.svg',
        description: 'Connect with MetaMask browser extension',
        category: 'browser',
        supported: true,
        downloadUrl: 'https://metamask.io/download/'
      },
      {
        id: 'coinbase_wallet',
        name: 'Coinbase Wallet',
        icon: '/icons/coinbase-wallet.svg',
        description: 'Connect with Coinbase Wallet',
        category: 'browser',
        supported: true,
        downloadUrl: 'https://www.coinbase.com/wallet'
      },
      {
        id: 'walletconnect',
        name: 'WalletConnect',
        icon: '/icons/walletconnect.svg',
        description: 'Connect with mobile wallet via QR code',
        category: 'mobile',
        supported: true
      },
      {
        id: 'rainbow',
        name: 'Rainbow',
        icon: '/icons/rainbow.svg',
        description: 'Connect with Rainbow wallet',
        category: 'mobile',
        supported: true,
        deepLink: 'rainbow://'
      },
      {
        id: 'trust_wallet',
        name: 'Trust Wallet',
        icon: '/icons/trust.svg',
        description: 'Connect with Trust Wallet',
        category: 'mobile',
        supported: true,
        deepLink: 'trust://',
        downloadUrl: 'https://trustwallet.com/'
      },
      {
        id: 'phantom',
        name: 'Phantom',
        icon: '/icons/phantom.svg',
        description: 'Connect with Phantom (Solana)',
        category: 'browser',
        supported: true,
        downloadUrl: 'https://phantom.app/'
      },
      {
        id: 'solflare',
        name: 'Solflare',
        icon: '/icons/solflare.svg',
        description: 'Connect with Solflare (Solana)',
        category: 'browser',
        supported: true,
        downloadUrl: 'https://solflare.com/'
      },
      {
        id: 'okx_wallet',
        name: 'OKX Wallet',
        icon: '/icons/okx.svg',
        description: 'Connect with OKX Wallet',
        category: 'browser',
        supported: true,
        downloadUrl: 'https://www.okx.com/web3'
      },
      {
        id: 'binance_wallet',
        name: 'Binance Wallet',
        icon: '/icons/binance.svg',
        description: 'Connect with Binance Chain Wallet',
        category: 'browser',
        supported: true,
        downloadUrl: 'https://www.binance.org/en/smartChain'
      },
      {
        id: 'exodus',
        name: 'Exodus',
        icon: '/icons/exodus.svg',
        description: 'Connect with Exodus wallet',
        category: 'browser',
        supported: true,
        downloadUrl: 'https://www.exodus.com/'
      },
      // Hardware Wallets
      {
        id: 'ledger',
        name: 'Ledger',
        icon: '/icons/ledger.svg',
        description: 'Connect with Ledger hardware wallet',
        category: 'hardware',
        supported: true,
        downloadUrl: 'https://www.ledger.com/'
      },
      {
        id: 'trezor',
        name: 'Trezor',
        icon: '/icons/trezor.svg',
        description: 'Connect with Trezor hardware wallet',
        category: 'hardware',
        supported: true,
        downloadUrl: 'https://trezor.io/'
      },
      // Mobile Wallets
      {
        id: 'imtoken',
        name: 'imToken',
        icon: '/icons/imtoken.svg',
        description: 'Connect with imToken mobile wallet',
        category: 'mobile',
        supported: true,
        deepLink: 'imtokenv2://'
      },
      {
        id: 'mathwallet',
        name: 'MathWallet',
        icon: '/icons/mathwallet.svg',
        description: 'Connect with MathWallet',
        category: 'mobile',
        supported: true,
        deepLink: 'mathwallet://'
      },
      {
        id: 'safepal',
        name: 'SafePal',
        icon: '/icons/safepal.svg',
        description: 'Connect with SafePal wallet',
        category: 'mobile',
        supported: true,
        deepLink: 'safepal://'
      },
      // Institutional Wallets
      {
        id: 'gnosis_safe',
        name: 'Gnosis Safe',
        icon: '/icons/gnosis.svg',
        description: 'Connect with Gnosis Safe multisig',
        category: 'institutional',
        supported: true,
        downloadUrl: 'https://gnosis-safe.io/'
      },
      {
        id: 'argent',
        name: 'Argent',
        icon: '/icons/argent.svg',
        description: 'Connect with Argent smart wallet',
        category: 'mobile',
        supported: true,
        deepLink: 'argent://',
        downloadUrl: 'https://www.argent.xyz/'
      },
      {
        id: 'frame',
        name: 'Frame',
        icon: '/icons/frame.svg',
        description: 'Connect with Frame desktop wallet',
        category: 'browser',
        supported: true,
        downloadUrl: 'https://frame.sh/'
      }
    ];
  }

  private initializePaymentMethods() {
    this.paymentMethods = [
      // Credit/Debit Cards
      {
        id: 'visa',
        type: 'card',
        name: 'Visa',
        description: 'Pay with Visa credit or debit card',
        icon: '/icons/visa.svg',
        fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
        limits: { min: 10, max: 10000, daily: 25000 },
        processingTime: 'Instant',
        supported: true
      },
      {
        id: 'mastercard',
        type: 'card',
        name: 'Mastercard',
        description: 'Pay with Mastercard credit or debit card',
        icon: '/icons/mastercard.svg',
        fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
        limits: { min: 10, max: 10000, daily: 25000 },
        processingTime: 'Instant',
        supported: true
      },
      {
        id: 'american_express',
        type: 'card',
        name: 'American Express',
        description: 'Pay with American Express card',
        icon: '/icons/amex.svg',
        fees: { percentage: 3.4, fixed: 0.30, currency: 'USD' },
        limits: { min: 10, max: 10000, daily: 25000 },
        processingTime: 'Instant',
        supported: true
      },
      // Bank Transfers
      {
        id: 'ach',
        type: 'bank',
        name: 'ACH Bank Transfer',
        description: 'Direct bank transfer (ACH)',
        icon: '/icons/bank.svg',
        fees: { percentage: 0.5, fixed: 0, currency: 'USD' },
        limits: { min: 100, max: 100000, daily: 500000 },
        processingTime: '1-3 business days',
        supported: true
      },
      {
        id: 'wire',
        type: 'bank',
        name: 'Wire Transfer',
        description: 'International wire transfer',
        icon: '/icons/wire.svg',
        fees: { percentage: 1.0, fixed: 25, currency: 'USD' },
        limits: { min: 1000, max: 1000000, daily: 5000000 },
        processingTime: '1-2 business days',
        supported: true
      },
      {
        id: 'sepa',
        type: 'bank',
        name: 'SEPA Transfer',
        description: 'European bank transfer (SEPA)',
        icon: '/icons/sepa.svg',
        fees: { percentage: 0.5, fixed: 1, currency: 'EUR' },
        limits: { min: 50, max: 50000, daily: 250000 },
        processingTime: 'Same day',
        supported: true
      },
      // Cryptocurrency
      {
        id: 'bitcoin',
        type: 'crypto',
        name: 'Bitcoin',
        description: 'Pay with Bitcoin (BTC)',
        icon: '/icons/bitcoin.svg',
        fees: { percentage: 0.5, fixed: 0, currency: 'BTC' },
        limits: { min: 0.001, max: 100, daily: 1000 },
        processingTime: '10-60 minutes',
        supported: true
      },
      {
        id: 'ethereum',
        type: 'crypto',
        name: 'Ethereum',
        description: 'Pay with Ethereum (ETH)',
        icon: '/icons/ethereum.svg',
        fees: { percentage: 0.5, fixed: 0, currency: 'ETH' },
        limits: { min: 0.01, max: 1000, daily: 10000 },
        processingTime: '2-15 minutes',
        supported: true
      },
      {
        id: 'usdc',
        type: 'crypto',
        name: 'USD Coin',
        description: 'Pay with USDC stablecoin',
        icon: '/icons/usdc.svg',
        fees: { percentage: 0.1, fixed: 0, currency: 'USDC' },
        limits: { min: 10, max: 1000000, daily: 10000000 },
        processingTime: '2-15 minutes',
        supported: true
      },
      {
        id: 'usdt',
        type: 'crypto',
        name: 'Tether',
        description: 'Pay with USDT stablecoin',
        icon: '/icons/usdt.svg',
        fees: { percentage: 0.1, fixed: 0, currency: 'USDT' },
        limits: { min: 10, max: 1000000, daily: 10000000 },
        processingTime: '2-15 minutes',
        supported: true
      },
      // Wallet Providers
      {
        id: 'coinbase_pay',
        type: 'wallet',
        name: 'Coinbase Pay',
        description: 'Pay directly from Coinbase account',
        icon: '/icons/coinbase.svg',
        fees: { percentage: 1.0, fixed: 0, currency: 'USD' },
        limits: { min: 1, max: 100000, daily: 500000 },
        processingTime: 'Instant',
        supported: true
      },
      {
        id: 'binance_pay',
        type: 'wallet',
        name: 'Binance Pay',
        description: 'Pay with Binance Pay',
        icon: '/icons/binance-pay.svg',
        fees: { percentage: 0, fixed: 0, currency: 'USD' },
        limits: { min: 1, max: 50000, daily: 200000 },
        processingTime: 'Instant',
        supported: true
      },
      {
        id: 'crypto_com_pay',
        type: 'wallet',
        name: 'Crypto.com Pay',
        description: 'Pay with Crypto.com Pay',
        icon: '/icons/crypto-com.svg',
        fees: { percentage: 0.5, fixed: 0, currency: 'USD' },
        limits: { min: 1, max: 25000, daily: 100000 },
        processingTime: 'Instant',
        supported: true
      },
      // Payment Services
      {
        id: 'paypal',
        type: 'payment_service',
        name: 'PayPal',
        description: 'Pay with PayPal account',
        icon: '/icons/paypal.svg',
        fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
        limits: { min: 1, max: 10000, daily: 60000 },
        processingTime: 'Instant',
        supported: true
      },
      {
        id: 'apple_pay',
        type: 'payment_service',
        name: 'Apple Pay',
        description: 'Pay with Apple Pay',
        icon: '/icons/apple-pay.svg',
        fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
        limits: { min: 1, max: 10000, daily: 50000 },
        processingTime: 'Instant',
        supported: true
      },
      {
        id: 'google_pay',
        type: 'payment_service',
        name: 'Google Pay',
        description: 'Pay with Google Pay',
        icon: '/icons/google-pay.svg',
        fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
        limits: { min: 1, max: 10000, daily: 50000 },
        processingTime: 'Instant',
        supported: true
      },
      {
        id: 'stripe',
        type: 'payment_service',
        name: 'Stripe',
        description: 'Pay via Stripe payment processor',
        icon: '/icons/stripe.svg',
        fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
        limits: { min: 0.50, max: 999999, daily: 999999 },
        processingTime: 'Instant',
        supported: true
      }
    ];
  }

  async connectWallet(walletId: string): Promise<{
    success: boolean;
    wallet?: ConnectedWallet;
    error?: string;
  }> {
    const provider = this.supportedWallets.find(w => w.id === walletId);
    if (!provider) {
      return { success: false, error: 'Wallet provider not supported' };
    }

    if (!provider.supported) {
      return { success: false, error: 'Wallet provider temporarily unavailable' };
    }

    // Simulate wallet connection based on provider type
    try {
      const wallet = await this.simulateWalletConnection(provider);
      this.connectedWallets.set(wallet.address, wallet);
      
      this.emit('walletConnected', wallet);
      
      return { success: true, wallet };
    } catch (error) {
      return { success: false, error: 'Failed to connect wallet' };
    }
  }

  private async simulateWalletConnection(provider: WalletProvider): Promise<ConnectedWallet> {
    // Generate realistic wallet address based on provider
    let address: string;
    let chainId: number;
    let network: string;

    if (provider.id === 'phantom' || provider.id === 'solflare') {
      // Solana addresses
      address = this.generateSolanaAddress();
      chainId = 101; // Solana mainnet
      network = 'solana';
    } else {
      // Ethereum-compatible addresses
      address = this.generateEthereumAddress();
      chainId = 1; // Ethereum mainnet
      network = 'ethereum';
    }

    const balance = 1000 + Math.random() * 50000; // Random balance between $1k-$51k

    return {
      address,
      provider: provider.id,
      chainId,
      balance,
      network,
      isConnected: true,
      lastConnected: new Date()
    };
  }

  private generateEthereumAddress(): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  private generateSolanaAddress(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let address = '';
    for (let i = 0; i < 44; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  async disconnectWallet(address: string): Promise<boolean> {
    const wallet = this.connectedWallets.get(address);
    if (wallet) {
      wallet.isConnected = false;
      this.connectedWallets.delete(address);
      this.emit('walletDisconnected', { address, provider: wallet.provider });
      return true;
    }
    return false;
  }

  async initiatePayment(
    amount: number,
    currency: string,
    paymentMethodId: string,
    destinationAddress: string
  ): Promise<{
    success: boolean;
    transaction?: PaymentTransaction;
    error?: string;
  }> {
    const paymentMethod = this.paymentMethods.find(pm => pm.id === paymentMethodId);
    if (!paymentMethod) {
      return { success: false, error: 'Payment method not supported' };
    }

    if (!paymentMethod.supported) {
      return { success: false, error: 'Payment method temporarily unavailable' };
    }

    // Validate amount limits
    if (amount < paymentMethod.limits.min || amount > paymentMethod.limits.max) {
      return { 
        success: false, 
        error: `Amount must be between ${paymentMethod.limits.min} and ${paymentMethod.limits.max}` 
      };
    }

    // Calculate fees
    const fees = (amount * paymentMethod.fees.percentage / 100) + paymentMethod.fees.fixed;

    const transaction: PaymentTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      paymentMethod: paymentMethodId,
      status: 'pending',
      fees,
      destinationAddress,
      timestamp: new Date()
    };

    this.paymentTransactions.set(transaction.id, transaction);

    // Simulate payment processing
    setTimeout(() => {
      this.processPayment(transaction.id);
    }, 2000 + Math.random() * 5000);

    this.emit('paymentInitiated', transaction);

    return { success: true, transaction };
  }

  private async processPayment(transactionId: string): Promise<void> {
    const transaction = this.paymentTransactions.get(transactionId);
    if (!transaction) return;

    // Simulate payment processing stages
    transaction.status = 'processing';
    this.emit('paymentUpdated', transaction);

    // Random processing time based on payment method
    const paymentMethod = this.paymentMethods.find(pm => pm.id === transaction.paymentMethod);
    const processingDelay = this.getProcessingDelay(paymentMethod?.type || 'card');

    setTimeout(() => {
      // 95% success rate simulation
      const success = Math.random() > 0.05;
      
      if (success) {
        transaction.status = 'completed';
        transaction.confirmations = Math.floor(Math.random() * 12) + 1;
        transaction.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      } else {
        transaction.status = 'failed';
      }

      this.emit('paymentCompleted', transaction);
    }, processingDelay);
  }

  private getProcessingDelay(paymentType: string): number {
    switch (paymentType) {
      case 'card':
      case 'payment_service':
      case 'wallet':
        return 1000 + Math.random() * 3000; // 1-4 seconds
      case 'crypto':
        return 10000 + Math.random() * 30000; // 10-40 seconds
      case 'bank':
        return 5000 + Math.random() * 10000; // 5-15 seconds
      default:
        return 2000;
    }
  }

  async getConnectedWallets(): Promise<ConnectedWallet[]> {
    return Array.from(this.connectedWallets.values()).filter(w => w.isConnected);
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethods.filter(pm => pm.supported);
  }

  async getWalletProviders(): Promise<WalletProvider[]> {
    return this.supportedWallets;
  }

  async getPaymentHistory(): Promise<PaymentTransaction[]> {
    return Array.from(this.paymentTransactions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 50); // Return last 50 transactions
  }

  async getTransactionStatus(transactionId: string): Promise<PaymentTransaction | undefined> {
    return this.paymentTransactions.get(transactionId);
  }

  async switchNetwork(walletAddress: string, chainId: number): Promise<boolean> {
    const wallet = this.connectedWallets.get(walletAddress);
    if (wallet && wallet.isConnected) {
      wallet.chainId = chainId;
      
      // Update network name based on chain ID
      const networkMap: Record<number, string> = {
        1: 'ethereum',
        56: 'binance-smart-chain',
        137: 'polygon',
        43114: 'avalanche',
        250: 'fantom',
        42161: 'arbitrum',
        10: 'optimism',
        101: 'solana'
      };
      
      wallet.network = networkMap[chainId] || 'unknown';
      
      this.emit('networkSwitched', { address: walletAddress, chainId, network: wallet.network });
      return true;
    }
    return false;
  }

  async estimateGasFees(
    fromAddress: string,
    toAddress: string,
    amount: number,
    token: string
  ): Promise<{
    slow: number;
    standard: number;
    fast: number;
    instant: number;
  }> {
    // Simulate gas fee estimation
    const baseGas = 21000;
    const gasPrice = 20 + Math.random() * 100; // 20-120 gwei
    
    return {
      slow: baseGas * gasPrice * 0.8,
      standard: baseGas * gasPrice,
      fast: baseGas * gasPrice * 1.2,
      instant: baseGas * gasPrice * 1.5
    };
  }
}

export const walletConnector = new WalletConnectorEngine();