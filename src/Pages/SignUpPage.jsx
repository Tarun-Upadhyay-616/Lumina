import React, { useState } from 'react';
import SocialButton from '../Components/SocialButton';
import { useNavigate ,Link } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import { SIGNUPROUTE } from '../RoutesConstants';
const SignUpPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [type , setType] = useState('password')
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const isValid = () => {
    if(!username){
      toast.error('Please enter a username')
    }
    if (!email) {
      toast.error('Email is Required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address.');
        return false;
    }
    if (!password) {
      toast.error('Password is Required');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };
const showPassword = ()=>{
  if(type == 'text'){
    setType('password')
  }
  else{
    setType('text')
  }
  setShowPass(!showPass)
  
}
  const handleRegister = async () => {
    if (!isValid()) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post(SIGNUPROUTE, { username , email, password}, { withCredentials: true });
      if (response.data.user) {
        console.log(response)
      }
    } catch (err) {
      console.error('Error during signup:', err);
      if (err.response) {
        toast.error(err.response.data?.message || 'Signup failed. Please try again.');
      } else if (err.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('Something went wrong during signup.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
    <ToastContainer theme='dark' position='top-right' />
      <div className="h-screen flex items-center justify-center bg-gray-900 p-4">

        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-900/50 p-10 space-y-7 border border-gray-700">


          <div className="text-center">
            <h2 className='text-3xl font-extrabold text-cyan-400 mb-1'>Lumina-Studio</h2>
            <p className="mt-3 text-md text-gray-400">
              Welcome! Please fill in the details to get started.
            </p>
          </div>


          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300">Username</label>
              <input
                type="text"
                placeholder="Enter your Username"
                onChange={(e)=>setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 border border-gray-600 rounded-xl shadow-inner text-white bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Email address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                onChange={(e)=>setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 border border-gray-600 rounded-xl shadow-inner text-white bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={type}
                  id="password"
                  placeholder="Enter your password"
                  onChange={(e)=>setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 border border-gray-600 rounded-xl shadow-inner text-white bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-base pr-10"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500" onClick={showPassword}>
                {showPass ? <IoMdEyeOff /> : <IoMdEye /> }
                </span>
              </div>
            </div>

            <button
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-md font-bold text-gray-900 bg-cyan-400 hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-600 focus:ring-offset-gray-800 transition duration-200"
              onClick={handleRegister}
            >
              {isLoading ? <LoadingIcons.ThreeDots/> : "Continue"}
            </button>
          </div>

          <div className="flex items-center">
            <div className="grow border-t border-gray-700"></div>
            <span className="shrink mx-4 text-gray-500 text-sm font-medium">or</span>
            <div className="grow border-t border-gray-700"></div>
          </div>

          <div className="flex space-x-4">
            <SocialButton provider="github" />
            <SocialButton provider="google" />
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-400">
              Already have an account? {' '}

              <Link to="/auth/signin" className="font-bold text-cyan-400 hover:text-cyan-300 transition duration-150">
              Sign in
            </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignUpPage;