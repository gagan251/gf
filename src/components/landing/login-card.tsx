'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/firebase';
import { LayoutDashboard } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useState, useEffect } from 'react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.94 11c-.04-.69-.1-1.38-.1-2.06 0-1.23.23-2.4.63-3.49-.4-.89-.9-1.74-1.49-2.51l-2.02 1.63c.2.62.35 1.28.44 1.96h-4.39v3.47h6.64c-.23 1.07-.69 2.03-1.38 2.8l-2.02 1.63c1.23-1.14 2.1-2.73 2.4-4.43z" />
    <path d="M3.06 13A8.99 8.99 0 0 0 12 21.9a8.97 8.97 0 0 0 6.94-3.23l-2.02-1.63A5.4 5.4 0 0 1 12 18.5a5.4 5.4 0 0 1-5.04-3.56H3.06z" />
    <path d="M12 5.5a5.4 5.4 0 0 1 3.79 1.43l2.25-2.25A9 9 0 0 0 3.06 7l3.9 3.04A5.4 5.4 0 0 1 12 5.5z" />
  </svg>
);

export function LoginCard() {
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isUserLoading) {
    return (
      <Card className="w-full max-w-sm bg-card/70 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Skeleton className="h-7 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-1/3 mx-auto mt-2" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (user) {
    return (
      <Card className="w-full max-w-sm bg-card/70 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>{user.displayName || 'Student'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm bg-card/70 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle>Student Login</CardTitle>
        <CardDescription>Access your dashboard</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" asChild>
          <Link href="/login">Student Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">
            <GoogleIcon className="mr-2 h-4 w-4" /> Google Login
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t" />
          <span className="text-xs uppercase text-muted-foreground">Or</span>
          <div className="flex-1 border-t" />
        </div>
        <Button variant="ghost" asChild>
          <Link href="/admin/login">Admin Login</Link>
        </Button>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <p className="text-center text-sm text-muted-foreground">
          New here? Start with Enroll Now.
        </p>
        <Button className="w-full" asChild>
          <Link href="/signup">Enroll Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
