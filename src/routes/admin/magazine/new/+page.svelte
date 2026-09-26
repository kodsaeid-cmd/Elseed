<script lang="ts">
  import AdminArticleForm from '$lib/AdminArticleForm.svelte';
  let { data, form } = $props();

  const initial = {
    title: '',
    slug: '',
    eyebrow: '',
    category: '',
    excerpt: '',
    reading_time: '۵ دقیقه مطالعه',
    cover_image: '',
    cover_alt: '',
    status: 'draft',
    featured: 0,
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    robots: 'index,follow,max-image-preview:large',
    content_json: JSON.stringify({
      quickAnswer: '',
      body: '',
      sections: [{ heading: '', paragraphs: [], bullets: [] }],
      faq: [],
      relatedSlugs: [],
      internalLinks: [],
      focusKeyword: '',
      secondaryKeywords: '',
      sortOrder: 0,
      publisher: {
        name: 'تحریریه EL.SEED',
        slug: 'elseed-editorial',
        professionalTitle: 'تحریریه EL.SEED',
        bio: '',
        imageUrl: '',
        imageAlt: '',
        referenceUrl: ''
      }
    }),
    cta_json: '{}',
    takeaway: ''
  };
</script>

<svelte:head>
  <title>مقاله جدید | EL.SEED Admin</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="dandooni-editor-page">
  {#if form?.error}
    <div class="admin-alert admin-alert-error editor-page-message">{form.error}</div>
  {/if}

  <AdminArticleForm {initial} articleOptions={data.articleOptions} submitLabel="ساخت مقاله" />
</div>

<style>
  .dandooni-editor-page{
    width:min(1320px,calc(100% - 36px));
    margin:0 auto;
    padding:24px 0 44px;
  }
  .editor-page-message{max-width:1280px;margin:0 auto 12px}
  :global(.admin-main:has(.dandooni-editor-page)){background:#f5f8f6}
  @media(max-width:820px){.dandooni-editor-page{width:100%;padding:12px}}
</style>
