import React from 'react';

interface SidebarProps {
  activeView: 'ai' | 'community' | 'blogs';
  onChatSelect: (chatId: string) => void;
  onBlogSelect: (blogId: string) => void;
  onViewAllBlogs: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onChatSelect, 
  onBlogSelect,
  onViewAllBlogs,
  isOpen, 
  setIsOpen,
  className = '' 
}) => {
  // These would come from an API in a real app
  const recentBlogs = [
    { id: 'blog-1', title: 'Understanding Anxiety' },
    { id: 'blog-2', title: 'Mindfulness Meditation' },
    { id: 'blog-3', title: 'Building Resilience' },
  ];

  return (
    <aside 
      className={`${className} fixed inset-y-0 left-0 z-30 w-64 h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col overflow-hidden
                 md:relative
                 ${isOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:min-w-0 md:translate-x-0 md:border-r-0 md:opacity-0'}`}
    >
      <div className={`flex flex-col h-full ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {/* Close button for mobile */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Quick links section */}
        <div className="p-4 border-b dark:border-gray-700">
          <a href="#" className="text-deep-purple dark:text-pale-pink hover:underline font-medium">
            Want help?
          </a>
        </div>
        
        {/* Static quick links */}
        <div className="p-4 border-b dark:border-gray-700">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get Help
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </a>
            </li>
          </ul>
        </div>
        
        {/* Dynamic content based on activeView */}
        <div className="flex-grow overflow-y-auto mt-2">
          {activeView === 'ai' && (
            <>
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Recent Chats
              </h3>
              <ul className="p-2 space-y-1">
                <li 
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => onChatSelect('chat-1')}
                >
                  Chat session 1
                </li>
                <li 
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => onChatSelect('chat-2')}
                >
                  Check-in with MindMosaic
                </li>
                <li 
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => onChatSelect('chat-3')}
                >
                  Weekly mood tracker
                </li>
                <li 
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => onChatSelect('chat-4')}
                >
                  Goal setting session
                </li>
              </ul>
            </>
          )}

          {activeView === 'community' && (
            <>
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Your Communities
              </h3>
              <ul className="p-2 space-y-1">
                <li className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Anxiety Support Group
                </li>
                <li className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Meditation Circle
                </li>
                <li className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Mental Health Advocacy
                </li>
              </ul>
            </>
          )}

          {activeView === 'blogs' && (
            <>
              <div className="px-4 py-2 flex justify-between items-center">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Saved Blogs
                </h3>
                <button 
                  onClick={onViewAllBlogs}
                  className="text-xs text-deep-purple dark:text-pale-pink hover:underline"
                >
                  View All
                </button>
              </div>
              <ul className="p-2 space-y-1">
                {recentBlogs.map((blog) => (
                  <li 
                    key={blog.id}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    onClick={() => onBlogSelect(blog.id)}
                  >
                    {blog.title}
                  </li>
                ))}
              </ul>

              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4">
                Your Content
              </h3>
              <ul className="p-2 space-y-1">
                <li className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Saved Articles
                </li>
                <li className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Your Drafts
                </li>
                <li className="p-2 rounded-lg bg-deep-purple text-white dark:bg-muted-rose hover:bg-medium-purple dark:hover:bg-pale-pink transition-colors px-4 py-2 text-sm font-medium cursor-pointer mt-4 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
