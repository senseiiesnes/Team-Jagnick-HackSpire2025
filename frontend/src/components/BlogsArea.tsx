import React from 'react';
import Image from 'next/image';

// Sample blog data
const featuredBlogsData = [
  {
    id: 'featured-1',
    title: 'Understanding Anxiety: Signs, Symptoms, and Coping Mechanisms',
    author: 'Dr. Sarah Johnson',
    date: 'May 15, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop',
    description: 'Learn about the common signs of anxiety and evidence-based techniques to manage symptoms effectively.',
    tags: ['Anxiety', 'Mental Health', 'Self-Care']
  },
  {
    id: 'featured-2',
    title: 'Mindfulness Meditation: A Beginner\'s Guide to Daily Practice',
    author: 'Michael Chen',
    date: 'June 3, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    description: 'Discover how just 10 minutes of mindfulness practice daily can transform your mental well-being.',
    tags: ['Mindfulness', 'Meditation', 'Wellness']
  },
  {
    id: 'featured-3',
    title: 'Building Resilience: How to Bounce Back from Life\'s Challenges',
    author: 'Dr. Emily Roberts',
    date: 'June 21, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?q=80&w=800&auto=format&fit=crop',
    description: 'Explore the psychological foundations of resilience and practical ways to strengthen your ability to overcome adversity.',
    tags: ['Resilience', 'Growth', 'Self-Improvement']
  }
];

interface BlogsAreaProps {
  onViewAll: () => void;
  onBlogSelect: (blogId: string) => void;
}

const BlogsArea: React.FC<BlogsAreaProps> = ({ onViewAll, onBlogSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {featuredBlogsData.map((blog) => (
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
              {/* Real image from Unsplash */}
              <img 
                src={blog.thumbnail} 
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
      
      <div className="flex justify-center mb-10">
        <button 
          onClick={onViewAll}
          className="px-8 py-3 bg-gradient-to-r from-deep-purple to-medium-purple text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          View All Blogs
        </button>
      </div>
      
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
