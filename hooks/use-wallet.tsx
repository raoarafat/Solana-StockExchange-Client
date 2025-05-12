'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Connection, type PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Add Phantom wallet types
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: any }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: any) => void;
      off: (event: string, callback: any) => void;
      signTransaction: (transaction: any) => Promise<any>;
      publicKey?: any;
    };
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: any }>;
        disconnect: () => Promise<void>;
        on: (event: string, callback: any) => void;
        off: (event: string, callback: any) => void;
        signTransaction: (transaction: any) => Promise<any>;
        publicKey?: any;
      };
    };
  }
}

// Default to devnet for development
const SOLANA_NETWORK = 'devnet';
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

type WalletContextType = {
  wallet: any;
  connected: boolean;
  connecting: boolean;
  balance: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  fetchBalance: (publicKey: PublicKey) => Promise<void>;
  network: string;
  rpcUrl: string;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Add this right after the useState declarations
  const debugPhantom = useCallback(() => {
    if (typeof window === 'undefined') return;

    console.log('Debugging Phantom wallet:');
    console.log('window.phantom exists:', !!window.phantom);
    console.log('window.solana exists:', !!window.solana);

    if (window.phantom?.solana) {
      console.log('Using window.phantom.solana');
      console.log('isPhantom:', window.phantom.solana.isPhantom);
    } else if (window.solana) {
      console.log('Using window.solana');
      console.log('isPhantom:', window.solana.isPhantom);
    }
  }, []);

  const fetchBalance = useCallback(async (publicKey: PublicKey) => {
    try {
      console.log('Fetching balance for:', publicKey.toString());
      const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      console.log('Fetched balance:', solBalance);
      setBalance(solBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setConnecting(true);

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Cannot connect to wallet in non-browser environment');
      }

      // Check if Phantom is installed
      const isPhantomInstalled =
        window.phantom?.solana || window.solana?.isPhantom;

      if (!isPhantomInstalled) {
        // Open Phantom wallet website in a new tab
        window.open('https://phantom.app/', '_blank');
        throw new Error('Please install Phantom wallet');
      }

      // Get the provider - Phantom can be either at window.phantom.solana or window.solana
      const provider = window.phantom?.solana || window.solana;

      if (!provider) {
        throw new Error('Phantom provider not found');
      }

      console.log('Attempting to connect to Phantom wallet...');

      // Add a timeout to prevent UI from being stuck
      const connectionPromise = provider.connect();

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timed out')), 30000);
      });

      // Race the connection against the timeout
      const response = (await Promise.race([
        connectionPromise,
        timeoutPromise,
      ])) as { publicKey: any };
      console.log('Connection response:', response);
      const publicKey = response.publicKey;

      if (!publicKey) {
        throw new Error('Failed to get public key');
      }

      setWallet(provider);
      setConnected(true);

      // Get balance
      await fetchBalance(publicKey);

      console.log('Wallet connected successfully');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // Reset connected state in case of error
      setConnected(false);
      setWallet(null);
      // Don't rethrow the error, just log it
    } finally {
      setConnecting(false);
    }
  }, [fetchBalance]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setWallet(null);
        setConnected(false);
        setBalance(null);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [wallet]);

  // Refresh balance periodically when connected
  useEffect(() => {
    if (!connected || !wallet?.publicKey) return;

    const interval = setInterval(() => {
      fetchBalance(wallet.publicKey);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [connected, wallet, fetchBalance]);

  // Handle wallet change events
  useEffect(() => {
    if (!wallet) return;

    const handleAccountChange = (publicKey: PublicKey) => {
      if (publicKey) {
        setWallet({ ...wallet, publicKey });
        fetchBalance(publicKey);
      } else {
        // Wallet disconnected
        setConnected(false);
        setWallet(null);
        setBalance(null);
      }
    };

    wallet.on('accountChanged', handleAccountChange);

    return () => {
      wallet.off('accountChanged', handleAccountChange);
    };
  }, [wallet, fetchBalance]);

  // Add this useEffect after the other useEffects
  useEffect(() => {
    debugPhantom();
  }, [debugPhantom]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        connecting,
        balance,
        connectWallet,
        disconnectWallet,
        fetchBalance,
        network: SOLANA_NETWORK,
        rpcUrl: SOLANA_RPC_URL,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
