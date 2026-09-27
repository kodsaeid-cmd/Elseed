<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';

  let { data } = $props();
  const product = $derived(data.product);
  const primarySource = $derived(product.sources.find((source) => source.status === 'primary') ?? product.sources[0]);
</script>

<svelte:head>
  <title>{product.name} | فروشگاه EL.SEED</title>
  <meta name="description" content={product.character + ' ' + product.story} />
</svelte:head>

<Header />

<main class={'product-page tone-' + product.tone}>
  <section class="product-hero shell">
    <div class="product-hero-visual">
      <div class="hero-pouch">
        <span class="hero-pouch-brand">EL.SEED</span>
        <span class="hero-pouch-kicker">{product.eyebrow}</span>
        <strong>{product.name}</strong>
        <small>{product.persianName}</small>
        <div class="hero-pouch-energy">
          <span>ENERGY</span>
          <b>{'●'.repeat(product.energy)}{'○'.repeat(5 - product.energy)}</b>
        </div>
        <em>GOOD COFFEE.<br />BETTER DAYS.</em>
      </div>
      <div class="hero-sticker">{product.tags[0]}</div>
    </div>

    <div class="product-hero-copy">
      <span class="product-kicker">EL.SEED CHARACTER COFFEE</span>
      <h1>{product.name}</h1>
      <h2>{product.character}</h2>
      <p>{product.story}</p>

      <div class="hero-facts">
        <div>
          <span>بهترین وقت</span>
          <strong>{product.bestMoment}</strong>
        </div>
        <div>
          <span>انرژی</span>
          <strong class="energy-dots">{'●'.repeat(product.energy)}{'○'.repeat(5 - product.energy)}</strong>
        </div>
      </div>

      <div class="product-buybox">
        <div>
          <small>فاز صفر · قیمت</small>
          <strong>{product.priceLabel}</strong>
        </div>
        <button type="button" disabled>خرید فاز صفر · به‌زودی</button>
      </div>

      <p class="buybox-note">قیمت نهایی با اتصال موجودی و تأمین روزانه فعال می‌شود.</p>
    </div>
  </section>

  <section class="person-card shell">
    <span>IF THIS COFFEE WAS A PERSON...</span>
    <p>«{product.personLine}»</p>
  </section>

  <section class="truth-section shell">
    <div class="truth-copy">
      <span>WHAT'S REALLY INSIDE?</span>
      <h2>حس اول میاد.<br />واقعیت محصول هم سر جاشه.</h2>
      <p>
        مشخصات فنی حذف نشده؛ فقط از تیتر اول محصول کنار رفته.
        اینجا می‌تونی ببینی Mood امروز روی چه قهوه واقعی‌ای سوار شده.
      </p>
    </div>

    <div class="truth-card">
      <div class="truth-card-head">
        <span>PRIMARY SOURCE · PHASE ZERO</span>
        <strong>{primarySource.supplierLabel}</strong>
      </div>
      <h3>{primarySource.product}</h3>
      <div class="truth-specs">
        <div><span>ترکیب</span><strong>{primarySource.composition}</strong></div>
        <div><span>رُست</span><strong>{primarySource.roast}</strong></div>
        <div><span>وزن تست</span><strong>{primarySource.weight}</strong></div>
        <div><span>SKU منبع</span><strong dir="ltr">{primarySource.code}</strong></div>
      </div>
      <p>{primarySource.truth}</p>
    </div>
  </section>

  <section class="coffee-facts shell">
    <article>
      <span>BEST WITH</span>
      <div class="brew-list">
        {#each product.brew as method}<b>{method}</b>{/each}
      </div>
    </article>
    <article>
      <span>EL.SEED TRUTH</span>
      <div class="truth-tags">
        {#each product.truth as item}<b>{item}</b>{/each}
      </div>
    </article>
    <article class="verified-fact">
      <span>COFFEE FACT</span>
      <strong>Celebrity Fact فقط وقتی منتشر می‌شه که منبع معتبر داشته باشه.</strong>
      <p>تا وقتی Fact تأیید نشده، این بخش چیزی اختراع نمی‌کنه.</p>
    </article>
  </section>

  <section class="source-lab shell" id="source-lab">
    <header>
      <div>
        <span>SOURCE LAB</span>
        <h2>پشت این شخصیت چه قهوه‌هایی می‌تونن باشن؟</h2>
      </div>
      <p>
        Mood ثابت می‌مونه؛ تأمین‌کننده قابل‌تعویضه. این همون چیزی‌یه که بعداً اجازه می‌ده
        از SKU خرده‌فروشی به گونی و فرمول اختصاصی برسیم.
      </p>
    </header>

    <div class="source-grid">
      {#each product.sources as source}
        <article class:primary={source.status === 'primary'}>
          <div class="source-top">
            <span>{source.status === 'primary' ? 'PRIMARY' : source.status === 'backup' ? 'BACKUP' : 'CANDIDATE'}</span>
            <strong>{source.supplierLabel}</strong>
          </div>
          <h3>{source.product}</h3>
          <dl>
            <div><dt>Composition</dt><dd>{source.composition}</dd></div>
            <div><dt>Roast</dt><dd>{source.roast}</dd></div>
            <div><dt>Weight</dt><dd>{source.weight}</dd></div>
          </dl>
          <code>{'ES-' + product.slug.toUpperCase().replaceAll('-', '') + '-' + source.code}</code>
          <p>{source.truth}</p>
          <a href={source.url} target="_blank" rel="noreferrer">صفحه منبع</a>
        </article>
      {/each}
    </div>
  </section>

  <section class="product-logic shell">
    <div>
      <span>WHAT WE'RE TESTING</span>
      <h2>ما داریم اسم دانه رو تست نمی‌کنیم؛ داریم «شخصیت» رو تست می‌کنیم.</h2>
    </div>
    <p>
      اگر {product.name} فروش و تکرار خرید خوبی بگیره، مرحله بعد خرید عمده و ساخت Product Specification خود EL.SEED برای همین شخصیت خواهد بود.
    </p>
  </section>

  <section class="back-shop shell">
    <a href="/shop">همه شخصیت‌های فروشگاه</a>
    <a href="/find">کمکم کن انتخاب کنم</a>
  </section>
</main>

<Footer />

<style>
  .product-page{padding-bottom:30px;background:var(--cream)}
  .product-hero{min-height:650px;display:grid;grid-template-columns:.95fr 1.05fr;gap:50px;align-items:center;padding-block:52px}
  .product-hero-visual{min-height:560px;border-radius:32px;display:grid;place-items:center;position:relative;overflow:hidden;background:#eadccf}.tone-energy .product-hero-visual{background:#cfa17d}.tone-daily .product-hero-visual{background:#ead3b7}.tone-focus .product-hero-visual{background:#c9c9ae}.tone-style .product-hero-visual{background:#edc8c2}.tone-break .product-hero-visual{background:#d6c5ad}.tone-evening .product-hero-visual{background:#c6cdb4}.product-hero-visual:after{content:'';position:absolute;width:400px;height:400px;border-radius:50%;background:rgba(255,255,255,.26);right:-130px;bottom:-160px}
  .hero-pouch{position:relative;z-index:2;width:300px;height:455px;padding:34px 30px;border:1px solid rgba(62,39,32,.18);border-radius:13px 13px 30px 30px;background:#fff8ed;box-shadow:0 28px 65px rgba(62,39,32,.18);display:flex;flex-direction:column;overflow:hidden;direction:ltr;transform:rotate(-2deg)}.hero-pouch:before{content:'';position:absolute;left:0;right:0;top:18px;height:2px;border-top:1px solid rgba(62,39,32,.16);border-bottom:1px solid rgba(62,39,32,.08)}.hero-pouch-brand{font-size:12px;font-weight:900;letter-spacing:.25em}.hero-pouch-kicker{margin-top:58px;font-family:'Vazirmatn',sans-serif;direction:rtl;text-align:left;font-size:10px;color:#a06c42}.hero-pouch>strong{margin-top:10px;font:900 45px/1 Arial,sans-serif;letter-spacing:-.075em}.hero-pouch>small{margin-top:10px;direction:rtl;text-align:left;font-family:'Vazirmatn',sans-serif;font-size:11px}.hero-pouch-energy{margin-top:auto;display:grid;gap:3px}.hero-pouch-energy span{font-size:8px;letter-spacing:.18em}.hero-pouch-energy b{font-size:12px;letter-spacing:.09em}.hero-pouch em{margin-top:15px;font:700 9px/1.4 Arial,sans-serif;letter-spacing:.13em}.hero-sticker{position:absolute;z-index:3;right:45px;top:42px;width:84px;height:84px;border-radius:50%;background:#fff9f1;display:grid;place-items:center;text-align:center;font-size:11px;font-weight:900;transform:rotate(8deg);box-shadow:0 10px 26px rgba(62,39,32,.09)}
  .product-kicker,.truth-copy>span,.person-card>span,.source-lab header span,.coffee-facts article>span,.product-logic span{display:block;direction:ltr;color:var(--caramel);font-size:10px;font-weight:900;letter-spacing:.18em}.product-hero-copy h1{direction:ltr;text-align:right;margin:12px 0 6px;font:900 clamp(45px,5vw,70px)/1 Arial,sans-serif;letter-spacing:-.065em}.product-hero-copy h2{margin:18px 0 12px;font-size:29px;line-height:1.65}.product-hero-copy>p{margin:0;color:rgba(62,39,32,.66);font-size:14px;line-height:2;max-width:560px}
  .hero-facts{margin-top:28px;padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:20px}.hero-facts>div{display:grid;gap:4px}.hero-facts span{font-size:9px;color:rgba(62,39,32,.45)}.hero-facts strong{font-size:12px}.energy-dots{direction:ltr;text-align:right;letter-spacing:.08em}
  .product-buybox{margin-top:25px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:15px 17px;border-radius:17px;background:rgba(255,255,255,.54);border:1px solid var(--line)}.product-buybox>div{display:grid;gap:4px}.product-buybox small{font-size:9px;color:rgba(62,39,32,.46)}.product-buybox strong{font-size:12px}.product-buybox button{min-height:44px;padding:0 16px;border:0;border-radius:999px;background:var(--espresso);color:white;font:inherit;font-size:10px;font-weight:900;opacity:.55}.buybox-note{margin-top:8px!important;font-size:9px!important;color:rgba(62,39,32,.42)!important}

  .person-card{min-height:190px;padding:38px 46px;border-radius:26px;background:#3e2720;color:#fff8ef;display:flex;flex-direction:column;justify-content:center}.person-card>span{color:#e5ad73}.person-card p{margin:13px 0 0;font-size:clamp(24px,3.2vw,40px);line-height:1.8;font-weight:800;max-width:900px}

  .truth-section{margin-top:18px;display:grid;grid-template-columns:.8fr 1.2fr;gap:18px}.truth-copy,.truth-card{min-height:330px;padding:34px;border:1px solid var(--line);border-radius:24px;background:rgba(255,255,255,.52)}.truth-copy{display:flex;flex-direction:column;justify-content:center}.truth-copy h2{margin:10px 0 12px;font-size:35px;line-height:1.55}.truth-copy p{margin:0;color:rgba(62,39,32,.62);font-size:12.5px;line-height:1.95}.truth-card-head{display:flex;justify-content:space-between;gap:14px}.truth-card-head span{font-size:8px;color:rgba(62,39,32,.4);letter-spacing:.13em;direction:ltr}.truth-card-head strong{font-size:11px}.truth-card h3{margin:30px 0 17px;font-size:24px;direction:ltr;text-align:right}.truth-specs{display:grid;grid-template-columns:1fr 1fr;gap:8px}.truth-specs>div{padding:11px;border-radius:11px;background:#f7eee4;display:grid;gap:3px}.truth-specs span{font-size:8px;color:rgba(62,39,32,.44)}.truth-specs strong{font-size:10px}.truth-card>p{margin:16px 0 0;color:rgba(62,39,32,.62);font-size:11px;line-height:1.85}

  .coffee-facts{margin-top:18px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.coffee-facts article{min-height:190px;padding:24px;border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.48)}.brew-list,.truth-tags{margin-top:26px;display:flex;flex-wrap:wrap;gap:6px}.brew-list b,.truth-tags b{min-height:34px;padding:0 10px;border-radius:999px;background:#f2e5d7;display:inline-flex;align-items:center;font-size:9px}.verified-fact strong{display:block;margin-top:26px;font-size:14px;line-height:1.8}.verified-fact p{margin:8px 0 0;color:rgba(62,39,32,.56);font-size:10px;line-height:1.8}

  .source-lab{padding-top:58px}.source-lab header{display:flex;justify-content:space-between;align-items:end;gap:30px}.source-lab header h2{margin:7px 0 0;font-size:34px}.source-lab header p{max-width:460px;margin:0;color:rgba(62,39,32,.58);font-size:11.5px;line-height:1.9}.source-grid{margin-top:18px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.source-grid article{min-height:340px;padding:22px;border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.48);display:flex;flex-direction:column}.source-grid article.primary{background:#fffaf3;box-shadow:0 15px 40px rgba(62,39,32,.05)}.source-top{display:flex;justify-content:space-between;gap:12px}.source-top span{font-size:8px;letter-spacing:.13em;color:var(--caramel)}.source-top strong{font-size:10px}.source-grid h3{margin:26px 0 12px;font-size:18px;line-height:1.6}.source-grid dl{margin:0;display:grid;gap:6px}.source-grid dl>div{display:flex;justify-content:space-between;gap:10px;padding-bottom:6px;border-bottom:1px solid rgba(62,39,32,.07)}.source-grid dt{font-size:8px;color:rgba(62,39,32,.44)}.source-grid dd{margin:0;font-size:9px;text-align:left;direction:ltr}.source-grid code{display:block;margin-top:12px;padding:9px;border-radius:9px;background:#f1e5d8;font-size:7.5px;overflow-wrap:anywhere;direction:ltr}.source-grid p{margin:12px 0 0;color:rgba(62,39,32,.56);font-size:9.5px;line-height:1.8}.source-grid a{margin-top:auto;padding-top:16px;font-size:9px;font-weight:800;text-decoration:underline;text-underline-offset:3px}

  .product-logic{margin-top:52px;padding:34px;border-radius:24px;background:#f1e3d3;display:grid;grid-template-columns:1.1fr .9fr;gap:36px;align-items:center}.product-logic h2{margin:8px 0 0;font-size:30px;line-height:1.55}.product-logic>p{margin:0;color:rgba(62,39,32,.62);font-size:12px;line-height:1.95}.back-shop{margin-top:18px;display:flex;justify-content:center;gap:8px}.back-shop a{min-height:42px;padding:0 15px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.5);display:inline-flex;align-items:center;font-size:10px;font-weight:800}.back-shop a:first-child{background:var(--espresso);color:#fff;border-color:var(--espresso)}

  @media(max-width:900px){.product-hero{grid-template-columns:1fr}.product-hero-visual{min-height:500px}.truth-section{grid-template-columns:1fr}.coffee-facts{grid-template-columns:1fr}.source-grid{grid-template-columns:1fr 1fr}.product-logic{grid-template-columns:1fr}.source-lab header{align-items:flex-start;flex-direction:column}}
  @media(max-width:600px){.product-hero{padding-top:28px}.product-hero-visual{min-height:430px}.hero-pouch{width:245px;height:380px}.hero-pouch>strong{font-size:36px}.hero-sticker{right:22px;top:22px}.product-hero-copy h1{font-size:45px}.product-hero-copy h2{font-size:24px}.hero-facts{grid-template-columns:1fr}.product-buybox{align-items:stretch;flex-direction:column}.product-buybox button{width:100%}.person-card{padding:28px 24px}.truth-copy,.truth-card{padding:24px}.truth-specs{grid-template-columns:1fr}.source-grid{grid-template-columns:1fr}.back-shop{align-items:stretch;flex-direction:column}.back-shop a{justify-content:center}}
</style>
