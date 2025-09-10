<script lang="ts">
  import { Menu, Trash, Upload, Download } from "@lucide/svelte";
  import { clickOutside } from "$lib/actions/clickOutside";
  import { scoresheetState, importData, exportData } from '$lib/stores/scoresheet.svelte';
  import type { NormalizedData } from '$lib/model';
  import { goto } from '$app/navigation';

  let open = $state(false);
  let fileInput: HTMLInputElement;

  function toggle() {
    open = !open;
  }

  async function handleImport(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    goto('/');
    const text = await file.text();
    const data: NormalizedData = JSON.parse(text);
    await importData(data);
    input.value = "";
  }

  function doClear() {
    goto('/');
    scoresheetState.students = {};
    scoresheetState.exams = {};
    scoresheetState.sections = {};
    scoresheetState.questions = {};
    scoresheetState.outcomes = {};
    scoresheetState.criteria = {};
    scoresheetState.levels = {};
    scoresheetState.studentScoresheets = {};
    scoresheetState.studentSections = {};
    scoresheetState.studentQuestions = {};
    open = false;
  }

  function doImport() {
    fileInput.click(); 
    open = false;
  }

  function doExport() {
    const data: NormalizedData = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scoresheet.json"; // 📥 nom du fichier
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    open = false;
  }
</script>

<div class="relative inline-block text-left" use:clickOutside={() => open = false}>
  <button
    class="p-2 rounded-lg hover:bg-gray-100 focus:outline-none cursor-pointer"
    onclick={toggle}
    aria-label="Menu"
  >
    <Menu class="w-6 h-6 text-gray-700" />
  </button>

  {#if open}
    <div
      class="absolute right-0 mt-2 w-48 origin-top-right rounded bg-white border border-gray-200 z-50"
    >
      <div class="py-1">
        <button
          class="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          onclick={doClear}
        >
          <Trash class="w-4 h-4" />
          Clear
        </button>

        <button
          class="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          onclick={doImport}
        >
          <Upload class="w-4 h-4" />
          Import
        </button>

        <button
          class="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          onclick={doExport}
        >
          <Download class="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  {/if}
</div>

<!-- input caché, en dehors du bouton -->
<input
  type="file"
  accept="application/json"
  bind:this={fileInput}
  onchange={handleImport}
  class="hidden"
/>
