import React, { useState, useEffect } from 'react';
import CreateCommunity from './CreateCommunity';
import CommunityChat from './CommunityChat';
import { initializeSocket, getSocket, closeSocket, onCommunityMembers } from '@/lib/socket';

// Community interface
interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  joined: boolean;
}

const CommunityArea: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'chat'>('list');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const socket = initializeSocket();
    setIsConnected(!!socket && socket.connected);

    // Listen for socket connection status
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Clean up
    return () => {
      closeSocket();
    };
  }, []);

  // Listen for community members updates
  useEffect(() => {
    onCommunityMembers((data) => {
      const { communityId, members } = data;
      
      setCommunities(prev => 
        prev.map(community => 
          community.id === communityId
            ? { ...community, memberCount: members.length }
            : community
        )
      );
    });
  }, []);

  // Sample communities data
  useEffect(() => {
    // In a production app, this would come from an API or database
    const sampleCommunities: Community[] = [
      {
        id: 'anxiety-support',
        name: 'Anxiety Support',
        description: 'A safe space to discuss anxiety management techniques and support each other.',
        memberCount: 0,
        joined: false
      },
      {
        id: 'mindfulness-practices',
        name: 'Mindfulness Practices',
        description: 'Share and learn about mindfulness meditation techniques and daily practices.',
        memberCount: 0,
        joined: false
      },
      {
        id: 'mental-health-general',
        name: 'Mental Health General',
        description: 'General discussion about mental health, resources, and supportive conversations.',
        memberCount: 0,
        joined: false
      }
    ];
    
    setCommunities(sampleCommunities);
  }, []);
  
  const handleJoinCommunity = (communityId: string) => {
    setCommunities(prevCommunities => 
      prevCommunities.map(community => 
        community.id === communityId
          ? { ...community, joined: true, memberCount: community.memberCount + 1 }
          : community
      )
    );
  };
  
  const handleLeaveCommunity = (communityId: string) => {
    setCommunities(prevCommunities => 
      prevCommunities.map(community => 
        community.id === communityId
          ? { 
              ...community, 
              joined: false, 
              memberCount: Math.max(community.memberCount - 1, 0) 
            }
          : community
      )
    );
  };
  
  const handleCreateCommunity = (name: string, description: string) => {
    const newCommunity: Community = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      memberCount: 1, // Creator joins automatically
      joined: true
    };
    
    setCommunities(prevCommunities => [...prevCommunities, newCommunity]);
    setActiveView('list');
  };
  
  const handleStartChat = (community: Community) => {
    setSelectedCommunity(community);
    setActiveView('chat');
  };
  
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Different views
  if (activeView === 'create') {
    return <CreateCommunity onSubmit={handleCreateCommunity} onCancel={() => setActiveView('list')} />;
  }
  
  if (activeView === 'chat' && selectedCommunity) {
    return (
      <CommunityChat 
        communityId={selectedCommunity.id}
        communityName={selectedCommunity.name}
        onBack={() => setActiveView('list')}
      />
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communities</h1>
        {isConnected ? (
          <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 mr-2"></span>
            Connected
          </span>
        ) : (
          <span className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400 mr-2"></span>
            Disconnected
          </span>
        )}
      </div>
      
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-purple dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={() => setActiveView('create')}
          className="ml-2 px-4 py-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg transition-colors"
        >
          New Community
        </button>
      </div>
      
      {filteredCommunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-lg font-medium">No communities found</p>
          <p className="mt-1">Try a different search or create a new community</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          {filteredCommunities.map((community) => (
            <div 
              key={community.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{community.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1 mb-3 text-sm">{community.description}</p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {community.memberCount} member{community.memberCount !== 1 ? 's' : ''}
                </span>
                
                <div className="flex space-x-2">
                  {community.joined ? (
                    <>
                      <button
                        onClick={() => handleStartChat(community)}
                        className="px-3 py-1 bg-deep-purple hover:bg-medium-purple text-white text-sm rounded transition-colors"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => handleLeaveCommunity(community.id)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm rounded transition-colors"
                      >
                        Leave
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleJoinCommunity(community.id)}
                      className="px-3 py-1 bg-deep-purple hover:bg-medium-purple text-white text-sm rounded transition-colors"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityArea;
