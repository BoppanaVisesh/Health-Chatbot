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
import { LanguageSelector } from '@/components/language-selector';
import { getDictionary } from '@/app/i18n';
import { I18nContext } from '@/app/i18n/client';

export const metadata: Metadata = {
  title: 'MediAI',
  description: 'Your Personal Healthcare AI Assistant',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {lang: string};
}>) {
  const dictionary = await getDictionary(params.lang);
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <I18nContext.Provider value={dictionary}>
          <SidebarProvider>
            <div className="md:flex">
              <Sidebar
                collapsible="icon"
                className="border-r"
                variant="sidebar"
                defaultOpen
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
                    <LanguageSelector />
                    <Button>Get Pro</Button>
                  </div>
                </header>
                <main className="p-4 sm:p-6">{children}</main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </I18nContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}
