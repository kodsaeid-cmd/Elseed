<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head><title>مدیا | EL.SEED Admin</title><meta name="robots" content="noindex,nofollow" /></svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">MEDIA LIBRARY</span>
      <h1>مدیا</h1>
      <p>کتابخانه مرکزی تصویرها برای مجله و بقیه ماژول‌های EL.SEED.</p>
    </div>
  </header>

  {#if form?.error}<div class="admin-alert admin-alert-error">{form.error}</div>{/if}
  {#if form?.success}<div class="admin-alert admin-alert-success">{form.message}</div>{/if}

  <section class="admin-panel">
    <div class="admin-panel-head"><div><span>ADD ASSET</span><h2>افزودن تصویر</h2></div></div>
    <form method="POST" action="?/add" class="admin-inline-form">
      <label><span>نام</span><input name="name" required /></label>
      <label class="admin-inline-wide"><span>URL</span><input name="url" dir="ltr" required /></label>
      <label class="admin-inline-wide"><span>ALT</span><input name="alt_text" /></label>
      <button type="submit">افزودن</button>
    </form>
  </section>

  <section class="admin-media-grid">
    {#each data.assets as asset}
      <article class="admin-media-card">
        <div class="admin-media-preview"><img src={asset.url} alt={asset.alt_text || asset.name} loading="lazy" /></div>
        <div class="admin-media-body">
          <strong>{asset.name}</strong>
          <small>{asset.alt_text || 'ALT ثبت نشده'}</small>
          <code dir="ltr">{asset.url}</code>
          <form method="POST" action="?/delete">
            <input type="hidden" name="id" value={asset.id} />
            <button type="submit">حذف رکورد</button>
          </form>
        </div>
      </article>
    {:else}
      <div class="admin-empty-card">هنوز تصویری در Media Library ثبت نشده است.</div>
    {/each}
  </section>
</div>
