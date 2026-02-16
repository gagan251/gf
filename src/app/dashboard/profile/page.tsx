'use client';

import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();

  const getAvatarFallback = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your account settings and profile picture.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
            <AvatarFallback className="text-4xl">
              {getAvatarFallback(user?.email)}
            </AvatarFallback>
          </Avatar>
          
          <Button onClick={() => toast({ title: "Coming Soon!", description: "This feature is under development."})}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Picture
          </Button>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={user?.displayName ?? ''} disabled />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user?.email ?? ''} disabled />
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
