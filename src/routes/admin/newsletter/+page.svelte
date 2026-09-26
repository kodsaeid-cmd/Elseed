<script lang="ts">
  let { data } = $props();
  const active = $derived(data.subscribers.filter((item: any) => item.status === 'subscribed').length);
</script>

<svelte:head><title>خبرنامه | EL.SEED Admin</title><meta name="robots" content="noindex,nofollow" /></svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">AUDIENCE</span>
      <h1>خبرنامه</h1>
      <p>عضویت‌های واقعی ثبت‌شده از سایت و منبع ورود هر عضو.</p>
    </div>
  </header>

  <section class="admin-stats admin-stats-four">
    <div><span>کل رکوردها</span><strong>{data.subscribers.length}</strong></div>
    <div><span>عضو فعال</span><strong>{active}</strong></div>
  </section>

  <section class="admin-panel">
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>Email</th><th>Status</th><th>Source</th><th>تاریخ عضویت</th><th>آخرین تغییر</th></tr></thead>
        <tbody>
          {#each data.subscribers as item}
            <tr>
              <td><strong dir="ltr">{item.email}</strong></td>
              <td><span class="admin-status admin-status-{item.status === 'subscribed' ? 'published' : 'archived'}">{item.status}</span></td>
              <td>{item.source}</td>
              <td><small dir="ltr">{item.consented_at}</small></td>
              <td><small dir="ltr">{item.updated_at}</small></td>
            </tr>
          {:else}
            <tr><td colspan="5" class="admin-empty">هنوز عضوی ثبت نشده است.</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
