"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PartyPopper, RotateCcw } from "lucide-react";

type QuizResultsProps = {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
};

export function QuizResults({ score, totalQuestions, onPlayAgain }: QuizResultsProps) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  let message = "";
  if (percentage >= 80) {
    message = "Excellent work! You're a Quiz Master!";
  } else if (percentage >= 60) {
    message = "Great job! You know your stuff!";
  } else if (percentage >= 40) {
    message = "Good effort! Keep learning and try again!";
  } else {
    message = "Keep practicing! You'll get there!";
  }

  return (
    <Card className="w-full max-w-md text-center shadow-xl">
      <CardHeader className="bg-accent rounded-t-lg py-8">
        <div className="flex flex-col items-center justify-center text-accent-foreground">
          <PartyPopper className="h-16 w-16 mb-4" />
          <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-8">
        <CardDescription className="text-xl font-medium text-foreground">
          {message}
        </CardDescription>
        <div>
          <p className="text-4xl font-bold text-primary">
            {score} / {totalQuestions}
          </p>
          <p className="text-muted-foreground">({percentage}%)</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onPlayAgain} className="w-full" variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Play Again
        </Button>
      </CardFooter>
    </Card>
  );
}
