import React from 'react';

// Simple icon placeholders (replace with actual SVGs or images)
const iconMap = {
  github: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg",
  google: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg",
};

const SocialButton = ({ provider }) => (
  // Dark theme styling: light border, white text, subtle hover glow
  <button className="flex items-center justify-center w-full py-2 border border-gray-700 rounded-xl text-white font-medium bg-gray-800 hover:bg-gray-700 hover:border-cyan-400 transition duration-200 shadow-md">
    <img 
      src={iconMap[provider]} 
      alt={provider} 
      className="w-5 h-5 mr-3 filter invert" // Invert filter makes icons white for dark mode
    />
    {provider === 'google' ? 'Google' : 'GitHub'}
  </button>
);

export default SocialButton;