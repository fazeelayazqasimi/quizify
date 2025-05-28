Quizify Application - Quick Overview (Made in 2 Days)

Here’s a concise breakdown of the Quizify project I built in just 2 days, highlighting its core features and structure:

🧠 App Purpose
AI-powered quiz generator based on user’s field of study and topic.
Uses Google AI via Genkit to dynamically create questions.

🚀 User Flow
Setup Screen – User enters field & topic.
Loading State – Quiz is generated using AI.
Quiz Mode – One question at a time, user selects answers.
Results Screen – Final score shown.
Play Again – Option to restart with a new quiz.
Error Handling – Friendly error messages if something fails.

⚛️ Component Structure (React)
QuizPage.tsx – Manages full quiz lifecycle & state.
QuizSetupForm.tsx – Handles user input form.
QuizActive.tsx – Displays questions & options.
QuizResults.tsx – Shows results and restart option.

🤖 AI Quiz Generation
User input is passed to generateQuiz() in generate-quiz.ts.
Uses Genkit + Google AI for quiz creation.
Returns an array of MCQs with correct answers.

🔧 State Management
quizState: setup, loading, active, results, error
questions: AI-generated questions
currentQuestionIndex: Track current question
score: User's correct answers count
errorMessage, errorTitle: For handling and displaying errors

⚠️ Error Handling
try...catch during AI call
Friendly messages & Toast notifications using useToast
Displays an error screen if needed

📡 API Calls
One main API-like flow: generateQuiz
Triggered on form submission
Sends user’s input to AI, receives quiz content

🎯 Key Interactions
User submits topic ➝ Quiz starts
User answers questions ➝ Score updates
User finishes quiz ➝ Results shown
User clicks "Play Again" ➝ App resets

🛠️ Tech Used
React + TypeScript
Genkit
Google AI Model
TailwindCSS (if styling is used)

