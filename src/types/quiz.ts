// Using types directly from the AI flow for consistency.
// This file can be used for additional client-side specific types if needed in the future.

// Example: If you needed a client-side specific type that wraps or extends the AI output.
/*
import type { GenerateQuizOutput } from "@/ai/flows/generate-quiz";

export type ClientQuizQuestion = GenerateQuizOutput["questions"][0] & {
  userSelectedOption?: string;
  isCorrect?: boolean;
};

export type ClientQuiz = {
  id: string;
  title: string;
  questions: ClientQuizQuestion[];
  score?: number;
  status: 'not-started' | 'in-progress' | 'completed';
};
*/

// For now, we directly use GenerateQuizOutput and its nested types from:
// import type { GenerateQuizOutput } from "@/ai/flows/generate-quiz";
// So, this file can remain empty or be used for future client-specific types.
export {};
