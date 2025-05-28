'use server';

/**
 * @fileOverview Generates a quiz with 10 questions based on a given field and topic.
 *
 * - generateQuiz - A function that generates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  field: z.string().describe('The field of study for the quiz (e.g., history, science, literature).'),
  topic: z.string().describe('The specific topic for the quiz (e.g., World War II, quantum physics, Shakespearean sonnets).'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('Multiple choice options for the question.'),
  answer: z.string().describe('The correct answer to the question.'),
});

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(10).describe('An array of 10 quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz with 10 diverse and relevant questions based on the given field and topic.

Field: {{{field}}}
Topic: {{{topic}}}

Each question should have multiple choice options, with one correct answer.

Your output should be a JSON object with a "questions" field, which is an array of 10 quiz questions. Each quiz question should have the following fields:
- question: The quiz question.
- options: Multiple choice options for the question.
- answer: The correct answer to the question.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);
