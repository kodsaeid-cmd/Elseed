<script lang="ts">
  let { data, form } = $props();

  const story = $derived(data.selected ?? {
    id: '',
    slug: '',
    title: '',
    kicker: 'داستان امروز',
    excerpt: '',
    story_text: '',
    lesson: '',
    story_type: 'literary',
    era: '',
    place: '',
    image_url: '',
    source_label: '',
    source_url: '',
    is_factual: 0,
    status: 'draft',
    featured: 0
  });

  const typeLabels: Record<string, string> = {
    historical: 'تاریخی',
    cultural: 'فرهنگی',
    origin: 'ریشه قهوه',
    people: 'آدم‌ها',
    invention: 'اختراع',
    literary: 'حکایت ادبی'
  };
</script>

<svelte:head>
  <title>Story Library | EL.SEED Admin</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="admin-page story-admin">
  <header class="admin-page-head">
    <div>
      <span class="admin-kicker">COFFEE & ME · STORY LIBRARY</span>
      <h1>داستان‌های قهوه</h1>
      <p>بانک داستان‌های تاریخی، فرهنگی و پندآموز برای «داستان امروز» کاربران. معماری برای هزاران Story آماده است.</p>
    </div>
    <a class="admin-primary-action" href="/admin/stories">داستان جدید +</a>
  </header>

  {#if !data.connected}
    <div class="admin-alert admin-alert-error">D1 Database در محیط فعلی در دسترس نیست.</div>
  {/if}

  {#if form?.error}
    <div class="admin-alert admin-alert-error">{form.error}</div>
  {/if}

  <section class="story-layout">
    <aside class="story-list">
      <header>
        <div>
          <span>LIBRARY</span>
          <h2>{data.stories.length} داستان</h2>
        </div>
        <div class="story-counts">
          <b>{data.stories.filter((item: any) => item.status === 'published').length}</b>
          <small>منتشرشده</small>
        </div>
      </header>

      <div class="story-list-items">
        {#each data.stories as item}
          <a
            href={'/admin/stories?edit=' + item.id}
            class:active={story.id === item.id}
            class="story-list-item"
          >
            <div class="story-thumb">
              {#if item.image_url}
                <img src={item.image_url} alt="" />
              {:else}
                <span>ST</span>
              {/if}
            </div>
            <div>
              <span>{typeLabels[item.story_type] ?? item.story_type}</span>
              <strong>{item.title}</strong>
              <small>{item.status} · {item.era || 'بدون دوره'}</small>
            </div>
          </a>
        {:else}
          <div class="story-empty">هنوز Story ثبت نشده.</div>
        {/each}
      </div>
    </aside>

    <form method="POST" action="?/save" class="story-editor">
      <input type="hidden" name="id" value={story.id} />

      <header class="story-editor-head">
        <div>
          <span>{story.id ? 'EDIT STORY' : 'NEW STORY'}</span>
          <h2>{story.id ? story.title : 'داستان تازه'}</h2>
          <p>داستان‌های factual باید منبع داشته باشند؛ حکایت ادبی را به‌عنوان واقعیت تاریخی معرفی نکن.</p>
        </div>

        <div class="story-editor-actions">
          <select name="status" value={story.status}>
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشرشده</option>
            <option value="archived">آرشیو</option>
          </select>
          <button class="admin-primary-action" type="submit">ذخیره</button>
        </div>
      </header>

      <div class="story-fields">
        <section class="story-card story-main-fields">
          <div class="field-row two">
            <label>
              عنوان داستان
              <input name="title" value={story.title} maxlength="240" required />
            </label>
            <label>
              Slug
              <input name="slug" value={story.slug} maxlength="180" dir="ltr" placeholder="coffee-story-slug" required />
            </label>
          </div>

          <div class="field-row two">
            <label>
              Kicker
              <input name="kicker" value={story.kicker} maxlength="160" />
            </label>
            <label>
              نوع داستان
              <select name="story_type" value={story.story_type}>
                <option value="historical">تاریخی</option>
                <option value="cultural">فرهنگی</option>
                <option value="origin">ریشه قهوه</option>
                <option value="people">آدم‌ها</option>
                <option value="invention">اختراع</option>
                <option value="literary">حکایت ادبی</option>
              </select>
            </label>
          </div>

          <label>
            مقدمه کوتاه
            <textarea name="excerpt" rows="3" maxlength="1200">{story.excerpt}</textarea>
          </label>

          <label>
            متن داستان
            <textarea name="story_text" rows="12" maxlength="12000" required>{story.story_text}</textarea>
          </label>

          <label>
            پند / چیزی که با خودت ببر
            <textarea name="lesson" rows="4" maxlength="2000">{story.lesson}</textarea>
          </label>
        </section>

        <aside class="story-side">
          <section class="story-card">
            <h3>زمینه داستان</h3>
            <label>
              دوره / سال
              <input name="era" value={story.era} maxlength="160" placeholder="مثلاً ۱۹۰۸" />
            </label>
            <label>
              مکان
              <input name="place" value={story.place} maxlength="160" />
            </label>
            <label>
              تصویر
              <input name="image_url" value={story.image_url} maxlength="1000" dir="ltr" placeholder="/media/..." />
            </label>
            {#if story.image_url}
              <img class="story-preview" src={story.image_url} alt="" />
            {/if}
          </section>

          <section class="story-card">
            <h3>اعتبار روایت</h3>
            <label class="check-line">
              <input type="checkbox" name="is_factual" checked={Boolean(story.is_factual)} />
              <span><strong>روایت factual / تاریخی</strong><small>در UI با برچسب «روایت تاریخی» نمایش داده می‌شود.</small></span>
            </label>
            <label>
              نام منبع
              <input name="source_label" value={story.source_label} maxlength="300" />
            </label>
            <label>
              URL منبع
              <input name="source_url" value={story.source_url} maxlength="1200" dir="ltr" />
            </label>
            <label class="check-line">
              <input type="checkbox" name="featured" checked={Boolean(story.featured)} />
              <span><strong>Featured</strong><small>شانس نمایش در چرخه روزانه بالاتر می‌رود.</small></span>
            </label>
          </section>

          {#if story.id}
            <section class="story-card danger-card">
              <h3>عملیات</h3>
              <div class="status-actions">
                {#if story.status !== 'published'}
                  <button type="submit" formaction="?/toggle" name="next" value="published">انتشار</button>
                {:else}
                  <button type="submit" formaction="?/toggle" name="next" value="draft">برگشت به پیش‌نویس</button>
                {/if}
              </div>
              <button class="delete-button" type="submit" formaction="?/delete" onclick={(event) => {
                if (!confirm('این داستان حذف شود؟')) event.preventDefault();
              }}>حذف داستان</button>
            </section>
          {/if}
        </aside>
      </div>
    </form>
  </section>
</div>

<style>
  .story-admin{font-family:'Vazirmatn',Tahoma,sans-serif}.story-layout{display:grid;grid-template-columns:320px minmax(0,1fr);gap:14px}.story-list,.story-editor{border:1px solid rgba(62,39,32,.1);border-radius:22px;background:rgba(255,255,255,.62);overflow:hidden}.story-list{align-self:start;position:sticky;top:20px}.story-list>header{padding:16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(62,39,32,.08)}.story-list>header span,.story-editor-head span{direction:ltr;color:#9a755a;font-size:.53rem;font-weight:900;letter-spacing:.14em}.story-list h2,.story-editor-head h2{margin:3px 0 0;font-size:1.05rem}.story-counts{display:grid;text-align:center}.story-counts b{font-size:1.2rem}.story-counts small{font-size:.5rem;color:#8a7a73}.story-list-items{max-height:72vh;overflow:auto;padding:7px}.story-list-item{display:grid;grid-template-columns:54px minmax(0,1fr);gap:10px;padding:9px;border-radius:13px;color:inherit;text-decoration:none}.story-list-item:hover,.story-list-item.active{background:#f1e5d8}.story-thumb{width:54px;height:54px;border-radius:12px;overflow:hidden;background:#ead8c5;display:grid;place-items:center;color:#96663e;font-size:.6rem;font-weight:900}.story-thumb img{width:100%;height:100%;object-fit:cover}.story-list-item>div:last-child{min-width:0;display:grid;align-content:center}.story-list-item span{font-size:.48rem;color:#b07444}.story-list-item strong{font-size:.66rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.story-list-item small{font-size:.48rem;color:#948179}.story-empty{padding:30px;text-align:center;color:#927e75;font-size:.6rem}

  .story-editor-head{padding:17px 19px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:1px solid rgba(62,39,32,.08);background:#fffaf5}.story-editor-head p{margin:4px 0 0;color:#8c7a72;font-size:.56rem}.story-editor-actions{display:flex;gap:7px}.story-editor-actions select{min-width:110px}.story-editor-actions .admin-primary-action{border:0;cursor:pointer}
  .story-fields{display:grid;grid-template-columns:minmax(0,1.45fr) 320px;gap:12px;padding:12px;background:#f8f2ea}.story-card{padding:16px;border:1px solid rgba(62,39,32,.08);border-radius:17px;background:#fff}.story-main-fields{display:grid;gap:12px}.story-side{display:grid;gap:10px;align-content:start}.story-card h3{margin:0 0 12px;font-size:.78rem}.field-row.two{display:grid;grid-template-columns:1fr 1fr;gap:9px}.story-card label{display:grid;gap:5px;margin-bottom:10px;color:#6d554b;font-size:.59rem;font-weight:800}.story-card input,.story-card textarea,.story-card select,.story-editor-actions select{width:100%;box-sizing:border-box;border:1px solid rgba(62,39,32,.12);border-radius:10px;background:#fdfaf6;padding:9px 10px;color:#42261d;font:inherit;font-size:.65rem;outline:none}.story-card textarea{resize:vertical;line-height:1.9}.story-preview{width:100%;height:150px;object-fit:cover;border-radius:12px;margin-top:3px}.check-line{display:flex!important;align-items:flex-start;gap:8px!important}.check-line input{width:auto!important;margin-top:3px}.check-line span{display:grid}.check-line strong{font-size:.61rem}.check-line small{font-size:.5rem;color:#94827a;font-weight:500;line-height:1.7}.danger-card{background:#fffaf8}.status-actions button,.delete-button{width:100%;border:1px solid rgba(62,39,32,.11);border-radius:10px;padding:9px;font:inherit;font-size:.58rem;font-weight:900;cursor:pointer;background:#f1e5d8;color:#684839}.delete-button{margin-top:7px;background:#fff0ec;color:#a24e41}
  @media(max-width:1050px){.story-layout{grid-template-columns:1fr}.story-list{position:static}.story-list-items{max-height:320px}.story-fields{grid-template-columns:1fr}}
  @media(max-width:650px){.field-row.two{grid-template-columns:1fr}.story-editor-head{flex-direction:column}.story-editor-actions{width:100%}.story-editor-actions>*{flex:1}}
</style>
