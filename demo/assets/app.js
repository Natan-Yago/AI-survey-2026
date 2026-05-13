// AI Survey — shared interactivity (design phase only)
// Static demo rendering, selection toggling, keyboard shortcuts, and progress.

(function () {
  const surveyQuestions = [
    {
      section: 'חלק ראשון: דמוגרפיה',
      type: 'single',
      title: 'רמת מעורבות בהחלטות AI',
      question: 'מהי רמת המעורבות שלך בקבלת החלטות הנוגעות לאסטרטגיית AI ודאטה, השקעות, גישת יישום ומדידת ערך בארגון?',
      instructions: 'בחר/י את האפשרות המתארת בצורה הטובה ביותר את רמת המעורבות שלך.',
      options: [
        'כלל לא מעורב/ת בתהליך קבלת ההחלטות',
        'מודע/ת לתהליך קבלת ההחלטות אך לא משפיע/ה על ההחלטות',
        'משפיע/ה על קבלת ההחלטות אך לא חלק מצוות קבלת ההחלטות',
        'חלק מצוות שמקבל החלטות אלו',
        'מקבל/ת ההחלטות הסופי/ת',
        'מנהל/ת או מפקח/ת על יישומי טכנולוגיות AI',
      ],
    },
    {
      section: 'חלק ראשון: דמוגרפיה',
      type: 'single',
      title: 'מחזור הכנסות שנתי',
      question: 'מהו היקף ההכנסות השנתי המשוער של הארגון שלך?',
      instructions: 'בחר/י את הטווח המתאים ביותר. הטווחים הותאמו לסדרי גודל של חברות בישראל.',
      options: [
        'Pre-revenue / ללא הכנסות משמעותיות עדיין',
        'פחות מ-10 מיליון ש״ח',
        '10-50 מיליון ש״ח',
        '50-200 מיליון ש״ח',
        '200 מיליון - 1 מיליארד ש״ח',
        '1-5 מיליארד ש״ח',
        'מעל 5 מיליארד ש״ח',
        'לא יודע/ת / לא ניתן למסור',
      ],
    },
    {
      section: 'חלק ראשון: דמוגרפיה',
      type: 'single',
      title: 'מספר עובדים',
      question: 'כמה עובדים במשרה מלאה מועסקים בארגון שלך, בקירוב?',
      instructions: 'בחר/י את הטווח המתאים ביותר להיקף כוח האדם בארגון.',
      options: [
        'עד 50 עובדים',
        '51-200 עובדים',
        '201-500 עובדים',
        '501-1,000 עובדים',
        '1,001-5,000 עובדים',
        'מעל 5,000 עובדים',
        'לא יודע/ת / לא ניתן למסור',
      ],
    },
    {
      section: 'חלק ראשון: דמוגרפיה',
      type: 'single',
      title: 'תחום עיסוק',
      question: 'איזו מהאפשרויות הבאות מתארת בצורה הטובה ביותר את היחידה העסקית שאתה משתייך אליה?',
      instructions: 'בחר/י אפשרות אחת.',
      options: [
        'הנהלה / ניהול כללי',
        'כספים',
        'משאבי אנוש',
        'שיווק / פרסום',
        'תפעול',
        'רכש',
        'פיתוח מוצר',
        'הנדסה',
        'מחקר ופיתוח',
        'סיכונים / ציות / רגולציה',
        'מכירות',
        'אסטרטגיה',
        'טכנולוגיה / IT / סייבר',
        'דאטה / Data Science',
        'מחסנים / תחבורה / לוגיסטיקה',
        'שרשרת אספקה / ניהול ביקושים',
        'שותפויות / פיתוח עסקי',
        'ייצור',
        'אחר - נא לפרט',
      ],
    },
    {
      section: 'חלק ראשון: דמוגרפיה',
      type: 'single',
      title: 'תפקיד בארגון',
      question: 'מה תפקידך בארגון?',
      instructions: 'בחר/י אפשרות אחת.',
      options: [
        'חבר דירקטוריון',
        'מנכ"ל',
        'סמנכל תפעול COO',
        'סמנכ"ל כספים CFO',
        'סמנכ"ל מערכות מידע CIO',
        'סמנכ"ל טכנולוגיה CTO',
        'סמנכ"ל שיווק CMO',
        'סמנכ"ל אסטרטגיה / פיתוח עסקי CSO',
        'סמנכ"ל משאבי אנוש CHRO',
        'סמנכ"ל טרנספורמציה',
        'סמנכ"ל אחר - אנא פרט',
        'VP',
        'EVP',
        'SVP',
        'דירקטור',
        'מנהל / מנהל בכיר',
        'אחר',
      ],
    },
    {
      section: 'חלק ראשון: דמוגרפיה',
      type: 'single',
      title: 'ענף פעילות הארגון',
      question: 'איזו מהאפשרויות הבאות מתארת בצורה הטובה ביותר את הענף שבו פועל הארגון שלך?',
      instructions: 'בחר/י אפשרות אחת.',
      options: [
        'מוצרי צריכה',
        'קמעונאות',
        'סיטונאות והפצה',
        'תחבורה, תעופה ולוגיסטיקה',
        'מלונאות ואירוח',
        'מסעדנות ושירותי מזון',
        'רכב',
        'מוצרים תעשייתיים, תעשייה ובנייה',
        'חשמל, תשתיות ואנרגיות מתחדשות',
        'אנרגיה וכימיקלים',
        'בנקאות ושוק ההון',
        'ביטוח',
        'ניהול השקעות / Private Equity',
        'נדל״ן',
        'בריאות ומדעי החיים',
        'טכנולוגיה / הייטק',
        'תקשורת מדיה ובידור',
        'מגזר ציבורי / ממשלתי',
        'אחר - נא לפרט',
      ],
    },
    {
      section: 'בשלות ואימוץ AI',
      type: 'matrix-single',
      title: 'פוטנציאל טרנספורמטיבי של סוגי AI',
      question: 'מתי, אם בכלל, סוגי ה-AI הבאים צפויים לחולל שינוי מהותי בארגון שלך?',
      instructions: 'שינוי מהותי פירושו מצב שבו יותר מ-25% מתהליכי הליבה העסקיים נשענים על סוג AI זה או משלבים אותו, או שקטגוריות עבודה שלמות הוחלפו או עוצבו מחדש כתוצאה ממנו. בחר/י תשובה אחת בכל שורה.',
      rows: [
        'Generative AI - מערכות היוצרות טקסט, תמונות ותוכן אחר על בסיס הנחיות, או מערכות המזהות דפוסים, מבצעות תחזיות ותומכות בקבלת החלטות',
        'Agentic AI - מערכות המסוגלות לפעול באופן אוטונומי לביצוע חלקים מתהליך מורכב או כולו',
      ],
      columns: ['כבר קורה כיום', 'פחות משנה', '1-3 שנים', 'מעל 3 שנים', 'לעולם לא'],
    },
    {
      section: 'בשלות ואימוץ AI',
      type: 'matrix-single',
      title: 'רמת מוכנות לאימוץ AI',
      question: 'עבור כל אחד מהתחומים הבאים, דרג/י את רמת המוכנות של הארגון לאימוץ רחב של כלי ויישומי AI.',
      instructions: 'בחר/י תשובה אחת בכל שורה.',
      rows: ['טאלנט', 'תשתיות טכנולוגיות', 'אסטרטגיה - תפיסה סדורה, אסטרטגיית AI, מודל הפעלה', 'סיכונים וממשל', 'ניהול דאטה'],
      columns: ['כלל לא מוכן', 'מוכן במידה מועטה', 'מוכן במידה בינונית', 'מוכן במידה גבוהה', 'מוכן במידה גבוהה מאוד'],
    },
    {
      section: 'בשלות ואימוץ AI',
      type: 'single',
      title: 'שינוי צפוי בהשקעות AI',
      question: 'כיצד את/ה מצפה שההשקעה של הארגון בטכנולוגיות AI תשתנה בשנת הכספים הקרובה?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['ירידה משמעותית - 20% או יותר', 'ירידה מסוימת - ירידה של 6%-19%', 'תישאר ברובה ללא שינוי - בין ירידה של 5% לעלייה של 5%', 'עלייה מסוימת - עלייה של 6%-20%', 'עלייה משמעותית - מעל 20%', 'לא יודע/ת / לא בטוח/ה'],
    },
    {
      section: 'בשלות ואימוץ AI',
      type: 'matrix-single',
      title: 'רמת אימוץ AI לפי פונקציה',
      question: 'מהי רמת האימוץ הנוכחית של AI בארגון שלך בתחומים הבאים?',
      instructions: 'אם הפונקציה אינה רלוונטית לארגון שלך, בחר/י "אין תכניות ליישום".',
      rows: ['שיווק, מכירות ושירות לקוחות', 'כספים', 'משפטי, סיכונים וציות', 'משאבי אנוש', 'IT / סייבר', 'אסטרטגיה ותפעול', 'שרשרת אספקה / ייצור', 'פיתוח מוצר / מחקר ופיתוח'],
      columns: ['אין תכניות ליישום', 'פיילוטים / ניסויים', 'יישום בקנה מידה רחב'],
    },
    {
      section: 'בשלות ואימוץ AI',
      type: 'single',
      title: 'גישה לכלי AI מאושרים',
      question: 'איזה שיעור מכוח האדם הכולל בארגון, להערכתך, מחזיק בגישה לכלי או יישומי AI מאושרים לשימוש?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['מעל 80%', '61%-80%', '41%-60%', '21%-40%', 'פחות מ-20%', 'לא יודע/ת / לא בטוח/ה'],
    },
    {
      section: 'בשלות ואימוץ AI',
      type: 'single',
      title: 'שימוש יומיומי בכלי AI',
      question: 'מתוך העובדים בארגון שיש להם גישה לכלי או יישומי AI, איזה אחוז משתמשים בכלים אלו ביום-יום כחלק מתהליך העבודה שלהם?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['פחות מ-20%', '21%-40%', '41%-60%', '61%-80%', 'מעל 80%', 'לא יודע/ת / לא בטוח/ה'],
    },
    {
      section: 'בשלות ואימוץ AI',
      type: 'matrix-single',
      title: 'מעבר מניסויים לפרודקשן',
      question: 'להערכתך, איזה אחוז מניסויי ה-AI בארגון, כגון פיילוטים ו-POC, הועברו או יועברו לסביבת פרודקשן?',
      instructions: 'בחר/י אחוז אחד בכל שורה.',
      rows: ['עד היום', 'במהלך שלושת עד ששת החודשים הקרובים'],
      columns: ['לא יודע/ת / לא רלוונטי', '0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
    },
    {
      section: 'בשלות ואימוץ AI',
      type: 'matrix-multi',
      title: 'חסמים לאימוץ AI',
      question: 'מהם הגורמים המרכזיים, אם בכלל, שמעכבים את הארגון בפיתוח ובהטמעת כלי או יישומי AI?',
      instructions: 'בחר/י עד 3 חסמים עבור כל סוג AI.',
      maxPerColumn: 3,
      rows: ['עלויות / משאבים נדרשים', 'חוסר מחויבות הנהלה / הנהלה בכירה', 'קושי בזיהוי use cases', 'בעיות זמינות טכנולוגיה או דאטה', 'פערי טאלנט או כישורים', 'חששות ממשל, סיכונים או ציות', 'אחר - נא לפרט'],
      columns: ['AI & GenAI', 'Agentic AI'],
    },
    {
      section: 'השקעות, תשתיות וערך',
      type: 'multi',
      title: 'עדיפויות השקעה ב-IT לתמיכה בסקייל AI',
      question: 'אילו רכיבים ב-enterprise stack הארגוני מקבלים עדיפות להשקעה כדי לתמוך בסקייל של AI?',
      instructions: 'בחר/י עד 3 אפשרויות.',
      maxSelections: 3,
      options: ['תשתיות חישוב ויכולת סקייל', 'אחסון וניהול דאטה', 'פלטפורמות וכלי AI/ML', 'בקרות אבטחת מידע וציות', 'אינטגרציה, APIs, DevOps וצינורות אוטומציה', 'הכשרת עובדים וכלי שיתוף פעולה', 'אחר - נא לפרט'],
    },
    {
      section: 'השקעות, תשתיות וערך',
      type: 'single',
      title: 'ביטחון ביכולת התשתיות הקיימות',
      question: 'עד כמה את/ה בטוח/ה ביכולת התשתיות הנוכחיות של הארגון להתמודד עם דרישות AI עתידיות?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['כלל לא בטוח/ה - יש לנו חששות משמעותיים לגבי יכולת התשתיות להתמודד עם דרישות AI עתידיות', 'בטוח/ה במידה מועטה - קיימת רמת ביטחון מסוימת אך יש מספר תחומים הדורשים שיפור', 'בטוח/ה במידה בינונית - התשתיות יוכלו להתמודד עם הדרישות העתידיות בכפוף לשדרוגים והתאמות', 'בטוח/ה מאוד - התשתיות מוכנות היטב לדרישות AI עתידיות', 'בטוח/ה לחלוטין - התשתיות יכולות להתמודד עם כל דרישת AI עתידית ללא בעיות משמעותיות'],
    },
    {
      section: 'השקעות, תשתיות וערך',
      type: 'matrix-multi',
      title: 'תועלות מצופות ותועלות מושגות מ-AI',
      question: 'בהתייחס לתועלות מיוזמות ה-AI בארגון: אילו תועלות אתם מקווים להשיג ואילו תועלות אתם משיגים כיום?',
      instructions: 'ניתן לבחור את כל האפשרויות הרלוונטיות בכל עמודה.',
      rows: ['שיפור יעילות ופרודוקטיביות', 'הפחתת עלויות', 'הגדלת הכנסות', 'שיפור מוצרים / שירותים ועידוד חדשנות', 'שיפור קשרי לקוחות / לקוחות קצה', 'שיפור קבלת החלטות ותובנות מבוססות דאטה', 'אחר - נא לפרט'],
      columns: ['תועלות שמושגות כיום', 'תועלות שמקווים להשיג בעתיד'],
    },
    {
      section: 'השקעות, תשתיות וערך',
      type: 'single',
      title: 'גישה לטרנספורמציית תהליכים ביישום AI',
      question: 'איזו אפשרות מתארת בצורה הטובה ביותר את הגישה הנוכחית של הארגון לטרנספורמציית תהליכים בעת יישום AI?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['הארגון מטמיע AI כפי שהוא, לצורך אוטומציה של משימות קיימות, ללא שינויי תהליך העבודה', 'הארגון משלב AI בתהליכים קיימים עם התאמות או אופטימיזציות מינוריות בלבד', 'הארגון מעצב מחדש מספר תהליכי מפתח סביב AI, תוך שמירה על המודל העסקי הכללי', 'הארגון משתמש ב-AI ליצירת מוצרים או שירותים חדשים ולעיצוב מחדש של תהליכי ליבה רבים', 'הארגון משתמש ב-AI כדי להמציא מחדש באופן מהותי גם את תהליכי הליבה וגם את המודל העסקי הרחב'],
    },
    {
      section: 'סיכונים, ממשל וכוח אדם',
      type: 'multi',
      title: 'סיכוני AI מרכזיים',
      question: 'אילו מהסיכונים הבאים הקשורים לכלי או יישומי AI מדאיגים ביותר את הארגון?',
      instructions: 'בחר/י עד 3 סיכונים.',
      maxSelections: 3,
      options: ['פרטיות ו/או אבטחת מידע', 'ציות משפטי, קניין רוחני או רגולציה', 'איכות מודלים, עקביות ויכולת הסבר', 'יכולות ממשל ובקרה', 'השפעה על כוח האדם, למשל צמצום משרות', 'אחר - נא לפרט', 'אין לנו חששות לגבי סיכונים פוטנציאליים של AI'],
    },
    {
      section: 'סיכונים, ממשל וכוח אדם',
      type: 'single',
      title: 'עיצוב מחדש של תפקידים סביב AI',
      question: 'באיזו מידה הארגון עיצב מחדש תפקידים סביב יכולות AI?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['כלל לא - הארגון לא עיצב מחדש תפקידים סביב יכולות AI', 'במידה מינימלית - נעשו שינויים מינימליים בתפקידים כדי לשלב יכולות AI', 'במידה בינונית - מספר תפקידים עוצבו מחדש במידה בינונית כדי למנף יכולות AI', 'במידה נרחבת - תפקידים רבים עוצבו מחדש בהיקף נרחב כדי לשלב יכולות AI', 'באופן מלא - רוב התפקידים עוצבו מחדש סביב יכולות AI'],
    },
    {
      section: 'סיכונים, ממשל וכוח אדם',
      type: 'single',
      title: 'השפעה צפויה על פרודוקטיביות',
      question: 'כיצד את/ה מצפה שהפרודוקטיביות של הארגון תשתנה בעקבות שימוש נרחב בכלי או יישומי AI?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['ירידה משמעותית', 'ירידה מסוימת', 'ללא שינוי', 'עלייה מסוימת', 'עלייה משמעותית'],
    },
    {
      section: 'סיכונים, ממשל וכוח אדם',
      type: 'matrix-column-single',
      title: 'אוטומציה מלאה של משרות',
      question: 'איזה אחוז מהמשרות בארגון את/ה מצפה שיהיו אוטומטיות לחלוטין?',
      instructions: 'בחר/י שורה אחת עבור כל טווח זמן.',
      rows: ['פחות מ-10%', '10%-25%', '26%-50%', '51%-75%', '76%-100%'],
      columns: ['בתוך שנה', 'בתוך שלוש שנים', 'בתוך עשר שנים'],
    },
    {
      section: 'סיכונים, ממשל וכוח אדם',
      type: 'single',
      title: 'אתגר מרכזי בשילוב AI בתפקידים ובתהליכי עבודה',
      question: 'מהו האתגר המרכזי שהארגון מתמודד איתו בשילוב AI בתפקידים ובתהליכי עבודה?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['מחסור בכישורים ובידע בתחום AI', 'התנגדות לשינוי', 'עלויות יישום גבוהות', 'תשתיות טכנולוגיות לא מספקות', 'סוגיות רגולציה וציות'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'multi',
      title: 'התאמות באסטרטגיית טאלנט בעקבות AI',
      question: 'כיצד הארגון מתאים את אסטרטגיות הטאלנט שלו בעקבות אימוץ כלי או יכולות AI?',
      instructions: 'בחר/י את כל האפשרויות הרלוונטיות.',
      options: ['עיצוב ויישום אסטרטגיות upskilling ו-reskilling', 'הדרכת כלל העובדים להעלאת רמת האוריינות והשטף ב-AI', 'מתן תמריצים מבוססי ביצועים לשימוש ב-AI', 'בחינת שינויים צפויים בהיצע ובביקוש לכישורים', 'עיצוב מחדש של מסלולי קריירה וניידות קריירה', 'בחינת יעדי גיוס וגיוס טאלנט מומחה להובלת יוזמות AI', 'שינוי האיזון בין עובדים במשרה מלאה, עובדים חוזיים ועובדי gig', 'שילוב או עיצוב מחדש של ארגונים/יחידות על בסיס דפוסי עבודה חדשים הנובעים משימוש ב-AI', 'מדידת אמון ומעורבות עובדים'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'single',
      title: 'שינוי צפוי במספר העובדים',
      question: 'איזו מהאפשרויות הבאות מתארת בצורה הטובה ביותר את השינוי במספר העובדים במשרה מלאה שאת/ה צופה ב-12 החודשים הקרובים כתוצאה מיישום אסטרטגיית ה-AI של הארגון?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['מספר העובדים הכולל יגדל משמעותית - ביותר מ-20%', 'יגדל באופן בינוני - 10%-20%', 'יגדל מעט - עד 10%', 'ללא שינוי נטו', 'יקטן מעט - עד 10%', 'יקטן באופן בינוני - 10%-20%', 'יקטן משמעותית - ביותר מ-20%', 'לא יודע/ת / לא בטוח/ה'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'single',
      title: 'נוחות עובדים לא טכנולוגיים בשימוש ב-AI',
      question: 'באיזו מידה עובדים לא טכנולוגיים בארגון מרגישים בנוח להשתמש ב-AI בעבודתם היומיומית?',
      instructions: 'בחר/י את האפשרות המתאימה ביותר.',
      options: ['עובדים לא טכנולוגיים אינם נותנים אמון ב-AI ונמנעים משימוש בו', 'עובדים לא טכנולוגיים מעדיפים לא להשתמש בכלי AI אך יאמצו אותם אם יידרשו לכך', 'עובדים לא טכנולוגיים אינם מודעים לכלי AI או נחשפו אליהם במידה מוגבלת', 'עובדים לא טכנולוגיים מתעניינים ב-AI ומוכנים להשתמש בו, אך אינם מחפשים באופן פעיל כלי AI', 'עובדים לא טכנולוגיים מתלהבים מ-AI ומבקשים באופן יזום גישה לכלי AI או פתרונות מבוססי AI'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'single',
      title: 'שימוש ב-Generative AI',
      question: 'באיזו מידה הארגון משתמש כיום ב-Generative AI, כגון צ׳אטבוטים או יצירת תוכן, בפעילותו?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['כלל לא - אין שימוש ב-Generative AI באף פעילות', 'שימוש מינימלי - שימוש מוגבל במספר תחומים ספציפיים', 'שימוש בינוני - שימוש סדיר במספר תחומי פעילות', 'שימוש נרחב - שימוש רחב ברוב תחומי הפעילות', 'מוטמע באופן מלא - Generative AI הוא רכיב ליבה כמעט בכל הפעילות'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'single',
      title: 'תחום ההשפעה המרכזי של Generative AI',
      question: 'באיזה תחום של Generative AI לדעתך תהיה ההשפעה הגדולה ביותר על הענף שלך?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['עוזרים וירטואליים / צ׳אטבוטים שיחתיים', 'כתיבת קוד', 'חיפוש / ניהול ידע', 'סיכום תוכן - מסמכים, פגישות, חדשות', 'תרגום שפה', 'יצירה / סינתזה של קול', 'יצירת תוכן - טקסט, תמונות, וידאו, אודיו', 'עבודות עיצוב', 'אחר - נא לפרט'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'matrix-single',
      title: 'שימוש ב-Agentic AI',
      question: 'באיזו מידה הארגון משתמש ב-Agentic AI, כגון סוכנים או בוטים אוטונומיים, בפעילותו?',
      instructions: 'בחר/י תשובה אחת עבור היום ותשובה אחת עבור בעוד שנתיים.',
      rows: ['כיום', 'בעוד שנתיים'],
      columns: ['כלל לא - אין שימוש ב-Agentic AI באף פעילות', 'שימוש מינימלי - שימוש מוגבל במספר תחומים ספציפיים', 'שימוש בינוני - שימוש סדיר במספר תחומי פעילות', 'שימוש נרחב - שימוש רחב ברוב תחומי הפעילות', 'מוטמע באופן מלא - Agentic AI הוא רכיב ליבה כמעט בכל הפעילות'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'single',
      title: 'מודל ממשל לסוכני AI אוטונומיים',
      question: 'עד כמה מתקדם מודל המשילות של הארגון עבור סוכני AI אוטונומיים?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['לא קיים - לארגון אין מודל ממשל לסוכני AI אוטונומיים', 'בסיסי - מודל הממשל נמצא בשלבים ראשוניים ומכסה רק היבטים בסיסיים', 'מתפתח - קיים מודל ממשל מתפתח שמכסה מספר תחומים חשובים אך עדיין קיימים בו פערים משמעותיים', 'מתקדם - מודל הממשל מפותח היטב ומכסה את רוב ההיבטים הקריטיים באופן מקיף', 'מתקדם מאוד - מודל הממשל מתקדם מאוד, מוטמע במלואו ומתעדכן באופן רציף מול אתגרים והזדמנויות חדשים'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'single',
      title: 'תחום ההשפעה המרכזי של Agentic AI',
      question: 'באיזה תחום של Agentic AI לדעתך תהיה ההשפעה הגדולה ביותר על הענף שלך?',
      instructions: 'בחר/י אפשרות אחת.',
      options: ['ניהול דאטה או ידע באופן אוטונומי', 'IT / DevOps או סייבר אוטונומיים', 'פיתוח מוצר, מחקר ופיתוח או עיצוב והנדסה אוטונומיים', 'ניהול איכות, ביקורת וציות אוטונומיים', 'מסחר / קניות או רכש אוטונומיים', 'התאמות פיננסיות והנהלת חשבונות אוטונומיות', 'ניהול שרשרת אספקה ולוגיסטיקה אוטונומיים', 'ניהול HR וכוח אדם אוטונומי', 'שיווק ומכירות אוטונומיים', 'שירות לקוחות / תמיכה אוטונומיים', 'אחר - נא לפרט'],
    },
    {
      section: 'טאלנט וטכנולוגיות מתקדמות',
      type: 'matrix-single',
      title: 'זמן צפוי לפתרון חסמים ביוזמות AI מרכזיות',
      question: 'בהתייחס ליוזמות ה-AI המרכזיות של הארגון, מתי לדעתך הארגון יפתור באופן מספק את האתגרים בתחומים הבאים?',
      instructions: 'בחר/י תשובה אחת בכל שורה.',
      rows: ['גיבוש תפיסת AI כוללת מודל הפעלה להפיכה לארגון AI First', 'התגברות על אתגרי טכנולוגיה או תשתיות', 'טיפול באתגרים הקשורים לדאטה', 'צמצום סיכוני ממשל ו-governance', 'גיוס או פיתוח מספיק טאלנט AI'],
      columns: ['כבר נפתר', 'בתוך 12 חודשים', 'בתוך שנתיים', 'יותר משנתיים', 'לא יודע/ת / לא בטוח/ה'],
    },
  ];

  const demoRoot = document.querySelector('[data-survey-demo]');
  const storageKey = 'ai-survey-demo-answers';
  let activeQuestionIndex = 0;
  let answers = readStoredAnswers();

  if (demoRoot) {
    initializeSurveyDemo();
    return;
  }

  // Progress bar from data-progress on .progress-fill
  document.querySelectorAll('.progress-fill[data-progress]').forEach((el) => {
    const pct = Math.max(0, Math.min(100, parseFloat(el.dataset.progress)));
    requestAnimationFrame(() => { el.style.width = pct + '%'; });
  });

  // Single-choice option group
  const groups = document.querySelectorAll('[data-question="single"]');
  groups.forEach((group) => {
    const options = Array.from(group.querySelectorAll('.option-card'));
    const nextBtn = document.querySelector('[data-action="next"]');

    function select(idx) {
      options.forEach((opt, i) => {
        opt.setAttribute('aria-checked', i === idx ? 'true' : 'false');
      });
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.removeAttribute('aria-disabled');
      }
    }

    options.forEach((opt, i) => {
      opt.addEventListener('click', () => select(i));
      opt.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          select(i);
        }
      });
    });

    // Number-key shortcuts (1–9)
    document.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= options.length) {
        e.preventDefault();
        select(n - 1);
        options[n - 1].focus();
      }
      if (e.key === 'Enter' && nextBtn && !nextBtn.disabled) {
        nextBtn.click();
      }
    });
  });

  function initializeSurveyDemo() {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const params = new URLSearchParams(window.location.search);
    const requestedQuestion = parseInt(params.get('q'), 10);
    if (!Number.isNaN(requestedQuestion)) {
      activeQuestionIndex = clamp(requestedQuestion - 1, 0, surveyQuestions.length - 1);
    }

    document.querySelector('[data-total-questions]').textContent = surveyQuestions.length;
    document.querySelector('[data-action="previous"]').addEventListener('click', goPrevious);
    document.querySelector('[data-action="next"]').addEventListener('click', goNext);

    document.addEventListener('keydown', (event) => {
      if (isTypingTarget(event.target)) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        goNext();
        return;
      }
      const shortcut = parseInt(event.key, 10);
      if (!Number.isNaN(shortcut)) {
        selectByShortcut(shortcut);
      }
    });

    window.addEventListener('popstate', () => {
      const nextParams = new URLSearchParams(window.location.search);
      const nextQuestion = parseInt(nextParams.get('q'), 10);
      activeQuestionIndex = Number.isNaN(nextQuestion) ? 0 : clamp(nextQuestion - 1, 0, surveyQuestions.length - 1);
      renderQuestion({ resetScroll: true });
    });

    renderQuestion({ resetScroll: true });
  }

  function renderQuestion({ resetScroll = false } = {}) {
    const question = surveyQuestions[activeQuestionIndex];
    const progress = ((activeQuestionIndex + 1) / surveyQuestions.length) * 100;

    document.title = `סקר בשלות AI · שאלה ${activeQuestionIndex + 1} מתוך ${surveyQuestions.length}`;
    document.querySelector('[data-section]').innerHTML = renderInline(question.section);
    document.querySelector('[data-current-question]').textContent = activeQuestionIndex + 1;
    document.querySelector('[data-progress-fill]').style.width = `${progress}%`;
    document.querySelector('[data-question-title]').innerHTML = renderInline(question.question);
    document.querySelector('[data-question-instructions]').innerHTML = renderInline(question.instructions);
    document.querySelector('[data-question-note]').textContent = '';
    document.querySelector('[data-action="next"]').textContent = activeQuestionIndex === surveyQuestions.length - 1 ? 'סיום ←' : 'הבא ←';

    const previousButton = document.querySelector('[data-action="previous"]');
    previousButton.textContent = activeQuestionIndex === 0 ? '→ לפתיחה' : '→ הקודם';

    const optionsContainer = document.querySelector('[data-question-options]');
    optionsContainer.innerHTML = '';

    if (question.type === 'single' || question.type === 'multi') {
      renderChoiceQuestion(optionsContainer, question);
    }
    if (question.type === 'matrix-single') {
      renderMatrixSingle(optionsContainer, question, 'row');
    }
    if (question.type === 'matrix-column-single') {
      renderMatrixSingle(optionsContainer, question, 'column');
    }
    if (question.type === 'matrix-multi') {
      renderMatrixMulti(optionsContainer, question);
    }

    updateShortcutHint(question);
    updateAddress();
    if (resetScroll) resetQuestionScroll();
  }

  function renderChoiceQuestion(container, question) {
    const answer = answers[getQuestionKey()] || [];
    const selected = Array.isArray(answer) ? answer : [answer];
    const group = document.createElement('div');
    group.className = 'space-y-3';
    group.setAttribute('role', question.type === 'single' ? 'radiogroup' : 'group');
    group.setAttribute('aria-label', question.title);

    question.options.forEach((option, index) => {
      const isSelected = selected.includes(index);
      group.appendChild(createOptionButton({
        label: option,
        badge: index + 1,
        checked: isSelected,
        role: question.type === 'single' ? 'radio' : 'checkbox',
        markerClass: question.type === 'single' ? 'option-radio' : 'option-check',
        onClick: () => toggleChoice(question, index),
      }));
    });

    container.appendChild(group);
  }

  function renderMatrixSingle(container, question, orientation) {
    const saved = answers[getQuestionKey()] || {};
    const prompts = orientation === 'row' ? question.rows : question.columns;
    const choices = orientation === 'row' ? question.columns : question.rows;
    const promptLabel = orientation === 'row' ? 'שורה' : 'טווח זמן';

    const wrapper = document.createElement('div');
    wrapper.className = 'matrix-list';

    prompts.forEach((prompt, promptIndex) => {
      const row = document.createElement('section');
      row.className = 'matrix-row';

      const title = document.createElement('h2');
      title.className = 'matrix-row-title';
      title.innerHTML = renderInline(prompt);
      row.appendChild(title);

      const group = document.createElement('div');
      group.className = 'matrix-choice-grid';
      group.setAttribute('role', 'radiogroup');
      group.setAttribute('aria-label', `${promptLabel} ${promptIndex + 1}`);

      choices.forEach((choice, choiceIndex) => {
        const checked = saved[promptIndex] === choiceIndex;
        group.appendChild(createMatrixButton({
          label: choice,
          checked,
          role: 'radio',
          markerClass: 'option-radio',
          onClick: () => setMatrixSingle(promptIndex, choiceIndex),
        }));
      });

      row.appendChild(group);
      wrapper.appendChild(row);
    });

    container.appendChild(wrapper);
  }

  function renderMatrixMulti(container, question) {
    const saved = answers[getQuestionKey()] || [];
    const selected = new Set(saved);
    const wrapper = document.createElement('div');
    wrapper.className = 'matrix-list';

    question.rows.forEach((rowLabel, rowIndex) => {
      const row = document.createElement('section');
      row.className = 'matrix-row';

      const title = document.createElement('h2');
      title.className = 'matrix-row-title';
      title.innerHTML = renderInline(rowLabel);
      row.appendChild(title);

      const group = document.createElement('div');
      group.className = 'matrix-choice-grid matrix-choice-grid--compact';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', rowLabel);

      question.columns.forEach((columnLabel, columnIndex) => {
        const key = `${rowIndex}:${columnIndex}`;
        group.appendChild(createMatrixButton({
          label: columnLabel,
          checked: selected.has(key),
          role: 'checkbox',
          markerClass: 'option-check',
          onClick: () => toggleMatrixMulti(question, rowIndex, columnIndex),
        }));
      });

      row.appendChild(group);
      wrapper.appendChild(row);
    });

    container.appendChild(wrapper);
  }

  function createOptionButton({ label, badge, checked, role, markerClass, onClick }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-card surface-card w-full text-start p-4 flex items-center gap-4 bg-[#FEFFFB]/95';
    button.setAttribute('role', role);
    button.setAttribute('aria-checked', checked ? 'true' : 'false');
    button.addEventListener('click', onClick);
    button.innerHTML = `
      <span class="kbd-badge font-latin">${badge}</span>
      <span class="flex-1 text-sm sm:text-base">${renderInline(label)}</span>
      <span class="${markerClass}" aria-hidden="true"></span>
    `;
    return button;
  }

  function createMatrixButton({ label, checked, role, markerClass, onClick }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-card matrix-option bg-[#FEFFFB]/95';
    button.setAttribute('role', role);
    button.setAttribute('aria-checked', checked ? 'true' : 'false');
    button.addEventListener('click', onClick);
    button.innerHTML = `
      <span class="matrix-option-label">${renderInline(label)}</span>
      <span class="${markerClass}" aria-hidden="true"></span>
    `;
    return button;
  }

  function toggleChoice(question, optionIndex) {
    const key = getQuestionKey();
    if (question.type === 'single') {
      answers[key] = [optionIndex];
    } else {
      const current = new Set(answers[key] || []);
      if (current.has(optionIndex)) {
        current.delete(optionIndex);
      } else if (!question.maxSelections || current.size < question.maxSelections) {
        current.add(optionIndex);
      } else {
        showNote(`ניתן לבחור עד ${question.maxSelections} אפשרויות.`);
        return;
      }
      answers[key] = Array.from(current).sort((a, b) => a - b);
    }
    persistAndRender();
  }

  function setMatrixSingle(promptIndex, choiceIndex) {
    const key = getQuestionKey();
    answers[key] = Object.assign({}, answers[key], { [promptIndex]: choiceIndex });
    persistAndRender();
  }

  function toggleMatrixMulti(question, rowIndex, columnIndex) {
    const key = getQuestionKey();
    const optionKey = `${rowIndex}:${columnIndex}`;
    const current = new Set(answers[key] || []);

    if (current.has(optionKey)) {
      current.delete(optionKey);
    } else if (!question.maxPerColumn || countSelectionsInColumn(current, columnIndex) < question.maxPerColumn) {
      current.add(optionKey);
    } else {
      showNote(`ניתן לבחור עד ${question.maxPerColumn} חסמים בכל עמודה.`);
      return;
    }

    answers[key] = Array.from(current).sort();
    persistAndRender();
  }

  function selectByShortcut(shortcut) {
    const question = surveyQuestions[activeQuestionIndex];
    if (question.type !== 'single' && question.type !== 'multi') return;
    if (shortcut < 1 || shortcut > question.options.length) return;
    toggleChoice(question, shortcut - 1);
    const selectedButton = document.querySelectorAll('[data-question-options] .option-card')[shortcut - 1];
    if (selectedButton) selectedButton.focus();
  }

  function goPrevious() {
    if (activeQuestionIndex === 0) {
      window.location.href = 'welcome.html';
      return;
    }
    activeQuestionIndex -= 1;
    renderQuestion({ resetScroll: true });
  }

  function goNext() {
    if (activeQuestionIndex === surveyQuestions.length - 1) {
      window.location.href = 'thank-you.html';
      return;
    }
    activeQuestionIndex += 1;
    renderQuestion({ resetScroll: true });
  }

  function persistAndRender() {
    localStorage.setItem(storageKey, JSON.stringify(answers));
    renderQuestion();
  }

  function readStoredAnswers() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (error) {
      return {};
    }
  }

  function updateAddress() {
    const url = new URL(window.location.href);
    url.searchParams.set('q', activeQuestionIndex + 1);
    window.history.replaceState({}, '', url);
  }

  function resetQuestionScroll() {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }

  function updateShortcutHint(question) {
    const hint = document.querySelector('[data-shortcut-hint]');
    if (!hint) return;
    if (question.type === 'single' || question.type === 'multi') {
      const lastShortcut = Math.min(question.options.length, 9);
      hint.innerHTML = `<span>בחר/י עם <span class="kbd font-latin">1</span>–<span class="kbd font-latin">${lastShortcut}</span></span><span class="text-border">·</span><span>המשך עם <span class="kbd font-latin">Enter</span></span>`;
      return;
    }
    hint.innerHTML = '<span>בחר/י תשובות לפי שורה</span><span class="text-border">·</span><span>המשך עם <span class="kbd font-latin">Enter</span></span>';
  }

  function showNote(message) {
    const note = document.querySelector('[data-question-note]');
    if (note) note.textContent = message;
  }

  function getQuestionKey() {
    return `q${activeQuestionIndex + 1}`;
  }

  function countSelectionsInColumn(selectedKeys, columnIndex) {
    let count = 0;
    selectedKeys.forEach((key) => {
      if (key.endsWith(`:${columnIndex}`)) count += 1;
    });
    return count;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function isTypingTarget(target) {
    return target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
  }

  function renderInline(value) {
    return escapeHtml(value).replace(/\b(Agentic AI|Generative AI|AI First|Data Science|Private Equity|AI\/ML|AI|GenAI|IT|HR|DevOps|APIs|POC|VP|EVP|SVP|COO|CFO|CIO|CTO|CMO|CSO|CHRO|upskilling|reskilling|enterprise stack|use cases|governance|gig)\b/g, '<span class="font-latin">$1</span>');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Review screen — collapsible groups
  document.querySelectorAll('[data-collapsible]').forEach((card) => {
    const header = card.querySelector('[data-collapsible-trigger]');
    const body = card.querySelector('[data-collapsible-body]');
    const chevron = card.querySelector('[data-chevron]');
    if (!header || !body) return;
    header.addEventListener('click', () => {
      const open = card.getAttribute('data-open') === 'true';
      card.setAttribute('data-open', open ? 'false' : 'true');
      body.style.maxHeight = open ? '0px' : body.scrollHeight + 'px';
      if (chevron) chevron.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
    });
    // Initial state
    if (card.getAttribute('data-open') === 'true') {
      body.style.maxHeight = body.scrollHeight + 'px';
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
      body.style.maxHeight = '0px';
    }
  });
})();
