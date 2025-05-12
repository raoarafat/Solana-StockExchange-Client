// use anchor_lang::prelude::*;
// use anchor_spl::token::{self, Token, TokenAccount, Transfer};

// declare_id!("your_program_id_here");

// #[program]
// pub mod stock_exchange {
//     use super::*;

//     // Initialize a new company stock
//     pub fn initialize_company(
//         ctx: Context<InitializeCompany>,
//         name: String,
//         symbol: String,
//         total_supply: u64,
//         price: u64,
//     ) -> Result<()> {
//         let company = &mut ctx.accounts.company;
//         company.name = name;
//         company.symbol = symbol;
//         company.total_supply = total_supply;
//         company.current_price = price;
//         company.authority = ctx.accounts.authority.key();

//         // Mint initial supply to company vault
//         let cpi_context = CpiContext::new(
//             ctx.accounts.token_program.to_account_info(),
//             Transfer {
//                 from: ctx.accounts.mint_authority.to_account_info(),
//                 to: ctx.accounts.company_vault.to_account_info(),
//             },
//         );
//         token::transfer(cpi_context, total_supply)?;

//         Ok(())
//     }

//     // Create a buy order
//     pub fn create_buy_order(
//         ctx: Context<CreateOrder>,
//         amount: u64,
//         price: u64,
//     ) -> Result<()> {
//         let order = &mut ctx.accounts.order;
//         order.owner = ctx.accounts.owner.key();
//         order.amount = amount;
//         order.price = price;
//         order.order_type = OrderType::Buy;
//         order.status = OrderStatus::Open;

//         // Transfer SOL to order account
//         let cpi_context = CpiContext::new(
//             ctx.accounts.system_program.to_account_info(),
//             Transfer {
//                 from: ctx.accounts.owner.to_account_info(),
//                 to: ctx.accounts.order.to_account_info(),
//             },
//         );
//         anchor_lang::system_program::transfer(cpi_context, amount * price)?;

//         Ok(())
//     }

//     // Create a sell order
//     pub fn create_sell_order(
//         ctx: Context<CreateOrder>,
//         amount: u64,
//         price: u64,
//     ) -> Result<()> {
//         let order = &mut ctx.accounts.order;
//         order.owner = ctx.accounts.owner.key();
//         order.amount = amount;
//         order.price = price;
//         order.order_type = OrderType::Sell;
//         order.status = OrderStatus::Open;

//         // Transfer tokens to order account
//         let cpi_context = CpiContext::new(
//             ctx.accounts.token_program.to_account_info(),
//             Transfer {
//                 from: ctx.accounts.owner_token_account.to_account_info(),
//                 to: ctx.accounts.order_token_account.to_account_info(),
//             },
//         );
//         token::transfer(cpi_context, amount)?;

//         Ok(())
//     }

//     // Match orders
//     pub fn match_orders(ctx: Context<MatchOrders>) -> Result<()> {
//         let buy_order = &mut ctx.accounts.buy_order;
//         let sell_order = &mut ctx.accounts.sell_order;

//         require!(buy_order.status == OrderStatus::Open, StockExchangeError::OrderNotOpen);
//         require!(sell_order.status == OrderStatus::Open, StockExchangeError::OrderNotOpen);
//         require!(buy_order.price >= sell_order.price, StockExchangeError::PriceMismatch);

//         let match_amount = std::cmp::min(buy_order.amount, sell_order.amount);
//         let match_price = sell_order.price;

//         // Transfer tokens from sell order to buy order owner
//         let cpi_context = CpiContext::new(
//             ctx.accounts.token_program.to_account_info(),
//             Transfer {
//                 from: ctx.accounts.sell_order_token_account.to_account_info(),
//                 to: ctx.accounts.buyer_token_account.to_account_info(),
//             },
//         );
//         token::transfer(cpi_context, match_amount)?;

//         // Transfer SOL from buy order to sell order owner
//         let cpi_context = CpiContext::new(
//             ctx.accounts.system_program.to_account_info(),
//             Transfer {
//                 from: ctx.accounts.buy_order.to_account_info(),
//                 to: ctx.accounts.seller.to_account_info(),
//             },
//         );
//         anchor_lang::system_program::transfer(cpi_context, match_amount * match_price)?;

//         // Update order amounts
//         buy_order.amount -= match_amount;
//         sell_order.amount -= match_amount;

//         // Update order status
//         if buy_order.amount == 0 {
//             buy_order.status = OrderStatus::Filled;
//         }
//         if sell_order.amount == 0 {
//             sell_order.status = OrderStatus::Filled;
//         }

//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct InitializeCompany<'info> {
//     #[account(init, payer = authority, space = Company::LEN)]
//     pub company: Account<'info, Company>,
//     #[account(mut)]
//     pub authority: Signer<'info>,
//     #[account(mut)]
//     pub company_vault: Account<'info, TokenAccount>,
//     #[account(mut)]
//     pub mint_authority: Account<'info, TokenAccount>,
//     pub token_program: Program<'info, Token>,
//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// pub struct CreateOrder<'info> {
//     #[account(init, payer = owner, space = Order::LEN)]
//     pub order: Account<'info, Order>,
//     #[account(mut)]
//     pub owner: Signer<'info>,
//     #[account(mut)]
//     pub owner_token_account: Account<'info, TokenAccount>,
//     #[account(mut)]
//     pub order_token_account: Account<'info, TokenAccount>,
//     pub token_program: Program<'info, Token>,
//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// pub struct MatchOrders<'info> {
//     #[account(mut)]
//     pub buy_order: Account<'info, Order>,
//     #[account(mut)]
//     pub sell_order: Account<'info, Order>,
//     #[account(mut)]
//     pub buyer_token_account: Account<'info, TokenAccount>,
//     #[account(mut)]
//     pub seller_token_account: Account<'info, TokenAccount>,
//     #[account(mut)]
//     pub sell_order_token_account: Account<'info, TokenAccount>,
//     #[account(mut)]
//     pub seller: AccountInfo<'info>,
//     pub token_program: Program<'info, Token>,
//     pub system_program: Program<'info, System>,
// }

// #[account]
// pub struct Company {
//     pub name: String,
//     pub symbol: String,
//     pub total_supply: u64,
//     pub current_price: u64,
//     pub authority: Pubkey,
// }

// impl Company {
//     pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 32;
// }

// #[account]
// pub struct Order {
//     pub owner: Pubkey,
//     pub amount: u64,
//     pub price: u64,
//     pub order_type: OrderType,
//     pub status: OrderStatus,
// }

// impl Order {
//     pub const LEN: usize = 8 + 32 + 8 + 8 + 1 + 1;
// }

// #[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
// pub enum OrderType {
//     Buy,
//     Sell,
// }

// #[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
// pub enum OrderStatus {
//     Open,
//     Filled,
//     Cancelled,
// }

// #[error_code]
// pub enum StockExchangeError {
//     #[msg("Order is not open")]
//     OrderNotOpen,
//     #[msg("Price mismatch between buy and sell orders")]
//     PriceMismatch,
// }
