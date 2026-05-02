import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SteakContract } from "../target/types/steak_contract";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("steak_contract", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SteakContract as Program<SteakContract>;
  const admin = (provider.wallet as anchor.Wallet).payer;
  const user = anchor.web3.Keypair.generate();

  let idrxMint: anchor.web3.Pubkey;
  let adminTokenAccount: anchor.web3.Pubkey;
  let userTokenAccount: anchor.web3.Pubkey;

  const batchId = new anchor.BN(1);
  const lockDuration = new anchor.BN(30 * 24 * 60 * 60); // 30 days

  before(async () => {
    // Airdrop SOL to user
    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    // Create Mock IDRX Mint
    idrxMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      6
    );

    // Setup ATA for Admin and User
    adminTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      admin,
      idrxMint,
      admin.publicKey
    );

    userTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      admin,
      idrxMint,
      user.publicKey
    );

    // Mint 1000 IDRX to User
    await mintTo(
      provider.connection,
      admin,
      idrxMint,
      userTokenAccount,
      admin,
      1000_000_000 // 1000 IDRX
    );
  });

  it("Initializes the protocol", async () => {
    const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    );

    await program.methods
      .initializeProtocol()
      .accounts({
        globalState,
        admin: admin.publicKey,
        feeDestination: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const state = await program.account.globalState.fetch(globalState);
    assert.equal(state.admin.toBase58(), admin.publicKey.toBase58());
  });

  it("Creates a batch", async () => {
    const [batch] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [batchVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch_vault"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .createBatch(batchId, lockDuration)
      .accounts({
        batch,
        batchVault,
        usdcMint: idrxMint,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const batchAccount = await program.account.batch.fetch(batch);
    assert.isFalse(batchAccount.isActive);
    assert.equal(batchAccount.batchId.toString(), batchId.toString());
  });

  it("Allows user to stake", async () => {
    const stakeAmount = new anchor.BN(500_000_000); // 500 IDRX

    const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    );

    const [batch] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [batchVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch_vault"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [userStake] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_stake"),
        user.publicKey.toBuffer(),
        batchId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    await program.methods
      .stake(batchId, stakeAmount)
      .accounts({
        batch,
        batchVault,
        userStake,
        globalState,
        userTokenAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const stakeData = await program.account.userStake.fetch(userStake);
    assert.equal(stakeData.amountStaked.toString(), stakeAmount.toString());
  });

  it("Starts the batch", async () => {
    const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    );

    const [batch] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .startBatch()
      .accounts({
        globalState,
        batch,
        admin: admin.publicKey,
      })
      .rpc();

    const batchAccount = await program.account.batch.fetch(batch);
    assert.isTrue(batchAccount.isActive);
  });

  it("Harvests the batch with profit", async () => {
    // 500 staked. Final revenue 700. Profit = 200.
    // 50% net yield to user = 100.
    // Total to claim = 500 + 100 = 600.
    const finalRevenue = new anchor.BN(700_000_000);

    // Admin needs to have the revenue to send back
    await mintTo(
      provider.connection,
      admin,
      idrxMint,
      adminTokenAccount,
      admin,
      finalRevenue.toNumber()
    );

    const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    );

    const [batch] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [batchVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch_vault"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .harvestBatch(finalRevenue)
      .accounts({
        globalState,
        batch,
        batchVault,
        adminTokenAccount,
        admin: admin.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const batchAccount = await program.account.batch.fetch(batch);
    assert.isTrue(batchAccount.isHarvested);
  });

  it("User claims principal + yield", async () => {
    const [batch] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [batchVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("batch_vault"), batchId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [userStake] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_stake"),
        user.publicKey.toBuffer(),
        batchId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const initialUserBalance = (
      await getAccount(provider.connection, userTokenAccount)
    ).amount;

    await program.methods
      .claim()
      .accounts({
        batch,
        batchVault,
        userStake,
        userTokenAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    const finalUserBalance = (
      await getAccount(provider.connection, userTokenAccount)
    ).amount;
    const diff = Number(finalUserBalance) - Number(initialUserBalance);

    // Expected: 600 IDRX (500 principal + 100 net yield)
    assert.equal(diff, 600_000_000);

    const stakeData = await program.account.userStake.fetch(userStake);
    assert.isTrue(stakeData.hasClaimed);
  });
});
