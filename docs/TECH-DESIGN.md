# Technical Design — AI Maturity Survey

## 1. Architecture overview

```text
+-----------------------------+
| React PWA (Vite + TS)       |
| - survey UI                 |
| - scoring preview (optional)|
| - localStorage persistence  |
| - hutk capture              |
+-------------+---------------+
              |
              | HTTPS submit
              v
+-----------------------------+
| Forms submission layer      |
| Option A: HubSpot Forms API |
| Option B: Backend proxy     |
+-------------+---------------+
              |
              v
+-----------------------------+
| HubSpot CRM                 |
| - Contact properties        |
| - Lists / Segments          |
| - Workflows                 |
| - Marketing emails          |
| - Deals (optional)          |
| - Dashboards / Reports      |
+-----------------------------+
```

## 2. Application stack
- **Frontend:** React + TypeScript + Vite
- **Routing:** `BrowserRouter`
- **State:** `AnswersContext` + reducer / context state
- **Persistence:** `localStorage`
- **PWA:** `vite-plugin-pwa` + Workbox
- **Hosting:** Vercel, Netlify, or HubSpot CMS Hub
- **CRM sync:** HubSpot Forms API submit endpoint

## 3. Routing model

### Proposed routes
- `/` — welcome screen
- `/survey/:step` — question flow
- `/summary` — results page
- `/privacy` — privacy/legal page (optional)
- `/thank-you` — optional post-submit route if separated from summary

## 4. State model

```ts
interface SurveyAnswers {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: Record<string, string>;
  q8?: Record<string, string>;
  q9?: string;
  q10?: Record<string, string>;
  q11?: string;
  q12?: string;
  q13?: Record<string, string>;
  q14?: string[];
  q15?: string[];
  q16?: string;
  q17?: string[];
  q18?: string;
  q19?: string[];
  q20?: string;
  q21?: string;
  q22?: Record<string, string>;
  q23?: string;
  q24?: string[];
  q25?: string;
  q26?: string;
  q27?: string;
  q28?: string;
  q29?: Record<string, string>;
  q30?: string;
  q31?: string;
  q32?: Record<string, string>;
  consent?: boolean;
  email?: string;
}
```

## 5. Persistence strategy
- **Key:** `ai-maturity-survey:v1`
- Save after each step
- Restore on app init
- Clear on explicit reset or successful final submission

## 6. Scoring algorithm

### Requirements
- Pure function
- Deterministic
- Ignores non-scored questions and "לא יודע/ת"
- Returns numeric score + level

### Signature
```ts
function scoreSurvey(answers: SurveyAnswers): {
  score: number;
  level: 1 | 2 | 3 | 4 | 5;
  levelKey: 'exploring' | 'experimenting' | 'scaling' | 'operationalizing' | 'ai_first';
  scoredItemsCount: number;
}
```

### Scored questions
- Scored: Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q16, Q18, Q20, Q21, Q22, Q26, Q27, Q29, Q30, Q32
- Skipped: Q1–Q6, Q14, Q15, Q19, Q24, Q23, Q25, Q28, Q31

### Mapping summary
- **Q7:** DESC 5→1
- **Q8:** ASC 1→5
- **Q9:** ASC 1→5; skip "לא יודע/ת"
- **Q10:** no plans=1 / pilots=3 / scaled=5
- **Q11:** DESC >80%=5 → <20%=1; skip "לא יודע/ת"
- **Q12:** ASC <20%=1 → >80%=5; skip "לא יודע/ת"
- **Q13:** 0–10%=1, 20–30%=2, 40–50%=3, 60–70%=4, 80–100%=5; skip "לא יודע"
- **Q16/Q18/Q20/Q21/Q26/Q27/Q30:** ordinal 1..5
- **Q22:** row index + 1 per column
- **Q29:** ordinal 1..5
- **Q32:** solved=5, 12 months=4, 2 years=3, >2 years=2, skip don't know

### Level resolution
```ts
if (score <= 1.8) level = 1;
else if (score <= 2.6) level = 2;
else if (score <= 3.4) level = 3;
else if (score <= 4.2) level = 4;
else level = 5;
```

## 7. Question rendering system
Use a JSON-driven config rather than hardcoding 32 screens.

### Renderer components
- `SingleChoiceQuestion`
- `MultiChoiceQuestion`
- `MatrixSingleQuestion`
- `MatrixColumnSingleQuestion`
- `MatrixMultiQuestion`
- `FactModal`
- `ProgressHeader`
- `StickyNavBar`

## 8. Benchmark facts behavior
- Facts are mapped to Q9, Q12, Q13, Q17, Q18, Q20, Q22, Q26, Q29, Q30
- They display after the user answers the mapped question
- They are not conditional on selected value
- They do not affect scoring

## 9. PWA strategy

### Tools
- `vite-plugin-pwa`
- Workbox precache
- Service worker registration on production builds

### Offline goals
- App shell cached after first load
- Static assets precached
- Graceful offline fallback page
- localStorage preserves answers if network is unavailable

### Limitations
- Submission to HubSpot requires connectivity
- Attribution accuracy may be degraded when submit occurs after offline period
- iOS installability and background caching remain browser-dependent

## 10. Hosting comparison

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| Vercel | Fast deploys, preview envs, simple CI/CD, good for React SPA | Separate from HubSpot CMS, cross-domain governance needed | Strong option |
| Netlify | Similar to Vercel, easy static hosting | Similar cross-domain separation | Strong option |
| HubSpot CMS Hub | Single platform, can use HubSpot domains, easier brand/content governance | Less natural fit for a Vite SPA deployment workflow, still needs custom approach | Good if consolidation matters |

### Recommendation
For v1, keep the React app and host on **Vercel** or **Netlify** unless Deloitte explicitly prefers CMS consolidation. Use HubSpot for CRM, automation, forms submission, lists, reporting, and campaign attribution.

## 11. Security design
- No PII submission to HubSpot before user provides required fields and consent state
- Sanitize all free-text and hidden input values before submit
- Validate payload shape client-side and server-side (if proxy used)
- Do not expose private app tokens in the browser
- If a backend proxy is introduced, store secrets server-side only
- Apply CSP headers on hosted app
- Use HTTPS only
- Avoid embedding sensitive data in query params

## 12. Recommended submission model
### Preferred
Client submits to HubSpot Forms API directly using a standard HubSpot form configured with matching property internal names.

### Alternative
Use a lightweight backend proxy if:
- secret-based API extensions are required,
- additional validation is needed,
- you want server-side event fan-out before HubSpot submit.

## 13. HubSpot data sync notes
- Use contact properties for all survey data needed for segmentation and nurture
- Use HubSpot workflows for level routing and follow-up
- Optional: store raw JSON snapshot outside HubSpot if full-answer analytics become too complex for contact properties alone
