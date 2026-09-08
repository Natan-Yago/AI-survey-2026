import { describe, expect, it } from 'vitest';
import { computeScore, isQuestionAnswered, QUESTION_SCORERS } from './scoring';
import { FACTS } from '../data/facts';
import { surveyQuestions } from '../data/questions';
import type { AnswersMap } from '../types';

describe('computeScore', () => {
  it('keeps positional scorers aligned with all 34 survey questions', () => {
    expect(surveyQuestions).toHaveLength(34);
    expect(QUESTION_SCORERS).toHaveLength(surveyQuestions.length);
  });

  it('applies the manager scoring rules after Q4 removal', () => {
    expect(computeScore({ q14: { 0: 0, 1: 4, 2: 5 } }).perQuestion[13]).toBe(3);

    expect(computeScore({ q17: ['7:0', '0:1'] }).perQuestion[16]).toBe(1);
    expect(computeScore({ q17: ['0:0', '1:0', '2:0', '3:1'] }).perQuestion[16]).toBe(3);
    expect(computeScore({ q17: ['0:1', '1:1'] }).count).toBe(0);

    expect(computeScore({ q19: { 0: 0, 1: 4 } }).perQuestion[18]).toBe(1);
    expect(computeScore({ q19: { 0: 4, 1: 0 } }).perQuestion[18]).toBe(5);
    expect(computeScore({ q19: { 0: 5 } }).perQuestion[18]).toBe(1);
    expect(computeScore({ q19: { 0: 6 } }).count).toBe(0);

    expect(computeScore({ q26: [0, 1, 2, 3, 4, 5, 6] }).perQuestion[25]).toBe(5);

    expect(computeScore({ q27: 0 }).perQuestion[26]).toBe(1);
    expect(computeScore({ q27: 4 }).perQuestion[26]).toBe(3);
    expect(computeScore({ q27: 6 }).perQuestion[26]).toBe(5);
    expect(computeScore({ q27: 9 }).count).toBe(0);
  });

  it('returns a safe fallback (Level 1, average 0) when no answers are provided', () => {
    const result = computeScore({});
    expect(result.count).toBe(0);
    expect(result.average).toBe(0);
    expect(result.level.id).toBe(1);
  });

  it('ignores non-scored (demographic / non-ordinal) questions entirely', () => {
    const answers: AnswersMap = { q1: 0, q2: 3, q3: 1, q4: 2, q5: 0 };
    const result = computeScore(answers);
    expect(result.count).toBe(0);
    expect(result.average).toBe(0);
  });

  it('ignores "לא יודע/ת" (don\'t know) answers where the scorer requires skipping them', () => {
    // Q8 (idx 7) has 6 options; index 5 = "don't know" and must be skipped.
    const result = computeScore({ q8: 5 });
    expect(result.count).toBe(0);
    expect(result.perQuestion[7]).toBeUndefined();
  });

  it('ignores non-numeric / malformed answer values', () => {
    // Q8 expects a number; a stray string should be treated as unanswered.
    const result = computeScore({ q8: 'not-a-number' as unknown as number });
    expect(result.count).toBe(0);
  });

  it('rounds/averages correctly across multiple scored questions', () => {
    // Q8 (idx 7, singleAsc5(5)): answer 0 → score 1
    // Q16 (idx 15, singleAsc5()): answer 4 → score 5
    const result = computeScore({ q8: 0, q16: 4 });
    expect(result.count).toBe(2);
    expect(result.average).toBe(3); // (1 + 5) / 2
  });

  it('handles decimal precision without rounding error blowing up', () => {
    // Three single-question scores: 1, 3, 4 → average 2.666...
    const result = computeScore({ q16: 0, q18: 2, q22: 3 });
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
      // Q28 (idx 27) is singleAsc5(): score = answer + 1, giving an exact
      // integer average that lands squarely inside each level's range.
      const result = computeScore({ q28: answerIdx });
      expect(result.average).toBe(answerIdx + 1);
      expect(result.level.id).toBe(expectedId);
    });

    it('delegates fractional averages to levelForScore at the documented boundaries', () => {
      // Q6 (matrixDesc5, 2 rows) + Q8 (singleAsc5(5)) combine to produce a
      // fractional average that exercises the exact 1.81 boundary.
      // Q6 col 4 twice → scores [1, 1]; Q8 answer 0 → score 1. Avg = 1.0.
      const low = computeScore({ q6: { 0: 4, 1: 4 }, q8: 0 });
      expect(low.average).toBe(1);
      expect(low.level.id).toBe(1);

      // Q6 col 0 twice → scores [5, 5]; Q8 answer 4 → score 5. Avg = 5.0.
      const high = computeScore({ q6: { 0: 0, 1: 0 }, q8: 4 });
      expect(high.average).toBe(5);
      expect(high.level.id).toBe(5);
    });
  });

  describe('per-question scorers (QA-PLAN §2 coverage)', () => {
    it('Q6 (idx 5, matrix-single, matrixDesc5): col 0 = best (5), col 4 = worst (1)', () => {
      const result = computeScore({ q6: { 0: 0, 1: 4 } });
      expect(result.perQuestion[5]).toBe(3); // (5 + 1) / 2
      expect(result.count).toBe(2);
    });

    it('Q7 (idx 6, matrix-single, matrixAsc5): col 0 = worst (1), col 4 = best (5)', () => {
      const result = computeScore({ q7: { 0: 0, 1: 4 } });
      expect(result.perQuestion[6]).toBe(3); // (1 + 5) / 2
    });

    it('Q8 (idx 7, single, singleAsc5(5)): answers 0..4 map to scores 1..5, idx 5 skipped', () => {
      expect(computeScore({ q8: 0 }).perQuestion[7]).toBe(1);
      expect(computeScore({ q8: 4 }).perQuestion[7]).toBe(5);
      expect(computeScore({ q8: 5 }).count).toBe(0);
    });

    it('Q9 (idx 8, matrix-single): skips not relevant / unknown and maps active stages 1..5', () => {
      const result = computeScore({ q9: { 0: 0, 1: 1, 2: 3, 3: 5, 4: 6 } });
      expect(result.perQuestion[8]).toBe(3); // (1 + 3 + 5) / 3
      expect(result.count).toBe(3);
    });

    it('Q10 (idx 9, single, singleDesc5(5)): answer 0 (80%+) = best (5), idx 5 skipped', () => {
      expect(computeScore({ q10: 0 }).perQuestion[9]).toBe(5);
      expect(computeScore({ q10: 4 }).perQuestion[9]).toBe(1);
      expect(computeScore({ q10: 5 }).count).toBe(0);
    });

    it('Q11 (idx 10, single, singleAsc5(5)): answer 4 (>80%) = best (5), idx 5 skipped', () => {
      expect(computeScore({ q11: 4 }).perQuestion[10]).toBe(5);
      expect(computeScore({ q11: 5 }).count).toBe(0);
    });

    it('Q12 (idx 11, matrix-single): skips no-pilots / unknown and maps percentage bands', () => {
      const result = computeScore({ q12: { 0: 2, 1: 7 } });
      expect(result.perQuestion[11]).toBe(3); // (1 + 5) / 2
      expect(computeScore({ q12: { 0: 0, 1: 1 } }).count).toBe(0);
    });

    it('Q14 (idx 13, matrix-single): scores each impact row 1..5 and skips unknown', () => {
      const result = computeScore({ q14: { 0: 0, 1: 4, 2: 5 } });
      expect(result.perQuestion[13]).toBe(3);
      expect(result.count).toBe(2);
    });

    it('Q16 (idx 15, single): answers 0..4 map to 1..5 and unknown is skipped', () => {
      expect(computeScore({ q16: 0 }).perQuestion[15]).toBe(1);
      expect(computeScore({ q16: 4 }).perQuestion[15]).toBe(5);
      expect(computeScore({ q16: 5 }).count).toBe(0);
    });

    it('Q17 (idx 16): scores achieved benefits only', () => {
      expect(computeScore({ q17: ['7:0'] }).perQuestion[16]).toBe(1);
      expect(computeScore({ q17: ['0:0', '1:0', '2:0'] }).perQuestion[16]).toBe(3);
      expect(computeScore({ q17: ['0:1', '1:1'] }).count).toBe(0);
    });

    it('Q18 (idx 17, single, singleAsc5())', () => {
      expect(computeScore({ q18: 2 }).perQuestion[17]).toBe(3);
    });

    it('Q19 token consumption (idx 18): scores today only', () => {
      expect(computeScore({ q19: { 0: 0, 1: 4 } }).perQuestion[18]).toBe(1);
      expect(computeScore({ q19: { 0: 4, 1: 0 } }).perQuestion[18]).toBe(5);
      expect(computeScore({ q19: { 0: 6 } }).count).toBe(0);
    });

    it('Q20 token economy management (idx 19): skips unknown', () => {
      expect(computeScore({ q20: 0 }).perQuestion[19]).toBe(1);
      expect(computeScore({ q20: 4 }).perQuestion[19]).toBe(5);
      expect(computeScore({ q20: 5 }).count).toBe(0);
    });

    it('Q22 (idx 21, single, singleAsc5())', () => {
      expect(computeScore({ q22: 2 }).perQuestion[21]).toBe(3);
    });

    it('Q23 (idx 22): skips too early and unknown', () => {
      expect(computeScore({ q23: 2 }).perQuestion[22]).toBe(3);
      expect(computeScore({ q23: 5 }).count).toBe(0);
      expect(computeScore({ q23: 6 }).count).toBe(0);
    });

    it('Q24 (idx 23, matrix-column-single): maps percentage bands and skips too early', () => {
      const result = computeScore({ q24: { 0: 0, 1: 3, 2: 4 } });
      expect(result.perQuestion[23]).toBe(3); // (1 + 5) / 2
      expect(result.count).toBe(2);
    });

    it('Q26 (idx 25): scores distinct talent selections up to 5', () => {
      expect(computeScore({ q26: [0, 1, 2] }).perQuestion[25]).toBe(3);
      expect(computeScore({ q26: [0, 1, 2, 3, 4, 5] }).perQuestion[25]).toBe(5);
    });

    it('Q27 (idx 26): uses the manager-provided FTE mapping and skips unknown', () => {
      expect(computeScore({ q27: 0 }).perQuestion[26]).toBe(1);
      expect(computeScore({ q27: 6 }).perQuestion[26]).toBe(5);
      expect(computeScore({ q27: 9 }).count).toBe(0);
    });

    it('Q28 (idx 27): skips unknown', () => {
      expect(computeScore({ q28: 2 }).perQuestion[27]).toBe(3);
      expect(computeScore({ q28: 5 }).count).toBe(0);
    });

    it('Q29 (idx 28): skips unknown', () => {
      expect(computeScore({ q29: 2 }).perQuestion[28]).toBe(3);
      expect(computeScore({ q29: 5 }).count).toBe(0);
    });

    it('Q31 (idx 30, matrix-single, matrixAsc5)', () => {
      const result = computeScore({ q31: { 0: 0, 1: 4 } });
      expect(result.perQuestion[30]).toBe(3); // (1 + 5) / 2
      expect(computeScore({ q31: { 0: 5 } }).count).toBe(0);
    });

    it('Q32 (idx 31): skips not relevant and unknown', () => {
      expect(computeScore({ q32: 2 }).perQuestion[31]).toBe(3);
      expect(computeScore({ q32: 5 }).count).toBe(0);
      expect(computeScore({ q32: 6 }).count).toBe(0);
    });

    it('Q34 (idx 33): maps resolution timing and skips too early / unknown', () => {
      const result = computeScore({ q34: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 } });
      // scores: 5,4,3,2 (cols 4 and 5 skipped)
      expect(result.perQuestion[33]).toBe(3.5);
      expect(result.count).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('handles a partially completed matrix (missing row) by scoring only present rows', () => {
      const result = computeScore({ q6: { 0: 0 } }); // row 1 missing
      expect(result.count).toBe(1);
      expect(result.perQuestion[5]).toBe(5);
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
      const result = computeScore({ q6: reselected });
      expect(result.count).toBe(1);
      expect(result.perQuestion[5]).toBe(5);
    });

    it('computes correct decimal precision for an uneven split of scores', () => {
      const result = computeScore({ q12: { 0: 2, 1: 5 } }); // bins: 1 and 3
      expect(result.average).toBe(2); // (1+3)/2
    });
  });
});

describe('isQuestionAnswered', () => {
  it('single: requires an in-range integer option', () => {
    expect(isQuestionAnswered(0, {})).toBe(false);
    expect(isQuestionAnswered(0, { q1: 0 })).toBe(true);
    expect(isQuestionAnswered(0, { q1: -1 })).toBe(false);
    expect(isQuestionAnswered(0, { q1: 99 })).toBe(false);
  });

  it('multi: requires at least one valid option index', () => {
    expect(isQuestionAnswered(14, {})).toBe(false);
    expect(isQuestionAnswered(14, { q15: [] })).toBe(false);
    expect(isQuestionAnswered(14, { q15: [1, 2] })).toBe(true);
    expect(isQuestionAnswered(14, { q15: [99] })).toBe(false);
  });

  it('matrix-multi: requires at least one exact, in-range row:column key', () => {
    expect(isQuestionAnswered(12, { q13: [] })).toBe(false);
    expect(isQuestionAnswered(12, { q13: ['1:0'] })).toBe(true);
    expect(isQuestionAnswered(12, { q13: ['bad:0', '7:0'] })).toBe(false);
  });

  it('matrix-single: requires an entry for every row', () => {
    // Q6 (idx 5) has 2 rows.
    expect(isQuestionAnswered(5, {})).toBe(false);
    expect(isQuestionAnswered(5, { q6: { 0: 1 } })).toBe(false);
    expect(isQuestionAnswered(5, { q6: { 0: 1, 1: 2 } })).toBe(true);
    expect(isQuestionAnswered(5, { q6: { 8: 1, 9: 2 } })).toBe(false);
    expect(isQuestionAnswered(5, { q6: { 0: 6, 1: 2 } })).toBe(false);
  });

  it('matrix-column-single: requires an entry for every column', () => {
    // Q24 (idx 23) has 3 columns.
    expect(isQuestionAnswered(23, {})).toBe(false);
    expect(isQuestionAnswered(23, { q24: { 0: 1, 1: 2 } })).toBe(false);
    expect(isQuestionAnswered(23, { q24: { 0: 1, 1: 2, 2: 3 } })).toBe(true);
    expect(isQuestionAnswered(23, { q24: { 4: 1, 5: 2, 6: 3 } })).toBe(false);
  });
});
