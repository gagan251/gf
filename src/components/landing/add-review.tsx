'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters.'),
  rating: z.number().min(1, 'Please provide a rating.').max(5),
});

export function AddReview() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      feedback: '',
      rating: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Database Error',
        description: 'Could not connect to the database. Please try again later.',
      });
      setIsLoading(false);
      return;
    }

    const reviewsCollection = collection(firestore, 'reviews');
    addDocumentNonBlocking(reviewsCollection, {
      ...values,
      createdAt: serverTimestamp(),
    });

    setIsLoading(false);
    toast({
      title: 'Testimonial Submitted!',
      description: 'Thank you for your feedback.',
    });
    form.reset();
  }

  return (
    <section id="testimonials" className="container mx-auto">
      <div className="mb-12 text-center">
        <h2 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
          Leave a Testimonial
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Share your experience with our community.
        </p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Your Feedback</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                        <StarRating rating={field.value} onRatingChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you think about our courses..."
                        className="min-h-[120px]"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit Testimonial
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

function StarRating({ rating, onRatingChange, disabled }: { rating: number, onRatingChange: (rating: number) => void, disabled?: boolean }) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className={cn("flex items-center space-x-1", disabled && "cursor-not-allowed opacity-50")}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        'h-6 w-6 transition-colors',
                        !disabled && 'cursor-pointer',
                        (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                    onClick={() => !disabled && onRatingChange(star)}
                    onMouseEnter={() => !disabled && setHoverRating(star)}
                    onMouseLeave={() => !disabled && setHoverRating(0)}
                />
            ))}
        </div>
    )
}
