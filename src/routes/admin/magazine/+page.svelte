<script lang="ts">
  let { data } = $props();

  const tabs = [
    { value: 'all', label: 'همه' },
    { value: 'published', label: 'منتشرشده' },
    { value: 'draft', label: 'پیش‌نویس' },
    { value: 'archived', label: 'آرشیو' }
  ];
</script>

<svelte:head>
  <title>مدیریت مجله | EL.SEED Admin</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">MAGAZINE CMS</span>
      <h1>مجله</h1>
      <p>نوشتن، ویرایش، انتشار و مدیریت SEO مقاله‌های EL.SEED.</p>
    </div>
    <a class="admin-primary-action" href="/admin/magazine/new">مقاله جدید +</a>
  </header>

  <div class="admin-tabs">
    {#each tabs as tab}
      <a
        class:active={data.status === tab.value}
        href={tab.value === 'all' ? '/admin/magazine' : '/admin/magazine?status=' + tab.value}
      >{tab.label}</a>
    {/each}
  </div>

  <section class="admin-panel">
    <div class="admin-table-wrap">
      <table class="admin-table admin-table-large">
        <thead>
          <tr>
            <th>مقاله</th>
            <th>دسته</th>
            <th>وضعیت</th>
            <th>Featured</th>
            <th>آخرین تغییر</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each data.articles as article}
            <tr>
              <td>
                <div class="admin-article-cell">
                  {#if article.cover_image}
                    <img src={article.cover_image} alt="" />
                  {/if}
                  <div>
                    <strong>{article.title}</strong>
                    <small dir="ltr">/magazine/{article.slug}</small>
                  </div>
                </div>
              </td>
              <td>{article.category || '—'}</td>
              <td><span class="admin-status admin-status-{article.status}">{article.status}</span></td>
              <td>{article.featured ? '●' : '—'}</td>
              <td dir="ltr">{article.updated_at?.slice(0, 16).replace('T', ' ')}</td>
              <td class="admin-row-actions">
                {#if article.status === 'published'}
                  <a href={'/magazine/' + article.slug} target="_blank" rel="noreferrer">نمایش ↗</a>
                {/if}
                <a href={'/admin/magazine/' + article.id}>ویرایش</a>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="6" class="admin-empty">مقاله‌ای در این وضعیت وجود ندارد.</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
