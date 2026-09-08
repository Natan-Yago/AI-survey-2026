import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearState, loadState, saveState, type PersistedState } from './storage';

const STORAGE_KEY = 'ai-survey-answers-v4';

describe('storage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('loadState', () => {
    it('returns a safe default when nothing is stored', () => {
      expect(loadState()).toEqual({ answers: {}, lastQuestionIndex: 0 });
    });

    it('round-trips a previously saved state', () => {
      const state: PersistedState = { answers: { q1: 2, q7: { 0: 1 } }, lastQuestionIndex: 6 };
      saveState(state);
      expect(loadState()).toEqual(state);
    });

    it('falls back to defaults on corrupt JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not valid json');
      expect(loadState()).toEqual({ answers: {}, lastQuestionIndex: 0 });
    });

    it('falls back to {} when stored answers is not an object', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: 'oops', lastQuestionIndex: 3 }));
      expect(loadState()).toEqual({ answers: {}, lastQuestionIndex: 3 });
    });

    it('falls back to 0 when stored lastQuestionIndex is not a number', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: { q1: 1 }, lastQuestionIndex: 'x' }));
      expect(loadState()).toEqual({ answers: { q1: 1 }, lastQuestionIndex: 0 });
    });

    it('preserves valid partial answers while removing malformed values and keys', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers: {
          q1: 99,
          q7: { 0: 1, 5: 2, bad: 0 },
          q15: [2, 2, '3', 99],
          q17: ['0:0', '0:0', '8:0', 'bad:0', 1, '1:1'],
          q35: 0,
          unexpected: [0],
        },
        lastQuestionIndex: 99,
      }));

      expect(loadState()).toEqual({
        answers: {
          q7: { 0: 1 },
          q15: [2],
          q17: ['0:0', '1:1'],
        },
        lastQuestionIndex: 33,
      });
    });

    it('normalizes persisted limits and exclusivity on the correct matrix columns', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers: {
          q15: [0, 1, 2, 3],
          q17: ['0:0', '1:0', '7:0', '0:1', '1:1', '2:1', '3:1'],
          q21: [0, 7, 8],
        },
        lastQuestionIndex: 20,
      }));

      expect(loadState().answers).toEqual({
        q15: [0, 1, 2],
        q17: ['0:1', '1:1', '2:1', '7:0'],
        q21: [7],
      });
    });
  });

  describe('saveState', () => {
    it('persists state under the storage key', () => {
      saveState({ answers: { q2: 0 }, lastQuestionIndex: 1 });
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual({ answers: { q2: 0 }, lastQuestionIndex: 1 });
    });

    it('fails silently when localStorage.setItem throws (quota/private mode)', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveState({ answers: {}, lastQuestionIndex: 0 })).not.toThrow();
    });
  });

  describe('clearState', () => {
    it('removes the persisted state', () => {
      saveState({ answers: { q1: 1 }, lastQuestionIndex: 1 });
      clearState();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(loadState()).toEqual({ answers: {}, lastQuestionIndex: 0 });
    });

    it('fails silently when localStorage.removeItem throws', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => clearState()).not.toThrow();
    });
  });
});
