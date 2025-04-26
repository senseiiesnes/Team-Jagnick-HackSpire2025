import React from 'react';

const CommunityArea = () => {
  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-deep-purple dark:text-pale-pink mb-4">
        Community
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Connect with others on their mental health journeys.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Community Group {i}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {i * 24} members • {i % 2 === 0 ? 'Public' : 'Private'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityArea;
