'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  ended: boolean;
  previewMessage: string;
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchChats = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/chat?limit=20');
        
        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }
        
        const data = await response.json();
        setChats(data.chats || []);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Failed to load your chat history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChats();
  }, [status]);

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }
      
      // Remove from UI
      setChats(chats.filter(chat => chat.id !== chatId));
    } catch (err) {
      console.error('Error deleting chat:', err);
      setError('Failed to delete chat. Please try again.');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Your Conversations</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-purple"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your Conversations</h1>
          <button
            onClick={() => router.push('/chat/new')}
            className="px-4 py-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg transition-colors"
          >
            Start New Chat
          </button>
        </div>
        
        {error && (
          <div className="p-4 mb-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        {chats.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-300 mb-4">You don't have any conversations yet.</p>
            <button
              onClick={() => router.push('/chat/new')}
              className="px-4 py-2 bg-medium-purple hover:bg-deep-purple text-white rounded-lg transition-colors"
            >
              Start your first conversation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div key={chat.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(chat.createdAt)}
                    </p>
                    <p className="mt-2 text-gray-800 dark:text-gray-200">
                      {chat.previewMessage}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/chat/${chat.id}`}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span 
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      chat.ended ? 'bg-gray-400' : 'bg-green-500'
                    }`}
                  ></span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {chat.ended ? 'Completed' : 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 