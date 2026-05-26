# HubSpot Integration — AI Maturity Survey

## 1. Recommended HubSpot architecture

### Recommendation
Keep the React app as the survey front end and sync data into HubSpot using the **Forms submission API**.

### Why
- Native HubSpot feedback surveys are available on **Service Hub Professional / Enterprise** and support custom surveys, steps, conditional logic, and survey response properties, but they are not a good fit for the required matrix-heavy UX and app-like rendering.
- Non-HubSpot form collection is not reliable for this app because HubSpot’s collected non-HubSpot forms tool does **not** support single-page apps and does not collect hidden fields.
- Standard HubSpot forms + Forms API give the cleanest path for contact creation, attribution, workflows, and marketing automation.

## 2. Required hubs / tiers by capability

| Capability | Hub / Tier required | Notes |
|---|---|---|
| Custom contact properties | HubSpot Free+ | Free supports only 10 total custom properties; this project needs paid tier due to property volume |
| Forms | HubSpot Free+ / Marketing Hub Starter+ | Available broadly; paid tiers add cleaner branding and more capability |
| Marketing emails | Marketing Hub Starter+ | Needed for results email sends |
| Contact-based workflows | Marketing Hub Pro/Enterprise **or** Sales Hub Pro/Enterprise **or** Service Hub Pro/Enterprise | Workflows require Professional or Enterprise |
| Advanced nurture branching | Marketing Hub Pro/Enterprise | Best fit for contact journeys |
| Deal creation via workflow | Professional or Enterprise with workflows | Uses Create record / Create deal action |
| Active lists / segmentation | Available broadly; best operationally with Marketing Hub | Needed for dynamic segmentation |
| Reporting dashboard | Reporting tools available, custom sophistication best with paid hubs | Use custom reports + dashboards |
| Customer feedback surveys | Service Hub Pro/Enterprise | Not recommended as core survey UX here |
| CMS-hosted alternative | Content Hub / CMS Hub | Optional if hosting in HubSpot |

## 3. Lead capture recommendation

### Options compared

| Option | Fit | Recommendation |
|---|---|---|
| Marketing Forms | Strong | Best if you want HubSpot-native form object and submit via API |
| HubSpot Surveys (Service Hub) | Weak for this use case | Not recommended as primary collection method |
| Forms API from React app | Best | **Recommended** |

### Final recommendation
Use a **HubSpot form** as the data contract and submit to it from the React app via:

`POST /submissions/v3/integration/submit/{portalId}/{formGuid}`

This gives:
- contact creation/update,
- attribution with `hutk`,
- form submission history,
- workflow triggers on form submission,
- marketing source tracking.

## 4. Contact property design

### General design rules
- Use **Dropdown select** or **Radio select** for ordinal/single-choice questions.
- Use **Multiple checkboxes** for multi-select questions.
- Use **Single-line text** for complex matrix serialization when keeping the React app as the renderer.
- Use **Number** for score.
- Use **Dropdown select** for maturity level.
- Use **Date picker** or datetime-compatible capture pattern for completion date (if using form, date-only is simpler).
- Use **Single checkbox** for consent.

### Property list

| Internal name | Label | Type | Notes |
|---|---|---|---|
| ai_survey_q01 | AI Survey Q01 | dropdown select | Single-choice |
| ai_survey_q02 | AI Survey Q02 | dropdown select | Revenue band |
| ai_survey_q03 | AI Survey Q03 | dropdown select | Employee band |
| ai_survey_q04 | AI Survey Q04 | dropdown select | Business unit |
| ai_survey_q05 | AI Survey Q05 | dropdown select | Role |
| ai_survey_q06 | AI Survey Q06 | dropdown select | Industry |
| ai_survey_q07 | AI Survey Q07 | single-line text | Matrix serialized |
| ai_survey_q08 | AI Survey Q08 | single-line text | Matrix serialized |
| ai_survey_q09 | AI Survey Q09 | dropdown select | Single-choice |
| ai_survey_q10 | AI Survey Q10 | single-line text | Matrix serialized |
| ai_survey_q11 | AI Survey Q11 | dropdown select | Single-choice |
| ai_survey_q12 | AI Survey Q12 | dropdown select | Single-choice |
| ai_survey_q13 | AI Survey Q13 | single-line text | Matrix serialized |
| ai_survey_q14 | AI Survey Q14 | multiple checkboxes | Could also serialize if options exceed practical admin comfort |
| ai_survey_q15 | AI Survey Q15 | multiple checkboxes | Max 3 in app logic |
| ai_survey_q16 | AI Survey Q16 | dropdown select | Single-choice |
| ai_survey_q17 | AI Survey Q17 | single-line text | Matrix serialized |
| ai_survey_q18 | AI Survey Q18 | dropdown select | Single-choice |
| ai_survey_q19 | AI Survey Q19 | multiple checkboxes | Max 3 in app logic |
| ai_survey_q20 | AI Survey Q20 | dropdown select | Single-choice |
| ai_survey_q21 | AI Survey Q21 | dropdown select | Single-choice |
| ai_survey_q22 | AI Survey Q22 | single-line text | Matrix-column serialized |
| ai_survey_q23 | AI Survey Q23 | dropdown select | Single-choice |
| ai_survey_q24 | AI Survey Q24 | multiple checkboxes | Multi-select |
| ai_survey_q25 | AI Survey Q25 | dropdown select | Single-choice |
| ai_survey_q26 | AI Survey Q26 | dropdown select | Single-choice |
| ai_survey_q27 | AI Survey Q27 | dropdown select | Single-choice |
| ai_survey_q28 | AI Survey Q28 | dropdown select | Single-choice |
| ai_survey_q29 | AI Survey Q29 | single-line text | Matrix serialized |
| ai_survey_q30 | AI Survey Q30 | dropdown select | Single-choice |
| ai_survey_q31 | AI Survey Q31 | dropdown select | Single-choice |
| ai_survey_q32 | AI Survey Q32 | single-line text | Matrix serialized |
| ai_maturity_score | AI Maturity Score | number | Store decimal score |
| ai_maturity_level | AI Maturity Level | dropdown select | Values 1–5 or key strings |
| ai_survey_completed_at | AI Survey Completed At | date picker or datetime strategy | Prefer date + separate timestamp if needed |
| ai_survey_consent | AI Survey Consent | single checkbox | Marketing consent flag |
| ai_survey_version | AI Survey Version | single-line text | E.g. `v1.0` |
| ai_survey_source | AI Survey Source | single-line text | E.g. `react-pwa` |

## 5. Suggested enumeration values

### ai_maturity_level
- `1_exploring`
- `2_experimenting`
- `3_scaling`
- `4_operationalizing`
- `5_ai_first_enterprise`

### Recommendation
Use stable internal values in English and user-facing labels in English or Hebrew as needed.

## 6. Sample Forms API request

### Endpoint
`POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`

### Sample payload
```json
{
  "submittedAt": 1779727140000,
  "fields": [
    { "name": "email", "value": "executive@example.com" },
    { "name": "firstname", "value": "Dana" },
    { "name": "lastname", "value": "Levi" },
    { "name": "ai_survey_q01", "value": "decision_team" },
    { "name": "ai_survey_q02", "value": "1_5b_ils" },
    { "name": "ai_survey_q03", "value": "1001_5000" },
    { "name": "ai_survey_q04", "value": "it" },
    { "name": "ai_survey_q05", "value": "cto" },
    { "name": "ai_survey_q06", "value": "high_tech" },
    { "name": "ai_survey_q07", "value": "generative_ai:4|agentic_ai:3" },
    { "name": "ai_survey_q08", "value": "talent:3|infrastructure:4|strategy:4|risk_governance:2|data_management:3" },
    { "name": "ai_survey_q09", "value": "increase_gt_20" },
    { "name": "ai_survey_q10", "value": "marketing_sales_service:3|finance:2|legal_risk:2|hr:2|it_cyber:3|strategy_ops:3|supply_chain_manufacturing:2|product_rd:3" },
    { "name": "ai_survey_q11", "value": "61_80" },
    { "name": "ai_survey_q12", "value": "41_60" },
    { "name": "ai_survey_q13", "value": "today:40|next_3_6_months:60" },
    { "name": "ai_survey_q14", "value": "costs_resources;talent_gaps;governance_risk" },
    { "name": "ai_survey_q15", "value": "compute;data_storage;security_compliance" },
    { "name": "ai_survey_q16", "value": "very_confident" },
    { "name": "ai_survey_q17", "value": "efficiency:current|revenue:expected|innovation:expected" },
    { "name": "ai_survey_q18", "value": "redesign_key_processes" },
    { "name": "ai_survey_q19", "value": "privacy_security;governance_control;workforce_impact" },
    { "name": "ai_survey_q20", "value": "broad" },
    { "name": "ai_survey_q21", "value": "some_increase" },
    { "name": "ai_survey_q22", "value": "within_1_year:2|within_3_years:3|within_10_years:4" },
    { "name": "ai_survey_q23", "value": "skills_gap" },
    { "name": "ai_survey_q24", "value": "upskilling;employee_training;new_career_paths" },
    { "name": "ai_survey_q25", "value": "no_change" },
    { "name": "ai_survey_q26", "value": "interested_not_proactive" },
    { "name": "ai_survey_q27", "value": "moderate" },
    { "name": "ai_survey_q28", "value": "knowledge_search" },
    { "name": "ai_survey_q29", "value": "today:2|in_two_years:4" },
    { "name": "ai_survey_q30", "value": "developing" },
    { "name": "ai_survey_q31", "value": "it_devops_cyber" },
    { "name": "ai_survey_q32", "value": "operating_model:3|technology:2|data:3|governance:2|ai_talent:3" },
    { "name": "ai_maturity_score", "value": "3.42" },
    { "name": "ai_maturity_level", "value": "4_operationalizing" },
    { "name": "ai_survey_completed_at", "value": "2026-05-25" },
    { "name": "ai_survey_consent", "value": "true" },
    { "name": "ai_survey_version", "value": "v1.0" },
    { "name": "ai_survey_source", "value": "react_pwa" }
  ],
  "context": {
    "hutk": "abc123-def456-ghi789",
    "pageUri": "https://survey.example.com/summary",
    "pageName": "AI Maturity Survey"
  },
  "legalConsentOptions": {
    "consent": {
      "consentToProcess": true,
      "text": "I agree to allow Deloitte to store and process my personal data.",
      "communications": [
        {
          "value": true,
          "subscriptionTypeId": 999,
          "text": "I agree to receive AI-related updates and follow-up communications from Deloitte."
        }
      ]
    }
  }
}
```

## 7. Hidden fields and tracking cookie handling

### hutk
Pass the HubSpot tracking cookie value as `context.hutk` in the Forms API payload for attribution.

### Recommended client logic
```js
const hutk = document.cookie
  .split('; ')
  .find(row => row.startsWith('hubspotutk='))
  ?.split('=')[1];
```

### Hidden fields to include
- `ai_survey_version`
- `ai_survey_source`
- campaign / utm fields if desired
- landing page variant ID if applicable

### Important limitation
Do **not** rely on the non-HubSpot forms collector for this React app because HubSpot documents that collected non-HubSpot forms do not work on SPAs and do not collect hidden fields.

## 8. Workflow design

### Enrollment trigger
**Contact-based workflow** enrolled on:
- form submission for the AI Survey form, or
- property `ai_survey_completed_at` is known, or
- property `ai_maturity_level` is known.

### Required tier
**Professional or Enterprise** workflows.

### Workflow 1 — Lifecycle / lead status routing

#### Trigger
- Submitted AI Survey form
- Consent = true or false, depending on branch purpose

#### Actions
1. Set `Lead status`
2. Set `Lifecycle stage`
3. Branch by `ai_maturity_level`

#### Recommended routing
- **Level 4–5** → set `Lead status = Open` or agreed SQL-prep status; optionally set `Lifecycle stage = SQL`
- **Level 1–3** → set `Lead status = New` / `Nurturing`; set `Lifecycle stage = MQL`

### Important lifecycle note
HubSpot workflows can move lifecycle stage forward directly with **Edit record**. Moving backwards requires clearing then resetting.

## 9. Results email automation

### Required hub / tier
- **Marketing Hub Starter+** to send marketing emails
- **Marketing Hub Professional / Enterprise** preferred for workflow-driven branching and operational control

### Approach
Create **5 marketing emails**, one per maturity level:
- Level 1 results email
- Level 2 results email
- Level 3 results email
- Level 4 results email
- Level 5 results email

### Merge fields to use
- `{{ contact.firstname }}`
- `{{ contact.ai_maturity_score }}`
- `{{ contact.ai_maturity_level }}`
- optional role / industry / revenue personalization fields

### Workflow branch logic
If consent is true:
- branch by `ai_maturity_level`
- send corresponding marketing email
- assign nurture list / segment

If consent is false:
- do not send nurture email
- optionally send operational/internal notification only if legally allowed

## 10. Lists / segmentation

### Recommended dynamic lists
- AI Survey — All completions
- AI Survey — Consent = true
- AI Survey — Level 1
- AI Survey — Level 2
- AI Survey — Level 3
- AI Survey — Level 4
- AI Survey — Level 5
- AI Survey — Level 4–5 + Revenue > 1B
- AI Survey — Industry = {Q6 value}
- AI Survey — Revenue band = {Q2 value}
- AI Survey — Role = {Q5 value}

### Filters
Use contact properties:
- `ai_maturity_level`
- `ai_survey_completed_at`
- `ai_survey_consent`
- `ai_survey_q02`
- `ai_survey_q05`
- `ai_survey_q06`

## 11. Deal creation design

### Business rule
Optionally create a deal for respondents who meet both:
- `ai_maturity_level` in Level 4–5
- `ai_survey_q02` indicates `>1B` or `1–5B` or `>5B` depending on final threshold

### Required tier
Workflows with deal creation require **Professional or Enterprise**.

### Recommended action
Use workflow **Create record** / **Create deal** action.

### Suggested deal fields
- Pipeline: `AI Survey`
- Deal stage: `New / Qualification`
- Deal name: `{Company} — AI Survey — {Level}`
- Amount: optional / blank
- Owner: mapped Deloitte rep
- Source property: `AI Survey`

## 12. Reporting

### Dashboard recommendations
Build a dashboard with:
1. Form submission count over time
2. Completion count over time
3. Score histogram (`ai_maturity_score`)
4. Level distribution (`ai_maturity_level`)
5. Level by industry (`ai_survey_q06`)
6. Level by revenue band (`ai_survey_q02`)
7. MQL vs SQL created from survey
8. Deals created from survey cohort

### HubSpot report types
- custom single-object contact reports
- funnel / conversion views where available
- dashboards combining contact + deal reports

## 13. GDPR / consent

### Required capabilities
- form consent capture
- marketing Subscription Types
- optional Double opt-in if Deloitte requires confirmation before nurture

### Recommendation
- Always capture explicit processing consent
- Capture separate marketing communications consent for nurture email
- If the audience includes Israeli respondents only, local legal review is still required; if GDPR may apply, do not infer marketing consent from survey completion alone
- Use `legalConsentOptions` in Forms API submission for auditability

## 14. Native survey limitations and best path

### Native feedback survey path — limitations
- Requires **Service Hub Professional / Enterprise**
- Supports custom surveys, steps, conditional logic, and survey response properties
- Not suitable for complex matrix UI at the level required here
- Survey response properties live on the **survey response object**, not on contact properties directly

### Best path
**Keep the React app and sync data to HubSpot using the Forms API.**

### Alternatives
1. **Custom CMS module in HubSpot**
   - Best if survey must be fully hosted inside HubSpot CMS
   - More implementation effort than keeping current app
2. **Split matrix into multiple native form fields**
   - Weak UX
   - Harder to maintain
   - Not recommended
3. **Service Hub custom survey**
   - Better for basic feedback collection
   - Not recommended for this assessment UX

## 15. Optional HubL snippet (if embedding HubSpot tracking on a HubSpot page)

```html
<script>
  window.hsSurveyMeta = {
    surveyVersion: 'v1.0',
    surveySource: 'react_pwa'
  };
</script>
<div id="root"></div>
```

## 16. Implementation recommendation summary
1. Create contact properties in HubSpot **Settings → Properties → Contact properties**.
2. Create a dedicated HubSpot form in **Marketing → Forms**.
3. Submit from React app to Forms API.
4. Pass `hutk`, page URI, and legal consent in payload.
5. Trigger contact-based workflows in **Automation → Workflows**.
6. Send level-specific emails from **Marketing → Email**.
7. Build segments and reports from contact properties.
