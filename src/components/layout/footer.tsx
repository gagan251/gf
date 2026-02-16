'use client';

import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { SiteLogo } from '../site-logo';

export function Footer() {
  return (
    <footer className="bg-card" id="contact">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <SiteLogo />
            </Link>
            <p className="text-sm text-muted-foreground">Your destination for typing and stenography excellence.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4" />
                <span>+91 12345 67890</span>
              </a>
              <a href="mailto:gagangorsi251@gmail.com" className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" />
                <span>gagangorsi251@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Legal</h3>
            <div className="flex flex-col space-y-2 text-sm">
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Bharat Communication Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
