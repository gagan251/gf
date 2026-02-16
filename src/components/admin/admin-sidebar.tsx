'use client';

import { useAuth, useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import {
  BookOpen,
  FileText,
  Gauge,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  BookMarked,
  Keyboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/admin/courses', label: 'Courses', icon: FileText },
  { href: '/admin/live-classes', label: 'Live Classes', icon: BookOpen },
  { href: '/admin/playbooks', label: 'Playbooks', icon: BookMarked },
  { href: '/admin/stenotests', label: 'Steno Tests', icon: Keyboard },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
];

export function AdminSidebar() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 bg-sidebar text-sidebar-foreground p-4 border-r border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
                <p className="text-xl font-bold">Admin Panel</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
        </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 mt-8">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className={cn(
                "justify-start gap-3 px-3 py-6 text-sm h-auto transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary font-bold shadow-inner"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
              )}
            >
              <Link href={link.href}>
                <link.icon className="h-5 w-5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            </Button>
          )
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1 p-2">
        <Button asChild variant="ghost" className={cn("justify-start gap-3 px-3 text-sm h-auto transition-all duration-200 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1", pathname === '#' && "bg-primary/10 text-primary font-bold")} disabled>
          <Link href="#">
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">Settings</span>
          </Link>
        </Button>
         <Button asChild variant="ghost" className="justify-start gap-3 px-3 text-sm h-auto transition-all duration-200 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1">
          <Link href="/">
            <Home className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">Homepage</span>
          </Link>
        </Button>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="justify-start gap-3 px-3 text-sm h-auto text-red-500 hover:bg-red-500/10 hover:text-red-500 hover:translate-x-1 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
