# Solana Anchor Program

This project is a Solana smart contract (program) built with [Anchor](https://book.anchor-lang.com/), a framework for Solana development.

## 🛠️ Getting Started

### 1. Install Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://book.anchor-lang.com/getting_started/installation.html)

### 2. Build the Program

```bash
anchor build
```

### 3. Test the Program

```bash
anchor test
```

### 4. Deploy to Devnet

```bash
solana config set --url devnet
anchor deploy
```

### 5. Update Program ID

After deploying, update the `declare_id!` macro in `programs/program/src/lib.rs` and the `[programs.devnet]` section in `Anchor.toml` with your new program ID.

---

## 📁 Project Structure

```
program/
  Anchor.toml
  programs/
    program/
      src/
        lib.rs        # Main program logic
      Cargo.toml
  tests/
    program.ts        # Example test file
```

---

## 🧩 Useful Scripts

- `npm run dev` — Start the Next.js frontend in development mode
- `npm run build` — Build the Next.js frontend for production
- `anchor build` — Build the Solana program
- `anchor test` — Run Anchor tests
- `anchor deploy` — Deploy the Solana program to the configured cluster

---

## 📚 Resources

- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Docs](https://docs.solana.com/)
- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)

---

## 📝 License

MIT
