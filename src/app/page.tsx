'use client';
import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpenCheck,
  BrainCircuit,
  HelpCircle,
  Hospital,
  Languages,
  Pill,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

interface Feature {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}

const features: Feature[] = [
  {
    title: 'Symptom Checker',
    description: 'Analyze your symptoms and get triage suggestions.',
    href: '/symptom-checker',
    Icon: Stethoscope,
  },
  {
    title: 'Health Q&A',
    description: 'Get instant answers to your health questions.',
    href: '/health-qa',
    Icon: HelpCircle,
  },
  {
    title: 'Medication Info',
    description: 'Look up medication details, side effects, and more.',
    href: '/medication',
    Icon: Pill,
  },
  {
    title: 'Mental Health Chat',
    description: 'Talk to an AI about your mental health concerns.',
    href: '/mental-health',
    Icon: BrainCircuit,
  },
  {
    title: 'Myth Buster',
    description: 'Debunk fake health news and misinformation.',
    href: '/myth-buster',
    Icon: ShieldCheck,
  },
  {
    title: 'Find Hospitals',
    description: 'Locate the nearest hospitals and clinics.',
    href: '/hospitals',
    Icon: Hospital,
  },
  {
    title: 'Post-Diagnosis Education',
    description: 'Understand your diagnosis and treatment options.',
    href: '/post-diagnosis',
    Icon: BookOpenCheck,
  },
  {
    title: 'Translator',
    description: 'Translate text to a different language.',
    href: '/translator',
    Icon: Languages,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome to MediAI"
        description="Your personal AI-powered healthcare assistant. How can we help you today?"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, description, href, Icon }) => (
          <Link href={href} key={title}>
            <Card className="flex h-full flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
