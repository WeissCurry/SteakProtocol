use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("GY3PgUAPuXte7ZH7VUjixuSn4pKqLDsfREitaqbu6zmA");

#[program]
pub mod steak_contract {
    use super::*;

    pub fn initialize_protocol(ctx: Context<InitializeProtocol>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.admin = ctx.accounts.admin.key();
        global_state.fee_destination = ctx.accounts.fee_destination.key();
        global_state.total_tvl = 0;
        Ok(())
    }

    pub fn create_batch(
        ctx: Context<CreateBatch>,
        batch_id: u64,
        lock_duration: u64,
        max_capacity: u64,
        apy: u64,
    ) -> Result<()> {
        let batch = &mut ctx.accounts.batch;
        batch.batch_id = batch_id;
        batch.lock_duration = lock_duration;
        batch.start_time = 0;
        batch.is_active = false;
        batch.total_staked = 0;
        batch.final_revenue = 0;
        batch.is_harvested = false;
        batch.bump = ctx.bumps.batch;
        batch.max_capacity = max_capacity;
        batch.apy = apy;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, _batch_id: u64, amount: u64) -> Result<()> {
        let batch = &mut ctx.accounts.batch;
        
        // Constraints
        require!(!batch.is_active, SteakError::BatchAlreadyStarted);
        require!(!batch.is_harvested, SteakError::BatchAlreadyHarvested);
        require!(
            batch.total_staked.checked_add(amount).ok_or(SteakError::MathOverflow)? <= batch.max_capacity,
            SteakError::CapacityReached
        );

        // Transfer USDC to Batch Vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.batch_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update State
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.user_pubkey = ctx.accounts.user.key();
        user_stake.batch_id = batch.batch_id;
        user_stake.amount_staked = user_stake.amount_staked.checked_add(amount).ok_or(SteakError::MathOverflow)?;
        user_stake.has_claimed = false;

        batch.total_staked = batch.total_staked.checked_add(amount).ok_or(SteakError::MathOverflow)?;
        
        let global_state = &mut ctx.accounts.global_state;
        global_state.total_tvl = global_state.total_tvl.checked_add(amount).ok_or(SteakError::MathOverflow)?;

        Ok(())
    }

    pub fn start_batch(ctx: Context<AdminOnly>) -> Result<()> {
        let batch = &mut ctx.accounts.batch;
        batch.is_active = true;
        batch.start_time = Clock::get()?.unix_timestamp as u64;
        Ok(())
    }

    pub fn harvest_batch(ctx: Context<HarvestBatch>, final_revenue: u64) -> Result<()> {
        let batch = &mut ctx.accounts.batch;
        require!(batch.is_active, SteakError::BatchNotStarted);
        
        // Transfer revenue back to vault (Admin sends from their account)
        let cpi_accounts = Transfer {
            from: ctx.accounts.admin_token_account.to_account_info(),
            to: ctx.accounts.batch_vault.to_account_info(),
            authority: ctx.accounts.admin.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, final_revenue)?;

        batch.final_revenue = final_revenue;
        batch.is_harvested = true;
        batch.is_active = false;

        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let batch = &ctx.accounts.batch;
        let user_stake = &mut ctx.accounts.user_stake;

        require!(batch.is_harvested, SteakError::BatchNotHarvested);
        require!(!user_stake.has_claimed, SteakError::AlreadyClaimed);

        // Calculation Logic:
        // user_share_percentage = amount_staked / total_staked.
        // user_gross_revenue = final_revenue * user_share_percentage.
        // user_profit = user_gross_revenue - amount_staked.
        // net_yield_for_user = user_profit / 2 (50% split).
        // amount_to_send = amount_staked + net_yield_for_user.

        let total_staked = batch.total_staked;
        let amount_staked = user_stake.amount_staked;
        let final_revenue = batch.final_revenue;

        // Using u128 for intermediate precision
        let user_gross_revenue = (final_revenue as u128)
            .checked_mul(amount_staked as u128).ok_or(SteakError::MathOverflow)?
            .checked_div(total_staked as u128).ok_or(SteakError::MathOverflow)? as u64;

        let amount_to_send = if user_gross_revenue > amount_staked {
            let user_profit = user_gross_revenue.checked_sub(amount_staked).ok_or(SteakError::MathOverflow)?;
            let net_yield_for_user = user_profit.checked_div(2).ok_or(SteakError::MathOverflow)?;
            amount_staked.checked_add(net_yield_for_user).ok_or(SteakError::MathOverflow)?
        } else {
            // If revenue < staked, user gets their share of what's left (no profit)
            user_gross_revenue
        };

        // Transfer from Vault to User
        let batch_id_bytes = batch.batch_id.to_le_bytes();
        let seeds = &[
            b"batch_vault",
            batch_id_bytes.as_ref(),
            &[batch.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.batch_vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.batch_vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount_to_send)?;

        user_stake.has_claimed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 8,
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: Protocol fee destination
    pub fee_destination: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(batch_id: u64)]
pub struct CreateBatch<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 8 + 8 + 8 + 1 + 8 + 8 + 1 + 1 + 8 + 8, // Added space for max_capacity and apy
        seeds = [b"batch", batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub batch: Account<'info, Batch>,
    #[account(
        init,
        payer = admin,
        token::mint = usdc_mint,
        token::authority = batch_vault,
        seeds = [b"batch_vault", batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub batch_vault: Account<'info, TokenAccount>,
    pub usdc_mint: Account<'info, Mint>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(batch_id: u64)]
pub struct Stake<'info> {
    #[account(
        mut,
        seeds = [b"batch", batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub batch: Account<'info, Batch>,
    #[account(
        mut,
        seeds = [b"batch_vault", batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub batch_vault: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 8 + 8 + 1,
        seeds = [b"user_stake", user.key().as_ref(), batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AdminOnly<'info> {
    #[account(mut, has_one = admin @ SteakError::Unauthorized)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub batch: Account<'info, Batch>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct HarvestBatch<'info> {
    #[account(mut, has_one = admin @ SteakError::Unauthorized)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub batch: Account<'info, Batch>,
    #[account(mut)]
    pub batch_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub admin_token_account: Account<'info, TokenAccount>,
    pub admin: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub batch: Account<'info, Batch>,
    #[account(
        mut,
        seeds = [b"batch_vault", batch.batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub batch_vault: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"user_stake", user.key().as_ref(), batch.batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct GlobalState {
    pub admin: Pubkey,
    pub fee_destination: Pubkey,
    pub total_tvl: u64,
}

#[account]
pub struct Batch {
    pub batch_id: u64,
    pub lock_duration: u64,
    pub start_time: u64,
    pub is_active: bool,
    pub total_staked: u64,
    pub final_revenue: u64,
    pub is_harvested: bool,
    pub bump: u8,
    pub max_capacity: u64,
    pub apy: u64, // APY in basis points (e.g., 500 = 5%)
}

#[account]
pub struct UserStake {
    pub user_pubkey: Pubkey,
    pub batch_id: u64,
    pub amount_staked: u64,
    pub has_claimed: bool,
}

#[error_code]
pub enum SteakError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Batch has already started")]
    BatchAlreadyStarted,
    #[msg("Batch has already been harvested")]
    BatchAlreadyHarvested,
    #[msg("Batch has not started yet")]
    BatchNotStarted,
    #[msg("Batch has not been harvested yet")]
    BatchNotHarvested,
    #[msg("Yield has already been claimed")]
    AlreadyClaimed,
    #[msg("Math overflow or division by zero")]
    MathOverflow,
    #[msg("Series capacity has been reached")]
    CapacityReached,
}
