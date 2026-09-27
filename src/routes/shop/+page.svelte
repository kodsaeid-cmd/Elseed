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
    content="فروشگاه EL.SEED را بر اساس حس و موقعیت انتخاب کن؛ از WAKE UP CALL برای صبح‌های سخت تا AFTER FIVE برای فنجان‌های دیرتر."
  />
</svelte:head>

<Header />

<main class="shop-page">
  <section class="shop-hero shell">
    <div class="shop-hero-copy">
      <span class="shop-kicker">EL.SEED MOOD SHOP · PHASE ZERO</span>
      <h1>قهوه رو با<br />حال‌وهوات انتخاب کن.</h1>
      <p>
        لازم نیست اول بفهمی ۷۰/۳۰ یعنی چی. بگو امروز از قهوه چی می‌خوای؛
        ما پشت صحنه بین قهوه‌های واقعی بازار، گزینه مناسب اون حس رو پیدا می‌کنیم.
      </p>
      <div class="shop-hero-actions">
        <a class="shop-primary" href="#moods">شخصیت‌ها رو ببین</a>
        <a class="shop-secondary" href="/find">نمی‌دونم کدومم</a>
      </div>
    </div>

    <div class="hero-stack" aria-label="نمونه بسته‌های EL.SEED">
      <div class="mini-pack mini-pack-one">
        <span>EL.SEED</span>
        <b>WAKE<br />UP CALL</b>
        <small>GOOD COFFEE.<br />BETTER DAYS.</small>
      </div>
      <div class="mini-pack mini-pack-two">
        <span>EL.SEED</span>
        <b>MAIN<br />CHARACTER</b>
        <small>SMELLS LIKE<br />A GOOD DAY.</small>
      </div>
      <div class="mini-pack mini-pack-three">
        <span>EL.SEED</span>
        <b>AFTER<br />FIVE</b>
        <small>ONE MORE CUP.<br />JUST NICER.</small>
      </div>
    </div>
  </section>

  <section class="phase-zero shell">
    <div>
      <span>PHASE ZERO</span>
      <strong>فعلاً داریم بازار رو با محصول واقعی تست می‌کنیم.</strong>
    </div>
    <p>
      پشت هر شخصیت، یک یا چند SKU از ریو، کافی‌مافی و آریا قرار می‌گیرد.
      برنده‌ها بعداً تبدیل می‌شوند به محصول و تأمین اختصاصی EL.SEED.
    </p>
  </section>

  {#if recommended}
    <section class="for-me shell">
      <div class="for-me-copy">
        <span>FOR YOU · از قهوه و من</span>
        <h2>فکر کنم این رفیق بیشتر به کارت میاد.</h2>
        <p>پیشنهاد از چیزهایی که تا الان درباره قهوه‌ات فهمیدیم ساخته شده، نه از یک لیست عمومی.</p>
        <a href={'/shop/' + recommended.slug}>دیدن {recommended.name}</a>
      </div>
      <a class={'for-me-product tone-' + recommended.tone} href={'/shop/' + recommended.slug}>
        <div class="pouch compact">
          <span class="pouch-brand">EL.SEED</span>
          <strong>{recommended.name}</strong>
          <small>{recommended.persianName}</small>
          <i>{'●'.repeat(recommended.energy)}{'○'.repeat(5 - recommended.energy)}</i>
        </div>
        <div>
          <span>{recommended.eyebrow}</span>
          <strong>{recommended.character}</strong>
        </div>
      </a>
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
      <p>
        اسم‌ها و شخصیت‌ها مال EL.SEED هستند؛ تأمین‌کننده پشت صحنه قابل تغییر است.
      </p>
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
        <a class={'product-card tone-' + product.tone} href={'/shop/' + product.slug}>
          <div class="product-visual">
            <div class="pouch">
              <span class="pouch-brand">EL.SEED</span>
              <span class="pouch-kicker">{product.eyebrow}</span>
              <strong>{product.name}</strong>
              <small>{product.persianName}</small>
              <div class="pouch-energy">
                <span>ENERGY</span>
                <b>{'●'.repeat(product.energy)}{'○'.repeat(5 - product.energy)}</b>
              </div>
              <em>GOOD COFFEE.<br />BETTER DAYS.</em>
            </div>
            <span class="product-sticker">{product.tags[0]}</span>
          </div>

          <div class="product-body">
            <div class="product-meta">
              <span>{product.bestMoment}</span>
              <small>{product.sources.length} Source SKU</small>
            </div>
            <h3>{product.character}</h3>
            <p>{product.story}</p>
            <div class="product-bottom">
              <div>
                <small>فاز صفر</small>
                <strong>{product.priceLabel}</strong>
              </div>
              <span class="product-open">دیدن شخصیت</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section class="shop-manifesto shell">
    <span>THE IDEA</span>
    <h2>تو «۸۰٪ روبوستا» نمی‌خری.<br />تو چیزی رو می‌خری که صبح به دردت بخوره.</h2>
    <p>
      اطلاعات فنی حذف نمی‌شن؛ فقط جای درست خودشون قرار می‌گیرن.
      اول آدم و لحظه، بعد دانه و رُست.
    </p>
  </section>
</main>

<Footer />

<style>
  .shop-page{padding-bottom:28px;background:radial-gradient(circle at 85% 4%,rgba(247,201,195,.18),transparent 25%),radial-gradient(circle at 8% 23%,rgba(198,134,66,.09),transparent 23%),var(--cream)}
  .shop-hero{min-height:620px;display:grid;grid-template-columns:.92fr 1.08fr;align-items:center;gap:48px;padding-block:54px 38px}
  .shop-kicker,.catalog-head span,.for-me-copy>span,.phase-zero span,.shop-manifesto>span{display:block;direction:ltr;color:var(--caramel);font-size:11px;font-weight:800;letter-spacing:.18em}
  .shop-hero h1{margin:12px 0 18px;font-size:clamp(48px,6vw,82px);line-height:1.12;letter-spacing:-.055em}
  .shop-hero-copy>p{max-width:560px;margin:0;color:rgba(62,39,32,.68);font-size:16px;line-height:2}
  .shop-hero-actions{display:flex;gap:9px;margin-top:27px;flex-wrap:wrap}.shop-primary,.shop-secondary{min-height:50px;padding:0 20px;border-radius:999px;display:inline-flex;align-items:center;font-size:13px;font-weight:800}.shop-primary{background:var(--espresso);color:#fff}.shop-secondary{border:1px solid var(--line);background:rgba(255,255,255,.45)}
  .hero-stack{height:510px;position:relative;direction:ltr}.mini-pack{position:absolute;width:250px;height:370px;padding:33px 27px;border-radius:13px 13px 27px 27px;box-shadow:0 28px 70px rgba(62,39,32,.16);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(62,39,32,.12)}.mini-pack:before{content:'';position:absolute;left:0;right:0;top:17px;height:2px;border-top:1px solid rgba(62,39,32,.22);border-bottom:1px solid rgba(255,255,255,.5)}.mini-pack span{font-size:12px;letter-spacing:.24em;font-weight:900}.mini-pack b{margin-top:78px;font:900 39px/1.02 Arial,sans-serif;letter-spacing:-.07em}.mini-pack small{margin-top:auto;font:700 10px/1.45 Arial,sans-serif;letter-spacing:.12em}.mini-pack-one{left:8%;top:76px;transform:rotate(-8deg);background:#57372c;color:#fff6e9}.mini-pack-two{left:34%;top:18px;z-index:2;transform:rotate(2deg);background:#efd4cf;color:#482c22}.mini-pack-three{right:3%;top:92px;transform:rotate(9deg);background:#cbd1b6;color:#3f3328}

  .phase-zero{min-height:108px;padding:20px 24px;border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.48);display:grid;grid-template-columns:.8fr 1.2fr;align-items:center;gap:30px}.phase-zero strong{display:block;margin-top:5px;font-size:18px}.phase-zero p{margin:0;color:rgba(62,39,32,.62);font-size:12.5px;line-height:1.9}

  .for-me{margin-top:18px;padding:22px;border-radius:24px;background:#3e2720;color:#fff9f0;display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:stretch}.for-me-copy{padding:18px 20px}.for-me-copy>span{color:#e8b47d}.for-me-copy h2{margin:12px 0 8px;font-size:32px}.for-me-copy p{margin:0;color:rgba(255,249,240,.68);font-size:12.5px;line-height:1.9;max-width:480px}.for-me-copy a{display:inline-flex;margin-top:20px;min-height:40px;padding:0 15px;border-radius:999px;align-items:center;background:#fff7ed;color:#3e2720;font-size:11px;font-weight:900}.for-me-product{padding:16px;border-radius:18px;background:#fff8ef;color:#3e2720;display:grid;grid-template-columns:150px 1fr;gap:17px;align-items:center}.for-me-product>div:last-child{display:grid;gap:6px}.for-me-product>div:last-child span{color:rgba(62,39,32,.5);font-size:10px}.for-me-product>div:last-child strong{font-size:16px;line-height:1.7}.for-me-empty{margin-top:18px;min-height:92px;padding:18px 22px;border-radius:20px;border:1px dashed rgba(62,39,32,.18);display:flex;align-items:center;justify-content:space-between;gap:20px}.for-me-empty span{display:block;color:var(--caramel);font-size:9px;letter-spacing:.18em;direction:ltr}.for-me-empty strong{display:block;margin-top:4px;font-size:15px}.for-me-empty a{min-height:38px;padding:0 14px;border-radius:999px;background:var(--espresso);color:#fff;display:inline-flex;align-items:center;font-size:10px;font-weight:800}

  .shop-catalog{padding-top:64px}.catalog-head{display:flex;justify-content:space-between;gap:30px;align-items:end}.catalog-head h2{margin:7px 0 0;font-size:38px;letter-spacing:-.035em}.catalog-head p{max-width:440px;margin:0;color:rgba(62,39,32,.58);font-size:12px;line-height:1.85}
  .mood-filters{margin:22px 0 18px;display:flex;gap:7px;overflow-x:auto;padding-bottom:4px}.mood-filters button{flex:0 0 auto;min-height:38px;padding:0 14px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.4);color:var(--espresso);font:inherit;font-size:10.5px;font-weight:800;cursor:pointer}.mood-filters button.active{background:var(--espresso);color:#fff;border-color:var(--espresso)}
  .product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.product-card{min-height:520px;border:1px solid var(--line);border-radius:24px;overflow:hidden;background:rgba(255,255,255,.56);display:grid;grid-template-columns:46% 54%;transition:transform .22s ease,box-shadow .22s ease}.product-card:hover{transform:translateY(-4px);box-shadow:0 20px 55px rgba(62,39,32,.08)}
  .product-visual{min-height:520px;position:relative;display:grid;place-items:center;padding:28px;background:#eadccf;overflow:hidden}.product-visual:after{content:'';position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.32);filter:blur(4px);bottom:-95px;right:-80px}.tone-energy .product-visual{background:#cfa17d}.tone-daily .product-visual{background:#ead3b7}.tone-focus .product-visual{background:#c9c9ae}.tone-style .product-visual{background:#edc8c2}.tone-break .product-visual{background:#d6c5ad}.tone-evening .product-visual{background:#c6cdb4}
  .pouch{position:relative;z-index:2;width:min(88%,230px);height:345px;padding:26px 22px;border:1px solid rgba(62,39,32,.18);border-radius:10px 10px 24px 24px;background:#fff8ed;box-shadow:0 22px 46px rgba(62,39,32,.16);display:flex;flex-direction:column;overflow:hidden;direction:ltr}.pouch:before{content:'';position:absolute;left:0;right:0;top:14px;height:2px;border-top:1px solid rgba(62,39,32,.16);border-bottom:1px solid rgba(62,39,32,.08)}.pouch-brand{font-size:10px;font-weight:900;letter-spacing:.25em}.pouch-kicker{margin-top:40px;font-family:'Vazirmatn',sans-serif;direction:rtl;text-align:left;font-size:9px;color:#a06c42}.pouch>strong{margin-top:9px;font:900 34px/1 Arial,sans-serif;letter-spacing:-.07em}.pouch>small{margin-top:8px;direction:rtl;text-align:left;font-family:'Vazirmatn',sans-serif;font-size:10px}.pouch-energy{margin-top:auto;display:grid;gap:2px}.pouch-energy span{font-size:7px;letter-spacing:.18em}.pouch-energy b{font-size:10px;letter-spacing:.08em}.pouch em{margin-top:13px;font:700 8px/1.4 Arial,sans-serif;letter-spacing:.12em}.product-sticker{position:absolute;z-index:3;right:18px;top:18px;min-width:58px;height:58px;padding:8px;border-radius:50%;background:#fff9f1;display:grid;place-items:center;text-align:center;font-size:9px;font-weight:900;transform:rotate(9deg);box-shadow:0 8px 22px rgba(62,39,32,.08)}
  .product-body{padding:27px 27px 22px;display:flex;flex-direction:column}.product-meta{display:flex;justify-content:space-between;gap:12px;color:rgba(62,39,32,.52);font-size:9.5px}.product-meta small{direction:ltr}.product-body h3{margin:36px 0 13px;font-size:25px;line-height:1.75;letter-spacing:-.02em}.product-body>p{margin:0;color:rgba(62,39,32,.62);font-size:12px;line-height:1.95}.product-bottom{margin-top:auto;padding-top:20px;border-top:1px solid rgba(62,39,32,.09);display:flex;justify-content:space-between;align-items:end;gap:14px}.product-bottom>div{display:grid;gap:2px}.product-bottom small{font-size:8px;color:rgba(62,39,32,.44)}.product-bottom strong{font-size:10px}.product-open{min-height:34px;padding:0 12px;border-radius:999px;background:#3e2720;color:#fff;display:inline-flex;align-items:center;font-size:9px;font-weight:900}

  .pouch.compact{width:125px;height:180px;padding:18px 14px;border-radius:8px 8px 16px 16px}.pouch.compact:before{top:9px}.pouch.compact>strong{margin-top:35px;font-size:19px}.pouch.compact>small{font-size:8px}.pouch.compact i{margin-top:auto;font-style:normal;font-size:8px;letter-spacing:.06em}

  .shop-manifesto{margin-top:54px;margin-bottom:18px;padding:44px;border-radius:25px;background:#f1e3d3;text-align:center}.shop-manifesto h2{margin:10px auto 12px;max-width:760px;font-size:clamp(30px,4vw,48px);line-height:1.55;letter-spacing:-.04em}.shop-manifesto p{max-width:620px;margin:0 auto;color:rgba(62,39,32,.62);font-size:13px;line-height:1.9}

  @media(max-width:960px){.shop-hero{grid-template-columns:1fr;min-height:0}.hero-stack{height:420px;max-width:680px;width:100%;margin:auto}.mini-pack{width:210px;height:320px}.product-card{grid-template-columns:1fr}.product-visual{min-height:400px}.for-me{grid-template-columns:1fr}}
  @media(max-width:700px){.shop-hero{padding-top:36px}.shop-hero h1{font-size:48px}.hero-stack{height:330px}.mini-pack{width:165px;height:255px;padding:24px 18px}.mini-pack b{margin-top:55px;font-size:27px}.mini-pack-one{left:1%}.mini-pack-two{left:29%}.mini-pack-three{right:1%}.phase-zero{grid-template-columns:1fr;gap:10px}.catalog-head{align-items:flex-start;flex-direction:column}.catalog-head h2{font-size:31px}.product-grid{grid-template-columns:1fr}.product-card{min-height:0}.product-visual{min-height:390px}.for-me-product{grid-template-columns:120px 1fr}.for-me-copy{padding:8px}.shop-manifesto{padding:34px 20px}}
  @media(max-width:470px){.hero-stack{height:290px}.mini-pack{width:140px;height:225px;padding:21px 14px}.mini-pack b{font-size:22px}.mini-pack-one{top:60px}.mini-pack-two{left:28%;top:15px}.mini-pack-three{top:70px}.shop-hero-actions{align-items:stretch;flex-direction:column}.shop-primary,.shop-secondary{justify-content:center}.for-me-product{grid-template-columns:1fr}.pouch.compact{margin:auto}.for-me-empty{align-items:flex-start;flex-direction:column}}
</style>
