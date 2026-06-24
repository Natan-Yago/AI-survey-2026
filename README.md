# AI Survey 2026 — Design Preview MVP

A static, design-only preview of the **Deloitte State of AI · Israel 2026**
respondent flow, intended for internal stakeholder review (CMO walkthrough).

> This is not the production survey. Answers are **not scored** and are not sent
> anywhere. The end-of-flow screen lets the reviewer pick any of the five
> summary archetypes manually so each path can be inspected.

## Live preview

After the first successful deployment, the site is published at:

**https://natan-yago.github.io/AI-survey-2026/**

## What's inside

- [demo/](demo/) — self-contained static site published to GitHub Pages.
  - `index.html` — design gallery
  - `welcome.html` → `question-single.html` → `thank-you.html`
  - `thank-you.html` — **summary path picker** (5 archetype cards)
  - `summary-explorer.html`, `summary-pilot-stuck.html`,
    `summary-workforce.html`, `summary-cautious.html`,
    `summary-scaler.html` — the five summary paths
- [design/](design/) — original working design folder (source of truth, not
  published).
- [.github/workflows/pages.yml](.github/workflows/pages.yml) — Pages deployment.

## Run locally

Open `demo/index.html` directly in a browser, or serve the folder:

```bash
cd demo
python3 -m http.server 8000
# then visit http://localhost:8000/
```

## Deploy

Push to `main`. The workflow uploads `./demo` and publishes it via GitHub
Pages. In the GitHub repo, set **Settings → Pages → Source = GitHub Actions**
once on initial setup.
