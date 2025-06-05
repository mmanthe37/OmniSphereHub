// User Permission System for OmniSphere
export enum UserType {
  GUEST = 'guest',
  FREE = 'free',
  PAID = 'paid'
}

export interface UserPermissions {
  // Portfolio Management
  canViewPortfolio: boolean;
  canAddHoldings: boolean;
  canExportPortfolio: boolean;
  maxHoldings: number;
  
  // Trading Features
  canViewMarkets: boolean;
  canExecuteTrades: boolean;
  canUseAdvancedOrderTypes: boolean;
  canAccessPremiumCharts: boolean;
  tradingFeeLimits: number; // Maximum monthly trading volume
  
  // AI Trading Bot
  canViewAIInsights: boolean;
  canEnableAutoTrading: boolean;
  canCustomizeStrategies: boolean;
  maxAITrades: number; // per month
  
  // DeFi Features
  canViewDeFiProtocols: boolean;
  canStakeTokens: boolean;
  canProvideLiquidity: boolean;
  canViewYieldFarms: boolean;
  
  // Social Features
  canViewSocialFeed: boolean;
  canCreatePosts: boolean;
  canFollowUsers: boolean;
  canJoinGroups: boolean;
  
  // Data Access
  canViewRealTimeData: boolean;
  canExportData: boolean;
  canAccessHistoricalData: boolean;
  historicalDataDays: number;
  
  // General Platform
  canSavePreferences: boolean;
  canReceiveNotifications: boolean;
  canAccessSupport: boolean;
  supportLevel: 'community' | 'email' | 'priority';
}

export class UserPermissionService {
  static getPermissions(userType: UserType): UserPermissions {
    switch (userType) {
      case UserType.GUEST:
        return {
          // Portfolio Management - View Only
          canViewPortfolio: false,
          canAddHoldings: false,
          canExportPortfolio: false,
          maxHoldings: 0,
          
          // Trading Features - View Markets Only
          canViewMarkets: true,
          canExecuteTrades: false,
          canUseAdvancedOrderTypes: false,
          canAccessPremiumCharts: false,
          tradingFeeLimits: 0,
          
          // AI Trading Bot - Basic Insights Only
          canViewAIInsights: true,
          canEnableAutoTrading: false,
          canCustomizeStrategies: false,
          maxAITrades: 0,
          
          // DeFi Features - View Only
          canViewDeFiProtocols: true,
          canStakeTokens: false,
          canProvideLiquidity: false,
          canViewYieldFarms: true,
          
          // Social Features - View Only
          canViewSocialFeed: true,
          canCreatePosts: false,
          canFollowUsers: false,
          canJoinGroups: false,
          
          // Data Access - Limited
          canViewRealTimeData: true,
          canExportData: false,
          canAccessHistoricalData: true,
          historicalDataDays: 7,
          
          // General Platform - Basic
          canSavePreferences: false,
          canReceiveNotifications: false,
          canAccessSupport: true,
          supportLevel: 'community'
        };
        
      case UserType.FREE:
        return {
          // Portfolio Management - Basic
          canViewPortfolio: true,
          canAddHoldings: true,
          canExportPortfolio: false,
          maxHoldings: 10,
          
          // Trading Features - Limited
          canViewMarkets: true,
          canExecuteTrades: true,
          canUseAdvancedOrderTypes: false,
          canAccessPremiumCharts: false,
          tradingFeeLimits: 1000, // $1,000 monthly
          
          // AI Trading Bot - Basic
          canViewAIInsights: true,
          canEnableAutoTrading: true,
          canCustomizeStrategies: false,
          maxAITrades: 5,
          
          // DeFi Features - Limited
          canViewDeFiProtocols: true,
          canStakeTokens: true,
          canProvideLiquidity: false,
          canViewYieldFarms: true,
          
          // Social Features - Basic
          canViewSocialFeed: true,
          canCreatePosts: true,
          canFollowUsers: true,
          canJoinGroups: false,
          
          // Data Access - Standard
          canViewRealTimeData: true,
          canExportData: true,
          canAccessHistoricalData: true,
          historicalDataDays: 30,
          
          // General Platform - Standard
          canSavePreferences: true,
          canReceiveNotifications: true,
          canAccessSupport: true,
          supportLevel: 'email'
        };
        
      case UserType.PAID:
        return {
          // Portfolio Management - Full
          canViewPortfolio: true,
          canAddHoldings: true,
          canExportPortfolio: true,
          maxHoldings: -1, // unlimited
          
          // Trading Features - Full
          canViewMarkets: true,
          canExecuteTrades: true,
          canUseAdvancedOrderTypes: true,
          canAccessPremiumCharts: true,
          tradingFeeLimits: -1, // unlimited
          
          // AI Trading Bot - Full
          canViewAIInsights: true,
          canEnableAutoTrading: true,
          canCustomizeStrategies: true,
          maxAITrades: -1, // unlimited
          
          // DeFi Features - Full
          canViewDeFiProtocols: true,
          canStakeTokens: true,
          canProvideLiquidity: true,
          canViewYieldFarms: true,
          
          // Social Features - Full
          canViewSocialFeed: true,
          canCreatePosts: true,
          canFollowUsers: true,
          canJoinGroups: true,
          
          // Data Access - Premium
          canViewRealTimeData: true,
          canExportData: true,
          canAccessHistoricalData: true,
          historicalDataDays: -1, // unlimited
          
          // General Platform - Premium
          canSavePreferences: true,
          canReceiveNotifications: true,
          canAccessSupport: true,
          supportLevel: 'priority'
        };
        
      default:
        return this.getPermissions(UserType.GUEST);
    }
  }
  
  static getUserType(user: any): UserType {
    if (!user) return UserType.GUEST;
    
    // Check if user has paid subscription
    if (user.subscription?.plan === 'premium' || user.subscription?.plan === 'pro') {
      return UserType.PAID;
    }
    
    // Check if user is authenticated (has account)
    if (user.id) {
      return UserType.FREE;
    }
    
    return UserType.GUEST;
  }
  
  static canAccess(feature: keyof UserPermissions, userType: UserType): boolean {
    const permissions = this.getPermissions(userType);
    return Boolean(permissions[feature]);
  }
  
  static getFeatureLimit(feature: keyof UserPermissions, userType: UserType): number {
    const permissions = this.getPermissions(userType);
    const value = permissions[feature];
    return typeof value === 'number' ? value : 0;
  }
}

// Permission checking hooks and utilities
export function useUserPermissions() {
  // This would integrate with your auth context
  const userType = UserType.GUEST; // Replace with actual user type detection
  const permissions = UserPermissionService.getPermissions(userType);
  
  return {
    userType,
    permissions,
    canAccess: (feature: keyof UserPermissions) => 
      UserPermissionService.canAccess(feature, userType),
    getLimit: (feature: keyof UserPermissions) => 
      UserPermissionService.getFeatureLimit(feature, userType)
  };
}