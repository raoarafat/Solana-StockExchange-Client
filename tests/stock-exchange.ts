// import * as anchor from '@coral-xyz/anchor';
// import { Program } from '@coral-xyz/anchor';
// import { StockExchange } from '../target/types/stock_exchange';
// import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
// import {
//   TOKEN_PROGRAM_ID,
//   createMint,
//   createAccount,
//   mintTo,
// } from '@solana/spl-token';
// import { assert } from 'chai';

// describe('stock-exchange', () => {
//   // Configure the client to use the local cluster
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);

//   const program = anchor.workspace.StockExchange as Program<StockExchange>;

//   // Test accounts
//   let companyMint: PublicKey;
//   let companyVault: PublicKey;
//   let company: PublicKey;
//   let buyerTokenAccount: PublicKey;
//   let sellerTokenAccount: PublicKey;

//   // Test data
//   const companyName = 'Test Company';
//   const companySymbol = 'TEST';
//   const totalSupply = 1000000;
//   const initialPrice = 100; // in lamports

//   before(async () => {
//     // Create a new token mint for the company
//     companyMint = await createMint(
//       provider.connection,
//       provider.wallet.payer,
//       provider.wallet.publicKey,
//       null,
//       9
//     );

//     // Create company vault
//     companyVault = await createAccount(
//       provider.connection,
//       provider.wallet.payer,
//       companyMint,
//       provider.wallet.publicKey
//     );

//     // Create buyer and seller token accounts
//     buyerTokenAccount = await createAccount(
//       provider.connection,
//       provider.wallet.payer,
//       companyMint,
//       provider.wallet.publicKey
//     );

//     sellerTokenAccount = await createAccount(
//       provider.connection,
//       provider.wallet.payer,
//       companyMint,
//       provider.wallet.publicKey
//     );

//     // Mint tokens to seller
//     await mintTo(
//       provider.connection,
//       provider.wallet.payer,
//       companyMint,
//       sellerTokenAccount,
//       provider.wallet.publicKey,
//       totalSupply
//     );
//   });

//   it('Initializes a company', async () => {
//     // Generate company account
//     const [companyPda] = PublicKey.findProgramAddressSync(
//       [Buffer.from('company'), Buffer.from(companySymbol)],
//       program.programId
//     );
//     company = companyPda;

//     // Initialize company
//     await program.methods
//       .initializeCompany(
//         companyName,
//         companySymbol,
//         new anchor.BN(totalSupply),
//         new anchor.BN(initialPrice)
//       )
//       .accounts({
//         company,
//         authority: provider.wallet.publicKey,
//         mint: companyMint,
//         mintAuthority: provider.wallet.publicKey,
//         companyVault,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//       })
//       .rpc();

//     // Fetch company account
//     const companyAccount = await program.account.company.fetch(company);

//     // Verify company data
//     assert.equal(companyAccount.name, companyName);
//     assert.equal(companyAccount.symbol, companySymbol);
//     assert.equal(companyAccount.totalSupply.toNumber(), totalSupply);
//     assert.equal(companyAccount.currentPrice.toNumber(), initialPrice);
//   });

//   it('Creates a buy order', async () => {
//     const buyAmount = 100;
//     const buyPrice = 110; // Higher than initial price

//     // Generate order account
//     const [orderPda] = PublicKey.findProgramAddressSync(
//       [
//         Buffer.from('order'),
//         provider.wallet.publicKey.toBuffer(),
//         company.toBuffer(),
//         Buffer.from('buy'),
//       ],
//       program.programId
//     );

//     // Create buy order
//     await program.methods
//       .createBuyOrder(new anchor.BN(buyAmount), new anchor.BN(buyPrice))
//       .accounts({
//         order: orderPda,
//         owner: provider.wallet.publicKey,
//         company,
//         ownerTokenAccount: buyerTokenAccount,
//         orderTokenAccount: buyerTokenAccount, // For buy orders, this is the same
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//       })
//       .rpc();

//     // Fetch order account
//     const orderAccount = await program.account.order.fetch(orderPda);

//     // Verify order data
//     assert.equal(orderAccount.amount.toNumber(), buyAmount);
//     assert.equal(orderAccount.price.toNumber(), buyPrice);
//     assert.equal(orderAccount.orderType, { buy: {} });
//     assert.equal(orderAccount.status, { open: {} });
//   });

//   it('Creates a sell order', async () => {
//     const sellAmount = 50;
//     const sellPrice = 105; // Between initial price and buy order price

//     // Generate order account
//     const [orderPda] = PublicKey.findProgramAddressSync(
//       [
//         Buffer.from('order'),
//         provider.wallet.publicKey.toBuffer(),
//         company.toBuffer(),
//         Buffer.from('sell'),
//       ],
//       program.programId
//     );

//     // Create sell order
//     await program.methods
//       .createSellOrder(new anchor.BN(sellAmount), new anchor.BN(sellPrice))
//       .accounts({
//         order: orderPda,
//         owner: provider.wallet.publicKey,
//         company,
//         ownerTokenAccount: sellerTokenAccount,
//         orderTokenAccount: sellerTokenAccount,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//       })
//       .rpc();

//     // Fetch order account
//     const orderAccount = await program.account.order.fetch(orderPda);

//     // Verify order data
//     assert.equal(orderAccount.amount.toNumber(), sellAmount);
//     assert.equal(orderAccount.price.toNumber(), sellPrice);
//     assert.equal(orderAccount.orderType, { sell: {} });
//     assert.equal(orderAccount.status, { open: {} });
//   });

//   it('Matches orders', async () => {
//     // Generate order accounts
//     const [buyOrderPda] = PublicKey.findProgramAddressSync(
//       [
//         Buffer.from('order'),
//         provider.wallet.publicKey.toBuffer(),
//         company.toBuffer(),
//         Buffer.from('buy'),
//       ],
//       program.programId
//     );

//     const [sellOrderPda] = PublicKey.findProgramAddressSync(
//       [
//         Buffer.from('order'),
//         provider.wallet.publicKey.toBuffer(),
//         company.toBuffer(),
//         Buffer.from('sell'),
//       ],
//       program.programId
//     );

//     // Match orders
//     await program.methods
//       .matchOrders()
//       .accounts({
//         buyOrder: buyOrderPda,
//         sellOrder: sellOrderPda,
//         buyerTokenAccount,
//         sellerTokenAccount,
//         sellOrderTokenAccount: sellerTokenAccount,
//         seller: provider.wallet.publicKey,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//       })
//       .rpc();

//     // Fetch updated order accounts
//     const buyOrderAccount = await program.account.order.fetch(buyOrderPda);
//     const sellOrderAccount = await program.account.order.fetch(sellOrderPda);

//     // Verify order matching
//     assert.equal(buyOrderAccount.amount.toNumber(), 50); // 100 - 50
//     assert.equal(sellOrderAccount.amount.toNumber(), 0); // 50 - 50
//     assert.equal(sellOrderAccount.status, { filled: {} });
//   });

//   it('Cancels an order', async () => {
//     // Generate order account
//     const [orderPda] = PublicKey.findProgramAddressSync(
//       [
//         Buffer.from('order'),
//         provider.wallet.publicKey.toBuffer(),
//         company.toBuffer(),
//         Buffer.from('buy'),
//       ],
//       program.programId
//     );

//     // Cancel order
//     await program.methods
//       .cancelOrder()
//       .accounts({
//         order: orderPda,
//         owner: provider.wallet.publicKey,
//         ownerTokenAccount: buyerTokenAccount,
//         orderTokenAccount: buyerTokenAccount,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//       })
//       .rpc();

//     // Fetch order account
//     const orderAccount = await program.account.order.fetch(orderPda);

//     // Verify order cancellation
//     assert.equal(orderAccount.status, { cancelled: {} });
//   });
// });
