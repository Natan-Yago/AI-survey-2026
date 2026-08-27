import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAnswers } from '../state/AnswersContext';
import { TOTAL_QUESTIONS } from '../data/questions';

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const SURVEY_NOTICE = 'תודה על השתתפותך בסקר. מטרת הסקר היא לאסוף תובנות מצטברות לגבי רמת האימוץ, הבשלות, האתגרים והעדיפויות של ארגונים ביחס לשימוש בבינה מלאכותית (AI), לרבות Generative AI ו-Agentic AI. הסקר מיועד לאיסוף מידע כללי ומצטבר. אין צורך למסור את שמך או את שם הארגון. התשובות ינותחו ויוצגו, ככל שיוצגו, באופן מצטבר ולא באופן שנועד לזהות משיב מסוים או ארגון מסוים. ההשתתפות בסקר היא וולונטרית. ניתן לבחור באפשרות "לא יודע/ת / לא ניתן למסור" או "לא יודע/ת / לא בטוח/ה", לפי העניין, כאשר אין בידך מידע מספיק או כאשר אינך רשאי/ת למסור מידע מסוים. המידע שייאסף עשוי לשמש את Deloitte ישראל לצרכים פנימיים, לניתוחים סטטיסטיים, להפקת תובנות מקצועיות, לפיתוח ידע ולפרסומים מקצועיים או שיווקיים המבוססים על נתונים מצטברים. הנתונים לא יוצגו באופן שנועד לזהות אותך או את הארגון שאליו את/ה משתייך/ת. הסקר ותוצאותיו אינם מהווים ייעוץ מקצועי, תחזית מחייבת, דירוג או הערכה פרטנית של ארגון כלשהו, ואינם תחליף לייעוץ המותאם לנסיבותיו של ארגון מסוים.';

const PRIVACY_POLICY_URL = 'https://www.deloitte.com/il/en/legal/privacy.html';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { lastQuestionIndex, answers, resetSurvey } = useAnswers();
  const [hasConsent, setHasConsent] = useState(false);
  const hasProgress = Object.keys(answers).length > 0;
  const furthestAnsweredIndex = Object.keys(answers).reduce((furthestIndex, key) => {
    const match = /^q(\d+)$/.exec(key);
    if (!match) return furthestIndex;
    return Math.max(furthestIndex, Number(match[1]) - 1);
  }, 0);
  const resumeIndex = Math.max(
    0,
    Math.min(Math.max(lastQuestionIndex, furthestAnsweredIndex), TOTAL_QUESTIONS - 1),
  );

  const handleRestart = () => {
    resetSurvey();
    navigate('/q/1');
  };

  useEffect(() => {
    document.title = 'סקר בשלות AI · ברוכים הבאים';
    document.body.classList.add('welcome-body');
    return () => document.body.classList.remove('welcome-body');
  }, []);

  return (
    <>
      <Link to="/" className="welcome-mobile-logo fixed top-5 left-5 z-20 inline-flex lg:hidden" aria-label="Deloitte">
        <img src={assetUrl('Deloitte-Master-Logo-Black-RGB.png')} alt="Deloitte" className="h-12 sm:h-14 w-auto" />
      </Link>
      <Link to="/" className="welcome-desktop-logo fixed top-6 left-6 z-20 hidden lg:inline-flex" aria-label="Deloitte">
        <img src={assetUrl('Deloitte-Master-Logo-Black-RGB.png')} alt="Deloitte" className="h-14 xl:h-16 w-auto" />
      </Link>
      <div className="welcome-layout min-h-screen w-full grid grid-cols-1" dir="ltr">
        <aside className="welcome-image-col relative hidden lg:flex bg-[#74E796] overflow-hidden items-center justify-center" dir="rtl">
          <img src={assetUrl('new-hero-image.jpg')} alt="" className="w-full h-full object-cover" />
        </aside>

        <section className="welcome-content-col flex flex-col min-h-screen" dir="rtl">
          <main className="welcome-main flex-1 px-6 sm:px-10 lg:px-10 xl:px-14 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:py-6 flex items-center justify-center">
            <div className="welcome-copy w-full max-w-xl">
              <img src={assetUrl('text comp.png')} alt="" aria-hidden="true" className="h-16 sm:h-16 lg:h-16 xl:h-20 w-auto mb-5 lg:mb-3 xl:mb-4" />
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-5 lg:mb-3 xl:mb-4">
                סקר בשלות ואימוץ <span className="font-latin">AI</span> בארגונים
              </h1>
              <p className="text-lg lg:text-base xl:text-lg text-[#1A1A1A]/80 leading-relaxed mb-5 lg:mb-3 xl:mb-4">
                בעידן שבו בינה מלאכותית משנה במהירות את הדרך שבה ארגונים פועלים, מתחרים ומייצרים ערך, היכולת לאמץ, להטמיע ולהרחיב שימוש ביכולות <span className="font-latin">AI</span> הופכת לגורם אסטרטגי מרכזי.
              </p>
              <p className="text-base lg:text-sm xl:text-base text-[#6B7280] leading-relaxed mb-10 lg:mb-5 xl:mb-7">
                סקר זה נועד לבחון את מצב ה-<span className="font-latin">AI</span> בארגונים בישראל, את רמת המוכנות, האימוץ, ההשקעות, החסמים והתוכניות קדימה.
              </p>
              <details className="mb-5 border-y border-[#E5E5E5] py-4 text-sm text-[#4B5563]">
                <summary className="cursor-pointer font-semibold text-[#1A1A1A]">מידע על הסקר</summary>
                <p className="mt-3 max-h-44 overflow-y-auto leading-relaxed pe-2">{SURVEY_NOTICE}</p>
              </details>
              <label className="mb-7 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#4B5563]">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(event) => setHasConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#86BC25]"
                />
                <span>
                  אני מאשר/ת שקראתי את{' '}
                  <a
                    href={PRIVACY_POLICY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#1A1A1A] underline hover:text-[#567A16]"
                  >
                    מדיניות הפרטיות של Deloitte
                  </a>
                  , ואני מסכים/ה להשתתף בסקר ולעיבוד תשובותיי בהתאם למפורט לעיל.
                </span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 lg:mb-5 xl:mb-6">
                <button
                  type="button"
                  disabled={!hasConsent}
                  onClick={() => navigate(hasProgress ? `/q/${resumeIndex + 1}` : '/q/1')}
                  className="btn-accent text-center text-base disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {hasProgress ? 'המשך מהמקום בו עצרת ←' : 'התחל סקר ←'}
                </button>
                {hasProgress && (
                  <button
                    type="button"
                    disabled={!hasConsent}
                    onClick={handleRestart}
                    className="btn-ghost text-center text-base disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    התחל מחדש ←
                  </button>
                )}
              </div>
              <nav className="text-sm lg:text-xs xl:text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E5E5] pt-6 lg:pt-4 xl:pt-5 flex flex-wrap gap-x-6 gap-y-2">
                <a href="https://www.deloitte.com/il/en/legal/legal.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A] hover:underline">
                  תנאי שימוש
                </a>
                <a href="https://www.deloitte.com/il/en/legal/Cookies.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A] hover:underline">
                  עוגיות
                </a>
                <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A] hover:underline">
                  פרטיות
                </a>
              </nav>
            </div>
          </main>
        </section>
      </div>
    </>
  );
}
