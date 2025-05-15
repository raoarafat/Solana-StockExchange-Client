'use client';

import { useEffect, useState } from 'react';
import { useStockExchange, Transaction } from '@/app/lib/solana';
import { useWallet } from '@solana/wallet-adapter-react';

export function TransactionHistory() {
  const { getTransactions } = useStockExchange();
  const wallet = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!wallet.publicKey) return;

    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const txs = await getTransactions();
        setTransactions(txs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    // Set up polling for new transactions
    const interval = setInterval(fetchTransactions, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [wallet.publicKey, getTransactions]);

  if (!wallet.publicKey) {
    return (
      <div className="p-4 text-center text-gray-500">
        Connect your wallet to view transactions
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Company
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
              Amount
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
              Price
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
              Total
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tx.isBuy
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {tx.isBuy ? 'Buy' : 'Sell'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{tx.company}</td>
              <td className="px-4 py-3 text-sm text-right text-gray-600">
                {tx.amount}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600">
                ${(tx.price / 100).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600">
                ${((tx.price * tx.amount) / 100).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600">
                {new Date(tx.timestamp * 1000).toLocaleString()}
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
