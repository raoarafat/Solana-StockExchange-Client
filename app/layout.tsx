import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { WalletProvider } from '@/hooks/use-wallet';
import { SolanaWalletProvider } from './components/wallet/WalletProvider';
import { Navbar } from './components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solana Starter Project',
  description: 'A basic Solana blockchain project to get started',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.global = window;
                window.Buffer = window.Buffer || require('buffer').Buffer;
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SolanaWalletProvider>
          <WalletProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen bg-background">
                <Navbar />
                <main className="container mx-auto px-4 py-8">{children}</main>
              </div>
              <Toaster />
            </ThemeProvider>
          </WalletProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
