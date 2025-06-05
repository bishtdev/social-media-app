import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";
// Import icons from react-icons
import { FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMdLogIn } from "react-icons/io";
import { HiUserAdd } from "react-icons/hi";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Add state to control dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white hover:bg-gray-900 rounded-full p-2">
          <FaXTwitter className="w-6 h-6" />
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
            <Link
                to="/search"
                className="text-white hover:bg-gray-800 rounded-full p-2"
              >
                <FaSearch className="w-5 h-5" />
              </Link>

              <Link
                to="/create"
                className="text-white hover:bg-gray-800 rounded-full p-2"
              >
                <FaPlus className="w-5 h-5" />
              </Link>

              <Link
                to="/dashboard"
                className="text-white hover:bg-gray-800 rounded-full p-2"
              >
                <FaUser className="w-5 h-5" />
              </Link>

              {/* User dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 hover:bg-gray-800 rounded-full p-1"
                  onClick={toggleDropdown}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <img
                    src={`http://localhost:5000${user.profilePicture}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover mr-0"
                  />
                  </div>
                </button>

                {/* Dropdown menu with controlled visibility */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-lg shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-white font-medium">{user.username}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-900"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-gray-800 px-4 py-1.5 rounded-full font-medium flex items-center"
              >
                <IoMdLogIn className="mr-1" /> Log in
              </Link>
              <Link
                to="/register"
                className="bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded-full font-medium flex items-center"
              >
                <HiUserAdd className="mr-1" /> Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;