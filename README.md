<div align="center">

# 🔮 AURA Copilot
**AI-Powered DeFi Intelligence**

Discover **hidden DeFi opportunities**, **unclaimed airdrops**, and **stacked-yield plays** for any wallet or ENS—fast and secure.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?logo=vercel)](https://aura-copilot-7hhs3fsda-saferta.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Postgres](https://img.shields.io/badge/Postgres-Neon-1BFF9E?logo=postgresql&logoColor=white)](https://neon.tech/)

**Live Demo**: [aura-copilot.vercel.app](https://aura-copilot-7hhs3fsda-saferta.vercel.app/)

</div>

---

## ✨ Features

- 🧠 **AI-Powered Analysis**: Portfolio insights and recommendations powered by Anthropic (optional).
- 🛡️ **Security Scans**: Heuristic checks and warnings alongside opportunities.
- ⚡ **Actionable Insights**: Context-aware links to execute strategies on supported platforms.
- 📊 **Interactive Dashboard**: Displays TVL estimates, network count, cache TTL, and ranked sections.
- 📌 **Watchlist**: Save strategies to Postgres via Prisma (Neon in production).
- 💎 **Polished UX**: Dark glassmorphism design, animated hero, demo chips, and keyboard-first navigation.

---

## 🖼️ Screenshots

> **Tip**: Add your own screenshots by dragging and dropping images into this README after cloning.

| **Hero & Search** | **Insights** | **Watchlist** |
|--------------------|--------------|---------------|
| Welcoming hero with ENS/address input and demo chips | Categorized results: *Unclaimed/Airdrops*, *Double-Dip*, *Other* | Saved strategies displayed in glassmorphic cards |

---

## 🧭 Architecture

```plaintext
Next.js (App Router, TypeScript)
├── UI: Tailwind CSS (glassmorphism)
├── /api/resolve: ENS → 0x… resolver (read-only)
├── /api/insights: AURA API (balances + strategies) + local scoring + Prisma cache
├── /api/bookmarks: Read/write bookmarks (Postgres)
└── /api/ai-analysis: Optional Anthropic-powered summary

AURA API: https://aura.adex.network/api (public; 10 unique wallets/24h without key)
Postgres: Neon (serverless) via Prisma
