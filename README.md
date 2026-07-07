# AI Survey 2026

A React + TypeScript + Vite single-page app implementing the **Deloitte State
of AI · Israel 2026** maturity assessment: a 32-question Hebrew, RTL,
mobile-first survey that scores respondents and shows a tailored results page.

## Live preview

After a successful deployment, the site is published at:

**https://natan-yago.github.io/AI-survey-2026/**

## What's inside

- [src/](src/) — the React application (pages, components, scoring logic,
  question data).
- [public/](public/) — static assets (logo, images, favicon) served as-is.
- [e2e/](e2e/) — Playwright end-to-end tests.
- [docs/](docs/) — product/technical docs (PRD, tech design, QA plan, Azure SQL
  handoff).
- [.github/workflows/pages.yml](.github/workflows/pages.yml) — builds the app
  (`npm run build` → `dist/`) and deploys it to GitHub Pages.

## Run locally

```bash
npm install
npm run dev
# then visit http://localhost:5173
```

## Testing

```bash
npm test        # unit/component/integration tests (Vitest)
npm run coverage
npm run e2e     # Playwright end-to-end tests
npm run lint    # tsc type-check
```

## Deploy

Push to `main`. The workflow runs `npm run build`, uploads `./dist`, and
publishes it via GitHub Pages. In the GitHub repo, set **Settings → Pages →
Source = GitHub Actions** once on initial setup.

## Developer handoff — Azure SQL & hosting

For connecting the React app to **Microsoft Azure SQL** and hosting it on
Azure, see [docs/AZURE-SQL-HANDOFF.md](docs/AZURE-SQL-HANDOFF.md). It covers the
current architecture, the data contract, a proposed SQL schema, the backend API
contract, backend/hosting options, and a security checklist.
