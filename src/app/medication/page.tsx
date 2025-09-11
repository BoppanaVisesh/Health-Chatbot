import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { medications } from '@/lib/data';
import { Pill } from 'lucide-react';

export default function MedicationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Medication Information"
        description="Find detailed information about common medications. This information is for educational purposes only."
      />

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
  );
}
