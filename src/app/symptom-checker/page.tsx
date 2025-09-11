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
import { Textarea } from "@/components/ui/textarea";
import { checkSymptoms } from "./actions";
import { AlertCircle, FileWarning, HeartPulse, Lightbulb } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Analyzing..." : "Analyze Symptoms"}
    </Button>
  );
}

export default function SymptomCheckerPage() {
  const [state, formAction] = useFormState(checkSymptoms, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Symptom Checker"
        description="Describe your symptoms, and our AI will provide potential causes and recommendations. This is not a substitute for professional medical advice."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Describe Your Symptoms</CardTitle>
            <CardDescription>
              Please provide as much detail as possible, such as duration,
              severity, and any other relevant information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="symptoms"
              placeholder="e.g., I have a persistent dry cough, a slight fever, and feel very tired..."
              rows={5}
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
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Analysis Results</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <HeartPulse className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle>Urgency Level</CardTitle>
                  <CardDescription>Our assessment of urgency.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">{state.result.urgencyLevel}</p>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <AlertCircle className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>Potential Causes</CardTitle>
                    <CardDescription>Possible reasons for your symptoms.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{state.result.potentialCauses}</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Lightbulb className="h-8 w-8 text-accent-foreground" />
                 <div>
                    <CardTitle>Recommended Actions</CardTitle>
                    <CardDescription>Suggestions for your next steps.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{state.result.recommendedActions}</p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6 border-destructive/50 bg-destructive/10">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <FileWarning className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle>Disclaimer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive-foreground/80">
                  This AI-powered analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
