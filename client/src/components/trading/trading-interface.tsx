import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWebSocket } from "@/lib/websocket";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function TradingInterface() {
  const [selectedPair, setSelectedPair] = useState("ETH/USDT");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("2487.32");
  const [amount, setAmount] = useState("");
  const [priceData, setPriceData] = useState<any[]>([]);
  const { lastMessage } = useWebSocket("/ws");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: trades = [] } = useQuery({
    queryKey: ["/api/trades/1"],
  });

  const createTradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      const response = await apiRequest("POST", "/api/trades", tradeData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trades/1"] });
      setAmount("");
      toast({
        title: "Trade placed",
        description: `${tradeType.toUpperCase()} order for ${amount} ${selectedPair.split('/')[0]} has been placed.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (lastMessage?.type === "priceUpdate") {
      setPriceData(lastMessage.data);
      const ethPrice = lastMessage.data.find((p: any) => p.symbol === "ETH");
      if (ethPrice) {
        setPrice(parseFloat(ethPrice.price).toFixed(2));
      }
    }
  }, [lastMessage]);

  // Chart data from authentic price feeds - requires real-time data
  const chartData = priceData?.length > 0 ? 
    priceData.map((price, i) => ({
      hour: `${new Date().getHours() - (priceData.length - 1 - i)}:00`,
      price: parseFloat(price.price?.toString() || '0'),
    })) : [];

  // Show loading state when no price data is available
  const isLoadingPrices = !priceData || priceData.length === 0;

  // Order book data (requires integration with real DEX APIs)
  const sellOrders: Array<{ price: string; amount: string }> = [];
  const buyOrders: Array<{ price: string; amount: string }> = [];

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    createTradeMutation.mutate({
      userId: 1,
      symbol: selectedPair,
      side: tradeType,
      amount: amount,
      price: price,
    });
  };

  const currentPrice = priceData.find(p => p.symbol === "ETH")?.price || price;
  const priceChange = priceData.find(p => p.symbol === "ETH")?.change24h || "+3.24";
  const isPositiveChange = parseFloat(priceChange) >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Trading Chart */}
      <Card className="lg:col-span-3 bg-dark-card border-dark-border">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">{selectedPair}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-mono font-bold text-neon-green">
                  ${formatNumber(currentPrice)}
                </span>
                <span className={`text-sm ${isPositiveChange ? 'text-neon-green' : 'text-red-400'}`}>
                  {isPositiveChange ? '+' : ''}{priceChange}%
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="bg-dark-primary">1m</Button>
              <Button size="sm" className="bg-neon-cyan text-dark-primary">5m</Button>
              <Button variant="ghost" size="sm" className="bg-dark-primary">1h</Button>
              <Button variant="ghost" size="sm" className="bg-dark-primary">1d</Button>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="hour" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#B8BCC8' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#B8BCC8' }}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#2A2D47',
                    border: '1px solid #404469',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                  formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00FFA3" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#00FFA3' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Order Book & Trade Form */}
      <div className="space-y-6">
        {/* Order Book */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Order Book</h4>
            <div className="space-y-1 text-sm font-mono">
              {/* Sell Orders */}
              <div className="text-red-400 mb-2">Sell Orders</div>
              {sellOrders.map((order, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-red-400">{order.price}</span>
                  <span className="text-text-secondary">{order.amount}</span>
                </div>
              ))}
              
              {/* Current Price */}
              <div className="border-t border-b border-dark-border py-2 my-2">
                <div className="flex justify-center">
                  <span className="text-neon-green font-bold">
                    {formatNumber(currentPrice)}
                  </span>
                </div>
              </div>
              
              {/* Buy Orders */}
              <div className="text-neon-green mb-2">Buy Orders</div>
              {buyOrders.map((order, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-neon-green">{order.price}</span>
                  <span className="text-text-secondary">{order.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Trade Form */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-4">
            <div className="flex space-x-1 mb-4">
              <Button 
                onClick={() => setTradeType("buy")}
                className={`flex-1 py-2 rounded font-medium ${
                  tradeType === "buy" 
                    ? "bg-neon-green text-dark-primary" 
                    : "bg-dark-primary text-neon-green hover:bg-dark-border"
                }`}
              >
                Buy
              </Button>
              <Button 
                onClick={() => setTradeType("sell")}
                className={`flex-1 py-2 rounded font-medium ${
                  tradeType === "sell" 
                    ? "bg-red-500 text-white" 
                    : "bg-dark-primary text-red-400 hover:bg-dark-border"
                }`}
              >
                Sell
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-text-secondary">Price</Label>
                <Input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              <div>
                <Label className="text-sm text-text-secondary">Amount</Label>
                <Input 
                  type="text" 
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              <div>
                <Label className="text-sm text-text-secondary">Total</Label>
                <Input 
                  type="text" 
                  value={amount ? `${(parseFloat(amount) * parseFloat(price)).toFixed(2)} USDT` : "0.00 USDT"}
                  readOnly
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              
              <Button 
                onClick={handleTrade}
                disabled={createTradeMutation.isPending || !amount}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  tradeType === "buy"
                    ? "bg-gradient-to-r from-neon-green to-neon-cyan text-dark-primary hover:shadow-neon-green"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-red-500"
                }`}
              >
                {createTradeMutation.isPending 
                  ? "Placing Order..." 
                  : `${tradeType === "buy" ? "Buy" : "Sell"} ${selectedPair.split('/')[0]}`
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Open Orders & Trade History */}
      <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Open Orders</h3>
            <div className="space-y-3">
              {trades.filter((trade: any) => trade.status === "open").map((trade: any) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                  <div>
                    <p className={`font-medium ${trade.side === "buy" ? "text-neon-green" : "text-red-400"}`}>
                      {trade.side === "buy" ? "Buy" : "Sell"} {trade.symbol.split('/')[0]}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {trade.amount} {trade.symbol.split('/')[0]} @ ${formatNumber(trade.price)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    Cancel
                  </Button>
                </div>
              ))}
              {trades.filter((trade: any) => trade.status === "open").length === 0 && (
                <p className="text-text-secondary text-center py-4">No open orders</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trade History</h3>
            <div className="space-y-3">
              {trades.filter((trade: any) => trade.status === "filled").slice(0, 5).map((trade: any) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                  <div>
                    <p className={`font-medium ${trade.side === "buy" ? "text-neon-green" : "text-red-400"}`}>
                      {trade.side === "buy" ? "Bought" : "Sold"} {trade.symbol.split('/')[0]}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {new Date(trade.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono">{trade.amount} {trade.symbol.split('/')[0]}</p>
                    {trade.profit && (
                      <p className={`text-sm ${parseFloat(trade.profit) >= 0 ? "text-neon-green" : "text-red-400"}`}>
                        {parseFloat(trade.profit) >= 0 ? "+" : ""}{formatCurrency(trade.profit)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {trades.filter((trade: any) => trade.status === "filled").length === 0 && (
                <p className="text-text-secondary text-center py-4">No trade history</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
