AURA Copilot — AI-Powered DeFi Opportunity Scanner

Find hidden money on-chain.
AURA Copilot analyzes any wallet with the AURA API, then surfaces unclaimed airdrops, stacked-yield plays, and personalized strategy insights—ranked by score & risk, backed by security checks, and explained in plain language by Claude.

🚀 Built for this hackathon: real AI, MCP integration, security validation, charts, and one-click execution links. Not a demo—an app you can run.

✨ Why it’s different

Real AI Analysis – Claude reviews balances + strategies and returns a risk profile, health score, and personalized recommendations (not just math).

Security Scanner – Lightweight heuristics flag risky language & missing verifications; every card shows a Security 0–100 and warnings.

Visual Intelligence – Three focused charts: Risk distribution, APY comparison, Network distribution.

Actionable – Deep links to protocols, plus a watchlist via /api/bookmarks.

Model Context Protocol (MCP) – A tiny server exposes an analyze_wallet tool so Claude/ChatGPT clients can call your app directly.

Production touches – SWR caching, API rate-limit guard, error states, and a polished UI (glassmorphism, gradients, micro-interactions).

🖼 Screens (add later if you want)

Hero + wallet input

AI Analysis panel (expanded)

Charts row

Strategy list with Risk + Security badges

Drag screenshots into public/ and reference them here.

🧩 Architecture
/aura-copilot
  ├─ src/app
  │   ├─ api/              # Next.js route handlers (AURA, AI, bookmarks, ENS resolve)
  │   ├─ components/       # UI: StrategyList, StrategyCard, AIAnalysis, Charts, etc.
  │   ├─ layout.tsx        # Premium shell (gradient + glassmorphism)
  │   └─ page.tsx          # Home (server) -> HomeClient (client)
  └─ src/lib
      ├─ ai.ts             # Claude client + analyzePortfolioWithAI()
      ├─ aura.ts           # AURA API helpers
      ├─ security.ts       # heuristics-based scanner (score/level/warnings)
      ├─ execution.ts      # deep-link helper
      └─ scoring.ts        # opportunity scoring utilities

/mcp-server
  ├─ src/index.ts          # MCP tool: analyze_wallet(address)
  └─ tsconfig.json


Key APIs

GET /api/insights?address=0x... → AURA strategies + normalized payload

GET /api/aura/balances?address=0x... → AURA balances

GET /api/ai-analysis?address=0x... → Claude analysis text

POST /api/bookmarks → Save to watchlist

GET /api/resolve?input=vitalik.eth → ENS/addr resolution

⚙️ Tech Stack

Next.js 15 / React 19 (Turbopack)

TypeScript, Tailwind

SWR for data fetching, Recharts for charts

Anthropic SDK (Claude)

AURA API (core data)

MCP SDK (Model Context Protocol)

🔐 Security Notes

Read-only wallet analysis (no keys)

Strategy text scanned for risky phrases & missing verification

Client/API rate-limit guard to avoid abuse

Sanitized links; open in new tab with rel="noopener noreferrer"

Future: on-chain verification (contract bytecode checks/audit feeds), allow-list protocols.

🧪 Quick Start
1) Clone
git clone https://github.com/CosmasMandikonza/aura_copilot.git
cd aura_copilot

2) Env

Create .env.local in root of aura-copilot:

ANTHROPIC_API_KEY=your_key_here
AURA_API_BASE=https://aura.adex.network/api


(You can also add: NEXT_PUBLIC_RATE_LIMIT= etc. if you’ve included a limiter.)

3) Install & run (web app)
cd aura-copilot
npm install
npm run dev
# http://localhost:3000


Enter vitalik.eth or any 0x address and click Analyze.

4) MCP server (optional, hackathon-ready)
cd ../mcp-server
npm install
npm run dev
# Runs stdio MCP server; configure Claude Desktop to load it.


Add the server to Claude Desktop config as a tool provider (instructions in your hackathon doc/demo).

🧭 Usage Walkthrough

Enter wallet (ENS or 0x). ENS auto-resolves.

AI Analysis loads (risk profile, health score, recs).

Charts summarize risk/apy/network in seconds.

Strategies appear grouped: Unclaimed / Double-Dip / Other.

Each card shows Risk, Score, Security, platforms, networks, APY.

Click Execute to open the platform with helpful parameters.

Click Save to watchlist to persist via API.

📈 Judging Matrix (how this meets criteria)

Quality: polished UI, micro-interactions, clear hierarchy.

Functionality: real AURA data + AI + security + charts + watchlist.

Performance: SWR caching, API separation, lean components.

Security: content heuristics, safe links, rate limiting.

Copyright: original code; external APIs are credited/linked.

Originality: MCP + AI narrative + “hidden value” UX differentiator.

🗺 Roadmap (after hackathon)

Smart contract verification (Etherscan + bytecode pattern checks)

Wallet connect & signed actions

Advanced deep links per protocol (pool/chain preselection)

Multi-address portfolio blending

Export report (PDF) for on-chain audits

📜 License

MIT — see LICENSE (or specify your preferred license).

🙌 Acknowledgments

AdEx / AURA API for on-chain intelligence

Anthropic for Claude

MCP community for the protocol & SDK
