"use client";

import { useState } from "react";
import { QuizSetupForm } from "@/components/quiz/QuizSetupForm";
import { QuizActive } from "@/components/quiz/QuizActive";
import { QuizResults } from "@/components/quiz/QuizResults";
import { generateQuiz, type GenerateQuizOutput, type GenerateQuizInput } from "@/ai/flows/generate-quiz";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type QuizQuestionType = GenerateQuizOutput["questions"][0];
type QuizState = "setup" | "loading" | "active" | "results" | "error";

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { toast } = useToast();

  const handleStartQuiz = async (field: string, topic: string) => {
    setQuizState("loading");
    setErrorMessage(null);
    try {
      const quizData = await generateQuiz({ field, topic });
      if (quizData && quizData.questions && quizData.questions.length > 0) {
        setQuestions(quizData.questions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizState("active");
      } else {
        throw new Error("Failed to generate quiz questions or no questions returned.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred while generating the quiz.";
      setErrorMessage(errorMsg);
      setQuizState("error");
      toast({
        variant: "destructive",
        title: "Quiz Generation Failed",
        description: errorMsg,
      });
    }
  };

  const handleAnswerSubmit = (selectedOption: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.answer === selectedOption) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizState("results");
    }
  };

  const handlePlayAgain = () => {
    setQuizState("setup");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setErrorMessage(null);
  };

  const renderContent = () => {
    switch (quizState) {
      case "setup":
        return <QuizSetupForm onSubmit={handleStartQuiz} isLoading={false} />;
      case "loading":
        return <QuizSetupForm onSubmit={handleStartQuiz} isLoading={true} />; // Show form with loading state
      case "active":
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
          return (
            <QuizActive
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswerSubmit}
              isSubmitting={false} // Potentially add submitting state if answer check is async
            />
          );
        }
        // Fallback or error if questions are not loaded correctly
        setQuizState("error");
        setErrorMessage("Error: Questions not available for active state.");
        return null; // Error state will render the alert
      case "results":
        return (
          <QuizResults
            score={score}
            totalQuestions={questions.length}
            onPlayAgain={handlePlayAgain}
          />
        );
      case "error":
        // ErrorAlert is shown below this switch in the main return
        return <QuizSetupForm onSubmit={handleStartQuiz} isLoading={false} />; // Allow user to try again
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <div className="w-full max-w-2xl">
        {quizState === 'error' && errorMessage && (
            <Alert variant="destructive" className="mb-8 shadow-md">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
        )}
        {renderContent()}
      </div>
    </main>
  );
}
