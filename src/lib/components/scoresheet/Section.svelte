<script lang="ts">
  import Question from './Question.svelte';
  import { createEventDispatcher } from 'svelte';
  import { scoresheetState, updateSection } from '$lib/stores/scoresheet.svelte';

  const dispatch = createEventDispatcher();

  const { sid } = $props<{ sid: string }>(); 

  let studentSection = $derived(scoresheetState.studentSections?.[sid]);
  let section = $derived(scoresheetState.sections?.[studentSection.sectionId]);

  function changeSection() {
      updateSection(studentSection, true); 
      dispatch("scoreChanged");
  }

</script>

{#if studentSection}
<div class="py-2">
  <div class="py-2 flex items-center gap-2 border-b border-gray-200 mb-1">
    <div class="flex items-center gap-2">
      <h2 class="text-lg">{section.title}</h2>
    </div>
    <div class="ml-auto flex gap-2">
      <div class="flex items-center "> Score </div>
      <div class="w-18 py-2 px-2 text-center border border-gray-300 rounded">
        {studentSection.score.toFixed(2)}
      </div>
      <span class="px-3 py-2 flex items-center justify-center w-12 text-gray-400">/{section.maxScore}</span>
    </div>
  </div>
  {#each studentSection.studentQuestionIds as aid}
    <Question aid={aid} on:scoreChanged={changeSection} />
  {/each}
</div>
{/if}