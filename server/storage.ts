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

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  getSocialPosts(): Promise<SocialPost[]>;
  getPortfolioData(userId: number): Promise<PortfolioData | undefined>;
  getCryptoPrices(): Promise<CryptoPrice[]>;
  getStakingPools(): Promise<StakingPool[]>;
  getAITrades(): Promise<AITrade[]>;
  updateCryptoPrice(symbol: string, price: number, change24h: number): Promise<void>;
  getNFTCollections(): Promise<NFTCollection[]>;
  getContentStats(userId: number): Promise<ContentStats | undefined>;
  getCreatorBadges(userId: number): Promise<CreatorBadge[]>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private socialPosts = new Map<number, SocialPost>();
  private portfolioData = new Map<number, PortfolioData>();
  private cryptoPrices = new Map<string, CryptoPrice>();
  private stakingPools = new Map<number, StakingPool>();
  private aiTrades = new Map<number, AITrade>();
  private nftCollections = new Map<number, NFTCollection>();
  private contentStats = new Map<number, ContentStats>();
  private creatorBadges = new Map<number, CreatorBadge>();

  private currentUserId = 1;
  private currentPostId = 1;
  private currentTradeId = 1;
  private currentBadgeId = 1;

  constructor() {
    // Initialize empty data structures for real use
    // No sample data loaded - all data comes from authentic sources
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const [_, user] of this.users) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
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
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPortfolioData(userId: number): Promise<PortfolioData | undefined> {
    return this.portfolioData.get(userId);
  }

  async getCryptoPrices(): Promise<CryptoPrice[]> {
    return Array.from(this.cryptoPrices.values());
  }

  async getStakingPools(): Promise<StakingPool[]> {
    return Array.from(this.stakingPools.values())
      .filter(pool => pool.isActive);
  }

  async getAITrades(): Promise<AITrade[]> {
    return Array.from(this.aiTrades.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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