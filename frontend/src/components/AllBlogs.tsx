import React, { useState, useEffect } from 'react';

// Sample blog data for the masonry layout
export const allBlogsData = [
  {
    id: 'blog-1',
    title: 'Understanding Anxiety: Signs, Symptoms, and Coping Mechanisms',
    author: 'Dr. Sarah Johnson',
    date: 'May 15, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop',
    description: 'Learn about the common signs of anxiety and evidence-based techniques to manage symptoms effectively.',
    tags: ['Anxiety', 'Mental Health', 'Self-Care'],
    featured: true
  },
  {
    id: 'blog-2',
    title: 'Mindfulness Meditation: A Beginner\'s Guide to Daily Practice',
    author: 'Michael Chen',
    date: 'June 3, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    description: 'Discover how just 10 minutes of mindfulness practice daily can transform your mental well-being.',
    tags: ['Mindfulness', 'Meditation', 'Wellness'],
    featured: true
  },
  {
    id: 'blog-3',
    title: 'Building Resilience: How to Bounce Back from Life\'s Challenges',
    author: 'Dr. Emily Roberts',
    date: 'June 21, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?q=80&w=800&auto=format&fit=crop',
    description: 'Explore the psychological foundations of resilience and practical ways to strengthen your ability to overcome adversity.',
    tags: ['Resilience', 'Growth', 'Self-Improvement'],
    featured: true
  },
  {
    id: 'blog-4',
    title: 'The Connection Between Physical Activity and Mental Health',
    author: 'James Wilson',
    date: 'July 8, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
    description: 'Research shows that regular exercise can be as effective as medication for treating mild to moderate depression.',
    tags: ['Exercise', 'Depression', 'Wellness'],
    featured: false
  },
  {
    id: 'blog-5',
    title: 'Navigating Difficult Conversations: A Mental Health Perspective',
    author: 'Lisa Nguyen',
    date: 'July 17, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?q=80&w=800&auto=format&fit=crop',
    description: 'Practical tips for maintaining mental equilibrium during challenging interpersonal interactions.',
    tags: ['Communication', 'Relationships', 'Stress Management'],
    featured: false
  },
  {
    id: 'blog-6',
    title: 'Digital Detox: Why Your Brain Needs Regular Breaks from Technology',
    author: 'Dr. Mark Peterson',
    date: 'August 2, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop',
    description: 'Constant digital stimulation can negatively impact mental health. Learn how to create healthy boundaries with technology.',
    tags: ['Digital Wellness', 'Mental Health', 'Self-Care'],
    featured: false
  },
  {
    id: 'blog-7',
    title: 'The Science of Sleep: How Rest Affects Your Mental Clarity',
    author: 'Dr. Priya Sharma',
    date: 'August 19, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1520206183501-b80df61043c8?q=80&w=800&auto=format&fit=crop',
    description: 'Discover the latest research on sleep cycles and their profound impact on cognitive function and emotional regulation.',
    tags: ['Sleep', 'Neuroscience', 'Wellness'],
    featured: false
  },
  {
    id: 'blog-8',
    title: 'Workplace Wellness: Creating a Mentally Healthy Environment',
    author: 'Thomas Rodriguez',
    date: 'September 5, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
    description: 'Strategies for organizations and individuals to foster psychological safety and well-being at work.',
    tags: ['Workplace', 'Stress Management', 'Leadership'],
    featured: false
  },
  {
    id: 'blog-9',
    title: 'Nutrition and Mood: How Diet Influences Mental Health',
    author: 'Emma Wright, RD',
    date: 'September 23, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop',
    description: 'Emerging research on the gut-brain connection and how specific foods can help alleviate symptoms of anxiety and depression.',
    tags: ['Nutrition', 'Diet', 'Mental Health'],
    featured: false
  },
  {
    id: 'blog-10',
    title: 'Cognitive Behavioral Therapy: Principles You Can Apply Daily',
    author: 'Dr. Alex Martinez',
    date: 'October 10, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop',
    description: 'Simple CBT techniques that can help you identify and challenge negative thought patterns.',
    tags: ['CBT', 'Therapy', 'Self-Help'],
    featured: false
  },
  {
    id: 'blog-11',
    title: 'Parenting and Mental Health: Supporting Children Through Difficult Times',
    author: 'Dr. Jessica Lee',
    date: 'October 28, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=800&auto=format&fit=crop',
    description: 'Guidance for parents on recognizing signs of mental health challenges in children and fostering emotional resilience.',
    tags: ['Parenting', 'Children', 'Family Mental Health'],
    featured: false
  },
  {
    id: 'blog-12',
    title: 'Seasonal Affective Disorder: Coping with Winter Blues',
    author: 'Dr. Robert Johnson',
    date: 'November 15, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1485848395067-a7c29cb6abfb?q=80&w=800&auto=format&fit=crop',
    description: 'Understanding SAD and evidence-based strategies to maintain mood during months with reduced sunlight.',
    tags: ['SAD', 'Depression', 'Seasonal Wellness'],
    featured: false
  },
  {
    id: 'blog-13',
    title: 'The Power of Community: Social Connection as Mental Health Medicine',
    author: 'Maria Gonzalez',
    date: 'December 3, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1531547255897-f400dc1b7de2?q=80&w=800&auto=format&fit=crop',
    description: 'Research shows that meaningful social connections may be as important to health as diet and exercise.',
    tags: ['Community', 'Social Health', 'Connection'],
    featured: false
  },
  {
    id: 'blog-14',
    title: 'Mindfulness for Beginners: Simple Daily Practices',
    author: 'David Chen',
    date: 'December 20, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1474418397713-2f1062e18e21?q=80&w=800&auto=format&fit=crop',
    description: 'Start your mindfulness journey with these accessible practices that take less than 5 minutes per day.',
    tags: ['Mindfulness', 'Beginners', 'Daily Practice'],
    featured: false
  }
];

interface AllBlogsProps {
  onBlogSelect: (blogId: string) => void;
}

const AllBlogs: React.FC<AllBlogsProps> = ({ onBlogSelect }) => {
  const [visibleBlogs, setVisibleBlogs] = useState<typeof allBlogsData>([]);
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  
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
  
  // Initial load of blogs
  useEffect(() => {
    setVisibleBlogs(allBlogsData.slice(0, 9));
  }, []);
  
  const loadMoreBlogs = () => {
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const currentLength = visibleBlogs.length;
      const nextBlogs = allBlogsData.slice(currentLength, currentLength + 6);
      
      if (nextBlogs.length > 0) {
        setVisibleBlogs([...visibleBlogs, ...nextBlogs]);
      }
      
      setLoading(false);
    }, 800);
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
    const columns: typeof allBlogsData[] = Array.from({ length: columnCount }, () => []);
    
    visibleBlogs.forEach((blog, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(blog);
    });
    
    return columns;
  };
  
  const columns = getColumnizedBlogs();
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
          All Blogs
        </h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Latest
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Popular
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Categories
          </button>
        </div>
      </div>
      
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
                  {/* Real image from Unsplash */}
                  <img 
                    src={blog.thumbnail} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  {blog.featured && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-deep-purple text-white text-xs font-medium rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 mr-2 flex items-center justify-center text-xs font-bold">
                      {blog.author.charAt(0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {blog.author} • {blog.date}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                    {blog.description}
                  </p>
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
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Load more button */}
      {visibleBlogs.length < allBlogsData.length && (
        <div className="flex justify-center mb-12">
          <button 
            onClick={loadMoreBlogs}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-deep-purple to-medium-purple text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Blogs'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AllBlogs; 