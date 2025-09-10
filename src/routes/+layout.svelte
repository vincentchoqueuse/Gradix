<script lang="ts">
  import '../app.css';
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { initScoresheetDB } from "$lib/stores/scoresheet.svelte";
  import { onMount } from "svelte";

  let ready = $state(false);
  let sidebarOpen = false;
  let { children } = $props();

  onMount(async () => {
    await initScoresheetDB();
    ready = true;
  });
</script>

{#if ready}
<div class="flex h-screen">
  <Sidebar open={sidebarOpen} />
  <div class="flex-1 flex flex-col bg-white">
      {@render children()}
  </div>
</div>
{/if}