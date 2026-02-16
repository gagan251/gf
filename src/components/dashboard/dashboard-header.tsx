'use client';

import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import { SiteLogo } from '../site-logo';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export function DashboardHeader() {
    const { user } = useUser();
    const auth = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const getAvatarFallback = (name: string | null | undefined) => {
        if (!name?.trim()) return 'U';
        const parts = name.trim().split(' ').filter(Boolean); // Filter out empty strings
        if (parts.length > 1) {
            // Use first char of first part and first char of last part
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        if (parts.length === 1 && parts[0]) {
            // Use first char of the single part
            return parts[0][0].toUpperCase();
        }
        return 'U';
    };


    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard">
                  <SiteLogo />
                </Link>
                {user && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.photoURL ?? undefined} />
                                    <AvatarFallback>{getAvatarFallback(user?.displayName)}</AvatarFallback>
                                </Avatar>
                                <span>Welcome, {user.displayName?.split(' ')[0] ?? 'User'}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem asChild>
                                <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile"><UserIcon className="mr-2 h-4 w-4" /> Profile</Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:bg-red-50 focus:text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
