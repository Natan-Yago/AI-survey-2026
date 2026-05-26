import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { surveyQuestions, TOTAL_QUESTIONS } from '../data/questions';
import type {
  MatrixMultiAnswer,
  MatrixSingleAnswer,
  MultiAnswer,
  Question,
  SingleAnswer,
} from '../types';
import { useAnswers } from '../state/AnswersContext';
import { renderInline } from '../lib/inline';
import OptionCard, { MatrixOption } from '../components/OptionCard';
import FactModal from '../components/FactModal';
import { FACT_BY_QUESTION_INDEX } from '../data/facts';

function clampIndex(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(Math.max(n, 0), TOTAL_QUESTIONS - 1);
}

export default function QuestionPage() {
  const { num } = useParams<{ num: string }>();
  const navigate = useNavigate();
  const { answers, setAnswer, setLastQuestionIndex, seenFacts, markFactSeen } = useAnswers();

  const idx = useMemo(() => clampIndex(parseInt(num ?? '1', 10) - 1), [num]);
  const question = surveyQuestions[idx];
  const total = TOTAL_QUESTIONS;
  const progress = ((idx + 1) / total) * 100;
  const isLast = idx === total - 1;
  const key = `q${idx + 1}`;
  const answer = answers[key];

  const [note, setNote] = useState('');
  const [factOpen, setFactOpen] = useState(false);
  const factForQuestion = FACT_BY_QUESTION_INDEX[idx];

  useEffect(() => {
    document.title = `סקר בשלות AI · שאלה ${idx + 1} מתוך ${total}`;
    document.body.classList.add('survey-demo-body');
    return () => document.body.classList.remove('survey-demo-body');
  }, [idx, total]);

  useEffect(() => {
    setLastQuestionIndex(idx);
    setNote('');
    setFactOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [idx, setLastQuestionIndex]);

  const performNavigation = useCallback(() => {
    if (isLast) {
      navigate('/summary');
      return;
    }
    navigate(`/q/${idx + 2}`);
  }, [idx, isLast, navigate]);

  const goPrevious = useCallback(() => {
    if (idx === 0) {
      navigate('/');
      return;
    }
    navigate(`/q/${idx}`);
  }, [idx, navigate]);

  const goNext = useCallback(() => {
    if (factForQuestion && !seenFacts.has(idx)) {
      setFactOpen(true);
      return;
    }
    performNavigation();
  }, [factForQuestion, seenFacts, idx, performNavigation]);

  const handleFactDismiss = useCallback(() => {
    setFactOpen(false);
    markFactSeen(idx);
    performNavigation();
  }, [idx, markFactSeen, performNavigation]);

  // Keyboard shortcuts: Enter = next, 1..9 = choose option (single/multi only).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // While the fact modal is open, it handles its own keys.
      if (factOpen) return;
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        goNext();
        return;
      }
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && (question.type === 'single' || question.type === 'multi')) {
        if (n >= 1 && n <= question.options.length) {
          handleChoice(question, n - 1);
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, idx, answer, factOpen]);

  function handleChoice(q: Question, optionIndex: number) {
    if (q.type === 'single') {
      setAnswer(idx, optionIndex);
    } else if (q.type === 'multi') {
      const current = new Set((answer as MultiAnswer | undefined) ?? []);
      if (current.has(optionIndex)) {
        current.delete(optionIndex);
      } else if (q.maxSelections && current.size >= q.maxSelections) {
        setNote(`ניתן לבחור עד ${q.maxSelections} אפשרויות.`);
        return;
      } else {
        current.add(optionIndex);
      }
      setNote('');
      setAnswer(idx, Array.from(current).sort((a, b) => a - b));
    }
  }

  function handleMatrixSingle(promptIndex: number, choiceIndex: number) {
    const current = (answer as MatrixSingleAnswer | undefined) ?? {};
    setAnswer(idx, { ...current, [promptIndex]: choiceIndex });
  }

  function handleMatrixMulti(q: Question, rowIndex: number, columnIndex: number) {
    if (q.type !== 'matrix-multi') return;
    const optionKey = `${rowIndex}:${columnIndex}`;
    const current = new Set((answer as MatrixMultiAnswer | undefined) ?? []);
    if (current.has(optionKey)) {
      current.delete(optionKey);
    } else {
      const max = q.maxPerColumn;
      if (max !== undefined) {
        let countInColumn = 0;
        current.forEach((k) => { if (k.endsWith(`:${columnIndex}`)) countInColumn += 1; });
        if (countInColumn >= max) {
          setNote(`ניתן לבחור עד ${max} חסמים בכל עמודה.`);
          return;
        }
      }
      current.add(optionKey);
    }
    setNote('');
    setAnswer(idx, Array.from(current).sort());
  }

  function renderQuestionBody() {
    if (question.type === 'single' || question.type === 'multi') {
      const selected = new Set<number>(
        question.type === 'single'
          ? typeof answer === 'number' ? [answer as SingleAnswer] : []
          : ((answer as MultiAnswer | undefined) ?? []),
      );
      return (
        <div
          className="space-y-3"
          role={question.type === 'single' ? 'radiogroup' : 'group'}
          aria-label={question.title}
        >
          {question.options.map((option, i) => (
            <OptionCard
              key={i}
              label={option}
              badge={i + 1}
              checked={selected.has(i)}
              role={question.type === 'single' ? 'radio' : 'checkbox'}
              onClick={() => handleChoice(question, i)}
            />
          ))}
        </div>
      );
    }

    if (question.type === 'matrix-single' || question.type === 'matrix-column-single') {
      const orientation: 'row' | 'column' = question.type === 'matrix-single' ? 'row' : 'column';
      const saved = (answer as MatrixSingleAnswer | undefined) ?? {};
      const prompts = orientation === 'row' ? question.rows : question.columns;
      const choices = orientation === 'row' ? question.columns : question.rows;
      const promptLabel = orientation === 'row' ? 'שורה' : 'טווח זמן';
      return (
        <div className="matrix-list">
          {prompts.map((prompt, promptIndex) => (
            <section key={promptIndex} className="matrix-row">
              <h2 className="matrix-row-title">{renderInline(prompt)}</h2>
              <div
                className="matrix-choice-grid"
                role="radiogroup"
                aria-label={`${promptLabel} ${promptIndex + 1}`}
              >
                {choices.map((choice, choiceIndex) => (
                  <MatrixOption
                    key={choiceIndex}
                    label={choice}
                    checked={saved[promptIndex] === choiceIndex}
                    role="radio"
                    onClick={() => handleMatrixSingle(promptIndex, choiceIndex)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      );
    }

    // matrix-multi
    const saved = new Set((answer as MatrixMultiAnswer | undefined) ?? []);
    return (
      <div className="matrix-list">
        {question.rows.map((rowLabel, rowIndex) => (
          <section key={rowIndex} className="matrix-row">
            <h2 className="matrix-row-title">{renderInline(rowLabel)}</h2>
            <div className="matrix-choice-grid matrix-choice-grid--compact" role="group" aria-label={rowLabel}>
              {question.columns.map((columnLabel, columnIndex) => (
                <MatrixOption
                  key={columnIndex}
                  label={columnLabel}
                  checked={saved.has(`${rowIndex}:${columnIndex}`)}
                  role="checkbox"
                  onClick={() => handleMatrixMulti(question, rowIndex, columnIndex)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  const shortcutHint =
    question.type === 'single' || question.type === 'multi'
      ? <>
          <span>בחר/י עם <span className="kbd font-latin">1</span>–<span className="kbd font-latin">{Math.min(question.options.length, 9)}</span></span>
          <span className="text-[#E5E5E5]">·</span>
          <span>המשך עם <span className="kbd font-latin">Enter</span></span>
        </>
      : <>
          <span>בחר/י תשובות לפי שורה</span>
          <span className="text-[#E5E5E5]">·</span>
          <span>המשך עם <span className="kbd font-latin">Enter</span></span>
        </>;

  return (
    <>
      <Link to="/" className="survey-demo-logo fixed top-5 left-5 sm:top-6 sm:left-6 z-20 inline-flex" aria-label="Deloitte">
        <img src="/Deloitte-Master-Logo-Black-RGB.png" alt="Deloitte" className="h-10 sm:h-12 lg:h-16 w-auto" />
      </Link>

      <main className="survey-demo-main flex-1 min-h-[600px] w-full px-5 sm:px-8 py-8 sm:py-12 pb-32 flex items-start justify-center">
        <section className="w-full max-w-[720px]">
          <div className="mb-7">
            <div className="flex items-center justify-between gap-5 text-xs text-[#6B7280] mb-2">
              <span className="min-w-0 truncate">{renderInline(question.section)}</span>
              <span className="font-latin whitespace-nowrap">שאלה <span className="num">{idx + 1}</span> מתוך <span className="num">{total}</span></span>
            </div>
            <div className="progress-track rounded-full">
              <div className="progress-fill rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold leading-snug mb-3">{renderInline(question.question)}</h1>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-6">{renderInline(question.instructions)}</p>

          <div>{renderQuestionBody()}</div>
          <p className="text-xs text-[#6B7280] mt-4 min-h-4" aria-live="polite">{note}</p>
        </section>
      </main>

      <footer className="fixed bottom-0 inset-x-0 no-card-footer">
        <div className="mx-auto max-w-[720px] px-5 sm:px-0 py-3 flex items-center justify-between gap-3">
          <button type="button" className="btn-ghost text-sm sm:text-base" onClick={goPrevious}>
            {idx === 0 ? '→ לפתיחה' : '→ הקודם'}
          </button>
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#6B7280]">{shortcutHint}</div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-accent text-sm sm:text-base" onClick={goNext}>
              {isLast ? 'סיום ←' : 'הבא ←'}
            </button>
          </div>
        </div>
      </footer>

      {factForQuestion && (
        <FactModal
          open={factOpen}
          title={factForQuestion.title}
          text={factForQuestion.text}
          onClose={handleFactDismiss}
        />
      )}
    </>
  );
}
