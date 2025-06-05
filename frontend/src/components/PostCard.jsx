import React from 'react';
import { BsPencilSquare } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { user } = useSelector((state) => state.auth);
  const isAuthor =
  (post.author?._id && user?._id === post.author._id) ||
  (typeof post.author === 'string' && user?._id === post.author);


  return (
  
    <div className="bg-black text-white border-b border-gray-800 p-4 transition-colors duration-200 mb-1">
    {/* Author info */}
    <div className="flex items-start space-x-3">
      {/* Avatar placeholder - would normally be author's image */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
          <img
                src={`http://localhost:5000${post.author.profilePicture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover "
              />
        </div>
      </div>
  
      <div className="flex-1 min-w-0">
        {/* Author name and timestamp */}
        <div className="flex items-center space-x-1">
          <Link to={`/users/${post.author._id}`}><span className="font-bold text-white">@{post.author.username}</span></Link>
          <span className="text-gray-500 text-sm">·</span>
          <span className="text-gray-500 text-sm">2h</span>
        </div>
  
        {/* Post content */}
        <div className="mt-1">
          <h2 className="text-lg font-medium text-white">{post.title}</h2>
          <p className="text-gray-300 mt-1">{post.content.slice(0, 100)}...</p>
        </div>
  
        {/* Post image */}
        {post.image && (
          <div className="mt-3 rounded-xl overflow-hidden border border-gray-800">
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt="post"
              className="w-full max-h-80 object-cover"
            />
          </div>
        )}
  
        {/* Action buttons */}
        <div className="flex justify-between mt-3 max-w-md">
          <Link
            to={`/posts/${post._id}`}
            className="flex items-center text-gray-500 hover:text-blue-400 group"
          >
            <div className="p-2 rounded-full group-hover:bg-blue-900/20">
            <IoChatbubbleEllipsesOutline />
            </div>
            <span className="ml-1 text-sm">Read more</span>
          </Link>
  
          {isAuthor && (
            <Link 
              to={`/edit-post/${post._id}`}
              className="flex items-center text-gray-500 hover:text-green-400 group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-900/20">
              <BsPencilSquare />
              </div>
              <span className="ml-1 text-sm">Edit</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default PostCard;
