<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import ArticleMediaGroup from '$lib/ArticleMediaGroup.svelte';
  import InlineArticleText from '$lib/InlineArticleText.svelte';

  let { data } = $props();
  const article = data.article;
  const related = data.related;
  const media = data.media ?? [];

  const mediaBefore = media.filter((item: any) => Number(item.after_paragraph || 0) === 0);

  function normalizeSection(section: any) {
    const rawHeading = String(section?.heading ?? '').replace(/\r\n?/g, '\n').trim();
    const headingLines = rawHeading.split('\n').map((line) => line.trim()).filter(Boolean);
    const heading = headingLines[0] ?? '';
    const leakedParagraph = headingLines.slice(1).join(' ').trim();

    return {
      ...section,
      heading,
      paragraphs: [
        ...(leakedParagraph ? [leakedParagraph] : []),
        ...((section?.paragraphs ?? []).map((item: unknown) => String(item ?? '').trim()).filter(Boolean))
      ],
      bullets: (section?.bullets ?? []).map((item: unknown) => String(item ?? '').trim()).filter(Boolean)
    };
  }

  let paragraphIndex = 0;
  const sectionsWithMedia = article.sections.map((rawSection: any) => {
    const section = normalizeSection(rawSection);
    return {
      ...section,
      paragraphs: section.paragraphs.map((paragraph: string) => {
        paragraphIndex += 1;
        return {
          text: paragraph,
          media: media.filter((item: any) => Number(item.after_paragraph || 0) === paragraphIndex)
        };
      })
    };
  });

  const faqSchema = article.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((item: any) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }
    : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedIso,
    dateModified: article.updatedIso ?? article.publishedIso,
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
  <title>{article.seo?.metaTitle || article.title + ' | مجله EL.SEED'}</title>
  <meta name="description" content={article.seo?.metaDescription || article.excerpt} />
  <meta name="robots" content={article.seo?.robots || 'index,follow'} />
  {#if article.seo?.canonicalUrl}
    <link rel="canonical" href={article.seo.canonicalUrl.startsWith('http') ? article.seo.canonicalUrl : 'https://elseed.ir' + article.seo.canonicalUrl} />
  {/if}
  <meta property="og:title" content={article.seo?.metaTitle || article.title} />
  <meta property="og:description" content={article.seo?.metaDescription || article.excerpt} />
  <meta property="og:type" content="article" />
  <meta property="og:image" content={article.image} />
  <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
  {#if faqSchema}
    <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
  {/if}
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
            <p><InlineArticleText text={article.quickAnswer} /></p>
          </section>
        {/if}

        <ArticleMediaGroup items={mediaBefore} />

        {#each sectionsWithMedia as section}
          <section class="article-section">
            {#if section.heading}
              <h2><InlineArticleText text={section.heading} /></h2>
            {/if}
            {#each section.paragraphs as paragraph}
              <p><InlineArticleText text={paragraph.text} /></p>
              <ArticleMediaGroup items={paragraph.media} />
            {/each}
            {#if section.bullets}
              <ul>
                {#each section.bullets as item}
                  <li><InlineArticleText text={item} /></li>
                {/each}
              </ul>
            {/if}
          </section>
        {/each}

        {#if article.internalLinks?.length}
          <nav class="article-inline-links" aria-label="لینک‌های مرتبط داخل EL.SEED">
            <span>برای ادامه</span>
            <div>
              {#each article.internalLinks as link}
                <a href={link.href}>{link.label} <i>←</i></a>
              {/each}
            </div>
          </nav>
        {/if}

        {#if article.faq?.length}
          <section class="article-faq">
            <span class="magazine-category">FAQ</span>
            <h2>سؤال‌های متداول</h2>
            <div>
              {#each article.faq as item}
                <details>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              {/each}
            </div>
          </section>
        {/if}

        <section class="article-takeaway">
          <span>اگر فقط یک چیز یادت بماند</span>
          <p><InlineArticleText text={article.takeaway} /></p>
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
