<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';

  const journeys = [
    {
      title: 'قهوهم را پیدا کن',
      text: 'با چند سؤال ساده، قهوه‌ای مناسب سلیقه، زمان و روش دم‌آوریت پیدا کن.',
      cta: 'یافتن قهوه من',
      href: '/find',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=86',
      icon: 'search'
    },
    {
      title: 'قهوهم را درست کن',
      text: 'ترشه، تلخه یا آبکیه؟ قبل از خرید بفهم مشکل از دانه است، آسیاب یا دم‌آوری.',
      cta: 'مشکل قهوه‌ام را حل کن',
      href: '/fix',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=86',
      icon: 'brew'
    },
    {
      title: 'قهوه و من',
      text: 'قهوه باهات چیکار می‌کنه؟ کافئین، خواب، انرژی و حال بدنت را بهتر بشناس.',
      cta: 'شناخت قهوه و من',
      href: '/coffee-and-me',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=86',
      icon: 'book'
    }
  ];

  const articles = [
    {
      title: 'چرا اسپرسو ترش می‌شود؟',
      text: 'سه علت رایج و چند تغییر ساده که همین امروز می‌توانی امتحان کنی.',
      meta: '۵ دقیقه مطالعه',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=84',
      href: '/magazine/espresso-sour'
    },
    {
      title: 'کافئین چقدر در بدن می‌ماند؟',
      text: 'یک راهنمای ساده برای زمان مصرف، خواب و انتخاب سطح کافئین.',
      meta: '۷ دقیقه مطالعه',
      image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=84',
      href: '/magazine/caffeine-and-sleep'
    },
    {
      title: 'راهنمای ساده V60 در خانه',
      text: 'یک دستور بی‌دردسر برای فنجانی تمیز، شیرین و قابل تکرار.',
      meta: '۶ دقیقه مطالعه',
      image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=84',
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
      <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=90" alt="" />
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
      <img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1300&q=88" alt="فنجان قهوه در یک فضای آرام و روشن" />
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
    <form class="newsletter-form">
      <label class="sr-only" for="email">ایمیل شما</label>
      <input id="email" type="email" autocomplete="email" placeholder="ایمیل شما" />
      <button type="button">عضویت</button>
    </form>
    <div class="newsletter-note" aria-hidden="true">A Brighter<br />Inbox ♡</div>
  </section>
</main>

<Footer />
