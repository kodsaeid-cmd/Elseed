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
    robots: 'index,follow',
    content_json: JSON.stringify({
      quickAnswer: '',
      sections: [{ heading: '', paragraphs: [''], bullets: [] }]
    }),
    cta_json: '{}',
    takeaway: ''
  };
</script>

<svelte:head>
  <title>مقاله جدید | EL.SEED Admin</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="admin-page">
  <header class="admin-page-head admin-page-head-compact">
    <div>
      <span class="admin-kicker">CONTENT STUDIO</span>
      <h1>مقاله جدید</h1>
    </div>
    <a class="admin-secondary-action" href="/admin/magazine">← بازگشت</a>
  </header>

  {#if form?.error}
    <div class="admin-alert admin-alert-error">{form.error}</div>
  {/if}

  <AdminArticleForm {initial} articleOptions={data.articleOptions} submitLabel="ساخت مقاله" />
</div>
