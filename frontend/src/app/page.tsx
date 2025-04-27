'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RootPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect to main auth homepage with navigation tabs
      router.push('/home');
    } else if (status === 'unauthenticated') {
      router.push('/landing');
    }
    // If status is 'loading', wait for the check to complete
  }, [router, status]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-600 dark:text-gray-400">
        Redirecting...
        </div>
    </div>
  );
}
