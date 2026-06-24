import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAnswers } from '../state/AnswersContext';

export default function WelcomePage() {
  const { lastQuestionIndex, answers } = useAnswers();
  const hasProgress = Object.keys(answers).length > 0;
  const resumeIndex = Math.max(0, Math.min(lastQuestionIndex, 31));

  useEffect(() => {
    document.title = 'סקר בשלות AI · ברוכים הבאים';
    document.body.classList.add('welcome-body');
    return () => document.body.classList.remove('welcome-body');
  }, []);

  return (
    <>
      <a href="/" className="welcome-mobile-logo fixed top-5 left-5 z-20 inline-flex lg:hidden" aria-label="Deloitte">
        <img src="/Deloitte-Master-Logo-Black-RGB.png" alt="Deloitte" className="h-12 sm:h-14 w-auto" />
      </a>
      <div className="welcome-layout min-h-screen w-full grid grid-cols-1 lg:grid-cols-2" dir="ltr">
        <aside className="welcome-image-col relative hidden lg:block bg-[#0F0F0F] overflow-hidden" dir="rtl">
          <img src="/welcome-img.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
          <a href="/" className="absolute top-8 left-8 z-10 inline-flex" aria-label="Deloitte">
            <img src="/Deloitte-Master-Logo-Black-RGB.png" alt="Deloitte" className="h-20 w-auto" />
          </a>
          <div className="absolute bottom-8 right-8 left-8 text-white" dir="rtl">
            <p className="text-white/85 text-sm max-w-sm leading-relaxed">
              מפת הבשלות והאימוץ של בינה מלאכותית בארגונים בישראל.
            </p>
          </div>
        </aside>

        <section className="welcome-content-col flex flex-col min-h-screen" dir="rtl">
          <main className="welcome-main flex-1 px-6 sm:px-10 lg:px-14 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:py-16 flex items-center justify-center">
            <div className="w-full max-w-xl">
              <img src="/text comp.png" alt="" aria-hidden="true" className="h-16 sm:h-16 lg:h-24 w-auto mb-5" />
              <h1 className="text-4xl sm:text-5xl xl:text-7xl font-bold leading-tight mb-5">
                סקר בשלות ואימוץ <span className="font-latin">AI</span> בארגונים
              </h1>
              <p className="text-lg text-[#1A1A1A]/80 leading-relaxed mb-5">
                בעידן שבו בינה מלאכותית משנה במהירות את הדרך שבה ארגונים פועלים, מתחרים ומייצרים ערך, היכולת לאמץ, להטמיע ולהרחיב שימוש ביכולות <span className="font-latin">AI</span> הופכת לגורם אסטרטגי מרכזי.
              </p>
              <p className="text-base text-[#6B7280] leading-relaxed mb-10">
                סקר זה נועד לבחון את מצב ה-<span className="font-latin">AI</span> בארגונים בישראל, את רמת המוכנות, האימוץ, ההשקעות, החסמים והתוכניות קדימה.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                <Link to={hasProgress ? `/q/${resumeIndex + 1}` : '/q/1'} className="btn-accent text-center text-base">
                  {hasProgress ? 'המשך מהמקום בו עצרת ←' : 'התחל סקר ←'}
                </Link>
                {hasProgress && (
                  <Link to="/q/1" className="btn-ghost text-center text-base">התחל מחדש ←</Link>
                )}
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E5E5] pt-6">
                כלל התשובות נשמרות באופן מקומי על המכשיר שלך וישמשו לצורכי מחקר וניתוח מצרפי בלבד.
                בכל שאלה, אנא בחר/י את האפשרות המשקפת בצורה המדויקת ביותר את המצב בארגון שלך כיום.
              </p>

              {/* TODO REMOVE: stakeholder preview — quick links to each summary level. */}
              <div className="mt-6 pt-4 border-t border-dashed border-[#E5E5E5]">
                <p className="text-xs text-[#6B7280] mb-2 font-latin">Preview summary pages (dev only):</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Link
                      key={n}
                      to={`/summary?level=${n}`}
                      className="btn-ghost text-sm font-latin"
                    >
                      L{n}
                    </Link>
                  ))}
                </div>
              </div>
              {/* END TODO REMOVE */}
            </div>
          </main>
        </section>
      </div>
    </>
  );
}
