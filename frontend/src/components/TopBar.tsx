import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string | null;
}

interface TopBarProps {
  onToggleSidebar: () => void;
  isChatFocused: boolean;
  onCloseChat: () => void;
  isBlogDetailView?: boolean;
  onCloseBlog?: () => void;
  onNavigate?: (view: 'settings' | 'connect') => void;
  user?: User;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onToggleSidebar, 
  isChatFocused, 
  onCloseChat, 
  isBlogDetailView = false,
  onCloseBlog,
  onNavigate,
  user
}) => {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate notification after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header 
      className={`sticky top-0 z-[55] transition-all duration-500 ${
        isChatFocused || isBlogDetailView ? 'h-16 md:h-20' : 'h-24 md:h-28'
      } ${
        scrolled ? 'shadow-xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80' : 'shadow-md bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900'
      } flex items-center justify-between px-4 md:px-8 w-full border-b border-gray-200 dark:border-gray-700`}
    >
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className={`relative mr-4 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transform transition-all duration-300 ${
            isChatFocused || isBlogDetailView ? 'scale-90' : 'scale-100 hover:scale-105'
          } ${
            !isChatFocused && !isBlogDetailView && 'after:content-[""] after:absolute after:-bottom-1 after:-right-1 after:w-2 after:h-2 after:bg-deep-purple dark:after:bg-pale-pink after:rounded-full'
          }`}
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6 text-deep-purple dark:text-pale-pink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        
        {isChatFocused ? (
          <div className="flex items-center">
            <button 
              onClick={onCloseChat}
              className="mr-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300 transform hover:scale-105"
              aria-label="Back to main view"
            >
              <svg 
                className="w-5 h-5 text-deep-purple dark:text-pale-pink" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
            </button>
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Active Chat</h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Started {formattedTime}
              </p>
            </div>
          </div>
        ) : isBlogDetailView ? (
          <div className="flex items-center">
            <button 
              onClick={onCloseBlog}
              className="mr-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300 transform hover:scale-105"
              aria-label="Back to blogs"
            >
              <svg 
                className="w-5 h-5 text-deep-purple dark:text-pale-pink" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Reading Blog</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Wellness Articles
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent drop-shadow-sm">
              MindMosaic
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium ml-1">
              Your mental wellness companion
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Date and Time */}
        <div className="hidden md:block text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formattedTime}
          </div>
        </div>
        
        {/* Search Bar - Only shown when not in chat or blog detail mode */}
        {!isChatFocused && !isBlogDetailView && (
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-40 lg:w-64 py-2.5 px-4 pr-10 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink transition-all duration-300 border border-gray-200 dark:border-gray-600"
            />
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
        
        {/* Notification bell */}
        <div className="relative">
          <button
            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300 transform hover:scale-105"
            aria-label="Notifications"
          >
            <svg
              className="w-5 h-5 text-deep-purple dark:text-pale-pink"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {showNotification && (
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-muted-rose animate-pulse ring-2 ring-white dark:ring-gray-800"></span>
            )}
          </button>
        </div>
        
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300 transform hover:scale-105"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg
              className="w-5 h-5 text-pale-pink"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-deep-purple"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
        
        {/* User Profile Menu */}
        {user && (
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <img 
                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name}
              </span>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                
                <a 
                  href="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile Settings
                </a>
                
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
