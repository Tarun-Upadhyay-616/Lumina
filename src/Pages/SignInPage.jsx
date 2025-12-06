import React, { useState, useEffect } from 'react';
import { Mail, Lock, Sun, Moon } from 'lucide-react';

// Reusable component for OAuth buttons
const OAuthButton = ({ provider, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-colors 
               hover:bg-gray-100 dark:hover:bg-gray-700 
               text-gray-800 dark:text-gray-200"
  >
    {icon}
    <span className="ml-2">Sign in with {provider}</span>
  </button>
);

const SignInPage = () => {
  // Use a state to track dark mode locally
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    // Apply or remove the 'dark' class on the HTML element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign In Data:', formData);
    // TODO: Implement your MERN stack API call here
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full 
                   bg-white dark:bg-gray-800 
                   text-gray-800 dark:text-gray-300 
                   shadow-md hover:ring-2 hover:ring-indigo-500 transition-colors"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main Form Container - Responsive width */}
      <div className="w-full max-w-sm md:max-w-md p-8 space-y-8 
                      bg-white dark:bg-gray-800 
                      rounded-xl shadow-2xl transition-colors duration-300">
        
        {/* Logo and Title */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            Lumina-studio
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 
                         text-gray-900 dark:text-white 
                         bg-gray-50 dark:bg-gray-700 
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 
                         text-gray-900 dark:text-white 
                         bg-gray-50 dark:bg-gray-700 
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            />
          </div>
          
          {/* Sign In Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
                         bg-indigo-600 hover:bg-indigo-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="flex items-center justify-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
          <span className="px-3 text-xs text-gray-500 dark:text-gray-400 uppercase">OR</span>
          <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <OAuthButton provider="Google" onClick={() => console.log('OAuth Google')} />
          <OAuthButton provider="GitHub" onClick={() => console.log('OAuth GitHub')} />
        </div>

        <div className="text-sm text-center">
          <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;