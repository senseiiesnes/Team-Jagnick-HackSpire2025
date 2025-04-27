'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogForm from '@/components/BlogForm';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.blogId as string;
  
  return (
    <div className="flex-1 h-full">
      <BlogForm 
        blogId={blogId} 
        onCancel={() => router.push(`/blogs/${blogId}`)} 
      />
    </div>
  );
} 