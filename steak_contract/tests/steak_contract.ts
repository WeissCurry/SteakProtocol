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

  let idrxMint: anchor.web3.PublicKey;
  let adminTokenAccount: anchor.web3.PublicKey;
  let userTokenAccount: anchor.web3.PublicKey;

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
      .accountsPartial({
        globalState,
        admin: admin.publicKey,
        feeDestination: admin.publicKey,
      })
      .rpc();

    const state = await program.account.globalState.fetch(globalState);
    assert.equal(state.admin.toBase58(), admin.publicKey.toBase58());
  });

  it("Provides tokens via Faucet PDA", async () => {
    const faucetAmount = new anchor.BN(1000_000_000); // 1000 IDRX

    const [mintAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("mint_authority")],
      program.programId
    );

    // Transfer mint authority to PDA first (Mocking what we did in CLI)
    await anchor.web3.sendAndConfirmTransaction(
      provider.connection,
      new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.transfer({
          fromPubkey: admin.publicKey,
          toPubkey: mintAuthority,
          lamports: 10000000,
        })
      ),
      [admin]
    );

    // Note: In local tests, we manually set authority for the mock mint
    const { setAuthority, AuthorityType } = await import("@solana/spl-token");
    await setAuthority(
      provider.connection,
      admin,
      idrxMint,
      admin.publicKey,
      AuthorityType.MintTokens,
      mintAuthority
    );

    const initialBalance = (await getAccount(provider.connection, userTokenAccount)).amount;

    await program.methods
      .faucet(faucetAmount)
      .accountsPartial({
        mint: idrxMint,
        userAta: userTokenAccount,
        mintAuthority,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    const finalBalance = (await getAccount(provider.connection, userTokenAccount)).amount;
    assert.equal(
      Number(finalBalance) - Number(initialBalance),
      faucetAmount.toNumber()
    );
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

    const maxCapacity = new anchor.BN(5_000_000_000);
    const apy = new anchor.BN(615); // 6.15%

    const name = "Steak Series SS001";

    await program.methods
      .createBatch(batchId, lockDuration, maxCapacity, apy, goats, cows, name)
      .accountsPartial({
        batch,
        batchVault,
        usdcMint: idrxMint,
        admin: admin.publicKey,
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
      .accountsPartial({
        batch,
        batchVault,
        userStake,
        globalState,
        userTokenAccount,
        user: user.publicKey,
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
      .accountsPartial({
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

    const [mintAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("mint_authority")],
      program.programId
    );

    // Use our own faucet to fund admin for the harvest revenue
    await program.methods
      .faucet(finalRevenue)
      .accountsPartial({
        mint: idrxMint,
        userAta: adminTokenAccount,
        mintAuthority,
        user: admin.publicKey,
      })
      .rpc();

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
      .accountsPartial({
        globalState,
        batch,
        batchVault,
        adminTokenAccount,
        admin: admin.publicKey,
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
      .accountsPartial({
        batch,
        batchVault,
        userStake,
        userTokenAccount,
        user: user.publicKey,
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
