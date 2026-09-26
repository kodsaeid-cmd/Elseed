<script lang="ts">
  import AdminArticleForm from '$lib/AdminArticleForm.svelte';
  let { data, form } = $props();
</script>

<svelte:head>
  <title>{data.article.title} | EL.SEED Admin</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="dandooni-editor-page">
  {#if data.saved}
    <div class="admin-alert admin-alert-success editor-page-message">
      {data.saved === 'published' ? 'مقاله با موفقیت منتشر شد.' : data.saved === 'archived' ? 'مقاله آرشیو شد.' : 'پیش‌نویس با موفقیت ذخیره شد.'}
    </div>
  {/if}

  {#if form?.error}
    <div class="admin-alert admin-alert-error editor-page-message">{form.error}</div>
  {/if}

  <AdminArticleForm initial={data.article} articleOptions={data.articleOptions} submitLabel="ذخیره تغییرات" />

  <section class="editor-danger-zone">
    <div>
      <strong>حذف مقاله</strong>
      <p>این عملیات مقاله را از CMS حذف می‌کند. Revisionهای قبلی هم با آن حذف می‌شوند.</p>
    </div>
    <form method="POST" action="?/delete">
      <button type="submit">حذف مقاله</button>
    </form>
  </section>
</div>

<style>
  .dandooni-editor-page{
    width:min(1320px,calc(100% - 36px));
    margin:0 auto;
    padding:24px 0 44px;
  }
  .editor-page-message{max-width:1280px;margin:0 auto 12px}
  .editor-danger-zone{
    max-width:1280px;
    margin:14px auto 0;
    padding:14px 16px;
    border:1px solid rgba(160,83,69,.14);
    border-radius:16px;
    background:#fff8f6;
    display:flex;
    justify-content:space-between;
    gap:18px;
    align-items:center;
    color:#704d46;
  }
  .editor-danger-zone strong{font-size:.72rem}
  .editor-danger-zone p{margin:3px 0 0;font-size:.58rem;color:#9a7770}
  .editor-danger-zone button{border:1px solid rgba(160,83,69,.18);background:#fff;color:#a15143;border-radius:10px;padding:8px 11px;font:inherit;font-size:.6rem;font-weight:900}
  :global(.admin-main:has(.dandooni-editor-page)){background:#f5f8f6}
  @media(max-width:820px){.dandooni-editor-page{width:100%;padding:12px}.editor-danger-zone{align-items:flex-start;flex-direction:column}}
</style>
