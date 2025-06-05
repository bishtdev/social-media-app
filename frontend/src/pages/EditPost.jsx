import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { FiX, FiImage, FiSmile, FiCalendar, FiMapPin } from "react-icons/fi";

const EditPost = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setCharCount(res.data.content.length);
        setLoading(false);
      } catch (error) {
        console.error("failed to fetch the post: ", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `/posts/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("failed to update the post: ", error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto">
        <div className="border-b border-gray-800 p-4 flex items-center">
          <button 
            onClick={() => navigate("/dashboard")} 
            className="mr-4 p-2 rounded-full hover:bg-gray-800"
          >
            <FiX className="text-white" />
          </button>
          <h1 className="text-xl font-bold">Edit Post</h1>
          <button
            onClick={handleUpdate}
            className="ml-auto bg-blue-500 text-white px-5 py-1 rounded-full font-bold hover:bg-blue-600"
          >
            Update
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-transparent text-lg font-bold mb-2 focus:outline-none border-b border-gray-800 pb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <textarea
            placeholder="What's happening?"
            className="w-full bg-transparent text-white resize-none mt-4 focus:outline-none h-40"
            value={content}
            onChange={handleContentChange}
          />

          <div className="border-t border-gray-800 pt-3 mt-3 flex items-center">
            <div className="flex space-x-4 text-blue-400">
              <button className="hover:bg-blue-500/10 p-2 rounded-full">
                <FiImage className="w-5 h-5" />
              </button>
              <button className="hover:bg-blue-500/10 p-2 rounded-full">
                <FiSmile className="w-5 h-5" />
              </button>
              <button className="hover:bg-blue-500/10 p-2 rounded-full">
                <FiCalendar className="w-5 h-5" />
              </button>
              <button className="hover:bg-blue-500/10 p-2 rounded-full">
                <FiMapPin className="w-5 h-5" />
              </button>
            </div>
            
            <div className="ml-auto flex items-center">
              {charCount > 200 && (
                <span className={`text-sm mr-2 ${charCount > 280 ? 'text-red-500' : 'text-gray-400'}`}>
                  {280 - charCount}
                </span>
              )}
              
              <div className="w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 32 32" className={`w-6 h-6 ${charCount > 200 ? charCount > 280 ? 'text-red-500' : 'text-blue-400' : 'text-gray-600'}`}>
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    strokeDasharray="88"
                    strokeDashoffset={88 - ((Math.min(charCount, 280) / 280) * 88)}
                  />
                </svg>
              </div>

              <form onSubmit={handleUpdate} className="ml-4">
                <button
                  type="submit"
                  className={`px-5 py-1 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 ${
                    charCount > 280 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={charCount > 280}
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;