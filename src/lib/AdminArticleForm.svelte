<script lang="ts">
  let {
    initial,
    submitLabel = 'ذخیره مقاله',
    articleOptions = []
  } = $props<{
    initial: Record<string, any>;
    submitLabel?: string;
    articleOptions?: { id: string; slug: string; title: string }[];
  }>();

  function parseJson(value: string | undefined, fallback: any) {
    try {
      return JSON.parse(value || '');
    } catch {
      return fallback;
    }
  }

  const initialContent = parseJson(initial.content_json, {
    quickAnswer: initial.quickAnswer ?? '',
    sections: initial.sections ?? [],
    faq: initial.faq ?? [],
    relatedSlugs: initial.relatedSlugs ?? [],
    internalLinks: initial.internalLinks ?? []
  });
  const initialCta = parseJson(initial.cta_json, initial.cta ?? {});

  let quickAnswer = $state(initialContent.quickAnswer ?? '');

  let sections = $state(
    (initialContent.sections?.length ? initialContent.sections : [{ heading: '', paragraphs: [''], bullets: [] }]).map(
      (section: any) => ({
        heading: section.heading ?? '',
        paragraphsText: Array.isArray(section.paragraphs) ? section.paragraphs.join('\n\n') : '',
        bulletsText: Array.isArray(section.bullets) ? section.bullets.join('\n') : ''
      })
    )
  );

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
      href: item.href ?? ''
    }))
  );

  let ctaLabel = $state(initialCta.label ?? '');
  let ctaHref = $state(initialCta.href ?? '');
  let ctaText = $state(initialCta.text ?? '');

  const contentJson = $derived(
    JSON.stringify({
      quickAnswer,
      sections: sections.map((section: any) => ({
        heading: section.heading.trim(),
        paragraphs: section.paragraphsText
          .split(/\n\s*\n/)
          .map((item: string) => item.trim())
          .filter(Boolean),
        bullets: section.bulletsText
          .split('\n')
          .map((item: string) => item.trim())
          .filter(Boolean)
      })),
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
          href: item.href.trim()
        }))
        .filter((item: any) => item.label && item.href)
    })
  );

  const ctaJson = $derived(
    JSON.stringify(
      ctaLabel || ctaHref || ctaText
        ? { label: ctaLabel.trim(), href: ctaHref.trim(), text: ctaText.trim() }
        : {}
    )
  );

  function addSection() {
    sections.push({ heading: '', paragraphsText: '', bulletsText: '' });
  }

  function removeSection(index: number) {
    if (sections.length === 1) return;
    sections.splice(index, 1);
  }

  function addFaq() {
    faq.push({ question: '', answer: '' });
  }

  function removeFaq(index: number) {
    faq.splice(index, 1);
  }

  function addInternalLink() {
    internalLinks.push({ label: '', href: '' });
  }

  function removeInternalLink(index: number) {
    internalLinks.splice(index, 1);
  }
</script>

<form method="POST" class="admin-editor-form">
  <input type="hidden" name="content_json" value={contentJson} />
  <input type="hidden" name="cta_json" value={ctaJson} />

  <div class="admin-editor-main">
    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>ARTICLE</span>
          <h2>محتوای اصلی</h2>
        </div>
      </div>

      <div class="admin-fields">
        <label class="admin-field admin-field-wide">
          <span>عنوان مقاله</span>
          <input name="title" value={initial.title ?? ''} required maxlength="240" />
        </label>

        <label class="admin-field">
          <span>Slug</span>
          <input name="slug" value={initial.slug ?? ''} required dir="ltr" placeholder="coffee-guide" />
        </label>

        <label class="admin-field">
          <span>دسته‌بندی</span>
          <input name="category" value={initial.category ?? ''} placeholder="دم‌آوری" />
        </label>

        <label class="admin-field">
          <span>Eyebrow</span>
          <input name="eyebrow" value={initial.eyebrow ?? ''} />
        </label>

        <label class="admin-field">
          <span>زمان مطالعه</span>
          <input name="reading_time" value={initial.reading_time ?? initial.meta ?? ''} placeholder="۶ دقیقه مطالعه" />
        </label>

        <label class="admin-field admin-field-wide">
          <span>خلاصه / لید</span>
          <textarea name="excerpt" rows="4">{initial.excerpt ?? ''}</textarea>
        </label>
      </div>
    </section>

    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>BODY</span>
          <h2>بدنه مقاله</h2>
        </div>
        <button type="button" class="admin-ghost-button" onclick={addSection}>+ سکشن جدید</button>
      </div>

      <label class="admin-field admin-field-wide">
        <span>جواب کوتاه</span>
        <textarea bind:value={quickAnswer} rows="3" placeholder="پاسخ سریع ابتدای مقاله"></textarea>
      </label>

      <div class="admin-section-editor">
        {#each sections as section, index}
          <article>
            <div class="admin-section-editor-head">
              <strong>سکشن {index + 1}</strong>
              <button type="button" onclick={() => removeSection(index)} disabled={sections.length === 1}>حذف</button>
            </div>

            <label class="admin-field admin-field-wide">
              <span>تیتر سکشن</span>
              <input bind:value={section.heading} />
            </label>

            <label class="admin-field admin-field-wide">
              <span>پاراگراف‌ها</span>
              <textarea bind:value={section.paragraphsText} rows="7" placeholder="بین هر دو پاراگراف یک خط خالی بگذار."></textarea>
            </label>

            <label class="admin-field admin-field-wide">
              <span>Bulletها — هر مورد یک خط</span>
              <textarea bind:value={section.bulletsText} rows="4"></textarea>
            </label>
          </article>
        {/each}
      </div>

      <label class="admin-field admin-field-wide">
        <span>اگر فقط یک چیز یادت بماند</span>
        <textarea name="takeaway" rows="3">{initial.takeaway ?? ''}</textarea>
      </label>
    </section>

    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>FAQ</span>
          <h2>سؤال‌های متداول</h2>
        </div>
        <button type="button" class="admin-ghost-button" onclick={addFaq}>+ سؤال</button>
      </div>

      <div class="admin-section-editor">
        {#each faq as item, index}
          <article>
            <div class="admin-section-editor-head">
              <strong>FAQ {index + 1}</strong>
              <button type="button" onclick={() => removeFaq(index)}>حذف</button>
            </div>
            <label class="admin-field admin-field-wide">
              <span>سؤال</span>
              <input bind:value={item.question} />
            </label>
            <label class="admin-field admin-field-wide">
              <span>جواب</span>
              <textarea bind:value={item.answer} rows="4"></textarea>
            </label>
          </article>
        {:else}
          <div class="admin-editor-empty">FAQ اختیاری است؛ در صورت نیاز اضافه کن.</div>
        {/each}
      </div>
    </section>

    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>INTERNAL LINKS</span>
          <h2>لینک‌سازی داخلی</h2>
        </div>
        <button type="button" class="admin-ghost-button" onclick={addInternalLink}>+ لینک</button>
      </div>

      <div class="admin-section-editor">
        {#each internalLinks as item, index}
          <article>
            <div class="admin-section-editor-head">
              <strong>لینک {index + 1}</strong>
              <button type="button" onclick={() => removeInternalLink(index)}>حذف</button>
            </div>
            <div class="admin-fields">
              <label class="admin-field">
                <span>Anchor Text</span>
                <input bind:value={item.label} />
              </label>
              <label class="admin-field">
                <span>URL</span>
                <input bind:value={item.href} dir="ltr" placeholder="/find" />
              </label>
            </div>
          </article>
        {:else}
          <div class="admin-editor-empty">هنوز لینک داخلی دستی ثبت نشده است.</div>
        {/each}
      </div>
    </section>

    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>CTA</span>
          <h2>قدم بعدی کاربر</h2>
        </div>
      </div>

      <div class="admin-fields">
        <label class="admin-field">
          <span>متن دکمه</span>
          <input bind:value={ctaLabel} />
        </label>
        <label class="admin-field">
          <span>لینک</span>
          <input bind:value={ctaHref} dir="ltr" placeholder="/find" />
        </label>
        <label class="admin-field admin-field-wide">
          <span>توضیح CTA</span>
          <textarea bind:value={ctaText} rows="3"></textarea>
        </label>
      </div>
    </section>

    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>SEO</span>
          <h2>تنظیمات موتور جستجو</h2>
        </div>
      </div>

      <div class="admin-fields">
        <label class="admin-field admin-field-wide">
          <span>Meta Title</span>
          <input name="meta_title" value={initial.meta_title ?? ''} maxlength="240" />
        </label>

        <label class="admin-field admin-field-wide">
          <span>Meta Description</span>
          <textarea name="meta_description" rows="3">{initial.meta_description ?? ''}</textarea>
        </label>

        <label class="admin-field">
          <span>Canonical</span>
          <input name="canonical_url" value={initial.canonical_url ?? ''} dir="ltr" />
        </label>

        <label class="admin-field">
          <span>Robots</span>
          <select name="robots" value={initial.robots ?? 'index,follow'}>
            <option value="index,follow">index,follow</option>
            <option value="noindex,follow">noindex,follow</option>
            <option value="noindex,nofollow">noindex,nofollow</option>
          </select>
        </label>
      </div>
    </section>
  </div>

  <aside class="admin-editor-sidebar">
    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>PUBLISH</span>
          <h2>انتشار</h2>
        </div>
      </div>

      <label class="admin-field admin-field-wide">
        <span>وضعیت</span>
        <select name="status" value={initial.status ?? 'draft'}>
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشرشده</option>
          <option value="archived">آرشیو</option>
        </select>
      </label>

      <label class="admin-check">
        <input type="checkbox" name="featured" checked={Boolean(initial.featured)} />
        <span>مقاله Featured باشد</span>
      </label>

      <button class="admin-save-button" type="submit">{submitLabel}</button>
    </section>

    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>COVER</span>
          <h2>تصویر کاور</h2>
        </div>
      </div>

      <label class="admin-field admin-field-wide">
        <span>URL تصویر</span>
        <input name="cover_image" value={initial.cover_image ?? initial.image ?? ''} dir="ltr" />
      </label>

      <label class="admin-field admin-field-wide">
        <span>ALT تصویر</span>
        <textarea name="cover_alt" rows="3">{initial.cover_alt ?? initial.imageAlt ?? ''}</textarea>
      </label>

      {#if initial.cover_image || initial.image}
        <div class="admin-cover-preview">
          <img src={initial.cover_image ?? initial.image} alt="" />
        </div>
      {/if}
    </section>

    <section class="admin-form-card">
      <div class="admin-form-card-head">
        <div>
          <span>RELATED</span>
          <h2>مقالات مرتبط</h2>
        </div>
      </div>

      <div class="admin-related-picker">
        {#each articleOptions.filter((option) => option.slug !== initial.slug) as option}
          <label>
            <input type="checkbox" value={option.slug} bind:group={relatedSlugs} />
            <span>{option.title}</span>
          </label>
        {:else}
          <p>مقاله دیگری برای ارتباط وجود ندارد.</p>
        {/each}
      </div>
    </section>
  </aside>
</form>
