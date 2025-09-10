// src/lib/stores/scoresheet.svelte.ts
import { openDB } from "idb";
import type { NormalizedData } from "$lib/model";
import type {
  Student,
  Exam,
  Section,
  Question,
  Outcome,
  Criterion,
  Level,
  StudentScoresheet,
  StudentSection,
  StudentQuestion,
} from "$lib/model";

// --- Reactive state ---
export const scoresheetState = $state({
  students: {} as Record<string, Student>,
  exams: {} as Record<string, Exam>,
  sections: {} as Record<string, Section>,
  questions: {} as Record<string, Question>,
  outcomes: {} as Record<string, Outcome>,
  criteria: {} as Record<string, Criterion>,
  levels: {} as Record<string, Level>,
  studentScoresheets: {} as Record<string, StudentScoresheet>,
  studentSections: {} as Record<string, StudentSection>,
  studentQuestions: {} as Record<string, StudentQuestion>,
});

// --- IndexedDB instance ---
let db: Awaited<ReturnType<typeof openDB>> | null = null;

/**
 * Ensure we only store plain objects (no proxies)
 */
function toRaw<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Initialize DB and load all tables into memory
 */
export async function initScoresheetDB() {
  db = await openDB("scoresheetDB", 3, {
    upgrade(db) {
      const stores = [
        "students",
        "exams",
        "sections",
        "questions",
        "outcomes",
        "criteria",
        "levels",
        "studentScoresheets",
        "studentSections",
        "studentQuestions",
      ];

      // Reset + recreate all stores with keyPath = "id"
      for (const store of stores) {
        if (db.objectStoreNames.contains(store)) {
          db.deleteObjectStore(store);
        }
        db.createObjectStore(store, { keyPath: "id" });
      }
    },
  });

  // Load all tables into memory
  for (const table of [
    "students",
    "exams",
    "sections",
    "questions",
    "outcomes",
    "criteria",
    "levels",
    "studentScoresheets",
    "studentSections",
    "studentQuestions",
  ] as const) {
    const all = await db.getAll(table);
    for (const obj of all) {
      scoresheetState[table][obj.id] = obj;
    }
  }
  return db;
}

/**
 * Update a StudentQuestion (no score cascade)
 */
export async function updateQuestion(updatedQ: StudentQuestion) {
  if (!db) return;

  scoresheetState.studentQuestions[updatedQ.id] = updatedQ;
  await db.put("studentQuestions", toRaw(updatedQ));
}

/**
 * Update + persist a StudentSection
 */
export async function updateSection(
  section: StudentSection,
  shouldUpdateScore: boolean = false
) {
  if (!db) return;

  if (shouldUpdateScore) {
    section.score = section.studentQuestionIds
      .map((qid) => scoresheetState.studentQuestions[qid])
      .reduce((sum, q) => sum + (q?.score || 0), 0);
  }

  scoresheetState.studentSections[section.id] = section;
  await db.put("studentSections", toRaw(section));
}

/**
 * Update + persist a StudentScoresheet
 */
export async function updateScoresheet(
  sheet: StudentScoresheet,
  shouldUpdateScore: boolean = false
) {
  if (!db) return;

  if (shouldUpdateScore) {
    sheet.score = sheet.studentSectionIds
      .map((sid) => scoresheetState.studentSections[sid])
      .reduce((sum, s) => sum + (s?.score || 0), 0);
  }

  scoresheetState.studentScoresheets[sheet.id] = sheet;
  await db.put("studentScoresheets", toRaw(sheet));
}

/**
 * Import full dataset into memory + DB
 */
export async function importData(data: NormalizedData) {
  if (!db) return;

  for (const table of [
    "students",
    "exams",
    "sections",
    "questions",
    "outcomes",
    "criteria",
    "levels",
    "studentScoresheets",
    "studentSections",
    "studentQuestions",
  ] as const) {
    // Clear memory
    Object.keys(scoresheetState[table]).forEach((k) => delete scoresheetState[table][k]);
    // Clear DB
    await db.clear(table);

    // Insert records
    const records = data[table] || {};
    for (const obj of Object.values(records)) {
      scoresheetState[table][obj.id] = obj;
      await db.put(table, toRaw(obj));
    }
  }
}

/**
 * Export current state as JSON string
 */
export function exportData(): NormalizedData {
  const data: NormalizedData = {
    students: scoresheetState.students,
    exams: scoresheetState.exams,
    sections: scoresheetState.sections,
    questions: scoresheetState.questions,
    outcomes: scoresheetState.outcomes,
    criteria: scoresheetState.criteria,
    levels: scoresheetState.levels,
    studentScoresheets: scoresheetState.studentScoresheets,
    studentSections: scoresheetState.studentSections,
    studentQuestions: scoresheetState.studentQuestions,
  };
  return data;
}
