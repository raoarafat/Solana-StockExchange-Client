'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/use-wallet';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export function SendSolForm() {
  const { toast } = useToast();
  const { wallet, balance, fetchBalance, rpcUrl } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);

  // Add debug logging
  console.log('Current balance:', balance);
  console.log('Button disabled state:', sending || !balance);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || !wallet.publicKey) {
      toast({
        title: 'Error',
        description: 'Wallet not connected',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSending(true);

      // Validate inputs
      if (!recipient || !amount) {
        throw new Error('Please fill in all fields');
      }

      const amountValue = Number.parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (amountValue > (balance || 0)) {
        throw new Error('Insufficient balance');
      }

      // Validate recipient address
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch (error) {
        throw new Error('Invalid recipient address');
      }

      // Create connection
      const connection = new Connection(rpcUrl, 'confirmed');

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPubkey,
          lamports: amountValue * LAMPORTS_PER_SOL,
        })
      );

      // Set recent blockhash
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      // Set fee payer
      transaction.feePayer = wallet.publicKey;

      // Sign and send transaction
      const signed = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      // Show success message
      toast({
        title: 'Transaction successful',
        description: `Sent ${amount} SOL to ${recipient.slice(
          0,
          4
        )}...${recipient.slice(-4)}`,
      });

      // Reset form
      setRecipient('');
      setAmount('');

      // Refresh balance
      if (wallet.publicKey) {
        fetchBalance(wallet.publicKey);
      }
    } catch (error: any) {
      console.error('Error sending SOL:', error);
      toast({
        title: 'Transaction failed',
        description: error.message || 'Failed to send SOL',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient Address</Label>
        <Input
          id="recipient"
          placeholder="Enter Solana address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (SOL)</Label>
        <Input
          id="amount"
          type="number"
          step="0.000000001"
          min="0.000000001"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        {balance !== null && (
          <p className="text-xs text-gray-500">Available: {balance} SOL</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={sending || balance === null || balance <= 0}
      >
        {sending ? 'Sending...' : 'Send SOL'}
      </Button>
    </form>
  );
}
