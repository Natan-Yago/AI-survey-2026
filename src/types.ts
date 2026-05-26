// Question + answer domain types.
// Answer shapes by question type:
//   single                → number      (selected option index)
//   multi                 → number[]    (selected option indices)
//   matrix-single         → Record<number, number> (rowIndex → colIndex)
//   matrix-column-single  → Record<number, number> (colIndex → rowIndex)
//   matrix-multi          → string[]    ("rowIndex:colIndex" keys)

export type QuestionType =
  | 'single'
  | 'multi'
  | 'matrix-single'
  | 'matrix-column-single'
  | 'matrix-multi';

export interface BaseQuestion {
  section: string;
  type: QuestionType;
  title: string;
  question: string;
  instructions: string;
}

export interface SingleQuestion extends BaseQuestion {
  type: 'single';
  options: string[];
}

export interface MultiQuestion extends BaseQuestion {
  type: 'multi';
  options: string[];
  maxSelections?: number;
}

export interface MatrixSingleQuestion extends BaseQuestion {
  type: 'matrix-single' | 'matrix-column-single';
  rows: string[];
  columns: string[];
}

export interface MatrixMultiQuestion extends BaseQuestion {
  type: 'matrix-multi';
  rows: string[];
  columns: string[];
  maxPerColumn?: number;
}

export type Question =
  | SingleQuestion
  | MultiQuestion
  | MatrixSingleQuestion
  | MatrixMultiQuestion;

export type SingleAnswer = number;
export type MultiAnswer = number[];
export type MatrixSingleAnswer = Record<number, number>;
export type MatrixMultiAnswer = string[];
export type AnswerValue =
  | SingleAnswer
  | MultiAnswer
  | MatrixSingleAnswer
  | MatrixMultiAnswer;

export type AnswersMap = Record<string, AnswerValue>;

export interface MaturityLevel {
  id: 1 | 2 | 3 | 4 | 5;
  nameHe: string;
  nameEn: string;
  range: [number, number]; // inclusive lower, inclusive upper avg score
  shortDesc: string;
  positioning: string;
  implications: string[];
}

export interface Fact {
  /** Zero-based question index in the survey array */
  questionIndex: number;
  /** Optional zero-based answer index used by Summary benchmark filtering. */
  summaryQuestionIndex?: number;
  /** Short topic title displayed at the top of the popup (e.g. "שאלה 14 – השקעות AI"). */
  title: string;
  emoji: string;
  text: string;
  /**
   * Optional predicate used by the Summary page to decide whether to
   * surface this fact based on the user's answer. The question-page popup
   * ignores this and always shows the fact.
   */
  shouldShow?: (answer: AnswerValue | undefined) => boolean;
}

export interface Expert {
  name: string;
  role: string;
  email: string;
}
