import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnswersProvider, useAnswers } from './AnswersContext';

const wrapper = ({ children }: { children: ReactNode }) => <AnswersProvider>{children}</AnswersProvider>;

const ANSWERS_KEY = 'ai-survey-answers-v2';
const SEEN_FACTS_KEY = 'ai-survey:seenFacts-v2';

describe('AnswersContext', () => {
  it('starts empty when no persisted state exists', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper });
    expect(result.current.answers).toEqual({});
    expect(result.current.lastQuestionIndex).toBe(0);
    expect(result.current.seenFacts.size).toBe(0);
  });

  it('setAnswer updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper });
    act(() => result.current.setAnswer(0, 2));
    expect(result.current.answers).toEqual({ q1: 2 });
    const persisted = JSON.parse(localStorage.getItem(ANSWERS_KEY)!);
    expect(persisted.answers).toEqual({ q1: 2 });
  });

  it('setAnswer with undefined removes the key', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper });
    act(() => result.current.setAnswer(0, 2));
    act(() => result.current.setAnswer(0, undefined));
    expect(result.current.answers).toEqual({});
  });

  it('setLastQuestionIndex updates and persists the bookmark', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper });
    act(() => result.current.setLastQuestionIndex(5));
    expect(result.current.lastQuestionIndex).toBe(5);
    const persisted = JSON.parse(localStorage.getItem(ANSWERS_KEY)!);
    expect(persisted.lastQuestionIndex).toBe(5);
  });

  it('markFactSeen adds to seenFacts and persists to sessionStorage', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper });
    act(() => result.current.markFactSeen(13));
    expect(result.current.seenFacts.has(13)).toBe(true);
    const persisted = JSON.parse(sessionStorage.getItem(SEEN_FACTS_KEY)!);
    expect(persisted).toContain(13);
  });

  it('resetSurvey clears answers, bookmark, seenFacts, and storage', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper });
    act(() => {
      result.current.setAnswer(0, 1);
      result.current.setLastQuestionIndex(4);
      result.current.markFactSeen(13);
    });
    act(() => result.current.resetSurvey());
    expect(result.current.answers).toEqual({});
    expect(result.current.lastQuestionIndex).toBe(0);
    expect(result.current.seenFacts.size).toBe(0);
    // clearState() removes the key, but the persistence effect then re-runs
    // (state changed) and saves the fresh empty defaults — so the key ends
    // up holding an empty-but-valid state rather than being absent.
    expect(JSON.parse(localStorage.getItem(ANSWERS_KEY)!)).toEqual({ answers: {}, lastQuestionIndex: 0 });
    expect(JSON.parse(sessionStorage.getItem(SEEN_FACTS_KEY)!)).toEqual([]);
  });

  it('loads previously persisted answers on mount', () => {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify({ answers: { q1: 3 }, lastQuestionIndex: 2 }));
    const { result } = renderHook(() => useAnswers(), { wrapper });
    expect(result.current.answers).toEqual({ q1: 3 });
    expect(result.current.lastQuestionIndex).toBe(2);
  });

  it('throws when useAnswers is called outside of AnswersProvider', () => {
    expect(() => renderHook(() => useAnswers())).toThrow(
      'useAnswers must be used within <AnswersProvider>',
    );
  });
});
