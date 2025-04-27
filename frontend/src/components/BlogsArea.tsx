import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

interface BlogsAreaProps {
  onViewAll: () => void;
  onBlogSelect: (blogId: string) => void;
}

const BlogsArea: React.FC<BlogsAreaProps> = ({ onViewAll, onBlogSelect }) => {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/blogs?limit=3');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        
        const data = await response.json();
        setFeaturedBlogs(data.blogs || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  // Handle creating a new blog
  const handleCreateNewBlog = () => {
    window.location.href = '/blogs/new';
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-10">
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {featuredBlogs.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl text-gray-700 dark:text-gray-300">No blogs found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Be the first to create a blog!</p>
          {session?.user && (
            <button 
              onClick={handleCreateNewBlog}
              className="mt-4 px-6 py-2 bg-deep-purple text-white rounded-lg font-medium hover:bg-medium-purple transition-colors"
            >
              Create Blog
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-deep-purple to-medium-purple bg-clip-text text-transparent">
              Featured Blogs
            </h2>
            {session?.user && (
              <button 
                onClick={handleCreateNewBlog}
                className="px-4 py-2 bg-deep-purple text-white rounded-lg text-sm font-medium hover:bg-medium-purple transition-colors"
              >
                Create Blog
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredBlogs.map((blog) => (
              <div 
                key={blog.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => onBlogSelect(blog.id)}
              >
                <div className="relative h-48 w-full">
                  <div className="absolute inset-0 bg-gray-900 opacity-20 transition-opacity duration-300 hover:opacity-0" />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-deep-purple text-white text-xs font-medium rounded-full">
                    Featured
                  </div>
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 mr-2 flex items-center justify-center text-xs font-bold">
                      {blog.author.charAt(0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {blog.author} • {new Date(blog.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                    {blog.content.replace(/<[^>]*>/g, '')}
                  </p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mb-10">
            <button 
              onClick={onViewAll}
              className="px-8 py-3 bg-gradient-to-r from-deep-purple to-medium-purple text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              View All Blogs
            </button>
          </div>
        </>
      )}
      
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-deep-purple to-medium-purple bg-clip-text text-transparent">
          Latest Mental Wellness Tips
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
            <li className="pl-2"><strong>Practice mindful breathing</strong> - When feeling overwhelmed, take 5 deep breaths, inhaling for 4 counts and exhaling for 6.</li>
            <li className="pl-2"><strong>Limit social media</strong> - Set specific times for checking platforms, and use screen time settings to help maintain boundaries.</li>
            <li className="pl-2"><strong>Connect with nature</strong> - Spending just 20 minutes outdoors can significantly reduce stress hormone levels.</li>
            <li className="pl-2"><strong>Practice gratitude</strong> - Write down three things you're thankful for each day to shift focus toward positive aspects of life.</li>
            <li className="pl-2"><strong>Prioritize sleep</strong> - Maintain a consistent sleep schedule and create a calming bedtime routine to improve mental clarity.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BlogsArea;
