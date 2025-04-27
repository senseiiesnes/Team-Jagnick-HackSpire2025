import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

interface CommunityChatProps {
  communityId: string;
  communityName: string;
  onBack: () => void;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ communityId, communityName, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [usernameSet, setUsernameSet] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Demo messages for initial load
  const demoMessages: Message[] = [
    {
      id: '1',
      username: 'Mindful_User',
      text: 'Has anyone tried the new guided meditation app?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: '2',
      username: 'SerenitySeeker',
      text: 'Yes! I&apos;ve been using it for a week and it&apos;s really helping with my anxiety.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5) // 1.5 hours ago
    },
    {
      id: '3',
      username: 'Zen_Master',
      text: 'I prefer the traditional approaches, but I&apos;m open to trying new apps. Which one are you talking about?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
    },
    {
      id: '4',
      username: 'Mindful_User',
      text: 'It&apos;s called MindMosaic, actually! Has some really innovative features.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    }
  ];

  // Scroll to bottom when messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages (would be from API in a real app)
  useEffect(() => {
    // This simulates loading messages from an API
    // In a real app, you'd fetch messages based on the communityId
    setTimeout(() => {
      setMessages(demoMessages);
    }, 500);
  }, [communityId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: Date.now().toString(),
      username,
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim() === '') return;
    
    setUsernameSet(true);
  };

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!usernameSet) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{communityName}</h1>
        </div>

        <div className="max-w-md mx-auto w-full mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Join the Conversation</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Choose a username to participate in this community chat. Your identity will remain anonymous.
          </p>
          
          <form onSubmit={handleSetUsername}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
                placeholder="Choose a unique username"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg transition-colors"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="mr-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{communityName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chatting as: {username}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.username === username ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.username === username 
                    ? 'bg-deep-purple text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium text-sm ${
                    message.username === username ? 'text-pale-pink' : 'text-medium-purple dark:text-pale-pink'
                  }`}>
                    {message.username}
                  </span>
                  <span className="text-xs opacity-70 ml-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-purple"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityChat; 