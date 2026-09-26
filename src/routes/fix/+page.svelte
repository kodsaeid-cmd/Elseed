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

  const diagnosisImageMap: Record<string, string> = {
    over: '/media/fix-grind-fine',
    under: '/media/fix-grind-coarse',
    hot: '/media/fix-water-boiling',
    strong: '/media/fix-ratio-strong',
    weak: '/media/fix-ratio-weak',
    dark: '/media/fix-roast-dark',
    stale: '/media/fix-problem-flat',
    technique: '/media/fix-problem-inconsistent'
  };

  const diagnosisImage = $derived(result ? diagnosisImageMap[result.code] ?? '/media/fix-problem-inconsistent' : '');

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
          <div class="diagnosis-kicker-row">
            <span class="diagnosis-eyebrow">DIAGNOSIS</span>
            <span class="fix-kicker">تشخیص احتمالی</span>
          </div>
          <h1>{result.title}</h1>
          <p>{result.short}</p>

          <div class="diagnosis-summary-pills">
            <span><b>روش</b>{brewLabels[answers.brew as FixAnswers['brew']]}</span>
            <span><b>مشکل</b>{problemLabels[answers.problem as FixAnswers['problem']]}</span>
            <span class="confidence"><b>اعتماد</b>{result.confidence}</span>
          </div>
        </div>

        <div class="diagnosis-visual">
          <div class="diagnosis-photo-ring">
            <img src={diagnosisImage} alt="" />
          </div>
          <div class="diagnosis-visual-copy">
            <span>EL.SEED DIAGNOSER</span>
            <strong>یک تغییر، یک تست، یک نتیجه.</strong>
          </div>
        </div>
      </header>

      <section class="prescription">
        <div class="prescription-head">
          <div>
            <span>نسخه پیشنهادی برای فنجان بعدی</span>
            <h2>این ترتیب رو اجرا کن.</h2>
          </div>
          <small>ترتیب مهمه؛ چند متغیر رو هم‌زمان تغییر نده.</small>
        </div>

        <div class="prescription-flow">
          <article class="prescription-step primary">
            <div class="step-topline">
              <span class="step-no">01</span>
              <span class="step-status">اول انجام بده</span>
            </div>
            <h3>{result.firstAction}</h3>
            <p>فقط همین تغییر را اعمال کن و یک فنجان کامل با بقیه تنظیمات قبلی بگیر.</p>
            <div class="step-marker"><i></i><span>تست اول</span></div>
          </article>

          <div class="prescription-arrow" aria-hidden="true">←</div>

          <article class="prescription-step">
            <div class="step-topline">
              <span class="step-no">02</span>
              <span class="step-status">فقط اگر جواب نداد</span>
            </div>
            <h3>{result.secondAction}</h3>
            <p>این مرحله را فقط وقتی اجرا کن که مرحله اول تغییر محسوسی ایجاد نکرده باشد.</p>
            <div class="step-marker"><i></i><span>تست دوم</span></div>
          </article>
        </div>
      </section>

      <section class="diagnosis-insight-grid">
        <article class="diagnosis-why">
          <div class="insight-head">
            <div>
              <span>چرا این تشخیص؟</span>
              <h3>این نشونه‌ها ما رو به این نتیجه رسوند.</h3>
            </div>
            <b>WHY</b>
          </div>
          <p>{result.why}</p>
          <div class="diagnosis-evidence">
            {#each result.evidence as item}
              <span><i>✓</i>{item}</span>
            {/each}
          </div>
        </article>

        <article class="diagnosis-do-not">
          <div class="do-not-icon">×</div>
          <div>
            <span>فعلاً تغییر نده</span>
            <strong>{result.keepStill}</strong>
            <small>این‌ها رو ثابت نگه می‌داریم تا بفهمیم تغییر اصلی چه اثری داشته.</small>
          </div>
        </article>

        <article class="diagnosis-rule-card">
          <span>قاعده EL.SEED</span>
          <strong>هر بار فقط یک متغیر.</strong>
          <small>اگر هم‌زمان چند چیز رو تغییر بدی، هیچ‌وقت نمی‌فهمی مشکل دقیقاً کجا بوده.</small>
        </article>
      </section>

      {#if feedback === 'idle'}
        <section class="diagnosis-feedback">
          <div class="feedback-copy">
            <span>بعد از یک فنجان تست</span>
            <h2>خب، نتیجه چی شد؟</h2>
            <p>پاسخت تعیین می‌کنه مسیر تشخیص ادامه پیدا کنه یا همین‌جا تموم بشه.</p>
          </div>

          <div class="feedback-actions">
            <button type="button" class="fixed" onclick={() => sendFeedback('fixed')}>
              <span>درست شد</span><b>✓</b>
            </button>
            <button type="button" class="not-fixed" onclick={() => sendFeedback('not_fixed')}>
              <span>هنوز درست نشده</span><b>←</b>
            </button>
          </div>
        </section>
      {:else if feedback === 'fixed'}
        <section class="diagnosis-followup success">
          <div class="followup-icon">✓</div>
          <div>
            <span>مشکل پیدا شد</span>
            <h2>همین نسخه را برای فنجان بعدی هم تکرار کن.</h2>
            <p>اگر مشکل دوباره برگشت، عیب‌یاب را از اول اجرا کن تا ببینیم چه متغیری تغییر کرده.</p>
          </div>
        </section>
      {:else}
        <section class="diagnosis-followup">
          <div class="followup-icon">03</div>
          <div>
            <span>یک لایه عمیق‌تر</span>
            <h2>{result.deeperAction}</h2>
            <p>بعد از این تست اگر هنوز مشکل ماند، عیب‌یاب را با تنظیم جدید دوباره اجرا کن.</p>
          </div>
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

  .diagnosis-shell{padding-top:24px}
  .diagnosis-hero{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:38px;align-items:center;padding:34px 0 32px;border-bottom:1px solid rgba(66,38,29,.09)}
  .diagnosis-kicker-row{display:flex;align-items:center;gap:12px}.diagnosis-eyebrow{direction:ltr;color:rgba(66,38,29,.34);font-size:.56rem;letter-spacing:.16em;font-weight:800}.diagnosis-kicker-row .fix-kicker{margin:0}
  .diagnosis-copy h1{margin:8px 0 10px;font-size:clamp(2.3rem,4vw,3.8rem);line-height:1.38;letter-spacing:-.038em;font-weight:800;max-width:820px}
  .diagnosis-copy>p{margin:0;max-width:720px;color:#846f66;font-size:.94rem;line-height:2}
  .diagnosis-summary-pills{margin-top:20px;display:flex;flex-wrap:wrap;gap:8px}.diagnosis-summary-pills span{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border-radius:999px;background:#fffaf4;border:1px solid rgba(66,38,29,.08);font-size:.65rem;color:#73574d}.diagnosis-summary-pills b{font-weight:700;color:#ac6c37}.diagnosis-summary-pills .confidence{background:#f1dfcb}
  .diagnosis-visual{justify-self:end;width:260px;padding:18px;border:1px solid rgba(66,38,29,.08);border-radius:24px;background:linear-gradient(145deg,#fffaf4,#eddcca);box-shadow:0 18px 42px rgba(66,38,29,.05)}
  .diagnosis-photo-ring{width:150px;height:150px;margin:0 auto;border-radius:50%;overflow:hidden;border:8px solid rgba(255,255,255,.72);box-shadow:0 15px 35px rgba(66,38,29,.13)}.diagnosis-photo-ring img{width:100%;height:100%;object-fit:cover}
  .diagnosis-visual-copy{text-align:center;margin-top:14px}.diagnosis-visual-copy span{display:block;direction:ltr;font-size:.49rem;letter-spacing:.15em;color:#9a7f71}.diagnosis-visual-copy strong{display:block;margin-top:5px;font-size:.78rem;line-height:1.7}

  .prescription{margin-top:22px;padding:24px;border:1px solid rgba(66,38,29,.08);border-radius:26px;background:rgba(255,255,255,.48);box-shadow:0 14px 36px rgba(66,38,29,.025)}
  .prescription-head{display:flex;justify-content:space-between;align-items:end;gap:20px;padding-bottom:16px;border-bottom:1px solid rgba(66,38,29,.07)}.prescription-head span{color:#ae6a32;font-size:.66rem;font-weight:800}.prescription-head h2{margin:4px 0 0;font-size:1.45rem;line-height:1.5}.prescription-head small{max-width:360px;color:#917e75;font-size:.62rem;line-height:1.8;text-align:left}
  .prescription-flow{display:grid;grid-template-columns:minmax(0,1.15fr) 38px minmax(0,.85fr);gap:10px;align-items:stretch;margin-top:18px}
  .prescription-step{position:relative;min-height:215px;padding:22px;border-radius:20px;background:#fffaf5;border:1px solid rgba(66,38,29,.08);display:flex;flex-direction:column}.prescription-step.primary{background:linear-gradient(135deg,#42261d 0%,#6c4434 100%);color:#fff;border-color:transparent;box-shadow:0 18px 38px rgba(66,38,29,.15)}
  .step-topline{display:flex;align-items:center;justify-content:space-between;gap:12px}.step-no{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#ead8c5;color:#8b582d;font-size:.62rem;font-weight:800;direction:ltr}.primary .step-no{background:#f3d6b4;color:#6b3e24}.step-status{font-size:.58rem;color:#a3724d;font-weight:800}.primary .step-status{color:#e8b885}
  .prescription-step h3{margin:20px 0 8px;font-size:1.32rem;line-height:1.85;font-weight:800}.prescription-step p{margin:0;color:#816e65;font-size:.72rem;line-height:1.95}.primary p{color:rgba(255,255,255,.68)}
  .step-marker{margin-top:auto;padding-top:16px;display:flex;align-items:center;gap:7px;font-size:.54rem;color:#9a8479}.step-marker i{width:7px;height:7px;border-radius:50%;background:#c68442}.primary .step-marker{color:rgba(255,255,255,.56)}.primary .step-marker i{background:#f0bd83}
  .prescription-arrow{display:grid;place-items:center;color:#c18049;font-size:1.2rem}

  .diagnosis-insight-grid{margin-top:14px;display:grid;grid-template-columns:1.25fr .85fr .72fr;gap:12px}
  .diagnosis-why,.diagnosis-do-not,.diagnosis-rule-card{border:1px solid rgba(66,38,29,.08);border-radius:20px;background:rgba(255,255,255,.55);padding:20px}
  .insight-head{display:flex;justify-content:space-between;gap:12px}.insight-head>div span,.diagnosis-do-not span,.diagnosis-rule-card span{font-size:.62rem;color:#a26a3c;font-weight:800}.insight-head h3{margin:4px 0 0;font-size:.9rem;line-height:1.7}.insight-head b{direction:ltr;color:rgba(66,38,29,.26);font-size:.5rem;letter-spacing:.16em}
  .diagnosis-why>p{margin:12px 0 0;color:#725d54;line-height:2;font-size:.77rem}
  .diagnosis-evidence{margin-top:14px;display:flex;flex-wrap:wrap;gap:7px}.diagnosis-evidence span{display:inline-flex;align-items:center;gap:5px;padding:7px 9px;border-radius:999px;background:#f1e6da;color:#6e554b;font-size:.59rem}.diagnosis-evidence i{font-style:normal;color:#9f6634;font-weight:800}
  .diagnosis-do-not{display:flex;gap:12px;align-items:flex-start;background:#fff8f1}.do-not-icon{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:#f0d8bd;color:#9b5d2c;font-weight:900}.diagnosis-do-not>div:last-child{display:grid;gap:7px}.diagnosis-do-not strong{font-size:.77rem;line-height:1.95}.diagnosis-do-not small{color:#9a857c;font-size:.6rem;line-height:1.8}
  .diagnosis-rule-card{display:grid;align-content:start;gap:7px;background:#f0dfcd}.diagnosis-rule-card strong{font-size:1rem;line-height:1.8}.diagnosis-rule-card small{color:#8c756a;font-size:.62rem;line-height:1.8}

  .diagnosis-feedback{margin-top:26px;padding:24px;border:1px solid rgba(66,38,29,.08);border-radius:24px;background:#fffaf4;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:24px}.feedback-copy span,.diagnosis-followup>div:last-child>span{color:#a16e47;font-size:.62rem;font-weight:700}.feedback-copy h2,.diagnosis-followup h2{margin:4px 0 0;font-size:1.6rem;line-height:1.6}.feedback-copy p{margin:4px 0 0;color:#8a766d;font-size:.67rem}
  .feedback-actions{display:flex;gap:8px}.diagnosis-feedback button{min-height:48px;padding:0 17px;border-radius:999px;font:inherit;font-size:.72rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:12px}.diagnosis-feedback button b{width:24px;height:24px;border-radius:50%;display:grid;place-items:center}.diagnosis-feedback .fixed{border:0;background:#42261d;color:#fff;box-shadow:0 10px 22px rgba(66,38,29,.13)}.diagnosis-feedback .fixed b{background:rgba(255,255,255,.12)}.diagnosis-feedback .not-fixed{border:1px solid rgba(66,38,29,.14);background:#fff;color:#5e4237}.diagnosis-feedback .not-fixed b{background:#f2e5d8;color:#9b6538}
  .diagnosis-followup{margin-top:26px;padding:22px 24px;border-radius:22px;background:#efe2d4;border:1px solid rgba(66,38,29,.06);display:flex;gap:14px;align-items:flex-start}.diagnosis-followup.success{background:#e8efe7;color:#36543d}.followup-icon{width:42px;height:42px;flex:0 0 42px;border-radius:13px;display:grid;place-items:center;background:#42261d;color:#fff;font-size:.65rem;font-weight:800}.success .followup-icon{background:#5f7d64}.diagnosis-followup p{margin:7px 0 0;color:#806c63;font-size:.76rem;line-height:1.9}
  .diagnosis-actions{margin-top:16px;padding-top:16px;border-top:1px solid rgba(66,38,29,.08);display:flex;justify-content:space-between;align-items:center;gap:12px}.diagnosis-actions button,.diagnosis-actions a{min-height:42px;padding:0 15px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:.69rem;font-weight:800}.diagnosis-actions button{border:1px solid rgba(66,38,29,.14);background:transparent;color:#42261d;cursor:pointer}.diagnosis-actions a{background:#42261d;color:#fff}

  @media(max-width:980px){
    .fix-options{grid-template-columns:repeat(2,minmax(0,1fr))}
    .diagnosis-hero{grid-template-columns:1fr}.diagnosis-visual{justify-self:start}
    .prescription-flow{grid-template-columns:1fr}.prescription-arrow{transform:rotate(-90deg);min-height:22px}
    .diagnosis-insight-grid{grid-template-columns:1fr 1fr}.diagnosis-why{grid-column:1/-1}
  }
  @media(max-width:640px){
    .fix-page{padding-top:18px}.fix-progress{margin-bottom:38px}.fix-intro h1{font-size:2.25rem}.fix-options{grid-template-columns:1fr}.fix-option{min-height:220px;display:grid;grid-template-columns:108px minmax(0,1fr);grid-template-rows:auto auto 1fr;column-gap:16px;padding:16px}.fix-option-photo{grid-row:1/4;width:108px;height:108px;margin:0}.fix-option strong{align-self:end}.fix-option small{padding-bottom:20px}.fix-option i{left:16px;bottom:14px}
    .diagnosis-copy h1{font-size:2rem}.diagnosis-visual{width:100%;display:flex;align-items:center;gap:14px}.diagnosis-photo-ring{width:92px;height:92px;margin:0}.diagnosis-visual-copy{text-align:right;margin:0}
    .prescription{padding:16px}.prescription-head{align-items:flex-start;flex-direction:column}.prescription-head small{text-align:right}.prescription-step{min-height:190px;padding:18px}
    .diagnosis-insight-grid{grid-template-columns:1fr}.diagnosis-why{grid-column:auto}
    .diagnosis-feedback{grid-template-columns:1fr}.feedback-actions{width:100%;flex-direction:column}.diagnosis-feedback button{width:100%;justify-content:space-between}.diagnosis-actions{align-items:stretch;flex-direction:column}.diagnosis-actions button,.diagnosis-actions a{justify-content:center}
  }
</style>
