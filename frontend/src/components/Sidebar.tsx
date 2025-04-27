import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  ended: boolean;
  feeling_better?: boolean;
  previewMessage: string;
}

interface SidebarProps {
  activeView: 'ai' | 'community' | 'blogs';
  onChatSelect: (chatId: string) => void;
  onBlogSelect: (blogId: string) => void;
  onViewAllBlogs: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
  onNavigate?: (view: 'settings' | 'connect') => void;
  onHome?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onChatSelect, 
  onBlogSelect,
  onViewAllBlogs,
  isOpen, 
  setIsOpen,
  className = '',
  onNavigate,
  onHome
}) => {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's chat history when component mounts
  useEffect(() => {
    if (session?.user?.id && activeView === 'ai') {
      fetchUserChats();
    }
  }, [session, activeView]);

  const fetchUserChats = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      // Fetch chats from our API that connects to MongoDB
      const response = await fetch(`/api/chat?limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      
      const data = await response.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format chat date
  const formatChatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // These would come from an API in a real app
  const recentBlogs = [
    { id: 'blog-1', title: 'Understanding Anxiety' },
    { id: 'blog-2', title: 'Mindfulness Meditation' },
    { id: 'blog-3', title: 'Building Resilience' },
  ];

  return (
    <aside 
      className={`${className} fixed inset-y-0 left-0 z-[60] w-72 h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col overflow-hidden
                 md:relative md:z-30
                 ${isOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:min-w-0 md:translate-x-0 md:border-r-0 md:opacity-0'}`}
    >
      <div className={`flex flex-col h-full ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {/* Close button for mobile */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden absolute top-6 right-0 p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 z-10"
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Top banner that matches TopBar height */}
        <div className="h-24 md:h-28 p-5 border-b dark:border-gray-700 mt-0 flex items-center justify-center">
          <button
            onClick={() => onNavigate && onNavigate('connect')}
            className="w-full py-2 px-3 flex flex-col items-center justify-center rounded-lg bg-gradient-to-r from-deep-purple to-medium-purple dark:from-muted-rose dark:to-pale-pink text-white dark:text-gray-900 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium text-sm">Connect & Discover</span>
            </div>
            <p className="text-xs text-white/80 dark:text-gray-800/80">Find support with others</p>
          </button>
        </div>
        
        {/* Static quick links */}
        <div className="p-5 border-b dark:border-gray-700">
          <ul className="space-y-3">
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onHome && onHome();
                }}
                className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate && onNavigate('settings');
                }}
                className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Profile Settings
              </a>
            </li>
          </ul>
        </div>
        
        {/* Dynamic content based on activeView */}
        <div className="flex-grow overflow-y-auto mt-3">
          {activeView === 'ai' && (
            <>
              <div className="px-5 py-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Recent Chats
                </h3>
                <button 
                  onClick={() => fetchUserChats()}
                  className="text-sm text-deep-purple dark:text-pale-pink hover:underline"
                >
                  Refresh
                </button>
              </div>
              
              {loading ? (
                <div className="p-5 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-purple dark:border-pale-pink mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading chats...</p>
                </div>
              ) : chats.length > 0 ? (
                <ul className="p-3 space-y-2">
                  {chats.map((chat) => (
                    <li 
                      key={chat.id}
                      className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => onChatSelect(chat.id)}
                    >
                      <div className="font-medium">{formatChatDate(chat.createdAt)}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{chat.previewMessage}</p>
                      <div className="mt-1 flex gap-2">
                        {chat.ended && (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                            Completed
                          </span>
                        )}
                        {chat.feeling_better && (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                            Feeling Better
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-5 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No chats yet</p>
                  <button 
                    onClick={() => onChatSelect('new')}
                    className="mt-3 px-4 py-2 bg-deep-purple dark:bg-pale-pink text-white dark:text-gray-900 rounded-md hover:bg-medium-purple dark:hover:bg-muted-rose transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              )}
            </>
          )}

          {activeView === 'community' && (
            <>
              <h3 className="px-5 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Your Communities
              </h3>
              <ul className="p-3 space-y-2">
                <li className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Anxiety Support Group
                </li>
                <li className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Meditation Circle
                </li>
                <li className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Mental Health Advocacy
                </li>
              </ul>
            </>
          )}

          {activeView === 'blogs' && (
            <>
              <div className="px-5 py-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Saved Blogs
                </h3>
                <button 
                  onClick={onViewAllBlogs}
                  className="text-sm text-deep-purple dark:text-pale-pink hover:underline"
                >
                  View All
                </button>
              </div>
              <ul className="p-3 space-y-2">
                {recentBlogs.map((blog) => (
                  <li 
                    key={blog.id}
                    className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    onClick={() => onBlogSelect(blog.id)}
                  >
                    {blog.title}
                  </li>
                ))}
              </ul>

              <h3 className="px-5 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4">
                Your Content
              </h3>
              <ul className="p-3 space-y-2">
                <li className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Saved Articles
                </li>
                <li className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Your Drafts
                </li>
                <li className="p-3 rounded-lg bg-deep-purple text-white dark:bg-muted-rose hover:bg-medium-purple dark:hover:bg-pale-pink transition-colors px-4 py-3 text-lg font-medium cursor-pointer mt-4 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Blog
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
