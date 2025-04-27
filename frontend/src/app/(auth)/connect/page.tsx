'use client';

import React from 'react';
import Connect from '@/components/Connect';
import { useRouter } from 'next/navigation';

export default function ConnectPage() {
  const router = useRouter();
  
  return (
    <div className="flex-1 h-full">
      <Connect onBack={() => router.push('/')} />
    </div>
  );
} 