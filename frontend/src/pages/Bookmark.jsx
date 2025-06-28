// src/pages/Bookmark.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiBookmark, FiMessageCircle, FiHeart, FiShare2, FiClock } from 'react-icons/fi';

const Bookmark = () => {
  const { token } = useSelector((state) => state.auth);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get('/users/bookmarks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarks(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Main Content */}
      <div className="md:max-w-xl mx-auto border-x border-gray-800 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm p-4 border-b border-gray-800">
          <div className="flex items-center">
            <FiBookmark className="text-xl mr-4" />
            <h1 className="text-xl font-bold">Bookmarks</h1>
          </div>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length === 0 ? (
          <div className="p-8 text-center">
            <FiBookmark className="mx-auto text-4xl text-gray-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Save posts for later</h2>
            <p className="text-gray-500">When you bookmark posts, they'll show up here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {bookmarks.map((post) => (
              <div key={post._id} className="p-4 hover:bg-gray-900/50 transition-colors duration-200">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    {post.author?.profilePicture ? (
                      <img
                        src={`http://localhost:5000${post.author.profilePicture}`}
                        alt={post.author?.username || "author"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {post.author?.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Link to={`/users/${post.author?._id}`} className="font-bold hover:underline">
                        {post.author?.username || "Unknown"}
                      </Link>
                      <span className="text-gray-500 mx-1">·</span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiClock className="mr-1" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <Link to={`/posts/${post._id}`} className="block mt-1">
                      {post.title && <h2 className="text-lg font-semibold mb-1">{post.title}</h2>}
                      <p className="text-gray-300">
                        {post.content?.slice(0, 200)}
                        {post.content?.length > 200 && '...'}
                      </p>
                    </Link>

                    {/* Post Actions */}
                    <div className="flex justify-between mt-3 text-gray-500 max-w-md">
                      <button className="flex items-center group">
                        <div className="p-2 rounded-full group-hover:bg-blue-900/20 group-hover:text-blue-500">
                          <FiMessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs ml-1">{post.comments?.length || 0}</span>
                      </button>
                      <button className="flex items-center group">
                        <div className="p-2 rounded-full group-hover:bg-pink-900/20 group-hover:text-pink-500">
                          <FiHeart className="w-5 h-5" />
                        </div>
                        <span className="text-xs ml-1">{post.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center group">
                        <div className="p-2 rounded-full group-hover:bg-blue-900/20 group-hover:text-blue-500">
                          <FiShare2 className="w-5 h-5" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmark;