'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import PageLoader from '@/components/ui/page-loader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  const isPublicAdminPage = ['/admin/login', '/admin/signup', '/admin/forgot-password'].includes(pathname);

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user state is loaded
    }

    if (isPublicAdminPage) {
        setIsCheckingRole(false);
        // if a logged-in user tries to access login page, redirect them to dashboard
        if (user) {
            router.replace('/admin/dashboard');
        }
        return;
    }

    if (!user) {
      router.replace('/admin/login');
      return;
    }

    const checkAdminRole = async () => {
      if (!firestore) return;
      setIsCheckingRole(true);
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          // If not an admin, sign out and redirect to home page.
          await signOut(auth);
          router.replace('/');
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        await signOut(auth);
        router.replace('/');
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();

  }, [user, isUserLoading, firestore, router, auth, isPublicAdminPage, pathname]);

  if (isUserLoading || (!isPublicAdminPage && isCheckingRole)) {
    return <PageLoader />;
  }

  if (!isPublicAdminPage && !isAdmin) {
    // Render a loader while redirecting to prevent content flashing
    return <PageLoader />;
  }
  
  return <>{children}</>;
}
