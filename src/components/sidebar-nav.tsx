"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  BrainCircuit,
  HelpCircle,
  Hospital,
  LayoutDashboard,
  MessageCircle,
  Pill,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  Icon: LucideIcon;
  tooltip: string;
  gradient: string;
  hoverGradient: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    Icon: LayoutDashboard,
    tooltip: 'Overview & Analytics',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    hoverGradient: 'from-blue-500/30 to-cyan-500/30',
  },
  {
    title: 'Symptom Checker',
    href: '/symptom-checker',
    Icon: Stethoscope,
    tooltip: 'AI-Powered Symptom Analysis',
    gradient: 'from-emerald-500/20 to-green-500/20',
    hoverGradient: 'from-emerald-500/30 to-green-500/30',
  },
  {
    title: 'Health Q&A',
    href: '/health-qa',
    Icon: HelpCircle,
    tooltip: 'Expert Health Answers',
    gradient: 'from-purple-500/20 to-pink-500/20',
    hoverGradient: 'from-purple-500/30 to-pink-500/30',
  },
  {
    title: 'Medication',
    href: '/medication',
    Icon: Pill,
    tooltip: 'Medicine Information & Interactions',
    gradient: 'from-orange-500/20 to-red-500/20',
    hoverGradient: 'from-orange-500/30 to-red-500/30',
  },
  {
    title: 'AI Chat',
    href: '/ai-chat',
    Icon: MessageCircle,
    tooltip: 'Intelligent Health Assistant',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    hoverGradient: 'from-indigo-500/30 to-purple-500/30',
  },
  {
    title: 'Mental Health',
    href: '/mental-health',
    Icon: BrainCircuit,
    tooltip: 'Mental Wellness Support',
    gradient: 'from-teal-500/20 to-cyan-500/20',
    hoverGradient: 'from-teal-500/30 to-cyan-500/30',
  },
  {
    title: 'Myth Buster',
    href: '/myth-buster',
    Icon: ShieldCheck,
    tooltip: 'Verify Health Information',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    hoverGradient: 'from-amber-500/30 to-yellow-500/30',
  },
  {
    title: 'Hospitals',
    href: '/hospitals',
    Icon: Hospital,
    tooltip: 'Find Nearby Healthcare',
    gradient: 'from-rose-500/20 to-pink-500/20',
    hoverGradient: 'from-rose-500/30 to-pink-500/30',
  },
  {
    title: 'Post-Diagnosis',
    href: '/post-diagnosis',
    Icon: BookOpenCheck,
    tooltip: 'Recovery & Education',
    gradient: 'from-violet-500/20 to-purple-500/20',
    hoverGradient: 'from-violet-500/30 to-purple-500/30',
  },
  {
    title: 'QR Health Card',
    href: '/qr-health-card',
    Icon: QrCode,
    tooltip: 'Digital Health Profile',
    gradient: 'from-slate-500/20 to-gray-500/20',
    hoverGradient: 'from-slate-500/30 to-gray-500/30',
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-lg" />
      
      <SidebarMenu className="space-y-2 p-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <SidebarMenuItem key={item.title} className="group/item">
              <div 
                className="relative"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: mounted ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                {/* Active indicator line */}
                <div
                  className={cn(
                    "absolute left-0 top-1/2 w-1 h-8 -translate-y-1/2 rounded-r-full transition-all duration-300",
                    isActive 
                      ? "bg-gradient-to-b from-primary to-primary/60 opacity-100 scale-100" 
                      : "opacity-0 scale-75"
                  )}
                />

                {/* Hover glow effect */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300 opacity-0 blur-xl",
                    item.hoverGradient,
                    "group-hover/item:opacity-100"
                  )}
                />

                <Link href={item.href} className="block relative">
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={{ 
                      children: (
                        <div className="flex items-center gap-2 font-medium">
                          <Sparkles className="h-3 w-3" />
                          {item.tooltip}
                        </div>
                      ),
                      className: "bg-gradient-to-r from-background to-accent/50 border border-border/50 shadow-lg"
                    }}
                    className={cn(
                      "w-full h-12 relative overflow-hidden transition-all duration-300 group/button",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:opacity-0 before:transition-all before:duration-300",
                      `before:${item.gradient}`,
                      "hover:before:opacity-100",
                      isActive && [
                        "bg-gradient-to-r shadow-lg border border-primary/20",
                        item.gradient,
                        "shadow-primary/10"
                      ]
                    )}
                  >
                    {/* Icon container with enhanced styling */}
                    <div className={cn(
                      "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "group-hover/button:bg-accent/50 group-hover/button:scale-110"
                    )}>
                      <item.Icon className={cn(
                        "h-4 w-4 transition-all duration-300",
                        isActive && "drop-shadow-sm",
                        "group-hover/button:rotate-3 group-hover/button:scale-110"
                      )} />
                      
                      {/* Subtle icon glow for active state */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                      )}
                    </div>

                    {/* Text with enhanced typography */}
                    <span className={cn(
                      "truncate font-medium transition-all duration-300 flex-1 text-left",
                      isActive 
                        ? "text-foreground font-semibold" 
                        : "text-muted-foreground group-hover/button:text-foreground",
                      !isCollapsed && "group-hover/button:translate-x-1"
                    )}>
                      {item.title}
                    </span>

                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-active/button:opacity-100 group-active/button:animate-ping transition-opacity duration-75" />
                  </SidebarMenuButton>
                </Link>

                {/* Subtle bottom border for separation */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
              </div>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
