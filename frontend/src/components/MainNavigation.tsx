import React from 'react';

interface MainNavigationProps {
  activeView: 'ai' | 'community' | 'blogs';
  setActiveView: (view: 'ai' | 'community' | 'blogs') => void;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Responsive title for current section - Larger on desktop, smaller on mobile */}
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8 bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
        {activeView === 'ai' && 'AI Assistant'}
        {activeView === 'community' && 'Community Hub'}
        {activeView === 'blogs' && 'Wellness Blogs'}
      </h1>
      
      {/* Navigation tabs - Fully responsive with flex-wrap for smaller screens */}
      <div className="flex flex-wrap items-center justify-center bg-gray-50 dark:bg-gray-800 p-1.5 md:p-2 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        {/* AI Button - Mobile friendly padding and text size */}
        <button
          className={`relative flex-1 min-w-[90px] px-3 md:px-8 py-2.5 md:py-4 rounded-lg md:rounded-xl text-sm md:text-base font-medium md:font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center mx-0.5 ${
            activeView === 'ai'
              ? 'bg-gradient-to-r from-deep-purple to-medium-purple text-white shadow-md md:shadow-lg md:transform md:scale-105'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveView('ai')}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="whitespace-nowrap">AI Chat</span>
          {activeView === 'ai' && (
            <span className="absolute -bottom-1 md:-bottom-1 left-1/2 transform -translate-x-1/2 w-8 md:w-16 h-1 bg-white rounded-full"></span>
          )}
        </button>
        
        {/* Community Button */}
        <button
          className={`relative flex-1 min-w-[90px] px-3 md:px-8 py-2.5 md:py-4 rounded-lg md:rounded-xl text-sm md:text-base font-medium md:font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center mx-0.5 ${
            activeView === 'community'
              ? 'bg-gradient-to-r from-deep-purple to-medium-purple text-white shadow-md md:shadow-lg md:transform md:scale-105'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveView('community')}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="whitespace-nowrap">Community</span>
          {activeView === 'community' && (
            <span className="absolute -bottom-1 md:-bottom-1 left-1/2 transform -translate-x-1/2 w-8 md:w-16 h-1 bg-white rounded-full"></span>
          )}
        </button>
        
        {/* Blogs Button */}
        <button
          className={`relative flex-1 min-w-[90px] px-3 md:px-8 py-2.5 md:py-4 rounded-lg md:rounded-xl text-sm md:text-base font-medium md:font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center mx-0.5 ${
            activeView === 'blogs'
              ? 'bg-gradient-to-r from-deep-purple to-medium-purple text-white shadow-md md:shadow-lg md:transform md:scale-105'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveView('blogs')}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span className="whitespace-nowrap">Blogs</span>
          {activeView === 'blogs' && (
            <span className="absolute -bottom-1 md:-bottom-1 left-1/2 transform -translate-x-1/2 w-8 md:w-16 h-1 bg-white rounded-full"></span>
          )}
        </button>
      </div>
      
      {/* Description for current section - Hidden on extremely small screens */}
      <div className="mt-4 md:mt-6 text-center text-sm text-gray-600 dark:text-gray-300 px-2 md:px-4">
        {activeView === 'ai' && (
          <p className="max-w-2xl mx-auto">Chat with MindMosaic's AI to get personalized mental health insights, track your mood, or simply have a supportive conversation.</p>
        )}
        {activeView === 'community' && (
          <p className="max-w-2xl mx-auto">Connect with people on similar journeys. Join support groups, share experiences, and grow together in a safe environment.</p>
        )}
        {activeView === 'blogs' && (
          <p className="max-w-2xl mx-auto">Explore expert articles, stories, and resources to enhance your mental well-being and discover new perspectives.</p>
        )}
      </div>
    </div>
  );
};

export default MainNavigation;
