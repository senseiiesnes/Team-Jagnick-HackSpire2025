import React from 'react';

interface ChatWelcomeProps {
  onStartChat: () => void;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onStartChat }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-deep-purple dark:bg-medium-purple flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-deep-purple dark:text-pale-pink mb-4">
        Welcome to MindMosaic AI Chat
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
        Start a conversation with MindMosaic AI to get personalized mental health insights, track your mood, or simply have a supportive chat.
      </p>
      <button 
        onClick={onStartChat}
        className="px-6 py-3 bg-medium-purple hover:bg-deep-purple dark:bg-muted-rose dark:hover:bg-pale-pink text-white dark:text-gray-900 rounded-lg font-medium transition-colors shadow-sm"
      >
        Start a New Conversation
      </button>
    </div>
  );
};

export default ChatWelcome; 