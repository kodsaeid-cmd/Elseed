<script lang="ts">
  const nav = [
    { href: '/shop', label: 'فروشگاه' },
    { href: '/magazine', label: 'مجله' },
    { href: '/find', label: 'قهوهم را پیدا کن' },
    { href: '/fix', label: 'قهوهم را درست کن' }
  ];
</script>

<header class="site-header">
  <div class="header-inner shell">
    <a class="brand" href="/" aria-label="EL.SEED خانه">
      <span class="brand-word">EL.SEED</span>
      <span class="brand-cup" aria-hidden="true">☕</span>
    </a>

    <nav class="desktop-nav" aria-label="ناوبری اصلی">
      {#each nav as item}
        <a href={item.href}>{item.label}</a>
      {/each}
    </nav>

    <div class="header-actions" aria-label="ابزارهای سایت">
      <a class="icon-button" href="/search" aria-label="جستجو">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>
      </a>
      <a class="icon-button" href="/account" aria-label="حساب کاربری">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6"></path></svg>
      </a>
      <a class="icon-button" href="/cart" aria-label="سبد خرید">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l1.3 9h9.8l1.7-6H7.2"></path><circle cx="9.5" cy="18" r="1.2"></circle><circle cx="17" cy="18" r="1.2"></circle></svg>
      </a>
    </div>

    <details class="mobile-menu">
      <summary aria-label="باز کردن منو">منو</summary>
      <nav aria-label="منوی موبایل">
        {#each nav as item}
          <a href={item.href}>{item.label}</a>
        {/each}
        <a href="/coffee-and-me">قهوه و من</a>
      </nav>
    </details>
  </div>
</header>
