# 🥩 Steak Protocol

[![Solana](https://img.shields.io/badge/Solana-900-black?style=for-the-badge&logo=solana)](https://solana.com/)
[![Anchor](https://img.shields.io/badge/Anchor-0.32.1-blue?style=for-the-badge)](https://www.anchor-lang.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Steak Protocol** is the first decentralized platform on Solana for **Real World Animal Assets (RWA)**. We bridge the gap between traditional livestock farming and decentralized finance, allowing users to fund real animal batches and earn sustainable yield.

---

## ✨ Features

- **Animal Asset Staking**: Fund specific livestock batches (Goats, Bulls, Sheep) and earn yield from real-world growth.
- **RWA Integration**: Real-world fattening processes translated into on-chain yield.
- **Modern Dashboard**: A premium, high-end UI built with Framer Motion and GSAP.
- **Multi-Network Support**: Seamlessly switch between Localnet, Devnet, and Mainnet.
- **Secure Wallet Integration**: Powered by Solana Wallet Adapter with custom-styled UI.

---

## 🛠 Tech Stack

### Smart Contract
- **Language**: Rust
- **Framework**: Anchor
- **Program ID**: [`BRtHP3yGJNVyBi3mvYBvNFu4fTQevF6TJ6avX98KNSak`](https://explorer.solana.com/address/BRtHP3yGJNVyBi3mvYBvNFu4fTQevF6TJ6avX98KNSak?cluster=devnet)
- **Network**: Solana Devnet

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion & GSAP
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Solana CLI installed
- Anchor CLI installed
- Node.js (v18+) & pnpm

### Smart Contract Setup
1. Navigate to contract directory:
   ```bash
   cd steak_contract
   ```
2. Build the program:
   ```bash
   anchor build
   ```
3. Run tests:
   ```bash
   anchor test
   ```
4. Deploy to Localnet:
   ```bash
   solana-test-validator # In a separate terminal
   anchor deploy
   ```

5. **Deploy to Devnet**:
   ```bash
   solana config set --url devnet
   anchor build
   anchor deploy
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd steak_frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run development server:
   ```bash
   pnpm run dev
   ```

---

## 📜 License
This project is licensed under the ISC License.

---

## 🐄 Happy Staking!
Made with ❤️ by [WeissCurry](https://github.com/WeissCurry)
