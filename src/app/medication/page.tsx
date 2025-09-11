"use client";

import { useFormState, useFormStatus } from "react-dom";
import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { medications } from '@/lib/data';
import { Pill, Bot, User, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getMedicationInfo } from "./actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Get Information"}
    </Button>
  );
}

export default function MedicationPage() {
  const [state, formAction] = useFormState(getMedicationInfo, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Medication Information"
        description="Look up a medication to get an explanation about its usage and dosage, or browse common medications below. This information is for educational purposes only."
      />

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Medication Explainer</CardTitle>
            <CardDescription>
              Enter the name of a medication and any relevant context to get a detailed explanation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="medicationName">Medication Name</label>
              <Input
                id="medicationName"
                name="medicationName"
                placeholder="e.g., Lisinopril"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="userContext">Personal Context (Optional)</label>
              <Textarea
                id="userContext"
                name="userContext"
                placeholder="e.g., I'm taking this for high blood pressure and want to know about side effects."
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

      {state?.result && state.medicationName && (
        <Card>
           <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <span>Explanation for {state.medicationName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <p className="font-semibold">MediAI Pharmacist</p>
                <p className="text-muted-foreground">{state.result.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 pt-8">
        <h2 className="text-2xl font-bold font-headline">Common Medications</h2>
        <Accordion type="single" collapsible className="w-full">
          {medications.map((med, index) => (
            <AccordionItem value={`item-${index}`} key={med.name}>
              <AccordionTrigger className="text-lg font-headline hover:no-underline">
                  <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Pill className="h-5 w-5 text-primary" />
                      </div>
                      {med.name}
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-muted-foreground">{med.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Common Side Effects</h3>
                    <p className="text-muted-foreground">{med.sideEffects}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
