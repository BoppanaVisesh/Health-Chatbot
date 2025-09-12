import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { SidebarNav } from '@/components/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { PageTransition } from '@/components/ui/page-transition';
import './globals.css';
import { MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dhadhi',
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
          <div className="flex min-h-screen">
            <Sidebar
              collapsible="icon"
              className="border-r bg-card transition-all duration-300 ease-in-out"
              variant="sidebar"
            >
              <SidebarHeader className="h-16 items-center justify-center p-4 lg:justify-start border-b transition-all duration-200">
                <Link href="/" className="flex items-center gap-2 hover-glow scale-hover">
                  <Logo className="size-8 transition-transform duration-200" />
                  <span className="font-headline text-lg font-bold group-data-[collapsible=icon]:hidden gradient-text">
                    Dhadhi
                  </span>
                </Link>
              </SidebarHeader>
              <SidebarContent className="px-2 py-2">
                <SidebarNav />
              </SidebarContent>
            </Sidebar>

            <SidebarInset className="flex-1 flex flex-col w-full max-w-none force-full-width">
              <main className="flex-1 p-0 w-full max-w-none force-full-width">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
        <div className="fixed bottom-4 right-4 z-50 float">
          <Link href="/ai-chat">
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg btn-animate hover-glow scale-hover">
              <MessageCircle className="h-7 w-7 transition-transform duration-200" />
              <span className="sr-only">AI Chatbot</span>
            </Button>
          </Link>
        </div>
      </body>
    </html>
  );
}
