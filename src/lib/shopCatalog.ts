export type ShopProduct = {
  slug: string;
  name: string;
  persianName: string;
  eyebrow: string;
  character: string;
  story: string;
  bestMoment: string;
  personLine: string;
  energy: number;
  mood: 'morning' | 'focus' | 'style' | 'break' | 'evening';
  tone: 'energy' | 'daily' | 'focus' | 'style' | 'break' | 'evening';
  image: string;
  imageAlt: string;
  truth: string[];
  brew: string[];
  tags: string[];
  priceLabel: string;
};

export const shopProducts: ShopProduct[] = [
  {
    slug: 'wake-up-call',
    name: 'WAKE UP CALL',
    persianName: 'زنگ بیدارباش',
    eyebrow: 'صبح جدی',
    character: 'همون رفیقی که صبح زنگ می‌زنه و نمی‌ذاره دوباره بخوابی.',
    story: 'برای صبح‌هایی که مغزت هنوز Login نشده و روز منتظر نمی‌مونه. فنجونی مستقیم، پرقدرت و بی‌حاشیه برای شروع‌های جدی.',
    bestMoment: '۶:۳۰ تا ۱۰ صبح · شروع‌های سنگین',
    personLine: 'ساعت ۷ زنگ می‌زد، می‌گفت «پاشو، امروز کار داریم» و قبل از جواب دادن قطع می‌کرد.',
    energy: 5,
    mood: 'morning',
    tone: 'energy',
    image: '/media/espresso',
    imageAlt: 'اسپرسوی غلیظ برای شروع پرانرژی صبح',
    truth: ['قدرت بالا', 'بادی سنگین', 'تلخی پررنگ', 'مناسب اسپرسو و موکاپات'],
    brew: ['Espresso', 'Moka Pot'],
    tags: ['صبح', 'انرژی', 'قوی'],
    priceLabel: 'قیمت روز'
  },
  {
    slug: 'the-morning-friend',
    name: 'THE MORNING FRIEND',
    persianName: 'رفیق صبح',
    eyebrow: 'هر روز',
    character: 'هر روز هست؛ نه سرت داد می‌زنه، نه می‌ذاره خوابت ببره.',
    story: 'برای صبح‌های معمولی؛ وقتی یک قهوه قابل‌اعتماد می‌خوای که هر روز دوباره سراغش بری و زیادی هم شلوغش نکنه.',
    bestMoment: '۷ تا ۱۲ · صبح روزهای معمولی',
    personLine: 'همیشه پنج دقیقه زودتر می‌رسید و قهوه‌اش هم قبل از تو آماده بود.',
    energy: 3,
    mood: 'morning',
    tone: 'daily',
    image: '/media/find/time-morning-human-v4.webp',
    imageAlt: 'آدمی در شروع آرام صبح با فنجان قهوه',
    truth: ['متعادل', 'تلخی کنترل‌شده', 'مصرف روزمره', 'مناسب اسپرسو'],
    brew: ['Espresso', 'Moka Pot', 'French Press'],
    tags: ['روزمره', 'متعادل', 'صبح'],
    priceLabel: 'قیمت روز'
  },
  {
    slug: 'deep-work',
    name: 'DEEP WORK',
    persianName: 'تمرکز عمیق',
    eyebrow: 'بذار کار کنم',
    character: 'اون دوستی که کنارت می‌شینه، ساکته و می‌ذاره کارت رو تموم کنی.',
    story: 'برای وقتی که چند ساعت تمرکز می‌خوای؛ یک فنجان خوش‌عطر و متعادل که خودش تبدیل به حواس‌پرتی نشه.',
    bestMoment: '۹ تا ۱۵ · کار عمیق و جلسه',
    personLine: 'گوشی‌اش همیشه روی Silent بود و وسط حرفت نمی‌پرید.',
    energy: 3,
    mood: 'focus',
    tone: 'focus',
    image: '/media/find/effect-balanced-human-v3.png',
    imageAlt: 'فردی در حال کار و تمرکز با قهوه روی میز',
    truth: ['عطر بیشتر', 'تعادل طعم و قدرت', 'مناسب مصرف طولانی‌تر', 'مدیوم'],
    brew: ['Espresso', 'V60', 'French Press'],
    tags: ['تمرکز', 'کار', 'متعادل'],
    priceLabel: 'قیمت روز'
  },
  {
    slug: 'main-character',
    name: 'MAIN CHARACTER',
    persianName: 'نقش اول',
    eyebrow: 'صبح خوش‌استایل',
    character: 'قرار نیست فقط بیدار شی؛ قراره خوب وارد روزت شی.',
    story: 'اینجا عطر و تجربه جلوتر از زور قهوه است؛ برای جلسه، قرار، آخر هفته یا هر صبحی که دلت می‌خواد کمی خوش‌استایل‌تر شروع شه.',
    bestMoment: '۸ تا ۱۳ · قرار، جلسه، آخر هفته',
    personLine: 'دیر نمی‌رسید؛ عطرش زودتر از خودش می‌رسید.',
    energy: 2,
    mood: 'style',
    tone: 'style',
    image: '/media/me',
    imageAlt: 'لحظه شخصی و خوش‌استایل با یک فنجان قهوه',
    truth: ['عطر بالا', 'عربیکا غالب', 'تجربه نرم‌تر', 'تمرکز روی طعم'],
    brew: ['Espresso', 'V60', 'French Press'],
    tags: ['عطر', 'استایل', 'عربیکا'],
    priceLabel: 'قیمت روز'
  },
  {
    slug: 'take-five',
    name: 'TAKE FIVE',
    persianName: 'پنج دقیقه برای خودت',
    eyebrow: 'وسط روز',
    character: 'همون رفیقی که وسط شلوغی می‌گه: «ولش کن، پنج دقیقه بشین.»',
    story: 'برای مکث کوتاه وسط روز؛ نه مراسم مفصل، نه فشار برای بیشتر کار کردن. فقط پنج دقیقه که مال خودت باشه.',
    bestMoment: '۱۲ تا ۱۷ · بین دو کار',
    personLine: 'وسط شلوغ‌ترین روز می‌گفت: «اول قهوه، بعد ادامه.»',
    energy: 3,
    mood: 'break',
    tone: 'break',
    image: '/images/time-afternoon-v2.webp',
    imageAlt: 'استراحت عصرگاهی با قهوه در فضای روشن و آرام',
    truth: ['متعادل', 'عطر خوشایند', 'چندروش دم‌آوری', 'مناسب استراحت کوتاه'],
    brew: ['Espresso', 'Moka Pot', 'French Press', 'Filter'],
    tags: ['استراحت', 'ظهر', 'دورهمی'],
    priceLabel: 'قیمت روز'
  },
  {
    slug: 'after-five',
    name: 'AFTER FIVE',
    persianName: 'بعد از پنج',
    eyebrow: 'هنوز یه فنجون',
    character: 'هنوز دلت قهوه می‌خواد؛ ولی لازم نیست شب رو هم باهاش بیدار بمونی.',
    story: 'برای وقتی که تجربه قهوه رو عصر و شب هم می‌خوای؛ انتخابی آرام‌تر برای ادامه دادن حال خوب فنجون، بدون اینکه قرار باشه چیزی رو ثابت کنی.',
    bestMoment: 'بعد از ۱۷ · عصر و شب',
    personLine: 'همون دوستی بود که می‌گفت «یه فنجون دیگه» و فردا صبح هم سر وقت بیدار می‌شد.',
    energy: 1,
    mood: 'evening',
    tone: 'evening',
    image: '/media/philosophy',
    imageAlt: 'فنجان قهوه در فضای آرام و گرم عصرگاهی',
    truth: ['Decaf / Low caffeine', 'برای ساعات دیرتر', 'تمرکز روی تجربه قهوه', 'بدون وعده پزشکی'],
    brew: ['Espresso', 'Moka Pot', 'French Press'],
    tags: ['عصر', 'دیکف', 'آرام‌تر'],
    priceLabel: 'قیمت روز'
  }
];

export const moodFilters = [
  { key: 'all', label: 'همه شخصیت‌ها' },
  { key: 'morning', label: 'صبحم رو راه بنداز' },
  { key: 'focus', label: 'بذار کار کنم' },
  { key: 'style', label: 'امروز خوش‌استایل' },
  { key: 'break', label: 'یه مکث می‌خوام' },
  { key: 'evening', label: 'هنوز یه فنجون' }
] as const;

export function getShopProduct(slug: string) {
  return shopProducts.find((product) => product.slug === slug);
}

export function productForProfile(profile: any) {
  const line = String(profile?.preferences?.line ?? '');
  const sleep = String(profile?.signals?.['caffeine.sleep']?.value ?? '');
  const afternoon = String(profile?.signals?.['habit.afternoon']?.value ?? '');

  if (line === 'DECAF' || sleep === 'yes') return getShopProduct('after-five');
  if (line === 'FULL') return getShopProduct('wake-up-call');
  if (line === 'HALF') return getShopProduct('the-morning-friend');
  if (line === 'LOW') return getShopProduct('main-character');
  if (afternoon === 'focus') return getShopProduct('deep-work');
  if (afternoon === 'social') return getShopProduct('take-five');

  return null;
}
