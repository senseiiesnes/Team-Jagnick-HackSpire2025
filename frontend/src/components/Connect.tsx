import React, { useState } from 'react';

interface ConnectProps {
  className?: string;
  onBack?: () => void;
}

const Connect: React.FC<ConnectProps> = ({ className = '', onBack }) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'connections'>('discover');
  
  // Dummy user data for connections
  const users = [
    {
      id: 'user1',
      name: 'Emily Johnson',
      avatar: 'EJ',
      bio: 'Meditation guide and anxiety management specialist',
      tags: ['Meditation', 'Anxiety', 'Support'],
      isOnline: true
    },
    {
      id: 'user2',
      name: 'Michael Chen',
      avatar: 'MC',
      bio: 'Mental health advocate focusing on workplace wellness',
      tags: ['Workplace', 'Stress', 'Balance'],
      isOnline: false
    },
    {
      id: 'user3',
      name: 'Sophia Rodriguez',
      avatar: 'SR',
      bio: 'Depression survivor and peer counselor',
      tags: ['Depression', 'Recovery', 'Peer Support'],
      isOnline: true
    },
    {
      id: 'user4',
      name: 'David Wilson',
      avatar: 'DW',
      bio: 'Sleep specialist and relaxation coach',
      tags: ['Sleep', 'Relaxation', 'Wellness'],
      isOnline: false
    },
    {
      id: 'user5',
      name: 'Aisha Patel',
      avatar: 'AP',
      bio: 'Mindfulness teacher and trauma-informed coach',
      tags: ['Mindfulness', 'Trauma', 'Healing'],
      isOnline: true
    }
  ];

  // Dummy pending requests
  const pendingRequests = [
    {
      id: 'request1',
      user: {
        id: 'user6',
        name: 'James Taylor',
        avatar: 'JT',
        bio: 'CBT practitioner and resilience trainer',
        tags: ['CBT', 'Resilience', 'Growth']
      },
      sentDate: '2 days ago'
    },
    {
      id: 'request2',
      user: {
        id: 'user7',
        name: 'Olivia Garcia',
        avatar: 'OG',
        bio: 'Life coach specializing in transitions and change',
        tags: ['Life Changes', 'Coaching', 'Transitions']
      },
      sentDate: '5 days ago'
    }
  ];

  // Dummy active connections
  const activeConnections = [
    {
      id: 'connection1',
      user: {
        id: 'user8',
        name: 'Ryan Kim',
        avatar: 'RK',
        bio: 'Psychologist with expertise in relationship dynamics',
        tags: ['Relationships', 'Communication', 'Boundaries']
      },
      lastActive: '10 min ago',
      unreadCount: 3
    },
    {
      id: 'connection2',
      user: {
        id: 'user9',
        name: 'Sarah Johnson',
        avatar: 'SJ',
        bio: 'Support group facilitator for grief and loss',
        tags: ['Grief', 'Loss', 'Support Groups']
      },
      lastActive: '1 hour ago',
      unreadCount: 0
    }
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto p-6 ${className}`}>
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
            Connect with Others
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Find peer support and make meaningful connections
          </p>
        </div>
        <button 
          onClick={onBack}
          className="mt-4 sm:mt-0 px-4 py-2 flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-8">
        {(['discover', 'requests', 'connections'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative mr-1 py-3 px-6 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-800 text-deep-purple dark:text-pale-pink border-t border-l border-r border-gray-200 dark:border-gray-700'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'requests' && pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Discover view */}
      {activeTab === 'discover' && (
        <div className="space-y-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by name, interest, or skill..." 
              className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
            />
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg flex">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-deep-purple to-medium-purple dark:from-muted-rose dark:to-pale-pink text-white flex items-center justify-center text-xl font-bold">
                    {user.avatar}
                  </div>
                  {user.isOnline && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                    <button className="px-3 py-1 text-sm bg-deep-purple hover:bg-medium-purple text-white rounded-full transition-colors">
                      Connect
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{user.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.tags.map((tag, index) => (
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
          
          <div className="flex justify-center">
            <button className="px-6 py-2.5 bg-deep-purple hover:bg-medium-purple text-white rounded-lg font-medium transition-colors">
              Load More
            </button>
          </div>
        </div>
      )}
      
      {/* Connection Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Connection Requests</h2>
          
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-deep-purple to-medium-purple dark:from-muted-rose dark:to-pale-pink text-white flex items-center justify-center font-bold">
                      {request.user.avatar}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{request.user.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sent {request.sentDate}</p>
                        </div>
                        
                        <div className="mt-2 sm:mt-0 space-x-2">
                          <button className="px-4 py-1 bg-deep-purple hover:bg-medium-purple text-white rounded-lg text-sm transition-colors">
                            Accept
                          </button>
                          <button className="px-4 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors">
                            Decline
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{request.user.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {request.user.tags.map((tag, index) => (
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">You don't have any pending connection requests</p>
            </div>
          )}
        </div>
      )}
      
      {/* Active Connections */}
      {activeTab === 'connections' && (
        <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Connections</h2>
          
          {activeConnections.length > 0 ? (
            <div className="space-y-4">
              {activeConnections.map((connection) => (
                <div key={connection.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-deep-purple to-medium-purple dark:from-muted-rose dark:to-pale-pink text-white flex items-center justify-center font-bold">
                        {connection.user.avatar}
                      </div>
                      {connection.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {connection.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{connection.user.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Last active {connection.lastActive}</p>
                        </div>
                        
                        <div className="mt-2 sm:mt-0">
                          <button className="px-4 py-1 bg-deep-purple hover:bg-medium-purple text-white rounded-lg text-sm transition-colors">
                            Chat
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{connection.user.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {connection.user.tags.map((tag, index) => (
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">You haven't connected with anyone yet</p>
              <button className="mt-4 px-6 py-2.5 bg-deep-purple hover:bg-medium-purple text-white rounded-lg font-medium transition-colors">
                Find People to Connect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Connect; 