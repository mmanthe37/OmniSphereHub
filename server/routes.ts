import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time price updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // API Routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolioData(parseInt(req.params.userId));
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/social-posts", async (req, res) => {
    try {
      const posts = await storage.getSocialPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/crypto-prices", async (req, res) => {
    try {
      const prices = await storage.getCryptoPrices();
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/staking-pools", async (req, res) => {
    try {
      const pools = await storage.getStakingPools();
      res.json(pools);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/ai-trades", async (req, res) => {
    try {
      const trades = await storage.getAITrades();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/nft-collections", async (req, res) => {
    try {
      const collections = await storage.getNFTCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/content-stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getContentStats(parseInt(req.params.userId));
      if (!stats) {
        return res.status(404).json({ message: "Content stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/creator-badges/:userId", async (req, res) => {
    try {
      const badges = await storage.getCreatorBadges(parseInt(req.params.userId));
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Send initial data
    ws.send(JSON.stringify({
      type: 'initial',
      message: 'Connected to OmniSphere real-time updates'
    }));

    // Send periodic price updates
    const priceUpdateInterval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        const prices = await storage.getCryptoPrices();
        
        // Simulate price changes
        for (const price of prices) {
          const change = (Math.random() - 0.5) * 2; // ±1% max change
          const newPrice = price.price * (1 + change / 100);
          const newChange24h = price.change24h + (Math.random() - 0.5) * 0.5;
          
          await storage.updateCryptoPrice(price.symbol, newPrice, newChange24h);
        }

        const updatedPrices = await storage.getCryptoPrices();
        ws.send(JSON.stringify({
          type: 'priceUpdate',
          data: updatedPrices
        }));
      }
    }, 5000); // Update every 5 seconds

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clearInterval(priceUpdateInterval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(priceUpdateInterval);
    });
  });

  return httpServer;
}
