'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/BlogForm';

export default function NewBlogPage() {
  const router = useRouter();
  
  return (
    <div className="flex-1 h-full">
      <BlogForm onCancel={() => router.push('/blogs')} />
    </div>
  );
} 