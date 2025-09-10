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

  <h3>Question {question.name} </h3>

  <div class="px-4 text-gray-400 max-w-lg break-words">{studentQuestion.comment}</div>
  <div class="ml-auto flex gap-2">
    {#if !studentQuestion.label}
    <span class="px-3 py-1 flex items-center justify-center border border-gray-300 rounded w-26 text-xs gap-2">
      <TriangleAlert class="w-4" /> review
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
    <span class="px-3 py-1 flex items-center justify-center w-12 text-gray-400">/{question.maxScore}</span>
  </div>
</div>

<Drawer {aid} bind:open={showDrawer} on:scoreChanged={changeQuestion} on:close={onClose} />
