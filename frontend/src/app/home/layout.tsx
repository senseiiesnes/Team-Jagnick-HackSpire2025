'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(true);
  const [activeView, setActiveView] = React.useState<'blogs' | 'ai' | 'community'>('ai');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  // Initialize sidebar state based on screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Open by default on desktop
      } else {
        setIsSidebarOpen(false); // Closed by default on mobile
      }
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-deep-purple dark:border-pale-pink mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show the layout
  if (status === "authenticated" && session?.user) {
    return (
      <div className="relative h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            aria-hidden="true"
          />
        )}

        {/* Sidebar Component - Fixed on desktop, slide-in on mobile */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeView={activeView}
          onChatSelect={(chatId) => router.push(`/chat/${chatId}`)}
          onBlogSelect={(blogId) => router.push(`/blogs/${blogId}`)}
          onViewAllBlogs={() => router.push('/blogs')}
          onNavigate={(view) => router.push(`/${view}`)}
          onHome={() => router.push('/home')}
          className="fixed md:sticky top-0 h-screen z-30"
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* TopBar - Always sticky at top */}
          <TopBar
            isChatFocused={false}
            onCloseChat={() => router.push('/home')}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isBlogDetailView={false}
            onCloseBlog={() => router.push('/blogs')}
            onNavigate={(view) => router.push(`/${view}`)}
            user={session.user}
          />
          
          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return null;
} 