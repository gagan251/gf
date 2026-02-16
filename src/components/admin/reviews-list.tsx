'use client';

import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, User, Calendar, Check, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

type Review = {
    id: string;
    name: string;
    rating: number;
    feedback: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | null;
};

function ReviewCard({ review }: { review: Review }) {
    const { toast } = useToast();

    const renderStars = () => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                className={`h-5 w-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`}
            />
        ));
    };
    
    const formattedDate = review.createdAt
    ? formatDistanceToNow(new Date(review.createdAt.seconds * 1000), { addSuffix: true })
    : 'Just now';


    return (
        <Card className="bg-card/50">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5" />
                            {review.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                            {renderStars()}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>{review.feedback}</span>
                </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => toast({ title: "Coming Soon!", description: "This feature is under development."})}>
                    <Check className="h-4 w-4 mr-2" /> Approve
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toast({ title: "Coming Soon!", description: "This feature is under development."})}>
                    <EyeOff className="h-4 w-4 mr-2" /> Hide
                </Button>
            </CardFooter>
        </Card>
    );
}


export function ReviewsList() {
    const firestore = useFirestore();
    const reviewsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'reviews');
    }, [firestore]);

    const { data: reviews, isLoading, error } = useCollection<Review>(reviewsQuery);

    const totalReviews = reviews?.length ?? 0;
    const averageRating = reviews && reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;
    
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    <p>You do not have permission to view reviews.</p>
                    <p className="text-xs mt-2">Please contact your administrator to get the 'admin' role assigned to your user account.</p>
                </AlertDescription>
            </Alert>
        );
    }
    
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No Reviews Yet</h3>
                <p className="text-muted-foreground mt-2">When users submit reviews, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className="flex items-center gap-4 sm:gap-8 text-center bg-card/30 p-4 rounded-lg">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{totalReviews}</p>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                        <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                {reviews.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
}
