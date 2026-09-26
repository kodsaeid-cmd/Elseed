<script lang="ts">
  let { data } = $props();

  const statCards = [
    { label: 'کل مقالات', value: data.stats.articles, href: '/admin/magazine' },
    { label: 'منتشرشده', value: data.stats.published, href: '/admin/magazine?status=published' },
    { label: 'پیش‌نویس', value: data.stats.drafts, href: '/admin/magazine?status=draft' },
    { label: 'Journey Session', value: data.stats.journeys, href: '/admin/journeys' },
    { label: 'اعضای خبرنامه', value: data.stats.newsletter, href: '/admin/newsletter' },
    { label: 'Interaction Event', value: data.stats.events, href: '/admin/journeys' }
  ];
</script>

<svelte:head>
  <title>داشبورد ادمین | EL.SEED</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">CONTROL ROOM</span>
      <h1>داشبورد</h1>
      <p>نمای مرکزی محتوا، رفتار کاربر و ماژول‌های EL.SEED.</p>
    </div>
    <a class="admin-primary-action" href="/admin/magazine/new">مقاله جدید +</a>
  </header>

  <section class="admin-status-strip">
    <div class:ok={data.connections.d1}><i></i><span>D1 Database</span><b>{data.connections.d1 ? 'Connected' : 'Missing'}</b></div>
    <div class:ok={data.connections.magazine}><i></i><span>Magazine CMS</span><b>Connected</b></div>
    <div class:ok={data.connections.journeys}><i></i><span>Journeys</span><b>{data.connections.journeys ? 'Connected' : 'Missing'}</b></div>
    <div class:ok={data.connections.newsletter}><i></i><span>Newsletter</span><b>{data.connections.newsletter ? 'Connected' : 'Missing'}</b></div>
    <div class:ok={data.connections.medusa}><i></i><span>Medusa Commerce</span><b>{data.connections.medusa ? 'Connected' : 'Not configured'}</b></div>
  </section>

  <section class="admin-stats">
    {#each statCards as item}
      <a href={item.href}>
        <span>{item.label}</span>
        <strong>{item.value}</strong>
        <i>←</i>
      </a>
    {/each}
  </section>

  <section class="admin-panel">
    <div class="admin-panel-head">
      <div>
        <span>MAGAZINE</span>
        <h2>آخرین مقاله‌ها</h2>
      </div>
      <a href="/admin/magazine">همه مقاله‌ها ←</a>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>عنوان</th><th>دسته</th><th>وضعیت</th><th>آخرین تغییر</th><th></th></tr>
        </thead>
        <tbody>
          {#each data.recentArticles as article}
            <tr>
              <td><strong>{article.title}</strong><small>/{article.slug}</small></td>
              <td>{article.category}</td>
              <td><span class="admin-status admin-status-{article.status}">{article.status}</span></td>
              <td dir="ltr">{article.updated_at?.slice(0, 16).replace('T', ' ')}</td>
              <td><a href={'/admin/magazine/' + article.id}>ویرایش</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
