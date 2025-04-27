import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  authorId: string;
  date: string;
  tags: string[];
}

interface BlogDetailProps {
  blogId: string;
  onClose: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blogId, onClose }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/blogs/${blogId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog not found');
          } else {
            throw new Error('Failed to fetch blog');
          }
        }
        
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };
    
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const handleEditBlog = () => {
    router.push(`/blogs/edit/${blogId}`);
  };
  
  const handleDeleteBlog = async () => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
      
      router.push('/blogs');
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, save this state to user preferences
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-purple"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {error || 'Blog not found'}
        </h2>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-deep-purple to-medium-purple text-white font-medium rounded-lg"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  const isAuthor = session?.user?.id === blog.authorId;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
        {/* Blog header image */}
        <div className="relative h-56 md:h-72 lg:h-96 w-full bg-gray-200 dark:bg-gray-700">
          <img 
            src={blog.imageUrl} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {isAuthor && (
              <>
                <button
                  onClick={handleEditBlog}
                  className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteBlog}
                  className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-red-500 dark:text-red-400 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={toggleBookmark}
              className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <svg 
                className={`w-6 h-6 ${isBookmarked ? 'text-deep-purple dark:text-pale-pink fill-current' : 'text-gray-600 dark:text-gray-400'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          {/* Author info and date */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3 flex items-center justify-center text-sm font-bold">
              {blog.author.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{blog.author}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(blog.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          {/* Blog title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>
          
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Blog content */}
          <div 
            className="prose prose-sm md:prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          
          {/* Footer with share and comment options */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-deep-purple dark:hover:text-pale-pink transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
            
            <div>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-deep-purple to-medium-purple text-white font-medium rounded-lg hover:shadow-md transition-shadow"
              >
                Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 