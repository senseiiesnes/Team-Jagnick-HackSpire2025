'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type MainNavViewType = 'blogs' | 'ai' | 'community';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const [activeView, setActiveView] = useState<MainNavViewType>('ai');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isChatFocused, setIsChatFocused] = useState<boolean>(false);
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  // Initialize sidebar state based on screen size
  useEffect(() => {
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

  // Set active view based on pathname
  useEffect(() => {
    if (pathname.includes('/blogs')) {
      setActiveView('blogs');
    } else if (pathname.includes('/community')) {
      setActiveView('community');
    } else {
      setActiveView('ai');
    }
    
    // Check if we're in chat or blog detail view
    setIsChatFocused(pathname.includes('/chat/'));
    setActiveBlogId(pathname.includes('/blogs/') ? pathname.split('/').pop() || null : null);
  }, [pathname]);

  const handleChatSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleBlogSelect = (blogId: string) => {
    router.push(`/blogs/${blogId}`);
  };

  const handleViewAllBlogs = () => {
    router.push('/blogs');
  };

  const handleNavigate = (view: 'settings' | 'connect') => {
    router.push(`/${view}`);
  };

  const handleHome = () => {
    // Go to main home page with navigation tabs
    router.push('/home');
  };

  const handleCloseChat = () => {
    // Go to main home page with navigation tabs
    router.push('/home');
  };

  const handleCloseBlog = () => {
    router.push('/blogs');
  };

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
  if (status === "authenticated") {
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
          onChatSelect={handleChatSelect}
          onBlogSelect={handleBlogSelect}
          onViewAllBlogs={handleViewAllBlogs}
          onNavigate={handleNavigate}
          onHome={handleHome}
          className="fixed md:sticky top-0 h-screen z-30"
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* TopBar - Always sticky at top */}
          <TopBar
            isChatFocused={isChatFocused}
            onCloseChat={handleCloseChat}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isBlogDetailView={!!activeBlogId}
            onCloseBlog={handleCloseBlog}
            onNavigate={handleNavigate}
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