use anchor_lang::prelude::*;

declare_id!("3YDfMYSa9Q4KZM6jghRQ6T1U7L2rMg6z61cvc6VHTn98");

#[program]
pub mod se_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
