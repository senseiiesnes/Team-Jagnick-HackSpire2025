'use client';

import React from 'react';
import ChatArea from '@/components/ChatArea';
import { useParams, useRouter } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  
  return (
    <div className="flex-1 h-full">
      <ChatArea 
        chatId={chatId} 
        isFocused={true}
        onClose={() => router.push('/')}
      />
    </div>
  );
} 