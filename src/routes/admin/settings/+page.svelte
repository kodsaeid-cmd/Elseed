<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head><title>تنظیمات | EL.SEED Admin</title><meta name="robots" content="noindex,nofollow" /></svelte:head>

<div class="admin-page">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">SITE SETTINGS</span>
      <h1>تنظیمات</h1>
      <p>تنظیمات مرکزی برند و Metadata پیش‌فرض سایت.</p>
    </div>
  </header>

  {#if form?.error}<div class="admin-alert admin-alert-error">{form.error}</div>{/if}
  {#if form?.success}<div class="admin-alert admin-alert-success">{form.message}</div>{/if}

  <form method="POST" class="admin-panel admin-settings-form">
    <div class="admin-fields">
      <label class="admin-field"><span>نام سایت</span><input name="siteTitle" value={data.settings.siteTitle} /></label>
      <label class="admin-field"><span>Tagline</span><input name="tagline" value={data.settings.tagline} dir="ltr" /></label>
      <label class="admin-field admin-field-wide"><span>Meta Description پیش‌فرض</span><textarea name="defaultMetaDescription" rows="4">{data.settings.defaultMetaDescription}</textarea></label>
      <label class="admin-field"><span>ایمیل پشتیبانی</span><input name="supportEmail" value={data.settings.supportEmail} dir="ltr" /></label>
      <label class="admin-field"><span>Instagram</span><input name="instagram" value={data.settings.instagram} dir="ltr" /></label>
      <label class="admin-field admin-field-wide"><span>Default OG Image</span><input name="defaultOgImage" value={data.settings.defaultOgImage} dir="ltr" /></label>
    </div>
    <button class="admin-save-button admin-settings-save" type="submit">ذخیره تنظیمات</button>
  </form>
</div>
