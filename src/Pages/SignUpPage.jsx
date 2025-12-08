import React from 'react';
import SocialButton from '../Components/SocialButton';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const SignUpPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsloading] = useState(false)
  const navigate = useNavigate();
  const isValid = () => {
    if (!email) {
      toast.error("Email is required");
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
    return true;
  };
  return (
    <>
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
                className="mt-1 block w-full px-4 py-2.5 border border-gray-600 rounded-xl shadow-inner text-white bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Email address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="mt-1 block w-full px-4 py-2.5 border border-gray-600 rounded-xl shadow-inner text-white bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-4 py-2.5 border border-gray-600 rounded-xl shadow-inner text-white bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-base pr-10"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.725 5.556 5.862 3 10 3s8.275 2.556 9.542 7c-1.267 4.444-5.404 7-9.542 7S1.725 14.444.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                </span>
              </div>
            </div>

            <button
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-md font-bold text-gray-900 bg-cyan-400 hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-600 focus:ring-offset-gray-800 transition duration-200"
            >
              Continue &rsaquo;
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

              <a
                href="/auth/signin"
                className="font-bold text-cyan-400 hover:text-cyan-300 transition duration-150"
              >
                Sign in
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignUpPage;