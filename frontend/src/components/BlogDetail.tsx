import React, { useState, useEffect } from 'react';
import { allBlogsData } from './AllBlogs'; // Import blog data from AllBlogs

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  thumbnail: string;
  description: string;
  tags: string[];
  featured: boolean;
}

interface BlogDetailProps {
  blogId: string;
  onClose: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blogId, onClose }) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching blog data
    setLoading(true);
    
    setTimeout(() => {
      const foundBlog = allBlogsData.find((b: BlogPost) => b.id === blogId);
      if (foundBlog) {
        setBlog(foundBlog);
      }
      setLoading(false);
    }, 500);
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-purple"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Blog not found</h2>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-deep-purple to-medium-purple text-white font-medium rounded-lg"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, save this state to user preferences
  };
  
  // In a real app, the full content would be fetched from the backend
  const fullContent = `
    <p class="mb-4">
      ${blog.description}
    </p>
    <p class="mb-4">
      Mental health is a crucial component of our overall well-being, yet it's often overlooked or stigmatized in society. Understanding the importance of mental health is the first step toward creating a healthier, more balanced life.
    </p>
    <h2 class="text-xl font-semibold mb-3 mt-6">Why Mental Health Matters</h2>
    <p class="mb-4">
      Our mental health affects how we think, feel, and act. It influences how we handle stress, relate to others, and make choices. Just like physical health, mental health is important at every stage of life, from childhood through adulthood.
    </p>
    <p class="mb-4">
      When we neglect our mental health, we risk developing serious conditions such as anxiety disorders, depression, or burnout. These conditions can significantly impact our quality of life, relationships, and even physical health.
    </p>
    <h2 class="text-xl font-semibold mb-3 mt-6">Practical Steps for Better Mental Health</h2>
    <p class="mb-4">
      There are several evidence-based strategies that can help improve and maintain good mental health:
    </p>
    <ul class="list-disc pl-6 mb-4 space-y-2">
      <li>Regular physical activity can reduce anxiety and depression while improving mood and sleep.</li>
      <li>Practicing mindfulness meditation helps reduce stress and increase awareness of the present moment.</li>
      <li>Building and maintaining strong social connections provides emotional support during difficult times.</li>
      <li>Getting adequate sleep is essential for cognitive function and emotional regulation.</li>
      <li>Seeking professional help when needed is a sign of strength, not weakness.</li>
    </ul>
    <p class="mb-4">
      It's important to remember that everyone's journey with mental health is unique. What works for one person might not work for another, so it's essential to find strategies that are effective for your specific needs.
    </p>
    <h2 class="text-xl font-semibold mb-3 mt-6">Breaking the Stigma</h2>
    <p class="mb-4">
      One of the biggest barriers to mental health care is stigma. Many people are reluctant to discuss mental health concerns or seek help due to fear of judgment or discrimination.
    </p>
    <p class="mb-4">
      By openly discussing mental health and treating it with the same importance as physical health, we can help break down these barriers. Remember, seeking help for mental health concerns is a sign of strength, not weakness.
    </p>
    <h2 class="text-xl font-semibold mb-3 mt-6">Conclusion</h2>
    <p class="mb-4">
      Prioritizing mental health is essential for leading a fulfilling, balanced life. By implementing some of the strategies discussed in this article and seeking help when needed, you can take significant steps toward improving your mental well-being.
    </p>
    <p class="mb-4">
      Remember, mental health is not just the absence of mental illness; it's about having the resources and resilience to cope with life's challenges and enjoy its opportunities.
    </p>
  `;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
        {/* Blog header image */}
        <div className="relative h-56 md:h-72 lg:h-96 w-full bg-gray-200 dark:bg-gray-700">
          {/* Placeholder for image - in production, use real images */}
          <div className="bg-gradient-to-r from-deep-purple to-medium-purple h-full w-full flex items-center justify-center text-white">
            <span className="text-xl font-medium">Blog Image</span>
          </div>
          
          {/* Back and bookmark buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
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
              <div className="text-sm text-gray-600 dark:text-gray-400">{blog.date}</div>
            </div>
          </div>
          
          {/* Blog title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag: string, index: number) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Blog content */}
          <div 
            className="prose prose-sm md:prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: fullContent }}
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
              <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-deep-purple dark:hover:text-pale-pink transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Comments (3)
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