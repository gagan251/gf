'use client';

import { Sidebar } from './sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { SiteLogo } from '../site-logo';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
            <SiteLogo className="h-6 w-6"/>
            <span className="font-bold">Dashboard</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
             <div className="flex h-full flex-col gap-4 bg-card p-4">
                <Sidebar />
             </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main content with desktop sidebar */}
      <div className="mx-auto max-w-7xl p-4">
        <div className="rounded-2xl border border-border/20 bg-background/50 p-4 shadow-lg backdrop-blur-lg">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
            <aside className="hidden flex-col gap-4 rounded-lg border bg-card/80 p-4 shadow-sm backdrop-blur-sm lg:flex">
                <Sidebar />
            </aside>
            <main className="flex min-w-0 flex-col gap-4">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
