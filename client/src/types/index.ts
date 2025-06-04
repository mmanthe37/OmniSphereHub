export interface CryptoPrice {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  updatedAt: Date;
}

export interface PortfolioData {
  id: number;
  userId: number;
  totalValue: number;
  dailyPnl: number;
  stakingRewards: number;
  updatedAt: Date;
}

export interface SocialPost {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  pnl?: number;
  createdAt: Date;
}

export interface StakingPool {
  id: number;
  name: string;
  protocol: string;
  apy: number;
  tvl: number;
  minStake: number;
  symbol: string;
  isActive: boolean;
}

export interface AITrade {
  id: number;
  pair: string;
  strategy: string;
  profit: number;
  status: string;
  createdAt: Date;
}

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  tier: string;
  avatar?: string;
  createdAt: Date;
}

export interface NFTCollection {
  id: number;
  name: string;
  symbol: string;
  floorPrice: number;
  volume24h: number;
  change24h: number;
  totalSupply: number;
  owners: number;
  imageUrl?: string;
  updatedAt: Date;
}

export interface ContentStats {
  id: number;
  userId: number;
  totalPosts: number;
  totalLikes: number;
  totalFollowers: number;
  totalViews: number;
  monthlyEarnings: number;
  contentRating: number;
  updatedAt: Date;
}

export interface CreatorBadge {
  id: number;
  userId: number;
  badgeType: string;
  badgeName: string;
  description: string;
  earnedAt: Date;
}

export type TabType = 'dashboard' | 'socialfi' | 'creator' | 'trading' | 'nfts' | 'aibot' | 'staking' | 'learn';
