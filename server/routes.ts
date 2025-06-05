import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { dexAggregator } from "./dexAggregator";
import { coinbaseCDP } from "./coinbaseCDP";
import { advancedTrading } from "./advancedTrading";
import { paymentCommerce } from "./paymentCommerce";
import { defiYield } from "./defiYield";
import { analyticsAI } from "./analyticsAI";

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

  // Advanced Trading API Endpoints
  app.post("/api/trading/smart-order", async (req, res) => {
    try {
      const { amount, fromToken, toToken, urgency, maxSlippage } = req.body;
      const result = await advancedTrading.smartOrderRouting({
        amount: parseFloat(amount),
        fromToken,
        toToken,
        urgency: urgency || 'medium',
        maxSlippage: parseFloat(maxSlippage) || 0.5
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Smart order routing failed" });
    }
  });

  app.post("/api/trading/institutional-batch", async (req, res) => {
    try {
      const { userId, amount, token } = req.body;
      const result = await advancedTrading.addToInstitutionalBatch({
        userId: parseInt(userId),
        amount: parseFloat(amount),
        token,
        timestamp: new Date(),
        executed: false
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Institutional batching failed" });
    }
  });

  app.get("/api/trading/gas-optimization", async (req, res) => {
    try {
      const result = await advancedTrading.optimizeGasFees([]);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Gas optimization failed" });
    }
  });

  app.post("/api/trading/cross-chain-bridge", async (req, res) => {
    try {
      const { fromNetwork, toNetwork, token, amount } = req.body;
      const result = await advancedTrading.enableCrossChainBridging(
        fromNetwork,
        toNetwork,
        token,
        parseFloat(amount)
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Cross-chain bridging failed" });
    }
  });

  // Payment & Commerce API Endpoints
  app.post("/api/payments/x402", async (req, res) => {
    try {
      const { amount, currency, description, metadata } = req.body;
      const result = await coinbaseCDP.createX402PaymentRequest({
        amount: parseFloat(amount),
        currency: currency || 'USDC',
        description: description || 'X402 Payment',
        metadata
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "X402 payment request failed", error: error.message });
    }
  });

  app.post("/api/payments/micropayment-stream", async (req, res) => {
    try {
      const { creatorId, subscriberId, ratePerSecond, currency } = req.body;
      const result = await paymentCommerce.initiateMicropaymentStream(
        parseInt(creatorId),
        parseInt(subscriberId),
        parseFloat(ratePerSecond),
        currency || 'USDC'
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Micropayment stream failed" });
    }
  });

  app.delete("/api/payments/stream/:streamId", async (req, res) => {
    try {
      const { streamId } = req.params;
      const result = await paymentCommerce.stopPaymentStream(streamId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to stop payment stream" });
    }
  });

  app.post("/api/payments/nft-transaction", async (req, res) => {
    try {
      const { tokenId, price, currency, buyerId, sellerId, royalty } = req.body;
      const result = await paymentCommerce.processNFTTransaction({
        tokenId,
        price: parseFloat(price),
        currency,
        buyerId: parseInt(buyerId),
        sellerId: parseInt(sellerId),
        royalty: parseFloat(royalty)
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "NFT transaction failed" });
    }
  });

  app.post("/api/payments/subscription-plan", async (req, res) => {
    try {
      const plan = req.body;
      const result = await paymentCommerce.createSubscriptionPlan(plan);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Subscription plan creation failed" });
    }
  });

  app.post("/api/payments/creator-monetization", async (req, res) => {
    try {
      const { creatorId, contentId, monetizationType, amount } = req.body;
      const result = await paymentCommerce.enableCreatorMonetization(
        parseInt(creatorId),
        contentId,
        monetizationType,
        amount ? parseFloat(amount) : undefined
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Creator monetization setup failed" });
    }
  });

  app.get("/api/payments/creator-revenue/:creatorId/:timeframe", async (req, res) => {
    try {
      const { creatorId, timeframe } = req.params;
      const result = await paymentCommerce.calculateCreatorRevenue(
        parseInt(creatorId),
        timeframe as 'day' | 'week' | 'month'
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Creator revenue calculation failed" });
    }
  });

  app.post("/api/payments/instant-payout", async (req, res) => {
    try {
      const { creatorId, amount, currency } = req.body;
      const result = await paymentCommerce.enableInstantPayouts(
        parseInt(creatorId),
        parseFloat(amount),
        currency || 'USDC'
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Instant payout failed" });
    }
  });

  // DeFi & Yield API Endpoints
  app.post("/api/defi/optimize-yield", async (req, res) => {
    try {
      const { userId, totalAmount, riskProfile } = req.body;
      const result = await defiYield.optimizeYieldAllocation(
        parseInt(userId),
        parseFloat(totalAmount),
        riskProfile
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Yield optimization failed" });
    }
  });

  app.post("/api/defi/execute-farming", async (req, res) => {
    try {
      const { userId, allocations } = req.body;
      const result = await defiYield.executeAutomatedYieldFarming(
        parseInt(userId),
        allocations
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Yield farming execution failed" });
    }
  });

  app.post("/api/defi/liquid-staking", async (req, res) => {
    try {
      const { userId, asset, amount } = req.body;
      const result = await defiYield.enableLiquidStaking(
        parseInt(userId),
        asset,
        parseFloat(amount)
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Liquid staking failed" });
    }
  });

  app.post("/api/defi/risk-adjusted-portfolio", async (req, res) => {
    try {
      const { userId, totalAmount, targetVolatility } = req.body;
      const result = await defiYield.createRiskAdjustedPortfolio(
        parseInt(userId),
        parseFloat(totalAmount),
        parseFloat(targetVolatility)
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Risk-adjusted portfolio creation failed" });
    }
  });

  app.post("/api/defi/automated-rebalancing", async (req, res) => {
    try {
      const { userId, frequency, threshold } = req.body;
      const result = await defiYield.enableAutomatedRebalancing(
        parseInt(userId),
        frequency,
        parseFloat(threshold)
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Automated rebalancing setup failed" });
    }
  });

  app.post("/api/defi/institutional-custody", async (req, res) => {
    try {
      const { userId, assets } = req.body;
      const result = await defiYield.getInstitutionalCustody(
        parseInt(userId),
        assets
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Institutional custody setup failed" });
    }
  });

  // Analytics & AI API Endpoints
  app.get("/api/analytics/portfolio-metrics/:userId/:timeframe", async (req, res) => {
    try {
      const { userId, timeframe } = req.params;
      const result = await analyticsAI.calculateInstitutionalMetrics(
        parseInt(userId),
        timeframe as '1M' | '3M' | '1Y' | 'YTD'
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Portfolio metrics calculation failed" });
    }
  });

  app.post("/api/analytics/market-predictions", async (req, res) => {
    try {
      const { assets } = req.body;
      const result = await analyticsAI.generateMarketPredictions(assets);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Market prediction generation failed" });
    }
  });

  app.post("/api/analytics/trading-signals", async (req, res) => {
    try {
      const { userId, riskTolerance } = req.body;
      const result = await analyticsAI.generateTradingSignals(
        parseInt(userId),
        riskTolerance
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Trading signal generation failed" });
    }
  });

  app.get("/api/analytics/risk-metrics/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await analyticsAI.calculateRiskMetrics(parseInt(userId));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Risk metrics calculation failed" });
    }
  });

  app.post("/api/analytics/tax-optimization", async (req, res) => {
    try {
      const { userId, holdings } = req.body;
      const result = await analyticsAI.optimizeTaxStrategy(
        parseInt(userId),
        holdings
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Tax optimization failed" });
    }
  });

  app.post("/api/analytics/risk-management", async (req, res) => {
    try {
      const { userId, stopLossThreshold, positionSizingRule } = req.body;
      const result = await analyticsAI.enableAutomatedRiskManagement(
        parseInt(userId),
        parseFloat(stopLossThreshold),
        positionSizingRule
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Risk management setup failed" });
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
