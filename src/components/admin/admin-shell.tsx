'use client';

import { AdminSidebar } from './admin-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home } from 'lucide-react';
import Link from 'next/link';
import { SiteLogo } from '../site-logo';

interface AdminShellProps {
    children: React.ReactNode;
    pageTitle: string;
    pageDescription: string;
    headerIcon: React.ReactNode;
}

export function AdminShell({ children, pageTitle, pageDescription, headerIcon }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block h-screen sticky top-0">
          <AdminSidebar />
        </aside>

        <main className="flex-1">
            {/* Mobile Header */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:hidden">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <SiteLogo />
                    <span className="font-bold">Admin</span>
                </Link>
                <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-sidebar w-[280px]">
                    <AdminSidebar />
                </SheetContent>
                </Sheet>
            </header>

            <div className="p-4 sm:p-6 lg:p-8">
                 <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            {headerIcon}
                            {pageTitle}
                        </h1>
                        <Button asChild variant="outline">
                            <Link href="/"><Home className="mr-2 h-4 w-4" /> Go to Homepage</Link>
                        </Button>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                        {pageDescription}
                    </p>
                </header>
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
