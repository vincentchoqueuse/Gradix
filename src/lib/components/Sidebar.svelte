<script lang="ts">
  import SearchInput from "$lib/components/SearchInput.svelte";
  import Menu from "$lib/components/Menu.svelte";
  import { BookOpenText, TriangleAlert, File, Settings } from '@lucide/svelte';
  import { scoresheetState } from '$lib/stores/scoresheet.svelte';
  import { page } from '$app/stores';

  const { open = true } = $props<{ open: boolean }>();

  let search = $state("");

  let filteredScoresheets = $derived.by(() => {
    const sheets = scoresheetState.studentScoresheets || {};
    const students = scoresheetState.students || {};
    const query = search.toLowerCase().trim();
    const filtered = Object.values(sheets).filter(sheet => {
      const student = students[sheet.studentId];
      return student &&
             `${student.firstName} ${student.lastName}`.toLowerCase().includes(query);
    });

    return filtered.sort((a, b) => {
      const studentA = students[a.studentId];
      const studentB = students[b.studentId];

      if (studentA.lastName < studentB.lastName) return -1;
      if (studentA.lastName > studentB.lastName) return 1;

      if (studentA.firstName < studentB.firstName) return -1;
      if (studentA.firstName > studentB.firstName) return 1;

      return 0;
    });
  });
</script>

<div class="h-screen w-64 p-4 flex flex-col bg-gray-50 text-sm border-r border-gray-200">
  <div class="flex items-center gap-2 mb-4">
    <BookOpenText />
    <h2 class="text-xl font-semibold">GRADIX</h2>
    <div class="ml-auto">
      <Menu />
    </div>
  </div>

  <div class="py-4">
    <SearchInput bind:value={search} placeholder="Find a scoresheet..." />
  </div>
  <nav class="flex-1 space-y-2 overflow-y-auto mb-2">
    <h3 class="px-2 text-gray-400 text-xs font-semibold">Scoresheet List ({filteredScoresheets.length})</h3>
    {#each filteredScoresheets as sheet}
    <a
      href="/scoresheet/{sheet.id}"
      class="m-0 flex items-center justify-between gap-2 block p-2 rounded cursor-pointer transition text-gray-700 hover:bg-gray-200
        { $page.url.pathname === `/scoresheet/${sheet.id}`
          ? 'bg-gray-200'
          : '' }"
    >
      <div class="flex items-center gap-2">
        <File class="h-4" />
        <span class="truncate w-36">
          {scoresheetState.students[sheet.studentId].lastName} {scoresheetState.students[sheet.studentId].firstName}
        </span>
      </div>
      <div class="flex justify-end">
        {#if !sheet.date}
        <span
          class="inline-block w-2 h-2 rounded-full shrink-0 bg-yellow-500 "
          ></span>
        {/if}
      </div>
    </a>
    {/each}
  </nav>

  <div class="border-t border-gray-200 pt-4">
    <a
      href="/settings"
      class="m-0 flex items-center justify-between gap-2 block p-2 rounded cursor-pointer transition hover:bg-gray-200
        { $page.url.pathname === `/settings` ? 'bg-gray-200 ' : '' }"
    >
      <div class="flex items-center gap-2">
        <Settings class="h-4" />
        <span >
          Settings
        </span>
      </div>
    </a>
  </div>
</div>
