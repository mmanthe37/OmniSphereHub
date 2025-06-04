import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, optimism, base } from 'wagmi/chains'
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors'

// WalletConnect Project ID - This would need to be set by the user
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum, optimism, base],
  connectors: [
    injected(), // MetaMask, Rainbow, etc.
    coinbaseWallet({
      appName: 'OmniSphere',
      appLogoUrl: 'https://omnisphere.app/logo.png',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'OmniSphere',
        description: 'The Ultimate Web3 Ecosystem',
        url: 'https://omnisphere.app',
        icons: ['https://omnisphere.app/logo.png']
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}