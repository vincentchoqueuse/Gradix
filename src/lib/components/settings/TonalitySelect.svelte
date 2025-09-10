<script lang="ts">
  import { settingsState } from '$lib/stores/settings.svelte.js';
  import { tonalities } from '$lib/data/tonalities';
  import { createEventDispatcher } from 'svelte';
  import { ChevronsUpDown } from '@lucide/svelte';

  const dispatch = createEventDispatcher();
  let open = $state(false);
  let container: HTMLElement;

  function choose(value: string) {
    settingsState.tonality = value;
    const selected = tonalities.find(t => t.value === settingsState.tonality);
    if (selected) {
      settingsState.tonalityDescription = selected.description;
    }
    open = false;
  }

  function clickOutside(node: HTMLElement) {
    function handleClick(e: MouseEvent) {
      if (!node.contains(e.target as Node)) {
        open = false;
      }
    }
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
</script>

<div class="relative inline-block text-left w-full" bind:this={container} use:clickOutside>
  <!-- Bouton du dropdown -->
  <button
    type="button"
    class="inline-flex w-full btn"
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    <span class="w-full">
      {settingsState.tonality}
    </span>
    <ChevronsUpDown class="h-4" />
  </button>

  {#if open}
    <div
      class="absolute left-0 z-10 mt-1 w-full origin-top-left rounded bg-white ring-1 ring-gray-300 focus:outline-none max-h-60 overflow-y-auto"
      role="listbox"
    >
      {#each tonalities as tonality}
        <button
          class="inline-flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          class:bg-gray-100={settingsState.tonality === tonality.value}
          class:text-black={settingsState.tonality === tonality.value}
          role="option"
          aria-selected={settingsState.tonality === tonality.value}
          onclick={() => choose(tonality.value)}
        >
          {tonality.value}: {tonality.description}
        </button>
      {/each}
    </div>
  {/if}
</div>
