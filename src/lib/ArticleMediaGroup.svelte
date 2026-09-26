<script lang="ts">
  let { items = [] } = $props<{ items?: Array<Record<string, any>> }>();
</script>

{#if items.length}
  <figure class:media-gallery={items.length > 1} class="article-media-group">
    {#each items as item}
      <div class="article-media-item">
        {#if item.media_type === 'video'}
          <video
            src={item.url}
            controls
            playsinline
            preload="metadata"
            aria-label={item.placement_alt || item.alt_text || item.name || 'ویدئوی مقاله'}
          ></video>
        {:else}
          <img
            src={item.url}
            alt={item.placement_alt || item.alt_text || item.name || ''}
            loading="lazy"
            decoding="async"
          />
        {/if}

        {#if item.caption}
          <figcaption>{item.caption}</figcaption>
        {/if}
      </div>
    {/each}
  </figure>
{/if}

<style>
  .article-media-group{
    margin:28px 0 34px;
    display:grid;
    gap:12px;
  }
  .article-media-group.media-gallery{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
  .article-media-item{
    min-width:0;
  }
  .article-media-item img,
  .article-media-item video{
    display:block;
    width:100%;
    max-height:640px;
    border-radius:18px;
    background:#e9e0d5;
    object-fit:cover;
    box-shadow:0 14px 34px rgba(62,39,32,.06);
  }
  .article-media-item video{
    aspect-ratio:16/9;
  }
  .article-media-item figcaption{
    padding:8px 4px 0;
    color:rgba(62,39,32,.52);
    font-size:11px;
    line-height:1.8;
  }
  @media(max-width:680px){
    .article-media-group.media-gallery{grid-template-columns:1fr}
    .article-media-item img,.article-media-item video{border-radius:14px}
  }
</style>
