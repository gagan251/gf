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
import { Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { SiteLogo } from '@/components/site-logo';

export default function AdminSignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;
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

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        firstName,
        lastName,
        displayName,
        email: user.email,
        role: 'admin', // Assign 'admin' role
      };
      
      setDocumentNonBlocking(userDocRef, userData, { merge: true });

      toast({
        title: 'Admin Account Created',
        description: 'Redirecting to the admin dashboard...',
      });

      router.push('/admin/dashboard');
    } catch (error: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email is already in use. Please log in.';
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
    <div className="admin-dashboard-theme flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <SiteLogo />
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Admin Account</CardTitle>
            <CardDescription>
              For authorized personnel only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    name="first-name"
                    type="text"
                    placeholder="Admin"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">User</Label>
                  <Input
                    id="last-name"
                    name="last-name"
                    type="text"
                    placeholder="User"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Admin Account
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an admin account?{' '}
              <Link
                href="/admin/login"
                className={
                  isLoading
                    ? 'pointer-events-none text-muted-foreground'
                    : 'underline hover:text-primary'
                }
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
