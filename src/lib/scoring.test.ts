import { describe, expect, it } from 'vitest';
import { computeScore, isQuestionAnswered } from './scoring';
import { FACTS } from '../data/facts';
import type { AnswersMap } from '../types';

describe('computeScore', () => {
  it('returns a safe fallback (Level 1, average 0) when no answers are provided', () => {
    const result = computeScore({});
    expect(result.count).toBe(0);
    expect(result.average).toBe(0);
    expect(result.level.id).toBe(1);
  });

  it('ignores non-scored (demographic / non-ordinal) questions entirely', () => {
    const answers: AnswersMap = { q1: 0, q2: 3, q3: 1, q4: 2, q5: 0, q6: 4 };
    const result = computeScore(answers);
    expect(result.count).toBe(0);
    expect(result.average).toBe(0);
  });

  it('ignores "לא יודע/ת" (don\'t know) answers where the scorer requires skipping them', () => {
    // Q9 (idx 8) has 6 options; index 5 = "don't know" and must be skipped.
    const result = computeScore({ q9: 5 });
    expect(result.count).toBe(0);
    expect(result.perQuestion[8]).toBeUndefined();
  });

  it('ignores non-numeric / malformed answer values', () => {
    // Q9 expects a number; a stray string should be treated as unanswered.
    const result = computeScore({ q9: 'not-a-number' as unknown as number });
    expect(result.count).toBe(0);
  });

  it('rounds/averages correctly across multiple scored questions', () => {
    // Q9 (idx 8, singleAsc5(5)): answer 0 → score 1
    // Q17 (idx 16, singleAsc5()): answer 4 → score 5
    const result = computeScore({ q9: 0, q17: 4 });
    expect(result.count).toBe(2);
    expect(result.average).toBe(3); // (1 + 5) / 2
  });

  it('handles decimal precision without rounding error blowing up', () => {
    // Three single-question scores: 1, 3, 4 → average 2.666...
    const result = computeScore({ q17: 0, q19: 2, q23: 3 });
    expect(result.count).toBe(3);
    expect(result.average).toBeCloseTo(8 / 3, 10);
  });

  it('exposes the full FACTS list on every result regardless of answers', () => {
    const result = computeScore({});
    expect(result.facts).toEqual(FACTS);
  });

  describe('boundary score → level mapping (via computeScore)', () => {
    it.each([
      [0, 1], // score 1 (answer 0 on a singleAsc5 question) → Level 1
      [1, 2], // score 2 → Level 2
      [2, 3], // score 3 → Level 3
      [3, 4], // score 4 → Level 4
      [4, 5], // score 5 → Level 5
    ])('a single scored answer of %s (score %s) resolves to the matching level id', (answerIdx, expectedId) => {
      // Q29 (idx 28) is singleAsc5(): score = answer + 1, giving an exact
      // integer average that lands squarely inside each level's range.
      const result = computeScore({ q29: answerIdx });
      expect(result.average).toBe(answerIdx + 1);
      expect(result.level.id).toBe(expectedId);
    });

    it('delegates fractional averages to levelForScore at the documented boundaries', () => {
      // Q7 (matrixDesc5, 2 rows) + Q9 (singleAsc5(5)) combine to produce a
      // fractional average that exercises the exact 1.81 boundary.
      // Q7 col 4 twice → scores [1, 1]; Q9 answer 0 → score 1. Avg = 1.0.
      const low = computeScore({ q7: { 0: 4, 1: 4 }, q9: 0 });
      expect(low.average).toBe(1);
      expect(low.level.id).toBe(1);

      // Q7 col 0 twice → scores [5, 5]; Q9 answer 4 → score 5. Avg = 5.0.
      const high = computeScore({ q7: { 0: 0, 1: 0 }, q9: 4 });
      expect(high.average).toBe(5);
      expect(high.level.id).toBe(5);
    });
  });

  describe('per-question scorers (QA-PLAN §2 coverage)', () => {
    it('Q7 (idx 6, matrix-single, matrixDesc5): col 0 = best (5), col 4 = worst (0/skipped floor)', () => {
      const result = computeScore({ q7: { 0: 0, 1: 4 } });
      expect(result.perQuestion[6]).toBe(3); // (5 + 1) / 2
      expect(result.count).toBe(2);
    });

    it('Q8 (idx 7, matrix-single, matrixAsc5): col 0 = worst (1), col 4 = best (5)', () => {
      const result = computeScore({ q8: { 0: 0, 1: 4 } });
      expect(result.perQuestion[7]).toBe(3); // (1 + 5) / 2
    });

    it('Q9 (idx 8, single, singleAsc5(5)): answers 0..4 map to scores 1..5, idx 5 skipped', () => {
      expect(computeScore({ q9: 0 }).perQuestion[8]).toBe(1);
      expect(computeScore({ q9: 4 }).perQuestion[8]).toBe(5);
      expect(computeScore({ q9: 5 }).count).toBe(0);
    });

    it('Q10 (idx 9, matrix-single): skips not relevant / unknown and maps active stages 1..5', () => {
      const result = computeScore({ q10: { 0: 0, 1: 1, 2: 3, 3: 5, 4: 6 } });
      expect(result.perQuestion[9]).toBe(3); // (1 + 3 + 5) / 3
      expect(result.count).toBe(3);
    });

    it('Q11 (idx 10, single, singleDesc5(5)): answer 0 (80%+) = best (5), idx 5 skipped', () => {
      expect(computeScore({ q11: 0 }).perQuestion[10]).toBe(5);
      expect(computeScore({ q11: 4 }).perQuestion[10]).toBe(1);
      expect(computeScore({ q11: 5 }).count).toBe(0);
    });

    it('Q12 (idx 11, single, singleAsc5(5)): answer 4 (>80%) = best (5), idx 5 skipped', () => {
      expect(computeScore({ q12: 4 }).perQuestion[11]).toBe(5);
      expect(computeScore({ q12: 5 }).count).toBe(0);
    });

    it('Q13 (idx 12, matrix-single): skips no-pilots / unknown and maps percentage bands', () => {
      const result = computeScore({ q13: { 0: 2, 1: 7 } });
      expect(result.perQuestion[12]).toBe(3); // (1 + 5) / 2
      expect(computeScore({ q13: { 0: 0, 1: 1 } }).count).toBe(0);
    });

    it('Q17 (idx 16, single): answers 0..4 map to 1..5 and unknown is skipped', () => {
      expect(computeScore({ q17: 0 }).perQuestion[16]).toBe(1);
      expect(computeScore({ q17: 4 }).perQuestion[16]).toBe(5);
      expect(computeScore({ q17: 5 }).count).toBe(0);
    });

    it('Q19 (idx 18, single, singleAsc5())', () => {
      expect(computeScore({ q19: 2 }).perQuestion[18]).toBe(3);
    });

    it('Q21 token economy management (idx 20): skips unknown', () => {
      expect(computeScore({ q21: 0 }).perQuestion[20]).toBe(1);
      expect(computeScore({ q21: 4 }).perQuestion[20]).toBe(5);
      expect(computeScore({ q21: 5 }).count).toBe(0);
    });

    it('Q23 (idx 22, single, singleAsc5())', () => {
      expect(computeScore({ q23: 2 }).perQuestion[22]).toBe(3);
    });

    it('Q24 (idx 23): skips too early and unknown', () => {
      expect(computeScore({ q24: 2 }).perQuestion[23]).toBe(3);
      expect(computeScore({ q24: 5 }).count).toBe(0);
      expect(computeScore({ q24: 6 }).count).toBe(0);
    });

    it('Q25 (idx 24, matrix-column-single): maps percentage bands and skips too early', () => {
      const result = computeScore({ q25: { 0: 0, 1: 3, 2: 4 } });
      expect(result.perQuestion[24]).toBe(3); // (1 + 5) / 2
      expect(result.count).toBe(2);
    });

    it('Q29 (idx 28): skips unknown', () => {
      expect(computeScore({ q29: 2 }).perQuestion[28]).toBe(3);
      expect(computeScore({ q29: 5 }).count).toBe(0);
    });

    it('Q30 (idx 29): skips unknown', () => {
      expect(computeScore({ q30: 2 }).perQuestion[29]).toBe(3);
      expect(computeScore({ q30: 5 }).count).toBe(0);
    });

    it('Q32 (idx 31, matrix-single, matrixAsc5)', () => {
      const result = computeScore({ q32: { 0: 0, 1: 4 } });
      expect(result.perQuestion[31]).toBe(3); // (1 + 5) / 2
      expect(computeScore({ q32: { 0: 5 } }).count).toBe(0);
    });

    it('Q33 (idx 32): skips not relevant and unknown', () => {
      expect(computeScore({ q33: 2 }).perQuestion[32]).toBe(3);
      expect(computeScore({ q33: 5 }).count).toBe(0);
      expect(computeScore({ q33: 6 }).count).toBe(0);
    });

    it('Q35 (idx 34): maps resolution timing and skips too early / unknown', () => {
      const result = computeScore({ q35: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 } });
      // scores: 5,4,3,2 (cols 4 and 5 skipped)
      expect(result.perQuestion[34]).toBe(3.5);
      expect(result.count).toBe(4);
    });

    it('does not score competitive impact or token-consumption volume', () => {
      const result = computeScore({
        q15: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4 },
        q20: { 0: 4, 1: 4 },
      });
      expect(result.count).toBe(0);
      expect(result.perQuestion[14]).toBeUndefined();
      expect(result.perQuestion[19]).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('handles a partially completed matrix (missing row) by scoring only present rows', () => {
      const result = computeScore({ q7: { 0: 0 } }); // row 1 missing
      expect(result.count).toBe(1);
      expect(result.perQuestion[6]).toBe(5);
    });

    it('ignores unrelated/unknown answer keys not present in QUESTION_SCORERS', () => {
      const answers: AnswersMap = { qUnknown: 3 } as unknown as AnswersMap;
      const result = computeScore(answers);
      expect(result.count).toBe(0);
    });

    it('duplicated / re-selected multi-select values do not double count (matrix-single dedupes by row key)', () => {
      // Overwriting the same row key simulates a re-selection; only the
      // final value for that row contributes.
      const reselected: Record<number, number> = { 0: 4 };
      reselected[0] = 0;
      const result = computeScore({ q7: reselected });
      expect(result.count).toBe(1);
      expect(result.perQuestion[6]).toBe(5);
    });

    it('computes correct decimal precision for an uneven split of scores', () => {
      const result = computeScore({ q13: { 0: 2, 1: 5 } }); // bins: 1 and 3
      expect(result.average).toBe(2); // (1+3)/2
    });
  });
});

describe('isQuestionAnswered', () => {
  it('single: false when undefined, true when a number is set', () => {
    expect(isQuestionAnswered(0, {})).toBe(false);
    expect(isQuestionAnswered(0, { q1: 0 })).toBe(true);
  });

  it('multi: false when empty array or missing, true when non-empty', () => {
    expect(isQuestionAnswered(13, {})).toBe(false); // Q14 is multi
    expect(isQuestionAnswered(13, { q14: [] })).toBe(false);
    expect(isQuestionAnswered(13, { q14: [1, 2] })).toBe(true);
  });

  it('matrix-multi: false when empty array, true when non-empty', () => {
    expect(isQuestionAnswered(13, { q14: [] })).toBe(false);
  });

  it('matrix-single: requires an entry for every row', () => {
    // Q7 (idx 6) has 2 rows.
    expect(isQuestionAnswered(6, {})).toBe(false);
    expect(isQuestionAnswered(6, { q7: { 0: 1 } })).toBe(false);
    expect(isQuestionAnswered(6, { q7: { 0: 1, 1: 2 } })).toBe(true);
  });

  it('matrix-column-single: requires an entry for every column', () => {
    // Q25 (idx 24) has 3 columns.
    expect(isQuestionAnswered(24, {})).toBe(false);
    expect(isQuestionAnswered(24, { q25: { 0: 1, 1: 2 } })).toBe(false);
    expect(isQuestionAnswered(24, { q25: { 0: 1, 1: 2, 2: 3 } })).toBe(true);
  });
});
