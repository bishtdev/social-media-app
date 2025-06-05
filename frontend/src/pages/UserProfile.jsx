import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import { FaCalendar, FaHeart } from "react-icons/fa";
import { FaMessage, FaRepeat } from "react-icons/fa6";

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/users/${id}/profile`);
        setProfile(res.data);
        setLoading(false);
      } catch (error) {
        console.error("error to fetch profile", error);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-blue-400 text-xl">Loading profile...</div>
      </div>
    );
    
  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-gray-400 text-xl">Profile not found</div>
      </div>
    );

  // Create a handle from username by removing spaces and making it lowercase
  const userHandle = profile.user.username.toLowerCase().replace(/\s+/g, '');

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div className="max-w-xl mx-auto text-white">
        {/* Header with back button */}
        <div className="sticky top-0 z-10 bg-black bg-opacity-80 backdrop-blur-sm px-4 py-2 border-b border-gray-800">
          <div className="flex items-center">
            <h2 className="text-xl font-bold ml-6">{profile.user.username}</h2>
          </div>
          <div className="text-gray-500 text-sm ml-6">
            {profile.posts.length} {profile.posts.length === 1 ? 'Post' : 'Posts'}
          </div>
        </div>
        
        {/* Profile header with banner and avatar */}
        <div className="relative">
          {/* Banner image - using placeholder gray */}
          <div className="h-32 bg-gray-800"></div>
          
          {/* Profile avatar - positioned to overlap the banner */}
          <div className="absolute left-4 -bottom-16">
            <div className="w-24 h-24 bg-gray-700 rounded-full border-4 border-black flex items-center justify-center text-3xl font-bold">
               <img 
                src={`http://localhost:5000${profile.user.profilePicture}`} 
                alt="post" 
                className="w-24 h-24 object-fill  rounded-full"
              />
            </div>
          </div>
        </div>
        
        {/* Profile info section */}
        <div className="mt-20 px-4">
          <div className="mb-3">
            <h1 className="text-xl font-bold">{profile.user.username}</h1>
            <div className="text-gray-500">@{userHandle}</div>
          </div>
          
          {/* Bio would go here if available */}
          {profile.user.bio && (
            <p className="mb-3">{profile.user.bio}</p>
          )}
          
          {/* Mocked profile metadata */}
          <div className="flex items-center text-gray-500 text-sm mb-4 flex-wrap">
            <div className="flex items-center mr-4">
              <FaCalendar size={16} className="mr-1" />
              <span>Joined {new Date(profile.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          
          {/* Followers/Following counts */}
          <div className="flex text-gray-400 text-sm mb-4">
            <div className="mr-4 hover:underline cursor-pointer">
              <span className="text-white font-bold mr-1">{profile.user.following?.length || 0}</span> Following
            </div>
            <div className="hover:underline cursor-pointer">
              <span className="text-white font-bold mr-1">{profile.user.followers?.length || 0}</span> Followers
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-800 mt-3">
          <div className="flex">
            <div className="px-4 py-3 border-b-4 border-blue-500 font-medium text-center text-sm">
              Posts
            </div>
            <div className="px-4 py-3 text-gray-500 text-center hover:bg-gray-900/30 transition-colors text-sm">
              Replies
            </div>
            <div className="px-4 py-3 text-gray-500 text-center hover:bg-gray-900/30 transition-colors text-sm">
              Media
            </div>
            <div className="px-4 py-3 text-gray-500 text-center hover:bg-gray-900/30 transition-colors text-sm">
              Likes
            </div>
          </div>
        </div>
        
        {/* User's Posts */}
        <div className="divide-y divide-gray-800">
          {profile.posts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xl font-bold">@{userHandle} hasn't posted</p>
              <p className="text-gray-500 mt-1">When they do, their posts will show up here.</p>
            </div>
          ) : (
            profile.posts.map((post) => (
              <Link
                to={`/posts/${post._id}`}
                key={post._id}
                className="block p-4 hover:bg-gray-900/30 transition-colors duration-200"
              >
                <div className="flex">
                  {/* User avatar */}
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      {
                        profile.user.profilePicture ? (
                          <img src={`http://localhost:5000${profile.user.profilePicture}`} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center"> 
                            <span className="text-white text-sm font-medium">
                              {profile.user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )
                      }
      
                    </div>
                  </div>
                  
                  {/* Post content */}
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-bold">{profile.user.username}</span>
                      <span className="text-gray-500 mx-1">@{userHandle}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500 ml-1">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {post.title && <h4 className="font-bold">{post.title}</h4>}
                    <p className="text-gray-300 mt-1">
                      {post.content.length > 150 
                        ? `${post.content.substring(0, 150)}...` 
                        : post.content}
                    </p>
                    
                    {/* Post image would go here */}
                    {post.image && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-gray-800">
                        <img
                          src={`http://localhost:5000/uploads/${post.image}`}
                          alt="post"
                          className="max-h-80 w-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Interaction buttons */}
                    <div className="flex mt-3 text-gray-500 max-w-md justify-around">
                      <div className="flex items-center group hover:text-blue-400">
                        <div className="p-2 rounded-full group-hover:bg-blue-900/20">
                          <FaMessage size={16} />
                        </div>
                        <span className="text-xs ml-1">{post.comments?.length || 0}</span>
                      </div>
                      
                      {/* <div className="flex items-center group hover:text-green-400">
                        <div className="p-2 rounded-full group-hover:bg-green-900/20">
                          <FaRepeat size={16} />
                        </div>
                      </div> */}
                      
                      <div className="flex items-center group hover:text-pink-400">
                        <div className="p-2 rounded-full group-hover:bg-pink-900/20">
                          <FaHeart size={16} />
                        </div>
                        <span className="text-xs ml-1">{post.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;