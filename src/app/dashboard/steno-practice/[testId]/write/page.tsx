'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, BarChart3, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StenoTest } from '@/lib/types';
import PageLoader from '@/components/ui/page-loader';


type EvaluationResult = {
  wpm: number;
  accuracy: number;
  diff: { type: 'correct' | 'incorrect' | 'missing' | 'extra'; original?: string, submitted?: string }[];
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
};

const ResultDisplay = ({ result, onTryAgain, originalText }: { result: EvaluationResult; onTryAgain: () => void; originalText: string }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3/> Evaluation Result</CardTitle>
                <CardDescription>Here is the analysis of your transcription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Typing Speed</p>
                        <p className="text-3xl font-bold">{result.wpm} <span className="text-lg font-normal">WPM</span></p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-3xl font-bold">{result.accuracy.toFixed(1)}<span className="text-lg font-normal">%</span></p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Correct Words</p>
                        <div className="flex items-center gap-2">
                             <Check className="h-6 w-6 text-green-500"/>
                             <p className="text-3xl font-bold">{result.correctWords}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Incorrect Words</p>
                         <div className="flex items-center gap-2">
                             <X className="h-6 w-6 text-red-500"/>
                             <p className="text-3xl font-bold">{result.incorrectWords}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border rounded-md space-y-2 bg-secondary/30 max-h-60 overflow-y-auto">
                    <h4 className="font-semibold">Your Transcription:</h4>
                    <p className="text-base leading-relaxed font-krutidev">
                        {result.diff.map((item, index) => {
                            if (item.type === 'correct') {
                                return <span key={index} className="text-green-600 bg-green-100/60 dark:bg-green-900/60 px-1 rounded">{item.submitted} </span>
                            }
                            if (item.type === 'incorrect') {
                                return <span key={index} className="text-red-600 bg-red-100/60 dark:bg-red-900/60 px-1 rounded line-through" title={`Should be: ${item.original}`}>{item.submitted} </span>
                            }
                            if (item.type === 'extra') {
                                return <span key={index} className="text-purple-600 bg-purple-100/60 dark:bg-purple-900/60 px-1 rounded line-through">{item.submitted} </span>
                            }
                            if(item.type === 'missing') {
                                 return <span key={index} className="text-orange-600 bg-orange-100/60 dark:bg-orange-900/60 px-1 rounded" title="This word was missing">{item.original} </span>
                            }
                            return '';
                        })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Hover over red words to see the correct version. Purple words are extra words you typed. Orange words were missed.</p>
                </div>
                 <div className="p-4 border rounded-md space-y-2 bg-secondary/30 max-h-60 overflow-y-auto">
                    <h4 className="font-semibold">Original Text:</h4>
                    <p className="text-base leading-relaxed font-krutidev text-muted-foreground">
                        {originalText}
                    </p>
                 </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={onTryAgain}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function StenoWritingPage() {
    const params = useParams();
    const testId = params.testId as string;
    const firestore = useFirestore();

    const testRef = useMemoFirebase(() => firestore ? doc(firestore, 'stenoTests', testId) : null, [firestore, testId]);
    const { data: testData, isLoading: isTestLoading, error } = useDoc<StenoTest>(testRef);

    const [transcription, setTranscription] = useState("");
    const [result, setResult] = useState<EvaluationResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const originalText = useMemo(() => testData?.originalText || "", [testData]);

    if (isTestLoading) {
        return <PageLoader />;
    }
    
    if (error || !testData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{error ? 'Error' : 'Test Not Found'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error ? "There was an error loading the test." : "The test you are looking for does not exist."}</p>
                    <Button asChild variant="link"><Link href="/dashboard">Return to Dashboard</Link></Button>
                </CardContent>
            </Card>
        )
    }

    const handleEvaluate = () => {
        setIsSubmitting(true);

        const originalWords = originalText.trim().split(/\s+/);
        const submittedWords = transcription.trim().split(/\s+/).filter(w => w.length > 0);
        
        let correctWords = 0;
        const diff: EvaluationResult['diff'] = [];

        const maxLength = Math.max(originalWords.length, submittedWords.length);

        for (let i = 0; i < maxLength; i++) {
            const originalWord = originalWords[i];
            const submittedWord = submittedWords[i];

            if (submittedWord === undefined) {
                diff.push({ type: 'missing', original: originalWord });
            } else if (originalWord === undefined) {
                diff.push({ type: 'extra', submitted: submittedWord });
            } else if (submittedWord.toLowerCase() === originalWord.toLowerCase()) {
                diff.push({ type: 'correct', original: originalWord, submitted: submittedWord });
                correctWords++;
            } else {
                diff.push({ type: 'incorrect', original: originalWord, submitted: submittedWord });
            }
        }
        
        const incorrectWords = originalWords.length - correctWords + diff.filter(d => d.type === 'extra').length;

        const parseDuration = (durationStr: string = "0 Minutes") => parseInt(durationStr.split(' ')[0], 10);
        const durationMinutes = parseDuration(testData.duration);
        const wpm = durationMinutes > 0 ? Math.round(submittedWords.length / durationMinutes) : 0;
        const accuracy = originalWords.length > 0 ? (correctWords / originalWords.length) * 100 : 0;
        
        setResult({ wpm, accuracy, diff, totalWords: originalWords.length, correctWords, incorrectWords: incorrectWords < 0 ? 0 : incorrectWords });
        setIsSubmitting(false);
    };

    const handleTryAgain = () => {
        setResult(null);
        setTranscription("");
    }

    const isHindi = (testData.language || '').toLowerCase().includes('hindi');

    if (result) {
        return <ResultDisplay result={result} onTryAgain={handleTryAgain} originalText={originalText} />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transcription Pad for "{testData.title}"</CardTitle>
                <CardDescription>
                    Write down the text from the audio you just heard.
                    When you are finished, click the submit button for evaluation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Start typing your transcription here..."
                    className={cn(
                        "min-h-[400px] text-base",
                        isHindi && "font-krutidev" 
                    )}
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    disabled={isSubmitting}
                />
            </CardContent>
            <CardFooter className="justify-end">
                 <Button onClick={handleEvaluate} disabled={transcription.length === 0 || isSubmitting}>
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Evaluation
                </Button>
            </CardFooter>
        </Card>
    );
}
