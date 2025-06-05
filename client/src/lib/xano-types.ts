// Xano Database Types for OmniSphere

export interface XanoPortfolio {
  id: number;
  user_id: number;
  total_value: number;
  daily_pnl: number;
  total_return_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface XanoHolding {
  id: number;
  portfolio_id: number;
  asset_symbol: string;
  asset_name: string;
  quantity: number;
  average_price: number;
  current_price: number;
  total_value: number;
  unrealized_pnl: number;
  percentage_change_24h: number;
  created_at: string;
  updated_at: string;
}

export interface XanoTrade {
  id: number;
  user_id: number;
  asset_symbol: string;
  trade_type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total_amount: number;
  fees: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at: string;
  updated_at: string;
}

export interface XanoAIStrategy {
  id: number;
  name: string;
  description: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  target_return: number;
  max_drawdown: number;
  is_active: boolean;
  performance_stats: {
    total_trades: number;
    winning_trades: number;
    total_return: number;
    sharpe_ratio: number;
    win_rate: number;
  };
  created_at: string;
  updated_at: string;
}

export interface XanoAITrade {
  id: number;
  user_id: number;
  strategy_id: number;
  asset_symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  quantity: number;
  profit_loss: number;
  status: 'PENDING' | 'EXECUTED' | 'CLOSED';
  created_at: string;
  updated_at: string;
}

export interface XanoDeFiProtocol {
  id: number;
  name: string;
  category: 'DEX' | 'LENDING' | 'YIELD' | 'STABLECOIN';
  description: string;
  tvl: string;
  apy_range: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  logo_url: string;
  website_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface XanoDeFiPosition {
  id: number;
  user_id: number;
  protocol_id: number;
  asset_symbol: string;
  amount_staked: number;
  current_value: number;
  rewards_earned: number;
  apy: number;
  start_date: string;
  status: 'ACTIVE' | 'UNSTAKING' | 'CLOSED';
  created_at: string;
  updated_at: string;
}

export interface XanoSocialPost {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_trending: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatar_url?: string;
  };
}

export interface XanoUser {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  total_posts: number;
  created_at: string;
  updated_at: string;
}

export interface XanoWallet {
  id: number;
  user_id: number;
  address: string;
  wallet_type: 'METAMASK' | 'COINBASE' | 'WALLETCONNECT';
  chain_id: number;
  is_primary: boolean;
  balance: number;
  is_connected: boolean;
  created_at: string;
  updated_at: string;
}

export interface XanoMarketData {
  id: number;
  symbol: string;
  name: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  change_24h: number;
  change_7d: number;
  last_updated: string;
}