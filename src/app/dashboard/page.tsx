'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock, Play, AlertTriangle } from 'lucide-react';
import { StenoTest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function StudentDashboardPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const firestore = useFirestore();
    
    const testsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'stenoTests') : null, [firestore]);
    const { data: tests, isLoading, error } = useCollection<StenoTest>(testsQuery);

    const filteredTests = tests?.filter(test => 
        test.language?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.speed?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Input 
                placeholder="Search tests by language, name, or speed..." 
                className="max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button>Search</Button>
        </div>

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
                    {isLoading && (
                        <>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(7)].map((_, j) => (
                                        <TableCell key={j}><Skeleton className="h-6" /></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </>
                    )}
                    {error && (
                         <TableRow>
                            <TableCell colSpan={7}>
                                <Card className="mt-6 bg-destructive/10 border-destructive">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Access Denied</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>You do not have permission to view tests. Please ensure you are logged in.</p>
                                    </CardContent>
                                </Card>
                            </TableCell>
                         </TableRow>
                    )}
                    {!isLoading && !error && filteredTests.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No tests available. New tests will be added by the admin.
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && !error && filteredTests.map((test, index) => (
                        <TableRow key={test.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{test.createdAt ? format(test.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                            <TableCell>{test.language}</TableCell>
                            <TableCell>{test.title}</TableCell>
                            <TableCell>{test.speed}</TableCell>
                            <TableCell>{test.duration}</TableCell>
                            <TableCell className="text-center">
                                {test.isFree ? (
                                    <Button asChild className="bg-green-500 text-white hover:bg-green-600">
                                        <Link href={`/dashboard/steno-practice/${test.id}`}>
                                            <Play className="mr-2 h-4 w-4" />
                                            Start Practice
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button className="bg-blue-500 text-white hover:bg-blue-600">
                                        <Lock className="mr-2 h-4 w-4" />
                                        Paid Test
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  );
}
