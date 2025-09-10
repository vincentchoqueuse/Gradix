import type { Level } from "$lib/model";
import { scoresheetState } from "$lib/stores/scoresheet.svelte";

export function getComparison(aid: string, query: string = "") {
  const sq = scoresheetState.studentQuestions[aid];
  if (!sq) return [];
  const q = scoresheetState.questions[sq.questionId];
  if (!q) return [];
  const search = query.toLowerCase().trim();

  return Object.values(scoresheetState.studentQuestions)
    .filter((a) => a && a.questionId === q.id && a.id !== aid)
    .map((a) => {
      const student = scoresheetState.students[a.studentId];
      return {
        studentName: `${student.lastName} ${student.firstName}`,
        score: a.score || 0,
        comment: a.comment || "",
        max: q.maxScore,
        label: a.label || "",
        color: a.color || "#999",
      };
    })
    .filter((c) => !search || c.studentName.toLowerCase().includes(search))
    .sort((a, b) => b.score - a.score);
}

export function getLevelsForCriterion(critId: string): Level[] {
  const crit = scoresheetState.criteria[critId];
  if (!crit) return [];
  return crit.levelIds.map((id: string) => scoresheetState.levels[id]);
}


