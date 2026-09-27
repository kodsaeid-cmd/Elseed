export type InternalShopSource = {
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

export const internalShopSourcing: Record<string, InternalShopSource[]> = {
  'wake-up-call': [
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
  ],
  'the-morning-friend': [
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
  ],
  'deep-work': [
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
  ],
  'main-character': [
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
  ],
  'take-five': [
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
  ],
  'after-five': [
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
};

export function sourcingForProduct(slug: string) {
  return internalShopSourcing[slug] ?? [];
}
