'use client';

import React from 'react';
import MainNavigation from '@/components/MainNavigation';
import ChatWelcome from '@/components/ChatWelcome';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  // The layout will handle the sidebar and header
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