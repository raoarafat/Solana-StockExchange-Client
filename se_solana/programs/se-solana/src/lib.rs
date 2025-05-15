/*
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
*/


use anchor_lang::prelude::*;

declare_id!("4DqV3aQQDizyGUUbvtkJoNxChzbed1BT9Csrb8FtjhSx");

#[program]
pub mod se_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn buy_stock(
        ctx: Context<BuyStock>,
        company: String,
        amount: u64,
        price: u64,
    ) -> Result<()> {
        let transaction = &mut ctx.accounts.transaction;
        transaction.user = ctx.accounts.user.key();

        // Convert company name to fixed-size byte array
        let company_bytes = company.as_bytes();
        let mut name_fixed: [u8; 32] = [0; 32];
        name_fixed[..company_bytes.len().min(32)].copy_from_slice(&company_bytes[..company_bytes.len().min(32)]);
        transaction.company = name_fixed;

        transaction.amount = amount;
        transaction.price = price;
        transaction.is_buy = true;
        transaction.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn sell_stock(
        ctx: Context<SellStock>,
        company: String,
        amount: u64,
        price: u64,
    ) -> Result<()> {
        let transaction = &mut ctx.accounts.transaction;
        transaction.user = ctx.accounts.user.key();

        // Convert company name to fixed-size byte array
        let company_bytes = company.as_bytes();
        let mut name_fixed: [u8; 32] = [0; 32];
        name_fixed[..company_bytes.len().min(32)].copy_from_slice(&company_bytes[..company_bytes.len().min(32)]);
        transaction.company = name_fixed;

        transaction.amount = amount;
        transaction.price = price;
        transaction.is_buy = false;
        transaction.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(company: String, amount: u64, price: u64)]
pub struct BuyStock<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 1 + 8, // discriminator + user + company + amount + price + is_buy + timestamp
    )]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(company: String, amount: u64, price: u64)]
pub struct SellStock<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 1 + 8, // discriminator + user + company + amount + price + is_buy + timestamp
    )]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Transaction {
    pub user: Pubkey,
    pub company: [u8; 32], // fixed-size byte array for company name
    pub amount: u64,
    pub price: u64,
    pub is_buy: bool,
    pub timestamp: i64,
}

