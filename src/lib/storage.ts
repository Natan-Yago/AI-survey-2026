import { surveyQuestions, TOTAL_QUESTIONS } from '../data/questions';
import type {
  AnswerValue,
  AnswersMap,
  MatrixMultiAnswer,
  MatrixSingleAnswer,
  Question,
} from '../types';

const STORAGE_KEY = 'ai-survey-answers-v4';

export interface PersistedState {
  answers: AnswersMap;
  lastQuestionIndex: number;
}

function isValidIndex(value: unknown, length: number): value is number {
  return typeof value === 'number'
    && Number.isInteger(value)
    && value >= 0
    && value < length;
}

function normalizeAnswer(question: Question, value: unknown): AnswerValue | undefined {
  if (question.type === 'single') {
    return isValidIndex(value, question.options.length) ? value : undefined;
  }

  if (question.type === 'multi') {
    if (!Array.isArray(value)) return undefined;
    const selections = Array.from(new Set(
      value.filter((option): option is number => isValidIndex(option, question.options.length)),
    )).sort((a, b) => a - b);
    const exclusiveOptions = new Set(question.exclusiveOptions ?? []);
    const exclusiveSelection = selections.find((option) => exclusiveOptions.has(option));
    if (exclusiveSelection !== undefined) return [exclusiveSelection];
    const normalized = question.maxSelections === undefined
      ? selections
      : selections.slice(0, question.maxSelections);
    return normalized.length > 0 ? normalized : undefined;
  }

  if (question.type === 'matrix-single' || question.type === 'matrix-column-single') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined;
    const promptCount = question.type === 'matrix-single'
      ? question.rows.length
      : question.columns.length;
    const choiceCount = question.type === 'matrix-single'
      ? question.columns.length
      : question.rows.length;
    const normalized: MatrixSingleAnswer = {};
    Object.entries(value).forEach(([key, choice]) => {
      if (!/^(0|[1-9]\d*)$/.test(key)) return;
      const promptIndex = Number(key);
      if (isValidIndex(promptIndex, promptCount) && isValidIndex(choice, choiceCount)) {
        normalized[promptIndex] = choice;
      }
    });
    return Object.keys(normalized).length > 0 ? normalized : undefined;
  }

  if (question.type !== 'matrix-multi') return undefined;
  if (!Array.isArray(value)) return undefined;
  const selections = Array.from(new Set(value.filter((key): key is string => {
    if (typeof key !== 'string') return false;
    const match = /^(0|[1-9]\d*):(0|[1-9]\d*)$/.exec(key);
    if (!match) return false;
    return isValidIndex(Number(match[1]), question.rows.length)
      && isValidIndex(Number(match[2]), question.columns.length);
  })));
  const normalized: MatrixMultiAnswer = [];
  const exclusiveRows = new Set(question.exclusiveRows ?? []);

  question.columns.forEach((_, columnIndex) => {
    const columnSelections = selections.filter((key) => key.endsWith(`:${columnIndex}`));
    const isExclusiveColumn = question.exclusiveColumns === undefined
      || question.exclusiveColumns.includes(columnIndex);
    const exclusiveSelection = isExclusiveColumn
      ? columnSelections.find((key) => exclusiveRows.has(Number(key.split(':')[0])))
      : undefined;
    if (exclusiveSelection !== undefined) {
      normalized.push(exclusiveSelection);
      return;
    }
    normalized.push(...(question.maxPerColumn === undefined
      ? columnSelections
      : columnSelections.slice(0, question.maxPerColumn)));
  });

  normalized.sort((a, b) => {
    const [aRow, aColumn] = a.split(':').map(Number);
    const [bRow, bColumn] = b.split(':').map(Number);
    return aRow - bRow || aColumn - bColumn;
  });
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeAnswers(value: unknown): AnswersMap {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
  const normalized: AnswersMap = {};
  Object.entries(value).forEach(([key, answer]) => {
    const match = /^q([1-9]\d*)$/.exec(key);
    if (!match) return;
    const questionIndex = Number(match[1]) - 1;
    const question = surveyQuestions[questionIndex];
    if (!question) return;
    const normalizedAnswer = normalizeAnswer(question, answer);
    if (normalizedAnswer !== undefined) normalized[key] = normalizedAnswer;
  });
  return normalized;
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { answers: {}, lastQuestionIndex: 0 };
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      answers: normalizeAnswers(parsed.answers),
      lastQuestionIndex: typeof parsed.lastQuestionIndex === 'number'
        && Number.isInteger(parsed.lastQuestionIndex)
        ? Math.min(Math.max(parsed.lastQuestionIndex, 0), TOTAL_QUESTIONS - 1)
        : 0,
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
