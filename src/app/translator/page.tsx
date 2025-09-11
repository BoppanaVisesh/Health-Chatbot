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
import { getTranslation } from "./actions";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedLanguages } from "@/ai/flows/translator";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Translating..." : "Translate"}
    </Button>
  );
}

export default function TranslatorPage() {
  const [state, formAction] = useFormState(getTranslation, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Translator"
        description="Translate text into different languages using AI."
      />
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Text Translator</CardTitle>
            <CardDescription>
              Enter the text you want to translate and select the target language.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              name="text"
              placeholder="e.g., Hello, how are you?"
              rows={4}
              required
              defaultValue={state?.originalText}
            />
             <Select name="targetLanguage" required defaultValue={state?.targetLanguage}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                    {supportedLanguages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

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
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-muted p-4">
              <p className="font-semibold">You</p>
              <p className="text-muted-foreground">{state.originalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback><Bot /></AvatarFallback>
            </Avatar>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  MediAI Translation ({supportedLanguages.find(l => l.value === state.targetLanguage)?.label})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{state.result.translatedText}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
