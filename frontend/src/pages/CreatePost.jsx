import React, { useState } from 'react';
import Navbar from '../components/Navbar'
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiPhotograph } from 'react-icons/hi';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

   try {
    const config ={
      headers:{
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
    await axios.post("/posts", formData, config);
    navigate("/dashboard");
   } catch (error) {
    setError(error.response?.error?.message || "something went wrong")  
   }
  }

  return (
     <>
     <div className='bg-black h-[100vh]'>
     <Navbar/>
      <div className="max-w-xl m-2 md:mx-auto mt-4 bg-black text-white rounded-xl overflow-hidden border border-gray-800">
  <div className="p-4 border-b border-gray-800">
    <h2 className="text-xl font-bold">Create Post</h2>
  </div>
  
  <form onSubmit={handleSubmit} className="p-4" encType="multipart/form-data">
    {/* Error message */}
    {error && (
      <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
        {error}
      </div>
    )}

    {/* Content area */}
    <div className="flex space-x-3">
      {/* Avatar placeholder */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-700">
          <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover mr-4"
              />
        </div>
      </div>
      
      {/* Input fields */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Title"
          className="w-full bg-transparent text-xl placeholder-gray-500 outline-none mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <textarea
          placeholder="What's happening?"
          className="w-full bg-transparent text-lg placeholder-gray-500 outline-none resize-none"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>

    {/* Image preview */}
    {image && (
      <div className="mt-4 ml-13 relative">
        <img 
          src={URL.createObjectURL(image)} 
          alt="Preview" 
          className="rounded-xl max-h-80 object-cover w-full"
        />
        <button
          type="button"
          onClick={() => setImage(null)}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          ✕
        </button>
      </div>
    )}

    {/* Bottom toolbar */}
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
      {/* File upload button */}
      <label className="cursor-pointer p-2 rounded-full hover:bg-blue-900/20 group">
        
        <HiPhotograph className="w-6 h-6 text-blue-500 group-hover:text-blue-400"  />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!title || !content}
        className={`px-4 py-1.5 rounded-full font-bold ${(!title || !content) ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        Post
      </button>
    </div>
  </form>
</div>
     </div>
     </>
  )
}

export default CreatePost