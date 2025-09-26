<script lang="ts">
  import SearchInput from "$lib/components/SearchInput.svelte";
  import Indicator from './Indicator.svelte';
  import Popover from './Popover.svelte';
  import ollamaIcon from '$lib/assets/ollama.svg';
  import { scoresheetState, updateQuestion } from '$lib/stores/scoresheet.svelte';
  import { getComparison } from "$lib/utils/scoresheet";
  import { settingsState } from '$lib/stores/settings.svelte';
  import { createEventDispatcher } from 'svelte';
  import { EllipsisVertical, Copy, Trash, X, ChevronRight } from '@lucide/svelte';

  const { aid, open } = $props<{ aid: string; open: boolean }>();
  const dispatch = createEventDispatcher();

  let search = $state("");
  let loading = false;
  let studentQuestion = $derived(scoresheetState.studentQuestions?.[aid]);
  let question = $derived(studentQuestion ? scoresheetState.questions?.[studentQuestion.questionId] : null);
  let criterion = $derived(question ? scoresheetState.criteria?.[question.criterionId] : null);
  let comparison = $derived(getComparison(aid, search));

  async function improveFeedback() {
    if (!studentQuestion?.comment) return;
    loading = true;
    try {
      const context = `**Contexte** :
        - *Question posée* : "${question.text}"
        - *Critères d'évaluation* : "${criterion.name}" (Description : "${criterion.text}")
        - *Score obtenu* : ${studentQuestion.score}/${question.maxScore}
        - *Commentaire initial* : "${studentQuestion.comment}"
        `;
      const prompt = `${context}\n\n${settingsState.prompt}\n\n- * Tonalité à utiliser *: ${settingsState.tonalityDescription}`;
      const res = await fetch(`${settingsState.ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3",
          prompt: prompt,
          stream: false
        })
      });
      const data = await res.json();
      studentQuestion.comment = data.response;
      changeQuestionComment();
    } catch (err) {
      console.error("Impossible de contacter Ollama");
    } finally {
      loading = false;
    }
  }


  function applyLevel(label:string, color: string, score: string, comment?: string) {
    studentQuestion.score = score;
    studentQuestion.label = label;
    studentQuestion.color = color;
    if (comment !== undefined) studentQuestion.comment = comment;
    dispatch("scoreChanged");
  }

  function changeQuestionComment() {
    updateQuestion(studentQuestion);
  }

  function changeQuestionScore() {
    dispatch("scoreChanged");
  }

  function close() {
    dispatch("close");
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
    role="button"
    tabindex="0"
    onclick={close}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && close()}
  >
  </div>
{/if}

<!-- Drawer -->
<div
  class="fixed top-0 right-0 h-screen w-1/2 bg-white z-50 transform transition-transform duration-300"
  class:translate-x-0={open}
  class:translate-x-full={!open}
  inert={!open}
>
  <!-- Header -->
  <div class="custom-header">
    <div class="flex gap-2 items-center">
      <h3 class="header-title">Detail</h3>
      <ChevronRight class="w-4" />
      {#if studentQuestion.label}
        <div class="inline-flex w-48 justify-between items-center rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-700">
          <Indicator color={studentQuestion.color} />
          <span>{studentQuestion.label}</span>
          <span></span>
        </div>
      {:else}
        <div class="inline-flex w-48 justify-between items-center rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-700">
          <Indicator color='#FFFFFF' />
          <span>Not Assigned</span>
          <span></span>
        </div>

      {/if}
      <div class="flex items-center gap-1 mr-4">
        <input
          type="number"
          min="0"
          max={question?.maxScore}
          step="0.25"
          bind:value={studentQuestion.score}
          oninput={changeQuestionScore}
          class="custom-input"
        />
        <span class="px-3 py-2 flex w-12 text-gray-400">/{question.maxScore}</span>
      </div>
    </div>
    <div>
      <button class="btn border-none" onclick={close} aria-label="close">
        <X class="h-5"  />
      </button>
    </div>
  </div>

  <!-- Content -->
  <div class="overflow-y-auto h-[calc(100%-64px)] py-4 px-8 space-y-4">
    <!-- Feedback -->
    <div>
      <div class="flex items-center justify-between gap-4 py-1">
        <h3 class="py-2">Feedback</h3>
        <div class="flex items-center gap-2">
          <Popover content={question.text} trigger="click">
            <EllipsisVertical class="h-5 w-4" />
          </Popover>
          <button class="relative group btn" onclick={() => studentQuestion.comment=""} aria-label="clear content">
            <Trash class="h-5 w-4" />
          </button>
          <button
            class="px-3 py-2 rounded border border-gray-300 text-sm hover:bg-gray-200 cursor-pointer"
            onclick={improveFeedback}
          >
            <img src={ollamaIcon} class="h-5 w-5" alt="ollamaIcon"/>
          </button>
        </div>
      </div>
      <textarea
        bind:value={studentQuestion.comment}
        oninput={changeQuestionComment}
        rows="3"
        placeholder="Écris ton feedback ici..."
        class="custom-textarea"
      ></textarea>
    </div>

    <!-- Criterion grid -->
    {#if criterion}
      <div>
        <div class="flex items-center justify-between gap-4 py-1">
          <h3 class="py-2">
            Criterion Grid ({criterion.levelIds.length})
          </h3>
          <div class="flex items-center gap-2">
            <Popover content={criterion.text} trigger="click">
              <EllipsisVertical class="h-5 w-4" />
            </Popover>
          </div>
        </div>
        <div class="space-y-1 border rounded border-gray-300 p-2 max-h-64 overflow-y-auto">
          {#each criterion.levelIds.map(id => scoresheetState.levels[id]) as level}
            <div class="flex items-center gap-2 py-1 px-2 text-sm">
              <div class="flex items-center gap-2 flex-1">
                <Indicator color={level.color} />
                <div class="text-gray-700 text-truncate">{level.label}</div>
              </div>
              <div class="flex text-xs flex-1 px-2 text-gray-500 w-full">{level.text}</div>
              <div class="flex items-center gap-2 justify-end ml-auto w-32">
                <span class="text-gray-500 px-2">
                  {level.weight * question.maxScore} pts
                </span>
                <button
                  class="btn w-10"
                  onclick={() => applyLevel(level.label, level.color, level.weight*question.maxScore)}
                >
                  <Copy class="h-5 w-4" />
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div>
      <div class="flex items-center justify-between">
        <h3 class="py-4 w-1/2">Scoresheet Comparison ({comparison.length})</h3>
        <SearchInput bind:value={search} placeholder="Find Student..." class="w-64" bgColor="bg-gray-100" />
      </div>
  
      <div class="space-y-1 border rounded border-gray-300 p-2 max-h-48 overflow-y-auto">
        {#each comparison as c}
          <div class="flex items-center gap-2 py-1 px-2 text-sm">
            <div class="flex items-center gap-2 flex-1">
              <Indicator color={c.color} />
              <span class="text-gray-700">{c.studentName}</span>
            </div>
            <div class="flex text-xs flex-1 px-2 text-gray-500 w-full">{c.comment}</div>
            <div class="flex items-center gap-2 justify-end ml-auto w-32">
              <span class="text-gray-500">{c.score} pts</span>
              <button
                    class="btn w-10"
                    onclick={() => applyLevel(c.label, c.color, c.score, c.comment)}
                  >
                  <Copy class="h-5 w-4" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
