"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Send, History, ExternalLink } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { TransactionsList } from "@/components/transactions-list"
import { SendSolForm } from "@/components/send-sol-form"
import { useState, useEffect } from "react"

export default function Home() {
  const { wallet, balance, connected, connecting, connectWallet, disconnectWallet } = useWallet()
  const [isPhantomInstalled, setIsPhantomInstalled] = useState<boolean | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const hasPhantom = window.phantom?.solana || window.solana?.isPhantom
      setIsPhantomInstalled(!!hasPhantom)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Solana Starter Project</h1>
          <p className="text-gray-500">Get started with Solana blockchain development</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Wallet Connection
              </span>
              {connected && (
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              )}
            </CardTitle>
            <CardDescription>Connect your Solana wallet to interact with the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            {isPhantomInstalled === false ? (
              <div className="text-center space-y-4">
                <p className="text-amber-600">Phantom wallet is not installed</p>
                <Button onClick={() => window.open("https://phantom.app/", "_blank")} className="flex items-center">
                  Install Phantom Wallet
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : !connected ? (
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setConnectionError(null)
                    connectWallet().catch((err) => {
                      console.error("Connection error:", err)
                      setConnectionError(err.message || "Failed to connect")
                    })
                  }}
                  className="w-full"
                  disabled={connecting}
                >
                  {connecting ? "Connecting..." : "Connect Wallet"}
                </Button>

                {connecting && (
                  <p className="text-sm text-amber-600 text-center mt-2">
                    Please check your Phantom wallet extension for connection requests
                  </p>
                )}

                {connectionError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {connectionError}
                  </div>
                )}

                {isPhantomInstalled && (
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Troubleshooting tips:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Make sure Phantom extension is unlocked</li>
                      <li>Check for connection request in the extension</li>
                      <li>Try refreshing the page</li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Wallet Address</span>
                    <span className="text-sm font-mono truncate max-w-[200px] md:max-w-[300px]">
                      {wallet?.publicKey?.toString()}
                    </span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Balance</span>
                    <span className="text-sm font-mono">{balance !== null ? `${balance} SOL` : "Loading..."}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {connected && (
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="send">
                <Send className="mr-2 h-4 w-4" />
                Send SOL
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <History className="mr-2 h-4 w-4" />
                Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="send">
              <Card>
                <CardHeader>
                  <CardTitle>Send SOL</CardTitle>
                  <CardDescription>Transfer SOL to another wallet address</CardDescription>
                </CardHeader>
                <CardContent>
                  <SendSolForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>View your recent transactions on Solana</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionsList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  )
}
