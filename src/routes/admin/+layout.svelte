<script lang="ts">
  let { data, children } = $props();

  const nav = [
    { href: '/admin', label: 'داشبورد', icon: '⌂' },
    { href: '/admin/content', label: 'محتوا و رشد', icon: '◫' },
    { href: '/admin/shop', label: 'فروشگاه', icon: '▣' },
    { href: '/admin/settings', label: 'تنظیمات', icon: '⚙' }
  ];
</script>

{#if data.adminAuthenticated && !data.isLoginPage}
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <a class="admin-brand" href="/admin">
        <strong>EL.SEED</strong>
        <span>ADMIN</span>
      </a>

      <nav aria-label="پنل ادمین">
        {#each nav as item}
          <a href={item.href}>
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="admin-sidebar-footer">
        <a href="/" target="_blank" rel="noreferrer">مشاهده سایت ↗</a>
        <a href="/admin/logout">خروج</a>
      </div>
    </aside>

    <div class="admin-main">
      {@render children()}
    </div>
  </div>
{:else}
  {@render children()}
{/if}
