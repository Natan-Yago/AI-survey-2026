# Product Requirements Document — AI Maturity Survey (Deloitte Israel)

## 1. Overview

### Product name
AI Maturity Survey / "סקר בשלות AI"

### Purpose
Launch a Hebrew, RTL, mobile-first AI maturity assessment for Deloitte Israel that:
- captures qualified executive leads,
- enriches contact records in HubSpot,
- segments respondents by AI maturity and firmographic profile,
- triggers targeted nurture and sales follow-up,
- produces market-research insights for Deloitte Israel.

## 2. Problem statement
Israeli enterprise leaders are under pressure to define their AI strategy, but many organizations lack a structured way to assess maturity across adoption, infrastructure, governance, workforce readiness, and advanced AI usage. Deloitte Israel needs a credible, executive-friendly digital assessment that both delivers value to respondents and creates actionable first-party data for marketing, sales, and research.

## 3. Business goals
1. Position Deloitte Israel as a strategic AI transformation advisor.
2. Generate net-new executive leads and enrich existing contacts.
3. Segment respondents by maturity level, industry, role, company size, and revenue band.
4. Route high-value/high-maturity respondents to business development quickly.
5. Build a reusable research dataset for aggregate insights and content.

## 4. Target audience
### Primary audience
- C-level and senior leaders at Israeli enterprises with **50+ FTE**
- Roles include CEO, COO, CFO, CIO, CTO, CMO, CHRO, board members, transformation leaders, VPs, directors

### Secondary audience
- Senior functional leaders in IT, data, strategy, operations, HR, finance, risk, and product

### Exclusions
- Small businesses below 50 FTE
- Students / non-business audiences
- Anonymous casual visitors with no lead-capture intent

## 5. Product summary
A respondent completes 32 Hebrew questions across 5 sections. The app calculates a 1.00–5.00 score, maps that score to one of five maturity levels, and displays a tailored results page. Specific questions show Deloitte global benchmark facts as informational popups immediately after the respondent answers them. Survey completion creates or enriches a HubSpot contact and triggers segmentation, lifecycle updates, and follow-up automation.

## 6. Success metrics

| Metric | Definition | Target / Direction |
|---|---|---|
| Survey start rate | % of landing page visitors who start the survey | Increase over baseline |
| Completion rate | % of starters who complete all 32 questions | Primary KPI |
| Consent rate | % of respondents who grant marketing consent | Primary KPI |
| Contact creation rate | % of completions that create/update a HubSpot contact | Near-complete |
| MQL volume | Number of respondents routed to MQL | Primary demand KPI |
| SQL volume | Number of respondents routed to SQL / sales follow-up | Primary sales KPI |
| Results-page dwell time | Time spent on summary page | Indicator of value |
| Email CTR by level | Click-through rate on post-survey results email | Optimization KPI |
| Deal creation rate | % of target respondents creating an AI Survey deal | Sales KPI |
| Score distribution | Distribution across Level 1–5 | Research KPI |
| Industry mix | Level distribution by Q6 | Research KPI |

## 7. In scope (v1)
- Hebrew-only survey experience
- RTL mobile-first UI
- Existing React/Vite/TypeScript app retained as core experience
- 32 questions exactly as approved
- One-question-per-screen flow
- Local session persistence / resume on same device
- HubSpot lead capture and property sync
- Score + maturity level calculation
- Results page with maturity summary
- Question-level Deloitte benchmark / fun-fact popups
- Basic HubSpot segmentation and workflow automation
- Results emails by maturity level
- Reporting dashboard in HubSpot

## 8. Out of scope (v1)
- Full database-backed respondent portal
- Multi-language support
- Anonymous cross-device resume
- Native HubSpot survey rendering as primary UX
- Client-side-only analytics without HubSpot sync
- PDF generation service beyond print-to-PDF
- Benchmark logic beyond the 10 approved facts
- A/B testing framework
- Admin CMS for live editing all survey content

## 9. v2 ideas
- English version
- Arabic version if needed
- Cross-device resume via tokenized draft service
- Better results personalization by industry / role
- Exportable PDF report
- Benchmark comparison widgets on results page
- Aggregate insights microsite
- HubDB-backed content configuration
- Custom object for survey submissions

## 10. Users and user stories

### A. Respondent
- As a senior leader, I want to complete a concise, mobile-friendly assessment so I can understand my organization’s AI maturity.
- As a respondent, I want to see a clear maturity result and explanation so I understand what it means.
- As a respondent, I want the survey to remember my progress if I leave and return on the same device.
- As a respondent, I want informative benchmark popups during the survey so I gain value before finishing.

### B. Deloitte sales / business development
- As a Deloitte rep, I want high-value respondents routed automatically so I can follow up quickly.
- As a Deloitte rep, I want the contact record enriched with survey answers, score, and level so I can personalize outreach.
- As a Deloitte rep, I want an optional deal created for strong-fit respondents so pipeline is visible.

### C. Marketing analyst
- As a marketing analyst, I want respondents segmented by level, role, revenue, and industry so I can build targeted nurture.
- As a marketing analyst, I want reporting on completion, distribution, and conversion so I can optimize the funnel.
- As a marketing analyst, I want content and survey versions tracked so analysis stays comparable over time.

## 11. Maturity levels

| Level | English label | Hebrew label | Score band |
|---|---|---:|---:|
| 1 | Exploring | בוחנים ראשוניים | 1.00–1.80 |
| 2 | Experimenting | מתנסים | 1.81–2.60 |
| 3 | Scaling | מתרחבים | 2.61–3.40 |
| 4 | Operationalizing | מטמיעים | 3.41–4.20 |
| 5 | AI-First Enterprise | AI-First Enterprise | 4.21–5.00 |

### Level 1 — Exploring / "ארגונים בשלבי בחינה ראשוניים"
**Positioning:** ארגונים ברמת בשלות זו נמצאים בשלבים מוקדמים מאוד של היכרות עם יכולות AI. השימוש עדיין נקודתי, ניסיוני או אישי, ואינו חלק אינטגרלי מהאסטרטגיה הארגונית.

**Implications**
- אין עדיין governance מסודר, תשתיות מותאמות או ownership ברור.
- יוזמות AI מתמקדות בלמידה, בחינת use cases ראשוניים וניסויים מוגבלים.
- קיימת אי ודאות בנוגע לערך, לסיכונים וליישומים המתאימים.

### Level 2 — Experimenting / "ארגונים בשלבי ניסוי והוכחת היתכנות"
**Positioning:** ארגונים אלה כבר מבצעים פיילוטים ויוזמות AI במספר תחומים, עם מעורבות ראשונית של הנהלה והשקעות ממוקדות. השימוש ב-AI מתחיל להתרחב מעבר לניסויים בודדים, אך לא מוטמע בקנה מידה רחב.

**Implications**
- אתגרים בבחירת use cases, מחסור בכישורים ותשתיות חלקיות.
- פערים בממשל ובניהול סיכונים.
- הכרה גוברת בפוטנציאל והתחלת בניית יכולות וידע ארגוני.

### Level 3 — Scaling / "ארגונים המרחיבים AI בקנה מידה ארגוני"
**Positioning:** שימוש משמעותי ב-AI במספר יחידות עסקיות ותהליכי ליבה. פתרונות AI עברו מפיילוט לפרודקשן ומייצרים השפעה מדידה.

**Implications**
- בנייה של תשתיות, governance ראשוני ויכולות workforce רחבות.
- מעורבות הנהלה גבוהה; AI נתפס ככלי עסקי אסטרטגי.
- עדיין בתהליך סטנדרטיזציה ושילוב AI עקבי ורוחבי.

### Level 4 — Operationalizing / "ארגונים שבהם AI מהווה חלק אינטגרלי מהפעילות"
**Positioning:** AI משולב באופן רחב בתהליכים, פונקציות עסקיות וקבלת החלטות. קיימים governance מסודר, תשתיות מותאמות ומודלי מדידה.

**Implications**
- AI הוא חלק ממודל ההפעלה, לא יוזמה נפרדת.
- redesign של תהליכים ותפקידים; השקעה שיטתית בטאלנט.
- ערך עסקי מדיד; AI משפיע על מוצרים, שירותים וחוויית לקוח.

### Level 5 — AI-First Enterprise / "ארגונים שבהם AI מהווה מנוע ליבה עסקי וארגוני"
**Positioning:** AI חלק מרכזי מהאסטרטגיה, מודל ההפעלה והיתרון התחרותי. מוטמע עמוק בהחלטות, מוצרים, שירותים וניהול כוח אדם.

**Implications**
- יכולות AI מתקדמות ורוחביות; שימוש נרחב ב-GenAI וב-Agentic AI.
- governance בוגר, תרבות תומכת adoption, תשתיות scale.
- AI אינו רק תומך — הוא מנוע להמצאה מחדש של תהליכים ומודלים עסקיים.

## 12. Deloitte benchmark facts

| Fact | Paired question | Text |
|---|---|---|
| 1 | Q9 | 📈 על פי הסקר העולמי של Deloitte לשנת 2026, תקציבי תשתיות AI צפויים לגדול פי 3.2 עד 2028, ובחברות גדולות אפילו פי 3.9. |
| 2 | Q12 | ⚡ בעולם, כיום רוב הארגונים צורכים בין 1B ל-10B טוקנים בחודש, אך עד 2028 רובם צפויים לעבור את רף ה-10B. |
| 3 | Q13 | 🚀 בסקר הגלובלי של Deloitte, רק 25% מהארגונים בעולם העבירו מעל 40% מניסויי ה-AI לפרודקשן, אך 54% מצפים להגיע לכך בתוך חצי שנה. |
| 4 | Q17 | 💰 בעולם, 74% מהארגונים מקווים להגדיל הכנסות באמצעות AI, אך רק 20% עושים זאת כיום בפועל. |
| 5 | Q18 | 🔄 על פי הסקר העולמי של Deloitte, רק כשליש מהארגונים בעולם משתמשים ב-AI לטרנספורמציה עמוקה של מוצרים, תהליכים ומודלים עסקיים. |
| 6 | Q20 | 👥 בעולם, 84% מהארגונים עדיין לא עיצבו מחדש תפקידים סביב יכולות AI. |
| 7 | Q22 | 🤖 על פי הסקר העולמי של Deloitte לשנת 2026, יותר משליש מהארגונים בעולם מצפים שלפחות 10% מהמשרות יעברו אוטומציה מלאה כבר בתוך שנה. |
| 8 | Q26 | 💡 בסקר הגלובלי של Deloitte, 55% מהעובדים הלא טכנולוגיים פתוחים להתנסות ב-AI, אבל רק 13% מחפשים אותו באופן יזום. |
| 9 | Q29 | 🧠 על פי הסקר העולמי של Deloitte לשנת 2026, השימוש המשמעותי ב-Agentic AI צפוי לגדול מ-23% כיום ל-74% בתוך שנתיים. |
| 10 | Q30 | 🛡️ רק 21% מהארגונים מדווחים שיש להם מודל governance בוגר לסוכני AI אוטונומיים. |

## 13. Functional requirements
1. The survey must present 32 approved questions in Hebrew.
2. The interface must support RTL and mobile-first rendering.
3. The app must support single, multi, matrix-single, matrix-column-single, and matrix-multi question types.
4. Benchmark facts must appear on mapped questions regardless of selected answer.
5. The app must calculate score and maturity level deterministically.
6. The app must capture explicit consent before marketing follow-up.
7. The app must create or enrich a HubSpot contact on submit.
8. The app must write score, level, completion timestamp, and consent to HubSpot.
9. The app must support attribution via HubSpot tracking cookie where available.
10. The app must trigger HubSpot segmentation and automation after submit.

## 14. Non-functional requirements
- Mobile-first performance
- Accessible keyboard navigation
- Accurate Hebrew rendering
- Deterministic scoring
- Secure submission handling
- Privacy-compliant consent capture

## 15. Acceptance criteria
- All 32 questions render correctly in Hebrew and RTL.
- Every question type works on mobile and desktop.
- Score calculation matches approved logic and test fixtures.
- Results page shows correct level and implications.
- Benchmark facts appear on the correct mapped questions.
- Contact is created/updated in HubSpot with required properties.
- Workflows segment respondents by level and consent status.
- Level-based follow-up emails are sent only to consented contacts.
- Optional deal creation occurs only for qualifying respondents.
- Reporting dashboard displays completion and level distribution.

## 16. Launch readiness checklist
- [ ] Final Hebrew content approved
- [ ] Consent text approved by legal/compliance
- [ ] Scoring fixtures approved
- [ ] HubSpot properties created
- [ ] Form created and tested
- [ ] Workflows published
- [ ] Results emails QA-approved
- [ ] Lists/segments validated
- [ ] Deal pipeline configured (if enabled)
- [ ] Dashboard built
- [ ] Cross-browser QA passed
- [ ] Mobile QA passed
- [ ] Accessibility QA passed
- [ ] Attribution verified
- [ ] Production domain / hosting approved

## 17. Open questions for client
1. Is the survey gated by email early, or is contact capture deferred to the end?
2. Is explicit marketing consent mandatory to view results, or only for follow-up?
3. Should existing contacts be updated in place, or should multiple submissions be tracked separately?
4. Should Deloitte create deals for all Level 4–5 respondents, or only those above a revenue threshold?
5. Which Deloitte service recommendation should map to each maturity level in post-survey emails?
6. Are benchmark facts approved as final wording, or still subject to source/legal review?
7. Should results be printable only, or is a true downloadable PDF required later?
8. Is anonymous same-device resume sufficient for v1?
9. What SLAs are expected for sales follow-up on SQL respondents?
10. Is there a requirement to store aggregate research data outside HubSpot reporting?
