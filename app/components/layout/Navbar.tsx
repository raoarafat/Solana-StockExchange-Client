import Link from 'next/link';
import { WalletConnectButton } from '../wallet/WalletButton';

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Solana Stock Exchange
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/market" className="hover:text-primary">
              Market
            </Link>
            <Link href="/portfolio" className="hover:text-primary">
              Portfolio
            </Link>
          </div>
        </div>
        <WalletConnectButton />
      </div>
    </nav>
  );
}
