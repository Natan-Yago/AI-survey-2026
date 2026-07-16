import { describe, expect, it } from 'vitest';
import { levelForScore, MATURITY_LEVELS } from '../data/levels';

describe('levelForScore', () => {
  it.each([
    [1.0, 1],
    [1.5, 1],
    [1.8, 1],
    [1.81, 2],
    [2.0, 2],
    [2.6, 2],
    [2.61, 3],
    [3.0, 3],
    [3.4, 3],
    [3.41, 4],
    [4.0, 4],
    [4.2, 4],
    [4.21, 5],
    [4.5, 5],
    [5.0, 5],
  ])('maps score %s to level id %s (boundary values)', (score, expectedId) => {
    expect(levelForScore(score).id).toBe(expectedId);
  });

  it('falls back to the highest level for out-of-range scores above 5.0', () => {
    expect(levelForScore(6).id).toBe(5);
  });

  it('MATURITY_LEVELS has exactly 5 levels ordered by id', () => {
    expect(MATURITY_LEVELS).toHaveLength(5);
    expect(MATURITY_LEVELS.map((l) => l.id)).toEqual([1, 2, 3, 4, 5]);
    expect(MATURITY_LEVELS.map((l) => l.nameEn)).toEqual([
      'Exploring',
      'Building',
      'Scaling',
      'Transforming',
      'AI-First',
    ]);
    MATURITY_LEVELS.forEach((level) => {
      expect(level.keyQuestion).not.toBe('');
      expect(level.meaning).not.toBe('');
      expect(level.challenges).not.toBe('');
      expect(level.nextStep).not.toBe('');
    });
  });
});
