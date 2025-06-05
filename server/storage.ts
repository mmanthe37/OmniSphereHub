import type { 
  User, 
  InsertUser, 
  SocialPost, 
  PortfolioData, 
  CryptoPrice, 
  StakingPool, 
  AITrade, 
  NFTCollection, 
  ContentStats, 
  CreatorBadge 
} from "@shared/schema";
import { marketDataService } from "./marketDataService";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  getSocialPosts(): Promise<SocialPost[]>;
  createSocialPost(post: { userId: number; content: string; imageUrl?: string }): Promise<SocialPost>;
  getPortfolioData(userId: number): Promise<PortfolioData | undefined>;
  getCryptoPrices(): Promise<CryptoPrice[]>;
  getStakingPools(): Promise<StakingPool[]>;
  getUserStakingPositions(userId: number): Promise<any[]>;
  createStakingPosition(position: { userId: number; poolId: number; amount: number }): Promise<any>;
  unstakePosition(positionId: number, amount: number): Promise<any>;
  claimStakingRewards(positionId: number): Promise<any>;
  getAITrades(userId: number): Promise<AITrade[]>;
  getAITradingStatus(userId: number): Promise<any>;
  updateAITradingStatus(userId: number, status: any): Promise<void>;
  getNFTCollections(): Promise<NFTCollection[]>;
  getUserNFTs(userId: number): Promise<any[]>;
  createNFT(nft: { userId: number; name: string; description: string; imageUrl?: string; price?: number }): Promise<any>;
  updateCryptoPrice(symbol: string, price: number, change24h: number): Promise<void>;
  getContentStats(userId: number): Promise<ContentStats | undefined>;
  getCreatorBadges(userId: number): Promise<CreatorBadge[]>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private socialPosts = new Map<number, SocialPost>();
  private portfolioData = new Map<number, PortfolioData>();
  private cryptoPrices = new Map<string, CryptoPrice>();
  private stakingPools = new Map<number, StakingPool>();
  private stakingPositions = new Map<number, any>();
  private aiTrades = new Map<number, AITrade>();
  private aiTradingStatus = new Map<number, any>();
  private userNFTs = new Map<number, any[]>();
  private nftCollections = new Map<number, NFTCollection>();
  private contentStats = new Map<number, ContentStats>();
  private creatorBadges = new Map<number, CreatorBadge>();

  private currentUserId = 1;
  private currentPostId = 1;
  private currentTradeId = 1;
  private currentBadgeId = 1;
  private currentPositionId = 1;
  private currentNFTId = 1;

  constructor() {
    // Initialize empty data structures for real use
    // No sample data loaded - all data comes from authentic sources
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name || '',
      tier: insertUser.tier || 'Basic',
      avatar: insertUser.avatar || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getSocialPosts(): Promise<SocialPost[]> {
    return Array.from(this.socialPosts.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createSocialPost(post: { userId: number; content: string; imageUrl?: string }): Promise<SocialPost> {
    const id = this.currentPostId++;
    const newPost: SocialPost = {
      id,
      userId: post.userId,
      content: post.content,
      imageUrl: post.imageUrl || null,
      likes: 0,
      comments: 0,
      shares: 0,
      pnl: null,
      createdAt: new Date(),
    };
    this.socialPosts.set(id, newPost);
    return newPost;
  }

  async getPortfolioData(userId: number): Promise<PortfolioData | undefined> {
    return this.portfolioData.get(userId);
  }

  async getCryptoPrices(): Promise<CryptoPrice[]> {
    try {
      // Fetch live prices from market data API
      const livePrices = await marketDataService.fetchLivePrices(['bitcoin', 'ethereum', 'solana']);
      
      // Update local cache with fresh data
      livePrices.forEach(price => {
        this.cryptoPrices.set(price.symbol, price);
      });
      
      return livePrices;
    } catch (error) {
      console.error('Failed to fetch live prices:', error);
      // Return cached data if available, otherwise empty array
      return Array.from(this.cryptoPrices.values());
    }
  }

  async getStakingPools(): Promise<StakingPool[]> {
    return Array.from(this.stakingPools.values())
      .filter(pool => pool.isActive);
  }

  async getUserStakingPositions(userId: number): Promise<any[]> {
    return Array.from(this.stakingPositions.values())
      .filter((position: any) => position.userId === userId);
  }

  async createStakingPosition(position: { userId: number; poolId: number; amount: number }): Promise<any> {
    const id = this.currentPositionId++;
    const newPosition = {
      id,
      userId: position.userId,
      poolId: position.poolId,
      amount: position.amount,
      earned: 0,
      createdAt: new Date(),
      status: 'active'
    };
    this.stakingPositions.set(id, newPosition);
    return newPosition;
  }

  async unstakePosition(positionId: number, amount: number): Promise<any> {
    const position = this.stakingPositions.get(positionId);
    if (position) {
      position.amount -= amount;
      position.status = position.amount <= 0 ? 'unstaked' : 'active';
    }
    return { success: true, position };
  }

  async claimStakingRewards(positionId: number): Promise<any> {
    const position = this.stakingPositions.get(positionId);
    if (position) {
      const rewards = position.earned;
      position.earned = 0;
      return { success: true, rewards };
    }
    return { success: false, rewards: 0 };
  }

  async getAITrades(userId: number): Promise<AITrade[]> {
    return Array.from(this.aiTrades.values())
      .filter(trade => trade.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAITradingStatus(userId: number): Promise<any> {
    return this.aiTradingStatus.get(userId) || {
      active: false,
      strategy: 'conservative',
      riskLevel: 'low',
      maxAmount: 1000
    };
  }

  async updateAITradingStatus(userId: number, status: any): Promise<void> {
    this.aiTradingStatus.set(userId, status);
  }

  async getUserNFTs(userId: number): Promise<any[]> {
    return this.userNFTs.get(userId) || [];
  }

  async createNFT(nft: { userId: number; name: string; description: string; imageUrl?: string; price?: number }): Promise<any> {
    const id = this.currentNFTId++;
    const newNFT = {
      id,
      userId: nft.userId,
      name: nft.name,
      description: nft.description,
      imageUrl: nft.imageUrl || null,
      price: nft.price || 0,
      currency: 'ETH',
      status: 'minted',
      createdAt: new Date()
    };
    
    const userNFTs = this.userNFTs.get(nft.userId) || [];
    userNFTs.push(newNFT);
    this.userNFTs.set(nft.userId, userNFTs);
    
    return newNFT;
  }

  async updateCryptoPrice(symbol: string, price: number, change24h: number): Promise<void> {
    const existing = this.cryptoPrices.get(symbol);
    if (existing) {
      existing.price = price;
      existing.change24h = change24h;
      existing.updatedAt = new Date();
    }
  }

  async getNFTCollections(): Promise<NFTCollection[]> {
    return Array.from(this.nftCollections.values());
  }

  async getContentStats(userId: number): Promise<ContentStats | undefined> {
    return this.contentStats.get(userId);
  }

  async getCreatorBadges(userId: number): Promise<CreatorBadge[]> {
    return Array.from(this.creatorBadges.values())
      .filter(badge => badge.userId === userId);
  }
}

export const storage = new MemStorage();