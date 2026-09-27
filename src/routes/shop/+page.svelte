<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import { moodFilters, productForProfile, shopProducts, type ShopProduct } from '$lib/shopCatalog';

  let activeMood = $state<string>('all');
  let recommended = $state<ShopProduct | null>(null);
  let profileLoaded = $state(false);

  const filteredProducts = $derived(
    activeMood === 'all' ? shopProducts : shopProducts.filter((product) => product.mood === activeMood)
  );

  async function getAnonymousId() {
    const key = 'elseed_anonymous_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  }

  async function loadRecommendation() {
    try {
      const anonymousId = await getAnonymousId();
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ anonymousId })
      });
      const payload = await response.json();
      if (response.ok && payload?.profile) recommended = productForProfile(payload.profile) ?? null;
    } catch {
      recommended = null;
    } finally {
      profileLoaded = true;
    }
  }

  $effect(() => {
    if (typeof window !== 'undefined') void loadRecommendation();
  });
</script>

<svelte:head>
  <title>فروشگاه | قهوه‌هایی با شخصیت | EL.SEED</title>
  <meta
    name="description"
    content="قهوه را با حال‌وهوایت انتخاب کن؛ از WAKE UP CALL برای صبح‌های سخت تا AFTER FIVE برای فنجان‌های دیرتر."
  />
</svelte:head>

<Header />

<main class="shop-page">
  <section class="shop-hero shell">
    <div class="hero-photo">
      <img src="/media/find/time-morning-human-v4.webp" alt="شروع صبح با یک فنجان قهوه" />
      <div class="hero-photo-copy">
        <span>EL.SEED MOOD SHOP</span>
        <strong>GOOD COFFEE.<br />BETTER DAYS.</strong>
      </div>
    </div>

    <div class="shop-hero-copy">
      <span class="shop-kicker">COFFEE FOR REAL LIFE</span>
      <h1>قهوه رو با<br />حال‌وهوات انتخاب کن.</h1>
      <p>
        لازم نیست اول بفهمی ۷۰/۳۰ یعنی چی. بگو امروز از قهوه چی می‌خوای؛
        ما شخصیت مناسب فنجونت رو جلوت می‌ذاریم.
      </p>
      <div class="shop-hero-actions">
        <a class="shop-primary" href="#moods">شخصیت‌ها رو ببین</a>
        <a class="shop-secondary" href="/find">نمی‌دونم کدومم</a>
      </div>
    </div>
  </section>

  {#if recommended}
    <section class="for-me shell">
      <a class="for-me-image" href={'/shop/' + recommended.slug}>
        <img src={recommended.image} alt={recommended.imageAlt} />
      </a>
      <div class="for-me-copy">
        <span>FOR YOU · از قهوه و من</span>
        <h2>فکر کنم این رفیق بیشتر به کارت میاد.</h2>
        <h3>{recommended.name}</h3>
        <p>{recommended.character}</p>
        <a class="for-me-button" href={'/shop/' + recommended.slug}>این شخصیت رو ببین</a>
      </div>
    </section>
  {:else if profileLoaded}
    <section class="for-me-empty shell">
      <div>
        <span>FOR YOU</span>
        <strong>هنوز قهوه‌ات رو به اندازه کافی نمی‌شناسیم.</strong>
      </div>
      <a href="/find">با ۵ انتخاب شروع کن</a>
    </section>
  {/if}

  <section class="shop-catalog shell" id="moods">
    <header class="catalog-head">
      <div>
        <span>CHOOSE YOUR PERSON</span>
        <h2>امروز کدومش رو لازم داری؟</h2>
      </div>
      <p>اول لحظه و حس. اطلاعات فنی پایین‌تر و فقط وقتی لازم باشه.</p>
    </header>

    <div class="mood-filters" aria-label="فیلتر حال‌وهوای قهوه">
      {#each moodFilters as filter}
        <button
          type="button"
          class:active={activeMood === filter.key}
          onclick={() => (activeMood = filter.key)}
        >
          {filter.label}
        </button>
      {/each}
    </div>

    <div class="product-grid">
      {#each filteredProducts as product}
        <a class="product-card" href={'/shop/' + product.slug}>
          <div class="product-image">
            <img src={product.image} alt={product.imageAlt} loading="lazy" />
            <span class={'mood-chip tone-' + product.tone}>{product.tags[0]}</span>
            <div class="image-copy">
              <small>{product.eyebrow}</small>
              <strong>{product.name}</strong>
            </div>
          </div>

          <div class="product-body">
            <div class="product-topline">
              <span>{product.persianName}</span>
              <b>{'●'.repeat(product.energy)}{'○'.repeat(5 - product.energy)}</b>
            </div>
            <h3>{product.character}</h3>
            <p>{product.story}</p>
            <div class="product-meta">
              <span>{product.bestMoment}</span>
              <strong>دیدن محصول</strong>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section class="shop-editorial shell">
    <div class="editorial-image">
      <img src="/media/philosophy" alt="قهوه در یک لحظه آرام از زندگی روزمره" loading="lazy" />
    </div>
    <div class="editorial-copy">
      <span>THE EL.SEED WAY</span>
      <h2>تو «۸۰٪ روبوستا» نمی‌خری.<br />تو یه صبح بهتر می‌خوای.</h2>
      <p>
        مشخصات فنی هنوز مهم‌اند؛ فقط قرار نیست اولین چیزی باشند که می‌بینی.
        اول آدم، لحظه و حس. بعد دانه، رُست و روش دم‌آوری.
      </p>
      <a href="/find">قهوه شبیه خودت رو پیدا کن</a>
    </div>
  </section>
</main>

<Footer />

<style>
  .shop-page{padding-bottom:34px;background:radial-gradient(circle at 90% 4%,rgba(247,201,195,.16),transparent 24%),var(--cream)}
  .shop-hero{min-height:610px;display:grid;grid-template-columns:1.12fr .88fr;gap:34px;align-items:center;padding-block:42px}
  .hero-photo{position:relative;min-height:520px;border-radius:30px;overflow:hidden;background:#ddcdbc}.hero-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.88) contrast(.98)}.hero-photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(34,22,17,.04) 45%,rgba(34,22,17,.56) 100%)}.hero-photo-copy{position:absolute;z-index:2;left:27px;right:27px;bottom:26px;display:flex;align-items:end;justify-content:space-between;gap:20px;color:#fff}.hero-photo-copy span{font-size:9px;font-weight:800;letter-spacing:.18em;direction:ltr}.hero-photo-copy strong{font:800 15px/1.25 Arial,sans-serif;letter-spacing:.09em;text-align:left;direction:ltr}
  .shop-kicker,.catalog-head span,.for-me-copy>span,.editorial-copy>span{display:block;direction:ltr;color:var(--caramel);font-size:10px;font-weight:800;letter-spacing:.18em}.shop-hero h1{margin:13px 0 18px;font-size:clamp(50px,5.8vw,78px);line-height:1.13;letter-spacing:-.055em}.shop-hero-copy>p{max-width:510px;margin:0;color:rgba(62,39,32,.68);font-size:15px;line-height:2}.shop-hero-actions{display:flex;gap:9px;margin-top:27px;flex-wrap:wrap}.shop-primary,.shop-secondary{min-height:48px;padding:0 19px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:800}.shop-primary{background:var(--espresso);color:#fff}.shop-secondary{border:1px solid var(--line);background:rgba(255,255,255,.52)}

  .for-me{margin-top:10px;border-radius:25px;overflow:hidden;background:#3e2720;color:#fff9f0;display:grid;grid-template-columns:42% 58%;min-height:280px}.for-me-image{min-height:280px;overflow:hidden}.for-me-image img{width:100%;height:100%;object-fit:cover;filter:saturate(.86)}.for-me-copy{padding:34px 38px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}.for-me-copy>span{color:#e8b47d}.for-me-copy h2{margin:12px 0 5px;font-size:29px}.for-me-copy h3{margin:0;direction:ltr;font:900 21px/1 Arial,sans-serif;letter-spacing:-.04em}.for-me-copy p{margin:13px 0 0;color:rgba(255,249,240,.72);font-size:12px;line-height:1.9}.for-me-button{margin-top:20px;min-height:40px;padding:0 14px;border-radius:999px;background:#fff7ed;color:#3e2720;display:inline-flex;align-items:center;font-size:10px;font-weight:900}.for-me-empty{margin-top:10px;min-height:88px;padding:18px 22px;border-radius:20px;border:1px dashed rgba(62,39,32,.18);display:flex;align-items:center;justify-content:space-between;gap:20px}.for-me-empty span{display:block;color:var(--caramel);font-size:9px;letter-spacing:.18em;direction:ltr}.for-me-empty strong{display:block;margin-top:4px;font-size:14px}.for-me-empty a{min-height:38px;padding:0 14px;border-radius:999px;background:var(--espresso);color:#fff;display:inline-flex;align-items:center;font-size:10px;font-weight:800}

  .shop-catalog{padding-top:58px}.catalog-head{display:flex;justify-content:space-between;gap:30px;align-items:end}.catalog-head h2{margin:7px 0 0;font-size:37px;letter-spacing:-.035em}.catalog-head p{max-width:370px;margin:0;color:rgba(62,39,32,.56);font-size:11.5px;line-height:1.85}.mood-filters{margin:20px 0 18px;display:flex;gap:7px;overflow-x:auto;padding-bottom:4px}.mood-filters button{flex:0 0 auto;min-height:37px;padding:0 14px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.45);color:var(--espresso);font:inherit;font-size:10px;font-weight:800;cursor:pointer}.mood-filters button.active{background:var(--espresso);color:#fff;border-color:var(--espresso)}

  .product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.product-card{border:1px solid var(--line);border-radius:20px;overflow:hidden;background:rgba(255,255,255,.62);transition:transform .22s ease,box-shadow .22s ease}.product-card:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(62,39,32,.08)}.product-image{position:relative;aspect-ratio:1.08/1;overflow:hidden;background:#e4d5c5}.product-image img{width:100%;height:100%;object-fit:cover;transition:transform .45s ease;filter:saturate(.88) contrast(.98)}.product-card:hover .product-image img{transform:scale(1.025)}.product-image:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(36,24,18,.58) 100%)}.mood-chip{position:absolute;z-index:2;right:14px;top:14px;min-height:30px;padding:0 10px;border-radius:999px;background:#fffaf3;color:#3e2720;display:inline-flex;align-items:center;font-size:9px;font-weight:900;box-shadow:0 7px 18px rgba(62,39,32,.08)}.image-copy{position:absolute;z-index:2;left:18px;right:18px;bottom:17px;color:#fff;display:grid;gap:3px}.image-copy small{font-size:9px}.image-copy strong{direction:ltr;text-align:right;font:900 26px/1 Arial,sans-serif;letter-spacing:-.05em}.product-body{padding:19px 19px 17px}.product-topline{display:flex;align-items:center;justify-content:space-between;gap:10px}.product-topline span{font-size:10px;color:rgba(62,39,32,.5)}.product-topline b{direction:ltr;font-size:9px;letter-spacing:.06em}.product-body h3{margin:17px 0 9px;font-size:18px;line-height:1.75}.product-body p{margin:0;color:rgba(62,39,32,.6);font-size:11px;line-height:1.9;min-height:84px}.product-meta{margin-top:17px;padding-top:13px;border-top:1px solid rgba(62,39,32,.08);display:flex;justify-content:space-between;gap:13px;align-items:center}.product-meta span{font-size:8.5px;color:rgba(62,39,32,.46)}.product-meta strong{font-size:9.5px}

  .shop-editorial{margin-top:54px;border-radius:26px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;background:#efe0d0}.editorial-image{min-height:380px}.editorial-image img{width:100%;height:100%;object-fit:cover;filter:saturate(.76)}.editorial-copy{padding:44px;align-self:center}.editorial-copy h2{margin:10px 0 14px;font-size:clamp(31px,4vw,48px);line-height:1.55;letter-spacing:-.04em}.editorial-copy p{margin:0;color:rgba(62,39,32,.62);font-size:12.5px;line-height:1.95}.editorial-copy a{margin-top:20px;min-height:42px;padding:0 14px;border-radius:999px;background:var(--espresso);color:#fff;display:inline-flex;align-items:center;font-size:10px;font-weight:800}

  @media(max-width:960px){.shop-hero{grid-template-columns:1fr}.hero-photo{min-height:430px}.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.for-me{grid-template-columns:1fr 1fr}}
  @media(max-width:700px){.shop-hero{padding-top:28px}.shop-hero h1{font-size:48px}.hero-photo{min-height:330px}.for-me{grid-template-columns:1fr}.for-me-image{min-height:240px}.catalog-head{align-items:flex-start;flex-direction:column}.catalog-head h2{font-size:31px}.product-grid{grid-template-columns:1fr}.product-body p{min-height:0}.shop-editorial{grid-template-columns:1fr}.editorial-image{min-height:260px}.editorial-copy{padding:30px 24px}}
  @media(max-width:470px){.shop-hero-actions{align-items:stretch;flex-direction:column}.shop-primary,.shop-secondary{justify-content:center}.hero-photo-copy{align-items:flex-start;flex-direction:column}.for-me-copy{padding:28px 24px}.for-me-empty{align-items:flex-start;flex-direction:column}}
</style>
