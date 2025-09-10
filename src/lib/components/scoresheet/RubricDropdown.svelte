<script lang="ts">
  import Indicator from '$lib/components/scoresheet/Indicator.svelte';
  import { createEventDispatcher } from 'svelte';
  import { ChevronsUpDown } from '@lucide/svelte';

  const { levels, selected, color} = $props<{levels?: any[]; selected?: string; color?: string;}>();
  const dispatch = createEventDispatcher<{
    level_selected: { index: number; label: string };
  }>();
  const keyMap: Record<string, number> = {
    '1': 0, '&': 0,
    '2': 1, 'é': 1,
    '3': 2, '"': 2,
    '4': 3, "'": 3,
    '5': 4, '(': 4,
    '6': 5, '§': 5, '-': 5, // selon config
    '7': 6, 'è': 6,
  };

  let open = $state(false);
  let container: HTMLElement;

  function choose(level) {
    dispatch('select', { level });
    open = false;
  }


  function handleKeydown(e: KeyboardEvent) {
    if (open)
    {
      const idx = keyMap[e.key];
      if (idx !== undefined && levels && levels[idx]) {
        e.preventDefault();
        choose(levels[idx]);
      }
    }
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

<div class="relative inline-block text-left text-sm" bind:this={container} use:clickOutside>
  <button
    type="button"
    class="inline-flex w-52 btn h-10"
    aria-haspopup="listbox"
    aria-expanded={open}
    tabindex="0"
    onkeydown={handleKeydown} 
    onclick={() => (open = !open)}
  >
    {#if selected}
      <Indicator color={color} /> <div class="w-full">{selected}</div>
    {:else}
      <div class="w-full">Choose criterion…</div>
    {/if}
    <ChevronsUpDown class="h-4" />
  </button>
  {#if open}
    <div
      class="absolute right-0 z-10 mt-1 w-52 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none max-h-48 overflow-y-auto"
      role="listbox" 
    >
      {#each levels as level}
        <button
          class="inline-flex w-full justify-between items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer {selected === level.label ? 'bg-gray-200' : ''}"
          class:aria-selected={selected === level.label}
          role="option"
          aria-selected={selected === level.label}
          onclick={() => choose(level)}
        >
          <Indicator color={level.color} /> {level.label}
          <span class="w-4"></span>
        </button>
      {/each}
    </div>
    
  {/if}
</div>

