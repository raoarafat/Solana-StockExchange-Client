use anchor_lang::prelude::*;

declare_id!("EXJea2kQk2wQknjnAxVNhNfyrVC6YwAM653Ztx5C9Dj4"); // Temporary ID - will be replaced on deploy

#[program]
pub mod solana_counter {
    use super::*;

    // Initialize a new counter
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Counter initialized to 0");
        Ok(())
    }

    // Increment the counter
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Counter incremented to: {}", counter.count);
        Ok(())
    }
}

// Counter account structure
#[account]
#[derive(Default)]
pub struct Counter {
    pub count: u64,
}

// Accounts required for initialization
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Accounts required for incrementing
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}