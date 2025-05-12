import { PortfolioOverview } from '../components/portfolio/PortfolioOverview';
import { HoldingsList } from '../components/portfolio/HoldingsList';

export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      <PortfolioOverview />
      <HoldingsList />
    </div>
  );
}
