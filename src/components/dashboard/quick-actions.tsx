'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight, BookOpen, User, Keyboard, Library } from 'lucide-react';

const actions = [
  {
    href: '/#courses',
    title: 'Explore Courses',
    icon: BookOpen,
  },
  {
    href: '/dashboard/typing',
    title: 'Start Typing Practice',
    icon: Keyboard,
  },
  {
    href: '/dashboard/materials',
    title: 'Open Library',
    icon: Library,
  },
  {
    href: '/dashboard/profile',
    title: 'Update Profile',
    icon: User,
  },
];

export function QuickActions() {
  return (
    <section>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.href} className="group">
            <Card className="flex h-full flex-col items-center justify-center p-4 text-center transition-all duration-300 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <action.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">{action.title}</p>
              <ArrowRight className="mt-2 h-4 w-4 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
