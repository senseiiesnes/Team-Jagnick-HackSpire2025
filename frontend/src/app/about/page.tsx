'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference for dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      
      // Add listener for changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleGetStarted = () => {
    router.push('/home');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Header - Reused from Landing Page */}
      <header className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <a href="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
                MindMosaic
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <a 
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink"
              >
                Home
              </a>
              <button 
                onClick={handleGetStarted}
                className="px-4 py-2 text-sm font-medium rounded-md bg-deep-purple hover:bg-medium-purple dark:bg-muted-rose dark:hover:bg-pale-pink text-white dark:text-gray-900"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main About Content */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        {/* About Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-gray-900 dark:text-white">About</span>
              <span className="block text-deep-purple dark:text-pale-pink">MindMosaic</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Empowering individuals on their mental wellness journey through technology and community.
            </p>
          </div>

          {/* Our Story */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Story</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    MindMosaic was founded in 2023 with a simple but powerful mission: to make mental wellness resources accessible to everyone, everywhere.
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    Our team of mental health professionals, technologists, and advocates came together with the shared belief that technology can be a powerful force for supporting mental health when designed with compassion and scientific understanding.
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Today, MindMosaic serves thousands of users worldwide, offering a unique blend of AI-powered check-ins, supportive communities, and expert-curated resources to help individuals navigate their mental wellness journey.
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-deep-purple/10 dark:bg-pale-pink/10 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-deep-purple dark:text-pale-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Trust & Privacy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in creating a safe environment where your data is protected and your privacy is respected at all times.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-deep-purple/10 dark:bg-pale-pink/10 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-deep-purple dark:text-pale-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Community Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We foster inclusive communities where everyone feels welcome, heard, and supported on their personal journey.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-deep-purple/10 dark:bg-pale-pink/10 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-deep-purple dark:text-pale-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Evidence-Based Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We combine cutting-edge technology with scientifically-validated approaches to mental wellness.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sarah Johnson</h3>
                  <p className="text-deep-purple dark:text-pale-pink mb-2">Founder & CEO</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Clinical Psychologist with 15+ years of experience in mental health innovation.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Michael Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Michael Chen</h3>
                  <p className="text-deep-purple dark:text-pale-pink mb-2">CTO</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    AI specialist passionate about using technology to improve mental well-being.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src="https://images.unsplash.com/photo-1573497620292-1c1c5e368a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Elena Rodriguez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Elena Rodriguez</h3>
                  <p className="text-deep-purple dark:text-pale-pink mb-2">Head of Community</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Community building expert with a background in peer support programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Reused from Landing Page */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">How it works</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">Community</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">About us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">Contact us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">Privacy policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">Terms of service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
              MindMosaic
            </div>
            <p className="mt-4 md:mt-0 text-base text-gray-500 dark:text-gray-400">
              &copy; 2023 MindMosaic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 