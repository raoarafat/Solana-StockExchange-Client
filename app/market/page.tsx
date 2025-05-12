'use client';

import { CompanyList } from '../components/market/CompanyList';
import { OrderBook } from '../components/market/OrderBook';
import { TradingInterface } from '../components/market/TradingInterface';

export default function MarketPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Market</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <CompanyList />
        </div>
        <div className="lg:col-span-4">
          <div className="space-y-6">
            <OrderBook />
            <TradingInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
