"use client";

import type * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { GenerateQuizOutput } from "@/ai/flows/generate-quiz"; // Ensure this path is correct
import { ChevronRight, Loader2 } from "lucide-react";

type QuizQuestionType = GenerateQuizOutput["questions"][0];

type QuizActiveProps = {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: string) => void;
  isSubmitting: boolean;
};

export function QuizActive({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isSubmitting,
}: QuizActiveProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  const [showWarning, setShowWarning] = useState(false);

  // Reset selected value when question changes
  useEffect(() => {
    setSelectedValue(undefined);
    setShowWarning(false);
  }, [question]);

  const handleSubmit = () => {
    if (selectedValue) {
      setShowWarning(false);
      onAnswer(selectedValue);
    } else {
      setShowWarning(true);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Question {questionNumber}</CardTitle>
          <CardDescription className="text-lg">
            {questionNumber} / {totalQuestions}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-xl font-semibold leading-relaxed">{question.question}</p>
        <RadioGroup value={selectedValue} onValueChange={setSelectedValue} className="space-y-3">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-base flex-1 cursor-pointer">{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {showWarning && <p className="text-sm text-destructive font-medium text-center">Please select an answer to continue.</p>}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || !selectedValue} className="bg-primary hover:bg-primary/90">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              {questionNumber === totalQuestions ? "Finish Quiz" : "Next Question"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
