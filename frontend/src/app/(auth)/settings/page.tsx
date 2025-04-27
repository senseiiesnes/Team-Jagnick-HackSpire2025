'use client';

import React from 'react';
import Settings from '@/components/Settings';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  
  return (
    <div className="flex-1 h-full">
      <Settings onBack={() => router.push('/')} />
    </div>
  );
} 