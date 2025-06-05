import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { dexAggregator } from "./dexAggregator";
import { coinbaseCDP } from "./coinbaseCDP";

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

  // DEX Aggregator API Endpoints
  app.get("/api/dex/tokens", async (req, res) => {
    try {
      const tokens = await dexAggregator.getTokenList();
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token list" });
    }
  });

  app.post("/api/dex/quote", async (req, res) => {
    try {
      const { fromToken, toToken, amount } = req.body;
      
      if (!fromToken || !toToken || !amount) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const quote = await dexAggregator.calculateSwapRoutes(fromToken, toToken, parseFloat(amount));
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate swap routes" });
    }
  });

  app.post("/api/dex/swap", async (req, res) => {
    try {
      const { quote } = req.body;
      
      if (!quote) {
        return res.status(400).json({ message: "Quote required for swap" });
      }

      const result = await dexAggregator.simulateSwap(quote);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Swap execution failed" });
    }
  });

  // Coinbase CDP API Endpoints
  app.post("/api/cdp/wallet", async (req, res) => {
    try {
      const { network } = req.body;
      const wallet = await coinbaseCDP.createCDPWallet(network || 'base');
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to create CDP wallet" });
    }
  });

  app.post("/api/cdp/optimize-route", async (req, res) => {
    try {
      const { fromToken, toToken, amount } = req.body;
      
      if (!fromToken || !toToken || !amount) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const optimization = await coinbaseCDP.optimizeTransactionRoute(fromToken, toToken, parseFloat(amount));
      res.json(optimization);
    } catch (error) {
      res.status(500).json({ message: "Route optimization failed" });
    }
  });

  app.post("/api/cdp/payment-stream", async (req, res) => {
    try {
      const { payments, batchSize } = req.body;
      
      if (!payments || !Array.isArray(payments)) {
        return res.status(400).json({ message: "Invalid payments array" });
      }

      const result = await coinbaseCDP.processPaymentStream(payments, batchSize);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Payment stream processing failed" });
    }
  });

  app.post("/api/cdp/x402-payment", async (req, res) => {
    try {
      const paymentData = req.body;
      const paymentRequest = await coinbaseCDP.createX402PaymentRequest(paymentData);
      
      // Set x402 payment header
      res.setHeader('x402-payment-required', JSON.stringify(paymentRequest));
      res.json(paymentRequest);
    } catch (error) {
      res.status(500).json({ message: "X402 payment request failed" });
    }
  });

  app.get("/api/cdp/pricing/:volume", async (req, res) => {
    try {
      const volume = parseFloat(req.params.volume);
      const pricing = await coinbaseCDP.getInstitutionalPricing(volume);
      res.json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to get institutional pricing" });
    }
  });

  app.post("/api/cdp/webhook", async (req, res) => {
    try {
      const signature = req.headers['x-coinbase-signature'] as string;
      const payload = JSON.stringify(req.body);
      
      const isValid = await coinbaseCDP.verifyWebhook(payload, signature);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid webhook signature" });
      }

      // Process webhook payload
      console.log('Received Coinbase CDP webhook:', req.body);
      res.json({ received: true });
    } catch (error) {
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connectivity by attempting to get a user
      await storage.getUser(1);
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        api: true,
        database: true,
        websocket: wss.clients.size > 0
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        api: true,
        database: false,
        websocket: wss.clients.size > 0,
        error: 'Database connection failed'
      });
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
