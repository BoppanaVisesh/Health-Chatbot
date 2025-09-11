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
import { bustMyth } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Bot, CheckCircle, Shield, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Analyzing..." : "Analyze Claim"}
    </Button>
  );
}

export default function MythBusterPage() {
  const [state, formAction] = useFormState(bustMyth, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Myth Buster"
        description="Enter a questionable health claim to see if it's a fact or fiction. Our AI will provide an evidence-based explanation."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Health Claim Analysis</CardTitle>
            <CardDescription>
              Enter a health claim you've heard to check its validity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="healthClaim"
              placeholder="e.g., Drinking celery juice every morning can cure acne."
              rows={4}
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
        <Card>
          <CardHeader>
            <CardTitle>Analysis of: "{state.claim}"</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Verdict</h3>
              <Badge
                variant={state.result.isValid ? "default" : "destructive"}
                className={cn(
                  "mt-2 text-base",
                  state.result.isValid
                    ? "bg-accent text-accent-foreground"
                    : "bg-destructive text-destructive-foreground"
                )}
              >
                {state.result.isValid ? (
                  <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                {state.result.isValid ? "Likely Valid" : "Likely a Myth"}
              </Badge>
            </div>

            <div className="flex items-start gap-4">
                <Avatar>
                    <AvatarFallback><Shield/></AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <h3 className="font-semibold">Explanation</h3>
                    <p className="text-muted-foreground">{state.result.explanation}</p>
                </div>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
