<script lang="ts">
    const { current, total, label } = $props<{
        current: number;
        total: number;
        label?: string;
    }>();

  let percentage = $derived(total > 0 ? Math.min((current / total) * 100, 100) : 0)
</script>

<div class="w-full space-y-2 px-2">
  <!-- Label -->
  <div class="flex justify-between text-sm text-gray-700">
    <span>{label} {current} / {total}</span>
  </div>

  <!-- Progress bar -->
  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    {#if current === total}
      <div class="h-2 rounded-full duration-300 bg-black" style="width: {percentage}%;"></div>
    {:else}
      <div class="bg-yellow-500 h-2 rounded-full duration-300" style="width: {percentage}%;"></div>
    {/if}
  </div>
</div>
