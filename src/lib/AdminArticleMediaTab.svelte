<script lang="ts">
  type Row = Record<string, any>;
  type SourceMode = 'upload' | 'library' | 'url';

  export let articleId = '';
  export let articleBody = '';
  export let onFeatured: (url: string, alt: string) => void = () => {};

  let assets: Row[] = [];
  let placements: Row[] = [];
  let files: File[] = [];
  let fileInput: HTMLInputElement | undefined;
  let selectedMediaId = '';
  let afterParagraph = 1;
  let placementAlt = '';
  let placementCaption = '';
  let sourceMode: SourceMode = 'upload';
  let externalUrl = '';
  let externalName = '';
  let externalType: 'image' | 'video' = 'image';
  let loading = false;
  let uploading = false;
  let saving = false;
  let error = '';
  let notice = '';
  let loadedFor = '';
  let directUploadEnabled = false;
  let storageProvider = 'Cloudflare R2';

  $: paragraphCount = String(articleBody || '')
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter((x) => x && !x.startsWith('##')).length;

  $: selectedAsset = assets.find((x) => x.id === selectedMediaId) || null;
  $: groupedPositions = [...new Set(placements.map((x) => Number(x.after_paragraph || 0)))].sort((a, b) => a - b);

  $: if (articleId && articleId !== loadedFor) {
    loadedFor = articleId;
    load();
  }

  async function request(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    if (response.status === 401) {
      window.location.href = '/admin/login';
      throw new Error('دسترسی مدیر الزامی است.');
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'خطا در ارتباط با سرور');
    return data;
  }

  async function load() {
    if (!articleId) return;
    loading = true;
    error = '';

    try {
      const data = await request('/admin/api/media?articleId=' + encodeURIComponent(articleId));
      assets = data.assets ?? [];
      placements = data.placements ?? [];
      directUploadEnabled = Boolean(data.directUploadEnabled);
      storageProvider = data.storage?.provider || 'Cloudflare R2';
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'رسانه‌های مقاله دریافت نشد.';
    } finally {
      loading = false;
    }
  }

  function chooseFiles(event: Event) {
    files = Array.from((event.currentTarget as HTMLInputElement).files ?? []);
  }

  function nextSortOrder(position = afterParagraph) {
    const used = placements
      .filter((x) => Number(x.after_paragraph) === Number(position))
      .map((x) => Number(x.sort_order || 0));
    return (used.length ? Math.max(...used) : 0) + 10;
  }

  function positionLabel(position: number) {
    return position === 0 ? 'قبل از شروع متن' : `بعد از پاراگراف ${position}`;
  }

  async function attachAsset(mediaId: string, position: number, sortOrder: number, alt = '', caption = '') {
    return request('/admin/api/media', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'attach_to_article',
        articleId,
        mediaId,
        afterParagraph: position,
        sortOrder,
        alt,
        caption
      })
    });
  }

  async function uploadMany() {
    if (!files.length || uploading || !articleId) return;
    if (!directUploadEnabled) {
      error = 'آپلود مستقیم هنوز فعال نیست؛ Cloudflare R2 باید روی حساب فعال شود.';
      return;
    }

    uploading = true;
    error = '';
    notice = '';
    let sortOrder = nextSortOrder();
    let done = 0;

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.set('file', file);
        fd.set('alt', placementAlt || file.name.replace(/\.[^.]+$/, ''));

        const uploaded = await request('/admin/api/media', {
          method: 'POST',
          body: fd
        });

        const asset = uploaded.asset;
        if (!asset?.id) throw new Error(`آپلود ${file.name} کامل نشد.`);

        await attachAsset(
          asset.id,
          afterParagraph,
          sortOrder,
          placementAlt || asset.alt_text || '',
          placementCaption
        );

        sortOrder += 10;
        done += 1;
      }

      files = [];
      placementAlt = '';
      placementCaption = '';
      if (fileInput) fileInput.value = '';
      await load();
      notice = `${done} رسانه به مقاله اضافه شد.`;
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'آپلود چندرسانه‌ای انجام نشد.';
      await load();
    } finally {
      uploading = false;
    }
  }


  async function addExternalAndAttach() {
    if (!externalUrl.trim() || saving) return;
    saving = true;
    error = '';
    notice = '';

    try {
      const created = await request('/admin/api/media', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'add_external_asset',
          url: externalUrl,
          name: externalName,
          mediaType: externalType,
          alt: placementAlt
        })
      });

      if (!created.asset?.id) throw new Error('رسانه خارجی ثبت نشد.');

      await attachAsset(
        created.asset.id,
        afterParagraph,
        nextSortOrder(),
        placementAlt,
        placementCaption
      );

      externalUrl = '';
      externalName = '';
      placementAlt = '';
      placementCaption = '';
      await load();
      notice = 'رسانه URLدار به کتابخانه و مقاله اضافه شد.';
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'رسانه URLدار اضافه نشد.';
    } finally {
      saving = false;
    }
  }

  async function attachFromLibrary() {
    if (!selectedMediaId || saving) return;
    saving = true;
    error = '';

    try {
      await attachAsset(
        selectedMediaId,
        afterParagraph,
        nextSortOrder(),
        placementAlt,
        placementCaption
      );
      selectedMediaId = '';
      placementAlt = '';
      placementCaption = '';
      await load();
      notice = 'رسانه از کتابخانه به مقاله اضافه شد.';
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'رسانه به مقاله اضافه نشد.';
    } finally {
      saving = false;
    }
  }

  async function savePlacement(item: Row) {
    if (saving) return;
    saving = true;
    error = '';

    try {
      const data = await request('/admin/api/article-media', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'update_placement',
          placementId: item.placement_id,
          afterParagraph: item.after_paragraph,
          sortOrder: item.sort_order,
          alt: item.placement_alt,
          caption: item.caption
        })
      });
      placements = data.placements ?? placements;
      notice = 'تنظیمات رسانه ذخیره شد.';
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'تنظیمات رسانه ذخیره نشد.';
    } finally {
      saving = false;
    }
  }

  async function removePlacement(item: Row) {
    if (!confirm('این رسانه از مقاله حذف شود؟ فایل اصلی در کتابخانه باقی می‌ماند.')) return;

    try {
      await request('/admin/api/media', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_from_article',
          placementId: item.placement_id
        })
      });
      placements = placements.filter((x) => x.placement_id !== item.placement_id);
      notice = 'رسانه از مقاله حذف شد.';
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'حذف رسانه انجام نشد.';
    }
  }

  async function setFeatured(item: Row) {
    if (item.media_type !== 'image' || saving) return;
    saving = true;
    error = '';

    try {
      const data = await request('/admin/api/media', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'set_featured_media',
          articleId,
          mediaId: item.id,
          alt: item.placement_alt || item.alt_text || ''
        })
      });
      onFeatured(data.url || item.url, data.alt || item.placement_alt || item.alt_text || '');
      notice = 'این تصویر به‌عنوان تصویر شاخص انتخاب شد.';
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'تصویر شاخص تغییر نکرد.';
    } finally {
      saving = false;
    }
  }
</script>

<section class="article-media-workspace" dir="rtl" aria-label="مدیریت رسانه‌های داخل مقاله">
  <header class="workspace-head">
    <div class="workspace-title">
      <span class="workspace-icon">▧</span>
      <div>
        <small>ARTICLE MEDIA</small>
        <h3>رسانه‌های داخل متن</h3>
        <p>چند تصویر یا ویدئو اضافه کن، جای نمایش هرکدام را مشخص کن و Alt و کپشن مستقل بده.</p>
      </div>
    </div>

    <div class="workspace-stats">
      <span><b>{placements.length}</b> رسانه</span>
      <span><b>{paragraphCount}</b> پاراگراف</span>
    </div>
  </header>

  {#if !directUploadEnabled && !loading}
    <div class="storage-warning">
      <div>
        <strong>آپلود مستقیم هنوز به {storageProvider} متصل نشده</strong>
        <p>انتخاب از کتابخانه و رسانه‌های URLدار کار می‌کنند؛ برای آپلود فایل واقعی باید R2 روی حساب Cloudflare فعال شود.</p>
      </div>
      <span>STORAGE OFF</span>
    </div>
  {/if}

  {#if notice}
    <div class="message notice">
      {notice}
      <button type="button" on:click={() => (notice = '')}>×</button>
    </div>
  {/if}

  {#if error}
    <div class="message error">
      {error}
      <button type="button" on:click={() => (error = '')}>×</button>
    </div>
  {/if}

  {#if loading}
    <div class="empty-state">در حال دریافت رسانه‌های مقاله…</div>
  {:else}
    <section class="add-workspace">
      <div class="add-topline">
        <div>
          <strong>افزودن رسانه</strong>
          <span>آپلود مستقیم یا انتخاب از کتابخانه</span>
        </div>

        <div class="source-switch" role="tablist" aria-label="منبع رسانه">
          <button
            class:active={sourceMode === 'upload'}
            type="button"
            on:click={() => (sourceMode = 'upload')}
          >↑ آپلود فایل</button>
          <button
            class:active={sourceMode === 'library'}
            type="button"
            on:click={() => (sourceMode = 'library')}
          >▦ کتابخانه</button>
          <button
            class:active={sourceMode === 'url'}
            type="button"
            on:click={() => (sourceMode = 'url')}
          >↗ URL</button>
        </div>
      </div>

      <div class="add-grid">
        <div class="source-surface">
          {#if sourceMode === 'upload'}
            <label class:disabled={!directUploadEnabled} class="dropzone">
              <input
                bind:this={fileInput}
                type="file"
                multiple
                disabled={!directUploadEnabled}
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm"
                on:change={chooseFiles}
              />
              <span class="drop-icon">＋</span>
              <strong>
                {files.length
                  ? `${files.length} فایل آماده افزودن`
                  : directUploadEnabled
                    ? 'تصویر یا ویدئو را انتخاب کن'
                    : 'فضای آپلود هنوز فعال نشده'}
              </strong>
              <small>انتخاب هم‌زمان چند فایل · تصویر تا ۱۰MB · ویدئو تا ۵۰MB</small>
            </label>

            {#if files.length}
              <div class="file-chips">
                {#each files as file}
                  <span>{file.type.startsWith('video/') ? '▶' : '▧'} {file.name}</span>
                {/each}
              </div>
            {/if}
          {:else if sourceMode === 'library'}
            <div class="library-picker">
              <label>
                انتخاب از کتابخانه
                <select bind:value={selectedMediaId}>
                  <option value="">یک رسانه را انتخاب کن</option>
                  {#each assets as asset}
                    <option value={asset.id}>
                      {asset.media_type === 'video' ? '▶' : '▧'} {asset.name}
                    </option>
                  {/each}
                </select>
              </label>

              {#if selectedAsset}
                <div class="library-preview">
                  {#if selectedAsset.media_type === 'image'}
                    <img src={selectedAsset.url} alt={selectedAsset.alt_text || ''} />
                  {:else}
                    <video src={selectedAsset.url} controls preload="metadata"></video>
                  {/if}
                  <span>{selectedAsset.name}</span>
                </div>
              {:else}
                <div class="library-empty">رسانه انتخاب‌شده اینجا پیش‌نمایش داده می‌شود.</div>
              {/if}
            </div>
          {:else}
            <div class="external-picker">
              <div class="external-type-switch">
                <button class:active={externalType === 'image'} type="button" on:click={() => (externalType = 'image')}>▧ تصویر</button>
                <button class:active={externalType === 'video'} type="button" on:click={() => (externalType = 'video')}>▶ ویدئو</button>
              </div>
              <label>
                URL امن رسانه
                <input bind:value={externalUrl} dir="ltr" placeholder="https://..." />
              </label>
              <label>
                نام رسانه
                <input bind:value={externalName} placeholder="اختیاری" />
              </label>
              {#if externalUrl}
                <div class="library-preview">
                  {#if externalType === 'image'}
                    <img src={externalUrl} alt={placementAlt || externalName || ''} />
                  {:else}
                    <video src={externalUrl} controls preload="metadata"></video>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <aside class="attach-panel">
          <label class="position-select">
            محل نمایش
            <select bind:value={afterParagraph}>
              <option value={0}>قبل از شروع متن</option>
              {#each Array(Math.max(paragraphCount, 1)) as _, i}
                <option value={i + 1}>بعد از پاراگراف {i + 1}</option>
              {/each}
            </select>
          </label>

          <details class="optional-details">
            <summary>
              <span>متن جایگزین و کپشن</span>
              <small>اختیاری</small>
            </summary>
            <label>
              Alt
              <input bind:value={placementAlt} maxlength="500" placeholder="توضیح طبیعی و دقیق رسانه" />
            </label>
            <label>
              کپشن
              <textarea bind:value={placementCaption} maxlength="500" placeholder="متن کوتاه زیر رسانه"></textarea>
            </label>
          </details>

          {#if sourceMode === 'upload'}
            <button
              class="attach-primary"
              type="button"
              disabled={!files.length || uploading || !directUploadEnabled}
              on:click={uploadMany}
            >{uploading ? 'در حال آپلود…' : 'آپلود و افزودن به مقاله'}</button>
          {:else if sourceMode === 'library'}
            <button
              class="attach-primary"
              type="button"
              disabled={!selectedMediaId || saving}
              on:click={attachFromLibrary}
            >{saving ? 'در حال افزودن…' : 'افزودن از کتابخانه'}</button>
          {:else}
            <button
              class="attach-primary"
              type="button"
              disabled={!externalUrl.trim() || saving}
              on:click={addExternalAndAttach}
            >{saving ? 'در حال افزودن…' : 'ثبت URL و افزودن به مقاله'}</button>
          {/if}
        </aside>
      </div>
    </section>

    <section class="placement-workspace">
      <div class="placement-heading">
        <div>
          <strong>چیدمان مقاله</strong>
          <span>رسانه‌ها بر اساس محل نمایش گروه‌بندی شده‌اند.</span>
        </div>
        {#if placements.length}<b>{placements.length} مورد متصل</b>{/if}
      </div>

      {#if !placements.length}
        <div class="empty-state visual-empty">
          <span>◇</span>
          <strong>هنوز رسانه‌ای داخل متن نیست</strong>
          <p>اولین تصویر یا ویدئو را اضافه کن؛ هر رسانه می‌تواند جایگاه، Alt و کپشن مستقل داشته باشد.</p>
        </div>
      {:else}
        <div class="timeline">
          {#each groupedPositions as position}
            <section class="timeline-slot">
              <div class="slot-label">
                <span></span>
                <div>
                  <strong>{positionLabel(position)}</strong>
                  <small>{placements.filter((x) => Number(x.after_paragraph || 0) === position).length} رسانه</small>
                </div>
              </div>

              <div class="slot-grid">
                {#each placements.filter((x) => Number(x.after_paragraph || 0) === position) as item}
                  <article class="media-card">
                    <div class="card-preview">
                      {#if item.media_type === 'image'}
                        <img src={item.url} alt={item.placement_alt || item.alt_text || ''} loading="lazy" />
                      {:else}
                        <video src={item.url} controls preload="metadata"></video>
                      {/if}
                      <span class="type-pill">{item.media_type === 'video' ? 'ویدئو' : 'تصویر'}</span>
                    </div>

                    <div class="card-main">
                      <div class="card-title">
                        <strong>{item.name}</strong>
                        <small>{positionLabel(Number(item.after_paragraph || 0))}</small>
                      </div>

                      {#if item.caption}
                        <p class="caption-preview">{item.caption}</p>
                      {:else}
                        <p class="caption-preview muted">بدون کپشن</p>
                      {/if}

                      <div class="quick-actions">
                        {#if item.media_type === 'image'}
                          <button type="button" disabled={saving} on:click={() => setFeatured(item)}>★ تصویر شاخص</button>
                        {/if}
                        <button class="remove" type="button" on:click={() => removePlacement(item)}>حذف از مقاله</button>
                      </div>

                      <details class="media-settings">
                        <summary>
                          <span>ویرایش جایگاه و توضیحات</span>
                          <b>⌄</b>
                        </summary>

                        <div class="settings-grid">
                          <label>
                            محل نمایش
                            <select bind:value={item.after_paragraph}>
                              <option value={0}>قبل از شروع متن</option>
                              {#each Array(Math.max(paragraphCount, Number(item.after_paragraph || 1))) as _, i}
                                <option value={i + 1}>بعد از پاراگراف {i + 1}</option>
                              {/each}
                            </select>
                          </label>

                          <label>
                            ترتیب
                            <input type="number" min="0" bind:value={item.sort_order} />
                          </label>
                        </div>

                        <label>
                          Alt
                          <input
                            bind:value={item.placement_alt}
                            maxlength="500"
                            placeholder={item.alt_text || 'توضیح رسانه'}
                          />
                        </label>

                        <label>
                          کپشن
                          <textarea
                            bind:value={item.caption}
                            maxlength="500"
                            placeholder="در صورت نیاز توضیح کوتاه زیر رسانه"
                          ></textarea>
                        </label>

                        <button
                          class="save-settings"
                          type="button"
                          disabled={saving}
                          on:click={() => savePlacement(item)}
                        >{saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}</button>
                      </details>
                    </div>
                  </article>
                {/each}
              </div>
            </section>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</section>

<style>
  .article-media-workspace{padding:18px 0 2px;color:#234f49}
  .workspace-head{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:14px}
  .workspace-title{display:flex;align-items:center;gap:11px}.workspace-icon{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#e6f3ef;color:#22665d;font-size:1.05rem}
  .workspace-title small{display:block;color:#6a918a;font-size:.48rem;font-weight:900;letter-spacing:.12em}.workspace-title h3{margin:2px 0;font-size:.9rem}.workspace-title p{margin:0;color:#7a8c88;font-size:.61rem}
  .workspace-stats{display:flex;gap:7px}.workspace-stats span{display:flex;align-items:center;gap:4px;padding:7px 9px;border-radius:10px;background:#f1f7f5;color:#5c7772;font-size:.56rem}.workspace-stats b{color:#23675e;font-size:.7rem}
  .storage-warning{margin-bottom:12px;padding:11px 13px;border:1px solid #efddbd;border-radius:12px;background:#fff8ea;color:#795c2f;display:flex;align-items:center;justify-content:space-between;gap:12px}.storage-warning strong{font-size:.65rem}.storage-warning p{margin:3px 0 0;font-size:.55rem;line-height:1.7}.storage-warning>span{white-space:nowrap;border-radius:999px;background:#f6e7c8;padding:5px 8px;font-size:.48rem;font-weight:900}
  .message{padding:9px 11px;border-radius:11px;margin-bottom:12px;display:flex;justify-content:space-between;font-size:.65rem}.message button{border:0;background:transparent;cursor:pointer}.notice{background:#e9f7f1;color:#246b5f}.error{background:#fff0ec;color:#9f4d40}
  .add-workspace{border:1px solid rgba(38,102,93,.09);border-radius:19px;background:#fff;box-shadow:0 10px 28px rgba(43,82,76,.045);overflow:hidden}.add-topline{padding:12px 14px;border-bottom:1px solid rgba(39,99,91,.07);display:flex;align-items:center;justify-content:space-between;gap:12px}.add-topline>div:first-child strong,.add-topline>div:first-child span{display:block}.add-topline>div:first-child strong{font-size:.72rem}.add-topline>div:first-child span{margin-top:2px;font-size:.53rem;color:#8a9a96}
  .source-switch{display:flex;gap:4px;padding:3px;background:#f2f6f4;border-radius:10px}.source-switch button{border:0;background:transparent;border-radius:8px;padding:6px 10px;color:#70847f;font:inherit;font-size:.57rem;cursor:pointer}.source-switch button.active{background:#fff;color:#25675e;font-weight:900;box-shadow:0 3px 10px rgba(41,81,75,.08)}
  .add-grid{display:grid;grid-template-columns:minmax(0,1.55fr) 310px}.source-surface{padding:14px;border-left:1px solid rgba(39,99,91,.07)}
  .dropzone{min-height:122px;border:1.5px dashed rgba(37,111,100,.22);border-radius:14px;background:#f9fcfb;display:grid;place-items:center;text-align:center;padding:14px;cursor:pointer;transition:.18s ease}.dropzone:hover{border-color:rgba(29,112,100,.42);background:#f4faf7}.dropzone.disabled{opacity:.55;cursor:not-allowed}.dropzone input{display:none}.drop-icon{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:#e6f3ef;color:#2d7168;font-size:1rem}.dropzone strong{font-size:.69rem;margin-top:6px}.dropzone small{font-size:.53rem;color:#91a09d;margin-top:2px}
  .file-chips{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.file-chips span{max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:5px 7px;border-radius:8px;background:#eef6f3;color:#52766f;font-size:.52rem}
  .library-picker>label,.external-picker>label,.attach-panel label,.media-settings label{display:grid;gap:4px;color:#607873;font-size:.59rem}.library-picker select,.external-picker input,.attach-panel input,.attach-panel select,.attach-panel textarea,.media-settings input,.media-settings select,.media-settings textarea{width:100%;box-sizing:border-box;border:1px solid rgba(43,102,94,.12);background:#fff;border-radius:10px;padding:8px 9px;color:#2d5751;font:inherit;outline:none}
  .external-picker{display:grid;gap:9px}.external-type-switch{display:flex;gap:5px}.external-type-switch button{flex:1;border:1px solid rgba(43,102,94,.11);background:#f5f9f7;color:#607873;border-radius:9px;padding:7px;font:inherit;font-size:.56rem;cursor:pointer}.external-type-switch button.active{background:#e4f2ee;color:#256e64;font-weight:900}.library-preview{margin-top:9px;height:150px;border-radius:12px;background:#eef3f1;overflow:hidden;position:relative}.library-preview img,.library-preview video{width:100%;height:100%;object-fit:contain;display:block}.library-preview span{position:absolute;right:7px;bottom:7px;max-width:80%;padding:4px 7px;border-radius:7px;background:rgba(255,255,255,.92);color:#526f69;font-size:.5rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.library-empty{min-height:110px;margin-top:9px;border:1px dashed rgba(42,101,92,.12);border-radius:12px;display:grid;place-items:center;text-align:center;color:#95a19f;font-size:.55rem}
  .attach-panel{padding:14px;background:#fafcfb;display:flex;flex-direction:column;gap:10px}.optional-details{border:1px solid rgba(42,101,92,.09);border-radius:11px;background:#fff;overflow:hidden}.optional-details summary{list-style:none;cursor:pointer;padding:9px 10px;display:flex;justify-content:space-between;gap:10px;color:#56746e;font-size:.58rem}.optional-details summary::-webkit-details-marker{display:none}.optional-details summary small{color:#97a29f}.optional-details[open] summary{border-bottom:1px solid rgba(42,101,92,.07)}.optional-details label{margin:9px 10px}.optional-details textarea{min-height:58px;resize:vertical}
  .attach-primary{margin-top:auto;border:0;border-radius:11px;background:#176d67;color:#fff;padding:10px 12px;font:inherit;font-size:.62rem;font-weight:900;cursor:pointer;box-shadow:0 7px 18px rgba(23,109,103,.14)}.attach-primary:disabled{opacity:.45;cursor:not-allowed}
  .placement-workspace{margin-top:14px;border:1px solid rgba(38,102,93,.09);border-radius:19px;background:#f8fbfa;padding:14px}.placement-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.placement-heading strong,.placement-heading span{display:block}.placement-heading strong{font-size:.74rem}.placement-heading span{font-size:.54rem;color:#8a9996;margin-top:2px}.placement-heading>b{padding:5px 8px;border-radius:8px;background:#e6f3ef;color:#347168;font-size:.52rem}
  .timeline{display:grid;gap:12px}.timeline-slot{display:grid;grid-template-columns:145px minmax(0,1fr);gap:12px;align-items:start}.slot-label{display:flex;gap:8px;align-items:flex-start;padding-top:5px}.slot-label>span{width:9px;height:9px;border-radius:999px;background:#2d786d;box-shadow:0 0 0 5px #e2f1ec;margin-top:4px}.slot-label strong,.slot-label small{display:block}.slot-label strong{font-size:.59rem;color:#456a64}.slot-label small{font-size:.48rem;color:#95a19e;margin-top:2px}
  .slot-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.media-card{background:#fff;border:1px solid rgba(39,100,91,.09);border-radius:14px;overflow:hidden;min-width:0;box-shadow:0 5px 16px rgba(43,82,76,.035)}.card-preview{height:150px;background:#edf3f1;position:relative}.card-preview img,.card-preview video{width:100%;height:100%;object-fit:cover;display:block}.type-pill{position:absolute;top:7px;right:7px;padding:4px 7px;border-radius:999px;background:rgba(255,255,255,.92);color:#316e66;font-size:.49rem;font-weight:900}
  .card-main{padding:10px}.card-title{display:flex;justify-content:space-between;gap:8px;align-items:center}.card-title strong{min-width:0;font-size:.61rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card-title small{font-size:.48rem;color:#8c9996;white-space:nowrap}.caption-preview{height:32px;margin:6px 0;color:#6f817e;font-size:.53rem;line-height:1.6;overflow:hidden}.caption-preview.muted{color:#a0aaa8}
  .quick-actions{display:flex;gap:5px;margin-top:7px}.quick-actions button{border:1px solid rgba(42,102,93,.11);background:#fff;color:#376f67;border-radius:8px;padding:5px 7px;font:inherit;font-size:.51rem;cursor:pointer}.quick-actions .remove{margin-right:auto;color:#a25548}.media-settings{margin-top:8px;border-top:1px solid rgba(42,101,92,.07);padding-top:7px}.media-settings summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:#58766f;font-size:.53rem}.media-settings summary::-webkit-details-marker{display:none}.media-settings summary b{font-size:.72rem;color:#82938f}.media-settings[open] summary{margin-bottom:8px}
  .settings-grid{display:grid;grid-template-columns:1fr 90px;gap:7px}.media-settings label{margin:7px 0}.media-settings textarea{min-height:58px;resize:vertical}.save-settings{width:100%;border:0;border-radius:9px;background:#e5f3ee;color:#27685f;padding:8px;font:inherit;font-size:.55rem;font-weight:900;cursor:pointer}.save-settings:disabled,.quick-actions button:disabled{opacity:.5;cursor:not-allowed}
  .empty-state{padding:38px;text-align:center;color:#889a96;font-size:.64rem}.visual-empty{border:1px dashed rgba(42,101,92,.14);border-radius:14px;background:#fff}.visual-empty>span{display:block;font-size:1.5rem;color:#8eb0a9}.visual-empty strong{display:block;margin-top:4px;font-size:.68rem;color:#4d7069}.visual-empty p{max-width:500px;margin:4px auto 0;color:#8c9a97;font-size:.55rem;line-height:1.8}
  @media(max-width:980px){.add-grid{grid-template-columns:1fr}.source-surface{border-left:0;border-bottom:1px solid rgba(39,99,91,.07)}.timeline-slot{grid-template-columns:1fr}.slot-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.slot-label{padding-top:0}}
  @media(max-width:680px){.article-media-workspace{padding:14px 0}.workspace-head{align-items:flex-start;flex-direction:column}.workspace-stats{width:100%}.workspace-stats span{flex:1;justify-content:center}.storage-warning{align-items:flex-start;flex-direction:column}.add-topline{align-items:flex-start;flex-direction:column}.source-switch{width:100%}.source-switch button{flex:1}.slot-grid{grid-template-columns:1fr}.card-preview{height:190px}.settings-grid{grid-template-columns:1fr}.placement-workspace{padding:10px}}
</style>
