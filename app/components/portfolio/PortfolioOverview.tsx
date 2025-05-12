'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PortfolioStats {
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
}

export function PortfolioOverview() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalProfit: 0,
    profitPercentage: 0,
  });

  useEffect(() => {
    if (!wallet.publicKey) return;

    const fetchPortfolioStats = async () => {
      // Fetch portfolio stats from the program
      // This is a placeholder - you'll need to implement the actual fetching logic
      const mockStats: PortfolioStats = {
        totalValue: 15000.0,
        totalProfit: 1500.0,
        profitPercentage: 10.0,
      };
      setStats(mockStats);
    };

    fetchPortfolioStats();
  }, [wallet.publicKey, connection]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              stats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            ${stats.totalProfit.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profit/Loss %</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              stats.profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {stats.profitPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
