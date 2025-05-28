"use client";

import type * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";

const formSchema = z.object({
  field: z.string().min(2, {
    message: "Field must be at least 2 characters.",
  }),
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
});

type QuizSetupFormProps = {
  onSubmit: (field: string, topic: string) => void;
  isLoading: boolean;
};

export function QuizSetupForm({ onSubmit, isLoading }: QuizSetupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field: "",
      topic: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.field, values.topic);
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
            <Lightbulb className="h-8 w-8 mr-2 text-primary" />
            <CardTitle className="text-3xl font-bold">Quizify</CardTitle>
        </div>
        <CardDescription>Enter a field and topic to generate your quiz!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of Study</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., History, Science, Literature" {...field} />
                  </FormControl>
                  <FormDescription>
                    The general area your quiz will be about.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., World War II, Quantum Physics" {...field} />
                  </FormControl>
                  <FormDescription>
                    The specific subject within the field.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
