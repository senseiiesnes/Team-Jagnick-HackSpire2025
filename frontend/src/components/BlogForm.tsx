import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface BlogFormProps {
  blogId?: string; // If provided, we're editing an existing blog
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ blogId, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const router = useRouter();
  
  // If blogId is provided, fetch the blog for editing
  useEffect(() => {
    if (blogId) {
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
          
          const blog = await response.json();
          
          // Set form values
          setTitle(blog.title);
          setContent(blog.content);
          setImageUrl(blog.imageUrl);
          setTags(blog.tags || []);
        } catch (err) {
          console.error('Error fetching blog:', err);
          setError(err instanceof Error ? err.message : 'Failed to load blog');
        } finally {
          setLoading(false);
        }
      };
      
      fetchBlog();
    }
  }, [blogId]);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setError('You must be logged in to create a blog');
      return;
    }
    
    // Validate required fields
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    
    if (!imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const endpoint = blogId ? `/api/blogs/${blogId}` : '/api/blogs';
      const method = blogId ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl,
          tags,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save blog');
      }
      
      // Redirect to blogs page or the specific blog
      if (blogId) {
        router.push(`/blogs/${blogId}`);
      } else {
        const data = await response.json();
        router.push(`/blogs/${data.id}`);
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      setError(err instanceof Error ? err.message : 'Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-purple"></div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {blogId ? 'Edit Blog' : 'Create New Blog'}
          </h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title*
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
                placeholder="Enter blog title"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL*
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
                placeholder="Enter image URL"
                required
              />
              
              {imageUrl && (
                <div className="mt-2 h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Blog preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Image+Preview';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content*
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white h-64"
                placeholder="Write your blog content here (HTML formatting is supported)"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
                  placeholder="Add tags"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-deep-purple text-white font-medium rounded-r-lg"
                >
                  Add
                </button>
              </div>
              
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-deep-purple to-medium-purple text-white font-medium rounded-lg disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : blogId ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm; 