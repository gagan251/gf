'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PageLoader from '@/components/ui/page-loader';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (!user) {
      router.replace('/login');
    } else if (user && !user.emailVerified) {
      router.replace('/verify-notice');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || (user && !user.emailVerified)) {
    return <PageLoader />;
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
        <DashboardHeader />
        <div className="flex flex-1">
            <aside className="hidden w-60 flex-shrink-0 bg-primary md:block">
                <Sidebar />
            </aside>
            <div className='md:hidden'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="fixed top-18 left-2 z-50">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-60 p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            </div>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    </div>
  );
}
