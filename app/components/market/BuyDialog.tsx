'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@solana/wallet-adapter-react';

interface BuyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    name: string;
    symbol: string;
    currentPrice: number;
  };
}

export function BuyDialog({ isOpen, onClose, company }: BuyDialogProps) {
  const wallet = useWallet();
  const [quantity, setQuantity] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = Number(quantity) * company.currentPrice;

  const handleBuy = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement actual buy logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
      alert('Order placed successfully!');
      onClose();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Buy {company.symbol}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <div className="col-span-3">
              <p className="text-sm text-gray-600">{company.name}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <div className="col-span-3">
              <p className="text-sm font-medium">
                ${company.currentPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <div className="col-span-3">
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">
              Total
            </Label>
            <div className="col-span-3">
              <p className="text-sm font-medium">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleBuy}
            disabled={isLoading || !wallet.publicKey}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Processing...' : 'Buy Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
