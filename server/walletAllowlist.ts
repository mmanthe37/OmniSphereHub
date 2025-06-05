// Wallet allowlist configuration for enhanced security and X402 protocol integration
export const ALLOWLISTED_WALLETS = new Set([
  '0x2d45014917c4bce08b6fb2b3a53960692b5b744b',
  '0x3a1b6813dd9f085de081c407de28c3b0e3d9f70d',
  '0x9b06f22a355ea236833a6044d9802b51214e677a',
  '0x2F3D8290d7B85A0Ca8e728E8BFC8002417A8aDeF',
  '0x0975A51920F2c6e406cB0A59a5f7Eb0F2F27317f',
  '0x1366578c2c770e3a97d20f12AEA4c75A02dCaafe',
  '0x7D529AbB6E4Bed61eBA511B7B9018Ce1909E0D91',
  '0xfa4aC986862674ee488FD1874337Ad2faaC7d53C'
]);

export interface WalletPrivileges {
  isPremium: boolean;
  canUseX402: boolean;
  maxTransactionAmount: number;
  dailyLimit: number;
  features: string[];
}

// Premium privileges for allowlisted wallets
export const PREMIUM_WALLET_PRIVILEGES: WalletPrivileges = {
  isPremium: true,
  canUseX402: true,
  maxTransactionAmount: 10000, // $10,000 USD
  dailyLimit: 50000, // $50,000 USD daily
  features: [
    'unlimited_trading_signals',
    'premium_ai_bot_access',
    'institutional_features',
    'custom_api_limits',
    'priority_support',
    'advanced_analytics',
    'cross_chain_privileges'
  ]
};

export const DEFAULT_WALLET_PRIVILEGES: WalletPrivileges = {
  isPremium: false,
  canUseX402: true,
  maxTransactionAmount: 1000, // $1,000 USD
  dailyLimit: 5000, // $5,000 USD daily
  features: [
    'basic_trading_signals',
    'standard_ai_bot_access',
    'community_features'
  ]
};

export function isWalletAllowlisted(address: string): boolean {
  return ALLOWLISTED_WALLETS.has(address.toLowerCase());
}

export function getWalletPrivileges(address: string): WalletPrivileges {
  if (isWalletAllowlisted(address.toLowerCase())) {
    return PREMIUM_WALLET_PRIVILEGES;
  }
  return DEFAULT_WALLET_PRIVILEGES;
}

export function validateWalletForX402(address: string, transactionAmount: number): {
  allowed: boolean;
  reason?: string;
  privileges: WalletPrivileges;
} {
  const privileges = getWalletPrivileges(address);
  
  if (!privileges.canUseX402) {
    return {
      allowed: false,
      reason: 'Wallet not authorized for X402 protocol',
      privileges
    };
  }
  
  if (transactionAmount > privileges.maxTransactionAmount) {
    return {
      allowed: false,
      reason: `Transaction amount exceeds limit of $${privileges.maxTransactionAmount}`,
      privileges
    };
  }
  
  return {
    allowed: true,
    privileges
  };
}

// Enhanced security logging for allowlisted wallets
export function logWalletActivity(address: string, activity: string, metadata?: any) {
  const isAllowlisted = isWalletAllowlisted(address);
  const timestamp = new Date().toISOString();
  
  console.log(`[WALLET_ACTIVITY] ${timestamp} - ${address} (${isAllowlisted ? 'ALLOWLISTED' : 'STANDARD'}) - ${activity}`, metadata || '');
  
  // In production, this would integrate with proper logging/monitoring systems
}