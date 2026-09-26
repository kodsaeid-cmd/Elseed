<script lang="ts">
  let { data } = $props();
</script>

<svelte:head><title>Journeyها | EL.SEED Admin</title><meta name="robots" content="noindex,nofollow" /></svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">USER JOURNEYS</span>
      <h1>Journeyها</h1>
      <p>داده واقعی مسیرهای Find / Fix / Me و پروفایل‌هایی که کاربران ساخته‌اند.</p>
    </div>
  </header>

  {#if !data.connected}
    <div class="admin-alert admin-alert-error">D1 Database در محیط فعلی در دسترس نیست.</div>
  {/if}

  <section class="admin-mini-stats">
    {#each data.summary as item}
      <div><span>{item.journey_type} · {item.status}</span><strong>{item.count}</strong></div>
    {/each}
  </section>

  <section class="admin-panel">
    <div class="admin-panel-head"><div><span>LIVE DATA</span><h2>آخرین Sessionها</h2></div></div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>Journey</th><th>Status</th><th>Anonymous ID</th><th>شروع</th><th>پایان</th></tr></thead>
        <tbody>
          {#each data.recent as item}
            <tr>
              <td><strong>{item.journey_type}</strong></td>
              <td><span class="admin-status admin-status-{item.status === 'completed' ? 'published' : 'draft'}">{item.status}</span></td>
              <td><small dir="ltr">{item.anonymous_id || '—'}</small></td>
              <td><small dir="ltr">{item.started_at}</small></td>
              <td><small dir="ltr">{item.completed_at || '—'}</small></td>
            </tr>
          {:else}
            <tr><td colspan="5" class="admin-empty">هنوز Session ثبت‌شده‌ای نداریم.</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="admin-panel">
    <div class="admin-panel-head"><div><span>COFFEE PROFILE</span><h2>آخرین پروفایل‌ها</h2></div></div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>Line</th><th>Time</th><th>Effect</th><th>Taste</th><th>Brew</th><th>آخرین تغییر</th></tr></thead>
        <tbody>
          {#each data.profiles as item}
            <tr>
              <td><strong>{item.profile.line || '—'}</strong></td>
              <td>{item.profile.time || '—'}</td>
              <td>{item.profile.effect || '—'}</td>
              <td>{item.profile.taste || '—'}</td>
              <td>{item.profile.brew || '—'}</td>
              <td><small dir="ltr">{item.updated_at}</small></td>
            </tr>
          {:else}
            <tr><td colspan="6" class="admin-empty">هنوز پروفایلی ثبت نشده است.</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
