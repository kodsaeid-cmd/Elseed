<script lang="ts">
  let { data } = $props();
</script>

<svelte:head><title>فروشگاه | EL.SEED Admin</title><meta name="robots" content="noindex,nofollow" /></svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">COMMERCE</span>
      <h1>فروشگاه</h1>
      <p>لایه فروشگاه از طریق Medusa به پنل مرکزی متصل می‌شود؛ داده Commerce را داخل D1 کپی نمی‌کنیم.</p>
    </div>
  </header>

  <section class="admin-connection-card">
    <div class:ok={data.reachable} class="admin-connection-light"></div>
    <div>
      <span>MEDUSA BACKEND</span>
      <h2>{data.reachable ? 'متصل و در دسترس' : data.configured ? 'تنظیم شده ولی پاسخ نمی‌دهد' : 'هنوز پیکربندی نشده'}</h2>
      <p>
        {#if data.configured}
          Backend: <code dir="ltr">{data.backendUrl}</code>
        {:else}
          برای اتصال واقعی، Secret/Environment Variable با نام <code>MEDUSA_BACKEND_URL</code> روی Cloudflare تنظیم می‌شود.
        {/if}
      </p>
    </div>
  </section>

  <section class="admin-module-roadmap">
    <article><span>01</span><strong>Products</strong><p>کاتالوگ، Variant، موجودی و قیمت از Medusa.</p></article>
    <article><span>02</span><strong>Orders</strong><p>سفارش‌ها و وضعیت Fulfillment از Medusa.</p></article>
    <article><span>03</span><strong>Cross-sell</strong><p>اتصال مقاله، Journey و محصول برای پیشنهاد مرتبط.</p></article>
  </section>
</div>
