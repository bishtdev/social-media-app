import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPic from "../assets/login-page.avif"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData))
      .unwrap()
      .then(() => {
        navigate("/dashboard"); 
      })
      .catch((err) => {
        
        console.error("Login failed:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 pt-2 pb-1 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-2">
          <h2 className="mt-6 text-3xl font-extrabold text-blue-800">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-blue-600">
            Sign in to your account
          </p>
        </div>
        
        <div className="mt-1 bg-white py-4 px-6 shadow rounded-lg sm:px-10">
          <div className="mb-0 flex justify-center">
            <img 
              src={LoginPic} 
              alt="Login illustration" 
              className="w-64 h-48 object-cover rounded-lg"
            />
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-blue-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-blue-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-blue-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-blue-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-700">
                Remember me
              </label>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging you in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-blue-500">Don't have an account?</span>
              </div>
            </div>
            <div className="mt-2 text-center">
            <Link to='/register' className="font-medium text-pink-600 hover:text-pink-500">
               Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
