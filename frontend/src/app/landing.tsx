'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
                MindMosaic
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Login
              </button>
              <button 
                onClick={() => router.push('/register')}
                className="px-4 py-2 text-sm font-medium rounded-md bg-deep-purple hover:bg-medium-purple dark:bg-muted-rose dark:hover:bg-pale-pink text-white dark:text-gray-900"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block text-gray-900 dark:text-white">Nourish your mind</span>
                <span className="block text-deep-purple dark:text-pale-pink">with MindMosaic</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Your personal wellness companion for emotional check-ins, supportive communities, and mindful growth.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button 
                  onClick={handleGetStarted}
                  className="px-6 py-3 text-base font-medium rounded-lg bg-medium-purple hover:bg-deep-purple dark:bg-muted-rose dark:hover:bg-pale-pink text-white dark:text-gray-900 shadow-sm"
                >
                  Get Started
                </button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {/* Placeholder for hero image */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-deep-purple dark:text-pale-pink font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A better way to care for your mental health
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-deep-purple dark:bg-muted-rose text-white dark:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="mt-5 md:mt-0 md:ml-4 text-center md:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">AI Check-Ins</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Regular emotional check-ins with our caring AI to track and improve your well-being.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-deep-purple dark:bg-muted-rose text-white dark:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="mt-5 md:mt-0 md:ml-4 text-center md:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Supportive Communities</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Connect with like-minded individuals on similar wellness journeys.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-deep-purple dark:bg-muted-rose text-white dark:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="mt-5 md:mt-0 md:ml-4 text-center md:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Knowledge Resources</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Curated blogs and articles to enhance your mental wellness journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Ready to start your wellness journey?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of users who are transforming their mental well-being with MindMosaic.
            </p>
            <div className="mt-8">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 text-base font-medium rounded-lg bg-medium-purple hover:bg-deep-purple dark:bg-muted-rose dark:hover:bg-pale-pink text-white dark:text-gray-900 shadow-md transition-colors"
              >
                Get Started for Free
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
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
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-deep-purple dark:hover:text-pale-pink">About us</a></li>
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
            <div className="text-xl font-bold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
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