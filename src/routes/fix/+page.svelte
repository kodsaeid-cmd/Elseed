<script lang="ts">
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import {
    buildFixQuestions,
    brewLabels,
    diagnoseCoffee,
    problemLabels,
    type FixAnswers,
    type FixDiagnosis,
    type FixQuestionKey
  } from '$lib/fixCoffee';

  let step = $state(0);
  let answers = $state<Partial<FixAnswers>>({});
  let result = $state<FixDiagnosis | null>(null);
  let sessionId = $state('');
  let feedback = $state<'idle' | 'fixed' | 'not_fixed'>('idle');

  const questions = $derived(buildFixQuestions(answers));
  const currentQuestion = $derived(questions[Math.min(step, questions.length - 1)]);
  const totalSteps = 8;
  const progress = $derived(Math.min(100, ((step + 1) / totalSteps) * 100));

  function selectOption(key: FixQuestionKey, value: string) {
    const nextAnswers = { ...answers, [key]: value } as Partial<FixAnswers>;
    answers = nextAnswers;
    const nextQuestions = buildFixQuestions(nextAnswers);

    if (step < nextQuestions.length - 1) {
      step += 1;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const complete = nextAnswers as FixAnswers;
    const diagnosis = diagnoseCoffee(complete);
    result = diagnosis;
    feedback = 'idle';
    void rememberDiagnosis(complete, diagnosis);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    if (step > 0) step -= 1;
    result = null;
    feedback = 'idle';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    step = 0;
    answers = {};
    result = null;
    sessionId = '';
    feedback = 'idle';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function anonymousId() {
    const key = 'elseed_anonymous_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  }

  async function rememberDiagnosis(complete: FixAnswers, diagnosis: FixDiagnosis) {
    try {
      const id = await anonymousId();
      localStorage.setItem('elseed_fix_diagnosis', JSON.stringify({ answers: complete, diagnosis }));
      const response = await fetch('/api/journeys/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousId: id,
          answers: complete,
          diagnosis: { code: diagnosis.code, confidence: diagnosis.confidence }
        })
      });
      const data = await response.json();
      if (response.ok && data?.sessionId) sessionId = data.sessionId;
    } catch {
      // The diagnosis itself must never depend on analytics.
    }
  }

  async function sendFeedback(value: 'fixed' | 'not_fixed') {
    feedback = value;
    try {
      if (!sessionId) return;
      await fetch('/api/journeys/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'feedback',
          anonymousId: await anonymousId(),
          sessionId,
          feedback: value
        })
      });
    } catch {
      // Keep feedback UI usable even if persistence fails.
    }
  }
</script>

<svelte:head>
  <title>قهوه‌ات خراب میشه؟ | عیب‌یاب قهوه EL.SEED</title>
  <meta name="description" content="بگو قهوه را چطور درست می‌کنی و فنجانت چه مشکلی دارد؛ عیب‌یاب EL.SEED قدم‌به‌قدم مشکل را تشخیص می‌دهد." />
</svelte:head>

<Header />

<main class="fix-page">
  {#if !result}
    <section class="fix-shell">
      <div class="fix-topbar">
        <a href="/" class="fix-close" aria-label="بازگشت به خانه">×</a>
        <div class="fix-brandline">COFFEE DIAGNOSER</div>
        <span class="fix-step-count">{step + 1} / {totalSteps}</span>
      </div>

      <div class="fix-progress" aria-hidden="true"><span style:width={progress + '%'}></span></div>

      <div class="fix-intro">
        <span class="fix-kicker">قهوه‌ات خراب میشه؟</span>
        <h1>{currentQuestion.title}</h1>
        <p>{currentQuestion.subtitle}</p>
      </div>

      {#if answers.brew || answers.problem}
        <div class="fix-context">
          {#if answers.brew}<span><b>روش:</b> {brewLabels[answers.brew]}</span>{/if}
          {#if answers.problem}<span><b>مشکل:</b> {problemLabels[answers.problem]}</span>{/if}
        </div>
      {/if}

      <div class="fix-options">
        {#each currentQuestion.options as option}
          <button
            type="button"
            class:selected={answers[currentQuestion.key] === option.value}
            class="fix-option"
            onclick={() => selectOption(currentQuestion.key, option.value)}
          >
            {#if option.image}
              <span class="fix-option-photo" aria-hidden="true">
                <img src={option.image} alt="" loading="lazy" />
              </span>
            {:else}
              <span class="fix-option-icon" aria-hidden="true">{option.icon}</span>
            {/if}
            <strong>{option.title}</strong>
            <small>{option.description}</small>
            <i aria-hidden="true">←</i>
          </button>
        {/each}
      </div>

      <div class="fix-bottom">
        {#if step > 0}<button type="button" onclick={goBack}>→ سؤال قبلی</button>{:else}<span></span>{/if}
        <span>هر بار فقط یک جواب؛ تشخیص از مجموع نشانه‌ها ساخته میشه.</span>
      </div>
    </section>
  {:else}
    <section class="diagnosis-shell shell">
      <header class="diagnosis-hero">
        <div class="diagnosis-copy">
          <span class="diagnosis-eyebrow">DIAGNOSIS</span>
          <span class="fix-kicker">تشخیص احتمالی</span>
          <h1>{result.title}</h1>
          <p>{result.short}</p>
        </div>

        <div class="diagnosis-meta">
          <div>
            <small>روش دم‌آوری</small>
            <strong>{brewLabels[answers.brew as FixAnswers['brew']]}</strong>
          </div>
          <div>
            <small>مشکل فنجان</small>
            <strong>{problemLabels[answers.problem as FixAnswers['problem']]}</strong>
          </div>
          <div class="confidence">
            <small>اعتماد تشخیص</small>
            <strong>{result.confidence}</strong>
          </div>
        </div>
      </header>

      <section class="diagnosis-plan">
        <article class="plan-card primary">
          <div class="plan-number">01</div>
          <div class="plan-copy">
            <span class="diagnosis-label">اول فقط این کار رو بکن</span>
            <h2>{result.firstAction}</h2>
            <p>یک تغییر، یک تست، بعد تصمیم بعدی. هیچ متغیر دیگری را فعلاً تغییر نده.</p>
          </div>
          <span class="plan-badge">FIRST MOVE</span>
        </article>

        <article class="plan-card secondary">
          <div class="plan-number">02</div>
          <div class="plan-copy">
            <span class="diagnosis-label">اگر جواب نداد</span>
            <h3>{result.secondAction}</h3>
            <p>فقط بعد از تست مرحله اول سراغ این تغییر برو.</p>
          </div>
        </article>
      </section>

      <section class="diagnosis-insight-grid">
        <article class="diagnosis-why">
          <div class="insight-head">
            <span>چرا به این نتیجه رسیدیم؟</span>
            <b>WHY</b>
          </div>
          <p>{result.why}</p>
          <div class="diagnosis-evidence">
            {#each result.evidence as item}<span>✓ {item}</span>{/each}
          </div>
        </article>

        <article class="diagnosis-guard-card">
          <div class="guard-icon">!</div>
          <div>
            <span>فعلاً دست نزن</span>
            <strong>{result.keepStill}</strong>
          </div>
        </article>

        <article class="diagnosis-rule-card">
          <span>قاعده EL.SEED</span>
          <strong>هر بار فقط یک متغیر.</strong>
          <small>اگر چند چیز را با هم عوض کنی، نمی‌فهمیم کدام تغییر جواب داده.</small>
        </article>
      </section>

      {#if feedback === 'idle'}
        <section class="diagnosis-feedback">
          <div class="feedback-copy">
            <span>بعد از تست مرحله اول</span>
            <h2>نتیجه چی شد؟</h2>
            <p>همین جواب، مرحله بعدی تشخیص را مشخص می‌کند.</p>
          </div>
          <div class="feedback-actions">
            <button type="button" class="fixed" onclick={() => sendFeedback('fixed')}>درست شد <b>✓</b></button>
            <button type="button" class="not-fixed" onclick={() => sendFeedback('not_fixed')}>هنوز درست نشده <b>←</b></button>
          </div>
        </section>
      {:else if feedback === 'fixed'}
        <section class="diagnosis-followup success">
          <span>✓ متغیر درست را پیدا کردیم</span>
          <h2>همین نسخه را برای فنجان بعدی هم تکرار کن.</h2>
          <p>اگر مشکل برگشت، دوباره عیب‌یابی کن تا ببینیم چه چیزی تغییر کرده.</p>
        </section>
      {:else}
        <section class="diagnosis-followup">
          <span>STEP 03 · یک لایه عمیق‌تر</span>
          <h2>{result.deeperAction}</h2>
          <p>بعد از این تست اگر هنوز مشکل ماند، عیب‌یاب را دوباره با تنظیم جدید اجرا کن.</p>
        </section>
      {/if}

      <section class="diagnosis-actions">
        <button type="button" onclick={restart}>↻ از اول عیب‌یابی کن</button>
        <a href={result.relatedHref}>{result.relatedLabel}<span>←</span></a>
      </section>
    </section>
  {/if}
</main>

<Footer />

<style>
  :global(body){background:#f7f1e8}
  :global(.fix-page),:global(.fix-page *){font-family:'Vazirmatn',Tahoma,Arial,sans-serif!important}
  .fix-page{min-height:calc(100vh - 110px);padding:28px 0 72px;color:#42261d}
  .fix-shell{width:min(1120px,calc(100% - 34px));margin:0 auto}
  .fix-topbar{display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:14px}
  .fix-close{width:42px;height:42px;border:1px solid rgba(66,38,29,.13);border-radius:50%;display:grid;place-items:center;color:#5f433a;background:rgba(255,255,255,.48);font-size:1.25rem}
  .fix-brandline{font-size:.63rem;letter-spacing:.2em;color:#a58d81;font-weight:800;direction:ltr}
  .fix-step-count{font-size:.7rem;color:#91796f;direction:ltr}
  .fix-progress{height:3px;background:rgba(66,38,29,.08);margin:16px 0 58px;border-radius:999px;overflow:hidden}
  .fix-progress span{display:block;height:100%;background:#d1833f;border-radius:999px;transition:width .3s ease}
  .fix-intro{text-align:center;max-width:820px;margin:0 auto}
  .fix-kicker{display:inline-block;color:#d1833f;font-size:.72rem;font-weight:800;margin-bottom:10px}
  .fix-intro h1{margin:0;font-size:clamp(2.15rem,5vw,4.4rem);line-height:1.35;letter-spacing:-.035em;font-weight:800}
  .fix-intro p{max-width:640px;margin:18px auto 0;color:#877269;font-size:1rem;line-height:2}
  .fix-context{margin:22px auto 0;display:flex;justify-content:center;flex-wrap:wrap;gap:8px}
  .fix-context span{padding:7px 11px;border-radius:999px;background:#efe3d4;color:#7a5a4d;font-size:.72rem}.fix-context b{color:#b36f34}
  .fix-options{margin:44px auto 0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
  .fix-option{position:relative;min-height:310px;padding:24px 20px 20px;border:1px solid rgba(66,38,29,.1);border-radius:22px;background:rgba(255,255,255,.66);color:#42261d;text-align:right;display:flex;flex-direction:column;align-items:flex-start;cursor:pointer;font:inherit;transition:.2s ease;box-shadow:0 10px 30px rgba(66,38,29,.025);overflow:hidden}
  .fix-option:hover,.fix-option.selected{transform:translateY(-4px);border-color:rgba(209,131,63,.42);background:rgba(255,252,247,.94);box-shadow:0 18px 38px rgba(66,38,29,.07)}
  .fix-option-photo{width:136px;height:136px;border-radius:50%;overflow:hidden;margin-bottom:24px;border:1px solid rgba(111,78,55,.14);box-shadow:0 12px 30px rgba(62,39,32,.13);flex:0 0 auto;background:#eadbcb}
  .fix-option-photo img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;filter:saturate(.92) contrast(.98) brightness(1.01);transition:transform .3s ease}
  .fix-option:hover .fix-option-photo img{transform:scale(1.06)}
  .fix-option-icon{width:48px;height:48px;border-radius:50%;background:#f1e3d4;color:#a76029;display:grid;place-items:center;font-size:1rem;font-weight:900;margin-bottom:24px}
  .fix-option strong{font-size:1.04rem;line-height:1.7}.fix-option small{margin-top:8px;color:#8a756c;font-size:.72rem;line-height:1.9;padding-bottom:26px}.fix-option i{position:absolute;left:20px;bottom:16px;font-style:normal;color:#c27a3a;transition:transform .2s ease}.fix-option:hover i{transform:translateX(-4px)}
  .fix-bottom{margin-top:26px;padding-top:18px;border-top:1px solid rgba(66,38,29,.08);display:flex;justify-content:space-between;align-items:center;gap:18px;color:#9b877f;font-size:.68rem}
  .fix-bottom button{border:0;background:transparent;color:#6d5147;font:inherit;font-weight:800;cursor:pointer}

  .diagnosis-shell{padding-top:28px}
  .diagnosis-hero{padding:34px 0 30px;border-bottom:1px solid rgba(66,38,29,.09);display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,.65fr);gap:42px;align-items:end}
  .diagnosis-copy{max-width:850px}.diagnosis-eyebrow{display:block;direction:ltr;text-align:right;color:rgba(66,38,29,.36);font-size:.6rem;letter-spacing:.18em;font-weight:800;margin-bottom:4px}
  .diagnosis-copy h1{margin:4px 0 10px;font-size:clamp(2.35rem,4.4vw,4rem);line-height:1.35;letter-spacing:-.04em;font-weight:800;max-width:850px}
  .diagnosis-copy>p{margin:0;max-width:720px;color:#846f66;font-size:.95rem;line-height:2}
  .diagnosis-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px;border:1px solid rgba(66,38,29,.08);border-radius:18px;background:rgba(255,255,255,.48)}
  .diagnosis-meta>div{min-width:0;padding:13px 12px;border-radius:13px;background:#fffaf4;display:grid;gap:4px}.diagnosis-meta small{font-size:.58rem;color:#9a8378}.diagnosis-meta strong{font-size:.76rem;line-height:1.7;color:#5d3d31;overflow:hidden;text-overflow:ellipsis}.diagnosis-meta .confidence{background:#f1e0cd}.diagnosis-meta .confidence strong{color:#ae6528;font-size:1.15rem}

  .diagnosis-plan{margin-top:22px;display:grid;grid-template-columns:1.45fr .8fr;gap:14px}
  .plan-card{position:relative;border:1px solid rgba(66,38,29,.09);border-radius:24px;background:rgba(255,255,255,.7);padding:28px;display:grid;grid-template-columns:56px minmax(0,1fr);gap:18px;box-shadow:0 14px 34px rgba(66,38,29,.035)}
  .plan-card.primary{background:linear-gradient(135deg,#fffaf4 0%,#f1e0cd 100%);border-color:rgba(198,134,66,.18)}
  .plan-card.secondary{background:rgba(255,255,255,.52)}
  .plan-number{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:#42261d;color:#fff;font-weight:800;font-size:.8rem;direction:ltr}
  .secondary .plan-number{background:#ead9c8;color:#86552f}
  .plan-copy{min-width:0}.diagnosis-label{font-size:.66rem;color:#b16c31;font-weight:800}.plan-copy h2{margin:8px 0 8px;font-size:clamp(1.55rem,2.5vw,2.45rem);line-height:1.65;font-weight:800}.plan-copy h3{margin:8px 0 8px;font-size:1.25rem;line-height:1.8;font-weight:800}.plan-copy p{margin:0;color:#806b62;font-size:.8rem;line-height:1.95}
  .plan-badge{position:absolute;left:18px;top:18px;direction:ltr;font-size:.5rem;letter-spacing:.12em;color:rgba(66,38,29,.38);font-weight:800}

  .diagnosis-insight-grid{margin-top:14px;display:grid;grid-template-columns:1.25fr .85fr .7fr;gap:12px}
  .diagnosis-why,.diagnosis-guard-card,.diagnosis-rule-card{border:1px solid rgba(66,38,29,.08);border-radius:20px;background:rgba(255,255,255,.55);padding:20px}
  .insight-head{display:flex;justify-content:space-between;align-items:center;gap:12px}.insight-head>span,.diagnosis-guard-card span,.diagnosis-rule-card span{font-size:.64rem;color:#a26a3c;font-weight:800}.insight-head b{direction:ltr;color:rgba(66,38,29,.28);font-size:.52rem;letter-spacing:.16em}
  .diagnosis-why>p{margin:10px 0 0;color:#725d54;line-height:2;font-size:.79rem}
  .diagnosis-evidence{margin-top:15px;display:flex;flex-wrap:wrap;gap:7px}.diagnosis-evidence span{padding:7px 9px;border-radius:999px;background:#f1e6da;color:#6e554b;font-size:.6rem;line-height:1.5}
  .diagnosis-guard-card{display:flex;align-items:flex-start;gap:12px;background:#fff8f2}.guard-icon{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:#f1dac1;color:#a9662c;font-weight:900}.diagnosis-guard-card>div:last-child{display:grid;gap:7px}.diagnosis-guard-card strong{font-size:.78rem;line-height:1.95}
  .diagnosis-rule-card{display:grid;align-content:start;gap:7px;background:#42261d;color:#fff}.diagnosis-rule-card span{color:#d8aa7c}.diagnosis-rule-card strong{font-size:1.02rem;line-height:1.8}.diagnosis-rule-card small{color:rgba(255,255,255,.62);font-size:.63rem;line-height:1.8}

  .diagnosis-feedback{margin-top:28px;padding:22px 24px;border:1px solid rgba(66,38,29,.09);border-radius:22px;background:rgba(255,255,255,.62);display:flex;justify-content:space-between;align-items:center;gap:24px}
  .feedback-copy span,.diagnosis-followup>span{color:#a16e47;font-size:.62rem;font-weight:700}.feedback-copy h2,.diagnosis-followup h2{margin:4px 0 0;font-size:1.5rem;line-height:1.65}.feedback-copy p{margin:4px 0 0;color:#8a766d;font-size:.67rem}
  .feedback-actions{display:flex;gap:8px}.diagnosis-feedback button{min-height:46px;padding:0 17px;border-radius:999px;font:inherit;font-size:.72rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:9px}.diagnosis-feedback button b{font-size:.85rem}.diagnosis-feedback .fixed{border:0;background:#42261d;color:#fff;box-shadow:0 10px 22px rgba(66,38,29,.13)}.diagnosis-feedback .not-fixed{border:1px solid rgba(66,38,29,.14);background:#fffaf5;color:#5e4237}
  .diagnosis-followup{margin-top:28px;padding:22px 24px;border-radius:22px;background:#efe2d4;border:1px solid rgba(66,38,29,.06)}.diagnosis-followup.success{background:#e8efe7;color:#36543d}.diagnosis-followup p{margin:7px 0 0;color:#806c63;font-size:.76rem;line-height:1.9}
  .diagnosis-actions{margin-top:16px;padding-top:16px;border-top:1px solid rgba(66,38,29,.08);display:flex;justify-content:space-between;align-items:center;gap:12px}.diagnosis-actions button,.diagnosis-actions a{min-height:42px;padding:0 15px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:.69rem;font-weight:800}.diagnosis-actions button{border:1px solid rgba(66,38,29,.14);background:transparent;color:#42261d;cursor:pointer}.diagnosis-actions a{background:#42261d;color:#fff}

  @media(max-width:980px){
    .fix-options{grid-template-columns:repeat(2,minmax(0,1fr))}
    .diagnosis-hero{grid-template-columns:1fr;gap:20px}
    .diagnosis-meta{max-width:620px}
    .diagnosis-plan{grid-template-columns:1fr}
    .diagnosis-insight-grid{grid-template-columns:1fr 1fr}.diagnosis-why{grid-column:1/-1}
  }
  @media(max-width:640px){
    .fix-page{padding-top:18px}.fix-progress{margin-bottom:38px}.fix-intro h1{font-size:2.25rem}.fix-options{grid-template-columns:1fr}.fix-option{min-height:220px;display:grid;grid-template-columns:108px minmax(0,1fr);grid-template-rows:auto auto 1fr;column-gap:16px;padding:16px}.fix-option-photo{grid-row:1/4;width:108px;height:108px;margin:0}.fix-option strong{align-self:end}.fix-option small{padding-bottom:20px}.fix-option i{left:16px;bottom:14px}
    .diagnosis-hero{padding-top:20px}.diagnosis-copy h1{font-size:2.1rem}.diagnosis-meta{grid-template-columns:1fr}.diagnosis-plan{gap:10px}.plan-card{padding:18px;grid-template-columns:42px 1fr;gap:12px}.plan-number{width:40px;height:40px}.plan-badge{display:none}.plan-copy h2{font-size:1.35rem}.diagnosis-insight-grid{grid-template-columns:1fr}.diagnosis-why{grid-column:auto}.diagnosis-feedback,.diagnosis-actions{align-items:stretch;flex-direction:column}.feedback-actions{width:100%;flex-direction:column}.diagnosis-feedback button{width:100%;justify-content:center}.diagnosis-actions button,.diagnosis-actions a{justify-content:center}
  }
</style>
