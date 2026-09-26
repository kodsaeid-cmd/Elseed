<script lang="ts">
  import AdminArticleForm from '$lib/AdminArticleForm.svelte';
  let { data, form } = $props();
</script>

<svelte:head>
  <title>{data.article.title} | EL.SEED Admin</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="admin-page">
  <header class="admin-page-head admin-page-head-compact">
    <div>
      <span class="admin-kicker">CONTENT STUDIO</span>
      <h1>{data.article.title}</h1>
      <p dir="ltr">/magazine/{data.article.slug}</p>
    </div>
    <div class="admin-head-actions">
      {#if data.article.status === 'published'}
        <a class="admin-secondary-action" href={'/magazine/' + data.article.slug} target="_blank" rel="noreferrer">مشاهده ↗</a>
      {/if}
      <a class="admin-secondary-action" href="/admin/magazine">← مقالات</a>
    </div>
  </header>

  {#if form?.success}
    <div class="admin-alert admin-alert-success">{form.message}</div>
  {/if}

  {#if form?.error}
    <div class="admin-alert admin-alert-error">{form.error}</div>
  {/if}

  <AdminArticleForm initial={data.article} articleOptions={data.articleOptions} submitLabel="ذخیره تغییرات" />

  <section class="admin-danger-zone">
    <div>
      <strong>حذف مقاله</strong>
      <p>این عملیات مقاله را از CMS حذف می‌کند. Revisionهای قبلی هم با آن حذف می‌شوند.</p>
    </div>
    <form method="POST" action="?/delete">
      <button type="submit">حذف مقاله</button>
    </form>
  </section>
</div>
