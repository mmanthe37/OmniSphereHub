// Browser-based wallet connection utilities
interface BrowserWallet {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  selectedAddress?: string;
  isConnected?: boolean;
}

declare global {
  interface Window {
    ethereum?: BrowserWallet;
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
    };
  }
}

export class WalletConnectionManager {
  async connectMetaMask(): Promise<{ address: string; provider: string; chainId: number; balance: number }> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask browser extension.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });

      // Convert balance from wei to ETH
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

      return {
        address: accounts[0],
        provider: 'MetaMask',
        chainId: parseInt(chainId, 16),
        balance: balanceInEth * 3000 // Approximate USD value
      };
    } catch (error) {
      throw new Error(`MetaMask connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async connectPhantom(): Promise<{ address: string; provider: string; chainId: number; balance: number }> {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error('Phantom wallet not installed. Please install Phantom browser extension.');
    }

    try {
      const response = await window.solana.connect();
      const address = response.publicKey.toString();

      return {
        address,
        provider: 'Phantom',
        chainId: 101, // Solana mainnet
        balance: Math.random() * 1000 + 500 // Simulated balance for demo
      };
    } catch (error) {
      throw new Error(`Phantom connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async connectWalletConnect(): Promise<{ address: string; provider: string; chainId: number; balance: number }> {
    // WalletConnect would require more complex setup with @walletconnect/client
    // For now, simulate connection with a modal that shows QR code instructions
    return new Promise((resolve, reject) => {
      // This would open a QR code modal in a real implementation
      setTimeout(() => {
        // Simulate successful connection
        const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
        resolve({
          address: mockAddress,
          provider: 'WalletConnect',
          chainId: 1,
          balance: Math.random() * 2000 + 1000
        });
      }, 2000);
    });
  }

  async connectWallet(walletId: string): Promise<{ address: string; provider: string; chainId: number; balance: number }> {
    switch (walletId) {
      case 'metamask':
        return this.connectMetaMask();
      case 'phantom':
        return this.connectPhantom();
      case 'walletconnect':
        return this.connectWalletConnect();
      case 'coinbase_wallet':
        // Similar to MetaMask but check for coinbasewallet
        if (window.ethereum && (window.ethereum as any).isCoinbaseWallet) {
          return this.connectMetaMask(); // Same API
        }
        throw new Error('Coinbase Wallet not installed');
      default:
        throw new Error(`Wallet ${walletId} not supported yet`);
    }
  }

  async disconnectWallet(walletType: string): Promise<void> {
    switch (walletType) {
      case 'phantom':
        if (window.solana) {
          await window.solana.disconnect();
        }
        break;
      case 'metamask':
      case 'coinbase_wallet':
        // Ethereum wallets don't have a disconnect method
        // User needs to disconnect from wallet extension
        break;
    }
  }

  async sendTransaction(to: string, amount: number, token: string = 'ETH'): Promise<string> {
    if (!window.ethereum) {
      throw new Error('No wallet connected');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No wallet connected');
      }

      // Convert amount to wei (for ETH)
      const amountInWei = '0x' + (amount * Math.pow(10, 18)).toString(16);

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: to,
          value: amountInWei,
          gas: '0x5208', // 21000 in hex
        }]
      });

      return txHash;
    } catch (error) {
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async switchNetwork(chainId: number): Promise<boolean> {
    if (!window.ethereum) {
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainId.toString(16) }],
      });
      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      return false;
    }
  }

  getDownloadUrl(walletId: string): string {
    const urls: Record<string, string> = {
      metamask: 'https://metamask.io/download/',
      phantom: 'https://phantom.app/',
      coinbase_wallet: 'https://www.coinbase.com/wallet',
      trust_wallet: 'https://trustwallet.com/',
      walletconnect: 'https://walletconnect.com/registry'
    };
    
    return urls[walletId] || '#';
  }
}

export const walletManager = new WalletConnectionManager();