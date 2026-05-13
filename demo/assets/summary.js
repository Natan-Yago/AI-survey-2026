// AI Survey — Personalized Summary
// Renders the archetype-specific summary page from a single shared template.
// Also exposes computeArchetype(answers) for the survey to bucket a respondent.
(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Stages (overall maturity ladder)
  // --------------------------------------------------------------------------
  const STAGES = [
    { id: 'explorer',     label: 'Explorer',     he: 'מתבונן' },
    { id: 'experimenter', label: 'Experimenter', he: 'ניסויי' },
    { id: 'scaler',       label: 'Scaler',       he: 'מתרחב' },
    { id: 'ai-native',    label: 'AI-Native',    he: 'AI-Native' },
  ];

  // --------------------------------------------------------------------------
  // Archetype content decks
  // --------------------------------------------------------------------------
  const ARCHETYPES = {
    'explorer': {
      nameHe: 'המתבונן',
      nameEn: 'The Explorer',
      stageId: 'explorer',
      pillarScores: { strategy: 28, people: 35, tech: 32, risk: 30 },
      benchmarkPct: 38,
      positioning:
        'הארגון שלכם בתחילת המסע. ה-AI מורגש בשיח, אך עדיין לא תורגם לאסטרטגיה ברורה, ליעדים מדידים או לתהליכי עבודה. זו דווקא נקודת פתיחה אסטרטגית — ניתן לבחור היכן AI ייצר את הערך הגדול ביותר, במקום לרדוף אחרי טרנדים.',
      implications: [
        'ללא חזון ברור ל-AI, יוזמות מבוזרות אינן מתכנסות לכיוון אחד וקשה למדוד החזר השקעה.',
        'הפער בין "לדבר AI" ל"לעשות AI" הולך וגדל — מתחרים שכבר התחילו צוברים יתרון מצטבר.',
        'הצעד הראשון אינו טכנולוגי אלא ניהולי: הגדרה היכן ה-AI יכול לחולל שינוי מהותי בליבת העסק.',
      ],
      fixGap: {
        eyebrow: 'סוגרים את הפער · אסטרטגיה',
        title: 'גיבוש אסטרטגיית AI מקיפה',
        desc: 'מתודולוגיה מובנית להגדרת תפקיד ה-AI בארגון, חזון, מיקודים עסקיים ומודל הפעלה ברור — מחזון לאבני דרך מדידות.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/Strategy.html',
      },
      amplify: {
        eyebrow: 'מרחיבים את השאיפה · אמנות האפשר',
        title: 'AI Use Cases — The Art of the Possible',
        desc: 'מסע חווייתי להנהלות לזיהוי הזדמנויות AI ייחודיות לארגון, באמצעות סדנאות אינטראקטיביות, הדגמות מתקדמות ומפגשים עם מומחים מובילים.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/Strategy.html',
      },
      experts: [
        { name: 'רותם דולב', role: 'AI Transformation Leader', email: 'rodolev@deloitte.co.il' },
        { name: 'אלי תדהר',  role: 'Strategy and Transaction Leader', email: 'etidhar@deloitte.co.il' },
      ],
    },

    'pilot-stuck': {
      nameHe: 'הניסויי שתקוע',
      nameEn: 'Pilot-Stuck Experimenter',
      stageId: 'experimenter',
      pillarScores: { strategy: 52, people: 48, tech: 38, risk: 45 },
      benchmarkPct: 47,
      positioning:
        'הארגון שלכם כבר מריץ פיילוטים והוכחות היתכנות, אך מעט מהם מגיעים לפרודקשן או מייצרים השפעה עסקית רחבה. הפער אינו בטכנולוגיה — הוא בארכיטקטורה, בדאטה ובמודל ההפעלה שמתרגם ניסוי לפעולה שוטפת.',
      implications: [
        'פיילוטים שלא מגיעים לסקייל הופכים מהר מאוד מהוכחת ערך לעלות שוקעת.',
        'תשתיות ענן ודאטה מקוטעות מאריכות מחזורי פיתוח ופוגעות באמינות המודלים.',
        'הזדמנות מיידית: הרחבת מספר מצומצם של פיילוטים מוצלחים לכלי עבודה ארגוניים שיוצרים ROI מדיד.',
      ],
      fixGap: {
        eyebrow: 'סוגרים את הפער · Data & AI',
        title: 'תשתיות דאטה ופלטפורמות AI',
        desc: 'הקמה והטמעה של AI Data Platforms (Databricks, Snowflake, GCP, Fabric) שמאפשרות מעבר מהיר ובטוח מפיילוט לפרודקשן.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/data-and-ai.html',
      },
      amplify: {
        eyebrow: 'מרחיבים את השאיפה · GenAI בפלטפורמות ארגוניות',
        title: 'הטמעת AI ו-Agents בפלטפורמות הליבה',
        desc: 'הפעלת סוכני AI חכמים על Salesforce, ServiceNow, SAP, Oracle ו-Google Cloud לערך עסקי מהיר ומדיד תוך שבועות, לא רבעונים.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/data-and-ai.html',
      },
      experts: [
        { name: 'גלית רוטשטיין', role: 'Partner, Deloitte Digital · Agentforce Leader', email: 'grotstein@deloitte.co.il' },
        { name: 'Tomer Gal',      role: "Deloitte's Global CTO · NVIDIA Alliance",       email: 'togal@deloitte.co.il' },
      ],
    },

    'workforce': {
      nameHe: 'המוביל-אנושי',
      nameEn: 'Workforce-First Adopter',
      stageId: 'experimenter',
      pillarScores: { strategy: 55, people: 32, tech: 58, risk: 50 },
      benchmarkPct: 29,
      positioning:
        'הטכנולוגיה והאסטרטגיה שלכם בשלות סבירה, אך החסם הקריטי הוא האדם: פערי מיומנויות, התנגדות לשינוי ותפקידים שלא עוצבו מחדש סביב ה-AI. בלי טרנספורמציה אנושית, גם ההשקעות הטכנולוגיות הטובות ביותר לא יממשו את הפוטנציאל.',
      implications: [
        'אימוץ נמוך בקרב עובדים לא טכנולוגיים מנטרל את ה-ROI של רישיונות וכלים שכבר נרכשו.',
        'תיאורי תפקידים ותהליכי עבודה שלא עודכנו יוצרים פערים בין מה שהמערכת מסוגלת לבין מה שהאדם עושה בפועל.',
        'הזדמנות: ארגון שמשקיע בהון האנושי יוצר יתרון תחרותי שמתחרים מתקשים להעתיק.',
      ],
      fixGap: {
        eyebrow: 'סוגרים את הפער · הון אנושי',
        title: 'AI Academy ותכנון מחדש של תפקידים',
        desc: 'הקמת אקדמיית AI ארגונית, מיפוי השתנות תפקידים באמצעות Workforce Analyzer, ובניית תרבות של AI-first mindset.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/human-capital.html',
      },
      amplify: {
        eyebrow: 'מרחיבים את השאיפה · ניהול שינוי',
        title: 'ניהול שינוי בתחום ה-AI',
        desc: 'מודל הפעלה תומך-שינוי, ממשל ומנהיגות, נרטיב ארגוני ותקשור פנים-ארגוני שהופכים התנגדות למעורבות.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/human-capital.html',
      },
      experts: [
        { name: 'עינבל נמיר',         role: 'AI Workforce Transformation Leader',     email: 'innamir@deloitte.co.il' },
        { name: 'ערן לכברג שנקמן',    role: 'Managing Director, Workforce Transformation', email: 'elachberg@deloitte.co.il' },
      ],
    },

    'cautious': {
      nameHe: 'הזהיר',
      nameEn: 'The Cautious / Risk-First',
      stageId: 'experimenter',
      pillarScores: { strategy: 50, people: 52, tech: 55, risk: 28 },
      benchmarkPct: 22,
      positioning:
        'הארגון מודע לפוטנציאל של AI אך מאט את הקצב מתוך חששות מוצדקים — פרטיות, רגולציה, הטיות והזיות. המתח בין "לזוז מהר" ל"לזוז בטוח" הוא בדיוק המקום שבו ממשל AI נכון הופך מנטל ליתרון תחרותי.',
      implications: [
        'ללא מסגרת ממשל, יישומי AI יוצרים חשיפה רגולטורית, אתית וסייברית שמצטברת בשקט.',
        'חששות ההנהלה מעכבים אישור use cases — ובתחומים מסוימים מוקפאים אפילו פיילוטים בעלי ערך מוכח.',
        'הזדמנות: ממשל AI יציב מאפשר תנועה מהירה יותר ולא איטית יותר, כי הוא מקצר זמני אישור והערכת סיכונים.',
      ],
      fixGap: {
        eyebrow: 'סוגרים את הפער · Risk & Trust',
        title: 'AI Governance · ממשל ובקרה',
        desc: 'AI Assurance, Bias & Fairness Audits, Explainability ו-Continuous Monitoring שמייצרים אמון פנים וחוץ-ארגוני.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/risk.html',
      },
      amplify: {
        eyebrow: 'מרחיבים את השאיפה · רגולציה ופרטיות',
        title: 'Regulatory Compliance & Data Privacy',
        desc: 'מעקב אחר רגולציות AI מתפתחות (EU AI Act, GDPR), בקרות פרטיות, ואסטרטגיית סייבר משולבת.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/risk.html',
      },
      experts: [
        { name: 'עקיבא ארליך', role: 'AI Risk Leader',                              email: 'akiehrlich@deloitte.co.il' },
        { name: 'ניר זאוברר',  role: 'Partner, Enterprise Risk & Regulatory Leader', email: 'nzauberer@deloitte.co.il' },
      ],
    },

    'scaler': {
      nameHe: 'המתרחב',
      nameEn: 'Scaler / AI-Native Builder',
      stageId: 'scaler',
      pillarScores: { strategy: 78, people: 72, tech: 80, risk: 70 },
      benchmarkPct: 14,
      positioning:
        'הארגון שלכם כבר מטמיע AI ברוחב ומשנה תהליכי ליבה. השלב הבא אינו "עוד פיילוט" אלא הפיכת ה-AI לרכיב מבני באסטרטגיה ובמודל ההפעלה — מעבר מ-AI as a tool ל-AI-Native enterprise.',
      implications: [
        'יתרון התחרותי הבא לא יבוא מעוד use case — אלא מעיצוב מחדש של הצעת הערך והמודל העסקי סביב AI ו-Agents.',
        'הסיכון העיקרי כעת הוא ניהול מורכבות: ריבוי סוכנים, ממשקים ופלטפורמות שדורשים ארכיטקטורה ארגונית מלוכדת.',
        'הזדמנות: מיצוב כ-leader בענף בארץ דרך נכסי AI ייחודיים ומודלי הפעלה אוטונומיים שאחרים עוד לא הגיעו אליהם.',
      ],
      fixGap: {
        eyebrow: 'מחדדים את הקצה · אסטרטגיה',
        title: 'Reimagine the Business',
        desc: 'מוצר Deloitte לדמיון מחדש של ליבת העסק בעידן ה-AI: הצעות ערך פורצות דרך, מודלי הפעלה אוטונומיים ובחירת מיקודים תחרותיים.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/Strategy.html',
      },
      amplify: {
        eyebrow: 'מרחיבים את השאיפה · Agentic AI בקנה מידה',
        title: 'תזמור Agentic AI בכל הארגון',
        desc: 'בנייה והפעלה של מערך סוכנים אוטונומיים מקצה לקצה, עם ממשל מתקדם ושותפויות NVIDIA, GCP, AWS ו-Salesforce.',
        url: 'https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte/data-and-ai.html',
      },
      experts: [
        { name: 'רותם דולב',     role: 'AI Transformation Leader',                          email: 'rodolev@deloitte.co.il' },
        { name: 'טובי כוכב',     role: "שותף · CTO חטיבת Consulting · Deloitte ישראל",     email: 'tkochav@deloitte.co.il' },
      ],
    },
  };

  const PILLAR_LABELS = {
    strategy: 'אסטרטגיה',
    people:   'הון אנושי',
    tech:     'טכנולוגיה ודאטה',
    risk:     'סיכונים וממשל',
  };

  // --------------------------------------------------------------------------
  // Scoring — pure function. Inputs are the survey answer codes; everything is
  // best-effort because not all answers are mandatory. Returns a deterministic
  // archetype + stage + pillar scores + service mapping.
  // --------------------------------------------------------------------------
  // `answers` is a flat object keyed by question id (e.g. q7_strategy: 3).
  // Values are 0..N indices into the option arrays of the source survey.
  function computeArchetype(answers) {
    const a = answers || {};

    // Q7 readiness: 0..4 → 0..100
    const r = (idx) => (typeof idx === 'number' ? clamp(idx, 0, 4) * 25 : 50);
    const q7 = {
      talent:   r(a.q7_talent),
      tech:     r(a.q7_tech),
      strategy: r(a.q7_strategy),
      risk:     r(a.q7_risk),
      data:     r(a.q7_data),
    };

    // Behaviour modifiers
    const q11Scale  = countAtLeast(a.q11, 2);   // functions at "scale" (idx 2)
    const q11Pilot  = countAtLeast(a.q11, 1);   // functions with pilots or scale
    const q12Pct    = pickPct(a.q12_today);     // 0..100
    const q15Conf   = (typeof a.q15 === 'number' ? clamp(a.q15, 0, 4) : 2) * 20;
    const q17Trans  = (typeof a.q17 === 'number' ? clamp(a.q17, 0, 4) : 1);
    const q18Risks  = Array.isArray(a.q18) ? a.q18.length : 0;
    const q19Reshape = (typeof a.q19 === 'number' ? clamp(a.q19, 0, 4) : 0);
    const q22       = a.q22; // index of dominant challenge
    const q23Count  = Array.isArray(a.q23) ? a.q23.length : 0;
    const q26GenAI  = (typeof a.q26 === 'number' ? clamp(a.q26, 0, 4) : 1);
    const q29Gov    = (typeof a.q29 === 'number' ? clamp(a.q29, 0, 4) : 0) * 25;

    // Pillar scores (clamped 0..100)
    const strategy = clamp(0.5 * q7.strategy + 8 * q17Trans + 4 * q26GenAI, 0, 100);
    const people   = clamp(0.6 * q7.talent   + 5 * q19Reshape + 3 * q23Count - (q22 === 0 || q22 === 1 ? 15 : 0), 0, 100);
    const tech     = clamp(0.4 * (q7.tech + q7.data) / 2 + 0.4 * q15Conf + 0.4 * q12Pct + 4 * q11Scale, 0, 100);
    const risk     = clamp(0.6 * q7.risk + 0.4 * q29Gov - 5 * q18Risks, 0, 100);

    const pillarScores = { strategy, people, tech, risk };
    const avg = (strategy + people + tech + risk) / 4;

    // Stage
    let stageId;
    if      (avg < 35 || (q11Pilot === 0 && q11Scale === 0))                                          stageId = 'explorer';
    else if (avg >= 75 && q17Trans >= 3 && q26GenAI >= 3)                                             stageId = 'ai-native';
    else if (avg >= 55 && q11Scale >= 2 && q17Trans >= 2)                                             stageId = 'scaler';
    else                                                                                              stageId = 'experimenter';

    // Archetype priority rules (first match wins)
    const lowestPillar = Object.entries(pillarScores).sort((x, y) => x[1] - y[1])[0][0];
    let archetypeId;
    if (stageId === 'ai-native' || stageId === 'scaler')                            archetypeId = 'scaler';
    else if (lowestPillar === 'risk' && q18Risks >= 2)                              archetypeId = 'cautious';
    else if (lowestPillar === 'people' || q22 === 0 || q22 === 1)                   archetypeId = 'workforce';
    else if (stageId === 'experimenter' && q12Pct <= 30)                            archetypeId = 'pilot-stuck';
    else                                                                            archetypeId = 'explorer';

    return { archetypeId, stageId, pillarScores, lowestPillar };
  }

  function countAtLeast(arr, threshold) {
    if (!Array.isArray(arr)) return 0;
    return arr.filter((v) => typeof v === 'number' && v >= threshold).length;
  }
  function pickPct(idx) {
    // q12 column index → percentage; index 0 = "n/a", 1 = 0%, 2 = 10%, ...
    if (typeof idx !== 'number' || idx < 1) return 0;
    return clamp((idx - 1) * 10, 0, 100);
  }
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  // --------------------------------------------------------------------------
  // Renderer
  // --------------------------------------------------------------------------
  function render(root, archetypeId) {
    const data = ARCHETYPES[archetypeId] || ARCHETYPES.explorer;
    const stage = STAGES.find((s) => s.id === data.stageId) || STAGES[0];
    const stageIndex = STAGES.indexOf(stage);

    root.innerHTML = `
      ${renderHero(data, stage)}
      ${renderMaturity(data, stageIndex)}
      ${renderBenchmark(data, stage)}
      ${renderImplications(data)}
      ${renderRecommendations(data)}
      ${renderGifts(data)}
      ${renderExperts(data)}
      ${renderFootNote()}
    `;
  }

  function renderHero(data, stage) {
    return `
      <section class="summary-hero">
        <div class="mb-7">
          <div class="flex items-center justify-between gap-5 text-xs text-muted mb-2">
            <span class="min-w-0 truncate">סיכום הסקר</span>
            <span class="font-latin whitespace-nowrap">100%</span>
          </div>
          <div class="progress-track rounded-full">
            <div class="progress-fill rounded-full" style="width:100%"></div>
          </div>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold leading-snug mb-3">
          התוצאה שלך: ${data.nameHe}
        </h1>
        <p class="text-sm text-muted leading-relaxed mb-6">
          לפי התשובות שלך, הארגון נמצא בשלב <span class="font-semibold text-ink">${stage.he}</span> במסע ה-<span class="font-latin">AI</span>.
          הנה התמונה המרכזית שעלתה מהסקר.
        </p>
        <div class="summary-answer option-card surface-card w-full text-start p-4 sm:p-5 bg-[#FEFFFB]/95">
          <span class="summary-answer-marker" aria-hidden="true"></span>
          <p>${data.positioning}</p>
        </div>
      </section>
    `;
  }

  function renderMaturity(data, stageIndex) {
    const pillars = ['strategy', 'people', 'tech', 'risk'];
    const lowest = Object.entries(data.pillarScores).sort((a, b) => a[1] - b[1])[0][0];
    const bars = pillars.map((p) => {
      const score = Math.round(data.pillarScores[p]);
      const isWeak = p === lowest;
      return `
        <div class="pillar-row">
          <div class="pillar-row-head">
            <span class="pillar-label">${PILLAR_LABELS[p]}${isWeak ? ' <span class="pillar-tag">פער מרכזי</span>' : ''}</span>
            <span class="pillar-score font-latin">${score}</span>
          </div>
          <div class="pillar-track"><div class="pillar-fill${isWeak ? ' is-weak' : ''}" style="width:${score}%"></div></div>
        </div>
      `;
    }).join('');

    const stageDots = STAGES.map((s, i) => {
      const state = i < stageIndex ? 'past' : i === stageIndex ? 'current' : 'future';
      return `
        <div class="stage-step is-${state}">
          <span class="stage-dot"></span>
          <span class="stage-step-label font-latin">${s.label}</span>
        </div>
      `;
    }).join('<span class="stage-line"></span>');

    return `
      <section class="summary-section">
        <div class="summary-section-head">
          <h2 class="summary-section-title">תמונת בשלות לפי תחום</h2>
          <p class="summary-section-sub">כך התשובות שלך מתורגמות לארבעת מימדי המוכנות המרכזיים.</p>
        </div>
        <div class="pillar-list">${bars}</div>
        <div class="stage-progress" aria-label="שלב כללי במסע ה-AI">
          ${stageDots}
        </div>
      </section>
    `;
  }

  function renderBenchmark(data, stage) {
    return `
      <section class="summary-section">
        <div class="option-card surface-card summary-benchmark bg-[#FEFFFB]/95">
          <div class="benchmark-figure">
          <span class="benchmark-num font-latin">${data.benchmarkPct}%</span>
          </div>
          <div>
            <div class="benchmark-eyebrow">השוואה ענפית · נתון לדוגמה</div>
            <p class="benchmark-text">
              <span class="font-latin">${data.benchmarkPct}%</span> מהארגונים בישראל בגודל ובענף דומה לשלכם נמצאים בשלב <span class="font-semibold">${stage.he}</span>.
              הנתון יוחלף בערך אמיתי עם פרסום דוח <span class="font-latin">Deloitte State of AI · ישראל 2026</span>.
            </p>
          </div>
        </div>
      </section>
    `;
  }

  function renderImplications(data) {
    const items = data.implications.map((t, index) => `
      <li class="option-card surface-card implication-item bg-[#FEFFFB]/95">
        <span class="kbd-badge font-latin" aria-hidden="true">${index + 1}</span>
        <span>${t}</span>
      </li>
    `).join('');
    return `
      <section class="summary-section">
        <div class="summary-section-head">
          <h2 class="summary-section-title">מה זה אומר עבורכם</h2>
          <p class="summary-section-sub">שלוש נקודות שכדאי לקחת מהתוצאה.</p>
        </div>
        <ul class="implication-list">${items}</ul>
      </section>
    `;
  }

  function renderRecommendations(data) {
    const card = (rec, kind) => `
      <a href="${rec.url}" target="_blank" rel="noopener" class="option-card surface-card rec-card rec-card--${kind} bg-[#FEFFFB]/95">
        <div class="rec-eyebrow">${rec.eyebrow}</div>
        <h3 class="rec-title">${rec.title}</h3>
        <p class="rec-desc">${rec.desc}</p>
        <span class="rec-link">למידע נוסף ←</span>
      </a>
    `;
    return `
      <section class="summary-section">
        <div class="summary-section-head">
          <h2 class="summary-section-title">שני צעדים מומלצים</h2>
          <p class="summary-section-sub">אחד לסגירת הפער המרכזי, ואחד להמשך האצה.</p>
        </div>
        <div class="rec-grid">
          ${card(data.fixGap, 'fix')}
          ${card(data.amplify, 'amplify')}
        </div>
      </section>
    `;
  }

  function renderGifts(data) {
    return `
      <section class="summary-section summary-gifts">
        <div class="summary-section-head">
          <h2 class="summary-section-title">אפשר להמשיך מכאן</h2>
          <p class="summary-section-sub">בחר/י את הדרך שנוחה לך להמשך.</p>
        </div>
        <div class="gift-grid">
          <button type="button" class="option-card surface-card gift-card bg-[#FEFFFB]/95" data-action="print">
            <span class="gift-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </span>
            <span class="gift-title">סיכום אישי להורדה</span>
            <span class="gift-desc">קובץ <span class="font-latin">PDF</span> מותאם של עמוד זה לשיתוף פנים-ארגוני.</span>
          </button>

          <a class="option-card surface-card gift-card bg-[#FEFFFB]/95" href="https://info.deloitte.co.il/Own-Tomorrow-Today.html" target="_blank" rel="noopener">
            <span class="gift-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </span>
            <span class="gift-title">סדנת <span class="font-latin">Art of the Possible</span></span>
            <span class="gift-desc">מפגש קצר עם מומחי <span class="font-latin">Deloitte</span> לזיהוי הזדמנויות <span class="font-latin">AI</span> ייחודיות לארגון שלכם.</span>
          </a>

          <button type="button" class="option-card surface-card gift-card bg-[#FEFFFB]/95" data-action="notify">
            <span class="gift-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v4H3z"/><path d="M5 7v13h14V7"/><path d="M9 12h6"/></svg>
            </span>
            <span class="gift-title">דוח <span class="font-latin">State of AI · ישראל 2026</span></span>
            <span class="gift-desc">קבלו עדכון מוקדם כשהדוח המלא יפורסם, עם בנצ'מרקים אמיתיים לפי ענף.</span>
          </button>
        </div>
      </section>
    `;
  }

  function renderExperts(data) {
    const items = data.experts.map((e) => `
      <div class="option-card surface-card expert-card bg-[#FEFFFB]/95">
        <div class="expert-avatar" aria-hidden="true">${initials(e.name)}</div>
        <div class="expert-meta">
          <div class="expert-name">${e.name}</div>
          <div class="expert-role">${e.role}</div>
          <a class="expert-mail font-latin" href="mailto:${e.email}">${e.email}</a>
        </div>
      </div>
    `).join('');
    return `
      <section class="summary-section">
        <div class="summary-section-head">
          <h2 class="summary-section-title">עם מי אפשר לדבר</h2>
          <p class="summary-section-sub">מובילי התחום הרלוונטי בישראל.</p>
        </div>
        <div class="expert-grid">${items}</div>
      </section>
    `;
  }

  function renderFootNote() {
    return `
      <p class="summary-footnote">
        סיכום זה הופק אוטומטית על בסיס תשובותיכם בסקר. הנתונים נשמרים אנונימית.
        להרחבה על שירותי <span class="font-latin">Deloitte</span> לקראת עידן ה-<span class="font-latin">AI</span>:
        <a class="underline" target="_blank" rel="noopener" href="https://www.deloitte.com/il/he/what-we-do/Own-Tomorrow-With-Deloitte.html">Own Tomorrow With Deloitte</a>.
      </p>
    `;
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('');
  }

  // --------------------------------------------------------------------------
  // Demo switcher (?demo=1)
  // --------------------------------------------------------------------------
  function maybeRenderDemoSwitcher(currentId) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') !== '1') return;
    const bar = document.createElement('div');
    bar.className = 'demo-switcher';
    const links = Object.keys(ARCHETYPES).map((id) => {
      const file = `summary-${id}.html?demo=1`;
      const active = id === currentId ? ' is-active' : '';
      return `<a class="demo-link${active}" href="${file}">${ARCHETYPES[id].nameHe}</a>`;
    }).join('');
    bar.innerHTML = `<span class="demo-label">Demo · החלף ארכיטיפ:</span>${links}`;
    document.body.prepend(bar);
  }

  // --------------------------------------------------------------------------
  // Boot
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#summary-root');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const archetypeId =
      params.get('archetype') ||
      root.dataset.archetype ||
      sessionStorage.getItem('archetypeId') ||
      'explorer';

    render(root, archetypeId);
    maybeRenderDemoSwitcher(archetypeId);

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      if (target.dataset.action === 'print') {
        window.print();
      } else if (target.dataset.action === 'notify') {
        const mail = 'il-stateofai@deloitte.co.il';
        window.location.href = `mailto:${mail}?subject=${encodeURIComponent('הוסיפו אותי לרשימת התפוצה של דוח State of AI ישראל 2026')}`;
      }
    });
  });

  // Expose for the survey runtime to bucket a respondent.
  window.SurveySummary = { computeArchetype, ARCHETYPES, STAGES };
})();
