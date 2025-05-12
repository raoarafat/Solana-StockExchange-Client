"use client"

import { useState, useEffect } from "react"
import { Connection } from "@solana/web3.js"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, RefreshCw } from "lucide-react"

type Transaction = {
  signature: string
  timestamp: number
  status: string
  type: string
}

export function TransactionsList() {
  const { wallet, rpcUrl } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    if (!wallet?.publicKey) return

    try {
      setLoading(true)
      const connection = new Connection(rpcUrl, "confirmed")
      const publicKey = wallet.publicKey

      // Get signatures
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 })

      // Get transaction details
      const txDetails = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0,
            })

            // Determine transaction type
            let type = "Unknown"
            if (tx?.meta?.logMessages?.some((log) => log.includes("system"))) {
              type = "Transfer"
            }

            return {
              signature: sig.signature,
              timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
              status: sig.err ? "Failed" : "Success",
              type,
            }
          } catch (error) {
            console.error("Error fetching transaction:", error)
            return {
              signature: sig.signature,
              timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
              status: "Unknown",
              type: "Unknown",
            }
          }
        }),
      )

      setTransactions(txDetails)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (wallet?.publicKey) {
      fetchTransactions()
    }
  }, [wallet?.publicKey])

  const getExplorerUrl = (signature: string) => {
    const cluster = "devnet"
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No transactions found</p>
        <Button variant="outline" onClick={fetchTransactions} className="mx-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.signature} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{tx.type}</span>
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      tx.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
                <p className="text-xs font-mono text-gray-500 mt-1 truncate max-w-[250px]">{tx.signature}</p>
              </div>
              <a
                href={getExplorerUrl(tx.signature)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
