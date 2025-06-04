import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  tier: text("tier").notNull().default("Beginner"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  pnl: real("pnl"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioData = pgTable("portfolio_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalValue: real("total_value").notNull(),
  dailyPnl: real("daily_pnl").notNull(),
  stakingRewards: real("staking_rewards").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cryptoPrices = pgTable("crypto_prices", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  change24h: real("change_24h").notNull(),
  volume: real("volume").notNull(),
  marketCap: real("market_cap").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const stakingPools = pgTable("staking_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  protocol: text("protocol").notNull(),
  apy: real("apy").notNull(),
  tvl: real("tvl").notNull(),
  minStake: real("min_stake").notNull(),
  symbol: text("symbol").notNull(),
  isActive: boolean("is_active").default(true),
});

export const aiTrades = pgTable("ai_trades", {
  id: serial("id").primaryKey(),
  pair: text("pair").notNull(),
  strategy: text("strategy").notNull(),
  profit: real("profit").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  tier: true,
  avatar: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).pick({
  userId: true,
  content: true,
  imageUrl: true,
});

export const insertPortfolioDataSchema = createInsertSchema(portfolioData).pick({
  userId: true,
  totalValue: true,
  dailyPnl: true,
  stakingRewards: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SocialPost = typeof socialPosts.$inferSelect;
export type PortfolioData = typeof portfolioData.$inferSelect;
export type CryptoPrice = typeof cryptoPrices.$inferSelect;
export type StakingPool = typeof stakingPools.$inferSelect;
export type AITrade = typeof aiTrades.$inferSelect;
