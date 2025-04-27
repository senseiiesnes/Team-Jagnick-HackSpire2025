'use client';

import React from 'react';
import MainNavigation from '@/components/MainNavigation';
import AllBlogs from '@/components/AllBlogs';
import { useRouter } from 'next/navigation';

export default function BlogsPage() {
  const router = useRouter();
  
  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <MainNavigation
          activeView="blogs"
          setActiveView={(view) => {
            if (view === 'ai') {
              router.push('/');
            } else if (view === 'community') {
              router.push('/community');
            }
            // If 'blogs' is selected, we stay on the current page
          }}
        />
      </div>
      
      <div className="flex-1 p-4 md:p-6">
        <AllBlogs onBlogSelect={(blogId: string) => router.push(`/blogs/${blogId}`)} />
      </div>
    </div>
  );
} 