<script lang="ts">
  let { text = '' } = $props<{ text?: string }>();

  function parts(value: string) {
    const result: Array<{ text: string; strong: boolean }> = [];
    const source = String(value ?? '');
    const pattern = /\*\*(.+?)\*\*/g;
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(source))) {
      if (match.index > last) {
        result.push({ text: source.slice(last, match.index), strong: false });
      }
      result.push({ text: match[1], strong: true });
      last = match.index + match[0].length;
    }

    if (last < source.length) {
      result.push({ text: source.slice(last), strong: false });
    }

    return result.length ? result : [{ text: source, strong: false }];
  }

  const segments = $derived(parts(text));
</script>

{#each segments as segment}
  {#if segment.strong}
    <strong>{segment.text}</strong>
  {:else}
    {segment.text}
  {/if}
{/each}
