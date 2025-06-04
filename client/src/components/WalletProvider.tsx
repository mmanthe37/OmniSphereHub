import { ReactNode } from 'react'

interface WalletProviderProps {
  children: ReactNode
}

// Simplified wallet provider without wagmi to prevent version conflicts
export function WalletProvider({ children }: WalletProviderProps) {
  return <>{children}</>
}