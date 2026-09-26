<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';

  const journeys = [
    {
      title: 'قهوه‌ام را پیدا کن',
      text: 'با ۵ انتخاب ساده، لاین قهوه، نسبت عربیکا و روبوستا و پروفایل مناسب خودت را پیدا کن.',
      cta: 'متخصص قهوه خودت بشو!',
      href: '/find',
      image: '/media/find',
      icon: 'search'
    },
    {
      title: 'قهوه‌ات خراب میشه؟',
      text: 'بگو چجوری درستش می‌کنی، تا قدم‌به‌قدم بگم مشکل کجاست و اول چی را تغییر بدی.',
      cta: 'عیب‌یابی فنجان',
      href: '/fix',
      image: '/media/fix',
      icon: 'brew'
    },
    {
      title: 'قهوه و من',
      text: 'قهوه باهات چیکار می‌کنه؟ کافئین، خواب، انرژی و حال بدنت را بهتر بشناس.',
      cta: 'شناخت قهوه و من',
      href: '/coffee-and-me',
      image: '/media/me',
      icon: 'book'
    }
  ];

  let newsletterEmail = $state('');
  let newsletterState = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let newsletterMessage = $state('');

  async function subscribeNewsletter(event: SubmitEvent) {
    event.preventDefault();

    if (newsletterState === 'loading') return;

    newsletterState = 'loading';
    newsletterMessage = '';

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail,
          source: 'homepage'
        })
      });

      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        newsletterState = 'error';
        newsletterMessage = result.message ?? 'ثبت عضویت انجام نشد. دوباره امتحان کن.';
        return;
      }

      newsletterState = 'success';
      newsletterMessage = result.message ?? 'عضویتت ثبت شد.';
      newsletterEmail = '';
    } catch {
      newsletterState = 'error';
      newsletterMessage = 'ارتباط برقرار نشد. دوباره امتحان کن.';
    }
  }

  const articles = [
    {
      title: 'چرا اسپرسو ترش می‌شود؟',
      text: 'سه علت رایج و چند تغییر ساده که همین امروز می‌توانی امتحان کنی.',
      meta: '۵ دقیقه مطالعه',
      image: '/media/espresso',
      href: '/magazine/espresso-sour'
    },
    {
      title: 'کافئین چقدر در بدن می‌ماند؟',
      text: 'یک راهنمای ساده برای زمان مصرف، خواب و انتخاب سطح کافئین.',
      meta: '۷ دقیقه مطالعه',
      image: '/media/caffeine',
      href: '/magazine/caffeine-and-sleep'
    },
    {
      title: 'راهنمای ساده V60 در خانه',
      text: 'یک دستور بی‌دردسر برای فنجانی تمیز، شیرین و قابل تکرار.',
      meta: '۶ دقیقه مطالعه',
      image: '/media/v60',
      href: '/magazine/v60-at-home'
    }
  ];
</script>

<svelte:head>
  <title>EL.SEED | قهوه خوب، روزهای بهتر</title>
  <meta name="description" content="EL.SEED یک همراه قهوه است: قهوه‌ات را پیدا کن، مشکل فنجانت را حل کن و فقط وقتی لازم است محصول مناسب بخر." />
  <meta property="og:title" content="EL.SEED | قهوه خوب، روزهای بهتر" />
  <meta property="og:description" content="قهوه برای آدم‌ها، نه اصطلاحات پیچیده. راهنمایی، مجله و فروشگاه EL.SEED." />
</svelte:head>

<Header />

<main>
  <section class="hero shell" aria-labelledby="hero-title">
    <div class="hero-visual" aria-hidden="true">
      <img src="/media/hero" alt="" />
      <div class="hero-paper-note">GOOD<br />COFFEE<br />BETTER<br />DAYS</div>
      <div class="hero-hand-note">Same brews,<br />brighter you ♡</div>
    </div>

    <div class="hero-copy">
      <div class="eyebrow">GOOD COFFEE. BETTER DAYS.</div>
      <h1 id="hero-title">قهوه برای<br />روزهای مهربان‌تر.</h1>
      <p>
        با راهنمایی‌های کاربردی، تجربه‌های ساده و قهوه‌ای که برای زندگی واقعی انتخاب شده،
        بدون پیچیدگی به فنجان بهتری برس.
      </p>
      <a class="primary-button" href="#journeys">
        مسیر را شروع کن
        <span aria-hidden="true">←</span>
      </a>
      <div class="hero-side-copy" aria-hidden="true">
        <span>روزهای<br />بهتر<br />با یک فنجان<br />قهوه</span>
        <i></i>
      </div>
      <div class="hero-script" aria-hidden="true">More<br />Good Days ♡</div>
    </div>
  </section>

  <section class="journeys shell" id="journeys" aria-label="مسیرهای EL.SEED">
    {#each journeys as journey}
      <article class="journey-card">
        <div class="journey-image">
          <img src={journey.image} alt="" />
          <div class="journey-icon" aria-hidden="true">
            {#if journey.icon === 'search'}
              <svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="5.5"></circle><path d="m14.2 14.2 4.7 4.7"></path></svg>
            {:else if journey.icon === 'brew'}
              <svg viewBox="0 0 24 24"><path d="M7 4h10l-2 4v5l3 6H6l3-6V8L7 4Z"></path><path d="M8 8h8"></path></svg>
            {:else}
              <svg viewBox="0 0 24 24"><path d="M4 5.5c3-1 5-.7 8 1.5v12c-3-2.2-5-2.5-8-1.5v-12Z"></path><path d="M20 5.5c-3-1-5-.7-8 1.5v12c3-2.2 5-2.5 8-1.5v-12Z"></path></svg>
            {/if}
          </div>
        </div>
        <div class="journey-body">
          <h2>{journey.title}</h2>
          <p>{journey.text}</p>
          <a href={journey.href}>{journey.cta}<span aria-hidden="true">←</span></a>
        </div>
      </article>
    {/each}
  </section>

  <section class="philosophy shell" aria-labelledby="philosophy-title">
    <div class="philosophy-image">
      <img src="/media/philosophy" alt="فنجان قهوه در یک فضای آرام و روشن" />
      <div class="stacked-english" aria-hidden="true">GOOD<br />COFFEE<br />BETTER<br />DAYS</div>
    </div>
    <div class="philosophy-copy">
      <span class="section-kicker">فلسفه‌ی ما</span>
      <h2 id="philosophy-title">اول آدم‌ها، بعد قهوه.</h2>
      <p>
        در EL.SEED قرار نیست برای نوشیدن یک فنجان خوب، متخصص قهوه باشی. ما پیچیدگی را کم می‌کنیم؛
        اول کمک می‌کنیم بفهمی چه چیزی برای تو جواب می‌دهد و فقط وقتی محصول واقعاً بخشی از راه‌حل باشد،
        قهوه مناسب را پیشنهاد می‌دهیم.
      </p>
      <a class="text-link" href="/about">درباره ما <span aria-hidden="true">←</span></a>
    </div>
    <aside class="philosophy-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48"><path d="M24 39V18"></path><path d="M24 24c-9 0-14-5-14-14 9 0 14 5 14 14Z"></path><path d="M24 31c9 0 14-5 14-14-9 0-14 5-14 14Z"></path></svg>
      <span>آدم‌های بهتر<br />روزهای روشن‌تر</span>
    </aside>
  </section>

  <section class="magazine shell" aria-labelledby="magazine-title">
    <div class="section-heading">
      <a class="section-heading-link" href="/magazine">مشاهده همه مقالات <span aria-hidden="true">←</span></a>
      <div class="section-title-wrap">
        <span></span>
        <h2 id="magazine-title">از مجله <b>EL.SEED</b></h2>
        <span></span>
      </div>
      <div class="section-side-note" aria-hidden="true">داستان‌ها<br />راهنماها<br />زندگی بهتر</div>
    </div>

    <div class="article-grid">
      {#each articles as article}
        <a class="article-card" href={article.href}>
          <img src={article.image} alt="" />
          <div class="article-content">
            <h3>{article.title}</h3>
            <p>{article.text}</p>
            <span>{article.meta}</span>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section class="newsletter shell" aria-labelledby="newsletter-title">
    <div class="newsletter-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m4 7 8 6 8-6"></path></svg>
    </div>
    <div class="newsletter-copy">
      <h2 id="newsletter-title">به جمع همراهان EL.SEED بپیوندید</h2>
      <p>راهنماهای تازه، مقاله‌های کاربردی و خبر محصولات جدید را مستقیم در ایمیل خود بگیرید.</p>
    </div>
    <div class="newsletter-signup">
      <form class="newsletter-form" onsubmit={subscribeNewsletter}>
        <label class="sr-only" for="newsletter-email">ایمیل شما</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autocomplete="email"
          inputmode="email"
          placeholder="ایمیل شما"
          bind:value={newsletterEmail}
          disabled={newsletterState === 'loading'}
          required
        />
        <button type="submit" disabled={newsletterState === 'loading'}>
          {newsletterState === 'loading' ? 'در حال ثبت…' : 'عضویت'}
        </button>
      </form>

      {#if newsletterMessage}
        <p
          class:newsletter-feedback-success={newsletterState === 'success'}
          class:newsletter-feedback-error={newsletterState === 'error'}
          class="newsletter-feedback"
          aria-live="polite"
        >
          {newsletterMessage}
        </p>
      {/if}
    </div>
    <div class="newsletter-note" aria-hidden="true">A Brighter<br />Inbox ♡</div>
  </section>
</main>

<Footer />
