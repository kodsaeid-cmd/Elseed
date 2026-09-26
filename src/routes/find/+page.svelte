<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import { findCoffeeMatch, type CoffeeMatch, type FindCoffeeAnswers } from '$lib/findCoffee';

  type QuestionKey = keyof FindCoffeeAnswers;
  type Option = {
    value: string;
    title: string;
    description: string;
    icon: string;
    image?: string;
  };

  const questions: Array<{
    key: QuestionKey;
    eyebrow: string;
    title: string;
    subtitle: string;
    options: Option[];
  }> = [
    {
      key: 'time',
      eyebrow: '۱ از ۵',
      title: 'معمولاً کی قهوه می‌خوری؟',
      subtitle: 'فقط چیزی که بیشتر شبیه زندگی واقعی توئه را انتخاب کن.',
      options: [
        { value: 'morning', title: 'صبح زود', description: 'برای شروع جدی روز', icon: '☀️', image: '/media/time-morning-human-v2' },
        { value: 'day', title: 'صبح و وسط روز', description: 'همراه کار و تمرکز', icon: '◐', image: '/media/time-day-v2' },
        { value: 'afternoon', title: 'عصر', description: 'هنوز قهوه می‌خوام، ولی سبک‌تر', icon: '🌤', image: '/media/time-afternoon-v4' },
        { value: 'night', title: 'شب', description: 'بیشتر برای حال و مزه', icon: '☾', image: '/media/time-night' }
      ]
    },
    {
      key: 'effect',
      eyebrow: '۲ از ۵',
      title: 'قهوه قراره برات چیکار کنه؟',
      subtitle: 'نه اصطلاح تخصصی؛ فقط نقشی که می‌خوای فنجانت برات بازی کنه.',
      options: [
        { value: 'strong', title: 'منو راه بندازه', description: 'یه شروع قوی و انرژی واضح می‌خوام', icon: '⚡', image: '/media/effect-strong-human-v2' },
        { value: 'balanced', title: 'کمکم کنه تمرکز کنم', description: 'انرژی متعادل برای کار و تمرکز', icon: '↗', image: '/media/find/effect-balanced-human-v3.png' },
        { value: 'many', title: 'بتونم چند فنجان بخورم', description: 'می‌خوام جا برای فنجان بعدی هم باشه', icon: '∞', image: '/media/effect-many-human-v2' },
        { value: 'taste', title: 'فقط خود قهوه رو می‌خوام', description: 'بیشتر برای مزه و حس خوبش', icon: '♡', image: '/media/effect-taste-human-v2' }
      ]
    },
    {
      key: 'sensitivity',
      eyebrow: '۳ از ۵',
      title: 'کافئین باهات چطوره؟',
      subtitle: 'این جواب فقط برای انتخاب شدت مناسب استفاده می‌شود.',
      options: [
        { value: 'none', title: 'هیچ مشکلی ندارم', description: 'قهوه معمولاً اذیتم نمی‌کنه', icon: '●', image: '/media/find/sensitivity-none-human-v3.png' },
        { value: 'some', title: 'گاهی زیادی می‌شه', description: 'بعضی قهوه‌ها برام سنگین‌اند', icon: '◒', image: '/media/find/sensitivity-some-human-v3.png' },
        { value: 'high', title: 'بهش حساسم', description: 'ترجیح می‌دم ملایم‌تر باشه', icon: '○', image: '/media/find/sensitivity-high-human-v3.png' },
        { value: 'sleep', title: 'روی خوابم اثر می‌ذاره', description: 'خصوصاً اگر دیرتر بخورم', icon: '☾', image: '/media/find/sensitivity-sleep-human-v3.png' }
      ]
    },
    {
      key: 'taste',
      eyebrow: '۴ از ۵',
      title: 'دوست داری مزه‌اش به کدوم سمت بره؟',
      subtitle: 'اگر نمی‌دونی، هیچ اشکالی نداره؛ برای همین اینجاییم.',
      options: [
        { value: 'chocolate', title: 'شکلاتی و آجیلی', description: 'فندق، کاکائو، حس گرم و آشنا', icon: '◼', image: '/media/flavor-chocolate' },
        { value: 'caramel', title: 'کاراملی و شیرین', description: 'نرم، شیرین و راحت‌نوش', icon: '◆', image: '/media/flavor-caramel' },
        { value: 'fruity', title: 'میوه‌ای و روشن', description: 'عطر بیشتر و اسیدیته زنده‌تر', icon: '✦', image: '/media/flavor-fruity' },
        { value: 'bold', title: 'سنگین و کلاسیک', description: 'بادی بالا و طعم قهوه‌ی جدی', icon: '■', image: '/media/flavor-bold' },
        { value: 'unsure', title: 'واقعاً نمی‌دونم', description: 'یک انتخاب امن و متعادل بده', icon: '?', image: '/media/flavor-unsure' }
      ]
    },
    {
      key: 'brew',
      eyebrow: '۵ از ۵',
      title: 'معمولاً چجوری درستش می‌کنی؟',
      subtitle: 'روش دم‌آوری کمک می‌کنه رُست و نسخه مناسب‌تری برات انتخاب کنیم.',
      options: [
        { value: 'espresso', title: 'اسپرسوساز', description: 'خانگی یا نیمه‌صنعتی', icon: '▣', image: '/media/brew-espresso-human-v2' },
        { value: 'moka', title: 'موکاپات', description: 'غلیظ و کلاسیک', icon: '♨', image: '/media/brew-moka-human-v2' },
        { value: 'v60', title: 'V60 / پوراور', description: 'تمیز و شفاف', icon: '▽', image: '/media/brew-v60-human-v2' },
        { value: 'french', title: 'فرنچ‌پرس', description: 'پرتر و راحت', icon: '▤', image: '/media/brew-french-human-v2' },
        { value: 'filter', title: 'قهوه‌ساز فیلتری', description: 'برای فنجان‌های روزانه', icon: '⌁', image: '/media/brew-filter-human-v2' },
        { value: 'unsure', title: 'هنوز نمی‌دونم', description: 'نسخه عمومی بده', icon: '?', image: '/media/find/brew-unsure-human-v3.png' }
      ]
    }
  ];

  let step = $state(0);
  let answers = $state<Partial<FindCoffeeAnswers>>({});
  let result = $state<CoffeeMatch | null>(null);
  let copied = $state(false);

  function selectOption(key: QuestionKey, value: string) {
    answers = { ...answers, [key]: value };

    if (step < questions.length - 1) {
      step += 1;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const complete = { ...answers, [key]: value } as FindCoffeeAnswers;
    result = findCoffeeMatch(complete);
    void rememberResult(complete, result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    if (step > 0) step -= 1;
  }

  function restart() {
    step = 0;
    answers = {};
    result = null;
    copied = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function copyBrief() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.roasteryBrief);
      copied = true;
      setTimeout(() => (copied = false), 2200);
    } catch {
      copied = false;
    }
  }

  async function rememberResult(complete: FindCoffeeAnswers, match: CoffeeMatch) {
    try {
      const storageKey = 'elseed_anonymous_id';
      let anonymousId = localStorage.getItem(storageKey);
      if (!anonymousId) {
        anonymousId = crypto.randomUUID();
        localStorage.setItem(storageKey, anonymousId);
      }

      localStorage.setItem('elseed_find_profile', JSON.stringify({ answers: complete, result: match }));

      await fetch('/api/journeys/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousId,
          profile: {
            time: complete.time,
            effect: complete.effect,
            taste: complete.taste,
            brew: complete.brew,
            line: match.line,
            blend: match.decaf
              ? '100A-DECAF'
              : `${match.arabicaPercent}A-${match.robustaPercent}R`,
            roast: match.roast,
            flavor: match.flavor
          }
        })
      });
    } catch {
      // The journey must still work even if anonymous persistence is unavailable.
    }
  }

  $effect(() => {
    if (typeof localStorage === 'undefined') return;
    const saved = localStorage.getItem('elseed_find_profile');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { answers?: FindCoffeeAnswers; result?: CoffeeMatch };
      if (parsed.answers && parsed.result) {
        answers = parsed.answers;
      }
    } catch {
      // Ignore stale local data.
    }
  });
</script>

<svelte:head>
  <title>قهوه‌ام را پیدا کن | EL.SEED</title>
  <meta
    name="description"
    content="با پنج انتخاب ساده، لاین قهوه، نسبت عربیکا و روبوستا، رُست و پروفایل طعمی مناسب خودت را پیدا کن."
  />
</svelte:head>

<Header />

<main class="find-page">
  {#if !result}
    <section class="find-shell">
      <div class="find-topbar">
        <a href="/" class="find-close" aria-label="بازگشت به خانه">×</a>
        <div class="find-brandline">FIND MY COFFEE</div>
        <span class="find-step-count">{questions[step].eyebrow}</span>
      </div>

      <div class="find-progress" aria-hidden="true">
        <span style:width={`${((step + 1) / questions.length) * 100}%`}></span>
      </div>

      <div class="find-question">
        <span class="find-kicker">قهوه‌ام را پیدا کن</span>
        <h1>{questions[step].title}</h1>
        <p>{questions[step].subtitle}</p>
      </div>

      <div
        class:find-options-five={questions[step].options.length > 4}
        class:find-options-time={questions[step].key === 'time'}
        class:find-options-effect={questions[step].key === 'effect'}
        class:find-options-sensitivity={questions[step].key === 'sensitivity'}
        class:find-options-brew={questions[step].key === 'brew'}
        class="find-options"
      >
        {#each questions[step].options as option}
          <button
            type="button"
            class:selected={answers[questions[step].key] === option.value}
            class="find-option"
            onclick={() => selectOption(questions[step].key, option.value)}
          >
            {#if option.image}
              <span class="find-option-photo" aria-hidden="true">
                <img src={option.image} alt="" />
              </span>
            {:else}
              <span class="find-option-icon" aria-hidden="true">{option.icon}</span>
            {/if}
            <strong>{option.title}</strong>
            <small>{option.description}</small>
            <i aria-hidden="true">←</i>
          </button>
        {/each}
      </div>

      <div class="find-bottom">
        {#if step > 0}
          <button class="find-back" type="button" onclick={goBack}>→ سؤال قبلی</button>
        {:else}
          <span></span>
        {/if}
        <span>بدون تایپ. فقط چند انتخاب ساده.</span>
      </div>
    </section>
  {:else}
    <section class="find-result shell">
      <div class="result-intro">
        <span class="find-kicker">پروفایل قهوه تو آماده‌ست</span>
        <h1>قهوه‌ای که به زندگی تو می‌خوره این شکلیه.</h1>
        <p>
          بر اساس جواب‌هات، نزدیک‌ترین لاین برای تو
          <b>{result.lineName}</b>
          است. {result.lineDescription}
        </p>
      </div>

      <div class="result-grid">
        <article class="line-card">
          <div class="line-card-top">
            <span>لاین تو</span>
            <em>{result.matchPercent}% MATCH</em>
          </div>
          <div class="line-code">{result.line}</div>
          <h2>{result.lineName}</h2>
          <p>{result.lineFa}</p>

          <div class="blend-visual" aria-label="نسبت پیشنهادی عربیکا و روبوستا">
            {#if result.decaf}
              <div class="blend-arabica" style="width:100%">100% ARABICA DECAF</div>
            {:else}
              <div class="blend-arabica" style:width={`${result.arabicaPercent}%`}>
                {result.arabicaPercent}% A
              </div>
              {#if result.robustaPercent > 0}
                <div class="blend-robusta" style:width={`${result.robustaPercent}%`}>
                  {result.robustaPercent}% R
                </div>
              {/if}
            {/if}
          </div>

          <small>{result.note}</small>
        </article>

        <article class="profile-card">
          <div class="profile-heading">
            <span>نسخه خرید تو</span>
            <strong>COFFEE PROFILE</strong>
          </div>

          <dl class="profile-specs">
            <div>
              <dt>ترکیب</dt>
              <dd>
                {#if result.decaf}
                  ۱۰۰٪ عربیکای دی‌کف
                {:else}
                  {result.arabicaPercent}٪ عربیکا
                  {#if result.robustaPercent > 0} / {result.robustaPercent}٪ روبوستا{/if}
                {/if}
              </dd>
            </div>
            <div><dt>رُست</dt><dd>{result.roast}</dd></div>
            <div><dt>طعم</dt><dd>{result.flavor}</dd></div>
            <div><dt>اسیدیته</dt><dd>{result.acidity}</dd></div>
            <div><dt>بادی</dt><dd>{result.body}</dd></div>
            <div><dt>دم‌آوری</dt><dd>{result.brewLabel}</dd></div>
            <div>
              <dt>عربیکا</dt>
              <dd>{result.arabicaOrigins.join(' / ')}</dd>
            </div>
            {#if result.robustaOrigins.length}
              <div>
                <dt>روبوستا</dt>
                <dd>{result.robustaOrigins.join(' / ')}</dd>
              </div>
            {/if}
          </dl>
        </article>
      </div>

      <article class="roastery-card">
        <div class="roastery-copy">
          <span>به رُستری چی بگم؟</span>
          <h2>همین جمله را نشانش بده.</h2>
          <p>{result.roasteryBrief}</p>
        </div>
        <button type="button" class="copy-brief" onclick={copyBrief}>
          {copied ? 'کپی شد ✓' : 'کپی نسخه برای رُستری'}
        </button>
      </article>

      <div class="result-trust">
        <div>
          <span>از هرجا دوست داری بخر.</span>
          <p>این مشخصات برای این ساخته شده که حتی اگر از EL.SEED خرید نکردی، بدانی دقیقاً دنبال چه قهوه‌ای هستی.</p>
        </div>
        <div class="result-actions">
          <button type="button" class="secondary-result" onclick={restart}>از اول انجامش بده</button>
          <a
            class="primary-result"
            href={`/shop?line=${result.line}&a=${result.arabicaPercent}&r=${result.robustaPercent}`}
          >
            همین پروفایل را از EL.SEED می‌خوام
            <span aria-hidden="true">←</span>
          </a>
        </div>
      </div>
    </section>
  {/if}
</main>

<Footer />
