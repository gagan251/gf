'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStorage, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, File as FileIcon, Trash2, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const uploadFormSchema = z.object({
  file: z.instanceof(FileList).refine((files) => files?.length === 1, 'File is required.'),
});

type LibraryFile = {
    id: string;
    name: string;
    url: string;
    createdAt: { seconds: number };
}

function UploadFileForm({ onUploadComplete }: { onUploadComplete: () => void }) {
    const storage = useStorage();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const form = useForm<z.infer<typeof uploadFormSchema>>({
        resolver: zodResolver(uploadFormSchema),
    });

    async function onSubmit(values: z.infer<typeof uploadFormSchema>) {
        if (!storage || !firestore) return;
        
        const file = values.file[0];
        setIsLoading(true);
        setUploadProgress(0);

        const storageRef = ref(storage, `library/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                setIsLoading(false);
                setUploadProgress(null);
                toast({ variant: "destructive", title: "Upload Failed", description: error.message });
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                await addDoc(collection(firestore, 'library'), {
                    name: file.name,
                    url: downloadURL,
                    createdAt: serverTimestamp()
                });

                setIsLoading(false);
                setUploadProgress(null);
                toast({ title: "Upload Successful", description: `${file.name} has been added to the library.` });
                form.reset();
                onUploadComplete();
            }
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UploadCloud /> Upload to Library</CardTitle>
                <CardDescription>Add new study materials for your students.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Input id="file" type="file" {...form.register('file')} disabled={isLoading} />
                    {form.formState.errors.file && <p className="text-sm text-destructive">{form.formState.errors.file.message as string}</p>}
                    
                    {uploadProgress !== null && <Progress value={uploadProgress} className="w-full" />}
                    
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? `Uploading... ${uploadProgress?.toFixed(0)}%` : 'Upload File'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}


function LibraryFilesList() {
    const firestore = useFirestore();
    const query = useMemoFirebase(() => firestore ? collection(firestore, 'library') : null, [firestore]);
    const { data: files, isLoading } = useCollection<LibraryFile>(query);
    const { toast } = useToast();

    if (isLoading) {
        return <div className="space-y-4 mt-6">
            {[1, 2].map(i => <Skeleton key={i} className="h-20" />)}
        </div>;
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Library Content</CardTitle>
            </CardHeader>
            <CardContent>
                {files && files.length > 0 ? (
                    <div className="space-y-4">
                        {files.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds).map(file => (
                            <div key={file.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <FileIcon className="h-6 w-6 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">{file.name}</h3>
                                        <p className="text-sm text-muted-foreground">Uploaded on {format(file.createdAt.seconds * 1000, 'PPP')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 self-end sm:self-center">
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4 mr-2" /> Download</a>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => toast({title: "Delete coming soon"})}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No files in the library yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminLibraryPage() {
    const [key, setKey] = useState(0); // to force refresh the list
    return (
        <AdminShell
            pageTitle="Library Management"
            pageDescription="Upload and manage study materials like PDFs and audio files."
            headerIcon={<FileIcon className="h-8 w-8 text-primary" />}
        >
            <div className="grid grid-cols-1 gap-8">
                <UploadFileForm onUploadComplete={() => setKey(k => k + 1)} />
                <LibraryFilesList key={key} />
            </div>
        </AdminShell>
    );
}
