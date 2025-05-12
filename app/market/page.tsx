import { CompanyList } from '../components/market/CompanyList';
import { OrderBook } from '../components/market/OrderBook';
import { TradingInterface } from '../components/market/TradingInterface';

export default function MarketPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <CompanyList />
      </div>
      <div className="col-span-4">
        <div className="space-y-6">
          <OrderBook />
          <TradingInterface />
        </div>
      </div>
    </div>
  );
}
