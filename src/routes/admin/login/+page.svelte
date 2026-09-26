<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>ورود ادمین | EL.SEED</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main class="admin-login-page">
  <section class="admin-login-card">
    <div class="admin-login-mark">
      <strong>EL.SEED</strong>
      <span>CONTROL ROOM</span>
    </div>

    <div>
      <span class="admin-kicker">PRIVATE ADMIN</span>
      <h1>پنل مدیریت EL.SEED</h1>
      <p>مجله، SEO، Journeyها، خبرنامه، مدیا، فروشگاه و تنظیمات سایت از یک جا.</p>
    </div>

    {#if !data.configured}
      <div class="admin-alert admin-alert-error">
        Secret <code>ADMIN_PASSWORD</code> در Runtime فعلی Production دیده نمی‌شود. اگر همین الان آن را ساخته‌ای،
        این Deploy باید دوباره اجرا شود؛ اگر بعد از Deploy همچنان این پیام ماند، Secret در Environment یا Project دیگری ثبت شده است.
      </div>
    {/if}

    {#if form?.error}
      <div class="admin-alert admin-alert-error">{form.error}</div>
    {/if}

    <form method="POST" class="admin-login-form">
      <label>
        <span>رمز ادمین</span>
        <input name="password" type="password" autocomplete="current-password" required />
      </label>
      <button type="submit">ورود به پنل</button>
    </form>

    <a class="admin-backsite" href="/">← بازگشت به سایت</a>
  </section>
</main>
