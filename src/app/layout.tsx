import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Bharat Communication Center',
  description: 'Typing Practice & Stenography Learning Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen font-sans bg-background antialiased',
          inter.variable
        )}
      >
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
          <Toaster />
      </body>
    </html>
  );
}
