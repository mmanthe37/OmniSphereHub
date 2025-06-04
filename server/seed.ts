import { db } from "./db";
import { 
  users, 
  socialPosts, 
  portfolioData, 
  cryptoPrices, 
  stakingPools, 
  aiTrades, 
  nftCollections, 
  contentStats, 
  creatorBadges 
} from "@shared/schema";

async function seedDatabase() {
  console.log('Seeding database...');

  // Insert user data
  const [user] = await db.insert(users).values({
    username: "alex_chen",
    password: "password123",
    name: "Alex Chen",
    tier: "Pro Trader",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150"
  }).returning();

  // Insert portfolio data
  await db.insert(portfolioData).values({
    userId: user.id,
    totalValue: 127582.45,
    dailyPnl: 2847.33,
    stakingRewards: 1247.89
  });

  // Insert content stats
  await db.insert(contentStats).values({
    userId: user.id,
    totalPosts: 67,
    totalLikes: 4900,
    totalFollowers: 5847,
    totalViews: 39000,
    monthlyEarnings: 3247,
    contentRating: 4.8
  });

  // Insert crypto prices
  const cryptoData = [
    { symbol: "BTC", name: "Bitcoin", price: 67420, change24h: 4.9, volume: 28934567890, marketCap: 1329876543210 },
    { symbol: "ETH", name: "Ethereum", price: 3847, change24h: 3.6, volume: 15234567890, marketCap: 462345678901 },
    { symbol: "SOL", name: "Solana", price: 142, change24h: -0.8, volume: 2345678901, marketCap: 63456789012 },
    { symbol: "ADA", name: "Cardano", price: 0.47, change24h: 2.1, volume: 987654321, marketCap: 16789012345 },
    { symbol: "AVAX", name: "Avalanche", price: 28.5, change24h: 1.8, volume: 654321098, marketCap: 11234567890 }
  ];

  for (const crypto of cryptoData) {
    await db.insert(cryptoPrices).values(crypto);
  }

  // Insert social posts
  const socialPostsData = [
    {
      userId: user.id,
      content: "Just made 15% profit on my latest AI trading strategy! 🚀 The bot identified a perfect entry point on $ETH. Who else is using automated trading?",
      likes: 234,
      comments: 45,
      shares: 12,
      pnl: 1247.50
    },
    {
      userId: user.id,
      content: "New NFT collection just dropped! Floor price already up 300%. Early community access was key. Building that social capital pays off! 💎",
      likes: 189,
      comments: 32,
      shares: 8,
      pnl: -89.20
    },
    {
      userId: user.id,
      content: "Staking rewards just hit! 18.5% APY on my favorite DeFi protocol. Compound interest is the 8th wonder of the world. 📈",
      likes: 156,
      comments: 28,
      shares: 15,
      pnl: 567.80
    }
  ];

  for (const post of socialPostsData) {
    await db.insert(socialPosts).values(post);
  }

  // Insert staking pools
  const stakingPoolsData = [
    { name: "Ethereum 2.0", protocol: "Ethereum", apy: 4.2, tvl: 32000000000, minStake: 32, symbol: "ETH", isActive: true },
    { name: "Solana Validators", protocol: "Solana", apy: 7.1, tvl: 8500000000, minStake: 1, symbol: "SOL", isActive: true },
    { name: "Cardano Pools", protocol: "Cardano", apy: 5.8, tvl: 15200000000, minStake: 10, symbol: "ADA", isActive: true },
    { name: "Avalanche Subnet", protocol: "Avalanche", apy: 9.2, tvl: 2100000000, minStake: 25, symbol: "AVAX", isActive: true },
    { name: "Polygon PoS", protocol: "Polygon", apy: 12.5, tvl: 890000000, minStake: 1, symbol: "MATIC", isActive: true }
  ];

  for (const pool of stakingPoolsData) {
    await db.insert(stakingPools).values(pool);
  }

  // Insert AI trades
  const aiTradesData = [
    { pair: "ETH/USDT", strategy: "Mean Reversion", profit: 245.67, status: "completed" },
    { pair: "BTC/USDT", strategy: "Momentum", profit: 1247.89, status: "completed" },
    { pair: "SOL/USDT", strategy: "Arbitrage", profit: 89.34, status: "active" },
    { pair: "ADA/USDT", strategy: "Grid Trading", profit: -45.23, status: "completed" },
    { pair: "AVAX/USDT", strategy: "DCA", profit: 567.12, status: "active" }
  ];

  for (const trade of aiTradesData) {
    await db.insert(aiTrades).values(trade);
  }

  // Insert NFT collections
  const nftCollectionsData = [
    { name: "Bored Ape Yacht Club", symbol: "BAYC", floorPrice: 15.7, volume24h: 847.2, change24h: 12.5, totalSupply: 10000, owners: 6429 },
    { name: "CryptoPunks", symbol: "PUNKS", floorPrice: 42.8, volume24h: 1247.8, change24h: -5.2, totalSupply: 10000, owners: 3711 },
    { name: "Azuki", symbol: "AZUKI", floorPrice: 8.9, volume24h: 445.7, change24h: 18.7, totalSupply: 10000, owners: 5234 },
    { name: "Pudgy Penguins", symbol: "PPG", floorPrice: 6.2, volume24h: 234.5, change24h: 8.9, totalSupply: 8888, owners: 4567 },
    { name: "Doodles", symbol: "DOODLES", floorPrice: 4.1, volume24h: 189.3, change24h: -2.3, totalSupply: 10000, owners: 3891 }
  ];

  for (const collection of nftCollectionsData) {
    await db.insert(nftCollections).values(collection);
  }

  // Insert creator badges
  const badgesData = [
    { userId: user.id, badgeType: "engagement", badgeName: "Community Builder", description: "Reached 5K followers milestone", earnedAt: new Date('2024-05-15') },
    { userId: user.id, badgeType: "content", badgeName: "Quality Creator", description: "Maintained 4.8+ rating for 3 months", earnedAt: new Date('2024-04-20') },
    { userId: user.id, badgeType: "trading", badgeName: "Profit Master", description: "Achieved 500%+ returns this year", earnedAt: new Date('2024-03-10') }
  ];

  for (const badge of badgesData) {
    await db.insert(creatorBadges).values(badge);
  }

  console.log('Database seeded successfully!');
}

seedDatabase().catch(console.error);