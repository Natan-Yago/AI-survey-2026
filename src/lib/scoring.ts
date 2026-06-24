import type { AnswerValue, AnswersMap, MatrixSingleAnswer } from '../types';
import { surveyQuestions } from '../data/questions';
import { FACTS } from '../data/facts';
import { levelForScore, MATURITY_LEVELS } from '../data/levels';
import type { Fact, MaturityLevel } from '../types';

// Per-question scoring configuration. Each entry returns an array of
// per-row scores (1–5) for one user answer; missing/skipped answers
// return an empty array and are excluded from the average.
//
// Notes on shape:
//   - 'single' with 5 ordinal options:           → 1 score per answer (asc: idx+1, desc: 5-idx)
//   - 'single' with 6 options (last = "don't know" / not-sure): skip last
//   - 'matrix-single' with 5 ordinal columns:    → 1 score per row
//   - 'matrix-single' with N columns, "don't know" first/last: skip that column
//   - 'matrix-column-single':                    → 1 score per column
type Scorer = (answer: AnswerValue | undefined) => number[];

const isNum = (v: unknown): v is number => typeof v === 'number';

const singleAsc5 = (skipFromIndex?: number): Scorer => (answer) => {
  if (!isNum(answer)) return [];
  if (skipFromIndex !== undefined && answer >= skipFromIndex) return [];
  return [answer + 1];
};
const singleDesc5 = (skipFromIndex?: number): Scorer => (answer) => {
  if (!isNum(answer)) return [];
  if (skipFromIndex !== undefined && answer >= skipFromIndex) return [];
  return [5 - answer];
};
/** Matrix-single with 5 ordinal columns, ascending (col 0 = lowest maturity). */
const matrixAsc5: Scorer = (answer) => {
  const m = answer as MatrixSingleAnswer | undefined;
  if (!m) return [];
  return Object.values(m).filter(isNum).map((c) => c + 1);
};
/** Matrix-single with 5 ordinal columns, descending (col 0 = highest maturity). */
const matrixDesc5: Scorer = (answer) => {
  const m = answer as MatrixSingleAnswer | undefined;
  if (!m) return [];
  return Object.values(m).filter(isNum).map((c) => 5 - c);
};

export type ScoringConfig = Scorer | null;

// Index-keyed scoring config matching the order of `surveyQuestions`.
export const QUESTION_SCORERS: ScoringConfig[] = [
  null, null, null, null, null, null, // Q1–Q6 demographics
  // Q7 transformative potential — cols asc: "already today" → "never". Higher = sooner = better. Map desc.
  matrixDesc5,
  // Q8 readiness — asc.
  matrixAsc5,
  // Q9 investment change — 6 options, skip last (don't know). asc 1..5.
  singleAsc5(5),
  // Q10 adoption by function — 3 columns (no plans / pilots / scaled). Map 1, 3, 5.
  (answer) => {
    const m = answer as MatrixSingleAnswer | undefined;
    if (!m) return [];
    const map = [1, 3, 5];
    return Object.values(m).filter(isNum).map((c) => map[c] ?? 0).filter((s) => s > 0);
  },
  // Q11 access to AI tools — desc (80%+ at idx 0 = best), 6 options, skip last.
  singleDesc5(5),
  // Q12 daily usage — asc (idx 4 = >80%), skip last.
  singleAsc5(5),
  // Q13 pilots-to-prod — 12 cols: col 0 = "don't know", cols 1..11 = 0%..100%.
  // Bin to 1–5: 0–10% → 1, 20–30% → 2, 40–50% → 3, 60–70% → 4, 80–100% → 5.
  (answer) => {
    const m = answer as MatrixSingleAnswer | undefined;
    if (!m) return [];
    return Object.values(m)
      .filter(isNum)
      .filter((c) => c > 0) // skip "don't know"
      .map((c) => {
        const pct = (c - 1) * 10; // c=1 → 0%, c=11 → 100%
        if (pct <= 10) return 1;
        if (pct <= 30) return 2;
        if (pct <= 50) return 3;
        if (pct <= 70) return 4;
        return 5;
      });
  },
  null, // Q14 matrix-multi blockers
  null, // Q15 multi IT investments
  singleAsc5(), // Q16 infrastructure confidence — 5 options asc
  null, // Q17 matrix-multi benefits
  singleAsc5(), // Q18 process transformation approach — 5 options asc
  null, // Q19 multi risks
  singleAsc5(), // Q20 roles redesign — 5 options asc
  singleAsc5(), // Q21 productivity impact — 5 options asc
  // Q22 matrix-column-single job automation — rows 0..4 = <10% .. 76-100%. Higher % = more AI ambition.
  // Each column contributes (rowIndex+1) as score.
  (answer) => {
    const m = answer as MatrixSingleAnswer | undefined;
    if (!m) return [];
    return Object.values(m).filter(isNum).map((r) => r + 1);
  },
  null, // Q23 main challenge — non-ordinal
  null, // Q24 multi talent strategy
  null, // Q25 FTE change — non-ordinal (decrease vs increase doesn't map cleanly)
  singleAsc5(), // Q26 non-tech comfort — 5 options, order is roughly progressive
  singleAsc5(), // Q27 GenAI usage — 5 options asc
  null, // Q28 GenAI impact area — non-ordinal
  matrixAsc5, // Q29 Agentic AI usage — 5 cols asc
  singleAsc5(), // Q30 governance model — 5 options asc
  null, // Q31 Agentic impact area — non-ordinal
  // Q32 time to solve blockers — cols: "already solved", "12mo", "2yr", ">2yr", "don't know".
  // Skip "don't know" (idx 4). Map 0..3 → 5,4,3,2.
  (answer) => {
    const m = answer as MatrixSingleAnswer | undefined;
    if (!m) return [];
    return Object.values(m)
      .filter(isNum)
      .filter((c) => c < 4)
      .map((c) => 5 - c);
  },
];

export interface ScoreResult {
  /** Numeric average of all per-row scores (1–5). 0 means no scoreable answers. */
  average: number;
  /** Number of scoreable items contributing to the average. */
  count: number;
  /** Resolved maturity level. */
  level: MaturityLevel;
  /** Facts to display (filtered by per-fact `shouldShow`). */
  facts: Fact[];
  /** Per-question average score keyed by question index — useful for debugging. */
  perQuestion: Record<number, number>;
}

export function computeScore(answers: AnswersMap): ScoreResult {
  const allScores: number[] = [];
  const perQuestion: Record<number, number> = {};

  QUESTION_SCORERS.forEach((scorer, idx) => {
    if (!scorer) return;
    const key = `q${idx + 1}`;
    const scores = scorer(answers[key]);
    if (scores.length === 0) return;
    allScores.push(...scores);
    perQuestion[idx] = scores.reduce((a, b) => a + b, 0) / scores.length;
  });

  const average =
    allScores.length === 0
      ? 0
      : allScores.reduce((a, b) => a + b, 0) / allScores.length;

  // When no answers exist, default to Level 1 (Exploring).
  const level = allScores.length === 0 ? MATURITY_LEVELS[0] : levelForScore(average);

  // All global benchmarks are surfaced on every Summary page regardless of
  // the user's individual answers. `Fact.shouldShow` is still consulted by
  // the per-question `FactModal`, but no longer filters the Summary list.
  const facts = FACTS;

  return { average, count: allScores.length, level, facts, perQuestion };
}

// Re-export to ease imports in pages.
export { MATURITY_LEVELS, levelForScore };
export type { MaturityLevel, Fact };

// Convenience: a single demographic question is considered answered when
// the user has selected at least one option / matrix cell.
export function isQuestionAnswered(index: number, answers: AnswersMap): boolean {
  const q = surveyQuestions[index];
  const a = answers[`q${index + 1}`];
  if (a === undefined) return false;
  if (q.type === 'single') return typeof a === 'number';
  if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
  if (q.type === 'matrix-multi') return Array.isArray(a) && a.length > 0;
  // matrix-single & matrix-column-single
  const m = a as MatrixSingleAnswer;
  const expectedKeys = q.type === 'matrix-single' ? q.rows.length : q.columns.length;
  return Object.keys(m).length === expectedKeys;
}
