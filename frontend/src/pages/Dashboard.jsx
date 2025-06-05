import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { FiHome, FiUser, FiBell, FiMail, FiBookmark, FiMoreHorizontal, FiPlus, FiCamera, FiX, FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { updateUser } from '../features/auth/authSlice';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getMyPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/posts');
        const myPosts = res.data.filter((p) =>
          (p.author?._id && p.author._id === user._id) ||
          (typeof p.author === 'string' && p.author === user._id));
        console.log("Logged-in User ID:", user._id);
        console.log("Fetched Posts:", res.data);
        console.log("Redux user:", user);
        setPosts(myPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts', err);
        setLoading(false);
      }
    };
    
    getMyPosts();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('profilePicture', selectedFile);

  try {
    setUploading(true);
    const res = await axios.put('/users/profile-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    dispatch(updateUser({ profilePicture: res.data.profilePicture }));

    setSelectedFile(null);
    setPreviewUrl(null);
  } catch (error) {
    console.error('Profile picture upload failed:', error);
  } finally {
    setUploading(false);
  }
};


  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile ok done
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById('dashboard-sidebar');
        const hamburgerButton = document.getElementById('dashboard-hamburger-button');
        
        if (sidebar && !sidebar.contains(event.target) && 
            hamburgerButton && !hamburgerButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className='bg-black min-h-screen text-white'>
      <Navbar />
      
      {/* Hamburger menu for mobile */}
      <button 
        id="dashboard-hamburger-button"
        className="md:hidden fixed top-18 right-4 z-30 p-2 rounded-full bg-gray-900 hover:bg-blue-600 text-white"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur-md border-b border-gray-800 px-4 py-3">
        <div className="flex items-center">
          {user && user.profilePicture ? (
           <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover mr-4"
              />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 mr-4"></div>
          )}
          <h1 className="text-xl font-bold">Your Posts</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex relative">
        {/* Sidebar for larger screens and mobile (when toggled) */}
        <div 
          id="dashboard-sidebar"
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } transform transition-transform duration-300 ease-in-out fixed md:fixed top-0 left-0 h-screen z-20 bg-black w-3/4 sm:w-64 md:w-64 px-4 pt-20 md:pt-16 border-r border-gray-800 md:border-r-0`}
        >
          {/* Profile Section */}
          {user && (
            <div className="mb-8 pb-6 border-b border-gray-800">
              <div className="relative mt-4 group">
                {/* Profile Picture with Overlay */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  {user.profilePicture ? (
                    <img
                      src={`http://localhost:5000${user.profilePicture}`}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                      <FiUser size={32} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Camera Icon Overlay */}
                  <label htmlFor="profile-upload" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <FiCamera size={24} className="text-white" />
                  </label>
                  
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                
                {/* User Info */}
                <div className="text-center">
                  <p className="font-bold text-lg">{user.username || 'User'}</p>
                  <p className="text-gray-500">@{user.username || 'username'}</p>
                </div>
              </div>
              
              {/* Preview & Upload Controls - Only show when file selected */}
              {selectedFile && (
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-sm text-gray-400 mb-2 truncate max-w-full">
                    {selectedFile.name}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleProfilePicUpload}
                      disabled={uploading}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full text-sm flex items-center"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        'Update Picture'
                      )}
                    </button>
                    
                    <button
                      onClick={cancelUpload}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-full text-sm"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Navigation Links */}
          <div className="space-y-2">
            <Link to="/" className="flex items-center text-lg p-3 rounded-full hover:bg-gray-800 transition-colors">
              <FiHome className="mr-4" />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="flex items-center text-lg p-3 rounded-full bg-gray-800 text-white transition-colors">
              <FiUser className="mr-4" />
              <span className="font-bold">Profile</span>
            </Link>
            <Link to="/notifications" className="flex items-center text-lg p-3 rounded-full hover:bg-gray-800 transition-colors">
              <FiBell className="mr-4" />
              <span>Notifications</span>
            </Link>
            <Link to="/messages" className="flex items-center text-lg p-3 rounded-full hover:bg-gray-800 transition-colors">
              <FiMail className="mr-4" />
              <span>Messages</span>
            </Link>
            <Link to="/bookmarks" className="flex items-center text-lg p-3 rounded-full hover:bg-gray-800 transition-colors">
              <FiBookmark className="mr-4" />
              <span>Bookmarks</span>
            </Link>
          </div>
          
          {/* Post Button */}
          <Link to="/create" className="block w-full mt-6">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full w-full transition-colors">
              Post
            </button>
          </Link>
        </div>
        
        {/* Backdrop overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="w-full md:ml-64 px-4 pt-4">
          {/* Desktop Header */}
          <div className="hidden md:block sticky top-16 z-10 bg-black bg-opacity-70 backdrop-blur-md pb-4">
            <h1 className="text-2xl font-bold mb-2">Your Posts</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 px-4 border border-gray-800 rounded-xl bg-gray-900 bg-opacity-30 mt-4">
              <div className="w-16 h-16 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mx-auto mb-4">
                <FiPlus className="text-blue-400 text-2xl" />
              </div>
              <p className="text-xl font-semibold mb-2">You haven't posted anything yet</p>
              <p className="text-gray-500 mb-6">When you post, your content will appear here.</p>
              <Link to="/create">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors">
                  Create your first post
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800 grid grid-cols-1 gap-6 md:grid-cols-2 ">
              {posts
                .slice()
                .reverse()
                .map((post) => (
                  <div key={post._id} className="py-4 hover:bg-gray-900/30 transition-colors">
                    <PostCard post={post} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile floating action button */}
      <Link to="/create" className="md:hidden fixed bottom-20 right-6 z-10">
        <button className="bg-blue-500 hover:bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
          <FiPlus className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;