import { FaBookmark, FaHeart, FaHeartBroken, FaRegBookmark, FaTrash } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { FaPencil } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";
import Navbar from "../components/Navbar";
import { updateBookmarks } from "../features/auth/authSlice";

const SinglePost = () => {
    const {id} = useParams();
    const {user, token} = useSelector((state)=> state.auth)
    const [post, setPost] = useState(null);
    const [comment , setComment] = useState("");
    const[activeReplyId, setActiveReplyId] = useState(null);
    const[replyText, setReplyText] = useState({})
    const [expandedReplies, setExpandedReplies] = useState({});
    const navigate = useNavigate();
    // const [bookmarked, setBookmarked] = useState(false);

    //to fetch the post
    useEffect(()=>{
        const fetchPost = async () =>{
           try {
            const res = await axios.get(`/posts/${id}`)
            setPost(res.data);
           } catch (error) {
            console.log("failed to fetch the post: ",error);
           }
        };
        fetchPost();
        
    },[id])


      //to like the post
    const handleLike = async () => {
        try {
          const res = await axios.post(`/posts/${id}/like`, { userId: user._id }, {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          if (res.status === 200) {
            setPost(res.data.post); // Update the post state with the updated post
          }
        } catch (error) {
          console.error("Failed to like the post: ", error);
        }
      };
    
    // to like the comment
    const handleComment = async () =>{
        try {
            const res = await axios.post(`/posts/${id}/comment`, {text: comment},{
                headers:{Authorization:`Bearer ${token}`}
            });
            setPost(res.data)
            setComment("")
        } catch (error) {
            console.error("failed to comment on the post: ", error)
        }
    }

    // to delete the post 
    const handleDelete = async () =>{
        try {
            const res = await axios.delete(`/posts/${id}`,{
                headers:{Authorization:`Bearer ${token}`}
            });
            navigate("/dashboard")
        } catch (error) {
            console.error("failed to delete the post: ", error)
        }
    }

    //to handle replies
    const handleReply = async (commentId) =>{
      try {
        const res = await axios.post(`/posts/${id}/comment/${commentId}/reply`,
        {text: replyText[commentId]},
        {
          headers: {Authorization: `Bearer ${token}`}
        });
        setPost(res.data)
        console.log("nested reply", res.data)
        setReplyText(prev => ({...prev, [commentId]:""}))
        setActiveReplyId(null)
        // Auto-expand replies section when a new reply is added
        setExpandedReplies(prev => ({...prev, [commentId]: true}))
      } catch (error) {
        console.log("failed to reply to comment",error)
      }
    }

    //to handle likes on comment
    const handleCommentLike = async (commentId) => {
      try {
          const res = await axios.post(`/posts/${id}/comment/${commentId}/like`, 
          {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setPost(res.data); // assuming updated post is returned
      } catch (error) {
          console.error("Failed to like the comment: ", error);
      }
   };

   // Toggle replies visibility
   const toggleReplies = (commentId) => {
     setExpandedReplies(prev => ({
       ...prev,
       [commentId]: !prev[commentId]
     }));
   };


   
  //  useEffect(() => {
  // setBookmarked(user?.bookmarks?.includes(post._id));
  // }, [user, post]);

const dispatch = useDispatch();

const handleBookmark = async () => {
  try {
    const res = await axios.post(`/posts/${post._id}/bookmarks`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    });

    dispatch(updateBookmarks(res.data.bookmarks)); // update Redux store only
  } catch (error) {
    console.error(error);
  }
};


    if(!post) return <div className='text-center mt-20'> Loading......</div>
  return (
    <div className="bg-gray-950">
      <Navbar />
      <div className="max-w-xl mx-auto bg-black text-white min-h-screen">
        {/* Post header with author info */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white mr-3">
              <img
                src={`http://localhost:5000${post.author.profilePicture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover "
              />
            </div>
            <Link to={`/users/${post.author._id}`}>
              <div>
                <div className="font-bold">{post.author?.username}</div>
                <div className="text-gray-500">
                  @{post.author?.username.toLowerCase().replace(/\s+/g, "")}
                </div>
              </div>
            </Link>
          </div>

          {/* Post title and content */}
          {post.title && (
            <h1 className="text-xl font-bold mb-2">{post.title}</h1>
          )}
          <div className="text-lg mb-3">{post.content}</div>

          {/* Post image */}
          {post.image && (
            <div className="mt-2 mb-3 rounded-2xl overflow-hidden border border-gray-800">
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                alt="post"
                className="w-full object-cover max-h-96"
              />
            </div>
          )}

          {/* Post metadata - time */}
          <div className="text-gray-500 text-sm py-3 border-t border-b border-gray-800">
            {new Date(post.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            ·{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {/* Like & Comment Count */}
          <div className="py-3 border-b border-gray-800">
            <div className="flex space-x-5">
              <div>
                <span className="font-bold">{post.likes?.length || 0}</span>
                <span className="text-gray-500 ml-1">Likes</span>
              </div>
              <div>
                <span className="font-bold">
                  {(post.comments?.length || 0) +
                    (post.comments?.reduce(
                      (acc, comment) => acc + (comment.replies?.length || 0),
                      0
                    ) || 0)}
                </span>
                <span className="text-gray-500 ml-1">Comments</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-around py-2 border-b border-gray-800">
            <button className="flex items-center text-gray-400 hover:text-blue-400">
              <FiMessageCircle size={18} className="mr-2" />
              <span className="text-sm">Comment</span>
            </button>

            <button
              onClick={handleLike}
              className="flex items-center text-gray-400 hover:text-pink-500"
            >
              <FaHeart
                size={18}
                className="mr-2"
                fill={post.likes?.includes(user?._id) ? "#ec4899" : "gray"}
                color={
                  post.likes?.includes(user?._id) ? "#ec4899" : "currentColor"
                }
              />
              <span className="text-sm">{post.likes?.length || 0}</span>
            </button>

            {user?._id === post.author?._id && (
              <>
                <button
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                  className="flex items-center text-gray-400 hover:text-yellow-500"
                >
                  <FaPencil size={18} className="mr-2" />
                  <span className="text-sm">Edit</span>
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center text-gray-400 hover:text-red-500"
                >
                  <FaTrash size={18} className="mr-2" />
                  <span className="text-sm">Delete</span>
                </button>
              </>
            )}
           <button onClick={handleBookmark} className="text-white">
            {user?.bookmarks?.includes(post._id) ? (
              <FaBookmark  size={18} className="mr-2" />
            ) : (
              <FaRegBookmark  size={18} className="mr-2" />
            )}
          </button>

          </div>
        </div>

        {/* Comments section */}
        <div className="px-4 py-2">
          {/* Comment input */}
          <div className="flex items-center border-b border-gray-800 pb-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white mr-3">
              <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover "
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Post your reply"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-transparent border border-gray-700 focus:border-blue-400 rounded-full py-2 px-4 focus:outline-none"
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim()}
                className={`absolute right-2 top-2 ${
                  comment.trim()
                    ? "text-blue-400 hover:bg-blue-900/20"
                    : "text-gray-600"
                } p-1 rounded-full`}
              >
                <IoMdSend size={16} />
              </button>
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {post.comments?.map((c) => (
              <div key={c._id} className="pt-2 pl-2 border-l border-gray-700">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full mr-3">
                    <img
                      src={`http://localhost:5000${c.user?.profilePicture}`}
                      className="w-10 h-10 rounded-full object-cover ogComment"
                    />
                  </div>
                  <div className="flex-1">
                    <Link to={`/users/${c.user._id}`}>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">
                          {c.user?.username}
                        </span>
                        <span className="text-gray-500">
                          @{c.user?.username?.toLowerCase().replace(/\s+/g, "")}
                        </span>
                      </div>
                    </Link>

                    <div className="mt-1">{c.text}</div>

                    {/* Comment actions */}
                    <div className="flex text-sm text-gray-400 mt-1 space-x-4">
                      <button
                        onClick={() => handleCommentLike(c._id)}
                        className="hover:text-pink-500"
                      >
                        <FaHeart
                          size={14}
                          className="inline mr-1"
                          fill={
                            c.likes?.includes(user._id) ? "#ec4899" : "gray"
                          }
                        />
                        {c.likes?.length || 0}
                      </button>
                      <button
                        onClick={() =>
                          setActiveReplyId(
                            activeReplyId === c._id ? null : c._id
                          )
                        }
                        className="hover:text-blue-400"
                      >
                        Reply
                      </button>
                      {c.replies?.length > 0 && (
                        <button
                          onClick={() => toggleReplies(c._id)}
                          className="hover:text-blue-400 flex items-center"
                        >
                          {expandedReplies[c._id] ? (
                            <>
                              <FaChevronDown size={12} className="mr-1" /> Hide{" "}
                              {c.replies.length}{" "}
                              {c.replies.length === 1 ? "reply" : "replies"}
                            </>
                          ) : (
                            <>
                              <FaChevronRight size={12} className="mr-1" /> Show{" "}
                              {c.replies.length}{" "}
                              {c.replies.length === 1 ? "reply" : "replies"}
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Reply input */}
                    {activeReplyId === c._id && (
                      <div className="flex items-center mt-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText[c._id] || ""}
                          onChange={(e) =>
                            setReplyText({
                              ...replyText,
                              [c._id]: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border border-gray-700 rounded-full py-1 px-3 mr-2"
                        />
                        <button
                          onClick={() => handleReply(c._id)}
                          className="text-blue-400 hover:text-blue-600"
                          disabled={!replyText[c._id]?.trim()}
                        >
                          <IoMdSend size={18} />
                        </button>
                      </div>
                    )}

                    {/* Nested replies (basic 1 level) - now collapsible */}
                    {c.replies?.length > 0 && expandedReplies[c._id] && (
                      <div className="mt-3 space-y-2 pl-5 border-l border-gray-700">
                        {c.replies.map((reply) => (
                          <div key={reply._id} className="flex">
                            <div className="w-8 h-8 rounded-full mr-2">
                              <img
                                src={`http://localhost:5000${reply.user?.profilePicture}`}
                                className="w-8 h-8 rounded-full object-cover nestedComment"
                              />
                            </div>
                            <div className="flex-1">
                              <Link to={`/users/${reply.user._id}`}>
                                <div className="text-sm font-bold">
                                  {reply.user?.username}
                                </div>
                                <div className="text-sm">{reply.text}</div>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {post.comments?.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePost