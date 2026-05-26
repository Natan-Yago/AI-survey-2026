const STORAGE_KEY = 'ai-survey-answers-v1';

export interface PersistedState {
  answers: Record<string, unknown>;
  lastQuestionIndex: number;
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { answers: {}, lastQuestionIndex: 0 };
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      lastQuestionIndex:
        typeof parsed.lastQuestionIndex === 'number' ? parsed.lastQuestionIndex : 0,
    };
  } catch {
    return { answers: {}, lastQuestionIndex: 0 };
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (privacy mode, quota). Fail silently.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
