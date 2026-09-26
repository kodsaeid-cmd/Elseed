<script lang="ts">
  import AdminArticleMediaTab from '$lib/AdminArticleMediaTab.svelte';
  let {
    initial,
    submitLabel = 'ذخیره مقاله',
    articleOptions = []
  } = $props<{
    initial: Record<string, any>;
    submitLabel?: string;
    articleOptions?: { id: string; slug: string; title: string }[];
  }>();

  type EditorTab = 'text' | 'media' | 'publisher' | 'links' | 'questions';

  function parseJson(value: string | undefined, fallback: any) {
    try {
      return JSON.parse(value || '');
    } catch {
      return fallback;
    }
  }

  function sectionsToBody(sections: any[]) {
    if (!Array.isArray(sections)) return '';
    return sections
      .map((section) => {
        const parts: string[] = [];
        if (section?.heading) parts.push('## ' + section.heading);
        if (Array.isArray(section?.paragraphs)) parts.push(...section.paragraphs.filter(Boolean));
        if (Array.isArray(section?.bullets) && section.bullets.length) {
          parts.push(section.bullets.filter(Boolean).map((item: string) => '- ' + item).join('\n'));
        }
        return parts.join('\n\n');
      })
      .filter(Boolean)
      .join('\n\n');
  }

  function bodyToSections(value: string) {
    const blocks = String(value || '')
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    const result: { heading: string; paragraphs: string[]; bullets: string[] }[] = [];
    let current = { heading: '', paragraphs: [] as string[], bullets: [] as string[] };

    const pushCurrent = () => {
      if (current.heading || current.paragraphs.length || current.bullets.length) result.push(current);
      current = { heading: '', paragraphs: [], bullets: [] };
    };

    for (const block of blocks) {
      if (/^#{2,3}\s+/.test(block)) {
        pushCurrent();
        current.heading = block.replace(/^#{2,3}\s+/, '').trim();
      } else if (block.split('\n').every((line) => /^-\s+/.test(line.trim()))) {
        current.bullets.push(
          ...block
            .split('\n')
            .map((line) => line.trim().replace(/^-\s+/, '').trim())
            .filter(Boolean)
        );
      } else {
        current.paragraphs.push(block);
      }
    }

    pushCurrent();
    return result.length ? result : [{ heading: '', paragraphs: [], bullets: [] }];
  }

  const initialContent = parseJson(initial.content_json, {
    quickAnswer: initial.quickAnswer ?? '',
    sections: initial.sections ?? [],
    faq: initial.faq ?? [],
    relatedSlugs: initial.relatedSlugs ?? [],
    internalLinks: initial.internalLinks ?? [],
    focusKeyword: '',
    secondaryKeywords: '',
    publisher: {}
  });
  const initialCta = parseJson(initial.cta_json, initial.cta ?? {});

  let activeTab = $state<EditorTab>('text');
  let articleTitle = $state(String(initial.title ?? ''));
  let articleSlug = $state(String(initial.slug ?? ''));
  let category = $state(String(initial.category ?? ''));
  let eyebrow = $state(String(initial.eyebrow ?? ''));
  let excerpt = $state(String(initial.excerpt ?? ''));
  let readingTime = $state(String(initial.reading_time ?? initial.meta ?? '۵ دقیقه مطالعه'));
  let takeaway = $state(String(initial.takeaway ?? ''));
  let coverImage = $state(String(initial.cover_image ?? initial.image ?? ''));
  let coverAlt = $state(String(initial.cover_alt ?? initial.imageAlt ?? ''));
  let metaTitle = $state(String(initial.meta_title ?? initial.seo?.metaTitle ?? ''));
  let metaDescription = $state(String(initial.meta_description ?? initial.seo?.metaDescription ?? ''));
  let canonicalUrl = $state(String(initial.canonical_url ?? initial.seo?.canonicalUrl ?? ''));
  let robots = $state(String(initial.robots ?? initial.seo?.robots ?? 'index,follow'));
  let featured = $state(Boolean(initial.featured));
  let quickAnswer = $state(String(initialContent.quickAnswer ?? ''));
  let body = $state(
    String(initialContent.body ?? '') ||
      sectionsToBody(initialContent.sections ?? initial.sections ?? [])
  );
  let focusKeyword = $state(String(initialContent.focusKeyword ?? ''));
  let secondaryKeywords = $state(String(initialContent.secondaryKeywords ?? ''));
  let sortOrder = $state(Number(initialContent.sortOrder ?? 0));

  let publisher = $state({
    name: String(initialContent.publisher?.name ?? 'تحریریه EL.SEED'),
    slug: String(initialContent.publisher?.slug ?? 'elseed-editorial'),
    professionalTitle: String(initialContent.publisher?.professionalTitle ?? 'تحریریه EL.SEED'),
    bio: String(initialContent.publisher?.bio ?? ''),
    imageUrl: String(initialContent.publisher?.imageUrl ?? ''),
    imageAlt: String(initialContent.publisher?.imageAlt ?? ''),
    referenceUrl: String(initialContent.publisher?.referenceUrl ?? '')
  });

  let faq = $state(
    (initialContent.faq?.length ? initialContent.faq : []).map((item: any) => ({
      question: item.question ?? '',
      answer: item.answer ?? ''
    }))
  );

  let relatedSlugs = $state<string[]>(
    Array.isArray(initialContent.relatedSlugs) ? initialContent.relatedSlugs : []
  );

  let internalLinks = $state(
    (initialContent.internalLinks?.length ? initialContent.internalLinks : []).map((item: any) => ({
      label: item.label ?? '',
      href: item.href ?? '',
      note: item.note ?? ''
    }))
  );

  let ctaLabel = $state(String(initialCta.label ?? ''));
  let ctaHref = $state(String(initialCta.href ?? ''));
  let ctaText = $state(String(initialCta.text ?? ''));

  const articleSaved = $derived(Boolean(initial.id));
  const textReady = $derived(Boolean(articleTitle.trim() && articleSlug.trim() && body.trim()));
  const publisherReady = $derived(Boolean(publisher.name.trim()));
  const mediaReady = $derived(Boolean(coverImage.trim()));

  const contentJson = $derived(
    JSON.stringify({
      quickAnswer,
      body,
      sections: bodyToSections(body),
      faq: faq
        .map((item: any) => ({
          question: item.question.trim(),
          answer: item.answer.trim()
        }))
        .filter((item: any) => item.question && item.answer),
      relatedSlugs,
      internalLinks: internalLinks
        .map((item: any) => ({
          label: item.label.trim(),
          href: item.href.trim(),
          note: item.note.trim()
        }))
        .filter((item: any) => item.label && item.href),
      focusKeyword: focusKeyword.trim(),
      secondaryKeywords: secondaryKeywords.trim(),
      sortOrder,
      publisher
    })
  );

  const ctaJson = $derived(
    JSON.stringify(
      ctaLabel || ctaHref || ctaText
        ? { label: ctaLabel.trim(), href: ctaHref.trim(), text: ctaText.trim() }
        : {}
    )
  );

  function addFaq() {
    faq.push({ question: '', answer: '' });
  }

  function removeFaq(index: number) {
    faq.splice(index, 1);
  }

  function addInternalLink() {
    internalLinks.push({ label: '', href: '', note: '' });
  }

  function removeInternalLink(index: number) {
    internalLinks.splice(index, 1);
  }

  function autoSlug() {
    if (articleSlug.trim()) return;
    const generated = articleTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (generated) articleSlug = generated;
  }

  function cancelEditor() {
    window.location.href = '/admin/magazine';
  }
</script>

<form method="POST" class="dandooni-editor-shell" dir="rtl">
  <input type="hidden" name="content_json" value={contentJson} />
  <input type="hidden" name="cta_json" value={ctaJson} />
  <input type="hidden" name="title" value={articleTitle} />
  <input type="hidden" name="slug" value={articleSlug} />
  <input type="hidden" name="category" value={category} />
  <input type="hidden" name="eyebrow" value={eyebrow} />
  <input type="hidden" name="excerpt" value={excerpt} />
  <input type="hidden" name="reading_time" value={readingTime} />
  <input type="hidden" name="cover_image" value={coverImage} />
  <input type="hidden" name="cover_alt" value={coverAlt} />
  <input type="hidden" name="takeaway" value={takeaway} />
  <input type="hidden" name="meta_title" value={metaTitle} />
  <input type="hidden" name="meta_description" value={metaDescription} />
  <input type="hidden" name="canonical_url" value={canonicalUrl} />
  <input type="hidden" name="robots" value={robots} />
  {#if featured}<input type="hidden" name="featured" value="on" />{/if}

  <section class="editor">
    <header class="editor-head">
      <div>
        <small>{articleSaved ? 'EDIT ARTICLE' : 'NEW ARTICLE'}</small>
        <h2>{articleSaved ? 'ویرایش مطلب' : 'ایجاد مطلب جدید'}</h2>
        <p>{articleTitle || 'عنوان مطلب را در تب محتوای متنی وارد کن.'}</p>
      </div>
      <button type="button" onclick={cancelEditor}>×</button>
    </header>

    <nav class="editor-tabs" aria-label="بخش‌های مطلب">
      <button type="button" class:active={activeTab === 'text'} onclick={() => (activeTab = 'text')}>
        <b>01</b>
        <span>محتوای متنی<small>{textReady ? 'آماده' : 'نیاز به تکمیل'}</small></span>
        <i class:ready={textReady}>{textReady ? '✓' : '!'}</i>
      </button>
      <button type="button" class:active={activeTab === 'media'} onclick={() => (activeTab = 'media')}>
        <b>02</b>
        <span>محتوای تصویری<small>{mediaReady ? 'تصویر شاخص آماده' : 'بدون تصویر شاخص'}</small></span>
        <i class:ready={mediaReady}>{mediaReady ? '✓' : '•'}</i>
      </button>
      <button type="button" class:active={activeTab === 'publisher'} onclick={() => (activeTab = 'publisher')}>
        <b>03</b>
        <span>ناشر اثر<small>{publisherReady ? publisher.name : 'هویت و انتشار'}</small></span>
        <i class:ready={publisherReady}>{publisherReady ? '✓' : '!'}</i>
      </button>
      <button type="button" class:active={activeTab === 'links'} onclick={() => (activeTab = 'links')}>
        <b>04</b>
        <span>لینک‌های داخلی<small>{articleSaved ? 'ارتباط بین مطالب' : 'پس از ذخیره پیش‌نویس'}</small></span>
        <i class:ready={articleSaved}>{articleSaved ? '↗' : '•'}</i>
      </button>
      <button type="button" class:active={activeTab === 'questions'} onclick={() => (activeTab = 'questions')}>
        <b>05</b>
        <span>سؤالات مخاطبان<small>{faq.length ? faq.length + ' سؤال' : 'پرسش و پاسخ مقاله'}</small></span>
        <i class:ready={faq.length > 0}>{faq.length ? '؟' : '•'}</i>
      </button>
    </nav>

    <div class="editor-content">
      {#if activeTab === 'text'}
        <section class="text-tab">
          <div class="text-grid">
            <div class="main-fields">
              <label>
                عنوان مطلب
                <input bind:value={articleTitle} maxlength="240" onblur={autoSlug} placeholder="مثلاً: چرا اسپرسو ترش می‌شود؟" />
              </label>
              <div class="two">
                <label>
                  دسته‌بندی
                  <input bind:value={category} maxlength="100" placeholder="دم‌آوری" />
                </label>
                <label>
                  زمان مطالعه
                  <input bind:value={readingTime} maxlength="60" />
                </label>
              </div>
              <label>
                خلاصه / Excerpt
                <textarea class="short" bind:value={excerpt} maxlength="1000" placeholder="خلاصه‌ای که در کارت مطلب و ابتدای معرفی استفاده می‌شود."></textarea>
              </label>
              <label>
                جواب کوتاه
                <textarea class="short" bind:value={quickAnswer} maxlength="1500" placeholder="پاسخ سریع و مستقیم به سؤال اصلی مقاله."></textarea>
              </label>
            </div>

            <aside class="slug-card">
              <span>URL مطلب</span>
              <label>
                Slug
                <div class="slug-field">
                  <b>/magazine/</b>
                  <input bind:value={articleSlug} maxlength="160" placeholder="espresso-sour" />
                </div>
              </label>
              <small>Slug انگلیسی، کوتاه و پایدار باشد.</small>

              <label class="eyebrow-field">
                Eyebrow
                <input bind:value={eyebrow} maxlength="100" placeholder="دم‌آوری" />
              </label>
            </aside>
          </div>

          <section class="body-editor">
            <div class="section-heading">
              <div><small>ARTICLE BODY</small><strong>متن کامل مقاله</strong></div>
              <span>## تیتر سطح ۲ · ### تیتر سطح ۳ · - لیست · خط خالی بین پاراگراف‌ها</span>
            </div>
            <textarea class="body" bind:value={body} maxlength="100000" placeholder="متن کامل مقاله را اینجا وارد کن…"></textarea>

            <label class="takeaway-field">
              اگر فقط یک چیز یادت بماند
              <textarea class="short" bind:value={takeaway} maxlength="2000"></textarea>
            </label>
          </section>

          <details class="seo-details" open>
            <summary>
              <div><strong>تنظیمات موتور جستجو</strong><span>Keyword، Meta، Canonical و Robots</span></div>
              <b>SEO</b>
            </summary>

            <div class="seo-fields-grid">
              <label>
                Focus Keyword
                <input bind:value={focusKeyword} maxlength="120" />
              </label>
              <label>
                کلمات کلیدی مکمل
                <input bind:value={secondaryKeywords} maxlength="500" placeholder="با کاما جدا کن" />
              </label>
              <label>
                Meta Title
                <input bind:value={metaTitle} maxlength="180" />
                <small>{metaTitle.length}/180</small>
              </label>
              <label>
                Meta Description
                <textarea class="short" bind:value={metaDescription} maxlength="320"></textarea>
                <small>{metaDescription.length}/320</small>
              </label>
              <label>
                Canonical URL
                <input bind:value={canonicalUrl} maxlength="1000" placeholder="اگر خالی باشد خودکار ساخته می‌شود" />
              </label>
              <label>
                Robots
                <select bind:value={robots}>
                  <option value="index,follow,max-image-preview:large">Index + Follow + Large Image</option>
                  <option value="index,follow">Index + Follow</option>
                  <option value="noindex,follow">Noindex + Follow</option>
                  <option value="noindex,nofollow">Noindex + Nofollow</option>
                </select>
              </label>
            </div>

            <div class="search-preview">
              <small>پیش‌نمایش تقریبی نتیجه جستجو</small>
              <strong>{metaTitle || articleTitle || 'عنوان مطلب'}</strong>
              <span>{canonicalUrl || `https://elseed.ir/magazine/${articleSlug || 'article-slug'}`}</span>
              <p>{metaDescription || excerpt || 'توضیح کوتاه مطلب در نتایج جستجو اینجا دیده می‌شود.'}</p>
            </div>
          </details>

          <details class="seo-details conversion-details">
            <summary>
              <div><strong>قدم بعدی کاربر</strong><span>CTA مقاله و مسیر تبدیل</span></div>
              <b>CTA</b>
            </summary>
            <div class="seo-fields-grid">
              <label>
                متن دکمه
                <input bind:value={ctaLabel} maxlength="160" placeholder="قهوه‌ام را پیدا کن" />
              </label>
              <label>
                لینک
                <input bind:value={ctaHref} maxlength="1000" dir="ltr" placeholder="/find" />
              </label>
              <label class="full-field">
                توضیح CTA
                <textarea class="short" bind:value={ctaText} maxlength="1500"></textarea>
              </label>
            </div>
          </details>
        </section>

      {:else if activeTab === 'media'}
        <section class="visual-tab">
          <div class="featured-card">
            <div class="featured-copy">
              <small>FEATURED IMAGE</small>
              <h3>تصویر شاخص</h3>
              <p>تصویر اصلی مقاله را اینجا انتخاب کن؛ رسانه‌های داخل متن بعد از ذخیره پیش‌نویس مدیریت می‌شوند.</p>
            </div>

            <div class="featured-layout">
              <div class:empty-preview={!coverImage} class="featured-preview">
                {#if coverImage}
                  <img src={coverImage} alt={coverAlt || articleTitle || 'تصویر شاخص'} />
                {:else}
                  <div><span>▧</span><strong>هنوز تصویر شاخص انتخاب نشده</strong><small>پیشنهاد EL.SEED: نسبت 16:9 و حداقل 1200px</small></div>
                {/if}
              </div>

              <div class="featured-fields">
                <a class="upload-image" href="/admin/media">▦ انتخاب از کتابخانه رسانه</a>
                <label>
                  URL تصویر
                  <input bind:value={coverImage} maxlength="1500" dir="ltr" placeholder="https://..." />
                </label>
                <label>
                  Alt تصویر شاخص
                  <input bind:value={coverAlt} maxlength="500" placeholder="توضیح دقیق و طبیعی تصویر" />
                </label>
                {#if coverImage}
                  <button class="remove-image" type="button" onclick={() => { coverImage = ''; coverAlt = ''; }}>حذف تصویر شاخص از مطلب</button>
                {/if}
              </div>
            </div>
          </div>

          {#if articleSaved}
            <AdminArticleMediaTab
              articleId={String(initial.id)}
              articleBody={body}
              onFeatured={(url, alt) => {
                coverImage = url;
                coverAlt = alt;
              }}
            />
          {:else}
            <div class="media-gate">
              <div class="gate-icon">02</div>
              <div>
                <strong>برای افزودن چند تصویر یا ویدئو، اول پیش‌نویس را ذخیره کن.</strong>
                <p>بعد از ذخیره، داخل همین تب می‌توانی چند فایل را هم‌زمان آپلود کنی، از کتابخانه انتخاب کنی و جای هر رسانه را بین پاراگراف‌ها مشخص کنی.</p>
              </div>
              <button class="primary" type="submit" formaction="?/draft">ذخیره پیش‌نویس و ادامه</button>
            </div>
          {/if}
        </section>

      {:else if activeTab === 'publisher'}
        <section class="publisher-tab">
          <div class="publisher-head">
            <div>
              <small>PUBLISHER & CREDIBILITY</small>
              <h3>ناشر اثر و اطلاعات انتشار</h3>
              <p>هویت نویسنده، اعتبار اثر و تنظیمات تحریریه در یک بخش مستقل قرار گرفته‌اند.</p>
            </div>
            <div class="publication-state">
              <span>وضعیت فعلی</span>
              <strong>{initial.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}</strong>
            </div>
          </div>

          <section class="publisher-card">
            <div class="author-preview">
              <div class="avatar-shell">
                {#if publisher.imageUrl}
                  <img src={publisher.imageUrl} alt={publisher.imageAlt || publisher.name} />
                {:else}
                  <div class="avatar-placeholder">{publisher.name.slice(0, 1) || 'E'}</div>
                {/if}
              </div>
              <span class="author-state"><i></i>{articleSaved ? 'ثبت‌شده در مقاله' : 'پروفایل مقاله جدید'}</span>
              <h4>{publisher.name || 'نام ناشر'}</h4>
              <span class="author-role">{publisher.professionalTitle || 'عنوان حرفه‌ای'}</span>
              <p>{publisher.bio || 'معرفی کوتاه ناشر اینجا نمایش داده می‌شود.'}</p>
              <div class="author-url"><small>AUTHOR IDENTITY</small><code>{publisher.slug || 'elseed-editorial'}</code></div>
            </div>

            <div class="author-form">
              <div class="essential-card">
                <div class="section-head">
                  <div><span>01</span><div><strong>اطلاعات ضروری</strong><small>هویت اصلی ناشر مقاله</small></div></div>
                  <b>ESSENTIAL</b>
                </div>

                <div class="field-grid">
                  <label>
                    نام ناشر
                    <input bind:value={publisher.name} maxlength="180" />
                  </label>
                  <label>
                    عنوان حرفه‌ای
                    <input bind:value={publisher.professionalTitle} maxlength="180" />
                  </label>
                  <label>
                    Slug ناشر
                    <div class="slug-input"><span>/authors/</span><input bind:value={publisher.slug} maxlength="160" dir="ltr" /></div>
                  </label>
                  <label>
                    مرجع / پروفایل
                    <input bind:value={publisher.referenceUrl} maxlength="1000" dir="ltr" placeholder="https://..." />
                  </label>
                </div>

                <label>
                  معرفی کوتاه
                  <textarea bind:value={publisher.bio} maxlength="1500" rows="5"></textarea>
                </label>
              </div>

              <details class="advanced-card">
                <summary>
                  <div><span>02</span><div><strong>تصویر و اطلاعات تکمیلی</strong><small>اختیاری</small></div></div>
                  <b>ADVANCED</b>
                </summary>
                <div class="advanced-body">
                  <label>
                    URL تصویر ناشر
                    <input bind:value={publisher.imageUrl} maxlength="1500" dir="ltr" />
                  </label>
                  <label>
                    ALT تصویر ناشر
                    <input bind:value={publisher.imageAlt} maxlength="500" />
                  </label>
                </div>
              </details>
            </div>
          </section>

          <section class="publication-card">
            <div class="section-heading">
              <div><small>EDITORIAL SETTINGS</small><strong>تنظیمات انتشار</strong></div>
              <span>این اطلاعات در لیست و نمایش مجله EL.SEED استفاده می‌شوند.</span>
            </div>
            <div class="publication-grid">
              <label class="switch-line">
                <input type="checkbox" bind:checked={featured} />
                <span><strong>مطلب ویژه</strong><small>برای Featured Story و بخش مطالب منتخب قابل استفاده است.</small></span>
              </label>
              <label>
                ترتیب نمایش
                <input type="number" bind:value={sortOrder} />
              </label>
              <div class="status-card">
                <small>وضعیت ذخیره</small>
                <strong>{articleSaved ? 'در پایگاه داده ثبت شده' : 'هنوز ذخیره نشده'}</strong>
                <span>{initial.status === 'published' ? 'انتشار عمومی فعال است.' : 'تا زمان انتشار عمومی در Draft باقی می‌ماند.'}</span>
              </div>
            </div>
          </section>
        </section>

      {:else if activeTab === 'links'}
        <section class="links-tab">
          {#if articleSaved}
            <header class="links-head">
              <div>
                <small>INTERNAL LINKING</small>
                <h3>لینک‌های داخلی</h3>
                <p>ارتباط این مطلب با صفحات مرتبط را برای کاربر و موتور جستجو مدیریت کن.</p>
              </div>
              <div class="source-card">
                <span>مقاله مبدا</span>
                <strong>{articleTitle}</strong>
                <small>/magazine/{articleSlug}</small>
              </div>
            </header>

            <div class="links-grid">
              <section class="builder-card">
                <div class="section-heading">
                  <div><small>ADD LINK</small><strong>افزودن لینک جدید</strong></div>
                  <span>{articleOptions.length} مقصد در دسترس</span>
                </div>
                <button type="button" class="add-button" onclick={addInternalLink}>+ افزودن لینک</button>
              </section>

              <section class="map-card">
                <div class="section-heading">
                  <div><small>LINK MAP</small><strong>لینک‌های این مقاله</strong></div>
                  <span class="count">{internalLinks.length} لینک</span>
                </div>

                {#if internalLinks.length}
                  <div class="links-list">
                    {#each internalLinks as link, index}
                      <article class="link-item">
                        <div class="link-number">{String(index + 1).padStart(2, '0')}</div>
                        <div class="link-copy">
                          <label>
                            Anchor Text
                            <input bind:value={link.label} maxlength="180" />
                          </label>
                          <label>
                            مقصد
                            <select bind:value={link.href}>
                              <option value="">انتخاب مقصد…</option>
                              <option value="/find">Find My Coffee</option>
                              <option value="/fix">Fix My Coffee</option>
                              {#each articleOptions.filter((option: { id: string; slug: string; title: string }) => option.slug !== articleSlug) as option}
                                <option value={'/magazine/' + option.slug}>{option.title}</option>
                              {/each}
                            </select>
                          </label>
                          <label>
                            یادداشت تحریریه
                            <input bind:value={link.note} maxlength="500" placeholder="اختیاری" />
                          </label>
                        </div>
                        <div class="actions">
                          <button type="button" class="remove" onclick={() => removeInternalLink(index)}>حذف</button>
                        </div>
                      </article>
                    {/each}
                  </div>
                {:else}
                  <div class="empty-state">
                    <div>↗</div>
                    <strong>هنوز لینکی ثبت نشده</strong>
                    <p>اولین ارتباط داخلی مقاله را اضافه کن.</p>
                  </div>
                {/if}
              </section>
            </div>

            <div class="link-guidance">
              <div><b>01</b><span><strong>به مسیر اصلی لینک بده</strong><small>مقاله‌های Support باید به Journey یا مقاله مادر وصل شوند.</small></span></div>
              <div><b>02</b><span><strong>Anchor طبیعی بنویس</strong><small>عبارت توصیفی بهتر از «اینجا کلیک کنید» است.</small></span></div>
              <div><b>03</b><span><strong>تعداد را کنترل کن</strong><small>چند لینک مفید بهتر از تعداد زیادی لینک مصنوعی است.</small></span></div>
            </div>
          {:else}
            <div class="media-gate links-gate">
              <div class="gate-icon">04</div>
              <div>
                <strong>برای ساخت شبکه لینک داخلی، اول پیش‌نویس را ذخیره کن.</strong>
                <p>بعد از ذخیره، مقصد، Anchor Text و یادداشت تحریریه را برای هر ارتباط مشخص می‌کنی.</p>
              </div>
              <button class="primary" type="submit" formaction="?/draft">ذخیره پیش‌نویس و ادامه</button>
            </div>
          {/if}
        </section>

      {:else}
        <section class="questions-tab">
          <header class="questions-hero">
            <div class="questions-icon">؟</div>
            <div>
              <small>AUDIENCE QUESTIONS</small>
              <h3>سؤالات مخاطبان همین مقاله</h3>
              <p>پرسش‌هایی که مقاله باید به آن‌ها جواب بدهد را به‌صورت FAQ مدیریت کن.</p>
            </div>
            <button type="button" class="add-button question-add" onclick={addFaq}>+ سؤال جدید</button>
          </header>

          <section class="questions-kpis">
            <article><small>کل سؤال‌ها</small><strong>{faq.length}</strong></article>
            <article><small>پاسخ‌دار</small><strong>{faq.filter((item: any) => item.question.trim() && item.answer.trim()).length}</strong></article>
          </section>

          {#if faq.length}
            <div class="questions-list">
              {#each faq as item, index}
                <article class="question-card">
                  <header><span>{String(index + 1).padStart(2, '0')}</span><strong>سؤال مخاطب</strong><button type="button" onclick={() => removeFaq(index)}>حذف</button></header>
                  <label>
                    سؤال
                    <input bind:value={item.question} maxlength="500" placeholder="مثلاً: چرا اسپرسوی من ترش می‌شود؟" />
                  </label>
                  <label>
                    پاسخ
                    <textarea bind:value={item.answer} maxlength="4000" rows="5"></textarea>
                  </label>
                </article>
              {/each}
            </div>
          {:else}
            <div class="questions-empty">
              <div>؟</div>
              <strong>هنوز سؤالی برای این مقاله ثبت نشده</strong>
              <p>سؤال‌های واقعی مخاطب را اضافه کن تا هم داخل مقاله پاسخ داده شوند و هم FAQ Schema ساخته شود.</p>
              <button type="button" onclick={addFaq}>+ اولین سؤال را اضافه کن</button>
            </div>
          {/if}
        </section>
      {/if}
    </div>

    <footer class="editor-footer">
      <button type="button" onclick={cancelEditor}>انصراف</button>
      <div class="footer-spacer"></div>
      <button class="draft-action" type="submit" formaction="?/draft">ذخیره پیش‌نویس</button>
      <button class="primary publish-action" type="submit" formaction="?/publish">
        {initial.status === 'published' ? 'ذخیره و بروزرسانی انتشار' : 'انتشار مطلب'}
      </button>
    </footer>
  </section>
</form>

<style>
  .dandooni-editor-shell{font-family:'Vazirmatn',Tahoma,sans-serif;color:#204943;width:100%}
  .editor{width:min(1280px,100%);min-height:760px;margin:0 auto;background:#fbfdfc;border:1px solid rgba(51,106,97,.12);border-radius:28px;box-shadow:0 30px 90px rgba(21,50,47,.12);overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto}
  .editor-head{padding:18px 22px 12px;display:flex;justify-content:space-between;gap:20px;align-items:flex-start;background:#fbfdfc}
  .editor-head small,.featured-copy>small,.publisher-head>div>small,.section-heading small,.links-head small,.questions-hero small{color:#4c897f;font-size:.58rem;font-weight:900;letter-spacing:.12em}
  .editor-head h2{margin:3px 0 2px;font-size:1.28rem}.editor-head p{margin:0;color:#80908d;font-size:.66rem}
  .editor-head>button{width:34px;height:34px;border:0;background:#f0f5f3;color:#55746f;border-radius:11px;cursor:pointer;font-size:1.1rem}
  .editor-tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;padding:0 22px 12px;background:#fbfdfc}
  .editor-tabs button{border:1px solid rgba(45,103,95,.08);background:#fff;border-radius:14px;padding:9px 10px;display:grid;grid-template-columns:32px minmax(0,1fr) 25px;gap:8px;align-items:center;text-align:right;color:#56736e;font:inherit;cursor:pointer}
  .editor-tabs button.active{border-color:rgba(35,112,101,.24);background:#f0f8f5;box-shadow:0 7px 18px rgba(39,95,87,.06)}
  .editor-tabs b{height:30px;border-radius:9px;background:#f1f5f3;display:grid;place-items:center;font-size:.58rem;color:#64827c}
  .editor-tabs button.active b{background:#dff1eb;color:#1f6a60}.editor-tabs span{display:grid;font-weight:900;font-size:.68rem}
  .editor-tabs small{font-size:.54rem;color:#91a09d;font-weight:500;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .editor-tabs i{font-style:normal;width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#f1f4f3;color:#9aa6a4;font-size:.6rem}
  .editor-tabs i.ready{background:#e1f3ed;color:#247365}
  .editor-content{overflow:auto;border-top:1px solid rgba(45,103,95,.07);padding:18px 22px;background:#f7faf8}
  .text-tab,.visual-tab,.publisher-tab,.links-tab,.questions-tab{display:grid;gap:14px}
  .text-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:14px}
  .main-fields,.slug-card,.body-editor,.seo-details,.featured-card,.publication-card,.publisher-card{background:#fff;border:1px solid rgba(45,103,95,.08);border-radius:18px;padding:16px}
  .main-fields,.featured-fields,.seo-fields-grid{display:grid;gap:10px}.two,.field-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  label{display:grid;gap:5px;color:#58736d;font-size:.62rem;font-weight:800}
  input,textarea,select{width:100%;box-sizing:border-box;border:1px solid rgba(45,103,95,.12);background:#fbfdfc;border-radius:11px;padding:9px 10px;color:#294f4a;font:inherit;font-size:.7rem;outline:none}
  input:focus,textarea:focus,select:focus{border-color:rgba(28,116,104,.38);box-shadow:0 0 0 3px rgba(35,126,113,.07)}
  .short{min-height:78px;resize:vertical}.slug-card{align-content:start}.slug-card>span{font-size:.58rem;color:#7a918c}
  .slug-field,.slug-input{display:flex;align-items:center;border:1px solid rgba(45,103,95,.11);border-radius:11px;background:#fbfdfc;overflow:hidden}
  .slug-field b,.slug-input span{font-size:.62rem;color:#76908b;padding:0 9px;direction:ltr;white-space:nowrap}
  .slug-field input,.slug-input input{border:0!important;border-radius:0!important;direction:ltr;text-align:left}
  .slug-card>small{color:#8a9b97;font-size:.56rem;margin-top:5px}.eyebrow-field{margin-top:16px}
  .section-heading{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:10px}.section-heading>div{display:grid}.section-heading strong{font-size:.86rem}.section-heading>span{font-size:.56rem;color:#8b9a97}
  .body{min-height:300px;resize:vertical;line-height:2;direction:rtl}.takeaway-field{margin-top:12px}
  .seo-details summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center}.seo-details summary::-webkit-details-marker{display:none}
  .seo-details summary>div{display:grid}.seo-details summary strong{font-size:.8rem}.seo-details summary span{font-size:.56rem;color:#8a9996}
  .seo-details summary>b{font-size:.6rem;background:#e9f5f1;color:#367a70;padding:5px 8px;border-radius:8px}
  .seo-fields-grid{grid-template-columns:1fr 1fr;margin-top:14px}.seo-fields-grid label small{font-weight:500;text-align:left;color:#9aa6a3}.full-field{grid-column:1/-1}
  .search-preview{border-top:1px solid rgba(45,103,95,.07);margin-top:14px;padding-top:12px;display:grid;gap:2px}.search-preview small{font-size:.56rem;color:#8b9a97}.search-preview strong{color:#245f57;font-size:.76rem}.search-preview span{font-size:.58rem;color:#4e8a78;direction:ltr;text-align:right}.search-preview p{margin:2px 0 0;font-size:.63rem;color:#697f7a;line-height:1.8}
  .featured-card{display:grid;gap:12px}.featured-copy h3,.publisher-head h3{margin:3px 0 4px;font-size:1rem}.featured-copy p,.publisher-head p{margin:0;color:#7a8d89;font-size:.65rem}
  .featured-layout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(250px,.65fr);gap:13px}.featured-preview{min-height:250px;border-radius:15px;background:#edf4f1;overflow:hidden;display:grid;place-items:center}
  .featured-preview img{width:100%;height:100%;object-fit:cover;display:block}.featured-preview.empty-preview>div{text-align:center;color:#82948f;display:grid;gap:5px}.featured-preview.empty-preview span{font-size:2rem}.featured-preview.empty-preview strong{font-size:.72rem}.featured-preview.empty-preview small{font-size:.58rem}
  .upload-image,.remove-image{border:0;border-radius:11px;padding:10px;font:inherit;font-size:.65rem;font-weight:900;cursor:pointer;text-align:center;text-decoration:none}
  .upload-image{background:#e5f4ef;color:#246f64}.remove-image{background:#fff1ed;color:#a15143}
  .media-gate{background:#fff;border:1px dashed rgba(45,103,95,.16);border-radius:18px;padding:20px;display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:14px;align-items:center}
  .gate-icon{width:46px;height:46px;border-radius:14px;background:#e8f4f0;color:#2e746a;display:grid;place-items:center;font-size:.7rem;font-weight:900}.media-gate strong{font-size:.76rem}.media-gate p{font-size:.62rem;color:#80918d;line-height:1.8;margin:3px 0 0}
  .primary{border:0;background:#176d67;color:white;border-radius:13px;padding:10px 15px;font:inherit;font-size:.68rem;font-weight:900;cursor:pointer;box-shadow:0 9px 24px rgba(23,109,103,.16);text-decoration:none;text-align:center}
  .publisher-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}.publication-state{background:#fff;border:1px solid rgba(45,103,95,.08);border-radius:14px;padding:10px 13px;display:grid;gap:2px;min-width:150px}.publication-state span{font-size:.54rem;color:#8b9997}.publication-state strong{font-size:.7rem}
  .publisher-card{display:grid;grid-template-columns:270px minmax(0,1fr);gap:12px}.author-preview{border:1px solid rgba(38,101,92,.09);border-radius:17px;background:linear-gradient(180deg,#f8fbfa,#f1f7f5);padding:16px;text-align:center;align-self:start}
  .avatar-shell{width:96px;height:96px;margin:0 auto 11px}.avatar-shell img,.avatar-placeholder{width:100%;height:100%;border-radius:24px;display:block;object-fit:cover;background:#dbeae6}.avatar-placeholder{display:grid;place-items:center;color:#356f66;font-size:1.8rem;font-weight:900}
  .author-state{display:inline-flex;align-items:center;gap:5px;padding:4px 7px;border-radius:999px;background:#e3f4ed;color:#2e7062;font-size:.49rem}.author-state i{width:5px;height:5px;border-radius:50%;background:currentColor}.author-preview h4{margin:8px 0 2px;font-size:.82rem}.author-role{display:block;color:#4f756e;font-size:.57rem}.author-preview>p{min-height:54px;margin:7px 0;color:#71847f;font-size:.53rem;line-height:1.75}.author-url{margin-top:13px;padding-top:10px;border-top:1px solid rgba(42,101,92,.08);text-align:right}.author-url small{display:block;color:#8b9a97;font-size:.47rem}.author-url code{display:block;margin-top:4px;direction:ltr;text-align:left;color:#3b736a;font-size:.52rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .author-form{display:grid;gap:10px;min-width:0}.essential-card,.advanced-card{border:1px solid rgba(38,101,92,.09);border-radius:17px;background:#fff;overflow:hidden}.essential-card{padding:14px}.section-head,.advanced-card summary{display:flex;align-items:center;justify-content:space-between;gap:12px}.section-head>div,.advanced-card summary>div{display:flex;align-items:center;gap:8px}.section-head>div>span,.advanced-card summary>div>span{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;background:#e6f3ef;color:#2c6e64;font-size:.48rem;font-weight:900}.section-head strong,.section-head small,.advanced-card summary strong,.advanced-card summary small{display:block}.section-head strong,.advanced-card summary strong{font-size:.64rem}.section-head small,.advanced-card summary small{font-size:.48rem;color:#899995;margin-top:1px}.section-head>b{padding:4px 7px;border-radius:7px;background:#e3f4ed;color:#347565;font-size:.47rem}.advanced-card summary{list-style:none;cursor:pointer;padding:12px 14px}.advanced-card summary::-webkit-details-marker{display:none}.advanced-card summary>b{color:#82938f;font-size:.49rem}.advanced-card[open] summary{border-bottom:1px solid rgba(38,101,92,.07)}.advanced-body{padding:12px 14px}
  .publication-card{margin-top:0}.publication-grid{display:grid;grid-template-columns:1.2fr .5fr .8fr;gap:12px}.switch-line,.status-card{border:1px solid rgba(45,103,95,.08);background:#f8fbf9;border-radius:13px;padding:11px}.switch-line{display:flex!important;align-items:center;gap:9px}.switch-line input{width:auto}.switch-line span{display:grid}.switch-line strong{font-size:.68rem}.switch-line small,.status-card span{font-size:.56rem;color:#82928f;font-weight:500}.status-card{display:grid;align-content:center}.status-card small{font-size:.54rem;color:#8b9a97}.status-card strong{font-size:.7rem;margin:2px 0}
  .links-tab{min-height:520px}.links-head{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:12px}.links-head>div:first-child,.source-card,.builder-card,.map-card{background:#fff;border:1px solid rgba(38,101,92,.09);border-radius:17px;padding:14px 16px}.links-head h3{margin:3px 0;font-size:.9rem}.links-head p{margin:0;color:#7c908b;font-size:.6rem;line-height:1.9}.source-card{display:grid;align-content:center;gap:3px;background:linear-gradient(135deg,#eef8f5,#f8fbfa)}.source-card>span{font-size:.5rem;color:#7e918d}.source-card>strong{font-size:.68rem}.source-card>small{font-size:.55rem;color:#5e817a;direction:ltr;text-align:right}
  .links-grid{display:grid;grid-template-columns:380px minmax(0,1fr);gap:14px}.section-heading .count{background:#edf6f3;color:#2b7168;border-radius:999px;padding:5px 9px;font-size:.55rem;font-weight:900}.add-button{border:0;background:#e4f2ee;color:#256e64;border-radius:11px;padding:10px 12px;font:inherit;font-size:.64rem;font-weight:900;cursor:pointer}
  .links-list{display:grid;gap:8px}.link-item{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:10px;align-items:start;border:1px solid rgba(45,103,95,.075);background:#fbfdfc;border-radius:14px;padding:10px 11px}.link-number{width:34px;height:34px;border-radius:10px;background:#edf5f2;display:grid;place-items:center;font-size:.56rem;font-weight:900;color:#557b75}.link-copy{display:grid;gap:8px}.actions button{border:1px solid rgba(45,103,95,.10);background:#fff7f4;border-radius:8px;padding:7px;color:#a45649;font:inherit;font-size:.54rem;cursor:pointer}
  .empty-state{min-height:260px;border:1px dashed rgba(45,103,95,.15);background:linear-gradient(180deg,#fbfdfc,#f7fbf9);border-radius:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#82918f;padding:28px}.empty-state>div{width:44px;height:44px;border-radius:13px;background:#eaf4f1;color:#2f746b;display:grid;place-items:center;margin-bottom:8px}.empty-state strong{font-size:.68rem;color:#466d67}.empty-state p{font-size:.56rem}
  .link-guidance{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.link-guidance>div{background:#fff;border:1px solid rgba(45,103,95,.075);border-radius:14px;padding:10px 11px;display:flex;gap:9px}.link-guidance b{width:28px;height:28px;flex:0 0 28px;border-radius:9px;background:#edf5f2;color:#3a776f;display:grid;place-items:center;font-size:.52rem}.link-guidance span{display:grid;gap:1px}.link-guidance strong{font-size:.59rem}.link-guidance small{font-size:.51rem;color:#8b9997}
  .questions-hero{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:12px;align-items:center;background:#fff;border:1px solid rgba(38,101,92,.09);border-radius:18px;padding:16px}.questions-icon{width:46px;height:46px;border-radius:14px;background:#e8f4f0;color:#2e746a;display:grid;place-items:center;font-weight:900}.questions-hero h3{margin:2px 0;font-size:.9rem}.questions-hero p{margin:0;color:#7d8f8b;font-size:.59rem}.question-add{white-space:nowrap}.questions-kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.questions-kpis article{background:#fff;border:1px solid rgba(45,103,95,.08);border-radius:14px;padding:12px}.questions-kpis small{display:block;color:#81918e;font-size:.56rem}.questions-kpis strong{display:block;margin-top:3px;font-size:1.25rem;color:#235b54}.questions-list{display:grid;gap:10px}.question-card{background:#fff;border:1px solid rgba(45,103,95,.08);border-radius:16px;padding:14px;display:grid;gap:10px}.question-card header{display:flex;align-items:center;gap:8px}.question-card header span{width:30px;height:30px;border-radius:9px;background:#edf5f2;display:grid;place-items:center;font-size:.55rem}.question-card header strong{font-size:.68rem}.question-card header button{margin-right:auto;border:0;background:#fff1ed;color:#a15143;border-radius:8px;padding:6px 9px;font:inherit;font-size:.54rem}.questions-empty{min-height:300px;background:#fff;border:1px dashed rgba(45,103,95,.16);border-radius:18px;display:grid;place-items:center;text-align:center;align-content:center;padding:30px;color:#82918f}.questions-empty>div{width:48px;height:48px;border-radius:14px;background:#e8f4f0;color:#2e746a;display:grid;place-items:center;font-weight:900}.questions-empty strong{margin-top:9px;font-size:.75rem;color:#466d67}.questions-empty p{max-width:520px;margin:5px 0 13px;font-size:.59rem;line-height:1.8}.questions-empty button{border:0;background:#e4f2ee;color:#256e64;border-radius:11px;padding:9px 12px;font:inherit;font-size:.62rem;font-weight:900}
  .editor-footer{border-top:1px solid rgba(45,103,95,.08);padding:12px 22px;display:flex;gap:8px;align-items:center;background:#fff}.editor-footer>button{border:1px solid rgba(45,103,95,.1);background:#f8faf9;color:#51736d;border-radius:11px;padding:9px 12px;font:inherit;font-size:.64rem;font-weight:800;cursor:pointer}.editor-footer .primary{border:0;background:#176d67;color:white}.editor-footer .draft-action{background:#eef6f3;color:#286c63}.footer-spacer{flex:1}
  @media(max-width:900px){.editor{border-radius:20px}.editor-tabs{grid-template-columns:1fr 1fr}.text-grid,.featured-layout,.seo-fields-grid,.publication-grid,.publisher-card,.links-grid,.links-head{grid-template-columns:1fr}.media-gate{grid-template-columns:44px 1fr}.media-gate .primary{grid-column:1/-1}.editor-content{padding:14px}.editor-head,.editor-tabs,.editor-footer{padding-left:14px;padding-right:14px}.link-guidance{grid-template-columns:1fr}}
</style>
