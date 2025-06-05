import React, { createContext, useContext, useEffect, useState } from 'react';
import { XanoAuthService, type XanoUser } from '@/lib/xano-auth';

interface AuthContextType {
  user: XanoUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<XanoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (XanoAuthService.isAuthenticated()) {
        const userData = await XanoAuthService.me();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      XanoAuthService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user: userData } = await XanoAuthService.login(email, password);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { user: userData } = await XanoAuthService.signup(email, password, name);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    XanoAuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};