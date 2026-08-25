import type { Fact, MatrixMultiAnswer, MatrixSingleAnswer, SingleAnswer } from '../types';

// `questionIndex` controls where the mid-survey fact popup appears.
// `summaryQuestionIndex` identifies the related answer for optional filtering.

const isNum = (v: unknown): v is number => typeof v === 'number';

export const FACTS: Fact[] = [
  {
    questionIndex: 13,
    summaryQuestionIndex: 8,
    title: 'השקעות AI',
    emoji: '📈',
    text: 'על פי הסקר העולמי של Deloitte לשנת 2026, תקציבי תשתיות AI צפויים לגדול פי 3.2 עד 2028, ובחברות גדולות אפילו פי 3.9.',
    stat: '×3.2',
    caption: 'צפי לגידול תקציבי תשתיות AI בעולם עד 2028',
    icon: 'chart',
    palette: 1,
    // Show when user expects flat or decreasing investment (options 0..2).
    shouldShow: (a) => isNum(a) && (a as SingleAnswer) <= 2,
  },
  {
    questionIndex: 9,
    summaryQuestionIndex: 11,
    title: 'שימוש בפועל ב־AI',
    emoji: '⚡',
    text: 'בעולם, כיום רוב הארגונים צורכים בין 1B ל־10B טוקנים בחודש, אך עד 2028 רובם צפויים לעבור את רף ה־10B.',
    stat: '10B+',
    caption: 'טוקנים בחודש, היעד שרוב הארגונים צפויים לעבור עד 2028',
    icon: 'bolt',    palette: 2,    // Show when daily usage among access-holders is below 41% (options 0..1, skipping "don\u2019t know" at idx 5).
    shouldShow: (a) => isNum(a) && (a as SingleAnswer) <= 1,
  },
  {
    questionIndex: 11,
    summaryQuestionIndex: 12,
    title: 'מעבר מניסויים לפרודקשן',
    emoji: '🚀',
    text: 'בסקר הגלובלי של Deloitte, רק 25% מהארגונים בעולם העבירו מעל 40% מניסויי ה־AI לפרודקשן, אך 54% מצפים להגיע לכך בתוך חצי שנה.',
    stat: '25%',
    caption: 'בלבד מהארגונים העבירו מעל 40% מניסויי ה-AI לפרודקשן',
    icon: 'rocket',
    palette: 3,
    // matrix-single: row 0 = today; cols 0/1 are no-pilots/unknown and cols 2..7 are percentage bands.
    // Show when today's production rate is below 26%.
    shouldShow: (a) => {
      const m = a as MatrixSingleAnswer | undefined;
      const today = m?.[0];
      return isNum(today) && today >= 2 && today <= 4;
    },
  },
  {
    questionIndex: 16,
    summaryQuestionIndex: 17,
    title: 'תועלות מ־AI',
    emoji: '💰',
    text: 'בעולם, 74% מהארגונים מקווים להגדיל הכנסות באמצעות AI, אך רק 20% עושים זאת כיום בפועל.',
    stat: '20%',
    caption: 'מהארגונים כבר מגדילים הכנסות באמצעות AI, 74% מצפים להגיע לכך',
    icon: 'cash',
    palette: 4,
    // matrix-multi: row 2 = "הגדלת הכנסות". Column 0 = achieved today, column 1 = hoped for.
    // Show when the user is NOT achieving revenue gains today.
    shouldShow: (a) => {
      const keys = (a as MatrixMultiAnswer | undefined) ?? [];
      return !keys.includes('2:0');
    },
  },
  {
    questionIndex: 17,
    summaryQuestionIndex: 18,
    title: 'טרנספורמציית תהליכים',
    emoji: '🔄',
    text: 'על פי הסקר העולמי של Deloitte, רק כשליש מהארגונים בעולם משתמשים ב־AI לטרנספורמציה עמוקה של מוצרים, תהליכים ומודלים עסקיים.',
    stat: '⅓',
    caption: 'מהארגונים משתמשים ב-AI לטרנספורמציה עמוקה של מוצרים ותהליכים',
    icon: 'refresh',
    palette: 5,
    // Options 0..4 from "as-is" → "reinvents business model". Show below "redesigns key processes" (<2).
    shouldShow: (a) => isNum(a) && (a as SingleAnswer) <= 1,
  },
  {
    questionIndex: 21,
    summaryQuestionIndex: 22,
    title: 'עיצוב מחדש של תפקידים',
    emoji: '👥',
    text: 'בעולם, 84% מהארגונים עדיין לא עיצבו מחדש תפקידים סביב יכולות AI.',
    stat: '84%',
    caption: 'מהארגונים עדיין לא עיצבו מחדש תפקידים סביב יכולות AI',
    icon: 'users',
    palette: 6,
    // Options 0..4 from "not at all" → "fully". Show when below "moderate" (<2).
    shouldShow: (a) => isNum(a) && (a as SingleAnswer) <= 1,
  },
  {
    questionIndex: 23,
    summaryQuestionIndex: 24,
    title: 'אוטומציה של משרות',
    emoji: '🤖',
    text: 'על פי הסקר העולמי של Deloitte לשנת 2026, יותר משליש מהארגונים בעולם מצפים שלפחות 10% מהמשרות יעברו אוטומציה מלאה כבר בתוך שנה.',
    stat: '10%+',
    caption: 'מהמשרות צפויות לעבור אוטומציה מלאה בתוך שנה לפי לפחות שליש מהארגונים',
    icon: 'cpu',
    palette: 7,
    // matrix-column-single: column 0 = "within a year". Row 0 = "<10%". Show when "within a year" answer is row 0.
    shouldShow: (a) => {
      const m = a as MatrixSingleAnswer | undefined;
      return m?.[0] === 0;
    },
  },
  {
    questionIndex: 27,
    summaryQuestionIndex: 28,
    title: 'עובדים לא טכנולוגיים',
    emoji: '💡',
    text: 'בסקר הגלובלי של Deloitte, 55% מהעובדים הלא טכנולוגיים פתוחים להתנסות ב־AI, אבל רק 13% מחפשים אותו באופן יזום.',
    stat: '55%',
    caption: 'מהעובדים הלא-טכנולוגיים פתוחים להתנסות ב-AI, רק 13% יזומים',
    icon: 'bulb',
    palette: 8,
    // Options 0..4 progressing from distrust → enthusiasm. Show when below "interested" (<3).
    shouldShow: (a) => isNum(a) && (a as SingleAnswer) <= 2,
  },
  {
    questionIndex: 31,
    summaryQuestionIndex: 32,
    title: 'שימוש ב־Agentic AI',
    emoji: '🧠',
    text: 'על פי הסקר העולמי של Deloitte לשנת 2026, השימוש המשמעותי ב־Agentic AI צפוי לגדול מ־23% כיום ל־74% בתוך שנתיים.',
    stat: '23% → 74%',
    caption: 'צפי לגידול שימוש משמעותי ב-Agentic AI תוך שנתיים',
    icon: 'sparkles',
    palette: 9,
    // matrix-single: row 0 = "today". Show when today usage is "minimal" or less (<=1).
    shouldShow: (a) => {
      const m = a as MatrixSingleAnswer | undefined;
      const today = m?.[0];
      return isNum(today) && today <= 1;
    },
  },
  {
    questionIndex: 32,
    summaryQuestionIndex: 32,
    title: 'ממשל לסוכני AI',
    emoji: '🛡️',
    text: 'רק 21% מהארגונים מדווחים שיש להם מודל governance בוגר לסוכני AI אוטונומיים.',
    stat: '21%',
    caption: 'מהארגונים מחזיקים במודל Governance בוגר לסוכני AI אוטונומיים',
    icon: 'shield',
    palette: 10,
    shouldShow: (a) => isNum(a) && (a as SingleAnswer) <= 2,
  },
];

/**
 * O(1) lookup from a zero-based question index to its fact (if any).
 * Used by the question-page popup, which fires regardless of the user's
 * answer for every question that has an entry here.
 */
export const FACT_BY_QUESTION_INDEX: Record<number, Fact> = FACTS.reduce(
  (acc, fact) => {
    acc[fact.questionIndex] = fact;
    return acc;
  },
  {} as Record<number, Fact>,
);
