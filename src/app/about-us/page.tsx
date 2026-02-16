
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SiteLogo } from '@/components/site-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Target, Eye } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container mx-auto max-w-5xl py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About Us</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
              Your dedicated partner in mastering typing and stenography.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Briefcase className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide the most effective and accessible platform for students preparing for government job exams requiring top-tier typing and stenography skills.
                </p>
              </CardContent>
            </Card>

             <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Target className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Our Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We combine expert-led dictation, daily practice modules, and real-time performance tracking to ensure consistent improvement and exam readiness.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Eye className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be the leading destination for skill development, helping thousands of aspirants achieve their career goals and secure their dream government jobs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
