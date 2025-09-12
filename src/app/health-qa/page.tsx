"use client";

import { useFormState, useFormStatus } from "react-dom";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { askQuestion } from "./actions";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Thinking..." : "Ask Question"}
    </Button>
  );
}

export default function HealthQAPage() {
  const [state, formAction] = useFormState(askQuestion, {});

  return (
    <div className="space-y-8 w-full p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Health Q&A"
        description="Ask any health-related question and get a reliable answer from our AI, based on verified medical knowledge."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>What's on your mind?</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              name="question"
              placeholder="e.g., What are the benefits of a Mediterranean diet?"
              required
            />
            {state?.error && (
              <p className="mt-2 text-sm text-destructive">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state?.result && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-muted p-4">
              <p className="font-semibold">You</p>
              <p className="text-muted-foreground">{state.question}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage />
              <AvatarFallback><Bot /></AvatarFallback>
            </Avatar>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Dhadhi Answer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{state.result.answer}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
