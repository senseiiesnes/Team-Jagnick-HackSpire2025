'use client';

import React from 'react';
import BlogDetail from '@/components/BlogDetail';
import { useParams, useRouter } from 'next/navigation';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.blogId as string;
  
  return (
    <div className="flex-1 h-full">
      <BlogDetail blogId={blogId} onClose={() => router.push('/blogs')} />
    </div>
  );
} 