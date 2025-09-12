"use client";

import { useFormState, useFormStatus } from "react-dom";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateEducation } from "./actions";
import { BookMarked } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate Material"}
    </Button>
  );
}

export default function PostDiagnosisPage() {
  const [state, formAction] = useFormState(generateEducation, {});

  return (
    <div className="space-y-8 w-full p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Post-Diagnosis Education"
        description="Receive personalized educational materials to better understand your diagnosis, treatment options, and self-care advice."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Enter Diagnosis Details</CardTitle>
            <CardDescription>
              Provide the diagnosis you received and any personal context that
              might help tailor the information for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="diagnosis">Medical Diagnosis</label>
              <Input
                id="diagnosis"
                name="diagnosis"
                placeholder="e.g., Type 2 Diabetes"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="userContext">Personal Context (Optional)</label>
              <Textarea
                id="userContext"
                name="userContext"
                placeholder="e.g., I'm 45 years old, have a family history of heart disease, and I'm concerned about managing my diet."
                rows={3}
              />
            </div>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookMarked className="h-6 w-6 text-primary" />
              Understanding {state.diagnosis}
            </CardTitle>
            <CardDescription>
              Here is your personalized educational guide.
            </CardDescription>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-foreground">
            {state.result.educationalMaterial}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
