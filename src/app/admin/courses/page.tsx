
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, PlusCircle, AlertTriangle, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminShell } from '@/components/admin/admin-shell';

const courseFormSchema = z.object({
  name: z.string().min(3, { message: "Course name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

type Course = z.infer<typeof courseFormSchema> & { id: string };

function AddCourseForm() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: { name: "", description: "" },
  });

  function onSubmit(values: z.infer<typeof courseFormSchema>) {
    if (!firestore) {
      toast({ variant: "destructive", title: "Firestore not initialized" });
      return;
    }
    setIsLoading(true);

    const coursesCollection = collection(firestore, 'courses');
    
    addDoc(coursesCollection, values)
      .then(() => {
        toast({ title: "Course Added", description: `"${values.name}" has been created.` });
        form.reset();
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: coursesCollection.path,
          operation: 'create',
          requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({ variant: "destructive", title: "Submission Error", description: "Could not add the course." });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><PlusCircle /> Add New Course</CardTitle>
        <CardDescription>Fill out the form to create a new course.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Advanced Stenography" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the course content and objectives." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Course
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function CoursesList() {
    const firestore = useFirestore();
    const coursesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'courses') : null, [firestore]);
    const { data: courses, isLoading, error } = useCollection<Course>(coursesQuery);

    if (isLoading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[1, 2].map(i => <Skeleton key={i} className="h-24" />)}
        </div>;
    }

    if (error) {
        return <Card className="mt-6 bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You do not have permission to view courses. Make sure you are logged in with an admin account.</p>
            </CardContent>
        </Card>;
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Existing Courses</CardTitle>
            </CardHeader>
            <CardContent>
                {courses && courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map(course => (
                            <div key={course.id} className="p-4 border rounded-lg bg-card/50">
                                <h3 className="font-semibold">{course.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No courses found.</p>
                )}
            </CardContent>
        </Card>
    );
}


export default function AdminCoursesPage() {
  return (
    <div className="admin-dashboard-theme">
        <AdminShell
            pageTitle="Course Management"
            pageDescription="Create, view, and manage courses available on the platform."
            headerIcon={<BookOpen className="h-8 w-8 text-primary" />}
        >
            <div className="grid grid-cols-1 gap-8">
                <AddCourseForm />
                <CoursesList />
            </div>
        </AdminShell>
    </div>
  );
}
