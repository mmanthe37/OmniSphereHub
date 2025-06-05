import { useEffect, useState } from 'react';
import { CheckCircle, CreditCard, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function OnrampReturn() {
  const [, setLocation] = useLocation();
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    // Parse URL parameters to get transaction details
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transaction_id');
    const status = urlParams.get('status');
    const amount = urlParams.get('amount');
    const asset = urlParams.get('asset');

    if (transactionId) {
      setTransactionData({
        id: transactionId,
        status: status || 'completed',
        amount: amount || '20',
        asset: asset || 'USDC'
      });
    }
  }, []);

  const handleReturnToApp = () => {
    setLocation('/');
  };

  const handleViewWallet = () => {
    setLocation('/trade');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Purchase Complete!</h1>
          <p className="text-gray-400">
            Your crypto purchase has been successfully processed.
          </p>
        </div>

        {transactionData && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="w-5 h-5" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white font-medium">
                  ${transactionData.amount} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset:</span>
                <span className="text-white font-medium">{transactionData.asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-medium capitalize">
                  {transactionData.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-white font-mono text-xs">
                  {transactionData.id.slice(0, 8)}...{transactionData.id.slice(-8)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-blue-500">Gasless Transactions Ready</h3>
            </div>
            <p className="text-sm text-gray-400">
              Your purchased crypto can be used with zero gas fees on the Base network through OmniSphere's paymaster system.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleReturnToApp}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Return to App
          </Button>
          <Button
            onClick={handleViewWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Wallet
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            It may take a few minutes for your crypto to appear in your wallet.
          </p>
        </div>
      </div>
    </div>
  );
}