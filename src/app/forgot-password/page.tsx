'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox for instructions to reset your password.',
      });
    } catch (error: any) {
      console.error(error);
      let description = 'An error occurred. Please try again.';
      if (error.code === 'auth/user-not-found') {
        description = 'No user found with this email address.';
      }
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <SiteLogo className="h-8 w-8" />
            <span className="text-2xl font-bold">
              Bharat Communication Center
            </span>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              {emailSent
                ? 'Check your email for a reset link.'
                : 'Enter your email to receive a password reset link.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-4 text-muted-foreground">
                  An email has been sent to your address with instructions on how to reset your password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-primary">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
