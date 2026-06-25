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
      <div className="welcome-layout min-h-screen w-full grid grid-cols-1 lg:grid-cols-2" dir="ltr">
        <aside className="welcome-image-col relative hidden lg:block bg-[#0F0F0F] overflow-hidden" dir="rtl">
          <img src={assetUrl('new-hero-image.jpg')} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
          <Link to="/" className="absolute top-8 left-8 z-10 inline-flex" aria-label="Deloitte">
            <img src={assetUrl('Deloitte-Master-Logo-Black-RGB.png')} alt="Deloitte" className="h-20 w-auto" />
          </Link>
          <div className="absolute bottom-8 right-8 left-8 text-white" dir="rtl">
            <p className="text-white/85 text-sm max-w-sm leading-relaxed">
              מפת הבשלות והאימוץ של בינה מלאכותית בארגונים בישראל.
            </p>
          </div>
        </aside>

        <section className="welcome-content-col flex flex-col min-h-screen" dir="rtl">
          <main className="welcome-main flex-1 px-6 sm:px-10 lg:px-14 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:py-16 flex items-center justify-center">
            <div className="w-full max-w-xl">
              <img src={assetUrl('text comp.png')} alt="" aria-hidden="true" className="h-16 sm:h-16 lg:h-24 w-auto mb-5" />
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
            </div>
          </main>
        </section>
      </div>
    </>
  );
}
