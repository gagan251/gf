'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Keyboard, BookOpen } from 'lucide-react';
import { useUser } from '@/firebase';
import { Skeleton } from '../ui/skeleton';
import { useState, useEffect } from 'react';

export function Courses() {
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const coursesData = [
    {
      title: 'Typing Course',
      id: 'typing',
      description: 'Comprehensive lessons from beginner to advanced to boost your typing speed and accuracy. (Lessons 1-10)',
      icon: Keyboard,
    },
    {
      title: 'Stenography Course',
      id: 'stenography',
      description: 'Master shorthand with our expert-led dictation practices and exam-focused materials. (Dictation practice)',
      icon: BookOpen,
    }
  ];

  return (
    <section id="courses" className="py-16 sm:py-24 bg-secondary/50">
        <div className="container mx-auto">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Our Courses</h2>
                <p className="mt-4 text-lg text-muted-foreground">Choose your path to success.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                {coursesData.map((course) => (
                    <Card key={course.title} className="flex flex-col text-center items-center hover:shadow-lg hover:-translate-y-1 transition-transform">
                        <CardHeader>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                <course.icon className="h-8 w-8" />
                            </div>
                            <CardTitle>{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <CardDescription>{course.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                             {(!isClient || isUserLoading) ? (
                                <Skeleton className="h-10 w-32" />
                            ) : (
                                <Button asChild>
                                    <Link href={user ? `/enroll/${course.id}` : '/signup'}>
                                        Start Learning
                                    </Link>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    </section>
  )
}
