import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { SidebarNav } from '@/components/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MediAI',
  description: 'Your Personal Healthcare AI Assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="md:flex">
            <Sidebar
              collapsible="icon"
              className="border-r"
              variant="sidebar"
            >
              <SidebarHeader className="h-16 items-center justify-center p-4 lg:justify-start">
                <Link href="/" className="flex items-center gap-2">
                  <Logo className="size-8" />
                  <span className="font-headline text-lg font-bold group-data-[collapsible=icon]:hidden">
                    MediAI
                  </span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarNav />
              </SidebarContent>
            </Sidebar>

            <SidebarInset className="min-h-screen">
              <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-4">
                  <Button>Get Pro</Button>
                </div>
              </header>
              <main className="p-4 sm:p-6">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
        <div className="fixed bottom-4 right-4 z-50">
          <Link href="/mental-health">
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <MessageCircle className="h-7 w-7" />
              <span className="sr-only">AI Chatbot</span>
            </Button>
          </Link>
        </div>
      </body>
    </html>
  );
}
