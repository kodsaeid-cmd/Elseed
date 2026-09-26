<script lang="ts">
  let {
    question,
    source
  } = $props<{
    question?: {
      enabled?: boolean;
      key?: string;
      title?: string;
      description?: string;
      options?: { value: string; label: string }[];
    };
    source: string;
  }>();

  let selected = $state('');
  let saving = $state(false);
  let saved = $state(false);

  async function anonymousId() {
    const key = 'elseed_anonymous_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  }

  async function choose(option: { value: string; label: string }) {
    if (!question?.key || saving) return;
    selected = option.value;
    saving = true;

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mode: 'signal',
          anonymousId: await anonymousId(),
          key: question.key,
          value: option.value,
          label: option.label,
          source
        })
      });

      if (response.ok) saved = true;
    } catch {
      saved = false;
    } finally {
      saving = false;
    }
  }
</script>

{#if question?.enabled && question.key && question.title && question.options?.length}
  <section class="article-profile-question">
    <div class="question-copy">
      <span>قهوه و من · یک سؤال کوتاه</span>
      <h2>{question.title}</h2>
      {#if question.description}<p>{question.description}</p>{/if}
    </div>

    <div class="question-options">
      {#each question.options as option}
        <button
          type="button"
          class:selected={selected === option.value}
          disabled={saving}
          onclick={() => choose(option)}
        >
          <span>{option.label}</span>
          <i>{selected === option.value ? '✓' : ''}</i>
        </button>
      {/each}
    </div>

    <div class="question-foot">
      <span>{saved ? 'به پروفایل «قهوه و من» اضافه شد.' : 'جوابت به پروفایل قهوه‌ای تو وصل میشه.'}</span>
      <a href="/coffee-and-me">دیدن قهوه و من</a>
    </div>
  </section>
{/if}

<style>
  .article-profile-question{margin:34px 0;padding:22px;border:1px solid rgba(66,38,29,.09);border-radius:24px;background:linear-gradient(135deg,#fffaf5,#efdfcf);font-family:'Vazirmatn',Tahoma,Arial,sans-serif}
  .question-copy>span{display:block;color:#c27a3a;font-size:.64rem;font-weight:800}.question-copy h2{margin:5px 0 6px;font-size:1.45rem;line-height:1.65}.question-copy p{margin:0;color:#836f66;font-size:.72rem;line-height:1.9}
  .question-options{margin-top:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.question-options button{min-height:54px;padding:0 13px;border:1px solid rgba(66,38,29,.09);border-radius:14px;background:rgba(255,255,255,.7);color:#42261d;font:inherit;font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;text-align:right;transition:.18s ease}.question-options button:hover,.question-options button.selected{border-color:#c27a3a;background:#fff}.question-options i{font-style:normal;width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#ead8c5;color:#8a572f;font-size:.65rem}
  .question-foot{margin-top:14px;padding-top:12px;border-top:1px solid rgba(66,38,29,.08);display:flex;justify-content:space-between;gap:14px;color:#8b776e;font-size:.6rem}.question-foot a{font-weight:800;color:#65463a}
  @media(max-width:600px){.question-options{grid-template-columns:1fr}.question-foot{align-items:flex-start;flex-direction:column}}
</style>
