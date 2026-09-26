<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';

  let { data } = $props();
  const article = data.article;
  const related = data.related;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'EL.SEED'
    },
    publisher: {
      '@type': 'Organization',
      name: 'EL.SEED'
    },
    mainEntityOfPage: '/magazine/' + article.slug
  };
</script>

<svelte:head>
  <title>{article.title} | مجله EL.SEED</title>
  <meta name="description" content={article.excerpt} />
  <meta property="og:title" content={article.title} />
  <meta property="og:description" content={article.excerpt} />
  <meta property="og:type" content="article" />
  <meta property="og:image" content={article.image} />
  <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
</svelte:head>

<Header />

<main class="article-page">
  <article>
    <header class="article-hero shell">
      <nav class="article-breadcrumbs" aria-label="مسیر صفحه">
        <a href="/">خانه</a>
        <span>←</span>
        <a href="/magazine">مجله</a>
        <span>←</span>
        <b>{article.category}</b>
      </nav>

      <div class="article-headline">
        <span class="magazine-category">{article.eyebrow}</span>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
        <div class="article-meta">
          <span>{article.meta}</span>
          <span>{article.publishedAt}</span>
          <span>تحریریه EL.SEED</span>
        </div>
      </div>

      <figure class="article-cover">
        <img src={article.image} alt={article.imageAlt} />
      </figure>
    </header>

    <div class="article-layout shell">
      <aside class="article-rail">
        <div>
          <span>EL.SEED MAGAZINE</span>
          <p>قهوه برای آدم‌ها، نه اصطلاحات پیچیده.</p>
        </div>
        <a href="/find">قهوه‌ام را پیدا کن <span>←</span></a>
      </aside>

      <div class="article-body">
        {#if article.quickAnswer}
          <section class="article-quick-answer">
            <span>جواب کوتاه</span>
            <p>{article.quickAnswer}</p>
          </section>
        {/if}

        {#each article.sections as section}
          <section class="article-section">
            <h2>{section.heading}</h2>
            {#each section.paragraphs as paragraph}
              <p>{paragraph}</p>
            {/each}
            {#if section.bullets}
              <ul>
                {#each section.bullets as item}
                  <li>{item}</li>
                {/each}
              </ul>
            {/if}
          </section>
        {/each}

        <section class="article-takeaway">
          <span>اگر فقط یک چیز یادت بماند</span>
          <p>{article.takeaway}</p>
        </section>

        {#if article.cta}
          <section class="article-cta">
            <div>
              <span>قدم بعدی</span>
              <p>{article.cta.text}</p>
            </div>
            <a href={article.cta.href}>{article.cta.label} <span>←</span></a>
          </section>
        {/if}
      </div>
    </div>
  </article>

  <section class="article-related shell">
    <div class="magazine-section-head">
      <div>
        <span>KEEP READING</span>
        <h2>بعدش این‌ها را بخوان</h2>
      </div>
    </div>

    <div class="magazine-grid magazine-grid-related">
      {#each related as item}
        <article class="magazine-card">
          <a class="magazine-card-image" href={'/magazine/' + item.slug}>
            <img src={item.image} alt={item.imageAlt} loading="lazy" />
          </a>
          <div class="magazine-card-body">
            <div class="magazine-card-topline">
              <span>{item.category}</span>
              <small>{item.meta}</small>
            </div>
            <h3><a href={'/magazine/' + item.slug}>{item.title}</a></h3>
            <p>{item.excerpt}</p>
            <a class="magazine-card-link" href={'/magazine/' + item.slug}>بخونش <span>←</span></a>
          </div>
        </article>
      {/each}
    </div>
  </section>
</main>

<Footer />
