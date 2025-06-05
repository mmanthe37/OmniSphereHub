import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia, mainnet, arbitrum, optimism, polygon } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';
import { ReactNode } from 'react';

// Define additional chains from your configuration
const lineaMainnet = {
  id: 59144,
  name: 'Linea Mainnet',
  network: 'linea-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Linea Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.walletconnect.org/v1/?chainId=eip155%3A59144&projectId=9e280a80328f22e4c4a23593c554388d'],
    },
    public: {
      http: ['https://rpc.walletconnect.org/v1/?chainId=eip155%3A59144&projectId=9e280a80328f22e4c4a23593c554388d'],
    },
  },
  blockExplorers: {
    default: { name: 'LineaScan', url: 'https://lineascan.build' },
  },
  testnet: false,
} as const;

const zksyncEra = {
  id: 324,
  name: 'ZKsync Era',
  network: 'zksync-era',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.walletconnect.org/v1/?chainId=eip155%3A324&projectId=9e280a80328f22e4c4a23593c554388d'],
    },
    public: {
      http: ['https://rpc.walletconnect.org/v1/?chainId=eip155%3A324&projectId=9e280a80328f22e4c4a23593c554388d'],
    },
  },
  blockExplorers: {
    default: { name: 'ZKsync Explorer', url: 'https://era.zksync.network/' },
  },
  testnet: false,
} as const;

const scroll = {
  id: 534352,
  name: 'Scroll',
  network: 'scroll',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.scroll.io'],
    },
    public: {
      http: ['https://rpc.scroll.io'],
    },
  },
  blockExplorers: {
    default: { name: 'ScrollScan', url: 'https://scrollscan.com' },
  },
  testnet: false,
} as const;

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'OmniSphere',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

interface OnchainProvidersProps {
  children: ReactNode;
}

export function OnchainProviders({ children }: OnchainProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: 'dark',
              theme: 'cyberpunk',
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}