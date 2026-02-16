'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Video, Calendar as CalendarIcon, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const liveClassFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  classTime: z.date({ required_error: "A date is required." }),
  instructor: z.string().optional(),
  link: z.string().url("Please enter a valid URL."),
  status: z.enum(["Upcoming", "Live", "Completed"]),
});

type LiveClass = z.infer<typeof liveClassFormSchema> & { id: string, classTime: any };


function AddLiveClassForm({ onClassAdded }: { onClassAdded: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof liveClassFormSchema>>({
    resolver: zodResolver(liveClassFormSchema),
    defaultValues: { title: "", instructor: "", link: "", status: "Upcoming" },
  });

  async function onSubmit(values: z.infer<typeof liveClassFormSchema>) {
    if (!firestore) return;
    setIsLoading(true);

    try {
      await addDoc(collection(firestore, 'liveClasses'), values);
      toast({ title: "Live Class Added", description: `"${values.title}" has been scheduled.` });
      form.reset();
      onClassAdded();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add the class." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><PlusCircle /> Schedule New Live Class</CardTitle>
        <CardDescription>Fill out the form to add a new class to the schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Class Title</FormLabel>
                <FormControl><Input placeholder="e.g., Advanced Steno Dictation" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="classTime" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} />
                    <div className="p-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">Time selection coming soon.</p>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="instructor" render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., Mr. Sharma" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="link" render={({ field }) => (
              <FormItem>
                <FormLabel>Class Link (Zoom, Meet, etc.)</FormLabel>
                <FormControl><Input placeholder="https://meet.google.com/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Class
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function LiveClassesList() {
    const firestore = useFirestore();
    const query = useMemoFirebase(() => firestore ? collection(firestore, 'liveClasses') : null, [firestore]);
    const { data: classes, isLoading } = useCollection<LiveClass>(query);
    const { toast } = useToast();

    if (isLoading) {
        return <div className="space-y-4 mt-6">
            {[1, 2].map(i => <Skeleton key={i} className="h-20" />)}
        </div>;
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Scheduled Classes</CardTitle>
            </CardHeader>
            <CardContent>
                {classes && classes.length > 0 ? (
                    <div className="space-y-4">
                        {classes.sort((a,b) => b.classTime.seconds - a.classTime.seconds).map(c => (
                            <div key={c.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-semibold">{c.title}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <CalendarIcon className="h-4 w-4"/> {c.classTime ? format(c.classTime.toDate(), 'PPP, HH:mm') : 'No date'}
                                        <span className='text-xl'>·</span>
                                        <span className={cn("font-medium", c.status === "Live" && "text-red-500 animate-pulse", c.status === "Completed" && "text-gray-500", c.status === "Upcoming" && "text-blue-500")}>{c.status}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => window.open(c.link, '_blank')}><LinkIcon className="h-4 w-4 mr-2" /> Join</Button>
                                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Coming Soon"})}><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => toast({title: "Coming Soon"})}><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No live classes scheduled yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminLiveClassesPage() {
  const [key, setKey] = useState(0); // Used to force-refresh the list
  return (
    <AdminShell
      pageTitle="Live Classes"
      pageDescription="Schedule, update, and manage live classes for your students."
      headerIcon={<Video className="h-8 w-8 text-primary" />}
    >
      <div className="grid grid-cols-1 gap-8">
        <AddLiveClassForm onClassAdded={() => setKey(k => k + 1)} />
        <LiveClassesList key={key} />
      </div>
    </AdminShell>
  );
}
