import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AnswerValue, AnswersMap } from '../types';
import { loadState, saveState, clearState } from '../lib/storage';

const SEEN_FACTS_KEY = 'ai-survey:seenFacts-v2';

function loadSeenFacts(): Set<number> {
  try {
    const raw = sessionStorage.getItem(SEEN_FACTS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((n): n is number => typeof n === 'number'));
    }
    return new Set();
  } catch {
    return new Set();
  }
}

function saveSeenFacts(set: Set<number>): void {
  try {
    sessionStorage.setItem(SEEN_FACTS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

function clearSeenFacts(): void {
  try {
    sessionStorage.removeItem(SEEN_FACTS_KEY);
  } catch {
    // ignore
  }
}

interface AnswersContextValue {
  answers: AnswersMap;
  lastQuestionIndex: number;
  seenFacts: Set<number>;
  setAnswer: (questionIndex: number, value: AnswerValue | undefined) => void;
  setLastQuestionIndex: (index: number) => void;
  markFactSeen: (questionIndex: number) => void;
  resetSurvey: () => void;
}

const AnswersContext = createContext<AnswersContextValue | null>(null);

export function AnswersProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => loadState(), []);
  const [answers, setAnswers] = useState<AnswersMap>(initial.answers as AnswersMap);
  const [lastQuestionIndex, setLastQuestionIndexState] = useState<number>(initial.lastQuestionIndex);
  const [seenFacts, setSeenFacts] = useState<Set<number>>(() => loadSeenFacts());

  // Persist on any state change.
  useEffect(() => {
    saveState({ answers, lastQuestionIndex });
  }, [answers, lastQuestionIndex]);

  useEffect(() => {
    saveSeenFacts(seenFacts);
  }, [seenFacts]);

  const setAnswer = useCallback((questionIndex: number, value: AnswerValue | undefined) => {
    setAnswers((prev) => {
      const key = `q${questionIndex + 1}`;
      if (value === undefined) {
        const { [key]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const setLastQuestionIndex = useCallback((index: number) => {
    setLastQuestionIndexState(index);
  }, []);

  const markFactSeen = useCallback((questionIndex: number) => {
    setSeenFacts((prev) => {
      if (prev.has(questionIndex)) return prev;
      const next = new Set(prev);
      next.add(questionIndex);
      return next;
    });
  }, []);

  const resetSurvey = useCallback(() => {
    setAnswers({});
    setLastQuestionIndexState(0);
    setSeenFacts(new Set());
    clearState();
    clearSeenFacts();
  }, []);

  const value: AnswersContextValue = {
    answers,
    lastQuestionIndex,
    seenFacts,
    setAnswer,
    setLastQuestionIndex,
    markFactSeen,
    resetSurvey,
  };

  return <AnswersContext.Provider value={value}>{children}</AnswersContext.Provider>;
}

export function useAnswers(): AnswersContextValue {
  const ctx = useContext(AnswersContext);
  if (!ctx) throw new Error('useAnswers must be used within <AnswersProvider>');
  return ctx;
}
