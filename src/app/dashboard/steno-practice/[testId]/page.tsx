'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Keyboard, Play, Pause, Clock, RefreshCw, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { StenoTest } from '@/lib/types';
import PageLoader from '@/components/ui/page-loader';
import { format } from 'date-fns';

export default function StenoListeningPage() {
    const { toast } = useToast();
    const params = useParams();
    const testId = params.testId as string;
    const firestore = useFirestore();

    const testRef = useMemoFirebase(() => firestore ? doc(firestore, 'stenoTests', testId) : null, [firestore, testId]);
    const { data: testData, isLoading: isTestLoading, error } = useDoc<StenoTest>(testRef);

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioActive, setIsAudioActive] = useState(false);

    const parseDuration = (durationStr: string = "0 Minutes") => {
        const parts = durationStr.split(' ');
        if (parts.length < 2 || isNaN(parseInt(parts[0], 10))) {
            return 0;
        }
        return parseInt(parts[0], 10) * 60;
    };

    const totalDuration = useMemo(() => parseDuration(testData?.duration), [testData?.duration]);
    const [timeLeft, setTimeLeft] = useState(totalDuration);

    useEffect(() => {
        setTimeLeft(totalDuration);
    }, [totalDuration]);

    const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;
    
    // Timer logic
    useEffect(() => {
        if (!isAudioActive || timeLeft <= 0) {
            if(timeLeft <= 0) {
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                }
                toast({ title: "Audio Finished", description: "Time to write your transcription." });
            }
            return;
        };

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [isAudioActive, timeLeft, toast]);

    if (isTestLoading) {
        return <PageLoader />;
    }

    if (error || !testData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{error ? 'Error Loading Test' : 'Test Not Found'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error ? 'There was an error loading the test. You may not have permission to view it.' : 'The test you are looking for does not exist.'}</p>
                    <Button asChild variant="link"><Link href="/dashboard">Return to Dashboard</Link></Button>
                </CardContent>
            </Card>
        )
    }

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            setIsAudioActive(false);
        } else {
            audioRef.current.play().catch(e => toast({ variant: 'destructive', title: "Audio Error", description: "Could not play audio."}));
            setIsPlaying(true);
            setIsAudioActive(true);
        }
    };

    const handleReset = () => {
        if(audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setIsAudioActive(false);
        setTimeLeft(totalDuration);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="bg-secondary">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <Keyboard className="h-6 w-6 text-primary" />
                        <span>Stenography Practice: Listening</span>
                    </CardTitle>
                    <CardDescription>
                        {testData.title} - {testData.speed}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="p-4 border rounded-lg bg-card/50 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Button onClick={handlePlayPause} size="icon" className="h-12 w-12 rounded-full" disabled={!testData.audioUrl}>
                                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                </Button>
                                <div>
                                    <h3 className="font-semibold">Dictation Audio</h3>
                                    <p className="text-sm text-muted-foreground">{testData.audioUrl ? "Press play to begin listening." : "No audio file linked to this test."}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-lg font-medium tabular-nums text-primary">
                                <Clock className="h-5 w-5" />
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <audio ref={audioRef} src={testData.audioUrl} onEnded={() => {
                            setIsPlaying(false);
                            setIsAudioActive(false);
                        }} />
                    </div>
                </CardContent>
                <CardFooter className="bg-secondary/50 p-6 flex justify-between">
                    <Button variant="outline" onClick={handleReset}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                    <Button asChild>
                        <Link href={`/dashboard/steno-practice/${testId}/write`}>
                            Proceed to Writing <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
