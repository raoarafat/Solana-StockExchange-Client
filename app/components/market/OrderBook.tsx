'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Order {
  price: number;
  amount: number;
  type: 'buy' | 'sell';
}

export function OrderBook() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!wallet.publicKey) return;

    const fetchOrders = async () => {
      // Fetch orders from the program
      // This is a placeholder - you'll need to implement the actual fetching logic
      const mockBuyOrders: Order[] = [
        { price: 150.0, amount: 100, type: 'buy' },
        { price: 149.5, amount: 200, type: 'buy' },
      ];
      const mockSellOrders: Order[] = [
        { price: 150.5, amount: 150, type: 'sell' },
        { price: 151.0, amount: 300, type: 'sell' },
      ];
      setBuyOrders(mockBuyOrders);
      setSellOrders(mockSellOrders);
    };

    fetchOrders();
  }, [wallet.publicKey, connection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Sell Orders</h3>
            <div className="space-y-1">
              {sellOrders.map((order, index) => (
                <div key={index} className="flex justify-between text-red-500">
                  <span>{order.price.toFixed(2)}</span>
                  <span>{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Buy Orders</h3>
            <div className="space-y-1">
              {buyOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex justify-between text-green-500"
                >
                  <span>{order.price.toFixed(2)}</span>
                  <span>{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
