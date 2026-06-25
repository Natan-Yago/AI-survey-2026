import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAnswers } from '../state/AnswersContext';

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

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
      <Link to="/" className="welcome-mobile-logo fixed top-5 left-5 z-20 inline-flex lg:hidden" aria-label="Deloitte">
        <img src={assetUrl('Deloitte-Master-Logo-Black-RGB.png')} alt="Deloitte" className="h-12 sm:h-14 w-auto" />
      </Link>
      <div className="welcome-layout min-h-screen w-full grid grid-cols-1" dir="ltr">
        <aside className="welcome-image-col relative hidden lg:flex bg-[#74E796] overflow-hidden items-center justify-center" dir="rtl">
          <img src={assetUrl('new-hero-image.jpg')} alt="" className="w-full h-full object-contain" />
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 lg:mb-5 xl:mb-6">
                <Link to={hasProgress ? `/q/${resumeIndex + 1}` : '/q/1'} className="btn-accent text-center text-base">
                  {hasProgress ? 'המשך מהמקום בו עצרת ←' : 'התחל סקר ←'}
                </Link>
                {hasProgress && (
                  <Link to="/q/1" className="btn-ghost text-center text-base">התחל מחדש ←</Link>
                )}
              </div>
              <p className="text-sm lg:text-xs xl:text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E5E5] pt-6 lg:pt-4 xl:pt-5">
                כלל התשובות נשמרות באופן מקומי על המכשיר שלך וישמשו לצורכי מחקר וניתוח מצרפי בלבד.
                בכל שאלה, אנא בחר/י את האפשרות המשקפת בצורה המדויקת ביותר את המצב בארגון שלך כיום.
              </p>
            </div>
          </main>
        </section>
      </div>
    </>
  );
}
