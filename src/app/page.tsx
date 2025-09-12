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
  MessageCircle,
  Pill,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { FadeIn, StaggeredList } from '@/components/ui/page-transition';

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
    title: 'AI Chat',
    description: 'Chat with a helpful AI assistant.',
    href: '/ai-chat',
    Icon: MessageCircle,
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
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8 w-full p-4 sm:p-6 lg:p-8">
      <FadeIn delay={100}>
        <PageHeader
          title="Welcome to Dhadhi"
          description="Your personal AI-powered healthcare assistant. How can we help you today?"
        />
      </FadeIn>
      
      <StaggeredList 
        staggerDelay={100}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {features.map(({ title, description, href, Icon }) => (
          <Link href={href} key={title}>
            <Card className="flex h-full flex-col justify-between card-hover group cursor-pointer">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                  <Icon className="h-6 w-6 text-primary transition-transform duration-200 group-hover:scale-110" />
                </div>
                <CardTitle className="font-headline text-xl leading-tight transition-colors duration-200 group-hover:text-primary">
                  {title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed transition-colors duration-200">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </StaggeredList>
    </div>
  );
}
