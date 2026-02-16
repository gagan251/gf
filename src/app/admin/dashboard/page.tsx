'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { ShieldCheck, Video, ArrowRight, BookMarked } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { OverviewStats } from '@/components/admin/overview-stats';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  return (
    <AdminShell
      pageTitle="Admin Dashboard"
      pageDescription="Manage live classes, playbooks, and view site statistics."
      headerIcon={<ShieldCheck className="h-8 w-8 text-primary" />}
    >
      <div className="space-y-8">
        <OverviewStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="flex flex-col hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Video className="h-6 w-6 text-accent" />
                Manage Live Classes
              </CardTitle>
              <CardDescription>
                Create, schedule, and manage all live class sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <p className="text-sm text-muted-foreground">Keep your students engaged with live, interactive sessions. View upcoming, live, and completed classes.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full md:w-auto">
                <Link href="/admin/live-classes">Go to Live Classes <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookMarked className="h-6 w-6 text-accent" />
                Manage Playbooks
              </CardTitle>
              <CardDescription>
                Upload and manage study materials for your students.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Provide PDFs, audio files, and other resources to supplement your courses.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full md:w-auto">
                <Link href="/admin/playbooks">Go to Playbooks <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
