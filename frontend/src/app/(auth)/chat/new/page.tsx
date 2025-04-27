'use client';

import React from 'react';
import ChatArea from '@/components/ChatArea';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewChatPage() {
  const router = useRouter();
  const { status } = useSession();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [router, status]);
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-purple"></div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 h-full">
      <ChatArea 
        isFocused={true}
        onClose={() => router.push('/chats')}
      />
    </div>
  );
} 