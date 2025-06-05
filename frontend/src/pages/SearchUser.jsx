import React, { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaSearch, FaUser } from "react-icons/fa";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get(`/users/search?username=${query}`);
      setResults(res.data);
    } catch (error) {
      console.error("Search error", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-xl mx-auto pt-2 px-4">
        {/* Search header */}
        <h1 className="text-xl font-bold mb-4 mt-2 px-2">Search</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="sticky top-0 bg-black py-2 z-10">
          <div className="relative flex items-center mb-4">
            <div className="absolute left-3 text-gray-500">
              <FaSearch size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users"
              className="w-full py-3 pl-10 pr-4 bg-gray-800 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button 
              type="submit" 
              className="absolute right-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-4 py-1 text-sm transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        
        {/* Results section */}
        <div className="mt-2">
          {/* No results message */}
          {results.length === 0 && query && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <FaSearch size={40} className="mb-3" />
              <p className="text-xl font-bold">No users found</p>
              <p className="text-center text-sm mt-2">
                Try searching for a different username
              </p>
            </div>
          )}
          
          {/* User results */}
          {results.map((user) => (
            <Link
              key={user._id}
              to={`/users/${user._id}`}
              className="flex items-center p-4 hover:bg-gray-900/50 border-b border-gray-800 transition-colors"
            >
              {/* User avatar */}
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                {user.profilePicture ? (
                  <img 
                    src={`http://localhost:5000${user.profilePicture}`} 
                    alt={user.username} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser size={20} className="text-gray-300" />
                )}
              </div>
              
              {/* User info */}
              <div className="flex-1">
                <div className="font-bold hover:underline">{user.username}</div>
                <div className="text-gray-500">@{user.username.toLowerCase().replace(/\s+/g, '')}</div>
                {user.bio && (
                  <div className="text-gray-300 text-sm mt-1">{user.bio}</div>
                )}
              </div>
            </Link>
          ))}
          
          {/* Initial state prompt */}
          {results.length === 0 && !query && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <FaSearch size={40} className="mb-3" />
              <p className="text-xl font-bold">Search for users</p>
              <p className="text-center text-sm mt-2">
                Try searching for usernames or people you'd like to follow
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;