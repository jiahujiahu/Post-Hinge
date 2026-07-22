# AfterHinge

**The AI copilot for everything after “We matched.”**

AfterHinge is a hackathon MVP React app that helps engaged couples plan a wedding without hiring a traditional wedding planner. It includes a personalized dashboard, timeline, vendor quote analyzer, budget tracker, AI email generator, and context-aware assistant — all powered by local mock data and `localStorage`.

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn-style UI components
- React Router
- Lucide React
- Recharts
- React Hook Form + Zod
- Sonner toasts

## Run locally

Requires **Node.js 18.18+** (Node 20 LTS recommended). Vite 8+ needs Node 20+, so this project is pinned to Vite 6 for broader compatibility.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

If you previously installed dependencies under Vite 8, delete `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Demo walkthrough

1. Open `/` and click **Plan our wedding** (or **View demo** to skip).
2. Complete onboarding (sample Maya & Alex values are prefilled).
3. Land on the personalized dashboard and follow the presenter walkthrough card.
4. Open **Vendors**, keep the Northlight Photography sample, click **Analyze quote**.
5. Watch the animated analysis, then review the three-photographer comparison.
6. Click **Generate negotiation email** and copy/save the draft.
7. Open **Budget** to review the projected overrun warning.
8. Open **Assistant** (or use the budget CTA) and ask: **Can we afford a live band?**
9. Use **Reset demo data** in the sidebar anytime to restore the sample wedding.

## Project structure

```text
src/
  components/          # Reusable UI + feature components
  components/ui/       # shadcn-style primitives
  components/layout/   # Sidebar, mobile nav, app shell
  context/             # App state + localStorage persistence
  data/                # Sample wedding mock data
  lib/                 # Budget, email, assistant, quote helpers
  pages/               # Route-level screens
  types/               # Shared TypeScript interfaces
```

## Notes

- No backend, auth, payments, or API keys required.
- Vendor price benchmarks are labeled as demo estimates.
- Onboarding, tasks, expenses, quote selections, and email drafts persist in `localStorage`.
