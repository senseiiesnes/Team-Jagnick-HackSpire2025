import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SettingsProps {
  className?: string;
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ className = '', onBack }) => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'privacy'>('profile');
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    age: '',
    bio: '',
    image: null as string | null
  });

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [blogAlerts, setBlogAlerts] = useState(false);

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const data = await response.json();
            setUserData({
              name: data.name || '',
              username: data.username || '',
              email: data.email || '',
              age: data.age?.toString() || '',
              bio: data.bio || '',
              image: data.image || null
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session, status]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          age: parseInt(userData.age),
          bio: userData.bio
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || 'Failed to update profile', type: 'error' });
      } else {
        setMessage({ text: 'Profile updated successfully', type: 'success' });
        // Update session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            name: userData.name,
            email: userData.email,
          }
        });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred while updating profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage({ text: data.message || 'Failed to update password', type: 'error' });
      } else {
        setPasswordMessage({ text: 'Password updated successfully', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setPasswordMessage({ text: 'An error occurred while updating password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      });

      if (response.ok) {
        // Sign out and redirect to landing
        await signOut({ redirect: false });
        router.push('/landing');
      } else {
        const data = await response.json();
        setMessage({ text: data.message || 'Failed to delete account', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred while deleting account', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle profile photo change
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/photo', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessage({ text: data.message || 'Failed to upload photo', type: 'error' });
      } else {
        setUserData({
          ...userData,
          image: data.image
        });
        setMessage({ text: 'Photo updated successfully', type: 'success' });
        
        // Update session
        await update({
          ...session,
          user: {
            ...session?.user,
            image: data.image
          }
        });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred while uploading photo', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-deep-purple dark:border-pale-pink mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className={`w-full max-w-5xl mx-auto p-6 ${className}`}>
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-deep-purple via-medium-purple to-muted-rose dark:from-pale-pink dark:via-muted-rose dark:to-deep-purple bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
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
        {(['profile', 'account', 'notifications', 'privacy'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-1 py-3 px-6 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-800 text-deep-purple dark:text-pale-pink border-t border-l border-r border-gray-200 dark:border-gray-700'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <form onSubmit={handleProfileUpdate}>
            {message.text && (
              <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                {message.text}
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4">
                  {userData.image ? (
                    <Image 
                      src={userData.image} 
                      alt={userData.name || "Profile"} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-deep-purple to-medium-purple dark:from-muted-rose dark:to-pale-pink text-white font-bold text-3xl flex items-center justify-center">
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <button 
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-2 bg-deep-purple hover:bg-medium-purple text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Change Photo
                </button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    value={userData.name} 
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
                  />
                </div>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input 
                    type="text" 
                    id="username"
                    value={userData.username} 
                    onChange={(e) => setUserData({...userData, username: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    value={userData.email} 
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input 
                    type="number" 
                    id="age"
                    min="13"
                    max="120"
                    value={userData.age} 
                    onChange={(e) => setUserData({...userData, age: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea 
                    id="bio" 
                    rows={4}
                    value={userData.bio} 
                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 bg-deep-purple hover:bg-medium-purple text-white rounded-lg font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Change Password</h3>
              {passwordMessage.text && (
                <div className={`mb-4 p-3 rounded ${passwordMessage.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {passwordMessage.text}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input 
                    type="password" 
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input 
                    type="password" 
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input 
                    type="password" 
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 bg-deep-purple hover:bg-medium-purple text-white rounded-lg font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Delete Account</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button 
                onClick={handleDeleteAccount}
                disabled={loading}
                className={`px-6 py-2.5 ${deleteConfirm ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-lg font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : deleteConfirm ? 'Click Again to Confirm Deletion' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Notification Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email updates about your account activity
                </p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggle-email" 
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-deep-purple dark:checked:border-pale-pink"
                />
                <label 
                  htmlFor="toggle-email" 
                  className="block h-6 overflow-hidden bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">App Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications within the app
                </p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggle-app" 
                  checked={appNotifications}
                  onChange={() => setAppNotifications(!appNotifications)}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-deep-purple dark:checked:border-pale-pink"
                />
                <label 
                  htmlFor="toggle-app" 
                  className="block h-6 overflow-hidden bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">New Blog Alerts</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when new blogs are published
                </p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggle-blogs"
                  checked={blogAlerts}
                  onChange={() => setBlogAlerts(!blogAlerts)}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-deep-purple dark:checked:border-pale-pink"
                />
                <label 
                  htmlFor="toggle-blogs" 
                  className="block h-6 overflow-hidden bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                className="px-6 py-2.5 bg-deep-purple hover:bg-medium-purple text-white rounded-lg font-medium transition-colors"
              >
                Save Notification Settings
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Privacy Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white mb-3">Profile Visibility</h3>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-deep-purple dark:focus:ring-pale-pink">
                <option value="public">Public - Anyone can view your profile</option>
                <option value="registered">Registered Users - Only registered users can view</option>
                <option value="friends">Friends Only - Only your friends can view</option>
                <option value="private">Private - Only you can view</option>
              </select>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />
            
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white mb-3">Data Usage</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="data-improve" 
                    className="h-4 w-4 text-deep-purple dark:text-pale-pink focus:ring-deep-purple dark:focus:ring-pale-pink border-gray-300 dark:border-gray-600 rounded"
                    defaultChecked
                  />
                  <label htmlFor="data-improve" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Use my data to improve services
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="data-personalize" 
                    className="h-4 w-4 text-deep-purple dark:text-pale-pink focus:ring-deep-purple dark:focus:ring-pale-pink border-gray-300 dark:border-gray-600 rounded"
                    defaultChecked
                  />
                  <label htmlFor="data-personalize" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Personalize my experience based on my activity
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                className="px-6 py-2.5 bg-deep-purple hover:bg-medium-purple text-white rounded-lg font-medium transition-colors"
              >
                Save Privacy Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 