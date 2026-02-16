'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck } from 'lucide-react';
import PageLoader from '@/components/ui/page-loader';
import Link from 'next/link';
import { SiteLogo } from '@/components/site-logo';

export default function VerifyNoticePage() {
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isUserLoading) return;

        if (!user) {
            router.replace('/login');
            return;
        }

        if (user.emailVerified) {
            router.replace('/dashboard');
            return;
        }

        const interval = setInterval(async () => {
            if (auth.currentUser) {
                try {
                    await auth.currentUser.reload();
                    if (auth.currentUser.emailVerified) {
                        clearInterval(interval);
                        toast({ title: "Email Verified!", description: "Redirecting to your dashboard." });
                        router.push('/dashboard');
                    }
                } catch (e) {
                    // This could happen if the user token expired.
                    // The onAuthStateChanged listener in the provider should handle the sign-out.
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [user, isUserLoading, auth, router, toast]);

    const handleResend = async () => {
        if (!user) return;
        setIsSending(true);
        try {
            await sendEmailVerification(user);
            toast({ title: 'Verification Email Sent', description: 'A new verification link has been sent to your email.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to send verification email.' });
        } finally {
            setIsSending(false);
        }
    };
    
    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/login');
    };

    if (isUserLoading || !user || (user && user.emailVerified)) {
        return <PageLoader />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
             <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                <Link href="/" className="mb-4 inline-flex items-center gap-2">
                    <SiteLogo />
                </Link>
                </div>
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <MailCheck className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                        <CardDescription>
                            We've sent a verification link to <strong>{user.email}</strong>. Please check your inbox and click the link to activate your account.
                            This page will redirect automatically once you are verified.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Waiting for verification...
                        </div>
                        <Button onClick={handleResend} className="w-full" disabled={isSending}>
                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Resend Verification Email
                        </Button>
                        <Button variant="outline" onClick={handleSignOut} className="w-full">
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
