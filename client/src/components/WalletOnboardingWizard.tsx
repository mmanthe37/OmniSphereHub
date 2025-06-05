import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, 
  Shield, 
  Smartphone, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Info,
  Star,
  Zap,
  Lock,
  Globe,
  Download,
  QrCode,
  Copy,
  ExternalLink,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { SiMetabase } from 'react-icons/si';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { walletManager } from '@/lib/walletConnection';

interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'browser' | 'mobile' | 'hardware' | 'institutional';
  supported: boolean;
  deepLink?: string;
  downloadUrl?: string;
  features: string[];
  security: 'high' | 'medium' | 'low';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface WalletOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (wallet: any) => void;
}

export function WalletOnboardingWizard({ isOpen, onClose, onWalletConnected }: WalletOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState<WalletProvider | null>(null);
  const [userExperience, setUserExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [securityPreference, setSecurityPreference] = useState<'high' | 'medium' | 'low'>('high');
  const [primaryUseCase, setPrimaryUseCase] = useState('');
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [showBackupGuide, setShowBackupGuide] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to OmniSphere',
      description: 'Let\'s set up your Web3 wallet for secure blockchain interactions',
      completed: currentStep > 0
    },
    {
      id: 'experience',
      title: 'Your Experience Level',
      description: 'Help us customize your wallet setup experience',
      completed: currentStep > 1
    },
    {
      id: 'requirements',
      title: 'Security & Requirements',
      description: 'Define your security preferences and use cases',
      completed: currentStep > 2
    },
    {
      id: 'selection',
      title: 'Choose Your Wallet',
      description: 'Select the best wallet option for your needs',
      completed: currentStep > 3
    },
    {
      id: 'setup',
      title: 'Wallet Setup',
      description: 'Install and configure your chosen wallet',
      completed: currentStep > 4
    },
    {
      id: 'security',
      title: 'Security Setup',
      description: 'Secure your wallet with backup and recovery options',
      completed: currentStep > 5
    },
    {
      id: 'connection',
      title: 'Connect Wallet',
      description: 'Connect your wallet to OmniSphere',
      completed: currentStep > 6
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'Your wallet is ready for Web3 interactions',
      completed: currentStep > 7
    }
  ];

  // Fetch wallet providers
  const { data: walletProviders = [] } = useQuery({
    queryKey: ['/api/wallet/providers'],
    enabled: isOpen
  });

  // Browser-based wallet connection
  const connectWalletMutation = useMutation({
    mutationFn: async (walletId: string) => {
      return await walletManager.connectWallet(walletId);
    },
    onSuccess: (walletData: any) => {
      setConnectionProgress(100);
      toast({
        title: "Wallet Connected Successfully",
        description: `Your ${selectedWallet?.name} wallet is now connected with gasless transactions enabled`
      });
      
      const wallet = {
        address: walletData.address,
        provider: walletData.provider,
        chainId: walletData.chainId,
        balance: walletData.balance,
        network: walletData.chainId === 1 ? 'ethereum' : walletData.chainId === 101 ? 'solana' : 'base',
        isConnected: true,
        lastConnected: new Date()
      };
      
      onWalletConnected(wallet);
      setCurrentStep(7);
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/connected'] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed", 
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
      setConnectionProgress(0);
    }
  });

  const getRecommendedWallets = () => {
    return walletProviders
      .filter((provider: WalletProvider) => {
        if (userExperience === 'beginner') {
          return provider.difficulty === 'beginner' && provider.supported;
        }
        if (securityPreference === 'high') {
          return provider.security === 'high' && provider.supported;
        }
        return provider.supported;
      })
      .sort((a: WalletProvider, b: WalletProvider) => {
        // Priority: security level, then difficulty match
        if (a.security !== b.security) {
          const securityOrder = { high: 3, medium: 2, low: 1 };
          return securityOrder[b.security] - securityOrder[a.security];
        }
        return a.name.localeCompare(b.name);
      });
  };

  const getWalletIcon = (provider: WalletProvider) => {
    switch (provider.id) {
      case 'metamask':
        return <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>;
      case 'walletconnect':
        return <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">W</div>;
      case 'coinbase':
        return <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>;
      case 'phantom':
        return <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>;
      default:
        return <Wallet className="w-8 h-8" />;
    }
  };

  const handleWalletConnect = async () => {
    if (!selectedWallet) return;
    
    setConnectionProgress(20);
    
    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 80) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    connectWalletMutation.mutate(selectedWallet.id);
  }

  const handleBuyCrypto = async () => {
    try {
      // Create onramp session with user's connected wallet address
      const response = await apiRequest("POST", "/api/onramp/create-session", {
        addresses: { "base": ["0x1"] }, // Will be replaced with actual wallet address
        assets: ["USDC"],
        defaultAsset: "USDC",
        defaultNetwork: "base",
        presetFiatAmount: 20,
        fiatCurrency: "USD",
        redirectUrl: `${window.location.origin}/onramp-return`
      });

      if (response.ok) {
        const { onrampUrl } = await response.json();
        window.open(onrampUrl, '_blank', 'width=600,height=700');
      } else {
        // Fallback to direct URL if session creation fails
        const fallbackUrl = `https://pay.coinbase.com/buy?addresses=%7B%220x1%22%3A%5B%22base%22%5D%7D&appId=omnisphere-project&assets=%5B%22USDC%22%5D&fiatCurrency=USD&presetFiatAmount=20&redirectUrl=${encodeURIComponent(window.location.origin + '/onramp-return')}`;
        window.open(fallbackUrl, '_blank', 'width=600,height=700');
      }
    } catch (error) {
      toast({
        title: "Onramp Error",
        description: "Unable to open crypto purchase flow. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Wallet className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Web3 with OmniSphere</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We'll guide you through setting up a secure Web3 wallet to access decentralized finance, 
          NFTs, and blockchain applications safely.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="text-center">
          <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-sm font-medium">Secure</p>
          <p className="text-xs text-muted-foreground">Bank-level security</p>
        </div>
        <div className="text-center">
          <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <p className="text-sm font-medium">Fast</p>
          <p className="text-xs text-muted-foreground">Quick setup</p>
        </div>
        <div className="text-center">
          <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-sm font-medium">Global</p>
          <p className="text-xs text-muted-foreground">Access anywhere</p>
        </div>
      </div>
    </div>
  );

  const renderExperienceStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">What's your Web3 experience level?</h2>
        <p className="text-muted-foreground">
          This helps us customize the setup process and recommend the best wallet for you.
        </p>
      </div>
      <div className="space-y-3">
        {[
          { value: 'beginner', title: 'New to Web3', desc: 'First time using blockchain applications' },
          { value: 'intermediate', title: 'Some Experience', desc: 'Used crypto apps before, familiar with basics' },
          { value: 'advanced', title: 'Experienced User', desc: 'Comfortable with DeFi, NFTs, and complex transactions' }
        ].map((option) => (
          <Card 
            key={option.value}
            className={`cursor-pointer transition-all ${
              userExperience === option.value ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setUserExperience(option.value as any)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </div>
                {userExperience === option.value && <CheckCircle className="w-5 h-5 text-blue-600" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRequirementsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Security & Use Case Preferences</h2>
        <p className="text-muted-foreground">
          Tell us about your security preferences and intended use.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="security" className="text-base font-medium">Security Priority</Label>
          <Select value={securityPreference} onValueChange={(value) => setSecurityPreference(value as any)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select security level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Maximum Security (Hardware wallet recommended)</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-yellow-600" />
                  <span>Balanced Security (Browser extension)</span>
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Convenience First (Mobile wallet)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="usecase" className="text-base font-medium">Primary Use Case</Label>
          <Select value={primaryUseCase} onValueChange={setPrimaryUseCase}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="What will you mainly use OmniSphere for?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trading">Trading & DeFi</SelectItem>
              <SelectItem value="nfts">NFT Collection & Creation</SelectItem>
              <SelectItem value="social">Social Finance & Networking</SelectItem>
              <SelectItem value="staking">Yield Farming & Staking</SelectItem>
              <SelectItem value="gaming">Gaming & Metaverse</SelectItem>
              <SelectItem value="payments">Payments & Transfers</SelectItem>
              <SelectItem value="everything">Everything - Full Web3 Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderWalletSelection = () => {
    const recommended = getRecommendedWallets();
    const others = walletProviders.filter((p: WalletProvider) => !recommended.includes(p) && p.supported);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Choose Your Wallet</h2>
          <p className="text-muted-foreground">
            Based on your preferences, here are the best wallet options for you.
          </p>
        </div>

        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
            <TabsTrigger value="all">All Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="space-y-3">
            {recommended.length > 0 ? (
              recommended.map((provider: WalletProvider) => (
                <WalletOption 
                  key={provider.id} 
                  provider={provider} 
                  isSelected={selectedWallet?.id === provider.id}
                  onSelect={() => setSelectedWallet(provider)}
                  isRecommended
                />
              ))
            ) : (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  No wallets match your exact preferences. Check "All Options" for available wallets.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-3">
            {[...recommended, ...others].map((provider: WalletProvider) => (
              <WalletOption 
                key={provider.id} 
                provider={provider} 
                isSelected={selectedWallet?.id === provider.id}
                onSelect={() => setSelectedWallet(provider)}
                isRecommended={recommended.includes(provider)}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderSetupStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Install {selectedWallet?.name}</h2>
        <p className="text-muted-foreground">
          Follow these steps to install and set up your wallet.
        </p>
      </div>

      {selectedWallet && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              {getWalletIcon(selectedWallet)}
              <div>
                <CardTitle>{selectedWallet.name}</CardTitle>
                <CardDescription>{selectedWallet.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium">Download & Install</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedWallet.category === 'browser' ? 
                      'Install the browser extension from the official store' :
                      'Download the mobile app from your device\'s app store'
                    }
                  </p>
                  {selectedWallet.downloadUrl && (
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a href={selectedWallet.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download {selectedWallet.name}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium">Create New Wallet</p>
                  <p className="text-sm text-muted-foreground">
                    Open the app and select "Create New Wallet" option.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-medium">Secure Your Wallet</p>
                  <p className="text-sm text-muted-foreground">
                    Write down your recovery phrase and store it safely offline.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                <div>
                  <p className="font-medium">Set Strong Password</p>
                  <p className="text-sm text-muted-foreground">
                    Create a strong password to protect your wallet locally.
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>Important:</strong> Never share your recovery phrase with anyone. 
                OmniSphere will never ask for your private keys or recovery phrase.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSecurityStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Secure Your Wallet</h2>
        <p className="text-muted-foreground">
          Ensure your wallet is properly backed up and secured.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Backup Verification</span>
          </CardTitle>
          <CardDescription>
            Verify that you've properly backed up your recovery phrase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recovery-phrase">Enter your 12-24 word recovery phrase</Label>
            <Textarea
              id="recovery-phrase"
              placeholder="word1 word2 word3 ..."
              value={recoveryPhrase}
              onChange={(e) => setRecoveryPhrase(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This verification ensures you've copied your recovery phrase correctly. 
              We don't store this information.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-phrase">Confirm by typing it again</Label>
            <Textarea
              id="confirm-phrase"
              placeholder="word1 word2 word3 ..."
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {recoveryPhrase && confirmPhrase && (
            <Alert className={recoveryPhrase === confirmPhrase ? "border-green-500" : "border-red-500"}>
              {recoveryPhrase === confirmPhrase ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Recovery phrases match! Your backup is verified.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    Recovery phrases don't match. Please check and try again.
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Do</p>
                <p className="text-sm text-muted-foreground">
                  Store recovery phrase offline in a secure location
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Don't</p>
                <p className="text-sm text-muted-foreground">
                  Share phrase online or store in digital format
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderConnectionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Connect to OmniSphere</h2>
        <p className="text-muted-foreground">
          Connect your {selectedWallet?.name} wallet to access all OmniSphere features.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {selectedWallet && getWalletIcon(selectedWallet)}
            </div>
            
            <div>
              <h3 className="font-semibold">{selectedWallet?.name}</h3>
              <p className="text-sm text-muted-foreground">Ready to connect</p>
            </div>

            {connectionProgress > 0 && (
              <div className="space-y-2">
                <Progress value={connectionProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {connectionProgress < 50 ? 'Initializing connection...' :
                   connectionProgress < 80 ? 'Verifying wallet...' :
                   connectionProgress < 100 ? 'Finalizing setup...' :
                   'Connected successfully!'}
                </p>
              </div>
            )}

            <Button 
              onClick={handleWalletConnect}
              disabled={connectWalletMutation.isPending || connectionProgress === 100}
              className="w-full"
            >
              {connectWalletMutation.isPending ? 'Connecting...' :
               connectionProgress === 100 ? 'Connected!' :
               `Connect ${selectedWallet?.name}`}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          A popup will appear asking for permission to connect. Click "Connect" to proceed.
          OmniSphere can only see your wallet address, not your private keys.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Wallet Setup Complete!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your {selectedWallet?.name} wallet is now connected to OmniSphere. 
          You're ready to explore the full Web3 ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        <Card className="cursor-pointer hover:bg-gray-800" onClick={handleBuyCrypto}>
          <CardContent className="p-4 text-center">
            <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-medium">Buy Crypto</p>
            <p className="text-xs text-muted-foreground">Via Coinbase</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="font-medium">Start Trading</p>
            <p className="text-xs text-muted-foreground">Access OmniTrade</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-blue-500">Gasless Transactions Enabled</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Your wallet is configured with OmniSphere's paymaster for zero gas fees on Base network transactions.
        </p>
      </div>

      <Button onClick={onClose} className="w-full max-w-sm">
        Enter OmniSphere
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderWelcomeStep();
      case 1: return renderExperienceStep();
      case 2: return renderRequirementsStep();
      case 3: return renderWalletSelection();
      case 4: return renderSetupStep();
      case 5: return renderSecurityStep();
      case 6: return renderConnectionStep();
      case 7: return renderCompleteStep();
      default: return renderWelcomeStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return userExperience.length > 0;
      case 2: return securityPreference.length > 0 && primaryUseCase.length > 0;
      case 3: return selectedWallet !== null;
      case 4: return true;
      case 5: return recoveryPhrase === confirmPhrase && recoveryPhrase.length > 0;
      case 6: return connectionProgress === 100;
      case 7: return true;
      default: return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Wallet Setup Wizard</span>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-8 h-0.5 mx-2 transition-colors ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={onClose}>
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for wallet options
function WalletOption({ 
  provider, 
  isSelected, 
  onSelect, 
  isRecommended 
}: { 
  provider: WalletProvider; 
  isSelected: boolean; 
  onSelect: () => void;
  isRecommended: boolean;
}) {
  const getWalletIcon = (provider: WalletProvider) => {
    switch (provider.id) {
      case 'metamask':
        return <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">M</div>;
      case 'walletconnect':
        return <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">W</div>;
      case 'coinbase':
        return <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">C</div>;
      case 'phantom':
        return <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>;
      default:
        return <Wallet className="w-6 h-6" />;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWalletIcon(provider)}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{provider.name}</h3>
                {isRecommended && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{provider.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span className="text-xs capitalize">{provider.security} Security</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3" />
                  <span className="text-xs capitalize">{provider.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
          {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
        </div>
      </CardContent>
    </Card>
  );
}