import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Blog interface
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

interface AllBlogsProps {
  onBlogSelect: (blogId: string) => void;
}

const AllBlogs: React.FC<AllBlogsProps> = ({ onBlogSelect }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [visibleBlogs, setVisibleBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const { data: session } = useSession();
  
  // Detect screen width for responsive masonry layout
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    // Set initial width
    setScreenWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/blogs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        
        const data = await response.json();
        setBlogs(data.blogs || []);
        setVisibleBlogs(data.blogs?.slice(0, 9) || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  const loadMoreBlogs = () => {
    setLoading(true);
    
    setTimeout(() => {
      const currentLength = visibleBlogs.length;
      const nextBlogs = blogs.slice(currentLength, currentLength + 6);
      
      if (nextBlogs.length > 0) {
        setVisibleBlogs([...visibleBlogs, ...nextBlogs]);
      }
      
      setLoading(false);
    }, 300);
  };
  
  // Calculate number of columns based on screen width
  const getColumnCount = () => {
    if (screenWidth >= 1280) return 4; // xl screens
    if (screenWidth >= 1024) return 3; // lg screens
    if (screenWidth >= 768) return 2; // md screens
    return 1; // sm and xs screens
  };
  
  // Distribute blogs into columns for masonry layout
  const getColumnizedBlogs = () => {
    const columnCount = getColumnCount();
    const columns: Blog[][] = Array.from({ length: columnCount }, () => []);
    
    visibleBlogs.forEach((blog, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(blog);
    });
    
    return columns;
  };
  
  const columns = getColumnizedBlogs();

  // Handle creating a new blog
  const handleCreateNewBlog = () => {
    // Redirect to blog creation form
    window.location.href = '/blogs/new';
  };
  
  if (loading && blogs.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-purple"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
          All Blogs
        </h1>
        <div className="flex space-x-2">
          {session?.user && (
            <button 
              onClick={handleCreateNewBlog}
              className="px-4 py-2 bg-deep-purple text-white rounded-lg text-sm font-medium hover:bg-medium-purple transition-colors"
            >
              Create Blog
            </button>
          )}
        </div>
      </div>
      
      {blogs.length === 0 ? (
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
          {/* Masonry layout */}
          <div className="flex gap-4 md:gap-6 mb-10">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex-1 space-y-4 md:space-y-6">
                {column.map((blog) => (
                  <div 
                    key={blog.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:translate-y-[-4px]"
                    onClick={() => onBlogSelect(blog.id)}
                  >
                    <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                      {blog.authorId === session?.user?.id && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-deep-purple text-white text-xs font-medium rounded-full">
                          My Blog
                        </div>
                      )}
                    </div>
                    <div className="p-4">
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
            ))}
          </div>
          
          {visibleBlogs.length < blogs.length && (
            <div className="flex justify-center mb-10">
              <button 
                onClick={loadMoreBlogs}
                disabled={loading}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllBlogs; 