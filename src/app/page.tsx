
"use client";

import { useState } from "react";
import { QuizSetupForm } from "@/components/quiz/QuizSetupForm";
import { QuizActive } from "@/components/quiz/QuizActive";
import { QuizResults } from "@/components/quiz/QuizResults";
import { generateQuiz, type GenerateQuizOutput, type GenerateQuizInput } from "@/ai/flows/generate-quiz";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Zap } from "lucide-react"; // Added Zap for AI related errors

type QuizQuestionType = GenerateQuizOutput["questions"][0];
type QuizState = "setup" | "loading" | "active" | "results" | "error";

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string>("Error");

  const { toast } = useToast();

  const handleStartQuiz = async (field: string, topic: string) => {
    setQuizState("loading");
    setErrorMessage(null);
    setErrorTitle("Error");
    try {
      const quizData = await generateQuiz({ field, topic });
      if (quizData && quizData.questions && quizData.questions.length > 0) {
        setQuestions(quizData.questions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizState("active");
      } else {
        // This case might happen if the AI returns an empty questions array successfully.
        throw new Error("The AI successfully generated a response, but it contained no questions. Please try a different topic or field.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      let errorMsg = "An unknown error occurred while generating the quiz. Please try again.";
      let specificErrorTitle = "Quiz Generation Failed";

      if (error instanceof Error) {
        if (error.message.includes("503") || error.message.toLowerCase().includes("overloaded") || error.message.toLowerCase().includes("service unavailable")) {
          errorMsg = "The AI service is currently busy or unavailable. Please wait a moment and try again.";
          specificErrorTitle = "AI Service Busy";
        } else if (error.message.includes("no questions returned") || (quizState === "active" && (!questions || questions.length === 0))) {
           errorMsg = "The AI couldn't generate questions for this topic, or the generated quiz was empty. Please try a different field or topic.";
           specificErrorTitle = "No Questions Generated";
        }
        else {
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
      setErrorTitle(specificErrorTitle);
      setQuizState("error");
      toast({
        variant: "destructive",
        title: specificErrorTitle,
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
    setErrorTitle("Error");
  };

  const renderContent = () => {
    switch (quizState) {
      case "setup":
        return <QuizSetupForm onSubmit={handleStartQuiz} isLoading={false} />;
      case "loading":
        return <QuizSetupForm onSubmit={handleStartQuiz} isLoading={true} />;
      case "active":
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
          return (
            <QuizActive
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswerSubmit}
              isSubmitting={false}
            />
          );
        }
        // This state should ideally be caught by the error handling in handleStartQuiz
        // or if questions become unexpectedly empty.
        setErrorTitle("Question Loading Error");
        setErrorMessage("Error: Questions are not available for the active quiz. Please try generating a new quiz.");
        setQuizState("error"); 
        return <QuizSetupForm onSubmit={handleStartQuiz} isLoading={false} />; // Show setup form to allow retry
      case "results":
        return (
          <QuizResults
            score={score}
            totalQuestions={questions.length}
            onPlayAgain={handlePlayAgain}
          />
        );
      case "error":
        // The error alert is shown globally below, so we just return the form
        // to allow the user to try again.
        return <QuizSetupForm onSubmit={handleStartQuiz} isLoading={false} />;
      default:
        // Fallback to setup if state is unknown
        setQuizState("setup");
        return <QuizSetupForm onSubmit={handleStartQuiz} isLoading={false} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background w-[80vw] mx-auto">
  {quizState === 'error' && errorMessage && (
    <Alert variant="destructive" className="mb-8 shadow-md max-w-2xl mx-auto">
      {errorTitle === "AI Service Busy" || errorTitle === "No Questions Generated" ? (
        <Zap className="h-4 w-4" />
      ) : (
        <Terminal className="h-4 w-4" />
      )}
      <AlertTitle>{errorTitle}</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )}
  {renderContent()}
</main>

  );
}
