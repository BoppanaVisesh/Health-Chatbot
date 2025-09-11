"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedLanguages } from "@/lib/languages";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LanguageSelector() {
  const [language, setLanguage] = useState("en");
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // Note: This only redirects. Full app translation is not implemented.
    // We can redirect to a language-specific path in the future, e.g., /es/dashboard
    console.log("Language selected:", value);

    if (value !== 'en') {
       router.push('/translator');
    }
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto gap-2 border-0 bg-transparent shadow-none focus:ring-0">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map(lang => (
          <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
