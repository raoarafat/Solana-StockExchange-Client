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
