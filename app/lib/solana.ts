import { Program, AnchorProvider, web3, BN, Idl } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
// import { IDL } from '../../../se_solana/target/types/stock_exchange';
import idl from '../../se_solana/target/idl/se_solana.json';
// Program ID - Replace with your deployed program ID
const PROGRAM_ID = new PublicKey(
  '4DqV3aQQDizyGUUbvtkJoNxChzbed1BT9Csrb8FtjhSx'
);

// Define the Transaction account type based on your IDL
interface TransactionAccount {
  user: PublicKey;
  company: string;
  amount: BN;
  price: BN;
  isBuy: boolean;
  timestamp: BN;
}

export interface Transaction {
  user: PublicKey;
  company: string;
  amount: number;
  price: number;
  isBuy: boolean;
  timestamp: number;
}

export const useStockExchange = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getProvider = () => {
    if (!wallet.publicKey) throw new Error('Wallet not connected');
    return new AnchorProvider(connection, wallet as any, {
      commitment: 'confirmed',
    });
  };

  const getProgramold = () => {
    const provider = getProvider();
    console.log('provider: ', provider);
    console.log('PROGRAM_ID: ', PROGRAM_ID);
    return new Program(idl as unknown as Idl, PROGRAM_ID, provider);
  };

  const getProgram = () => {
    if (!wallet.publicKey) throw new Error('Connect your wallet first!');
    const provider = new AnchorProvider(connection, wallet as any, {
      commitment: 'confirmed',
    });
    console.log('provider: ', provider);
    console.log('PROGRAM_ID: ', PROGRAM_ID);
    try {
      const program = new Program(idl as any, PROGRAM_ID, provider);
      console.log('Program created successfully');
      return program;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  };

  const getTransactions = async (): Promise<Transaction[]> => {
    try {
      console.log('program strt: ');
      const program = getProgram();
      console.log('program me: ');
      const transactions = await program.account.transaction.all([
        {
          memcmp: {
            offset: 8, // Skip the account discriminator
            bytes: wallet.publicKey?.toBase58() || '',
          },
        },
      ]);

      return transactions.map((tx) => {
        const account = tx.account as unknown as TransactionAccount;
        return {
          user: account.user,
          company: account.company,
          amount: account.amount.toNumber(),
          price: account.price.toNumber(),
          isBuy: account.isBuy,
          timestamp: account.timestamp.toNumber(),
        };
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  };

  const buyStock = async (company: string, amount: number, price: number) => {
    try {
      const program = getProgram();
      const transaction = web3.Keypair.generate();
      if (!wallet.publicKey) throw new Error('Wallet not connected');

      const tx = await program.methods
        .buy_stock(company, new BN(amount), new BN(price))
        .accounts({
          transaction: transaction.publicKey,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([transaction])
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error buying stock:', error);
      throw error;
    }
  };

  const sellStock = async (company: string, amount: number, price: number) => {
    try {
      const program = getProgram();
      const transaction = web3.Keypair.generate();
      if (!wallet.publicKey) throw new Error('Wallet not connected');

      const tx = await program.methods
        .sell_stock(company, new BN(amount), new BN(price))
        .accounts({
          transaction: transaction.publicKey,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([transaction])
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error selling stock:', error);
      throw error;
    }
  };

  return {
    buyStock,
    sellStock,
    getTransactions,
  };
};
