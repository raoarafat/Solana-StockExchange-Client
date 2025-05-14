'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { BuyDialog } from './BuyDialog';

interface Company {
  name: string;
  symbol: string;
  currentPrice: number;
  totalSupply: number;
  change24h: number;
  volume24h: number;
  buyPrice: number;
  sellPrice: number;
}

export function CompanyList() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Company;
    direction: 'asc' | 'desc';
  }>({ key: 'symbol', direction: 'asc' });

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
          change24h: 2.5,
          volume24h: 5000000,
          buyPrice: 150.2,
          sellPrice: 150.3,
        },
        {
          name: 'Tesla Inc.',
          symbol: 'TSLA',
          currentPrice: 250.75,
          totalSupply: 500000,
          change24h: -1.2,
          volume24h: 3000000,
          buyPrice: 250.7,
          sellPrice: 250.8,
        },
        {
          name: 'Microsoft Corp.',
          symbol: 'MSFT',
          currentPrice: 280.5,
          totalSupply: 800000,
          change24h: 1.8,
          volume24h: 4000000,
          buyPrice: 280.45,
          sellPrice: 280.55,
        },
      ];
      setCompanies(mockCompanies);
    };

    fetchCompanies();
  }, [wallet.publicKey, connection]);

  const sortedCompanies = [...companies].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const requestSort = (key: keyof Company) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                <button
                  onClick={() => requestSort('symbol')}
                  className="flex items-center space-x-1 hover:text-gray-900"
                >
                  <span>Symbol</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                <button
                  onClick={() => requestSort('name')}
                  className="flex items-center space-x-1 hover:text-gray-900"
                >
                  <span>Name</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                <button
                  onClick={() => requestSort('currentPrice')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-900"
                >
                  <span>Last Price</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                <button
                  onClick={() => requestSort('buyPrice')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-900"
                >
                  <span>Buy</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                <button
                  onClick={() => requestSort('sellPrice')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-900"
                >
                  <span>Sell</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                <button
                  onClick={() => requestSort('change24h')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-900"
                >
                  <span>24h Change</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                <button
                  onClick={() => requestSort('volume24h')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-900"
                >
                  <span>24h Volume</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map((company) => (
              <tr
                key={company.symbol}
                onClick={() => handleRowClick(company)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {company.symbol}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {company.name}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                  ${company.currentPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                  ${company.buyPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                  ${company.sellPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span
                    className={`flex items-center justify-end space-x-1 ${
                      company.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {company.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(company.change24h).toFixed(2)}%</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">
                  ${company.volume24h.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCompany && (
        <BuyDialog
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
          company={selectedCompany}
        />
      )}
    </>
  );
}
