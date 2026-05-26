# Delivery Plan — AI Maturity Survey

## 1. Milestones

| Milestone | Name | Goal |
|---|---|---|
| M0 | Scaffold | Project setup, content freeze path, HubSpot schema draft |
| M1 | Survey Flow | All questions render correctly with navigation |
| M2 | Scoring | Approved scoring engine implemented and tested |
| M3 | Summary + Facts | Results page and question-level fact popups complete |
| M4 | PWA Polish | Persistence, offline shell, installability pass |
| M5 | HubSpot Integration | Form submission, properties, workflows, emails, lists |
| M6 | Launch | QA sign-off, deployment, dashboard, operational readiness |

## 2. Task breakdown

### M0 — Scaffold
| Task | Effort |
|---|---|
| Confirm final brief and content version | M |
| Create docs structure | S |
| Freeze question IDs and internal naming | S |
| Define HubSpot property schema | M |
| Create implementation backlog | S |

**Definition of Done**
- Approved content source of truth exists
- Property schema drafted
- Milestone plan approved

### M1 — Survey Flow
| Task | Effort |
|---|---|
| Implement route structure | S |
| Build welcome screen | S |
| Build question renderer components | L |
| Implement sticky nav and progress bar | M |
| Implement validation rules per question type | M |
| Implement RTL layout and responsive states | M |

**Definition of Done**
- All 32 questions render correctly
- Navigation works across question types
- Mobile and desktop flow usable

### M2 — Scoring
| Task | Effort |
|---|---|
| Implement scoring utilities | M |
| Add mappings for each scored question | M |
| Add skipped-answer handling | S |
| Create test fixtures | M |
| Validate level mapping | S |

**Definition of Done**
- Score output matches approved logic
- Unit tests pass

### M3 — Summary + Facts
| Task | Effort |
|---|---|
| Build results page | M |
| Add maturity content blocks | S |
| Implement question-level fact popup system | M |
| Pair facts to mapped questions | S |
| Add print styles | S |

**Definition of Done**
- Summary page is accurate
- Facts appear on the correct questions
- Print view is acceptable

### M4 — PWA Polish
| Task | Effort |
|---|---|
| Configure `vite-plugin-pwa` | S |
| Add Workbox precache | M |
| Add offline fallback | M |
| Improve persistence and resume behavior | M |
| Run Lighthouse pass | S |

**Definition of Done**
- App shell works offline after first load
- Same-device resume works
- PWA installability validated where supported

### M5 — HubSpot Integration
| Task | Effort |
|---|---|
| Create contact properties | M |
| Create HubSpot form | S |
| Implement Forms API submission | M |
| Capture hutk and consent | M |
| Build workflows | L |
| Build emails | M |
| Build lists / segments | M |
| Optional deal automation | M |
| Build dashboard | M |

**Definition of Done**
- Contact updates work end to end
- Workflows and emails trigger correctly
- Reporting dashboard available

### M6 — Launch
| Task | Effort |
|---|---|
| Final QA regression | M |
| Content sign-off | S |
| Legal/privacy sign-off | M |
| Production deployment | S |
| Analytics / reporting verification | S |
| Handover and runbook | S |

**Definition of Done**
- Production release completed
- Stakeholders sign off
- Operational ownership is clear

## 3. Dependencies

| Dependency | Needed by |
|---|---|
| Client approval of CONTENT-SPEC | Before M1 |
| Legal approval of consent/privacy text | Before M5 send flows |
| Final score mapping sign-off | Before M2 completion |
| HubSpot admin access | Before M5 |
| Deloitte rep ownership rules | Before deal automation |
| Email copy approval | Before workflow activation |

## 4. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Hebrew copy changes late | Rework in UI and QA | Freeze CONTENT-SPEC before M1 complete |
| HubSpot property sprawl | Admin complexity | Use strict naming convention and grouped properties |
| Matrix serialization confusion | Reporting ambiguity | Document serialization format clearly |
| Consent wording not approved in time | Blocks nurture | Separate results display from marketing follow-up |
| iOS PWA limitations | Installability inconsistency | Treat PWA as enhancement, not critical path |
| Workflow branching errors | Wrong lead routing | QA with fixture contacts per level |
| Attribution gaps from missing hutk | Reduced source tracking | Fallback to UTM + form submission reporting |
| Hosting/domain governance delays | Launch slip | Decide hosting path early |

## 5. Definition of Done by workstream

### Product / Content
- Approved content version is signed off
- Open questions resolved or explicitly deferred

### Engineering
- All tests pass
- No critical bugs in survey flow
- Submission and scoring verified

### HubSpot
- Properties created
- Form live
- Workflows active
- Emails approved and published
- Lists and dashboard visible to stakeholders

### QA
- Manual regression completed
- Accessibility checklist passed
- Mobile/browser coverage complete

## 6. RACI

| Workstream | Dev | Content / Strategy | HubSpot Admin / Ops | Deloitte Stakeholder | Legal / Compliance |
|---|---|---|---|---|---|
| PRD | C | R | C | A | C |
| Content spec | C | R | C | A | C |
| Frontend build | R | C | C | I | I |
| Scoring logic | R | C | I | A | I |
| HubSpot property schema | C | C | R | A | I |
| Forms / workflows / emails | C | C | R | A | C |
| QA | R | C | C | A | C |
| Launch sign-off | C | C | C | A | A |

**R = Responsible, A = Accountable, C = Consulted, I = Informed**
