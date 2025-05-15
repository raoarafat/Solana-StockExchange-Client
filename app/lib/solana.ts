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
  company: number[];
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

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const getTransactions = async (
    limit: number = 10
  ): Promise<Transaction[]> => {
    try {
      if (!wallet.publicKey) throw new Error('Wallet not connected');

      console.log('init getTransactions');
      const program = getProgram();

      console.log('success getTransactions');

      // Get transaction accounts for the current user only
      const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [
          {
            dataSize: 8 + 32 + 32 + 8 + 8 + 1 + 8, // Size of Transaction account
          },
          {
            memcmp: {
              offset: 8, // Skip discriminator
              bytes: wallet.publicKey.toBase58(), // Filter by user's public key
            },
          },
        ],
        commitment: 'confirmed',
      });

      console.log('accounts: ', accounts);

      // Process accounts
      const transactions = await Promise.all(
        accounts.map(async (account) => {
          try {
            const tx = await program.account.transaction.fetch(account.pubkey);
            const accountData = tx as unknown as TransactionAccount;

            // Convert company bytes to string
            const companyBytes = new Uint8Array(accountData.company);
            const companyString = new TextDecoder()
              .decode(companyBytes)
              .replace(/\0/g, '');

            return {
              user: accountData.user,
              company: companyString,
              amount: accountData.amount.toNumber(),
              price: accountData.price.toNumber(),
              isBuy: accountData.isBuy,
              timestamp: accountData.timestamp.toNumber(),
            };
          } catch (error) {
            console.error('Error processing transaction:', error);
            return null;
          }
        })
      );

      console.log('finish transactions fetch ');

      // Filter out null values and sort by timestamp (newest first)
      var txn = transactions
        .filter((tx): tx is Transaction => tx !== null)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);

      console.log('done transactions: ', transactions);

      return txn;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  };

  const getBuyTransactions = async (
    limit: number = 10
  ): Promise<Transaction[]> => {
    const transactions = await getTransactions(limit);
    return transactions.filter((tx) => tx.isBuy);
  };

  const getSellTransactions = async (
    limit: number = 10
  ): Promise<Transaction[]> => {
    const transactions = await getTransactions(limit);
    return transactions.filter((tx) => !tx.isBuy);
  };

  const buyStock = async (company: string, amount: number, price: number) => {
    try {
      const program = getProgram();
      const transaction = web3.Keypair.generate();
      if (!wallet.publicKey) throw new Error('Wallet not connected');

      console.log(
        'web3.SystemProgram.programId: ',
        web3.SystemProgram.programId
      );

      const tx = await program.methods
        .buyStock(company, new BN(amount), new BN(price))
        // .accounts({
        //   transaction: transaction.publicKey,
        //   user: wallet.publicKey,
        //   system_program: web3.SystemProgram.programId,
        // })
        // .signers([])
        .accounts({
          transaction: transaction.publicKey,
          user: wallet.publicKey,
          system_program: web3.SystemProgram.programId,
        })
        .signers([])
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
        .sellStock(company, new BN(amount), new BN(price))
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
    getBuyTransactions,
    getSellTransactions,
  };
};
