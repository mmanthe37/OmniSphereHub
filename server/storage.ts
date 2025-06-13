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
import { users, socialPosts, portfolioData, cryptoPrices, stakingPools, aiTrades, nftCollections, contentStats, creatorBadges } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSocialPosts(): Promise<SocialPost[]> {
    return await db.select().from(socialPosts);
  }

  async createSocialPost(post: { userId: number; content: string; imageUrl?: string }): Promise<SocialPost> {
    const [newPost] = await db
      .insert(socialPosts)
      .values({
        userId: post.userId,
        content: post.content,
        imageUrl: post.imageUrl || null,
      })
      .returning();
    return newPost;
  }

  async getPortfolioData(userId: number): Promise<PortfolioData | undefined> {
    const [portfolio] = await db.select().from(portfolioData).where(eq(portfolioData.userId, userId));
    return portfolio || undefined;
  }

  async getCryptoPrices(): Promise<CryptoPrice[]> {
    try {
      const liveData = await marketDataService.fetchLivePrices();
      return liveData;
    } catch (error) {
      console.error('Failed to fetch live prices:', error);
      return await db.select().from(cryptoPrices);
    }
  }

  async getStakingPools(): Promise<StakingPool[]> {
    return await db.select().from(stakingPools).where(eq(stakingPools.isActive, true));
  }

  async getUserStakingPositions(userId: number): Promise<any[]> {
    return [];
  }

  async createStakingPosition(position: { userId: number; poolId: number; amount: number }): Promise<any> {
    return {
      id: Date.now(),
      userId: position.userId,
      poolId: position.poolId,
      amount: position.amount,
      earned: 0,
      createdAt: new Date(),
      status: 'active'
    };
  }

  async unstakePosition(positionId: number, amount: number): Promise<any> {
    return { success: true, position: null };
  }

  async claimStakingRewards(positionId: number): Promise<any> {
    return { success: false, rewards: 0 };
  }

  async getAITrades(userId: number): Promise<AITrade[]> {
    return await db.select().from(aiTrades).where(eq(aiTrades.userId, userId));
  }

  async getAITradingStatus(userId: number): Promise<any> {
    return {
      active: false,
      strategy: 'conservative',
      riskLevel: 'low',
      maxAmount: 1000
    };
  }

  async updateAITradingStatus(userId: number, status: any): Promise<void> {
    // Implementation when we have a trading status table
  }

  async getUserNFTs(userId: number): Promise<any[]> {
    return [];
  }

  async createNFT(nft: { userId: number; name: string; description: string; imageUrl?: string; price?: number }): Promise<any> {
    return {
      id: Date.now(),
      userId: nft.userId,
      name: nft.name,
      description: nft.description,
      imageUrl: nft.imageUrl || null,
      price: nft.price || 0,
      currency: 'ETH',
      status: 'minted',
      createdAt: new Date()
    };
  }

  async updateCryptoPrice(symbol: string, price: number, change24h: number): Promise<void> {
    await db
      .insert(cryptoPrices)
      .values({
        symbol,
        name: symbol,
        price,
        change24h,
        volume: 0,
        marketCap: 0,
      })
      .onConflictDoUpdate({
        target: cryptoPrices.symbol,
        set: {
          price,
          change24h,
          updatedAt: new Date(),
        },
      });
  }

  async getNFTCollections(): Promise<NFTCollection[]> {
    return await db.select().from(nftCollections);
  }

  async getContentStats(userId: number): Promise<ContentStats | undefined> {
    const [stats] = await db.select().from(contentStats).where(eq(contentStats.userId, userId));
    return stats || undefined;
  }

  async getCreatorBadges(userId: number): Promise<CreatorBadge[]> {
    return await db.select().from(creatorBadges).where(eq(creatorBadges.userId, userId));
  }
}

export const storage = new DatabaseStorage();