'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTheme } from 'next-themes';
import { useUser, errorEmitter, useAuth } from '@/firebase';
import { updateProfile, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Moon, Sun, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must not be longer than 50 characters." }),
});

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    values: {
        displayName: user?.displayName ?? '',
    }
  });

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!auth.currentUser) return;
    setIsSavingName(true);
    try {
      await updateProfile(auth.currentUser, { displayName: values.displayName });
      errorEmitter.emit('profile-updated');
      toast({
        title: "Profile updated",
        description: "Your display name has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile.",
      });
    } finally {
      setIsSavingName(false);
    }
  }

  async function handlePasswordReset() {
    if (!user?.email) {
        toast({ variant: 'destructive', title: 'Error', description: 'No email address found for this user.' });
        return;
    };
    setIsSendingEmail(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox to reset your password.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send password reset email. Please try again later.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  }

  async function handleDeleteAccount() {
    if (!auth.currentUser) return;
    setIsDeleting(true);
    try {
      await deleteUser(auth.currentUser);
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: error.message || "There was an error deleting your account.",
      });
    } finally {
      setIsDeleting(false);
    }
  }


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and site settings.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span>Dark Mode</span>
            </Label>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your public profile information.</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onProfileSubmit)}>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isSavingName}>
                        {isSavingName && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold">Password</h4>
                    <p className="text-sm text-muted-foreground">Reset your password via email.</p>
                </div>
                <Button variant="outline" onClick={handlePasswordReset} disabled={isSendingEmail}>
                    {isSendingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Email
                </Button>
            </div>
        </CardContent>
      </Card>
      
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Yes, delete account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </CardContent>
      </Card>

    </div>
  );
}
