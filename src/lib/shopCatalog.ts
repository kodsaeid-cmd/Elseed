export type ShopSource = {
  supplier: 'Rio' | 'CafiMafi' | 'Aria';
  supplierLabel: string;
  code: string;
  product: string;
  url: string;
  composition: string;
  roast: string;
  weight: string;
  truth: string;
  status: 'primary' | 'backup' | 'candidate';
};

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
  truth: string[];
  brew: string[];
  tags: string[];
  priceLabel: string;
  sources: ShopSource[];
};

export const shopProducts: ShopProduct[] = [
  {
    slug: 'wake-up-call',
    name: 'WAKE UP CALL',
    persianName: 'زنگ بیدارباش',
    eyebrow: 'صبح جدی',
    character: 'همون رفیقی که صبح زنگ می‌زنه و نمی‌ذاره دوباره بخوابی.',
    story: 'برای صبح‌هایی که مغزت هنوز Login نشده و روز منتظر نمی‌مونه. این خانواده را از قهوه‌های روبوستای قوی می‌چینیم؛ حسش مستقیم، پرقدرت و بی‌حاشیه است.',
    bestMoment: '۶:۳۰ تا ۱۰ صبح · شروع‌های سنگین',
    personLine: 'ساعت ۷ زنگ می‌زد، می‌گفت «پاشو، امروز کار داریم» و قبل از جواب دادن قطع می‌کرد.',
    energy: 5,
    mood: 'morning',
    tone: 'energy',
    truth: ['قدرت بالا', 'بادی سنگین', 'تلخی پررنگ', 'مناسب اسپرسو و موکاپات'],
    brew: ['Espresso', 'Moka Pot'],
    tags: ['صبح', 'انرژی', 'قوی'],
    priceLabel: 'قیمت روز هنگام شروع فروش',
    sources: [
      {
        supplier: 'Rio',
        supplierLabel: 'قهوه ریو',
        code: 'RIO-STR-R100-DK-250',
        product: 'Strong Blend Dark 100% Robusta',
        url: 'https://www.rio.coffee/products/302023011009',
        composition: '100% Robusta',
        roast: 'Dark',
        weight: '250g',
        truth: 'ریو این محصول را بسیار قوی و تلخ معرفی می‌کند؛ مناسب نقش انرژی بالای این خانواده.',
        status: 'primary'
      },
      {
        supplier: 'CafiMafi',
        supplierLabel: 'کافی‌مافی',
        code: 'CM-UGA-R100-250',
        product: 'Uganda 100% Robusta',
        url: 'https://cafimafi.com/products/cf-512/cafimafi-uganda-robusta-coffee-beans',
        composition: '100% Robusta',
        roast: 'Supplier roast',
        weight: 'Variable',
        truth: 'گزینه روبوستای اوگاندا برای تست جایگزین تأمین و مقایسه Conversion.',
        status: 'backup'
      },
      {
        supplier: 'Aria',
        supplierLabel: 'قهوه آریا روناسیان',
        code: 'AR-R80-A20-250',
        product: 'Espresso 80% Robusta / 20% Arabica',
        url: 'https://aria-coffee.com/product/%D9%82%D9%87%D9%88%D9%87-%D8%A7%D8%B3%D9%BE%D8%B1%D8%B3%D9%88-%D9%88%DB%8C%DA%98%D9%87-%D8%A2%D8%B1%DB%8C%D8%A7-80%D8%B1%D9%88%D8%A8%D9%88%D8%B3%D8%AA%D8%A7/',
        composition: '80% Robusta / 20% Arabica',
        roast: 'Supplier roast',
        weight: '250g / 500g / 1kg',
        truth: 'آریا این ترکیب را پرکافئین و دارای فوم غلیظ معرفی می‌کند.',
        status: 'candidate'
      }
    ]
  },
  {
    slug: 'the-morning-friend',
    name: 'THE MORNING FRIEND',
    persianName: 'رفیق صبح',
    eyebrow: 'هر روز',
    character: 'هر روز هست؛ نه سرت داد می‌زنه، نه می‌ذاره خوابت ببره.',
    story: 'قرار نیست هر صبح انفجار انرژی باشد. این یکی برای مصرف روزمره است؛ تعادل بین عطر، قدرت و چیزی که هر روز بتوانی دوباره سراغش بروی.',
    bestMoment: '۷ تا ۱۲ · صبح روزهای معمولی',
    personLine: 'همیشه پنج دقیقه زودتر می‌رسید و قهوه‌اش هم قبل از تو آماده بود.',
    energy: 3,
    mood: 'morning',
    tone: 'daily',
    truth: ['متعادل', 'تلخی کنترل‌شده', 'مصرف روزمره', 'مناسب اسپرسو'],
    brew: ['Espresso', 'Moka Pot', 'French Press'],
    tags: ['روزمره', 'متعادل', 'صبح'],
    priceLabel: 'قیمت روز هنگام شروع فروش',
    sources: [
      {
        supplier: 'Rio',
        supplierLabel: 'قهوه ریو',
        code: 'RIO-META-A50-R50-MD-250',
        product: 'Meta Blend Medium 50% Arabica',
        url: 'https://www.rio.coffee/products/303029006009',
        composition: '50% Arabica / 50% Robusta',
        roast: 'Medium',
        weight: '250g',
        truth: 'ریو Meta Blend را متعادل و مناسب روزهای پرمشغله توصیف می‌کند.',
        status: 'primary'
      },
      {
        supplier: 'Aria',
        supplierLabel: 'قهوه آریا روناسیان',
        code: 'AR-A50-R50-250',
        product: 'Aria Blend 50% Arabica',
        url: 'https://aria-coffee.com/product/aria-blend-50-arabica/',
        composition: '50% Arabica / 50% Robusta',
        roast: 'Supplier roast',
        weight: 'Variable',
        truth: 'ترکیب 50/50 آریا برای تست یک پروفایل روزمره و متعادل.',
        status: 'backup'
      }
    ]
  },
  {
    slug: 'deep-work',
    name: 'DEEP WORK',
    persianName: 'تمرکز عمیق',
    eyebrow: 'بذار کار کنم',
    character: 'اون دوستی که کنارت می‌شینه، ساکته و می‌ذاره کارت رو تموم کنی.',
    story: 'این خانواده قرار نیست با شدت خودش حواست را پرت کند. هدفش یک فنجان خوش‌عطر و متعادل برای زمان‌هایی است که می‌خواهی چند ساعت روی کارت بمانی.',
    bestMoment: '۹ تا ۱۵ · کار عمیق و جلسه',
    personLine: 'گوشی‌اش همیشه روی Silent بود و وسط حرفت نمی‌پرید.',
    energy: 3,
    mood: 'focus',
    tone: 'focus',
    truth: ['عطر بیشتر', 'تعادل طعم و قدرت', 'مناسب مصرف طولانی‌تر', 'مدیوم'],
    brew: ['Espresso', 'V60', 'French Press'],
    tags: ['تمرکز', 'کار', 'متعادل'],
    priceLabel: 'قیمت روز هنگام شروع فروش',
    sources: [
      {
        supplier: 'Rio',
        supplierLabel: 'قهوه ریو',
        code: 'RIO-HOUSE-A70-R30-MD-250',
        product: 'House Bean 70% Arabica',
        url: 'https://www.rio.coffee/products/303033004009',
        composition: '70% Arabica / 30% Robusta',
        roast: 'Medium',
        weight: '250g',
        truth: 'ترکیب عربیکای آمریکای لاتین و روبوستای شرق آفریقا؛ ریو آن را برای مصرف روزانه معرفی می‌کند.',
        status: 'primary'
      },
      {
        supplier: 'Aria',
        supplierLabel: 'قهوه آریا روناسیان',
        code: 'AR-VELVET-A70-R30',
        product: 'Velvet Harmony 70% Arabica',
        url: 'https://aria-coffee.com/product/velvet-harmony-70-arabica/',
        composition: '70% Arabica / 30% Robusta',
        roast: 'Supplier roast',
        weight: 'Variable',
        truth: 'آریا این محصول را صاف، لطیف، متعادل و خوش‌عطر معرفی می‌کند.',
        status: 'backup'
      }
    ]
  },
  {
    slug: 'main-character',
    name: 'MAIN CHARACTER',
    persianName: 'نقش اول',
    eyebrow: 'صبح خوش‌استایل',
    character: 'قرار نیست فقط بیدار شی؛ قراره خوب وارد روزت شی.',
    story: 'اینجا عطر و تجربه جلوتر از زور قهوه است. برای صبح‌هایی که جلسه، قرار یا آخر هفته داری و می‌خواهی فنجانت هم کمی شخصیت داشته باشد.',
    bestMoment: '۸ تا ۱۳ · قرار، جلسه، آخر هفته',
    personLine: 'دیر نمی‌رسید؛ عطرش زودتر از خودش می‌رسید.',
    energy: 2,
    mood: 'style',
    tone: 'style',
    truth: ['عطر بالا', 'عربیکا غالب', 'تجربه نرم‌تر', 'تمرکز روی طعم'],
    brew: ['Espresso', 'V60', 'French Press'],
    tags: ['عطر', 'استایل', 'عربیکا'],
    priceLabel: 'قیمت روز هنگام شروع فروش',
    sources: [
      {
        supplier: 'CafiMafi',
        supplierLabel: 'کافی‌مافی',
        code: 'CM-COL-A100-250',
        product: 'Colombia 100% Arabica',
        url: 'https://cafimafi.com/products/cf-6/colombia-coffee',
        composition: '100% Arabica',
        roast: 'Supplier roast',
        weight: 'Variable',
        truth: 'کاندید عربیکای کلمبیا برای خانواده‌ای که عطر و شخصیت طعمی را جلو می‌آورد.',
        status: 'primary'
      },
      {
        supplier: 'Rio',
        supplierLabel: 'قهوه ریو',
        code: 'RIO-DENIRO-A100-MD-250',
        product: 'Deniro 100% Arabica',
        url: 'https://www.rio.coffee/products/303021001009',
        composition: '100% Arabica',
        roast: 'Medium',
        weight: '250g',
        truth: 'ریو Deniro را با رایحه زیاد، تلخی متوسط و ترکیب عربیکای آمریکای لاتین و شرق آفریقا معرفی می‌کند.',
        status: 'backup'
      },
      {
        supplier: 'Aria',
        supplierLabel: 'قهوه آریا روناسیان',
        code: 'AR-SMOOTH-A80-R20',
        product: 'Smooth Balance 80% Arabica',
        url: 'https://aria-coffee.com/product/smooth-balance-aria-coffee-80-arabica/',
        composition: '80% Arabica / 20% Robusta',
        roast: 'Supplier roast',
        weight: 'Variable',
        truth: 'آریا این ترکیب را نرم، متعادل و خوش‌عطر معرفی می‌کند.',
        status: 'candidate'
      }
    ]
  },
  {
    slug: 'take-five',
    name: 'TAKE FIVE',
    persianName: 'پنج دقیقه برای خودت',
    eyebrow: 'وسط روز',
    character: 'همون رفیقی که وسط شلوغی می‌گه: «ولش کن، پنج دقیقه بشین.»',
    story: 'قهوه‌ای برای مکث کوتاه وسط کار؛ نه مراسم مفصل، نه فشار برای بیشتر کار کردن. پنج دقیقه که مال خودت باشد.',
    bestMoment: '۱۲ تا ۱۷ · بین دو کار',
    personLine: 'وسط شلوغ‌ترین روز می‌گفت: «اول قهوه، بعد ادامه.»',
    energy: 3,
    mood: 'break',
    tone: 'break',
    truth: ['متعادل', 'عطر خوشایند', 'چندروش دم‌آوری', 'مناسب استراحت کوتاه'],
    brew: ['Espresso', 'Moka Pot', 'French Press', 'Filter'],
    tags: ['استراحت', 'ظهر', 'دورهمی'],
    priceLabel: 'قیمت روز هنگام شروع فروش',
    sources: [
      {
        supplier: 'Rio',
        supplierLabel: 'قهوه ریو',
        code: 'RIO-CB-A70-250',
        product: 'Coffee Break 70% Arabica',
        url: 'https://www.rio.coffee/products/303020004009',
        composition: '70% Arabica / 30% Robusta',
        roast: 'Supplier roast',
        weight: '250g',
        truth: 'خود ریو Coffee Break را برای استراحت میان روز و چند روش دم‌آوری معرفی می‌کند.',
        status: 'primary'
      },
      {
        supplier: 'Aria',
        supplierLabel: 'قهوه آریا روناسیان',
        code: 'AR-SMOOTH-A80-R20',
        product: 'Smooth Balance 80% Arabica',
        url: 'https://aria-coffee.com/product/smooth-balance-aria-coffee-80-arabica/',
        composition: '80% Arabica / 20% Robusta',
        roast: 'Supplier roast',
        weight: 'Variable',
        truth: 'کاندید نرم‌تر برای تست رفتار کاربر در Mood استراحت.',
        status: 'candidate'
      }
    ]
  },
  {
    slug: 'after-five',
    name: 'AFTER FIVE',
    persianName: 'بعد از پنج',
    eyebrow: 'هنوز یه فنجون',
    character: 'هنوز دلت قهوه می‌خواد؛ ولی لازم نیست شب رو هم باهاش بیدار بمونی.',
    story: 'این خانواده برای کسی است که تجربه قهوه را بعدازظهر یا شب هم می‌خواهد. انتخاب‌های این Mood فقط از SKUهای Decaf یا کم‌کافئین تأییدشده وارد فروش می‌شوند.',
    bestMoment: 'بعد از ۱۷ · عصر و شب',
    personLine: 'همون دوستی بود که می‌گفت «یه فنجون دیگه» و فردا صبح هم سر وقت بیدار می‌شد.',
    energy: 1,
    mood: 'evening',
    tone: 'evening',
    truth: ['Decaf / Low caffeine', 'برای ساعات دیرتر', 'تمرکز روی تجربه قهوه', 'بدون وعده پزشکی'],
    brew: ['Espresso', 'Moka Pot', 'French Press'],
    tags: ['عصر', 'دیکف', 'آرام‌تر'],
    priceLabel: 'قیمت روز هنگام شروع فروش',
    sources: [
      {
        supplier: 'Rio',
        supplierLabel: 'قهوه ریو',
        code: 'RIO-DECAF-MD-250',
        product: 'Decaffein Medium',
        url: 'https://www.rio.coffee/products/303010001009',
        composition: 'Decaffeinated coffee',
        roast: 'Medium',
        weight: '250g',
        truth: 'ریو یک قهوه بدون کافئین مدیوم 250 گرمی با تلخی و اسیدیته متوسط عرضه می‌کند.',
        status: 'primary'
      }
    ]
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
