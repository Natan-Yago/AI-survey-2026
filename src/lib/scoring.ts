import type {
  AnswerValue,
  AnswersMap,
  MatrixMultiAnswer,
  MatrixSingleAnswer,
  MultiAnswer,
} from '../types';
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
  return Object.values(m).filter(isNum).filter((c) => c < 5).map((c) => c + 1);
};
/** Matrix-single with 5 ordinal columns, descending (col 0 = highest maturity). */
const matrixDesc5: Scorer = (answer) => {
  const m = answer as MatrixSingleAnswer | undefined;
  if (!m) return [];
  return Object.values(m).filter(isNum).filter((c) => c < 5).map((c) => 5 - c);
};

export type ScoringConfig = Scorer | null;

// Index-keyed scoring config matching the order of `surveyQuestions`.
export const QUESTION_SCORERS: ScoringConfig[] = [
  null, null, null, null, null, // Q1–Q5 demographics
  // Q6 transformative potential — cols asc: "already today" → "never". Higher = sooner = better. Map desc.
  matrixDesc5,
  // Q7 readiness — asc.
  matrixAsc5,
  // Q8 investment change — 6 options, skip last (don't know). asc 1..5.
  singleAsc5(5),
  // Q9 adoption by function — skip not relevant / unknown; map active stages 1..5.
  (answer) => {
    const m = answer as MatrixSingleAnswer | undefined;
    if (!m) return [];
    const map = [0, 1, 2, 3, 4, 5, 0];
    return Object.values(m).filter(isNum).map((c) => map[c] ?? 0).filter((s) => s > 0);
  },
  // Q10 access to AI tools — desc (80%+ at idx 0 = best), 6 options, skip last.
  singleDesc5(5),
  // Q11 daily usage — asc (idx 4 = >80%), skip last.
  singleAsc5(5),
  // Q12 pilots-to-prod — skip no pilots / unknown; map the six percentage bands to 1–5.
  (answer) => {
    const m = answer as MatrixSingleAnswer | undefined;
    if (!m) return [];
    const map = [0, 0, 1, 1, 2, 3, 4, 5];
    return Object.values(m).filter(isNum).map((c) => map[c] ?? 0).filter((s) => s > 0);
  },
  null, // Q13 matrix-multi blockers
  matrixAsc5, // Q14 competitive impact — five ordinal columns, then unknown
  null, // Q15 multi IT investments
  singleAsc5(5), // Q16 infrastructure confidence — 5 ordinal options, then unknown
  // Q17 benefits — score only achieved-today selections; future selections are unscored.
  (answer) => {
    if (!Array.isArray(answer)) return [];
    const selections = answer as MatrixMultiAnswer;
    const achievedToday = selections.filter(
      (key): key is string => typeof key === 'string' && key.endsWith(':0'),
    );
    if (achievedToday.includes('7:0')) return [1];
    return achievedToday.length > 0 ? [achievedToday.length] : [];
  },
  singleAsc5(), // Q18 process transformation approach — 5 options asc
  // Q19 token consumption — score only today's column.
  (answer) => {
    const matrix = answer as MatrixSingleAnswer | undefined;
    const today = matrix?.[0];
    if (!isNum(today)) return [];
    const map = [1, 2, 3, 4, 5, 1, 0];
    const score = map[today] ?? 0;
    return score > 0 ? [score] : [];
  },
  singleAsc5(5), // Q20 token economy management — 5 ordinal options, then unknown
  null, // Q21 multi risks
  singleAsc5(), // Q22 roles redesign — 5 options asc
  singleAsc5(5), // Q23 productivity impact — 5 ordinal options, then too early / unknown
  // Q24 matrix-column-single task automation — four percentage bands, then too early.
  (answer) => {
    const m = answer as MatrixSingleAnswer | undefined;
    if (!m) return [];
    const map = [1, 2, 3, 5, 0];
    return Object.values(m).filter(isNum).map((r) => map[r] ?? 0).filter((s) => s > 0);
  },
  null, // Q25 main challenge — non-ordinal
  // Q26 talent strategy — one point per distinct selection, capped at 5.
  (answer) => {
    const selections = answer as MultiAnswer | undefined;
    if (!Array.isArray(selections) || selections.length === 0) return [];
    return [Math.min(new Set(selections).size, 5)];
  },
  // Q27 FTE change — manager-provided non-linear mapping; skip don't know.
  (answer) => {
    if (!isNum(answer)) return [];
    const map = [1, 1, 2, 2, 3, 4, 5, 1, 1, 0];
    const score = map[answer] ?? 0;
    return score > 0 ? [score] : [];
  },
  singleAsc5(5), // Q28 non-tech adoption — 5 ordinal options, then unknown
  singleAsc5(5), // Q29 GenAI usage — 5 ordinal options, then unknown
  null, // Q30 GenAI impact area — non-ordinal
  matrixAsc5, // Q31 Agentic AI usage — 5 cols asc
  singleAsc5(5), // Q32 governance model — 5 ordinal options, then not relevant / unknown
  null, // Q33 Agentic impact area — non-ordinal
  // Q34 time to address blockers — map 0..3 → 5,4,3,2; skip too early / unknown.
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
  if (typeof a !== 'object' || a === null || Array.isArray(a)) return false;
  const m = a as MatrixSingleAnswer;
  const expectedKeys = q.type === 'matrix-single' ? q.rows.length : q.columns.length;
  return Object.keys(m).length === expectedKeys;
}
