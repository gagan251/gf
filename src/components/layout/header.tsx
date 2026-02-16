
'use client';

import Link from 'next/link';
import { Phone, Clock, Mail, User, UserPlus, ChevronDown, Menu, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { SiteLogo } from '../site-logo';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


const NavItems = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    return (
        <>
            <Link href="/" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors" onClick={onLinkClick}>HOME</Link>
            <Link href="/about-us" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors" onClick={onLinkClick}>ABOUT US</Link>
            <Link href="/free-dictation" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors" onClick={onLinkClick}>FREE DICTATION</Link>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600 focus:outline-none">
                    COURSE <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link href="/enroll/typing">Typing Course</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/enroll/stenography">Stenography Course</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/#contact" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors" onClick={onLinkClick}>CONTACT US</Link>
        </>
    );
}


const AuthNav = ({ isMobile, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) => {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        if(onLinkClick) onLinkClick();
        await signOut(auth);
        router.push('/');
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

    if (isUserLoading) {
        return <Skeleton className="h-10 w-28" />;
    }
    
    if (user) {
        if (isMobile) {
            return (
                <div className="flex flex-col gap-4">
                    <div className="border-b border-gray-200 pb-4">
                        <p className="text-sm text-muted-foreground">Signed in as</p>
                        <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                    </div>
                    <nav className="flex flex-col gap-1 text-base font-medium">
                        <Link href="/dashboard" onClick={onLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                        <Link href="/dashboard/profile" onClick={onLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                            <User className="h-4 w-4" /> Profile
                        </Link>
                        <Link href="/dashboard/settings" onClick={onLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                            <Settings className="h-4 w-4" /> Settings
                        </Link>
                         <button onClick={handleSignOut} className="flex items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-all hover:bg-destructive/10 justify-start">
                            <LogOut className="h-4 w-4" /> Logout
                        </button>
                    </nav>
                </div>
            )
        }

        // Desktop version
        return (
             <div className="flex items-center gap-4 text-sm">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto">
                             <Avatar className="h-9 w-9">
                                <AvatarImage src={user.photoURL ?? undefined} />
                                <AvatarFallback>{getAvatarFallback(user?.displayName)}</AvatarFallback>
                            </Avatar>
                            <span className={cn("font-semibold", "hidden lg:inline")}>{user.displayName?.split(' ')[0] ?? 'Profile'}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                             <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }


    const unauthContainerClasses = isMobile ? "flex flex-col gap-6" : "flex items-center gap-4 text-sm";
    return (
        <nav className={unauthContainerClasses}>
            <Link href="/login" className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors" onClick={onLinkClick}>
                <User className="h-4 w-4 text-blue-600" />
                LOG IN
            </Link>
            <Link href="/signup" className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors" onClick={onLinkClick}>
                <UserPlus className="h-4 w-4 text-blue-600" />
                NEW USER? SIGN UP
            </Link>
        </nav>
    );
};


export function Header() {
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') { 
                if (window.scrollY > lastScrollY && window.scrollY > 100) { // if scroll down and past 100px
                    setVisible(false);
                } else { // if scroll up
                    setVisible(true);
                }
                setLastScrollY(window.scrollY); 
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar, { passive: true });

            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);
    
    return (
        <div className={cn(
            "bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ease-in-out",
            visible ? "translate-y-0" : "-translate-y-full"
            )}>
            {/* Top Bar */}
            <div className="py-2 border-b">
                <div className="container mx-auto flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 text-sm text-blue-700">
                    <a href="tel:+919671126006" className="flex items-center gap-2 hover:text-blue-900 transition-colors">
                        <Phone className="h-4 w-4" />
                        <span>+91-9671126006</span>
                    </a>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>8am to 9pm</span>
                    </div>
                    <a href="mailto:gagangorsi251@gmail.com" className="flex items-center gap-2 hover:text-blue-900 transition-colors">
                        <Mail className="h-4 w-4" />
                        <span>gagangorsi251@gmail.com</span>
                    </a>
                </div>
            </div>

            {/* Main Navigation */}
            <header className="container mx-auto flex justify-between items-center h-16">
                <div className="flex items-center gap-8">
                    <Link href="/">
                        <SiteLogo />
                    </Link>
                    <nav className="hidden md:flex items-center gap-4 text-sm">
                        <NavItems />
                    </nav>
                </div>
            
                <div className="hidden md:block">
                    <AuthNav />
                </div>

                <div className="md:hidden flex items-center">
                     <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                             <nav className="flex flex-col gap-6 pt-8 text-base">
                                <NavItems onLinkClick={() => setIsSheetOpen(false)} />
                                <div className="border-t pt-6">
                                     <AuthNav isMobile={true} onLinkClick={() => setIsSheetOpen(false)} />
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
        </div>
    );
}
