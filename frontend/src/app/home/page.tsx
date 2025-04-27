'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MainNavigation from '@/components/MainNavigation';
import ChatWelcome from '@/components/ChatWelcome';

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-deep-purple dark:border-pale-pink mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex-1 flex flex-col">
        <div className="px-4 md:px-6 pt-4 md:pt-6">
          <MainNavigation
            activeView="ai"
            setActiveView={(view) => {
              if (view === 'blogs') {
                router.push('/blogs');
              } else if (view === 'community') {
                router.push('/community');
              }
              // If 'ai' is selected, we stay on the current page
            }}
          />
        </div>
        
        <div className="flex-1 p-4 md:p-6">
          <ChatWelcome onStartChat={() => router.push('/chat/new')} />
        </div>
      </div>
    );
  }

  return null;
} 