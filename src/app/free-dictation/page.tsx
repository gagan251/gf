'use client';

import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StenoTest } from '@/lib/types';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const DictationTable = ({ tests, isLoading, error }: { tests: StenoTest[] | undefined, isLoading: boolean, error: any }) => {
    if (isLoading) {
        return <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
                <TableHeader className="bg-secondary">
                    <TableRow>
                        {[...Array(7)].map((_, i) => <TableHead key={i}><Skeleton className="h-5" /></TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            {[...Array(7)].map((_, j) => (
                                <TableCell key={j}><Skeleton className="h-6" /></TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    }

    if (error) {
         return (
            <div className="text-center py-8 text-destructive border rounded-lg">
                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                <p>Could not load tests. You may need to be logged in to view this content.</p>
            </div>
        );
    }
    
    if (!tests || tests.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No Tests Found</h3>
                <p className="text-muted-foreground mt-2">No free tests are available for this language yet.</p>
            </div>
        );
    }
    
    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
                <TableHeader className="bg-secondary">
                    <TableRow>
                        <TableHead className="w-[50px] font-bold text-foreground">S.NO.</TableHead>
                        <TableHead className="font-bold text-foreground">DATE</TableHead>
                        <TableHead className="font-bold text-foreground">LANGUAGE</TableHead>
                        <TableHead className="font-bold text-foreground">TEST NAME</TableHead>
                        <TableHead className="font-bold text-foreground">DICTATION SPEED</TableHead>
                        <TableHead className="font-bold text-foreground">DURATION</TableHead>
                        <TableHead className="text-center font-bold text-foreground">ACTION</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tests.map((test, index) => (
                        <TableRow key={test.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{test.createdAt ? format(test.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                            <TableCell>{test.language}</TableCell>
                            <TableCell>{test.title}</TableCell>
                            <TableCell>{test.speed}</TableCell>
                            <TableCell>{test.duration}</TableCell>
                            <TableCell className="text-center">
                                <Button asChild className="bg-green-500 text-white hover:bg-green-600">
                                    <Link href={`/dashboard/steno-practice/${test.id}`}>
                                        <Play className="mr-2 h-4 w-4" />
                                        Start Practice
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};


export default function FreeDictationPage() {
    const firestore = useFirestore();

    const freeTestsQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'stenoTests'), where('isFree', '==', true)) : null, 
    [firestore]);
    
    const { data: freeTests, isLoading, error } = useCollection<StenoTest>(freeTestsQuery);

    const englishTests = freeTests?.filter(test => test.language?.toLowerCase().includes('english'));
    const hindiTests = freeTests?.filter(test => test.language?.toLowerCase().includes('hindi'));
    
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-extrabold tracking-tight sm:text-4xl">Free Dictation</CardTitle>
              <CardDescription className="mt-4 text-lg text-muted-foreground">
                Practice with our free dictation tests to improve your speed and accuracy.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="english" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                        <TabsTrigger value="english">English</TabsTrigger>
                        <TabsTrigger value="hindi">Hindi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="english" className="mt-6">
                        <DictationTable tests={englishTests} isLoading={isLoading} error={error} />
                    </TabsContent>
                    <TabsContent value="hindi" className="mt-6">
                        <DictationTable tests={hindiTests} isLoading={isLoading} error={error} />
                    </TabsContent>
                </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
