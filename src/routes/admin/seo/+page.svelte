<script lang="ts">
  let { data } = $props();
</script>

<svelte:head><title>SEO | EL.SEED Admin</title><meta name="robots" content="noindex,nofollow" /></svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">SEARCH CONTROL</span>
      <h1>SEO</h1>
      <p>کنترل Meta، Canonical، Robots و وضعیت ایندکس مقالات مجله.</p>
    </div>
  </header>

  <section class="admin-stats admin-stats-four">
    <div><span>کل صفحات مقاله</span><strong>{data.summary.total}</strong></div>
    <div><span>بدون Meta Title</span><strong>{data.summary.missingTitle}</strong></div>
    <div><span>بدون Description</span><strong>{data.summary.missingDescription}</strong></div>
    <div><span>Noindex</span><strong>{data.summary.noindex}</strong></div>
  </section>

  <section class="admin-panel">
    <div class="admin-table-wrap">
      <table class="admin-table admin-table-large">
        <thead><tr><th>صفحه</th><th>Meta Title</th><th>Description</th><th>Robots</th><th>Canonical</th><th></th></tr></thead>
        <tbody>
          {#each data.articles as article}
            <tr>
              <td><strong>{article.title}</strong><small dir="ltr">/{article.slug}</small></td>
              <td><span class:admin-missing={!article.meta_title}>{article.meta_title || 'ثبت نشده'}</span><small>{article.meta_title?.length ?? 0} کاراکتر</small></td>
              <td><span class:admin-missing={!article.meta_description}>{article.meta_description || 'ثبت نشده'}</span><small>{article.meta_description?.length ?? 0} کاراکتر</small></td>
              <td><code>{article.robots || 'index,follow'}</code></td>
              <td><small dir="ltr">{article.canonical_url || '/magazine/' + article.slug}</small></td>
              <td><a href={'/admin/magazine/' + article.id}>ویرایش SEO</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
