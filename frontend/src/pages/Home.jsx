import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import { FiHome, FiUser, FiBell, FiMail, FiBookmark, FiMoreHorizontal, FiPlus, FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts', err);
      }
    };

    getPosts();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 768) {
        // Check if the click is outside the sidebar
        const sidebar = document.getElementById('mobile-sidebar');
        const hamburgerButton = document.getElementById('hamburger-button');
        
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
      <Navbar/>
      
      {/* Hamburger menu for mobile */}
      <button 
        id="hamburger-button"
        className="md:hidden fixed top-18 right-4 z-30 p-2 rounded-full bg-gray-900 hover:bg-blue-600 text-white"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      <div className="max-w-7xl mx-auto flex relative">
        {/* Sidebar - fixed on desktop, slide-in on mobile */}
        <div 
          id="mobile-sidebar"
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } transform transition-transform duration-300 ease-in-out fixed md:fixed top-0 left-0 h-screen z-20 bg-black w-3/4 sm:w-64 md:w-64 px-4 pt-20 md:pt-20 border-r border-gray-800 md:border-r-0`}
        >
          <div className="space-y-6 mb-6">
            <Link to="/" className="flex items-center text-xl p-3 rounded-full hover:bg-gray-800 text-white">
              <FiHome className="mr-4" />
              <span className="font-bold">Home</span>
            </Link>
            <Link to="/dashboard" className="flex items-center text-xl p-3 rounded-full hover:bg-gray-800 text-white">
              <FiUser className="mr-4" />
              <span>Profile</span>
            </Link>
            <Link to="/notifications" className="flex items-center text-xl p-3 rounded-full hover:bg-gray-800 text-white">
              <FiBell className="mr-4" />
              <span>Notifications</span>
            </Link>
            <Link to="/messages" className="flex items-center text-xl p-3 rounded-full hover:bg-gray-800 text-white">
              <FiMail className="mr-4" />
              <span>Messages</span>
            </Link>
            <Link to="/bookmarks" className="flex items-center text-xl p-3 rounded-full hover:bg-gray-800 text-white">
              <FiBookmark className="mr-4" />
              <span>Bookmarks</span>
            </Link>
          </div>
          
          <Link to="/create" className="block w-full">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full w-full">
              Post
            </button>
          </Link>
          
          {user && (
            <Link to={`/users/${user._id}`} className="flex items-center mt-4">
              <div className="mt-8 flex items-center hover:bg-gray-800 p-3 rounded-full cursor-pointer w-full">
                {user.profilePicture ? (
                  <img 
                    src={`http://localhost:5000${user.profilePicture}`} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
                )}
                <div className="flex-1 truncate">
                  <p className="font-bold truncate text-white">{user.username || 'User'}</p>
                  <p className="text-gray-500 truncate">@{user.username || 'username'}</p>
                </div>
                <FiMoreHorizontal className="text-white" />
              </div>
            </Link>
          )}
        </div>
        
        {/* Backdrop overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Main content - with left margin to make space for sidebar */}
        <div className="w-full md:ml-64 pl-4 pr-4 pt-4">
          <div className=" bg-black bg-opacity-70 backdrop-blur-md pb-2">
            <h1 className="text-2xl font-semibold mb-4 text-white">Trending</h1>
          </div>
          
          {/* Posts grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts
              .slice()
              .reverse()
              .map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
          </div>
        </div>
      </div>
      
      {/* Mobile floating action button */}
      {/* <Link to="/create" className="md:hidden fixed bottom-20 right-6 z-10">
        <button className="bg-blue-500 hover:bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
          <FiPlus className="w-6 h-6" />
        </button>
      </Link> */}
    </div>
  );
};

export default Home;