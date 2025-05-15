'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
// Import your IDL JSON (adjust the path as needed)
import idl from '../../se_solana/target/idl/se_solana.json';

const PROGRAM_ID = new PublicKey(
  '4DqV3aQQDizyGUUbvtkJoNxChzbed1BT9Csrb8FtjhSx'
);

export default function SolanaTestPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [txSig, setTxSig] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitialize = async () => {
    setError(null);
    setTxSig(null);
    setLoading(true);
    try {
      if (!wallet.publicKey) throw new Error('Connect your wallet first!');
      const provider = new AnchorProvider(connection, wallet as any, {
        commitment: 'confirmed',
      });
      console.log('provider meee: ', provider);
      console.log('PROGRAM_ID meee: ', PROGRAM_ID);
      const program = new Program(idl as any, PROGRAM_ID, provider);
      console.log('program in me: ', program);
      const tx = await program.methods
        .initialize()
        .accounts({
          signer: wallet.publicKey,
        })
        .rpc();
      console.log('program tx: ', tx);
      setTxSig(tx);
      console.log('program tsetTxSig done: ');
    } catch (err: any) {
      setError(err.message || String(err));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Solana Program Test</h1>
      <button
        onClick={handleInitialize}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Call initialize()'}
      </button>
      {txSig && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold">Transaction sent!</p>
          <a
            href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline"
          >
            View on Solana Explorer
          </a>
        </div>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
