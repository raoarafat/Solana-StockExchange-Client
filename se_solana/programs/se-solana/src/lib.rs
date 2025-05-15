// use anchor_lang::prelude::*;

// declare_id!("2uRGgZxoLBsEhk7qHBGLViQ1kBrGbwBbocRQ7vm7T2Kc"); // Replace after deploy

// #[program]
// pub mod stock_exchange {
//     use super::*;

//     pub fn buy_stock(ctx: Context<BuySell>, company: String, amount: u64, price: u64) -> Result<()> {
//         let tx = &mut ctx.accounts.transaction;
//         tx.user = ctx.accounts.user.key();
//         tx.company = company;
//         tx.amount = amount;
//         tx.price = price;
//         tx.is_buy = true;
//         tx.timestamp = Clock::get()?.unix_timestamp;
//         Ok(())
//     }

//     pub fn sell_stock(ctx: Context<BuySell>, company: String, amount: u64, price: u64) -> Result<()> {
//         let tx = &mut ctx.accounts.transaction;
//         tx.user = ctx.accounts.user.key();
//         tx.company = company;
//         tx.amount = amount;
//         tx.price = price;
//         tx.is_buy = false;
//         tx.timestamp = Clock::get()?.unix_timestamp;
//         Ok(())
//     }
// }

// #[account]
// pub struct Transaction {
//     pub user: Pubkey,
//     pub company: String,
//     pub amount: u64,
//     pub price: u64,
//     pub is_buy: bool,
//     pub timestamp: i64,
// }

// #[derive(Accounts)]
// pub struct BuySell<'info> {
//     #[account(init, payer = user, space = 8 + 32 + 4 + 32 + 8 + 8 + 1 + 8)]
//     pub transaction: Account<'info, Transaction>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

use anchor_lang::prelude::*;

declare_id!("4DqV3aQQDizyGUUbvtkJoNxChzbed1BT9Csrb8FtjhSx");

#[program]
pub mod se_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
}
