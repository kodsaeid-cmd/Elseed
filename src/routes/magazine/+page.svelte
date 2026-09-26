<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import { magazineCategories } from '$lib/magazine';

  let { data } = $props();
  const featured = $derived(data.articles.find((article: any) => article.featured) ?? data.articles[0]);
  const categories = $derived(
    Array.from(new Set([...magazineCategories, ...data.articles.map((article: any) => article.category).filter(Boolean)]))
  );
  let activeCategory = $state('همه');
  let visibleArticles = $derived(
    activeCategory === 'همه'
      ? data.articles
      : data.articles.filter((article: any) => article.category === activeCategory)
  );
</script>

<svelte:head>
  <title>مجله EL.SEED | قهوه برای زندگی واقعی</title>
  <meta
    name="description"
    content="مجله EL.SEED؛ راهنماهای ساده و کاربردی درباره انتخاب قهوه، دم‌آوری، طعم، کافئین و حل مشکلات فنجان."
  />
  <meta property="og:title" content="مجله EL.SEED | قهوه برای زندگی واقعی" />
  <meta
    property="og:description"
    content="بدون اصطلاحات اضافه؛ جواب سؤال‌های واقعی درباره قهوه."
  />
</svelte:head>

<Header />

<main class="magazine-page">
  <section class="magazine-masthead shell">
    <div class="magazine-title-row">
      <div>
        <span class="magazine-kicker">EL.SEED · EDITORIAL</span>
        <h1>مجله</h1>
      </div>
      <p>
        درباره‌ی قهوه همان‌طور حرف می‌زنیم که واقعاً تجربه‌اش می‌کنی:
        <strong>طعم، حال، خواب، انرژی و فنجانی که جلویت است.</strong>
      </p>
    </div>

    <a class="magazine-feature" href={'/magazine/' + featured.slug}>
      <div class="magazine-feature-media">
        <img src={featured.image} alt={featured.imageAlt} />
        <span>پرونده‌ی منتخب</span>
      </div>
      <div class="magazine-feature-copy">
        <span class="magazine-category">{featured.category}</span>
        <h2>{featured.title}</h2>
        <p>{featured.excerpt}</p>
        <div class="magazine-meta">
          <span>{featured.meta}</span>
          <span>{featured.publishedAt}</span>
        </div>
        <b>بخونش <i>←</i></b>
      </div>
    </a>
  </section>

  <section class="magazine-browser shell" aria-labelledby="latest-title">
    <div class="magazine-section-head">
      <div>
        <span>EXPLORE BY QUESTION</span>
        <h2 id="latest-title">از کجا شروع کنیم؟</h2>
      </div>
      <p>موضوعی را انتخاب کن که به سؤال امروزت نزدیک‌تر است.</p>
    </div>

    <div class="magazine-chips" role="group" aria-label="دسته‌بندی مطالب">
      {#each categories as category}
        <button
          type="button"
          class:active={activeCategory === category}
          onclick={() => (activeCategory = category)}
        >
          {category}
        </button>
      {/each}
    </div>

    <div class="magazine-grid">
      {#each visibleArticles as article}
        <article class="magazine-card">
          <a class="magazine-card-image" href={'/magazine/' + article.slug}>
            <img src={article.image} alt={article.imageAlt} loading="lazy" />
          </a>
          <div class="magazine-card-body">
            <div class="magazine-card-topline">
              <span>{article.category}</span>
              <small>{article.meta}</small>
            </div>
            <h3><a href={'/magazine/' + article.slug}>{article.title}</a></h3>
            <p>{article.excerpt}</p>
            <a class="magazine-card-link" href={'/magazine/' + article.slug}>ادامه مطلب <span>←</span></a>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="magazine-human shell">
    <div class="magazine-human-card">
      <div>
        <span>DON'T KNOW WHERE TO START?</span>
        <h2>لازم نیست اسم قهوه‌ها را بلد باشی.</h2>
        <p>
          اگر هنوز نمی‌دانی باید چه مقاله‌ای بخوانی، از خودت شروع کن.
          چند سؤال ساده درباره‌ی زمان مصرف، چیزی که از قهوه می‌خواهی و ذائقه‌ات جواب بده.
        </p>
      </div>
      <a href="/find">قهوه‌ام را پیدا کن <span>←</span></a>
    </div>
  </section>
</main>

<Footer />
