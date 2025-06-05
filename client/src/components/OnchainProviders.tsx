import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'OmniSphere',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
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