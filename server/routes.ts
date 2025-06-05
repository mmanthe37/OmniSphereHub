import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { dexAggregator } from "./dexAggregator";
import { coinbaseCDP } from "./coinbaseCDP";
import { cdpSDK } from "./cdpSDK";
import { x402Protocol } from "./x402Protocol";
import { advancedTrading } from "./advancedTrading";
import { paymentCommerce } from "./paymentCommerce";
import { defiYield } from "./defiYield";
import { analyticsAI } from "./analyticsAI";
import { aiTradingEngine } from "./aiTradingAlgorithms";
import { walletConnector } from "./walletConnector";
import { 
  isWalletAllowlisted, 
  getWalletPrivileges, 
  validateWalletForX402, 
  logWalletActivity 
} from "./walletAllowlist";
import { setupWebhookRoutes } from "./webhookHandler";
import { smartContractManager } from "./smartContractIntegration";

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

  // Social Posts API
  app.get("/api/social/posts", async (req, res) => {
    try {
      const posts = await storage.getSocialPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/social/posts", async (req, res) => {
    try {
      const { userId, content, imageUrl } = req.body;
      const post = await storage.createSocialPost({ userId, content, imageUrl });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // NFT API Routes
  app.get("/api/nft/collections", async (req, res) => {
    try {
      const collections = await storage.getNFTCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Wallet allowlist validation endpoint
  app.post("/api/wallet/validate", async (req, res) => {
    try {
      const { address, transactionAmount = 0 } = req.body;
      
      if (!address) {
        return res.status(400).json({ message: "Wallet address required" });
      }

      const isAllowlisted = isWalletAllowlisted(address);
      const privileges = getWalletPrivileges(address);
      const validation = validateWalletForX402(address, transactionAmount);

      logWalletActivity(address, 'VALIDATION_CHECK', { 
        transactionAmount, 
        isAllowlisted,
        allowed: validation.allowed 
      });

      res.json({
        address,
        isAllowlisted,
        privileges,
        validation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Wallet validation failed" });
    }
  });

  // Enhanced wallet privileges endpoint
  app.get("/api/wallet/privileges/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ message: "Wallet address required" });
      }

      const isAllowlisted = isWalletAllowlisted(address);
      const privileges = getWalletPrivileges(address);

      logWalletActivity(address, 'PRIVILEGES_CHECK', { isAllowlisted });

      res.json({
        address,
        isAllowlisted,
        privileges,
        specialFeatures: isAllowlisted ? [
          'unlimited_x402_transactions',
          'premium_ai_signals',
          'institutional_access',
          'advanced_analytics',
          'priority_support'
        ] : [],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet privileges" });
    }
  });

  app.get("/api/nft/user-nfts", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      const nfts = await storage.getUserNFTs(parseInt(userId));
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/nft/create", async (req, res) => {
    try {
      const { userId, name, description, imageUrl, price } = req.body;
      const nft = await storage.createNFT({ userId, name, description, imageUrl, price });
      res.status(201).json(nft);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Trading API Routes
  app.get("/api/ai/trades", async (req, res) => {
    try {
      // For now, use a default user ID since auth is not fully implemented
      const trades = await storage.getAITrades(1);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/ai/status", async (req, res) => {
    try {
      // For now, use a default user ID since auth is not fully implemented
      const status = await storage.getAITradingStatus(1);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ai/start", async (req, res) => {
    try {
      const { userId = 1, strategy, riskLevel, maxAmount } = req.body;
      const result = await aiTradingEngine.enableAutoTrading(true);
      if (result.success) {
        await storage.updateAITradingStatus(userId, {
          active: true,
          strategy,
          riskLevel,
          maxAmount
        });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ai/stop", async (req, res) => {
    try {
      const { userId = 1 } = req.body;
      const result = await aiTradingEngine.enableAutoTrading(false);
      if (result.success) {
        await storage.updateAITradingStatus(userId, { active: false });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Staking API Routes
  app.get("/api/staking/pools", async (req, res) => {
    try {
      const pools = await storage.getStakingPools();
      res.json(pools);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/staking/positions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      const positions = await storage.getUserStakingPositions(parseInt(userId));
      res.json(positions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/staking/stake", async (req, res) => {
    try {
      const { userId, poolId, amount } = req.body;
      const position = await storage.createStakingPosition({ userId, poolId, amount });
      res.status(201).json(position);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/staking/unstake", async (req, res) => {
    try {
      const { positionId, amount } = req.body;
      const result = await storage.unstakePosition(positionId, amount);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/staking/claim-rewards", async (req, res) => {
    try {
      const { positionId } = req.body;
      const result = await storage.claimStakingRewards(positionId);
      res.json(result);
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
      const trades = await storage.getAITrades(1); // Default user ID for demo
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

  // Authentic Coinbase CDP SDK Endpoints
  app.post("/api/cdp/wallet", async (req, res) => {
    try {
      const { network } = req.body;
      const wallet = await cdpSDK.createWallet(network || 'base-mainnet');
      res.json(wallet);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create CDP wallet", error: error.message });
    }
  });

  app.get("/api/cdp/wallet/:walletId/balance", async (req, res) => {
    try {
      const { walletId } = req.params;
      const { assetId } = req.query;
      const balance = await cdpSDK.getWalletBalance(walletId, assetId as string || 'ETH');
      res.json({ balance, currency: assetId || 'ETH' });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get wallet balance", error: error.message });
    }
  });

  app.post("/api/cdp/transfer", async (req, res) => {
    try {
      const { walletId, amount, assetId, destination } = req.body;
      const transfer = await cdpSDK.createTransfer(walletId, amount, assetId, destination);
      res.json(transfer);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create transfer", error: error.message });
    }
  });

  app.post("/api/cdp/trade", async (req, res) => {
    try {
      const { walletId, amount, fromAssetId, toAssetId } = req.body;
      const trade = await cdpSDK.createTrade(walletId, amount, fromAssetId, toAssetId);
      res.json(trade);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create trade", error: error.message });
    }
  });

  app.post("/api/cdp/stake", async (req, res) => {
    try {
      const { walletId, amount, assetId } = req.body;
      const stake = await cdpSDK.enableStaking(walletId, amount, assetId || 'ETH');
      res.json(stake);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to enable staking", error: error.message });
    }
  });

  // Coinbase CDP Legacy API Endpoints (keeping for compatibility)
  app.post("/api/cdp/wallet-legacy", async (req, res) => {
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

  // Wallet Token Transfer Endpoints
  app.post("/api/wallet/send", async (req, res) => {
    try {
      const { to, amount, token, gasPrice } = req.body;
      
      // Validate input
      if (!to || !amount || !token) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required fields: to, amount, token" 
        });
      }

      // Get the connected wallet from the wallet connector
      const connectedWallets = await walletConnector.getConnectedWallets();
      if (connectedWallets.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "No wallet connected. Please connect a wallet first." 
        });
      }

      const connectedWallet = connectedWallets[0];
      
      // Create transfer using Coinbase CDP with the actual connected wallet
      const result = await cdpSDK.createTransfer(
        connectedWallet.address, // Use the connected wallet address
        to,
        parseFloat(amount),
        token
      );

      res.json({
        success: true,
        transactionHash: result.hash,
        amount: amount,
        token: token,
        to: to,
        gasUsed: result.gasUsed,
        fee: result.fee,
        status: result.status
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Transaction failed" 
      });
    }
  });

  app.get("/api/wallet/balance/:walletId/:token", async (req, res) => {
    try {
      const { walletId, token } = req.params;
      const balance = await cdpSDK.getWalletBalance(walletId, token);
      
      res.json({
        success: true,
        balance: balance,
        token: token,
        walletId: walletId
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to get balance" 
      });
    }
  });

  // Add receive token endpoint for authentic wallet addresses
  app.post("/api/wallet/receive", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ 
          success: false, 
          error: "Token type is required" 
        });
      }

      // Get the connected wallet
      const connectedWallets = await walletConnector.getConnectedWallets();
      if (connectedWallets.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "No wallet connected. Please connect a wallet first." 
        });
      }

      const connectedWallet = connectedWallets[0];

      res.json({
        success: true,
        address: connectedWallet.address,
        network: connectedWallet.network,
        token: token,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${connectedWallet.address}`
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate receive address" 
      });
    }
  });

  app.get("/api/wallet/address/:walletId", async (req, res) => {
    try {
      const { walletId } = req.params;
      
      // Get authentic wallet address from connected wallets
      const connectedWallets = await walletConnector.getConnectedWallets();
      const wallet = connectedWallets.find(w => w.provider === walletId);
      
      if (!wallet) {
        return res.status(404).json({
          success: false,
          error: "Wallet not found or not connected"
        });
      }
      
      res.json({
        success: true,
        address: wallet.address,
        walletId: walletId,
        network: "ethereum"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to get address" 
      });
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

  // X402 Payment Protocol routes
  app.post("/api/x402/payment", async (req, res) => {
    try {
      const { amount, currency, receiver, memo } = req.body;
      const transaction = await x402Protocol.createX402Payment(
        parseFloat(amount),
        currency,
        receiver,
        memo
      );
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "X402 payment failed" });
    }
  });

  app.post("/api/x402/stream/start", async (req, res) => {
    try {
      const { rate, recipient } = req.body;
      const result = await x402Protocol.startMicropaymentStream(
        parseFloat(rate),
        recipient
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to start payment stream" });
    }
  });

  app.post("/api/x402/stream/stop", async (req, res) => {
    try {
      const { streamId } = req.body;
      const result = await x402Protocol.stopMicropaymentStream(streamId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to stop payment stream" });
    }
  });

  app.get("/api/x402/streams", async (req, res) => {
    try {
      const streams = x402Protocol.getActiveStreams();
      res.json(streams);
    } catch (error) {
      res.status(500).json({ message: "Failed to get active streams" });
    }
  });

  app.post("/api/x402/ai-agent/authorize", async (req, res) => {
    try {
      const { agentId, maxAmount } = req.body;
      const result = await x402Protocol.enableAIAgentAutonomousPayments(
        agentId,
        parseFloat(maxAmount)
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to authorize AI agent" });
    }
  });

  app.post("/api/x402/ai-agent/payment", async (req, res) => {
    try {
      const { agentId, amount, purpose } = req.body;
      const transaction = await x402Protocol.processAIAgentPayment(
        agentId,
        parseFloat(amount),
        purpose
      );
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "AI agent payment failed" });
    }
  });

  app.get("/api/x402/discovery", async (req, res) => {
    try {
      const services = await x402Protocol.getPaymentDiscovery();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Payment discovery failed" });
    }
  });

  app.get("/api/x402/transactions", async (req, res) => {
    try {
      const transactions = x402Protocol.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  // AI Trading Algorithm routes
  app.get("/api/ai-trading/market-data", async (req, res) => {
    try {
      const marketData = aiTradingEngine.getMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get market data" });
    }
  });

  app.get("/api/ai-trading/signals", async (req, res) => {
    try {
      const signals = aiTradingEngine.getActiveSignals();
      res.json(signals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trading signals" });
    }
  });

  app.get("/api/ai-trading/strategies", async (req, res) => {
    try {
      const strategies = aiTradingEngine.getStrategies();
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trading strategies" });
    }
  });

  app.post("/api/ai-trading/predictions", async (req, res) => {
    try {
      const { symbols } = req.body;
      const predictions = await aiTradingEngine.generateMarketPredictions(symbols || ['BTC', 'ETH', 'SOL']);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate predictions" });
    }
  });

  app.post("/api/ai-trading/execute", async (req, res) => {
    try {
      const signal = req.body;
      const result = await aiTradingEngine.executeAutonomousTrading(signal);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to execute trade" });
    }
  });

  app.post("/api/ai-trading/auto-trading", async (req, res) => {
    try {
      const { enable } = req.body;
      const result = await aiTradingEngine.enableAutoTrading(enable);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle auto-trading" });
    }
  });

  app.get("/api/ai-trading/portfolio", async (req, res) => {
    try {
      const analytics = await aiTradingEngine.getPortfolioAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get portfolio analytics" });
    }
  });

  app.post("/api/ai-trading/optimize", async (req, res) => {
    try {
      const optimization = await aiTradingEngine.optimizePortfolio();
      res.json(optimization);
    } catch (error) {
      res.status(500).json({ message: "Failed to optimize portfolio" });
    }
  });

  app.post("/api/ai-trading/strategy/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const { active } = req.body;
      const result = await aiTradingEngine.updateStrategyStatus(name, active);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to update strategy" });
    }
  });

  // Wallet Connection & Payment On-Ramp routes
  app.get("/api/wallet/providers", async (req, res) => {
    try {
      const providers = await walletConnector.getWalletProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get wallet providers" });
    }
  });

  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletId } = req.body;
      const result = await walletConnector.connectWallet(walletId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  app.post("/api/wallet/disconnect", async (req, res) => {
    try {
      const { address } = req.body;
      const result = await walletConnector.disconnectWallet(address);
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect wallet" });
    }
  });

  // Wallet Connection Endpoints
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletId } = req.body;
      
      if (!walletId) {
        return res.status(400).json({ 
          success: false, 
          error: "Wallet ID is required" 
        });
      }

      // Connect wallet using authentic CDP integration
      const result = await walletConnector.connectWallet(walletId);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to connect wallet" 
      });
    }
  });

  app.post("/api/wallet/disconnect", async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address) {
        return res.status(400).json({ 
          success: false, 
          error: "Wallet address is required" 
        });
      }

      await walletConnector.disconnectWallet(address);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to disconnect wallet" 
      });
    }
  });

  app.get("/api/wallet/connected", async (req, res) => {
    try {
      const wallets = await walletConnector.getConnectedWallets();
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to get connected wallets" });
    }
  });

  app.post("/api/wallet/switch-network", async (req, res) => {
    try {
      const { address, chainId } = req.body;
      const result = await walletConnector.switchNetwork(address, parseInt(chainId));
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to switch network" });
    }
  });

  app.post("/api/wallet/estimate-gas", async (req, res) => {
    try {
      const { fromAddress, toAddress, amount, token } = req.body;
      const fees = await walletConnector.estimateGasFees(
        fromAddress,
        toAddress,
        parseFloat(amount),
        token
      );
      res.json(fees);
    } catch (error) {
      res.status(500).json({ message: "Failed to estimate gas fees" });
    }
  });

  app.get("/api/payment/methods", async (req, res) => {
    try {
      const methods = await walletConnector.getPaymentMethods();
      res.json(methods);
    } catch (error) {
      res.status(500).json({ message: "Failed to get payment methods" });
    }
  });

  app.post("/api/payment/initiate", async (req, res) => {
    try {
      const { amount, currency, paymentMethodId, destinationAddress } = req.body;
      const result = await walletConnector.initiatePayment(
        parseFloat(amount),
        currency,
        paymentMethodId,
        destinationAddress
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to initiate payment" });
    }
  });

  app.get("/api/payment/history", async (req, res) => {
    try {
      const history = await walletConnector.getPaymentHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to get payment history" });
    }
  });

  // Coinbase onramp session creation
  app.post('/api/onramp/create-session', async (req, res) => {
    try {
      const {
        addresses,
        assets,
        defaultAsset,
        defaultNetwork,
        presetFiatAmount,
        fiatCurrency,
        redirectUrl,
        partnerUserId
      } = req.body;

      // Create onramp URL with session parameters
      const params = new URLSearchParams({
        projectId: 'omnisphere-project',
        addresses: JSON.stringify(addresses),
        assets: JSON.stringify(assets),
        ...(defaultAsset && { defaultAsset }),
        ...(defaultNetwork && { defaultNetwork }),
        ...(presetFiatAmount && { presetFiatAmount: presetFiatAmount.toString() }),
        ...(fiatCurrency && { fiatCurrency }),
        ...(redirectUrl && { redirectUrl }),
        ...(partnerUserId && { partnerUserId })
      });

      const onrampUrl = `https://pay.coinbase.com/buy?${params.toString()}`;

      res.json({
        success: true,
        onrampUrl,
        sessionId: 'session_' + Date.now()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  app.get("/api/payment/status/:transactionId", async (req, res) => {
    try {
      const { transactionId } = req.params;
      const status = await walletConnector.getTransactionStatus(transactionId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transaction status" });
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

    // Send real-time price updates from authentic data sources
    const priceUpdateInterval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          // Fetch live prices from real market data API
          const prices = await storage.getCryptoPrices();
          
          ws.send(JSON.stringify({
            type: 'priceUpdate',
            data: prices
          }));
        } catch (error) {
          console.error('Error fetching real price data:', error);
          // Send error state to client
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unable to fetch live price data. Please check API configuration.'
          }));
        }
      }
    }, 10000); // Update every 10 seconds with real data

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clearInterval(priceUpdateInterval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(priceUpdateInterval);
    });
  });

  // Smart Contract Integration Routes
  app.get("/api/contract/info", async (req, res) => {
    try {
      const contractInfo = await smartContractManager.getContractInfo();
      res.json(contractInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to get contract information" });
    }
  });

  app.post("/api/contract/validate-wallet", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address required" });
      }

      const validation = await smartContractManager.validateWalletOnChain(walletAddress);
      res.json(validation);
    } catch (error) {
      res.status(500).json({ message: "On-chain validation failed" });
    }
  });

  app.post("/api/contract/x402-payment", async (req, res) => {
    try {
      const { amount, senderAddress } = req.body;
      
      if (!amount || !senderAddress) {
        return res.status(400).json({ 
          message: "Amount and sender address required" 
        });
      }

      const result = await smartContractManager.processX402Payment(
        parseFloat(amount),
        senderAddress
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Payment processing failed" });
    }
  });

  app.post("/api/contract/estimate-gas", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount) {
        return res.status(400).json({ message: "Amount required" });
      }

      const gasEstimate = await smartContractManager.estimateGasForPayment(
        parseFloat(amount)
      );
      
      res.json({ 
        gasEstimate: gasEstimate.toString(),
        estimatedCost: gasEstimate * BigInt(20000000000) // 20 gwei
      });
    } catch (error) {
      res.status(500).json({ message: "Gas estimation failed" });
    }
  });

  // Setup OAuth webhook routes with your UUID
  setupWebhookRoutes(app);

  return httpServer;
}
