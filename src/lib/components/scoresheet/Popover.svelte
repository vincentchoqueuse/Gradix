<script>
  import { fade } from 'svelte/transition';

  let { children, trigger = 'click', content } = $props();
  let showPopover = $state(false);
  let popoverRef = $state(null);
  let buttonRef = $state(null);
  let isDisabled = $derived((content?.length == 0));

  $effect(() => {
    if (isDisabled) return; 
    const handleClickOutside = (event) => {
      if (popoverRef && !popoverRef.contains(event.target) && !buttonRef.contains(event.target)) {
        showPopover = false;
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  function togglePopover() {
    if (isDisabled) return;
    showPopover = !showPopover;
  }
</script>


<div bind:this={buttonRef} class="relative inline-block">

  <button
    class="btn w-10"
    class:opacity-50={isDisabled}
    class:cursor-not-allowed={isDisabled}
    onclick={() => trigger === 'click' && togglePopover()}
    onmouseenter={() => trigger === 'hover' && !isDisabled && (showPopover = true)}
    onmouseleave={() => trigger === 'hover' && !isDisabled && (showPopover = false)}
    aria-label="open pop-up"
    aria-expanded={showPopover}
    aria-haspopup="true"
    aria-disabled={isDisabled}
  >
  {@render children()}
  </button>
  {#if showPopover && !isDisabled}
    <div
      bind:this={popoverRef}
      class="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 z-50 w-48 break-words shadow-lg rounded px-2 py-1 text-xs bg-gray-800 text-white"
    >
      {content}
    </div>
  {/if}
</div>
