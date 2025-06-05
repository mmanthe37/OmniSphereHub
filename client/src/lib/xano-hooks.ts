import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import xano from "./xano";

// Portfolio Data Hooks
export function usePortfolio(userId: number) {
  return useQuery({
    queryKey: ['/api/portfolio', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/portfolio/${userId}`);
      return data;
    },
    enabled: !!userId
  });
}

export function usePortfolioHoldings(userId: number) {
  return useQuery({
    queryKey: ['/api/portfolio/holdings', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/portfolio/${userId}/holdings`);
      return data;
    },
    enabled: !!userId
  });
}

// Trading Data Hooks
export function useTradingSignals() {
  return useQuery({
    queryKey: ['/api/trading/signals'],
    queryFn: async () => {
      const { data } = await xano.get('/trading/signals');
      return data;
    }
  });
}

export function useOrderBook(symbol: string) {
  return useQuery({
    queryKey: ['/api/trading/orderbook', symbol],
    queryFn: async () => {
      const { data } = await xano.get(`/trading/orderbook/${symbol}`);
      return data;
    },
    enabled: !!symbol
  });
}

export function useTradeHistory(userId: number) {
  return useQuery({
    queryKey: ['/api/trading/history', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/trading/history/${userId}`);
      return data;
    },
    enabled: !!userId
  });
}

// AI Trading Hooks
export function useAITradingStrategies() {
  return useQuery({
    queryKey: ['/api/ai-trading/strategies'],
    queryFn: async () => {
      const { data } = await xano.get('/ai-trading/strategies');
      return data;
    }
  });
}

export function useAIPortfolioAnalytics(userId: number) {
  return useQuery({
    queryKey: ['/api/ai-trading/portfolio', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/ai-trading/portfolio/${userId}`);
      return data;
    },
    enabled: !!userId
  });
}

export function useAITrades(userId: number) {
  return useQuery({
    queryKey: ['/api/ai-trades', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/ai-trades/${userId}`);
      return data;
    },
    enabled: !!userId
  });
}

// DeFi Hooks
export function useDeFiPortfolio(userId: number) {
  return useQuery({
    queryKey: ['/api/defi/portfolio', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/defi/portfolio/${userId}`);
      return data;
    },
    enabled: !!userId
  });
}

export function useDeFiProtocols() {
  return useQuery({
    queryKey: ['/api/defi/protocols'],
    queryFn: async () => {
      const { data } = await xano.get('/defi/protocols');
      return data;
    }
  });
}

export function useDeFiLearningPaths(userId: number) {
  return useQuery({
    queryKey: ['/api/defi/learning', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/defi/learning/${userId}`);
      return data;
    },
    enabled: !!userId
  });
}

// Social/Creator Hooks
export function useSocialPosts(userId?: number) {
  return useQuery({
    queryKey: ['/api/social/posts', userId],
    queryFn: async () => {
      const endpoint = userId ? `/social/posts/${userId}` : '/social/posts';
      const { data } = await xano.get(endpoint);
      return data;
    }
  });
}

export function useCreatorContent(userId: number) {
  return useQuery({
    queryKey: ['/api/creator/content', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/creator/content/${userId}`);
      return data;
    },
    enabled: !!userId
  });
}

// User Authentication Hooks
export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: ['/api/user', userId],
    queryFn: async () => {
      const { data } = await xano.get(`/user/${userId}`);
      return data;
    },
    enabled: !!userId
  });
}

// Wallet Connection Hooks
export function useConnectedWallets() {
  return useQuery({
    queryKey: ['/api/wallet/connected'],
    queryFn: async () => {
      const { data } = await xano.get('/wallet/connected');
      return data;
    }
  });
}

// Mutation Hooks for Data Updates
export function useCreateTrade() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tradeData: any) => {
      const { data } = await xano.post('/trading/execute', tradeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trading'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    }
  });
}

export function useUpdateAIStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ strategyId, updates }: { strategyId: string; updates: any }) => {
      const { data } = await xano.patch(`/ai-trading/strategies/${strategyId}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading'] });
    }
  });
}

export function useStakeDeFi() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (stakeData: any) => {
      const { data } = await xano.post('/defi/stake', stakeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/defi'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    }
  });
}

export function useCreateSocialPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postData: any) => {
      const { data } = await xano.post('/social/posts', postData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social'] });
    }
  });
}