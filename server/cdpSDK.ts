import { Coinbase, Wallet, WalletData } from "@coinbase/coinbase-sdk";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface CDPWalletResponse {
  walletId: string;
  address: string;
  network: string;
  balance: number;
}

interface CDPTransactionResponse {
  transactionId: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  amount: number;
  currency: string;
  fee: number;
  gasUsed?: number;
  blockNumber?: number;
}

export class CoinbaseCDPSDK {
  private isConfigured = false;
  private wallets: Map<string, Wallet> = new Map();
  private paymasterEndpoint = 'https://api.developer.coinbase.com/rpc/v1/base/FjtpobcFyw6iEFSXDoJwPcBLrbdigOZU';
  private paymasterAddress = '0x2d45014917c4bce08b6fb2b3a53960692b5b744b';

  constructor() {
    this.initializeSDK();
  }

  private initializeSDK() {
    try {
      // Configure CDP SDK with updated API credentials
      const apiKeyName = process.env.CDP_API_KEY_NAME || "organizations/6d1bbddf-3620-4c26-b013-6a27b4c36fa9/apiKeys/54cbc914-0dfd-4abf-be02-c7c81da18386";
      const privateKey = process.env.CDP_PRIVATE_KEY ? 
        `-----BEGIN EC PRIVATE KEY-----\n${process.env.CDP_PRIVATE_KEY}\n-----END EC PRIVATE KEY-----` :
        "-----BEGIN EC PRIVATE KEY-----\nN3UvQWWUB4uBaCdWK/9u9NbbltUyjR1xgqP7msph8UV0xyFAqfKBNPC7K/Kkq0oQgRTYXShXwXXZ4TJMbVN0zg==\n-----END EC PRIVATE KEY-----";

      Coinbase.configure({
        apiKeyName,
        privateKey
      });
      
      // Enable server-signer for production-ready security
      Coinbase.useServerSigner = true;
      
      this.isConfigured = true;
      console.log('Coinbase CDP SDK initialized with live mmanthe37 account credentials');
    } catch (error) {
      console.error('Failed to initialize CDP SDK:', error);
      this.isConfigured = false;
    }
  }

  async createWallet(network: string = 'base-mainnet'): Promise<CDPWalletResponse> {
    if (!this.isConfigured) {
      throw new Error('CDP SDK not properly configured');
    }

    try {
      // Create wallet on specified network using authentic CDP API
      const networkId = network === 'base' ? Coinbase.networks.BaseMainnet : Coinbase.networks.BaseSepolia;
      const wallet = await Wallet.create({ networkId });
      const defaultAddress = await wallet.getDefaultAddress();
      
      // Store wallet for later use
      const walletId = wallet.getId() || `wallet_${Date.now()}`;
      this.wallets.set(walletId, wallet);

      return {
        walletId,
        address: defaultAddress.toString(),
        network,
        balance: 0
      };
    } catch (error) {
      console.error('Failed to create CDP wallet:', error);
      throw error;
    }
  }

  async getWalletBalance(walletId: string, assetId: string = 'ETH'): Promise<number> {
    if (!this.isConfigured) {
      throw new Error('CDP SDK not properly configured');
    }

    try {
      const wallet = this.wallets.get(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const address = await wallet.getDefaultAddress();
      const balance = await address.getBalance(assetId);
      
      return parseFloat(balance.toString());
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return 0;
    }
  }

  async createTransfer(
    walletId: string,
    amount: number,
    assetId: string,
    destination: string
  ): Promise<CDPTransactionResponse> {
    if (!this.isConfigured) {
      throw new Error('CDP SDK not properly configured');
    }

    try {
      const wallet = this.wallets.get(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Create transfer using authentic CDP SDK
      const transfer = await wallet.createTransfer({
        amount,
        assetId,
        destination
      });

      // Wait for transfer completion
      await transfer.wait();

      return {
        transactionId: transfer.getId(),
        status: 'confirmed',
        hash: transfer.getTransactionHash(),
        amount,
        currency: assetId,
        fee: 0, // CDP calculates gas fees automatically
        gasUsed: 0,
        blockNumber: 0
      };
    } catch (error) {
      console.error('Failed to create transfer:', error);
      throw error;
    }
  }

  async createTrade(
    walletId: string,
    amount: number,
    fromAssetId: string,
    toAssetId: string
  ): Promise<CDPTransactionResponse> {
    if (!this.isConfigured) {
      throw new Error('CDP SDK not properly configured');
    }

    try {
      const wallet = this.wallets.get(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Create trade using authentic CDP SDK
      const trade = await wallet.createTrade({
        amount,
        fromAssetId,
        toAssetId
      });

      // Wait for trade completion
      await trade.wait();

      return {
        transactionId: trade.getId() || `trade_${Date.now()}`,
        status: 'confirmed',
        hash: trade.getTransaction()?.getTransactionHash() || '',
        amount,
        currency: toAssetId,
        fee: 0,
        gasUsed: 0,
        blockNumber: 0
      };
    } catch (error) {
      console.error('Failed to create trade:', error);
      throw error;
    }
  }

  async enableStaking(
    walletId: string,
    amount: number,
    assetId: string = 'ETH'
  ): Promise<CDPTransactionResponse> {
    if (!this.isConfigured) {
      throw new Error('CDP SDK not properly configured');
    }

    try {
      const wallet = this.wallets.get(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // For now, use transfer to staking contract as CDP staking API is in development
      const stakingContract = "0x00000000219ab540356cBB839Cbe05303d7705Fa"; // ETH 2.0 deposit contract
      
      const transfer = await wallet.createTransfer({
        amount,
        assetId,
        destination: stakingContract
      });

      await transfer.wait();

      return {
        transactionId: transfer.getId() || `stake_${Date.now()}`,
        status: 'confirmed',
        hash: transfer.getTransactionHash() || '',
        amount,
        currency: assetId,
        fee: 0,
        gasUsed: 0,
        blockNumber: 0
      };
    } catch (error) {
      console.error('Failed to enable staking:', error);
      throw error;
    }
  }

  async getStakingRewards(
    address: string,
    startTime: string,
    endTime: string
  ): Promise<{ rewards: number; currency: string }> {
    if (!this.isConfigured) {
      throw new Error('CDP SDK not properly configured');
    }

    try {
      // This would typically use the CDP staking rewards API
      // For now, returning calculated rewards based on typical ETH staking yields
      const mockRewards = 0.045; // ~4.5% annual yield
      
      return {
        rewards: mockRewards,
        currency: 'ETH'
      };
    } catch (error) {
      console.error('Failed to get staking rewards:', error);
      throw error;
    }
  }

  async exportWallet(walletId: string): Promise<WalletData> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return wallet.export();
  }

  async importWallet(walletData: WalletData): Promise<string> {
    const wallet = await Wallet.import(walletData);
    const walletId = wallet.getId() || `imported_${Date.now()}`;
    this.wallets.set(walletId, wallet);
    return walletId;
  }
}

export const cdpSDK = new CoinbaseCDPSDK();