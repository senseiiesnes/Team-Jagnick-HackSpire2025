import React, { useState } from 'react';
import CommunityChat from './CommunityChat';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

const CommunityArea: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: '1',
      name: 'Mindfulness Meditation',
      description: 'A community dedicated to daily mindfulness meditation practices and techniques.',
      memberCount: 428,
    },
    {
      id: '2',
      name: 'Mental Health Support',
      description: 'A safe space to discuss mental health challenges and provide mutual support.',
      memberCount: 352,
    },
    {
      id: '3',
      name: 'Productivity Hackers',
      description: 'Share and discover productivity techniques, tools, and habits.',
      memberCount: 215,
    },
    {
      id: '4',
      name: 'Creative Writing',
      description: 'For those who love writing and want to improve their creative writing skills.',
      memberCount: 178,
    },
  ]);

  const [userCommunities, setUserCommunities] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  const handleJoinCommunity = (communityId: string) => {
    if (!userCommunities.includes(communityId)) {
      setUserCommunities([...userCommunities, communityId]);
    }
  };

  const handleLeaveCommunity = (communityId: string) => {
    setUserCommunities(userCommunities.filter(id => id !== communityId));
  };

  const handleCreateCommunity = () => {
    if (newCommunity.name.trim() === '' || newCommunity.description.trim() === '') {
      return;
    }

    const newId = (communities.length + 1).toString();
    const createdCommunity: Community = {
      id: newId,
      name: newCommunity.name,
      description: newCommunity.description,
      memberCount: 1,
    };

    setCommunities([...communities, createdCommunity]);
    setUserCommunities([...userCommunities, newId]);
    setNewCommunity({ name: '', description: '' });
    setShowCreateModal(false);
  };

  const handleSelectCommunity = (community: Community) => {
    setSelectedCommunity(community);
  };

  if (selectedCommunity) {
    return (
      <CommunityChat 
        communityId={selectedCommunity.id}
        communityName={selectedCommunity.name}
        onBack={() => setSelectedCommunity(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communities</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg transition-colors"
        >
          Create Community
        </button>
      </div>

      {userCommunities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities
              .filter(community => userCommunities.includes(community.id))
              .map(community => (
                <div
                  key={community.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {community.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                      {community.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {community.memberCount} members
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSelectCommunity(community)}
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Discover Communities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities
            .filter(community => !userCommunities.includes(community.id))
            .map(community => (
              <div
                key={community.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {community.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                    {community.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {community.memberCount} members
                    </span>
                    <button
                      onClick={() => handleJoinCommunity(community.id)}
                      className="px-3 py-1 bg-deep-purple hover:bg-medium-purple text-white text-sm rounded transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Create New Community
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="community-name">
                Community Name
              </label>
              <input
                id="community-name"
                type="text"
                value={newCommunity.name}
                onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
                placeholder="E.g., Mindfulness Meditation"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="community-description">
                Description
              </label>
              <textarea
                id="community-description"
                value={newCommunity.description}
                onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
                placeholder="Describe the purpose of your community"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCommunity}
                className="px-4 py-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityArea;
