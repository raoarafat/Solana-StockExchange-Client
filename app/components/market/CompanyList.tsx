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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => (
        <Card key={company.symbol}>
          <CardHeader>
            <CardTitle>{company.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Symbol: {company.symbol}</p>
              <p>Price: ${company.currentPrice.toFixed(2)}</p>
              <p>Total Supply: {company.totalSupply.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
