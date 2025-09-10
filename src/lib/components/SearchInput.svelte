<script lang="ts">
  import { Search } from '@lucide/svelte';
  export let placeholder: string = "Find...";
  export let value: string = "";
  export let bgColor: string = "bg-gray-200";
  
</script>

<div class="relative">
  <!-- Icône -->
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Search class="h-4" />
  </div>
  <input
    type="text"
    bind:value
    {placeholder}
    class="w-full btn-search {bgColor}"
  />
</div>
