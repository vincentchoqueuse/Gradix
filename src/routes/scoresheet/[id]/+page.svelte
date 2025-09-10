<script lang="ts">
    import { scoresheetState, updateScoresheet } from '$lib/stores/scoresheet.svelte';
    import Section from '$lib/components/scoresheet/Section.svelte';
    import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
    import { TriangleAlert, Stamp, ChevronRight } from '@lucide/svelte';

    const { params } = $props<{ params: { id: string } }>();

    let sheet = $derived(scoresheetState.studentScoresheets[params.id]);
    let student = $derived(sheet ? scoresheetState.students[sheet.studentId] : null);
    let exam = $derived(sheet ? scoresheetState.exams[sheet.examId] : null);
    let questionStats = $derived(
    !sheet
        ? { total: 0, completed: 0 }
        : (() => {
            const studentSections = sheet.studentSectionIds
            .map(id => scoresheetState.studentSections[id])
            .filter(Boolean);

            const studentQuestions = studentSections.flatMap(
            section => section.studentQuestionIds
                .map(id => scoresheetState.studentQuestions[id])
                .filter(Boolean)
            );

            return {
            total: studentQuestions.length,
            completed: studentQuestions.filter(
                q => q.label != null && q.label.trim() !== ""
            ).length
            };
        })()
    );


    function changeSheet() {
      updateScoresheet(sheet, true); 
    }

    function changeSheetCurrentDateTime() {
        sheet.date = new Date().toISOString();
        updateScoresheet(sheet, false); 
    }

    function changeSheetComment(){
        updateScoresheet(sheet, false); 
    }



</script>

{#if sheet}
    <header class="custom-header">
        <div class="flex items-center gap-2">
            <div class="header-title">{student.lastName} {student.firstName}</div>
            <div>
                <ChevronRight class="w-4"/>
            </div>
            <span class="text-gray-400">
                {sheet.score} / {exam.maxScore} 
            </span>
            {#if sheet.date}
                <span class="px-2">
                    ({sheet.date})
                </span>
            {/if}
        </div>
        <div class="ml-auto flex gap-2">
            <ProgressIndicator current={questionStats.completed} total={questionStats.total} label="Question" />
            {#if questionStats.completed != questionStats.total }
                <span class="px-3 py-1 flex items-center justify-center border border-gray-300 rounded w-26 text-xs gap-2">
                    <TriangleAlert class="w-4" /> review
                </span>
            {/if}
            <button class="btn" onclick={changeSheetCurrentDateTime} >
                <Stamp class="h-5" />
            </button>
        </div>
    </header>
    <main class="flex-1 overflow-y-auto px-12 py-8">
        <h1>Scoresheet {exam.meta.semester} {exam.meta.course}</h1>
        <div>
        <div class="flex items-center gap-2">
            <h3 class="py-2 font-semibold text-xl">
                Feedback
            </h3>
        </div>
        <textarea
            bind:value={sheet.comment}
            rows="3"
            oninput={changeSheetComment}
            placeholder="Écris ton feedback ici..."
            class="custom-textarea"
        ></textarea>
        </div>
        {#each sheet.studentSectionIds as sid}
        <Section sid={sid} on:scoreChanged={changeSheet} />
        {/each}
    </main>
{:else}
    <div class="flex flex-col items-center justify-center h-screen bg-gray-50 text-lg">
        Import your gradix file first
    </div>
{/if}
