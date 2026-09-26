export type FixBrew =
  | 'espresso'
  | 'moka'
  | 'v60'
  | 'french'
  | 'filter'
  | 'aeropress'
  | 'turkish'
  | 'capsule';

export type FixProblem =
  | 'bitter'
  | 'sour'
  | 'watery'
  | 'dry'
  | 'burnt'
  | 'flat'
  | 'heavy'
  | 'inconsistent';

export type FixAnswers = {
  brew: FixBrew;
  problem: FixProblem;
  flow: 'fast' | 'normal' | 'slow' | 'unknown';
  grind: 'fine' | 'medium' | 'coarse' | 'unknown';
  water: 'boiling' | 'hot' | 'moderate' | 'unknown';
  ratio: 'strong' | 'balanced' | 'weak' | 'unknown';
  roast: 'dark' | 'medium' | 'light' | 'unknown';
  technique: 'steady' | 'variable' | 'aggressive' | 'unknown';
};

export type FixQuestionKey = keyof FixAnswers;

export type FixOption = {
  value: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
};

export type FixQuestion = {
  key: FixQuestionKey;
  eyebrow: string;
  title: string;
  subtitle: string;
  options: FixOption[];
};

export type FixDiagnosis = {
  code: string;
  title: string;
  short: string;
  why: string;
  firstAction: string;
  secondAction: string;
  keepStill: string;
  deeperAction: string;
  confidence: 'بالا' | 'متوسط';
  evidence: string[];
  relatedHref: string;
  relatedLabel: string;
};

const brewImages: Record<FixBrew, string> = {
  espresso: '/media/brew-espresso-human-v2',
  moka: '/media/brew-moka-human-v2',
  v60: '/media/brew-v60-human-v2',
  french: '/media/brew-french-human-v2',
  filter: '/media/brew-filter-human-v2',
  aeropress: '/media/fix-brew-aeropress',
  turkish: '/media/fix-brew-turkish',
  capsule: '/media/fix-brew-capsule'
};

const baseQuestions: FixQuestion[] = [
  {
    key: 'brew',
    eyebrow: 'شروع تشخیص',
    title: 'اول بگو چجوری درستش می‌کنی؟',
    subtitle: 'روش دم‌آوری تعیین می‌کنه چه چیزهایی اصلاً ارزش بررسی دارند.',
    options: [
      { value: 'espresso', title: 'اسپرسوساز', description: 'خانگی، نیمه‌صنعتی یا صنعتی', icon: '▣', image: brewImages.espresso },
      { value: 'moka', title: 'موکاپات', description: 'روی گاز یا اجاق', icon: '♨', image: brewImages.moka },
      { value: 'v60', title: 'V60 / پوراور', description: 'دم‌آوری دستی و فیلتری', icon: '▽', image: brewImages.v60 },
      { value: 'french', title: 'فرنچ‌پرس', description: 'غوطه‌وری کامل', icon: '▤', image: brewImages.french },
      { value: 'filter', title: 'قهوه‌ساز فیلتری', description: 'دریپ / قهوه‌ساز برقی', icon: '⌁', image: brewImages.filter },
      { value: 'aeropress', title: 'AeroPress', description: 'فشار دستی', icon: '↕', image: brewImages.aeropress },
      { value: 'turkish', title: 'قهوه ترک', description: 'جذوه / ایبریک', icon: '◔', image: brewImages.turkish },
      { value: 'capsule', title: 'کپسولی', description: 'Nespresso و مشابه', icon: '●', image: brewImages.capsule }
    ]
  },
  {
    key: 'problem',
    eyebrow: 'مشکل فنجان',
    title: 'دقیقاً چی اذیتت می‌کنه؟',
    subtitle: 'نزدیک‌ترین گزینه را بزن؛ بعد از روی بقیه جواب‌ها ریزترش می‌کنیم.',
    options: [
      { value: 'bitter', title: 'زیادی تلخه', description: 'تلخی غالب و ناخوشایند', icon: '◼', image: '/media/fix-problem-bitter' },
      { value: 'sour', title: 'ترشه', description: 'ترشی تیز و نارس', icon: '◒', image: '/media/fix-problem-sour' },
      { value: 'watery', title: 'آبکیه', description: 'کم‌جان و رقیق', icon: '○', image: '/media/fix-problem-watery' },
      { value: 'dry', title: 'گسه / دهنو خشک می‌کنه', description: 'ته فنجان حس خشکی می‌ده', icon: '◇', image: '/media/fix-problem-dry' },
      { value: 'burnt', title: 'سوختگی می‌ده', description: 'دودی، خاکستری یا سوخته', icon: '▲', image: '/media/fix-problem-burnt' },
      { value: 'flat', title: 'عطر و مزه نداره', description: 'فلت و بی‌هیجان', icon: '—', image: '/media/fix-problem-flat' },
      { value: 'heavy', title: 'زیادی سنگینه', description: 'غلیظ و خسته‌کننده', icon: '■', image: '/media/fix-problem-heavy' },
      { value: 'inconsistent', title: 'هر بار یه چیز میشه', description: 'نتیجه قابل تکرار نیست', icon: '↯', image: '/media/fix-problem-inconsistent' }
    ]
  }
];

const commonQuestions: FixQuestion[] = [
  {
    key: 'grind',
    eyebrow: 'آسیاب',
    title: 'آسیابت نسبت به روش دم‌آوری چطوره؟',
    subtitle: 'اگر مطمئن نیستی، «نمی‌دونم» کاملاً جواب قابل استفاده‌ایه.',
    options: [
      { value: 'fine', title: 'خیلی ریزه', description: 'پودری‌تر یا عبور آب سخت‌تره', icon: '•••', image: '/media/fix-grind-fine' },
      { value: 'medium', title: 'تقریباً نرماله', description: 'همون محدوده‌ای که معمولاً استفاده می‌کنم', icon: '••', image: '/media/fix-grind-medium' },
      { value: 'coarse', title: 'درشته', description: 'دانه‌ها واضح‌تر و عبور آب راحت‌تره', icon: '•', image: '/media/fix-grind-coarse' },
      { value: 'unknown', title: 'نمی‌دونم', description: 'با بقیه جواب‌ها جلو می‌ریم', icon: '?', image: '/media/fix-grind-unknown' }
    ]
  },
  {
    key: 'water',
    eyebrow: 'آب',
    title: 'آبت موقع دم‌آوری چقدر داغه؟',
    subtitle: 'تقریبی جواب بده؛ لازم نیست حتماً دماسنج داشته باشی.',
    options: [
      { value: 'boiling', title: 'تقریباً قل‌قل', description: 'همین که جوش میاد استفاده می‌کنم', icon: '♨', image: '/media/fix-water-boiling' },
      { value: 'hot', title: 'داغ ولی نه جوشان', description: 'کمی بعد از جوش استفاده می‌کنم', icon: '◉', image: '/media/fix-water-hot' },
      { value: 'moderate', title: 'خنک‌تر', description: 'عمداً دما را پایین‌تر می‌گیرم', icon: '◌', image: '/media/fix-water-moderate' },
      { value: 'unknown', title: 'نمی‌دونم', description: 'دما را اندازه نگرفتم', icon: '?', image: '/media/fix-water-unknown' }
    ]
  },
  {
    key: 'ratio',
    eyebrow: 'نسبت',
    title: 'فنجانت نسبت به معمول چقدر غلیظه؟',
    subtitle: 'این جواب کمک می‌کنه مشکل قدرت فنجان را از استخراج جدا کنیم.',
    options: [
      { value: 'strong', title: 'خیلی غلیظه', description: 'قهوه زیاد یا آب/خروجی کم', icon: '■■', image: '/media/fix-ratio-strong' },
      { value: 'balanced', title: 'تقریباً نرماله', description: 'از نظر قدرت عجیب نیست', icon: '■□', image: '/media/fix-ratio-balanced' },
      { value: 'weak', title: 'رقیقه', description: 'آب زیاد یا قهوه کم', icon: '□□', image: '/media/fix-ratio-weak' },
      { value: 'unknown', title: 'نمی‌دونم', description: 'با نشانه‌های دیگه تشخیص می‌دیم', icon: '?', image: '/media/fix-ratio-unknown' }
    ]
  },
  {
    key: 'roast',
    eyebrow: 'دانه',
    title: 'رُست قهوه‌ات بیشتر کدوم سمته؟',
    subtitle: 'اگر روی بسته نوشته نشده، از رنگ دانه حدس بزن.',
    options: [
      { value: 'dark', title: 'تیره', description: 'دانه تیره‌تر، گاهی کمی روغنی', icon: '●', image: '/media/fix-roast-dark' },
      { value: 'medium', title: 'متوسط', description: 'قهوه‌ای متوسط', icon: '◉', image: '/media/fix-roast-medium' },
      { value: 'light', title: 'روشن', description: 'رنگ روشن‌تر و عطر میوه‌ای‌تر', icon: '○', image: '/media/fix-roast-light' },
      { value: 'unknown', title: 'نمی‌دونم', description: 'اشکالی نداره', icon: '?', image: '/media/fix-roast-unknown' }
    ]
  }
];

function flowQuestion(brew: FixBrew): FixQuestion {
  const map: Record<FixBrew, { title: string; fast: string; normal: string; slow: string }> = {
    espresso: {
      title: 'شاتت معمولاً چند ثانیه طول می‌کشه؟',
      fast: 'زیر حدود ۲۰ ثانیه',
      normal: 'حدود ۲۰ تا ۳۵ ثانیه',
      slow: 'بیشتر از حدود ۳۵ ثانیه'
    },
    moka: {
      title: 'موکاپات چقدر سریع بالا میاد؟',
      fast: 'خیلی سریع و با فشار',
      normal: 'آروم و پیوسته',
      slow: 'خیلی دیر و سخت'
    },
    v60: {
      title: 'کل دم‌آوری V60 تقریباً چقدر طول می‌کشه؟',
      fast: 'خیلی سریع؛ زیر حدود ۲ دقیقه',
      normal: 'حدود ۲ تا ۴ دقیقه',
      slow: 'خیلی کند؛ بیشتر از حدود ۴ دقیقه'
    },
    french: {
      title: 'قهوه چقدر با آب می‌مونه؟',
      fast: 'کمتر از حدود ۳ دقیقه',
      normal: 'حدود ۴ دقیقه',
      slow: 'خیلی بیشتر از ۵ دقیقه'
    },
    filter: {
      title: 'آب از بستر قهوه چقدر سریع رد میشه؟',
      fast: 'سریع‌تر از معمول',
      normal: 'معمول و پیوسته',
      slow: 'خیلی کند'
    },
    aeropress: {
      title: 'زمان تماس و فشار دادنت چطوره؟',
      fast: 'خیلی کوتاه و سریع',
      normal: 'معمول و کنترل‌شده',
      slow: 'طولانی و کند'
    },
    turkish: {
      title: 'قهوه ترک چقدر روی حرارت می‌مونه؟',
      fast: 'خیلی زود بالا میاد',
      normal: 'آروم گرم میشه',
      slow: 'مدت زیادی روی حرارته'
    },
    capsule: {
      title: 'حجم خروجی نسبت به کپسول چطوره؟',
      fast: 'شات کوتاه',
      normal: 'حجم پیشنهادی دستگاه',
      slow: 'خیلی طولانی / آب زیاد رد می‌کنم'
    }
  };

  const copy = map[brew];

  return {
    key: 'flow',
    eyebrow: 'زمان / جریان',
    title: copy.title,
    subtitle: 'تقریبی انتخاب کن؛ دنبال عدد آزمایشگاهی نیستیم.',
    options: [
      { value: 'fast', title: copy.fast, description: 'سمت سریع‌تر', icon: '→', image: brewImages[brew] },
      { value: 'normal', title: copy.normal, description: 'محدوده معمول', icon: '●', image: brewImages[brew] },
      { value: 'slow', title: copy.slow, description: 'سمت کندتر', icon: '←', image: brewImages[brew] },
      { value: 'unknown', title: 'نمی‌دونم', description: 'با بقیه نشانه‌ها ادامه بده', icon: '?', image: brewImages[brew] }
    ]
  };
}

function techniqueQuestion(brew: FixBrew): FixQuestion {
  const copy: Record<FixBrew, { title: string; steady: string; variable: string; aggressive: string }> = {
    espresso: {
      title: 'پخش قهوه و تمپت چقدر تکرارپذیره؟',
      steady: 'تقریباً همیشه یکسانه',
      variable: 'هر بار یه جور میشه',
      aggressive: 'خیلی محکم / وسواسی تمپ می‌کنم'
    },
    moka: {
      title: 'حرارت موکاپاتت چطوره؟',
      steady: 'کم و یکنواخت',
      variable: 'هر بار فرق می‌کنه',
      aggressive: 'شعله بالاست'
    },
    v60: {
      title: 'ریختن آب روی V60 چقدر یکنواخته؟',
      steady: 'آروم و تکرارپذیر',
      variable: 'هر بار الگوی متفاوت',
      aggressive: 'با شدت زیاد می‌ریزم'
    },
    french: {
      title: 'هم‌زدن و پرس کردنت چطوره؟',
      steady: 'ملایم و یکسان',
      variable: 'هر بار متفاوت',
      aggressive: 'خیلی زیاد هم می‌زنم / فشار می‌دم'
    },
    filter: {
      title: 'بستر قهوه بعد از دم‌آوری چطوره؟',
      steady: 'تقریباً یکنواخت',
      variable: 'هر بار شکل متفاوت',
      aggressive: 'آب با شدت روی یک نقطه می‌ریزه'
    },
    aeropress: {
      title: 'فشار دادن AeroPress چطوره؟',
      steady: 'آروم و یکسان',
      variable: 'هر بار متفاوت',
      aggressive: 'خیلی سریع و محکم'
    },
    turkish: {
      title: 'حرارت و بالا آمدن قهوه چقدر کنترل‌شده است؟',
      steady: 'آروم و یکسان',
      variable: 'هر بار متفاوت',
      aggressive: 'حرارت بالاست'
    },
    capsule: {
      title: 'تنظیم دستگاهت ثابت می‌مونه؟',
      steady: 'همیشه یک تنظیم',
      variable: 'حجم و تنظیم را زیاد عوض می‌کنم',
      aggressive: 'چند بار از یک کپسول آب رد می‌کنم'
    }
  };

  const item = copy[brew];
  return {
    key: 'technique',
    eyebrow: 'تکرارپذیری',
    title: item.title,
    subtitle: 'آخرین سؤال؛ این یکی برای تشخیص نوسان و خطای روشه.',
    options: [
      { value: 'steady', title: item.steady, description: 'نتیجه معمولاً قابل تکراره', icon: '✓', image: brewImages[brew] },
      { value: 'variable', title: item.variable, description: 'متغیرها ثابت نیستند', icon: '↯', image: brewImages[brew] },
      { value: 'aggressive', title: item.aggressive, description: 'احتمال فشار یا حرارت زیاد', icon: '!', image: brewImages[brew] },
      { value: 'unknown', title: 'مطمئن نیستم', description: 'با بقیه جواب‌ها تشخیص بده', icon: '?', image: brewImages[brew] }
    ]
  };
}

export function buildFixQuestions(answers: Partial<FixAnswers>): FixQuestion[] {
  if (!answers.brew) return [baseQuestions[0]];
  if (!answers.problem) return [...baseQuestions];

  return [
    ...baseQuestions,
    flowQuestion(answers.brew),
    ...commonQuestions,
    techniqueQuestion(answers.brew)
  ];
}

type DiagnosisCode =
  | 'over'
  | 'under'
  | 'hot'
  | 'strong'
  | 'weak'
  | 'dark'
  | 'stale'
  | 'technique';

const diagnosisMeta: Record<DiagnosisCode, Omit<FixDiagnosis, 'confidence' | 'evidence'>> = {
  over: {
    code: 'over',
    title: 'احتمالاً داری بیش‌ازحد عصاره‌گیری می‌کنی.',
    short: 'آب زیادی از ترکیبات تلخ و خشک قهوه بیرون می‌کشه.',
    why: 'ترکیب زمان طولانی، آسیاب ریز یا جریان کند معمولاً فنجان را به سمت تلخی و خشکی می‌برد.',
    firstAction: 'اول فقط آسیاب را یک پله درشت‌تر کن و بقیه چیزها را دست نزن.',
    secondAction: 'اگر هنوز تلخ یا خشک بود، زمان تماس آب و قهوه را کمی کوتاه‌تر کن.',
    keepStill: 'فعلاً دوز، دمای آب و نوع دانه را هم‌زمان عوض نکن.',
    deeperAction: 'یک بار با آسیاب کمی درشت‌تر و همان دوز قبلی دم کن. اگر تغییر خیلی کم بود، زمان را ۱۰ تا ۱۵٪ کوتاه‌تر کن.',
    relatedHref: '/magazine/coffee-too-bitter',
    relatedLabel: 'راهنمای کامل تلخی قهوه'
  },
  under: {
    code: 'under',
    title: 'احتمالاً عصاره‌گیریت ناقصه.',
    short: 'آب قبل از اینکه شیرینی و تعادل کافی بگیره، از قهوه رد شده.',
    why: 'جریان خیلی سریع، آسیاب درشت یا زمان کوتاه معمولاً ترشی تیز و فنجان کم‌جان می‌سازه.',
    firstAction: 'اول فقط آسیاب را یک پله ریزتر کن.',
    secondAction: 'اگر هنوز ترش یا کم‌جان بود، زمان تماس را کمی بیشتر کن.',
    keepStill: 'فعلاً دوز و دمای آب را ثابت نگه دار تا بفهمی آسیاب چه اثری داشته.',
    deeperAction: 'اگر با آسیاب ریزتر بهتر شد ولی هنوز تیز بود، زمان دم‌آوری را حدود ۱۰٪ بیشتر کن.',
    relatedHref: '/magazine/espresso-sour',
    relatedLabel: 'چرا اسپرسو ترش می‌شود؟'
  },
  hot: {
    code: 'hot',
    title: 'احتمالاً حرارت زیادی وارد بازی شده.',
    short: 'آب یا منبع حرارت می‌تونه طعم سوختگی و تلخی را برجسته کنه.',
    why: 'آب نزدیک جوش یا حرارت شدید، مخصوصاً کنار رُست تیره، فنجان را خشن‌تر می‌کند.',
    firstAction: 'اول آب را کمی خنک‌تر کن یا شدت حرارت را پایین بیاور.',
    secondAction: 'اگر هنوز سوختگی ماند، رُست را یک درجه روشن‌تر امتحان کن.',
    keepStill: 'آسیاب و نسبت را در تست اول تغییر نده.',
    deeperAction: 'یک فنجان با همان دستور قبلی و فقط دمای پایین‌تر بزن؛ اگر نرم‌تر شد، ریشه مشکل را پیدا کرده‌ای.',
    relatedHref: '/magazine/coffee-too-bitter',
    relatedLabel: 'راهنمای تلخی و دمای قهوه'
  },
  strong: {
    code: 'strong',
    title: 'احتمالاً فنجانت بیش‌ازحد متمرکزه.',
    short: 'قدرت زیاد فنجان می‌تونه خودش را به شکل سنگینی و تلخی نشان بده.',
    why: 'قهوه زیاد نسبت به آب یا خروجی کم، حتی با استخراج درست هم فنجان را بیش از حد سنگین می‌کند.',
    firstAction: 'اول فقط کمی آب/خروجی بیشتری بگیر یا دوز را اندکی کمتر کن.',
    secondAction: 'اگر مزه همچنان خشن بود، بعد سراغ آسیاب برو.',
    keepStill: 'در تست اول دما و رُست را تغییر نده.',
    deeperAction: 'نسبت را حدود ۱۰٪ رقیق‌تر کن و دوباره مزه کن؛ بعد فقط اگر لازم بود آسیاب را تنظیم کن.',
    relatedHref: '/magazine',
    relatedLabel: 'راهنماهای دم‌آوری EL.SEED'
  },
  weak: {
    code: 'weak',
    title: 'احتمالاً مشکل اصلی نسبت قهوه به آبه.',
    short: 'فنجان رقیق همیشه به معنی دانه بد یا استخراج ناقص نیست.',
    why: 'آب زیاد یا قهوه کم، قدرت فنجان را پایین می‌آورد و عطر و بافت را محو می‌کند.',
    firstAction: 'اول فقط نسبت را کمی قوی‌تر کن؛ قهوه بیشتر یا آب کمتر.',
    secondAction: 'اگر هنوز آبکی بود، بعد آسیاب را کمی ریزتر کن.',
    keepStill: 'هم‌زمان زمان، دما و دانه را عوض نکن.',
    deeperAction: 'حدود ۱۰٪ نسبت را قوی‌تر کن. اگر بافت برگشت ولی مزه هنوز ضعیف بود، آسیاب را یک پله ریزتر کن.',
    relatedHref: '/magazine',
    relatedLabel: 'راهنماهای دم‌آوری EL.SEED'
  },
  dark: {
    code: 'dark',
    title: 'ممکنه خود رُست برای ذائقه‌ات زیادی تیره باشه.',
    short: 'گاهی تنظیمات درست‌اند ولی پروفایل دانه از اول سمت تلخی و دودی بودن می‌رود.',
    why: 'وقتی رُست تیره با آب داغ یا استخراج طولانی ترکیب شود، اصلاح با آسیاب به‌تنهایی محدود می‌شود.',
    firstAction: 'اول همان قهوه را کمی خنک‌تر و کوتاه‌تر دم کن.',
    secondAction: 'اگر هنوز دودی و تلخ بود، یک رُست متوسط‌تر امتحان کن.',
    keepStill: 'برای تست اول فقط دما یا زمان را تغییر بده، نه همه‌چیز را.',
    deeperAction: 'اگر با تنظیم دم‌آوری فقط کمی بهتر شد، مسئله احتمالاً سلیقه و رُست است؛ قهوه متوسط‌تر انتخاب کن.',
    relatedHref: '/find',
    relatedLabel: 'قهوه مناسب ذائقه‌ام را پیدا کن'
  },
  stale: {
    code: 'stale',
    title: 'احتمالاً مشکل از تازگی یا خود قهوه است.',
    short: 'وقتی عطر و مزه افت کرده، تنظیمات دم‌آوری همیشه نمی‌توانند برش گردانند.',
    why: 'فنجان تخت و بی‌عطر با متغیرهای تقریباً نرمال، بیشتر ما را سمت تازگی و نگهداری دانه می‌برد.',
    firstAction: 'اول یک بار با قهوه تازه‌تر و همان دستور قبلی تست کن.',
    secondAction: 'اگر تفاوت نکرد، نسبت را کمی قوی‌تر کن.',
    keepStill: 'قبل از مقایسه، روش دم‌آوری را کامل عوض نکن.',
    deeperAction: 'اگر بسته مدت زیادی باز بوده، یک دوز از قهوه تازه آسیاب‌شده را با همان دستور تست کن.',
    relatedHref: '/find',
    relatedLabel: 'قهوه مناسب خودت را پیدا کن'
  },
  technique: {
    code: 'technique',
    title: 'مشکل اصلی احتمالاً تکرارپذیری روشه.',
    short: 'وقتی هر بار یک نتیجه می‌گیری، قبل از تغییر دانه باید متغیرها را ثابت کنیم.',
    why: 'تغییر در ریختن آب، تمپ، حرارت، زمان یا حجم خروجی باعث می‌شود تشخیص طعم عملاً غیرممکن شود.',
    firstAction: 'برای فنجان بعدی فقط یک دستور ثابت اجرا کن و هیچ متغیری را وسط کار تغییر نده.',
    secondAction: 'بعد از یک فنجان تکرارپذیر، فقط یک متغیر را برای اصلاح مزه تغییر بده.',
    keepStill: 'فعلاً دانه جدید، دمای جدید و آسیاب جدید را با هم امتحان نکن.',
    deeperAction: 'سه فنجان با دوز، آب، زمان و تکنیک یکسان بزن. اگر هنوز اختلاف زیاد بود، آسیاب یا توزیع را بررسی کن.',
    relatedHref: '/magazine',
    relatedLabel: 'راهنماهای دم‌آوری EL.SEED'
  }
};

const labels = {
  flow: {
    fast: 'زمان/جریان سمت سریع بوده',
    normal: 'زمان/جریان در محدوده معمول بوده',
    slow: 'زمان/جریان سمت کند بوده',
    unknown: ''
  },
  grind: {
    fine: 'آسیاب نسبتاً ریز بوده',
    medium: 'آسیاب در محدوده معمول بوده',
    coarse: 'آسیاب نسبتاً درشت بوده',
    unknown: ''
  },
  water: {
    boiling: 'آب خیلی داغ استفاده شده',
    hot: 'آب داغ ولی کنترل‌شده بوده',
    moderate: 'آب خنک‌تر استفاده شده',
    unknown: ''
  },
  ratio: {
    strong: 'فنجان از نظر نسبت غلیظ بوده',
    balanced: 'قدرت فنجان معمول بوده',
    weak: 'فنجان از نظر نسبت رقیق بوده',
    unknown: ''
  },
  roast: {
    dark: 'رُست سمت تیره بوده',
    medium: 'رُست متوسط بوده',
    light: 'رُست روشن بوده',
    unknown: ''
  },
  technique: {
    steady: 'تکنیک تقریباً تکرارپذیر بوده',
    variable: 'تکنیک هر بار تغییر می‌کند',
    aggressive: 'فشار/حرارت/ریختن آب تهاجمی بوده',
    unknown: ''
  }
} as const;

export function diagnoseCoffee(a: FixAnswers): FixDiagnosis {
  const scores: Record<DiagnosisCode, number> = {
    over: 0,
    under: 0,
    hot: 0,
    strong: 0,
    weak: 0,
    dark: 0,
    stale: 0,
    technique: 0
  };

  const add = (key: DiagnosisCode, n: number) => (scores[key] += n);

  const byProblem: Record<FixProblem, Partial<Record<DiagnosisCode, number>>> = {
    bitter: { over: 5, hot: 2, dark: 2, strong: 1 },
    sour: { under: 6, technique: 1 },
    watery: { weak: 5, under: 3, stale: 1 },
    dry: { over: 5, technique: 2, hot: 1 },
    burnt: { hot: 5, dark: 4, over: 1 },
    flat: { stale: 5, weak: 2, under: 1 },
    heavy: { strong: 5, over: 2, dark: 2 },
    inconsistent: { technique: 7, under: 1, over: 1 }
  };

  for (const [key, value] of Object.entries(byProblem[a.problem])) {
    add(key as DiagnosisCode, Number(value));
  }

  if (a.flow === 'fast') add('under', 4);
  if (a.flow === 'slow') add('over', 4);

  if (a.grind === 'fine') add('over', 3);
  if (a.grind === 'coarse') add('under', 3);

  if (a.water === 'boiling') {
    add('hot', 4);
    add('over', 1);
  }
  if (a.water === 'moderate' && a.problem === 'sour') add('under', 2);

  if (a.ratio === 'strong') add('strong', 4);
  if (a.ratio === 'weak') add('weak', 4);

  if (a.roast === 'dark') add('dark', 4);
  if (a.roast === 'light' && a.problem === 'sour') add('under', 1);

  if (a.technique === 'variable') add('technique', 5);
  if (a.technique === 'aggressive') {
    add('technique', 2);
    add('hot', a.brew === 'moka' || a.brew === 'turkish' ? 3 : 0);
    add('over', a.brew !== 'moka' && a.brew !== 'turkish' ? 1 : 0);
  }

  if (a.brew === 'espresso' && a.problem === 'inconsistent') add('technique', 3);
  if (a.brew === 'capsule' && a.flow === 'slow') add('weak', 2);

  const ranking = (Object.entries(scores) as Array<[DiagnosisCode, number]>)
    .sort((x, y) => y[1] - x[1]);

  const [topCode, topScore] = ranking[0];
  const secondScore = ranking[1][1];
  const evidence = [
    labels.flow[a.flow],
    labels.grind[a.grind],
    labels.water[a.water],
    labels.ratio[a.ratio],
    labels.roast[a.roast],
    labels.technique[a.technique]
  ].filter(Boolean).slice(0, 4);

  return {
    ...diagnosisMeta[topCode],
    confidence: topScore - secondScore >= 3 ? 'بالا' : 'متوسط',
    evidence
  };
}

export const brewLabels: Record<FixBrew, string> = {
  espresso: 'اسپرسوساز',
  moka: 'موکاپات',
  v60: 'V60 / پوراور',
  french: 'فرنچ‌پرس',
  filter: 'قهوه‌ساز فیلتری',
  aeropress: 'AeroPress',
  turkish: 'قهوه ترک',
  capsule: 'کپسولی'
};

export const problemLabels: Record<FixProblem, string> = {
  bitter: 'زیادی تلخه',
  sour: 'ترشه',
  watery: 'آبکیه',
  dry: 'گسه / خشک می‌کنه',
  burnt: 'طعم سوختگی',
  flat: 'عطر و مزه نداره',
  heavy: 'زیادی سنگینه',
  inconsistent: 'هر بار فرق می‌کنه'
};
