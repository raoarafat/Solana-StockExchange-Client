'use client';

import { CompanyList } from '../components/market/CompanyList';

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Stock Exchange</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Main Market Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Market Overview
            </h2>
          </div>
          <CompanyList />
        </div>
      </div>
    </div>
  );
}
