'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Holding {
  symbol: string;
  name: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export function HoldingsList() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    if (!wallet.publicKey) return;

    const fetchHoldings = async () => {
      // Fetch holdings from the program
      // This is a placeholder - you'll need to implement the actual fetching logic
      const mockHoldings: Holding[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          amount: 100,
          averagePrice: 140.0,
          currentPrice: 150.25,
          totalValue: 15025.0,
          profitLoss: 1025.0,
          profitLossPercentage: 7.32,
        },
        {
          symbol: 'TSLA',
          name: 'Tesla Inc.',
          amount: 50,
          averagePrice: 240.0,
          currentPrice: 250.75,
          totalValue: 12537.5,
          profitLoss: 537.5,
          profitLossPercentage: 4.48,
        },
      ];
      setHoldings(mockHoldings);
    };

    fetchHoldings();
  }, [wallet.publicKey, connection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {holdings.map((holding) => (
            <div
              key={holding.symbol}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <h3 className="font-semibold">{holding.name}</h3>
                <p className="text-sm text-gray-500">{holding.symbol}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold">
                  ${holding.totalValue.toFixed(2)}
                </p>
                <p
                  className={`text-sm ${
                    holding.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {holding.profitLoss >= 0 ? '+' : ''}
                  {holding.profitLossPercentage.toFixed(2)}%
                </p>
              </div>
              <Button variant="outline" size="sm">
                Sell
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
