<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';

  let { data } = $props();
  const product = $derived(data.product);
</script>

<svelte:head>
  <title>{product.name} | فروشگاه EL.SEED</title>
  <meta name="description" content={product.character + ' ' + product.story} />
</svelte:head>

<Header />

<main class="product-page">
  <section class="product-hero shell">
    <div class="product-photo">
      <img src={product.image} alt={product.imageAlt} />
      <div class="photo-label">
        <span>{product.eyebrow}</span>
        <strong>{product.name}</strong>
      </div>
    </div>

    <div class="product-copy">
      <span class="product-kicker">EL.SEED CHARACTER COFFEE</span>
      <h1>{product.name}</h1>
      <h2>{product.character}</h2>
      <p>{product.story}</p>

      <div class="quick-facts">
        <div>
          <span>بهترین وقت</span>
          <strong>{product.bestMoment}</strong>
        </div>
        <div>
          <span>انرژی</span>
          <strong class="energy-dots">{'●'.repeat(product.energy)}{'○'.repeat(5 - product.energy)}</strong>
        </div>
      </div>

      <div class="buy-box">
        <div>
          <small>{product.persianName}</small>
          <strong>{product.priceLabel}</strong>
        </div>
        <button type="button" disabled>خرید · به‌زودی</button>
      </div>
      <small class="availability-note">موجودی و خرید آنلاین در مرحله اتصال نهایی فروشگاه فعال می‌شود.</small>
    </div>
  </section>

  <section class="person-card shell">
    <div>
      <span>IF THIS COFFEE WAS A PERSON...</span>
      <p>«{product.personLine}»</p>
    </div>
  </section>

  <section class="experience-grid shell">
    <article class="experience-card">
      <span>BEST WITH</span>
      <h2>چطور دوستش داری؟</h2>
      <div class="pills">
        {#each product.brew as method}<b>{method}</b>{/each}
      </div>
    </article>

    <article class="experience-card">
      <span>THE FEEL</span>
      <h2>قبل از عددها، این حسشه.</h2>
      <div class="pills">
        {#each product.truth as item}<b>{item}</b>{/each}
      </div>
    </article>

    <article class="experience-card fact-card">
      <span>COFFEE FACT</span>
      <h2>فکت واقعی، نه داستان ساختگی.</h2>
      <p>اگر برای این قهوه Fact تاریخی یا Celebrity معتبر داشته باشیم، با منبع تأییدشده همین‌جا نمایش داده می‌شود.</p>
    </article>
  </section>

  <section class="product-story shell">
    <div class="story-photo">
      <img src={product.image} alt="" loading="lazy" />
    </div>
    <div class="story-copy">
      <span>WHY THIS ONE</span>
      <h2>قهوه‌ای برای یک موقعیت واقعی.</h2>
      <p>{product.story}</p>
      <blockquote>«{product.personLine}»</blockquote>
    </div>
  </section>

  <section class="truth-section shell">
    <div>
      <span>PRODUCT TRUTH</span>
      <h2>اطلاعات فنی هنوز مهمه؛ فقط تیتر اول نیست.</h2>
    </div>
    <div class="truth-list">
      {#each product.truth as item}
        <span>{item}</span>
      {/each}
    </div>
  </section>

  <section class="back-shop shell">
    <a class="primary" href="/shop">همه شخصیت‌های فروشگاه</a>
    <a href="/find">کمکم کن انتخاب کنم</a>
  </section>
</main>

<Footer />

<style>
  .product-page{padding-bottom:34px;background:radial-gradient(circle at 90% 5%,rgba(247,201,195,.15),transparent 25%),var(--cream)}
  .product-hero{min-height:650px;display:grid;grid-template-columns:1.08fr .92fr;gap:42px;align-items:center;padding-block:44px}
  .product-photo{position:relative;min-height:560px;border-radius:30px;overflow:hidden;background:#ddcdbc}.product-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.88) contrast(.98)}.product-photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(36,24,18,.6) 100%)}.photo-label{position:absolute;z-index:2;left:25px;right:25px;bottom:24px;color:#fff;display:grid;gap:5px}.photo-label span{font-size:10px}.photo-label strong{direction:ltr;text-align:right;font:900 clamp(36px,4vw,56px)/.95 Arial,sans-serif;letter-spacing:-.06em}
  .product-kicker,.experience-card>span,.story-copy>span,.truth-section>div:first-child>span,.person-card span{display:block;direction:ltr;color:var(--caramel);font-size:10px;font-weight:900;letter-spacing:.18em}.product-copy h1{direction:ltr;text-align:right;margin:12px 0 8px;font:900 clamp(46px,5vw,72px)/.95 Arial,sans-serif;letter-spacing:-.07em}.product-copy h2{margin:20px 0 12px;font-size:29px;line-height:1.65}.product-copy>p{margin:0;color:rgba(62,39,32,.65);font-size:14px;line-height:2}
  .quick-facts{margin-top:27px;padding:17px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:18px}.quick-facts>div{display:grid;gap:4px}.quick-facts span{font-size:9px;color:rgba(62,39,32,.45)}.quick-facts strong{font-size:11.5px}.energy-dots{direction:ltr;text-align:right;letter-spacing:.08em}
  .buy-box{margin-top:24px;padding:14px 16px;border-radius:17px;border:1px solid var(--line);background:rgba(255,255,255,.58);display:flex;align-items:center;justify-content:space-between;gap:18px}.buy-box>div{display:grid;gap:3px}.buy-box small{font-size:9px;color:rgba(62,39,32,.47)}.buy-box strong{font-size:12px}.buy-box button{min-height:44px;padding:0 17px;border:0;border-radius:999px;background:var(--espresso);color:#fff;font:inherit;font-size:10px;font-weight:900;opacity:.55}.availability-note{display:block;margin-top:8px;color:rgba(62,39,32,.42);font-size:8.5px;line-height:1.7}

  .person-card{min-height:190px;padding:38px 44px;border-radius:25px;background:#3e2720;color:#fff9f0;display:flex;align-items:center}.person-card span{color:#e6b17b}.person-card p{margin:12px 0 0;max-width:930px;font-size:clamp(23px,3.1vw,39px);font-weight:800;line-height:1.8}

  .experience-grid{margin-top:17px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.experience-card{min-height:235px;padding:26px;border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.54)}.experience-card h2{margin:24px 0 13px;font-size:19px;line-height:1.7}.pills{display:flex;flex-wrap:wrap;gap:6px}.pills b{min-height:34px;padding:0 10px;border-radius:999px;background:#f1e4d6;display:inline-flex;align-items:center;font-size:9px}.fact-card p{margin:0;color:rgba(62,39,32,.58);font-size:10px;line-height:1.9}

  .product-story{margin-top:18px;border-radius:25px;overflow:hidden;background:#efe0d0;display:grid;grid-template-columns:1fr 1fr}.story-photo{min-height:420px;overflow:hidden}.story-photo img{width:100%;height:100%;object-fit:cover;filter:saturate(.78) brightness(.94)}.story-copy{padding:44px;align-self:center}.story-copy h2{margin:9px 0 13px;font-size:34px;line-height:1.55}.story-copy>p{margin:0;color:rgba(62,39,32,.62);font-size:12.5px;line-height:1.95}.story-copy blockquote{margin:24px 0 0;padding-top:20px;border-top:1px solid rgba(62,39,32,.13);font-size:17px;font-weight:800;line-height:1.9}

  .truth-section{margin-top:17px;padding:32px 34px;border:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.5);display:grid;grid-template-columns:.9fr 1.1fr;gap:30px;align-items:center}.truth-section h2{margin:8px 0 0;font-size:27px;line-height:1.6}.truth-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.truth-list span{min-height:54px;padding:12px;border-radius:13px;background:#f5eadf;display:flex;align-items:center;font-size:10px;font-weight:800}

  .back-shop{margin-top:20px;display:flex;justify-content:center;gap:8px}.back-shop a{min-height:42px;padding:0 15px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.5);display:inline-flex;align-items:center;font-size:10px;font-weight:800}.back-shop .primary{background:var(--espresso);color:#fff;border-color:var(--espresso)}

  @media(max-width:900px){.product-hero{grid-template-columns:1fr}.product-photo{min-height:480px}.experience-grid{grid-template-columns:1fr}.product-story{grid-template-columns:1fr}.truth-section{grid-template-columns:1fr}}
  @media(max-width:600px){.product-hero{padding-top:28px}.product-photo{min-height:390px}.product-copy h1{font-size:46px}.product-copy h2{font-size:24px}.quick-facts{grid-template-columns:1fr}.buy-box{align-items:stretch;flex-direction:column}.buy-box button{width:100%}.person-card{padding:28px 24px}.story-photo{min-height:280px}.story-copy{padding:30px 24px}.truth-section{padding:24px}.truth-list{grid-template-columns:1fr}.back-shop{align-items:stretch;flex-direction:column}.back-shop a{justify-content:center}}
</style>
