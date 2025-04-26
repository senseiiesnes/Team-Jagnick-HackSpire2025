import React, { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatAreaProps {
  chatId: string;
  onClose: () => void;
  isFocused: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ chatId, onClose, isFocused }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      text: "I've been feeling a bit anxious about my upcoming presentation.",
      sender: 'user',
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: '3',
      text: "That's understandable. Presentations can be stressful. Would you like to talk about what's causing the anxiety or would you prefer some relaxation techniques that might help?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 3400000),
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for sharing that. I'm here to help.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col h-full ${isFocused ? 'h-screen md:h-full' : 'h-full'} bg-gray-50 dark:bg-gray-900 transition-all duration-300`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="sticky bottom-0 w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 py-3 px-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
          />
          
          <button
            type="submit"
            className="p-2 rounded-full bg-deep-purple dark:bg-muted-rose text-white hover:bg-medium-purple dark:hover:bg-pale-pink transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
