import { Program, AnchorProvider } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { IDL } from '../../../target/types/stock_exchange';

export const PROGRAM_ID = new PublicKey('your_program_id_here');

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = new AnchorProvider(connection, wallet as any, {
    commitment: 'confirmed',
  });

  return new Program(IDL, PROGRAM_ID, provider);
}

export async function createBuyOrder(
  program: Program,
  amount: number,
  price: number,
  company: PublicKey
) {
  try {
    const order = await program.methods
      .createBuyOrder(new BN(amount), new BN(price))
      .accounts({
        company,
        // Add other required accounts
      })
      .rpc();
    return order;
  } catch (error) {
    console.error('Error creating buy order:', error);
    throw error;
  }
}

export async function createSellOrder(
  program: Program,
  amount: number,
  price: number,
  company: PublicKey
) {
  try {
    const order = await program.methods
      .createSellOrder(new BN(amount), new BN(price))
      .accounts({
        company,
        // Add other required accounts
      })
      .rpc();
    return order;
  } catch (error) {
    console.error('Error creating sell order:', error);
    throw error;
  }
}

export async function matchOrders(
  program: Program,
  buyOrder: PublicKey,
  sellOrder: PublicKey
) {
  try {
    const tx = await program.methods
      .matchOrders()
      .accounts({
        buyOrder,
        sellOrder,
        // Add other required accounts
      })
      .rpc();
    return tx;
  } catch (error) {
    console.error('Error matching orders:', error);
    throw error;
  }
}
