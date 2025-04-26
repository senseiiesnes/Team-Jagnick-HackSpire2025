'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MainNavigation from '@/components/MainNavigation';
import ChatArea from '@/components/ChatArea';
import ChatWelcome from '@/components/ChatWelcome';
import CommunityArea from '@/components/CommunityArea';
import BlogsArea from '@/components/BlogsArea';
import AllBlogs from '@/components/AllBlogs';
import BlogDetail from '@/components/BlogDetail';

export default function Home() {
  const [activeView, setActiveView] = useState<'ai' | 'community' | 'blogs'>('ai');
  const [isChatFocused, setIsChatFocused] = useState<boolean>(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Default closed on mobile
  const [isAllBlogsView, setIsAllBlogsView] = useState<boolean>(false);
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

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

  // Close sidebar on mobile when entering chat or blog detail view
  useEffect(() => {
    if ((isChatFocused || activeBlogId) && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [isChatFocused, activeBlogId]);

  // Handle scrolling of main content area
  useEffect(() => {
    const handleMainContentScroll = () => {
      if (mainContentRef.current) {
        // Any scroll effects for main content area can be added here
      }
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleMainContentScroll);
      return () => mainContent.removeEventListener('scroll', handleMainContentScroll);
    }
  }, []);

  const handleChatSelect = (chatId: string) => {
    setActiveView('ai'); // Ensure AI view is selected
    setIsChatFocused(true);
    setActiveChatId(chatId);
    setIsAllBlogsView(false);
    setActiveBlogId(null);
    
    // Auto-scroll to top when selecting a chat
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };

  const handleCloseChat = () => {
    setIsChatFocused(false);
    setActiveChatId(null);
  };

  const handleViewAllBlogs = () => {
    setActiveView('blogs');
    setIsAllBlogsView(true);
    setIsChatFocused(false);
    setActiveBlogId(null);
    
    // Auto-scroll to top when viewing all blogs
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };

  const handleBlogSelect = (blogId: string) => {
    setActiveView('blogs');
    setActiveBlogId(blogId);
    setIsAllBlogsView(false);
    setIsChatFocused(false);
    
    // Auto-scroll to top when selecting a blog
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };

  const handleCloseBlog = () => {
    setActiveBlogId(null);
    setIsAllBlogsView(true);
  };

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
        />
        
        {/* Main scrollable content */}
        <main 
          ref={mainContentRef}
          className="flex-1 flex flex-col overflow-y-auto"
        >
          {/* Only show navigation when not in chat or blog detail */}
          {!isChatFocused && !activeBlogId && (
            <div className="px-4 md:px-6 pt-4 md:pt-6">
              <MainNavigation activeView={activeView} setActiveView={setActiveView} />
            </div>
          )}
          
          {/* Content areas based on state */}
          <div className={`flex-1 ${activeBlogId || isChatFocused ? 'p-0' : 'p-4 md:p-6'}`}>
            {activeBlogId ? (
              <BlogDetail blogId={activeBlogId} onClose={handleCloseBlog} />
            ) : (
              <>
                {!isChatFocused ? (
                  <>
                    {activeView === 'ai' && <ChatWelcome onStartChat={() => handleChatSelect('new')} />}
                    {activeView === 'community' && <CommunityArea />}
                    {activeView === 'blogs' && (
                      isAllBlogsView ? (
                        <AllBlogs onBlogSelect={handleBlogSelect} />
                      ) : (
                        <BlogsArea onViewAll={handleViewAllBlogs} onBlogSelect={handleBlogSelect} />
                      )
                    )}
                  </>
                ) : (
                  <ChatArea 
                    chatId={activeChatId || 'new'} 
                    onClose={handleCloseChat}
                    isFocused={isChatFocused}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
