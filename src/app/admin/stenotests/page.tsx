'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Keyboard, List, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaybookFile, StenoTest } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

const testFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  language: z.string().min(3, "Language is required."),
  speed: z.string().min(3, "Speed is required (e.g., 80 WPM)."),
  duration: z.string().min(3, "Duration is required (e.g., 10 Minutes)."),
  audioUrl: z.string().url("Please select a valid audio file."),
  originalText: z.string().min(20, "Transcription must be at least 20 characters."),
  isFree: z.boolean().default(false),
});

function AddTestForm({ onTestAdded }: { onTestAdded: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const audioFilesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'playbooks') : null, [firestore]);
  const { data: audioFiles, isLoading: isLoadingAudio } = useCollection<PlaybookFile>(audioFilesQuery);

  const form = useForm<z.infer<typeof testFormSchema>>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      title: "",
      language: "English",
      speed: "80 WPM",
      duration: "10 Minutes",
      originalText: "",
      isFree: false,
    },
  });

  async function onSubmit(values: z.infer<typeof testFormSchema>) {
    if (!firestore) return;
    setIsLoading(true);
    
    try {
      await addDoc(collection(firestore, 'stenoTests'), {
          ...values,
          createdAt: serverTimestamp()
      });
      toast({ title: "Test Created", description: `"${values.title}" has been added.` });
      form.reset();
      onTestAdded();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message || "Could not create the test." });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><PlusCircle /> Create New Steno Test</CardTitle>
        <CardDescription>Fill out the form to create a new practice test for students.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                    <FormLabel>Test Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Parliamentary Debate" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
                 <FormField control={form.control} name="language" render={({ field }) => (
                <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl><Input placeholder="e.g., English or Hindi" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="speed" render={({ field }) => (
                <FormItem>
                    <FormLabel>Dictation Speed</FormLabel>
                    <FormControl><Input placeholder="e.g., 80 WPM" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
                <FormField control={form.control} name="duration" render={({ field }) => (
                <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl><Input placeholder="e.g., 10 Minutes" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
            </div>
             <FormField control={form.control} name="audioUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Audio File</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingAudio}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={isLoadingAudio ? "Loading audio files..." : "Select an audio file from Playbooks"} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {audioFiles && audioFiles.length > 0 ? (
                            audioFiles.map(file => (
                                <SelectItem key={file.id} value={file.url}>{file.name}</SelectItem>
                            ))
                        ) : (
                           <div className="p-4 text-sm text-center text-muted-foreground">No audio files found in Playbooks.</div>
                        )}
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

             <FormField control={form.control} name="originalText" render={({ field }) => (
                <FormItem>
                    <FormLabel>Original Transcription Text</FormLabel>
                    <FormControl><Textarea placeholder="Paste the exact text of the audio here." {...field} className="min-h-[150px] font-mono" /></FormControl>
                    <FormMessage />
                </FormItem>
             )} />
            
             <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        Mark as Free Test
                        </FormLabel>
                        <FormDescription>
                           If checked, this test will be available to all users on the "Free Dictation" page.
                        </FormDescription>
                    </div>
                    </FormItem>
                )}
                />

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Test
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function TestsList() {
    const firestore = useFirestore();
    const testsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'stenoTests') : null, [firestore]);
    const { data: tests, isLoading, error } = useCollection<StenoTest>(testsQuery);

    if (isLoading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>;
    }

    if (error) {
        return <Card className="mt-6 bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You do not have permission to view tests. Make sure you are logged in with an admin account.</p>
            </CardContent>
        </Card>;
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><List /> Existing Tests</CardTitle>
            </CardHeader>
            <CardContent>
                {tests && tests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tests.sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()).map(test => (
                            <div key={test.id} className="p-4 border rounded-lg bg-card/50">
                                <h3 className="font-semibold">{test.title} {test.isFree && <span className="text-xs ml-2 bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Free</span>}</h3>
                                <p className="text-sm text-muted-foreground">{test.language} | {test.speed} | {test.duration}</p>
                                <p className="text-xs text-muted-foreground mt-2">Created: {test.createdAt ? format(test.createdAt.toDate(), 'PPP') : ''}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No tests created yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminStenoTestsPage() {
    const [key, setKey] = useState(0); // to force refresh the list
  return (
    <AdminShell
      pageTitle="Stenography Tests"
      pageDescription="Create, view, and manage stenography practice tests."
      headerIcon={<Keyboard className="h-8 w-8 text-primary" />}
    >
        <div className="grid grid-cols-1 gap-8">
            <AddTestForm onTestAdded={() => setKey(k => k + 1)} />
            <TestsList key={key} />
        </div>
    </AdminShell>
  );
}
