import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface Recommendation {
  title: string;
  description: string;
  link?: string;
}

interface RecommendationSet {
  meditation?: Recommendation;
  music?: Recommendation;
  activity?: Recommendation;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  recommendations?: RecommendationSet;
  significant_emotions?: string[];
}

interface ChatAreaProps {
  chatId?: string;
  onClose: () => void;
  isFocused: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ chatId, onClose, isFocused }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(chatId);

  // Load chat history if chatId is provided
  useEffect(() => {
    setCurrentChatId(chatId);
    
    if (chatId && chatId !== 'new') {
      const fetchChatHistory = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await fetch(`/api/chat/${chatId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch chat history');
          }
          
          const data = await response.json();
          // Ensure timestamps are converted to Date objects
          const messagesWithDates = data.messages.map((msg: {id: string; text: string; sender: 'user' | 'ai'; timestamp: string; recommendations?: RecommendationSet}) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch (err) {
          console.error('Error fetching chat history:', err);
          setError('Failed to load chat history. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchChatHistory();
    } else {
      // New chat - start with AI greeting
      setMessages([{
        id: '1',
        text: "Hello! How are you feeling today?",
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  }, [chatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '' || !session?.user) return;
    
    // Add user message to state immediately for responsive UI
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // Send message to our API endpoint which will communicate with the FastAPI backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          chatId: currentChatId !== 'new' ? currentChatId : undefined,
          newChat: currentChatId === 'new' || !currentChatId
        }),
      });
      
      if (!response.ok) {
        // Show a more specific error based on the status code
        if (response.status === 503) {
          throw new Error('The AI service is currently unavailable. Please try again later.');
        } else if (response.status === 401) {
          throw new Error('You need to be logged in to use the chat.');
        } else {
          throw new Error(`Failed to send message (${response.status})`);
        }
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Get the message content from the response
      let messageContent = '';
      if (data.message && data.message.content) {
        messageContent = data.message.content;
      } else if (data.assistant_message) {
        messageContent = data.assistant_message;
      }
      
      // Remove recommendation text from the message display if present
      let cleanedText = messageContent;
      if (data.recommendations && cleanedText.includes("Based on how you were feeling, here are some ideas:")) {
        cleanedText = cleanedText.split("Based on how you were feeling, here are some ideas:")[0].trim();
      }
      
      // Transform recommendations data to match our UI format
      let recommendationsForUI: RecommendationSet | undefined = undefined;
      if (data.message && data.message.recommendations) {
        recommendationsForUI = data.message.recommendations;
      } else if (data.recommendations) {
        recommendationsForUI = {
          meditation: {
            title: "Meditation for You",
            description: data.recommendations.books && data.recommendations.books.length > 0 
              ? data.recommendations.books.join(", ") 
              : "No specific meditation recommended"
          },
          music: {
            title: data.recommendations.music_category || "Music for You",
            description: data.recommendations.songs && data.recommendations.songs.length > 0 
              ? data.recommendations.songs.join(", ") 
              : "No specific songs recommended"
          },
          activity: {
            title: "Activities for You",
            description: data.recommendations.movies && data.recommendations.movies.length > 0 
              ? data.recommendations.movies.join(", ") 
              : "No specific activities recommended"
          }
        };
      }
      
      // Get the emotions from the response
      let emotions = undefined;
      if (data.message && data.message.significant_emotions) {
        emotions = data.message.significant_emotions;
      } else if (data.current_significant_emotions) {
        emotions = data.current_significant_emotions;
      }
      
      // Add AI response to state
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: cleanedText,
        sender: 'ai',
        timestamp: new Date(),
        recommendations: recommendationsForUI,
        significant_emotions: emotions
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // If we got a chat_id back and this was a new chat, update the state and URL
      if (data.chatId && (currentChatId === 'new' || !currentChatId)) {
        setCurrentChatId(data.chatId);
        // Update the URL to include the chat ID without reloading the page
        window.history.replaceState(
          {}, 
          '', 
          `/chat/${data.chatId}`
        );
      }
      
      // If the chat ended (e.g. user felt better, max rounds reached), handle accordingly
      if (data.conversation_ended) {
        console.log('Conversation ended');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Invalid date format:', date);
      return '00:00';
    }
  };

  // Render recommendations card
  const renderRecommendations = (recommendations: RecommendationSet) => {
    if (!recommendations) return null;
    
    const hasRecommendations = 
      recommendations.meditation || 
      recommendations.music || 
      recommendations.activity;
    
    if (!hasRecommendations) return null;
    
    return (
      <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Recommendations</h3>
        
        <div className="space-y-4">
          {recommendations.meditation && (
            <div className="border-l-4 border-indigo-500 pl-3 py-2">
              <h4 className="font-medium text-gray-800 dark:text-gray-100">{recommendations.meditation.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{recommendations.meditation.description}</p>
              {recommendations.meditation.link && (
                <a 
                  href={recommendations.meditation.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block"
                >
                  Try this meditation
                </a>
              )}
            </div>
          )}
          
          {recommendations.music && (
            <div className="border-l-4 border-green-500 pl-3 py-2">
              <h4 className="font-medium text-gray-800 dark:text-gray-100">{recommendations.music.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{recommendations.music.description}</p>
              {recommendations.music.link && (
                <a 
                  href={recommendations.music.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 dark:text-green-400 hover:underline mt-1 inline-block"
                >
                  Listen now
                </a>
              )}
            </div>
          )}
          
          {recommendations.activity && (
            <div className="border-l-4 border-amber-500 pl-3 py-2">
              <h4 className="font-medium text-gray-800 dark:text-gray-100">{recommendations.activity.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{recommendations.activity.description}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add this after the renderRecommendations function
  const renderEmotions = (emotions: string[]) => {
    if (!emotions || emotions.length === 0) return null;
    
    return (
      <div className="mt-2 flex flex-wrap gap-1">
        {emotions.map((emotion, index) => (
          <span 
            key={index}
            className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            {emotion}
          </span>
        ))}
      </div>
    );
  };

  // Add this after the renderEmotions function
  const renderServiceUnavailable = () => {
    return (
      <div className="mt-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700 p-4 shadow-sm">
        <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">AI Service Unavailable</h3>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          The AI service is temporarily unavailable. This might be due to:
        </p>
        <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 mt-2 mb-3">
          <li>The backend service is starting up</li>
          <li>The AI model hasn't been loaded correctly</li>
          <li>Server resources are currently limited</li>
        </ul>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Your messages are being saved and will be processed when the service is back online.
        </p>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full ${isFocused ? 'h-screen md:h-full' : 'h-full'} bg-gray-50 dark:bg-gray-900 transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {chatId && chatId !== 'new' ? 'Continue your conversation' : 'New conversation'}
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-deep-purple text-white dark:bg-muted-rose dark:text-white rounded-br-none' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">
                  {message.sender === 'user' ? 'You' : 'MindMosaic'}
                </span>
                <span className="text-xs">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              {message.sender === 'ai' && message.text && message.text.includes("AI service is temporarily unavailable") ? (
                renderServiceUnavailable()
              ) : (
                <p className="text-sm whitespace-pre-line">{message.text || ''}</p>
              )}
              
              {/* Render recommendations if they exist */}
              {message.sender === 'ai' && message.recommendations && 
                renderRecommendations(message.recommendations)
              }
              
              {/* Render emotions if they exist */}
              {message.sender === 'ai' && message.significant_emotions && 
                !message.text?.includes("AI service is temporarily unavailable") && 
                renderEmotions(message.significant_emotions)
              }
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-lg rounded-bl-none text-gray-800 dark:text-gray-200">
              <div className="flex space-x-2 items-center">
                <div className="text-xs font-medium">MindMosaic</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isLoading}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={isLoading || newMessage.trim() === ''}
            className="px-4 py-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
