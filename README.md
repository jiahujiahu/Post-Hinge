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

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Demo walkthrough

1. Open `/` for the landing page, then click **View demo**.
2. Explore Maya & Alex’s dashboard, timeline, and budget.
3. Go to **Vendors**, keep the Northlight Photography sample filled in, and click **Analyze quote**.
4. Generate a negotiation email on **Emails**.
5. Ask the assistant: “Can we afford a live band?”
6. Use **Reset demo data** in the sidebar anytime.

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
