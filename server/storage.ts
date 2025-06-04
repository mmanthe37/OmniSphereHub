import { 
  users, 
  socialPosts, 
  portfolioData, 
  cryptoPrices, 
  stakingPools, 
  aiTrades,
  nftCollections,
  contentStats,
  creatorBadges,
  type User, 
  type InsertUser,
  type SocialPost,
  type PortfolioData,
  type CryptoPrice,
  type StakingPool,
  type AITrade,
  type NFTCollection,
  type ContentStats,
  type CreatorBadge
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
  private users: Map<number, User>;
  private socialPosts: Map<number, SocialPost>;
  private portfolioData: Map<number, PortfolioData>;
  private cryptoPrices: Map<string, CryptoPrice>;
  private stakingPools: Map<number, StakingPool>;
  private aiTrades: Map<number, AITrade>;
  private nftCollections: Map<number, NFTCollection>;
  private contentStats: Map<number, ContentStats>;
  private creatorBadges: Map<number, CreatorBadge[]>;
  private currentId: number;
  private currentPostId: number;
  private currentTradeId: number;
  private currentNFTId: number;
  private currentBadgeId: number;

  constructor() {
    this.users = new Map();
    this.socialPosts = new Map();
    this.portfolioData = new Map();
    this.cryptoPrices = new Map();
    this.stakingPools = new Map();
    this.aiTrades = new Map();
    this.nftCollections = new Map();
    this.contentStats = new Map();
    this.creatorBadges = new Map();
    this.currentId = 1;
    this.currentPostId = 1;
    this.currentTradeId = 1;
    this.currentNFTId = 1;
    this.currentBadgeId = 1;
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock user
    const mockUser: User = {
      id: 1,
      username: "alex_chen",
      password: "password",
      name: "Alex Chen",
      tier: "Pro Trader",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      createdAt: new Date(),
    };
    this.users.set(1, mockUser);

    // Initialize mock crypto prices
    const mockPrices: CryptoPrice[] = [
      { id: 1, symbol: "BTC", name: "Bitcoin", price: 67420, change24h: 5.2, volume: 28000000000, marketCap: 1300000000000, updatedAt: new Date() },
      { id: 2, symbol: "ETH", name: "Ethereum", price: 2487.32, change24h: 3.8, volume: 15000000000, marketCap: 300000000000, updatedAt: new Date() },
      { id: 3, symbol: "SOL", name: "Solana", price: 76.24, change24h: -1.2, volume: 2000000000, marketCap: 35000000000, updatedAt: new Date() },
    ];
    mockPrices.forEach(price => this.cryptoPrices.set(price.symbol, price));

    // Initialize mock portfolio data
    const mockPortfolio: PortfolioData = {
      id: 1,
      userId: 1,
      totalValue: 127582.45,
      dailyPnl: 2847.33,
      stakingRewards: 1247.89,
      updatedAt: new Date(),
    };
    this.portfolioData.set(1, mockPortfolio);

    // Initialize mock staking pools
    const mockPools: StakingPool[] = [
      { id: 1, name: "ETH 2.0 Staking", protocol: "Ethereum", apy: 18.5, tvl: 24700000, minStake: 0.1, symbol: "ETH", isActive: true },
      { id: 2, name: "SOL Validators", protocol: "Solana", apy: 24.3, tvl: 18900000, minStake: 1, symbol: "SOL", isActive: true },
      { id: 3, name: "ETH-USDC LP", protocol: "Uniswap V3", apy: 34.7, tvl: 156400000, minStake: 100, symbol: "LP", isActive: true },
      { id: 4, name: "wBTC Vault", protocol: "Yearn Finance", apy: 12.8, tvl: 89200000, minStake: 0.01, symbol: "wBTC", isActive: true },
    ];
    mockPools.forEach((pool, index) => this.stakingPools.set(index + 1, pool));

    // Initialize mock social posts
    const mockPosts: SocialPost[] = [
      {
        id: 1,
        userId: 1,
        content: "Just closed a massive position on $ETH! The technical analysis was spot on. Next target: $2,800. Who else is riding this wave? 🚀 #ETH #DeFi #TechnicalAnalysis",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
        likes: 247,
        comments: 34,
        shares: 12,
        pnl: 12847,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 2,
        userId: 1,
        content: "New liquidity pool is live! 🎉 ETH-USDC pair offering 24.5% APY. Already deposited 50 ETH. Early birds get the best rewards! #LiquidityMining #Yield",
        imageUrl: null,
        likes: 189,
        comments: 27,
        shares: 8,
        pnl: null,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ];
    mockPosts.forEach(post => this.socialPosts.set(post.id, post));

    // Initialize mock AI trades
    const mockTrades: AITrade[] = [
      { id: 1, pair: "SOL/USDT", strategy: "Arbitrage Strategy", profit: 1247.89, status: "completed", createdAt: new Date(Date.now() - 2 * 60 * 1000) },
      { id: 2, pair: "ETH/BTC", strategy: "Mean Reversion", profit: 847.32, status: "completed", createdAt: new Date(Date.now() - 15 * 60 * 1000) },
      { id: 3, pair: "BTC/USDT", strategy: "Momentum Trading", profit: -234.56, status: "completed", createdAt: new Date(Date.now() - 60 * 60 * 1000) },
    ];
    mockTrades.forEach(trade => this.aiTrades.set(trade.id, trade));

    // Initialize mock NFT collections
    const mockNFTs: NFTCollection[] = [
      { id: 1, name: "Bored Ape Yacht Club", symbol: "BAYC", floorPrice: 28.5, volume24h: 2847.32, change24h: 5.2, totalSupply: 10000, owners: 6547, imageUrl: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?ixlib=rb-4.0.3&w=150&h=150", updatedAt: new Date() },
      { id: 2, name: "CryptoPunks", symbol: "PUNKS", floorPrice: 65.8, volume24h: 1923.45, change24h: -2.1, totalSupply: 10000, owners: 3482, imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&w=150&h=150", updatedAt: new Date() },
      { id: 3, name: "Azuki", symbol: "AZUKI", floorPrice: 12.3, volume24h: 3456.78, change24h: 8.7, totalSupply: 10000, owners: 5234, imageUrl: "https://images.unsplash.com/photo-1634736797842-8d692e5cb73e?ixlib=rb-4.0.3&w=150&h=150", updatedAt: new Date() },
      { id: 4, name: "Doodles", symbol: "DOODLES", floorPrice: 8.7, volume24h: 1234.56, change24h: 12.4, totalSupply: 10000, owners: 4567, imageUrl: "https://images.unsplash.com/photo-1636955816868-fcb881e57954?ixlib=rb-4.0.3&w=150&h=150", updatedAt: new Date() },
    ];
    mockNFTs.forEach(nft => this.nftCollections.set(nft.id, nft));

    // Initialize mock content stats
    const mockContentStats: ContentStats = {
      id: 1,
      userId: 1,
      totalPosts: 247,
      totalLikes: 18943,
      totalFollowers: 5847,
      totalViews: 247892,
      monthlyEarnings: 3247.89,
      contentRating: 4.8,
      updatedAt: new Date(),
    };
    this.contentStats.set(1, mockContentStats);

    // Initialize mock creator badges
    const mockBadges: CreatorBadge[] = [
      { id: 1, userId: 1, badgeType: "engagement", badgeName: "Community Leader", description: "Gained 1000+ followers in a month", earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { id: 2, userId: 1, badgeType: "content", badgeName: "Viral Creator", description: "Post reached 50k+ views", earnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { id: 3, userId: 1, badgeType: "trading", badgeName: "Alpha Caller", description: "Trading signals with 80%+ accuracy", earnedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
    ];
    this.creatorBadges.set(1, mockBadges);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      tier: insertUser.tier || "Beginner",
      avatar: insertUser.avatar || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getSocialPosts(): Promise<SocialPost[]> {
    return Array.from(this.socialPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPortfolioData(userId: number): Promise<PortfolioData | undefined> {
    return this.portfolioData.get(userId);
  }

  async getCryptoPrices(): Promise<CryptoPrice[]> {
    return Array.from(this.cryptoPrices.values());
  }

  async getStakingPools(): Promise<StakingPool[]> {
    return Array.from(this.stakingPools.values()).filter(pool => pool.isActive);
  }

  async getAITrades(): Promise<AITrade[]> {
    return Array.from(this.aiTrades.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async updateCryptoPrice(symbol: string, price: number, change24h: number): Promise<void> {
    const existing = this.cryptoPrices.get(symbol);
    if (existing) {
      existing.price = price;
      existing.change24h = change24h;
      existing.updatedAt = new Date();
    }
  }
}

export const storage = new MemStorage();
