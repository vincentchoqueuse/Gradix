<script lang="ts">
    import Drawer from './Drawer.svelte';
    import RubricDropdown from '$lib/components/scoresheet/RubricDropdown.svelte'
    import Indicator from '$lib/components/scoresheet/Indicator.svelte';
    import { createEventDispatcher } from "svelte";
    import { scoresheetState, updateQuestion} from '$lib/stores/scoresheet.svelte';
    import { getLevelsForCriterion } from '$lib/utils/scoresheet.ts';
    import { Settings2, Square, SquareCheck, TriangleAlert } from '@lucide/svelte';
    
    const { aid } = $props<{ aid: string }>();
    const dispatch = createEventDispatcher(); 
    let showDrawer = $state(false);

    let studentQuestion = $derived(scoresheetState.studentQuestions?.[aid]);
    let question = $derived(scoresheetState.questions?.[studentQuestion.questionId]);
    let criterion = $derived(scoresheetState.criteria?.[question.criterionId]);

    function changeQuestion() {
      updateQuestion(studentQuestion); 
      dispatch("scoreChanged");
    }
    
    function onClose()
    {
      showDrawer=false;
    }

    let levels = $derived(getLevelsForCriterion(criterion.id));

</script>

<div class="flex items-center justify-between gap-2 py-2">

  <h3 class="w-32">Question {question.name} </h3>

  <div class="px-2 text-gray-400 w-96">
    <div class="break-words whitespace-normal">
      {studentQuestion.comment}
    </div>
  </div>
  <div class="ml-auto flex items-center  gap-2">
    {#if !studentQuestion.label}
    <span class="px-1 h-5 flex items-center justify-center rounded px-3 text-xs text-white bg-yellow-500">
      review
    </span>
    {/if}
    
    {#if criterion}
      <RubricDropdown
        levels={levels}
        maxScore={question.maxScore}
        selected={studentQuestion.label}
        color={studentQuestion.color}
        on:select={(e) => {
          const level = e.detail.level;
          studentQuestion.score = level.weight * question.maxScore;
          studentQuestion.label = level.label;
          studentQuestion.color = level.color;
          changeQuestion();
        }}
      />
    {/if}
    <button
      class="btn"
      onclick={() => (showDrawer = true)}
      >
      <Settings2 class="h-4" alt="edit" />
    </button>
    <input
      type="number"
      min="0"
      max={question.maxScore}
      step="0.25"
      bind:value={studentQuestion.score}
      oninput={changeQuestion}
      class="w-18 custom-input"
    />
    <span class="px-3 py-1 flex items-center w-12 text-gray-400">/{question.maxScore}</span>
  </div>
</div>

<Drawer {aid} bind:open={showDrawer} on:scoreChanged={changeQuestion} on:close={onClose} />
