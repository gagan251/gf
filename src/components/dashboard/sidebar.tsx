'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  ChevronDown,
  List,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

const sscLinks = [
    { href: '/dashboard/tests/ssc-hindi', label: 'Hindi' },
    { href: '/dashboard/tests/ssc-krutidev', label: 'KrutiDev' },
    { href: '/dashboard/tests/ssc-inscript', label: 'Inscript' },
    { href: '/dashboard/tests/ssc-english', label: 'English' },
];

const courtLinks = [
    { href: '/dashboard/tests/court-hindi', label: 'Hindi' },
    { href: '/dashboard/tests/court-krutidev', label: 'KrutiDev' },
];


export function Sidebar() {
  const pathname = usePathname();
  const [isSscOpen, setIsSscOpen] = useState(true);
  const [isCourtOpen, setIsCourtOpen] = useState(true);

  return (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
        <nav className="flex-1 space-y-1 p-2">
            <Link href="/" className={cn("flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium", pathname === '/dashboard' ? 'bg-primary/80' : 'hover:bg-primary/90')}>
                <Home className="h-5 w-5"/>
                <span>Home</span>
            </Link>

            <Collapsible open={isSscOpen} onOpenChange={setIsSscOpen} className='rounded-md hover:bg-primary/90 data-[state=open]:bg-primary/90'>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium">
                    <div className='flex items-center gap-3'>
                        <List className="h-5 w-5" />
                        <span>SSC</span>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 transition-transform", isSscOpen && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 space-y-1 py-1 pr-2">
                    {sscLinks.map(link => (
                        <Link key={link.href} href={link.href} className={cn("block rounded-md py-2 px-3 text-sm", pathname === link.href ? 'bg-primary/80 font-semibold' : 'hover:bg-primary/80')}>
                            {link.label}
                        </Link>
                    ))}
                </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isCourtOpen} onOpenChange={setIsCourtOpen} className='rounded-md hover:bg-primary/90 data-[state=open]:bg-primary/90'>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium">
                     <div className='flex items-center gap-3'>
                        <List className="h-5 w-5" />
                        <span>Court</span>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 transition-transform", isCourtOpen && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 space-y-1 py-1 pr-2">
                     {courtLinks.map(link => (
                        <Link key={link.href} href={link.href} className={cn("block rounded-md py-2 px-3 text-sm", pathname === link.href ? 'bg-primary/80 font-semibold' : 'hover:bg-primary/80')}>
                            {link.label}
                        </Link>
                    ))}
                </CollapsibleContent>
            </Collapsible>

        </nav>
    </div>
  );
}
