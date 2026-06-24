import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAnswers } from '../state/AnswersContext';
import { computeScore, MATURITY_LEVELS } from '../lib/scoring';
import { SUMMARY_EXPERTS } from '../data/levels';
import { renderInline } from '../lib/inline';
import StatCard from '../components/StatCard';

const EXPERT_IMAGES: Record<string, string> = {
  'rodolev@deloitte.co.il': 'dolevrotem.webp',
  'tkochav@deloitte.co.il': 'tovi-kochav.webp',
};

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function SummaryPage() {
  const { answers, resetSurvey } = useAnswers();
  const result = useMemo(() => computeScore(answers), [answers]);
  const { level, average, count } = result;
  const { facts } = result;

  useEffect(() => {
    document.title = `AI Maturity Survey · ${level.nameEn}`;
    document.body.classList.add('survey-demo-body');
    return () => document.body.classList.remove('survey-demo-body');
  }, [level.nameEn]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <Link to="/" className="survey-demo-logo fixed top-5 left-5 sm:top-6 sm:left-6 z-20 inline-flex" aria-label="Deloitte">
        <img src={assetUrl('Deloitte-Master-Logo-Black-RGB.png')} alt="Deloitte" className="h-12 sm:h-14 lg:h-16 w-auto" />
      </Link>

      <main className="survey-demo-main flex-1 min-h-[600px] w-full px-5 sm:px-8 py-8 sm:py-12 pb-48 flex items-start justify-center">
        <section className="w-full max-w-[720px] summary-main">
          {/* Hero */}
          <section className="summary-hero">
            <div className="mb-7">
              <div className="flex items-center justify-between gap-5 text-xs text-[#6B7280] mb-2">
                <span className="min-w-0 truncate">סיכום הסקר</span>
                <span className="font-latin whitespace-nowrap">100%</span>
              </div>
              <div className="progress-track rounded-full">
                <div className="progress-fill rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-3">
              <span className="font-latin">{level.nameEn}</span>
            </h1>
            <div className="score-figure">
              <span className="score-num font-latin">{count > 0 ? average.toFixed(2) : '—'}</span>
              <span className="score-denom font-latin">/ 5.00</span>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
              {level.shortDesc}
            </p>
            <div className="summary-answer option-card surface-card w-full text-start">
              <span className="summary-answer-marker" aria-hidden="true"></span>
              <p>{renderInline(level.positioning)}</p>
            </div>

            {/* Stage progress dots */}
            <div className="stage-progress" aria-label="שלב במסע ה-AI">
              {MATURITY_LEVELS.map((s, i) => {
                const state = i < level.id - 1 ? 'past' : i === level.id - 1 ? 'current' : 'future';
                return (
                  <div key={s.id} style={{ display: 'contents' }}>
                    <div className={`stage-step is-${state}`}>
                      <span className="stage-dot"></span>
                      <span className="stage-step-label font-latin">L{s.id}</span>
                    </div>
                    {i < MATURITY_LEVELS.length - 1 && <span className="stage-line"></span>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Implications section removed: stage-level descriptions were
              generic and could not honestly assert characteristics of the
              user's organization. Global benchmarks fill this role now. */}

          {/* Global benchmarks — always shown, in question-index order. */}
          <section className="summary-section">
            <div className="summary-section-head">
              <h2 className="summary-section-title">בנצ'מרק עולמי · Deloitte 2026</h2>
              <p className="summary-section-sub">
                מספרים נבחרים מהסקר העולמי של Deloitte לשנת 2026.
              </p>
            </div>
            <div className="fact-list">
              {facts.map((f, i) => (
                <StatCard
                  key={f.questionIndex}
                  stat={f.stat}
                  caption={f.caption}
                  icon={f.icon}
                  palette={(i % 9) + 1}
                />
              ))}
            </div>
          </section>

          {/* Experts */}
          <section className="summary-section">
            <div className="summary-section-head">
              <h2 className="summary-section-title">עם מי אפשר לדבר</h2>
              <p className="summary-section-sub">מובילי התחום הרלוונטי בישראל.</p>
            </div>
            <div className="expert-grid">
              {SUMMARY_EXPERTS.map((e) => (
                <div key={e.email} className="option-card surface-card expert-card">
                  <div className="expert-avatar">
                    <img className="expert-avatar-img" src={assetUrl(EXPERT_IMAGES[e.email])} alt={e.name} />
                  </div>
                  <div className="expert-meta">
                    <div className="expert-name">{e.name}</div>
                    <div className="expert-role">{e.role}</div>
                    <a className="expert-mail font-latin" href={`mailto:${e.email}`}>{e.email}</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      <footer className="fixed bottom-0 inset-x-0 no-card-footer">
        <div className="mx-auto max-w-[720px] px-5 sm:px-0 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            className="btn-ghost text-sm sm:text-base"
            onClick={() => {
              if (confirm('להתחיל סקר חדש? הנתונים המקומיים יימחקו.')) {
                resetSurvey();
                window.location.href = '/';
              }
            }}
          >
            → התחל סקר חדש
          </button>
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#6B7280]">
            <span className="font-latin">{count} answers scored</span>
          </div>
          <button type="button" className="btn-accent text-sm sm:text-base" onClick={() => window.print()}>
            הדפסה / PDF
          </button>
        </div>
      </footer>
    </>
  );
}
