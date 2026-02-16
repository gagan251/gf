'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { SiteLogo } from '@/components/site-logo';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const displayName = `${firstName} ${lastName}`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName });
      await sendEmailVerification(user);

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        firstName,
        lastName,
        displayName,
        email: user.email,
        phone,
        role: 'student',
      };
      
      setDocumentNonBlocking(userDocRef, userData, { merge: true });

      router.push('/dashboard');

    } catch (error: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description =
          'This email is already in use. Please use a different email or log in.';
      } else if (error.code === 'auth/weak-password') {
        description = 'The password is too weak. Please use a stronger password.';
      }
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <SiteLogo />
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to sign up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" name="first-name" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" name="last-name" required disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required disabled={isLoading}/>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
