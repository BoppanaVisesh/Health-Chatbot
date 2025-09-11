"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenCheck,
  BrainCircuit,
  HelpCircle,
  Hospital,
  LayoutDashboard,
  Pill,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';

interface NavItem {
  title: string;
  href: string;
  Icon: LucideIcon;
  tooltip: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    Icon: LayoutDashboard,
    tooltip: 'Dashboard',
  },
  {
    title: 'Symptom Checker',
    href: '/symptom-checker',
    Icon: Stethoscope,
    tooltip: 'Symptom Checker',
  },
  {
    title: 'Health Q&A',
    href: '/health-qa',
    Icon: HelpCircle,
    tooltip: 'Health Q&A',
  },
  {
    title: 'Medication',
    href: '/medication',
    Icon: Pill,
    tooltip: 'Medication Info',
  },
  {
    title: 'Mental Health',
    href: '/mental-health',
    Icon: BrainCircuit,
    tooltip: 'Mental Health Chat',
  },
  {
    title: 'Myth Buster',
    href: '/myth-buster',
    Icon: ShieldCheck,
    tooltip: 'Myth Buster',
  },
  {
    title: 'Hospitals',
    href: '/hospitals',
    Icon: Hospital,
    tooltip: 'Find Hospitals',
  },
  {
    title: 'Diagnosis Ed',
    href: '/post-diagnosis',
    Icon: BookOpenCheck,
    tooltip: 'Post-Diagnosis Education',
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map(({ title, href, Icon, tooltip }) => (
        <SidebarMenuItem key={title}>
          <Link href={href}>
            <SidebarMenuButton
              isActive={pathname === href}
              tooltip={{ children: tooltip }}
            >
              <Icon />
              <span>{title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
