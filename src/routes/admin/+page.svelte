<script lang="ts">
  let { data } = $props();
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
      <p>مدیریت EL.SEED را از دو ماژول اصلی جلو ببر: محتوا و رشد، یا فروشگاه.</p>
    </div>
  </header>

  <section class="admin-home-modules">
    <a class="admin-home-module admin-home-module-primary" href="/admin/content">
      <div class="admin-home-module-head">
        <span>CONTENT & GROWTH</span>
        <i>←</i>
      </div>
      <h2>محتوا و رشد</h2>
      <p>مجله، SEO، Journeyها، خبرنامه و مدیا؛ همه در یک فضای کاری واحد.</p>
      <div class="admin-home-module-stats">
        <span><strong>{data.stats.articles}</strong> مقاله</span>
        <span><strong>{data.stats.journeys}</strong> Journey</span>
        <span><strong>{data.stats.newsletter}</strong> عضو خبرنامه</span>
      </div>
    </a>

    <a class="admin-home-module" href="/admin/shop">
      <div class="admin-home-module-head">
        <span>COMMERCE</span>
        <i>←</i>
      </div>
      <h2>فروشگاه</h2>
      <p>محصولات، سفارش‌ها، موجودی و اتصال Commerce به Medusa.</p>
      <div class="admin-home-module-stats">
        <span class:ok={data.connections.medusa}>
          <strong>{data.connections.medusa ? 'متصل' : 'نیاز به اتصال'}</strong>
          Medusa
        </span>
      </div>
    </a>
  </section>

  <section class="admin-system-health">
    <div class:ok={data.connections.d1}><i></i><span>D1 Database</span></div>
    <div class:ok={data.connections.magazine}><i></i><span>Content CMS</span></div>
    <div class:ok={data.connections.journeys}><i></i><span>Journeys</span></div>
    <div class:ok={data.connections.newsletter}><i></i><span>Newsletter</span></div>
    <div class:ok={data.connections.medusa}><i></i><span>Medusa</span></div>
  </section>

  <section class="admin-panel">
    <div class="admin-panel-head">
      <div>
        <span>RECENT CONTENT</span>
        <h2>آخرین مقاله‌ها</h2>
      </div>
      <a href="/admin/content">رفتن به محتوا و رشد ←</a>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>عنوان</th><th>وضعیت</th><th>آخرین تغییر</th><th></th></tr>
        </thead>
        <tbody>
          {#each data.recentArticles as article}
            <tr>
              <td><strong>{article.title}</strong><small>/{article.slug}</small></td>
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
