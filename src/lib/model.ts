// src/lib/model.ts

// --- Students ---
export interface Student {
  id: string;        // garder string pour cohérence dans les Records
  lastName: string;
  firstName: string;
  email: string;
}

// --- Exam (flat meta only, no nested sections/questions) ---
export interface ExamMeta {
  semester?: string;
  course?: string;
  evaluationId?: string;
  evaluationDate?: string;
  evaluationDuration?: string;
  teacher?: string;
  group?: string;
  info?: string;
}

export interface Exam {
  id: string;
  meta: ExamMeta;
  maxScore: number;
  normalizedScore: number;
}

// --- Sections & Questions (flat) ---
export interface Section {
  id: string;
  title: string;
  questionIds: string[];
  score: number;
  maxScore: number;
}

export interface Question {
  id: string;
  text: string;
  maxScore: number;
  outcome?: string;
  criterion?: string;
  sectionId: string;
}

// --- Outcomes / Criteria / Levels (flat rubrics) ---
export interface Outcome {
  id: string;
  name: string;
  criterionIds: string[]; 
}

export interface Criterion {
  id: string;
  outcomeId: string;
  text: string;
  levelIds: string[];   
}

export interface Level {
  id: string;
  criterionId: string;
  label: string;
  text: string;
  weight: number;
  color: string;
  critical: boolean;
}

// --- Student-related (mutable) ---
export interface StudentScoresheet {
  id: string;                  // e.g. "ss_<studentId>_<examId>"
  studentId: string;
  examId: string;
  score: number;
  comment: string;
  studentSectionIds: string[];
}

export interface StudentSection {
  id: string;                  // e.g. "ss_<studentId>_<sectionId>"
  studentId: string;
  sectionId: string;
  score: number;
  comment: string;
  studentQuestionIds: string[];
}

export interface StudentQuestion {
  id: string;                  // e.g. "sq_<studentId>_<questionId>"
  studentId: string;
  studentSectionId: string;
  sectionId: string;
  questionId: string;
  score: number;
  color?: string;
  label?: string;
  comment: string;
}

// --- Final dataset (flat) ---
export interface NormalizedData {
  exams: Record<string, Exam>;
  students: Record<string, Student>;
  sections: Record<string, Section>;
  questions: Record<string, Question>;
  studentScoresheets: Record<string, StudentScoresheet>;
  studentSections: Record<string, StudentSection>;
  studentQuestions: Record<string, StudentQuestion>;
  outcomes: Record<string, Outcome>;
  criteria: Record<string, Criterion>;
  levels: Record<string, Level>;
}
