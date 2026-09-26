<script lang="ts">
  let { data } = $props();

  const modules = [
    {
      href: '/admin/magazine',
      kicker: 'EDITORIAL',
      title: 'مجله و مقالات',
      description: 'ساخت، ویرایش و انتشار مقاله، FAQ، Related Articles و لینک‌سازی داخلی.',
      stat: data.counts.articles + ' مقاله',
      detail: data.counts.published + ' منتشرشده'
    },
    {
      href: '/admin/seo',
      kicker: 'SEARCH',
      title: 'SEO',
      description: 'Meta Title، Description، Canonical، Robots و کنترل وضعیت صفحات مجله.',
      stat: data.counts.seoIssues + ' مورد نیازمند بررسی',
      detail: 'SEO Control'
    },
    {
      href: '/admin/journeys',
      kicker: 'BEHAVIOR',
      title: 'Journeyها',
      description: 'رفتار کاربران در Find / Fix / Me و پروفایل‌های قهوه‌ای ساخته‌شده.',
      stat: data.counts.journeys + ' Session',
      detail: 'User Journey'
    },
    {
      href: '/admin/stories',
      kicker: 'STORYTELLING',
      title: 'Story Library',
      description: 'داستان‌های تاریخی، فرهنگی و پندآموز برای «داستان امروز» در قهوه و من.',
      stat: data.counts.stories + ' منتشرشده',
      detail: 'Daily Stories'
    },

    {
      href: '/admin/newsletter',
      kicker: 'AUDIENCE',
      title: 'خبرنامه',
      description: 'اعضای خبرنامه، منبع ورود و وضعیت عضویت کاربران.',
      stat: data.counts.newsletter + ' عضو',
      detail: 'Audience'
    },
    {
      href: '/admin/media',
      kicker: 'ASSETS',
      title: 'مدیا',
      description: 'کتابخانه تصاویر، ALT و Assetهای قابل استفاده در محتوا و صفحات سایت.',
      stat: data.counts.media + ' فایل',
      detail: 'Media Library'
    }
  ];
</script>

<svelte:head>
  <title>محتوا و رشد | EL.SEED Admin</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">CONTENT & GROWTH</span>
      <h1>محتوا و رشد</h1>
      <p>تمام ابزارهای مربوط به محتوا، سئو، رفتار مخاطب، خبرنامه و مدیا در یک ماژول.</p>
    </div>
    <a class="admin-primary-action" href="/admin/magazine/new">مقاله جدید +</a>
  </header>

  <section class="admin-module-grid">
    {#each modules as module}
      <a class="admin-module-card" href={module.href}>
        <div class="admin-module-card-top">
          <span>{module.kicker}</span>
          <i>←</i>
        </div>
        <h2>{module.title}</h2>
        <p>{module.description}</p>
        <div class="admin-module-card-meta">
          <strong>{module.stat}</strong>
          <small>{module.detail}</small>
        </div>
      </a>
    {/each}
  </section>
</div>
