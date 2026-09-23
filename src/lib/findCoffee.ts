export type FindCoffeeAnswers = {
  time: 'morning' | 'day' | 'afternoon' | 'night';
  effect: 'strong' | 'balanced' | 'many' | 'taste';
  sensitivity: 'none' | 'some' | 'high' | 'sleep';
  taste: 'chocolate' | 'caramel' | 'fruity' | 'bold' | 'unsure';
  brew: 'espresso' | 'moka' | 'v60' | 'french' | 'filter' | 'unsure';
};

export type CoffeeLine = 'FULL' | 'HALF' | 'LOW' | 'DECAF';

export type CoffeeMatch = {
  line: CoffeeLine;
  lineName: string;
  lineFa: string;
  lineDescription: string;
  arabicaPercent: number;
  robustaPercent: number;
  decaf: boolean;
  roast: string;
  flavor: string;
  acidity: string;
  body: string;
  arabicaOrigins: string[];
  robustaOrigins: string[];
  brewLabel: string;
  roasteryBrief: string;
  note: string;
  matchPercent: number;
};

const lineMeta: Record<CoffeeLine, Pick<CoffeeMatch, 'lineName' | 'lineFa' | 'lineDescription' | 'arabicaPercent' | 'robustaPercent' | 'decaf'>> = {
  FULL: {
    lineName: 'GOOD MORNING',
    lineFa: 'پرقدرت',
    lineDescription: 'برای وقتی که از قهوه انرژی و بادی جدی می‌خواهی.',
    arabicaPercent: 30,
    robustaPercent: 70,
    decaf: false
  },
  HALF: {
    lineName: 'EASY DAY',
    lineFa: 'متعادل',
    lineDescription: 'برای انرژی متعادل، شیرینی بیشتر و روبوستای کنترل‌شده.',
    arabicaPercent: 70,
    robustaPercent: 30,
    decaf: false
  },
  LOW: {
    lineName: 'ONE MORE CUP',
    lineFa: 'ملایم',
    lineDescription: 'برای مزه، فنجان‌های بیشتر و شدت کافئین نسبی کمتر از بلِندهای روبوستاپایه.',
    arabicaPercent: 100,
    robustaPercent: 0,
    decaf: false
  },
  DECAF: {
    lineName: 'AFTER FIVE',
    lineFa: 'بدون کافئین معمول',
    lineDescription: 'برای وقتی که مزه قهوه را می‌خواهی اما می‌خواهی سراغ دی‌کف بروی.',
    arabicaPercent: 100,
    robustaPercent: 0,
    decaf: true
  }
};

const tasteProfiles = {
  chocolate: {
    flavor: 'شکلات تلخ، فندق و آجیل',
    acidity: 'کم',
    body: 'متوسط رو به بالا',
    arabicaOrigins: ['Brazil', 'Colombia'],
    robustaOrigins: ['India', 'Uganda'],
    roast: 'Medium تا Medium-Dark'
  },
  caramel: {
    flavor: 'کارامل، شکلات شیری و شیرینی قهوه‌ای',
    acidity: 'کم تا متوسط',
    body: 'متوسط',
    arabicaOrigins: ['Brazil', 'Colombia'],
    robustaOrigins: ['India'],
    roast: 'Medium'
  },
  fruity: {
    flavor: 'میوه‌ای، شیرین و روشن',
    acidity: 'متوسط تا بالا',
    body: 'متوسط رو به سبک',
    arabicaOrigins: ['Ethiopia', 'Colombia'],
    robustaOrigins: ['India'],
    roast: 'Light-Medium تا Medium'
  },
  bold: {
    flavor: 'کاکائو، ادویه و طعم کلاسیک قهوه',
    acidity: 'کم',
    body: 'بالا',
    arabicaOrigins: ['Brazil', 'Colombia'],
    robustaOrigins: ['India', 'Uganda'],
    roast: 'Medium-Dark'
  },
  unsure: {
    flavor: 'شکلاتی، کاراملی و متعادل',
    acidity: 'کم تا متوسط',
    body: 'متوسط رو به بالا',
    arabicaOrigins: ['Brazil', 'Colombia'],
    robustaOrigins: ['India'],
    roast: 'Medium'
  }
} as const;

const brewLabels: Record<FindCoffeeAnswers['brew'], string> = {
  espresso: 'اسپرسوساز',
  moka: 'موکاپات',
  v60: 'V60 / پوراور',
  french: 'فرنچ‌پرس',
  filter: 'قهوه‌ساز فیلتری',
  unsure: 'مصرف عمومی / هنوز مشخص نیست'
};

const tiePriority: CoffeeLine[] = ['DECAF', 'LOW', 'HALF', 'FULL'];

export function findCoffeeMatch(answers: FindCoffeeAnswers): CoffeeMatch {
  const scores: Record<CoffeeLine, number> = {
    FULL: 0,
    HALF: 0,
    LOW: 0,
    DECAF: 0
  };

  const add = (line: CoffeeLine, value: number) => {
    scores[line] += value;
  };

  if (answers.time === 'morning') {
    add('FULL', 3);
    add('HALF', 1);
  } else if (answers.time === 'day') {
    add('HALF', 3);
    add('FULL', 1);
  } else if (answers.time === 'afternoon') {
    add('LOW', 3);
    add('HALF', 1);
  } else {
    add('DECAF', 5);
    add('LOW', 1);
  }

  if (answers.effect === 'strong') {
    add('FULL', 4);
    add('HALF', 1);
  } else if (answers.effect === 'balanced') {
    add('HALF', 4);
    add('LOW', 1);
  } else if (answers.effect === 'many') {
    add('LOW', 4);
    add('HALF', 1);
  } else {
    add('DECAF', 2);
    add('LOW', 3);
  }

  if (answers.sensitivity === 'none') {
    add('FULL', 3);
    add('HALF', 1);
  } else if (answers.sensitivity === 'some') {
    add('HALF', 4);
    add('LOW', 2);
  } else if (answers.sensitivity === 'high') {
    add('LOW', 5);
    add('DECAF', 1);
  } else {
    add('DECAF', 7);
    add('LOW', 2);
  }

  let line = tiePriority[0];
  for (const candidate of tiePriority) {
    if (scores[candidate] > scores[line]) line = candidate;
  }

  const meta = lineMeta[line];
  const taste = tasteProfiles[answers.taste];
  const brewLabel = brewLabels[answers.brew];

  let roast: string = taste.roast;
  if ((answers.brew === 'espresso' || answers.brew === 'moka') && answers.taste === 'fruity') {
    roast = 'Medium';
  } else if ((answers.brew === 'v60' || answers.brew === 'filter') && answers.taste !== 'bold') {
    roast = answers.taste === 'fruity' ? 'Light-Medium' : 'Medium';
  }

  const blendText = meta.decaf
    ? '۱۰۰٪ عربیکای دی‌کف'
    : meta.robustaPercent === 0
      ? '۱۰۰٪ عربیکا'
      : `${meta.arabicaPercent}٪ عربیکا + ${meta.robustaPercent}٪ روبوستا`;

  const arabicaText = taste.arabicaOrigins.join(' / ');
  const robustaText = meta.robustaPercent > 0 ? taste.robustaOrigins.join(' / ') : '';

  const roasteryBrief = [
    `یک قهوه ${blendText} می‌خوام`,
    `رُست ${roast}`,
    `با پروفایل ${taste.flavor}`,
    `اسیدیته ${taste.acidity}`,
    `بادی ${taste.body}`,
    `برای ${brewLabel}`,
    `ترجیحاً عربیکای ${arabicaText}${robustaText ? ` و روبوستای ${robustaText}` : ''}`
  ].join('، ') + '.';

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted[0][1];
  const second = sorted[1][1];
  const confidence = Math.max(82, Math.min(97, 86 + (top - second) * 2));

  const note = line === 'LOW'
    ? 'LOW یعنی شدت نسبی کافئین پایین‌تر از بلِندهای روبوستاپایه؛ این لاین دی‌کف نیست.'
    : line === 'DECAF'
      ? 'برای دی‌کف، فرآیند دی‌کف و تازگی رُست از نسبت عربیکا/روبوستا مهم‌تر است.'
      : 'این نسبت یک نقطه شروع کاربردی برای سفارش از رُستری است؛ هر رُستری ممکن است با دانه‌های خودش کمی تنظیمش کند.';

  return {
    line,
    ...meta,
    roast,
    flavor: taste.flavor,
    acidity: taste.acidity,
    body: taste.body,
    arabicaOrigins: [...taste.arabicaOrigins],
    robustaOrigins: meta.robustaPercent > 0 ? [...taste.robustaOrigins] : [],
    brewLabel,
    roasteryBrief,
    note,
    matchPercent: confidence
  };
}
