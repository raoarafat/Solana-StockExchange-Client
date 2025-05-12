'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Company {
  name: string;
  symbol: string;
  currentPrice: number;
  totalSupply: number;
}

export function CompanyList() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (!wallet.publicKey) return;

    const fetchCompanies = async () => {
      // Fetch companies from the program
      // This is a placeholder - you'll need to implement the actual fetching logic
      const mockCompanies: Company[] = [
        {
          name: 'Apple Inc.',
          symbol: 'AAPL',
          currentPrice: 150.25,
          totalSupply: 1000000,
        },
        {
          name: 'Tesla Inc.',
          symbol: 'TSLA',
          currentPrice: 250.75,
          totalSupply: 500000,
        },
      ];
      setCompanies(mockCompanies);
    };

    fetchCompanies();
  }, [wallet.publicKey, connection]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Companies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((company) => (
          <Card
            key={company.symbol}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Symbol: {company.symbol}
                </p>
                <p className="text-lg font-semibold">
                  ${company.currentPrice.toFixed(2)}
                </p>
                <p className="text-sm">
                  Total Supply: {company.totalSupply.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
