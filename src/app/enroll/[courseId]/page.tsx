'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BookOpen, CreditCard } from 'lucide-react';
import Link from 'next/link';
import PageLoader from '@/components/ui/page-loader';

type Course = {
  id: string;
  name: string;
  description: string;
};

export default function EnrollPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const courseRef = useMemoFirebase(
    () => (firestore && courseId ? doc(firestore, 'courses', courseId) : null),
    [firestore, courseId]
  );
  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useDoc<Course>(courseRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace(`/login?redirect=/enroll/${courseId}`);
    }
  }, [user, isUserLoading, router, courseId]);

  if (isUserLoading || !user || isCourseLoading) {
    return <PageLoader />;
  }

  const renderError = (title: string, message: string) => (
     <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )

  if (courseError) {
    return renderError('Error Loading Course', 'There was a problem fetching the course details. Please try again later.');
  }

  if (!course) {
    return renderError('Course Not Found', 'The course you are looking for does not exist or may have been removed.');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/50">
        <div className="container mx-auto max-w-2xl py-12 sm:py-16">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-center text-3xl">{course.name}</CardTitle>
              <CardDescription className="pt-2 text-center">
                Review the course details and proceed to payment to begin your
                learning journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 text-muted-foreground">
                <div className="border-t pt-4">
                    <p>{course.description}</p>
                </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href={`/payment?courseId=${course.id}`}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
