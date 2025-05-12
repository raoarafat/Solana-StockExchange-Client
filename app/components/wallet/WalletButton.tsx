'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletConnectButton() {
  const { connected } = useWallet();

  return (
    <div className="flex items-center gap-2">
      <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg !px-4 !py-2 !text-white" />
    </div>
  );
}
