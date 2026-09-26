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
        <div>
          <span class="fix-kicker">تشخیص احتمالی</span>
          <h1>{result.title}</h1>
          <p>{result.short}</p>
        </div>
        <div class="diagnosis-confidence">
          <span>اعتماد تشخیص</span>
          <strong>{result.confidence}</strong>
          <small>{brewLabels[answers.brew as FixAnswers['brew']]} · {problemLabels[answers.problem as FixAnswers['problem']]}</small>
        </div>
      </header>

      <div class="diagnosis-grid">
        <article class="diagnosis-main">
          <span class="diagnosis-label">اول فقط این کار رو بکن</span>
          <h2>{result.firstAction}</h2>
          <p>یک تغییر، یک تست، بعد تصمیم بعدی. پنج چیز را با هم عوض نمی‌کنیم.</p>
          <div class="diagnosis-next">
            <span>اگر جواب نداد</span>
            <p>{result.secondAction}</p>
          </div>
        </article>

        <aside class="diagnosis-why">
          <span>چرا به این رسیدیم؟</span>
          <p>{result.why}</p>
          <div class="diagnosis-evidence">
            {#each result.evidence as item}<span>{item}</span>{/each}
          </div>
        </aside>
      </div>

      <section class="diagnosis-guardrail">
        <div><span>فعلاً دست نزن</span><strong>{result.keepStill}</strong></div>
        <div><span>قاعده EL.SEED</span><strong>هر بار فقط یک متغیر.</strong></div>
      </section>

      {#if feedback === 'idle'}
        <section class="diagnosis-feedback">
          <div><span>بعد از تست برگرد اینجا</span><h2>درست شد یا هنوز نه؟</h2></div>
          <div>
            <button type="button" class="fixed" onclick={() => sendFeedback('fixed')}>درست شد ✓</button>
            <button type="button" class="not-fixed" onclick={() => sendFeedback('not_fixed')}>هنوز درست نشده</button>
          </div>
        </section>
      {:else if feedback === 'fixed'}
        <section class="diagnosis-followup success">
          <span>پس متغیر درست را پیدا کردیم.</span>
          <h2>همین نسخه را برای فنجان بعدی هم تکرار کن.</h2>
          <p>اگر مشکل برگشت، دوباره عیب‌یابی کن تا ببینیم چه چیزی تغییر کرده.</p>
        </section>
      {:else}
        <section class="diagnosis-followup">
          <span>پس یک لایه عمیق‌تر بریم</span>
          <h2>{result.deeperAction}</h2>
          <p>بعد از این تست اگر هنوز مشکل ماند، عیب‌یاب را دوباره با تنظیم جدید اجرا کن.</p>
        </section>
      {/if}

      <section class="diagnosis-actions">
        <button type="button" onclick={restart}>از اول عیب‌یابی کن</button>
        <a href={result.relatedHref}>{result.relatedLabel}<span>←</span></a>
      </section>
    </section>
  {/if}
</main>

<Footer />

<style>
  :global(body){background:#f7f1e8}
  .fix-page{min-height:calc(100vh - 110px);padding:28px 0 72px;color:#42261d}
  .fix-shell{width:min(1120px,calc(100% - 34px));margin:0 auto}
  .fix-topbar{display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:14px}
  .fix-close{width:42px;height:42px;border:1px solid rgba(66,38,29,.13);border-radius:50%;display:grid;place-items:center;color:#5f433a;background:rgba(255,255,255,.48);font-size:1.25rem}
  .fix-brandline{font-size:.63rem;letter-spacing:.2em;color:#a58d81;font-weight:800;direction:ltr}
  .fix-step-count{font-size:.7rem;color:#91796f;direction:ltr}
  .fix-progress{height:3px;background:rgba(66,38,29,.08);margin:16px 0 58px;border-radius:999px;overflow:hidden}
  .fix-progress span{display:block;height:100%;background:#d1833f;border-radius:999px;transition:width .3s ease}
  .fix-intro{text-align:center;max-width:820px;margin:0 auto}
  .fix-kicker{display:inline-block;color:#d1833f;font-size:.66rem;font-weight:900;margin-bottom:10px}
  .fix-intro h1{margin:0;font-size:clamp(2.15rem,5vw,4.4rem);line-height:1.22;letter-spacing:-.045em}
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
  .fix-option strong{font-size:1.04rem;line-height:1.6}.fix-option small{margin-top:8px;color:#8a756c;font-size:.72rem;line-height:1.8;padding-bottom:26px}.fix-option i{position:absolute;left:20px;bottom:16px;font-style:normal;color:#c27a3a;transition:transform .2s ease}.fix-option:hover i{transform:translateX(-4px)}
  .fix-bottom{margin-top:26px;padding-top:18px;border-top:1px solid rgba(66,38,29,.08);display:flex;justify-content:space-between;align-items:center;gap:18px;color:#9b877f;font-size:.68rem}
  .fix-bottom button{border:0;background:transparent;color:#6d5147;font:inherit;font-weight:800;cursor:pointer}
  .diagnosis-shell{padding-top:34px}
  .diagnosis-hero{display:grid;grid-template-columns:minmax(0,1fr) 240px;gap:30px;align-items:end;padding-bottom:30px;border-bottom:1px solid rgba(66,38,29,.11)}
  .diagnosis-hero h1{margin:6px 0 10px;font-size:clamp(2.25rem,5vw,4.9rem);line-height:1.2;letter-spacing:-.05em;max-width:900px}.diagnosis-hero p{margin:0;color:#846f66;font-size:1rem;line-height:2;max-width:720px}
  .diagnosis-confidence{padding:18px;border-radius:18px;background:#efe1d2;display:grid;gap:4px}.diagnosis-confidence span{font-size:.66rem;color:#957c70}.diagnosis-confidence strong{font-size:1.9rem;color:#a86128}.diagnosis-confidence small{font-size:.65rem;color:#765b50;line-height:1.7}
  .diagnosis-grid{margin-top:18px;display:grid;grid-template-columns:1.35fr .65fr;gap:14px}
  .diagnosis-main,.diagnosis-why{border:1px solid rgba(66,38,29,.1);border-radius:24px;background:rgba(255,255,255,.68);padding:28px}
  .diagnosis-main{background:linear-gradient(135deg,#fffaf4,#f1e2d2)}
  .diagnosis-label,.diagnosis-why>span,.diagnosis-next>span{font-size:.65rem;color:#b16c31;font-weight:900}
  .diagnosis-main h2{margin:12px 0 8px;font-size:clamp(1.6rem,3vw,2.7rem);line-height:1.55}.diagnosis-main>p,.diagnosis-why>p{margin:0;color:#806b62;line-height:2;font-size:.88rem}
  .diagnosis-next{margin-top:24px;padding-top:18px;border-top:1px solid rgba(66,38,29,.1)}.diagnosis-next p{margin:5px 0 0;font-size:.9rem;line-height:1.9;font-weight:700}
  .diagnosis-evidence{margin-top:18px;display:flex;flex-wrap:wrap;gap:7px}.diagnosis-evidence span{padding:7px 9px;border-radius:999px;background:#f2e8dc;color:#73594e;font-size:.65rem}
  .diagnosis-guardrail{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:12px}.diagnosis-guardrail>div{padding:18px 20px;border-top:2px solid #d1833f;background:rgba(255,255,255,.45)}.diagnosis-guardrail span{display:block;color:#a16c42;font-size:.62rem}.diagnosis-guardrail strong{display:block;margin-top:6px;font-size:.88rem;line-height:1.8}
  .diagnosis-feedback,.diagnosis-followup{margin-top:42px;padding:26px 0;border-top:1px solid rgba(66,38,29,.1);border-bottom:1px solid rgba(66,38,29,.1)}
  .diagnosis-feedback{display:flex;justify-content:space-between;align-items:center;gap:20px}.diagnosis-feedback span,.diagnosis-followup>span{color:#a98470;font-size:.65rem}.diagnosis-feedback h2,.diagnosis-followup h2{margin:5px 0 0;font-size:1.8rem}.diagnosis-feedback>div:last-child{display:flex;gap:8px}.diagnosis-feedback button{min-height:44px;padding:0 16px;border-radius:999px;font:inherit;font-size:.76rem;font-weight:900;cursor:pointer}.diagnosis-feedback .fixed{border:0;background:#42261d;color:#fff}.diagnosis-feedback .not-fixed{border:1px solid rgba(66,38,29,.16);background:transparent;color:#42261d}
  .diagnosis-followup{padding:26px;border-radius:22px;background:#efe2d4;border:0}.diagnosis-followup.success{background:#e8efe7;color:#36543d}.diagnosis-followup p{margin:8px 0 0;color:#806c63;font-size:.8rem;line-height:1.9}
  .diagnosis-actions{margin-top:22px;display:flex;justify-content:space-between;align-items:center;gap:12px}.diagnosis-actions button,.diagnosis-actions a{min-height:44px;padding:0 16px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:.75rem;font-weight:900}.diagnosis-actions button{border:1px solid rgba(66,38,29,.16);background:transparent;color:#42261d;cursor:pointer}.diagnosis-actions a{background:#42261d;color:#fff}
  @media(max-width:900px){.fix-options{grid-template-columns:repeat(2,minmax(0,1fr))}.diagnosis-hero,.diagnosis-grid{grid-template-columns:1fr}.diagnosis-confidence{max-width:300px}.diagnosis-guardrail{grid-template-columns:1fr}}
  @media(max-width:560px){.fix-page{padding-top:18px}.fix-progress{margin-bottom:38px}.fix-intro h1{font-size:2.25rem}.fix-options{grid-template-columns:1fr}.fix-option{min-height:220px;display:grid;grid-template-columns:108px minmax(0,1fr);grid-template-rows:auto auto 1fr;column-gap:16px;padding:16px}.fix-option-photo{grid-row:1/4;width:108px;height:108px;margin:0}.fix-option strong{align-self:end}.fix-option small{padding-bottom:20px}.fix-option i{left:16px;bottom:14px}.fix-bottom,.diagnosis-feedback,.diagnosis-actions{align-items:flex-start;flex-direction:column}.diagnosis-feedback>div:last-child{width:100%;flex-direction:column}.diagnosis-feedback button{width:100%}.diagnosis-main,.diagnosis-why{padding:20px}}
</style>
