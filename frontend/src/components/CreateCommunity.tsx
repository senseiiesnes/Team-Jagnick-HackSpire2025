import React, { useState } from 'react';

interface CreateCommunityProps {
  onSubmit: (name: string, description: string) => void;
  onCancel: () => void;
}

const CreateCommunity: React.FC<CreateCommunityProps> = ({ onCancel, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Community name is required');
      return;
    }
    
    if (!description.trim()) {
      setError('Community description is required');
      return;
    }
    
    onSubmit(name, description);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="mr-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Community</h1>
      </div>
      
      <div className="max-w-2xl mx-auto w-full">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="community-name">
              Community Name
            </label>
            <input
              id="community-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Mindfulness Practice"
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="community-description">
              Description
            </label>
            <textarea
              id="community-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-purple dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder="Describe what your community is about..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg transition-colors"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity; 