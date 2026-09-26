<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';

  type Signal = {
    key: string;
    value: string;
    label: string;
    source: string;
    updatedAt: string;
  };

  type ProfileSnapshot = {
    preferences: Record<string, any>;
    signals: Record<string, Signal>;
    latestFix: {
      code: string;
      confidence: string;
      brew: string;
      problem: string;
      createdAt: string;
    } | null;
    journeyCounts: Record<string, number>;
    updatedAt: string | null;
  };

  type MeQuestion = {
    key: string;
    eyebrow: string;
    title: string;
    description: string;
    options: { value: string; label: string; note: string }[];
  };

  const questions: MeQuestion[] = [
    {
      key: 'caffeine.sleep',
      eyebrow: 'خواب',
      title: 'قهوه دیرهنگام روی خوابت اثر می‌ذاره؟',
      description: 'جوابت کمک می‌کنه مقاله‌ها و پیشنهادهای مربوط به زمان مصرف برای تو شخصی‌تر بشن.',
      options: [
        { value: 'none', label: 'تقریباً نه', note: 'حتی عصرها هم معمولاً مشکلی ندارم' },
        { value: 'sometimes', label: 'بعضی وقت‌ها', note: 'بستگی به ساعت و مقدارش داره' },
        { value: 'yes', label: 'واضحاً بله', note: 'قهوه دیرتر، خوابم رو عقب می‌اندازه' },
        { value: 'unknown', label: 'هنوز نمی‌دونم', note: 'باید بیشتر دقت کنم' }
      ]
    },
    {
      key: 'habit.cups',
      eyebrow: 'ریتم روز',
      title: 'یک روز معمولی چند فنجان می‌خوری؟',
      description: 'برای اینکه پیشنهادها بین انرژی، مزه و تعداد فنجان تعادل بهتری داشته باشن.',
      options: [
        { value: 'one', label: 'یک فنجان', note: 'یک فنجان اصلی در روز' },
        { value: 'two', label: 'دو فنجان', note: 'معمولاً صبح و یک بار دیگه' },
        { value: 'three-plus', label: 'سه فنجان یا بیشتر', note: 'قهوه بخش ثابتی از روزمه' },
        { value: 'varies', label: 'هر روز فرق داره', note: 'روتین ثابتی ندارم' }
      ]
    },
    {
      key: 'body.stomach',
      eyebrow: 'بدن',
      title: 'معده‌ات با قهوه چطوره؟',
      description: 'این داده پزشکی نیست؛ فقط تجربه شخصی تو از نوشیدن قهوه است.',
      options: [
        { value: 'fine', label: 'مشکلی ندارم', note: 'معمولاً راحت می‌خورم' },
        { value: 'empty-stomach', label: 'ناشتا اذیتم می‌کنه', note: 'با غذا بهترم' },
        { value: 'sometimes', label: 'گاهی حساس می‌شه', note: 'بسته به قهوه یا زمان مصرف' },
        { value: 'unknown', label: 'مطمئن نیستم', note: 'هنوز الگو پیدا نکردم' }
      ]
    }
  ];

  let profile = $state<ProfileSnapshot | null>(null);
  let loading = $state(true);
  let savingKey = $state('');
  let activeQuestion = $state(0);

  const lineLabels: Record<string, string> = {
    FULL: 'پرقدرت',
    HALF: 'متعادل',
    LOW: 'ملایم',
    DECAF: 'دی‌کف'
  };

  const tasteLabels: Record<string, string> = {
    chocolate: 'شکلاتی و آجیلی',
    caramel: 'کاراملی و شیرین',
    fruity: 'میوه‌ای و روشن',
    bold: 'سنگین و کلاسیک',
    unsure: 'متعادل'
  };

  const brewLabels: Record<string, string> = {
    espresso: 'اسپرسوساز',
    moka: 'موکاپات',
    v60: 'V60 / پوراور',
    french: 'فرنچ‌پرس',
    filter: 'قهوه‌ساز فیلتری',
    aeropress: 'AeroPress',
    turkish: 'قهوه ترک',
    capsule: 'کپسولی',
    unsure: 'هنوز مشخص نیست'
  };

  const fixLabels: Record<string, string> = {
    over: 'عصاره‌گیری بیش از حد',
    under: 'عصاره‌گیری ناقص',
    hot: 'حرارت بالا',
    strong: 'فنجان بیش از حد متمرکز',
    weak: 'نسبت رقیق',
    dark: 'رُست تیره',
    stale: 'افت تازگی',
    technique: 'تکرارپذیری روش'
  };

  async function getAnonymousId() {
    const key = 'elseed_anonymous_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  }

  async function loadProfile() {
    loading = true;
    try {
      const id = await getAnonymousId();
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ anonymousId: id })
      });
      const data = await response.json();
      if (response.ok && data?.profile) profile = data.profile;
    } catch {
      profile = null;
    } finally {
      loading = false;
    }
  }

  async function answer(question: MeQuestion, option: MeQuestion['options'][number]) {
    savingKey = question.key;
    try {
      const id = await getAnonymousId();
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mode: 'signal',
          anonymousId: id,
          key: question.key,
          value: option.value,
          label: option.label,
          source: 'coffee-and-me'
        })
      });
      const data = await response.json();
      if (response.ok && data?.profile) profile = data.profile;
      activeQuestion = Math.min(questions.length - 1, activeQuestion + 1);
    } finally {
      savingKey = '';
    }
  }

  $effect(() => {
    if (typeof window !== 'undefined') void loadProfile();
  });

  const prefs = $derived(profile?.preferences ?? {});
  const signals = $derived(profile?.signals ?? {});
  const completedSignals = $derived(Object.keys(signals).length);
  const profileProgress = $derived(Math.min(100, Math.round(((completedSignals + (prefs.line ? 2 : 0) + (profile?.latestFix ? 1 : 0)) / 6) * 100)));

  const currentMeQuestion = $derived(questions[activeQuestion]);

  const recommendations = $derived([
    signals['caffeine.sleep']?.value === 'yes'
      ? { title: 'کافئین چقدر در بدن می‌ماند؟', href: '/magazine/caffeine-and-sleep', meta: 'برای الگوی خواب تو' }
      : { title: 'قهوه‌ی عصر باید با قهوه‌ی صبح فرق داشته باشد؟', href: '/magazine/afternoon-coffee', meta: 'برای ریتم روز تو' },
    profile?.latestFix
      ? { title: 'آسیاب قهوه را بدون اصطلاحات پیچیده تنظیم کن', href: '/magazine/grind-size-without-jargon', meta: 'بر اساس عیب‌یابی اخیر' }
      : { title: 'راهنمای ساده V60 در خانه', href: '/magazine/v60-at-home', meta: 'یک راهنمای کاربردی' },
    { title: 'عربیکا و روبوستا؛ کدام به زندگی تو می‌خورد؟', href: '/magazine/arabica-robusta-for-real-life', meta: 'بر اساس ذائقه و انرژی' }
  ]);
</script>

<svelte:head>
  <title>قهوه و من | پروفایل قهوه‌ای EL.SEED</title>
  <meta
    name="description"
    content="پروفایل قهوه‌ای تو در EL.SEED؛ ذائقه، روش دم‌آوری، الگوی مصرف و تجربه‌های Q&A در یک جا جمع می‌شوند تا پیشنهادهای شخصی‌تری بگیری."
  />
</svelte:head>

<Header />

<main class="me-page">
  <section class="me-shell">
    <header class="me-hero">
      <div class="me-hero-copy">
        <span class="me-kicker">MY COFFEE PROFILE</span>
        <h1>قهوه و من</h1>
        <p>هر سؤال و جوابی که در EL.SEED تجربه می‌کنی، یک تکه از پروفایل قهوه‌ای تو رو کامل‌تر می‌کنه.</p>
      </div>

      <div class="profile-progress-card">
        <div class="progress-ring" style={'--progress:' + profileProgress + '%'}>
          <div><strong>{profileProgress}%</strong><span>شناخت فعلی</span></div>
        </div>
        <p>هرچی بیشتر جواب بدی، مقاله‌ها و پیشنهادها دقیق‌تر می‌شن.</p>
      </div>
    </header>

    {#if loading}
      <section class="me-loading">داریم تکه‌های پروفایلت رو کنار هم می‌چینیم…</section>
    {:else}
      <section class="profile-overview">
        <article class="profile-card taste-card">
          <span>ذائقه و انتخاب</span>
          <strong>{tasteLabels[prefs.taste] ?? 'هنوز کامل نشده'}</strong>
          <small>{prefs.line ? 'لاین پیشنهادی: ' + (lineLabels[prefs.line] ?? prefs.line) : 'مسیر Find My Coffee رو کامل کن.'}</small>
          <a href="/find">قهوه مناسبم رو پیدا کنم</a>
        </article>

        <article class="profile-card brew-card">
          <span>روش اصلی</span>
          <strong>{brewLabels[prefs.brew] ?? brewLabels[profile?.latestFix?.brew ?? ''] ?? 'هنوز مشخص نیست'}</strong>
          <small>{prefs.roast ? 'رُست پیشنهادی: ' + prefs.roast : 'روش دم‌آوری تو در پیشنهادهای بعدی لحاظ می‌شه.'}</small>
          <a href="/fix">فنجانم رو عیب‌یابی کنم</a>
        </article>

        <article class="profile-card fix-card">
          <span>آخرین عیب‌یابی</span>
          <strong>{profile?.latestFix ? (fixLabels[profile.latestFix.code] ?? 'تشخیص ثبت شده') : 'هنوز عیب‌یابی نکردی'}</strong>
          <small>{profile?.latestFix ? 'اعتماد تشخیص: ' + profile.latestFix.confidence : 'اگر فنجانت خوب درنمیاد، از اینجا شروع کن.'}</small>
          <a href="/fix">رفتن به Diagnoser</a>
        </article>

        <article class="profile-card signal-card">
          <span>سیگنال‌های شخصی</span>
          <strong>{completedSignals}</strong>
          <small>جواب‌هایی که از مقاله‌ها و Q&Aهای EL.SEED به پروفایلت اضافه شده.</small>
          <a href="#quick-profile">پروفایل رو کامل‌تر کنم</a>
        </article>
      </section>

      <section class="signal-board">
        <div class="section-head">
          <div>
            <span>WHAT WE KNOW</span>
            <h2>تا الان چی ازت فهمیدیم؟</h2>
          </div>
          <p>این‌ها «حکم پزشکی» نیستن؛ فقط ترجیحات و تجربه‌هایی هستن که خودت به EL.SEED گفتی.</p>
        </div>

        <div class="signal-list">
          {#if prefs.time}<span><b>زمان مصرف</b>{prefs.time}</span>{/if}
          {#if prefs.flavor}<span><b>پروفایل طعمی</b>{prefs.flavor}</span>{/if}
          {#if prefs.blend}<span><b>ترکیب پیشنهادی</b>{prefs.blend}</span>{/if}
          {#each Object.values(signals) as signal}
            <span><b>{signal.key.split('.').pop()}</b>{signal.label}</span>
          {/each}
          {#if !prefs.time && !completedSignals}
            <div class="empty-signal">هنوز داده زیادی نداریم؛ با چند جواب ساده شروعش می‌کنیم.</div>
          {/if}
        </div>
      </section>

      <section class="quick-profile" id="quick-profile">
        <div class="section-head">
          <div>
            <span>QUICK Q&A</span>
            <h2>یه تکه دیگه از پروفایلت رو کامل کن</h2>
          </div>
          <p>هر جواب بلافاصله به «قهوه و من» اضافه می‌شه و بعداً مقاله‌ها هم می‌تونن ازش استفاده کنن.</p>
        </div>

        <article class="me-question">
          <div class="question-copy">
            <span>{currentMeQuestion.eyebrow}</span>
            <h3>{currentMeQuestion.title}</h3>
            <p>{currentMeQuestion.description}</p>
          </div>

          <div class="me-options">
            {#each currentMeQuestion.options as option}
              <button
                type="button"
                class:selected={signals[currentMeQuestion.key]?.value === option.value}
                disabled={savingKey === currentMeQuestion.key}
                onclick={() => answer(currentMeQuestion, option)}
              >
                <strong>{option.label}</strong>
                <small>{option.note}</small>
              </button>
            {/each}
          </div>

          <div class="question-switcher">
            {#each questions as item, index}
              <button
                type="button"
                class:active={index === activeQuestion}
                onclick={() => (activeQuestion = index)}
                aria-label={'سؤال ' + (index + 1)}
              ></button>
            {/each}
          </div>
        </article>
      </section>

      <section class="for-you">
        <div class="section-head">
          <div>
            <span>FOR YOU</span>
            <h2>از مجله، برای تو</h2>
          </div>
          <a href="/magazine">همه مقاله‌ها</a>
        </div>

        <div class="for-you-grid">
          {#each recommendations as item}
            <a href={item.href} class="for-you-card">
              <span>{item.meta}</span>
              <h3>{item.title}</h3>
            </a>
          {/each}
        </div>
      </section>
    {/if}
  </section>
</main>

<Footer />

<style>
  :global(.me-page),:global(.me-page *){font-family:'Vazirmatn',Tahoma,Arial,sans-serif!important}
  .me-page{background:#f7f1e8;color:#42261d;min-height:80vh;padding:36px 0 72px}
  .me-shell{width:min(1180px,calc(100% - 36px));margin:0 auto}
  .me-hero{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:34px;align-items:center;padding:30px 0 36px;border-bottom:1px solid rgba(66,38,29,.09)}
  .me-kicker,.section-head span{direction:ltr;display:block;color:#c67f3d;font-size:.62rem;font-weight:800;letter-spacing:.16em}
  .me-hero h1{margin:5px 0 10px;font-size:clamp(3rem,6vw,5.8rem);line-height:1.15;letter-spacing:-.05em}.me-hero p{margin:0;max-width:720px;color:#806c63;font-size:1rem;line-height:2}
  .profile-progress-card{padding:20px;border:1px solid rgba(66,38,29,.09);border-radius:24px;background:#fffaf5;text-align:center}.profile-progress-card p{margin:13px 0 0;font-size:.68rem;line-height:1.8;color:#8a756b}
  .progress-ring{--progress:0%;width:148px;height:148px;margin:0 auto;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#c78240 var(--progress),#eadccd 0)}.progress-ring:before{content:'';position:absolute}.progress-ring>div{width:122px;height:122px;border-radius:50%;background:#fffaf5;display:grid;place-items:center;align-content:center}.progress-ring strong{font-size:1.7rem}.progress-ring span{font-size:.58rem;color:#9b8175}

  .me-loading{margin-top:20px;padding:60px;border:1px dashed rgba(66,38,29,.12);border-radius:22px;text-align:center;color:#917d74}
  .profile-overview{margin-top:18px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.profile-card{min-height:190px;padding:18px;border:1px solid rgba(66,38,29,.08);border-radius:20px;background:rgba(255,255,255,.58);display:flex;flex-direction:column}.profile-card>span{font-size:.61rem;color:#aa7248}.profile-card>strong{margin-top:12px;font-size:1.15rem;line-height:1.65}.profile-card>small{margin-top:6px;color:#8d786e;font-size:.64rem;line-height:1.85}.profile-card>a{margin-top:auto;padding-top:16px;font-size:.66rem;font-weight:800;color:#6d4635}.taste-card{background:#f2dfca}.fix-card{background:#fffaf4}.signal-card{background:#42261d;color:#fff}.signal-card>span,.signal-card>small,.signal-card>a{color:rgba(255,255,255,.68)}

  .signal-board,.quick-profile,.for-you{margin-top:46px}.section-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:16px}.section-head h2{margin:4px 0 0;font-size:1.7rem}.section-head>p{max-width:500px;margin:0;color:#8c786f;font-size:.68rem;line-height:1.9}.section-head>a{font-size:.7rem;font-weight:800;color:#6b4637}
  .signal-list{display:flex;flex-wrap:wrap;gap:8px}.signal-list>span{display:inline-flex;gap:7px;align-items:center;padding:9px 11px;border-radius:999px;background:#fffaf4;border:1px solid rgba(66,38,29,.08);font-size:.65rem;color:#6f554b}.signal-list b{color:#b2703b;font-weight:800}.empty-signal{width:100%;padding:26px;border:1px dashed rgba(66,38,29,.12);border-radius:16px;color:#8f7a71;text-align:center}

  .me-question{padding:24px;border:1px solid rgba(66,38,29,.08);border-radius:26px;background:rgba(255,255,255,.56)}.question-copy{max-width:760px}.question-copy>span{color:#c57d3c;font-size:.63rem;font-weight:800}.question-copy h3{margin:5px 0 7px;font-size:1.6rem;line-height:1.6}.question-copy p{margin:0;color:#88736a;font-size:.72rem;line-height:1.9}
  .me-options{margin-top:20px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.me-options button{min-height:120px;padding:15px;border:1px solid rgba(66,38,29,.08);border-radius:16px;background:#fffaf5;color:#42261d;text-align:right;font:inherit;cursor:pointer;display:flex;flex-direction:column;transition:.2s ease}.me-options button:hover,.me-options button.selected{transform:translateY(-3px);border-color:#c78240;background:#f3e3d2}.me-options strong{font-size:.78rem}.me-options small{margin-top:6px;color:#8b756b;font-size:.6rem;line-height:1.8}.question-switcher{margin-top:16px;display:flex;gap:6px}.question-switcher button{width:24px;height:5px;border:0;border-radius:999px;background:#dfd0c0;cursor:pointer}.question-switcher button.active{background:#c78240;width:42px}

  .for-you-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.for-you-card{min-height:150px;padding:18px;border:1px solid rgba(66,38,29,.08);border-radius:20px;background:#fffaf4;color:inherit;display:flex;flex-direction:column;justify-content:flex-end;transition:.2s ease}.for-you-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(66,38,29,.06)}.for-you-card span{color:#b27341;font-size:.59rem}.for-you-card h3{margin:7px 0 0;font-size:1rem;line-height:1.8}

  @media(max-width:900px){.me-hero{grid-template-columns:1fr}.profile-progress-card{max-width:300px}.profile-overview{grid-template-columns:repeat(2,1fr)}.me-options{grid-template-columns:repeat(2,1fr)}.for-you-grid{grid-template-columns:1fr}}
  @media(max-width:560px){.me-page{padding-top:18px}.me-hero h1{font-size:3rem}.profile-overview,.me-options{grid-template-columns:1fr}.section-head{align-items:flex-start;flex-direction:column}.profile-card{min-height:160px}}
</style>
