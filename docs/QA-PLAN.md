# QA Plan — AI Maturity Survey

## 1. Test strategy
Use a combination of:
- unit tests for scoring and serialization,
- manual functional QA across question types and devices,
- accessibility QA,
- PWA verification,
- HubSpot integration QA using test contacts and workflow branches.

## 2. Unit tests — scoring engine

### Core tests
- returns no score / safe fallback when no scored answers provided
- ignores skipped questions
- ignores "לא יודע/ת" where required
- rounds score correctly
- maps exact boundary scores to correct levels

### Per-question scorer tests
- Q7 scorer
- Q8 scorer
- Q9 scorer
- Q10 scorer
- Q11 scorer
- Q12 scorer
- Q13 scorer
- Q16 scorer
- Q18 scorer
- Q20 scorer
- Q21 scorer
- Q22 scorer
- Q26 scorer
- Q27 scorer
- Q29 scorer
- Q30 scorer
- Q32 scorer

### Edge-case tests
- matrix row missing
- extra unknown option value
- duplicated multi-select values
- partially completed matrix question
- decimal score precision
- exact boundary values: 1.80, 1.81, 2.60, 2.61, 3.40, 3.41, 4.20, 4.21

## 3. Manual QA matrix

| Area | Chrome Desktop | Safari Desktop | Edge Desktop | iPhone Safari | Android Chrome |
|---|---|---|---|---|---|
| Welcome screen | ✓ | ✓ | ✓ | ✓ | ✓ |
| Single-choice | ✓ | ✓ | ✓ | ✓ | ✓ |
| Multi-choice | ✓ | ✓ | ✓ | ✓ | ✓ |
| Matrix-single | ✓ | ✓ | ✓ | ✓ | ✓ |
| Matrix-column-single | ✓ | ✓ | ✓ | ✓ | ✓ |
| Matrix-multi | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fact popup | ✓ | ✓ | ✓ | ✓ | ✓ |
| Summary page | ✓ | ✓ | ✓ | ✓ | ✓ |
| Print view | ✓ | ✓ | ✓ | — | — |
| Resume / localStorage | ✓ | ✓ | ✓ | ✓ | ✓ |
| PWA installability | — | Limited | — | Limited | ✓ |

## 4. Functional checklist
- [ ] Start survey from welcome CTA
- [ ] Progress bar increments correctly
- [ ] Previous / next behavior works
- [ ] Required-answer validation works
- [ ] Multi-select max limits enforced
- [ ] Matrix interactions are clear and persistent
- [ ] Facts appear only on mapped questions
- [ ] Facts appear regardless of selected answer
- [ ] Facts do not alter score
- [ ] Results page reflects computed level
- [ ] Reset clears answers and returns to start

## 5. RTL & Hebrew rendering checklist
- [ ] Page direction is RTL globally
- [ ] Hebrew copy wraps correctly
- [ ] Mixed Hebrew/Latin labels render cleanly
- [ ] Numbers and punctuation are readable in context
- [ ] Progress UI reads naturally in RTL
- [ ] Modals align correctly in RTL
- [ ] Sticky nav button order is intentional and approved
- [ ] No clipping of long option labels on mobile

## 6. Accessibility checklist
- [ ] Full survey is keyboard navigable
- [ ] Focus visible on all controls
- [ ] Modals trap focus correctly
- [ ] Escape / close behavior is accessible
- [ ] Form controls have labels / legends
- [ ] Screen reader announces question text and state
- [ ] Error messages are announced and visible
- [ ] Color contrast meets WCAG expectations
- [ ] Touch targets are large enough on mobile

## 7. PWA checklist
- [ ] Manifest present
- [ ] Service worker registers in production
- [ ] App shell loads after first offline revisit
- [ ] localStorage retains draft answers offline
- [ ] Offline fallback behaves predictably
- [ ] Lighthouse PWA audit run
- [ ] Install prompt tested where supported

## 8. HubSpot integration test cases

### Form submission
- [ ] New contact created on first submit
- [ ] Existing contact updated on repeat submit
- [ ] All mapped properties populated correctly
- [ ] `ai_maturity_score` populated as number
- [ ] `ai_maturity_level` populated correctly
- [ ] `ai_survey_completed_at` populated
- [ ] consent field populated correctly

### Attribution
- [ ] `hutk` included when available
- [ ] form submission appears in contact timeline
- [ ] source / recent conversion values look correct

### Workflows
- [ ] Level 1 respondent routes to nurture branch
- [ ] Level 3 respondent routes to nurture branch
- [ ] Level 4 respondent routes to SQL branch
- [ ] Level 5 respondent routes to SQL branch
- [ ] non-consented respondent suppressed from marketing email branch

### Emails
- [ ] Correct level email sent for each level
- [ ] merge tokens render correctly
- [ ] unsubscribe / subscription behavior is correct
- [ ] double opt-in path behaves as designed

### Deals
- [ ] qualifying respondent creates deal
- [ ] non-qualifying respondent does not create deal
- [ ] owner assignment rule works
- [ ] pipeline and stage are correct

### Lists / reports
- [ ] respondent appears in correct level segment
- [ ] respondent appears in correct role / industry / revenue list
- [ ] dashboard counts increment correctly

## 9. Test data fixtures
Create at least:
- 1 Level 1 respondent
- 1 Level 2 respondent
- 1 Level 3 respondent
- 1 Level 4 respondent
- 1 Level 5 respondent
- 1 no-consent respondent
- 1 repeat-submit existing contact
- 1 high-revenue Level 5 respondent for deal creation

## 10. Pre-launch sign-off checklist
- [ ] Unit tests pass
- [ ] Functional QA pass
- [ ] RTL/hebrew QA pass
- [ ] Accessibility QA pass
- [ ] PWA QA pass
- [ ] HubSpot submission QA pass
- [ ] Workflow QA pass
- [ ] Email QA pass
- [ ] Deal automation QA pass (if enabled)
- [ ] Reporting QA pass
- [ ] Content approved
- [ ] Legal/privacy approved
- [ ] Stakeholder launch approval received
