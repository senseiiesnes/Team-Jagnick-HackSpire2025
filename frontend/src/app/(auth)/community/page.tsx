'use client';

import React from 'react';
import MainNavigation from '@/components/MainNavigation';
import CommunityArea from '@/components/CommunityArea';
import { useRouter } from 'next/navigation';

export default function CommunityPage() {
  const router = useRouter();
  
  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <MainNavigation
          activeView="community"
          setActiveView={(view) => {
            if (view === 'ai') {
              router.push('/');
            } else if (view === 'blogs') {
              router.push('/blogs');
            }
            // If 'community' is selected, we stay on the current page
          }}
        />
      </div>
      
      <div className="flex-1 p-4 md:p-6">
        <CommunityArea />
      </div>
    </div>
  );
} 