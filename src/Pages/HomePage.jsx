import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 border-b border-cyan-800/50 shadow-md shadow-cyan-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="shrink-0">
            <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 tracking-wider drop-shadow-[0_0_5px_rgba(45,212,255,0.5)]">
              LUMINA-STUDIO
            </span>
          </div>

          <div className="hidden md:flex space-x-6 items-center">
            <a href="#features" className="text-gray-300 hover:text-cyan-400 font-medium transition duration-150">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-cyan-400 font-medium transition duration-150">Testimonials</a>

            <SignedOut>
              <a href="/auth/signin" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-150 border border-gray-600">Sign In</a>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/auth/signin" />
            </SignedIn>
          </div>


          <button
            className="md:hidden p-2 text-gray-300 hover:text-cyan-400"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-4 space-y-4">
          <a href="#features" className="block text-gray-300 hover:text-cyan-400" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#testimonials" className="block text-gray-300 hover:text-cyan-400" onClick={() => setIsOpen(false)}>Testimonials</a>
          <SignedOut>
            <a href="/signin" className="block w-full text-center px-4 py-2 bg-gray-700 text-white rounded-lg">Sign In</a>
          </SignedOut>
          <SignedIn>
            <div className="flex justify-center">
              <UserButton afterSignOutUrl="/auth/signin" />
            </div>
          </SignedIn>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 border-t border-cyan-800/50 pt-10 pb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <div className="mb-4">
        <span className="text-xl font-extrabold text-cyan-400 tracking-wider">LUMINA-STUDIO</span>
        <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} Lumina-Studio. All rights reserved.</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-sm">
        <a href="#" className="hover:text-cyan-400 transition duration-150">Privacy Policy</a>
        <a href="#" className="hover:text-cyan-400 transition duration-150">Terms of Service</a>
        <a href="#" className="hover:text-cyan-400 transition duration-150">Contact</a>
      </div>
    </div>
  </footer>
);



const FeatureCard = ({ title, description, icon, onclick, colorClass }) => (
  <button onClick={onclick} className="w-full text-left group">
    <div className={`h-full bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl ${colorClass}/40 hover:shadow-2xl transition duration-300 ease-in-out transform group-hover:-translate-y-1`}>
      <div className={`text-4xl mb-4 ${colorClass} drop-shadow-[0_0_8px_rgba(45,212,255,0.7)]`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </button>
);

const TestimonialCard = ({ quote, name, title }) => (
  <div className="bg-gray-800 p-6 rounded-xl border-t-4 border-cyan-500 shadow-xl shadow-cyan-900/30 flex flex-col h-full">
    <p className="text-lg italic text-gray-300 mb-6 flex-grow">"{quote}"</p>
    <div className="text-sm font-semibold text-white">
      {name}
      <span className="block text-xs text-gray-500 mt-1">{title}</span>
    </div>
  </div>
);


const HomePage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />

      <section className="flex-grow flex items-center py-16 sm:py-24 md:py-32 text-center border-b border-gray-800 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-[0_0_15px_rgba(45,212,255,0.3)]">
            Elevate Your <span className="text-cyan-400">Photos</span> Instantly
          </h1>
          <p className="text-base sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto px-4">
            Lumina-Studio provides professional, AI-powered editing tools in a simple, elegant interface.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/editor')}
              className="px-8 py-4 bg-cyan-500 text-gray-900 font-bold rounded-xl text-lg shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Launch Editor Now
            </button>
          </div>
        </div>
      </section>


      <section id="features" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16 text-white">
            Core Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Smart Resizing"
              description="Instantly change dimensions and optimize file size without losing quality."
              icon="⚡"
              onclick={() => navigate('/edit/resize-image')}
              colorClass="shadow-cyan-500"
            />
            <FeatureCard
              title="AI Background Removal"
              description="Use our AI tool to seamlessly clip subjects and replace or remove backgrounds."
              icon="✂️"
              onclick={() => toast.error('Something Went Wrong!!', {
                iconTheme: {
                  primary: '#000000',
                  secondary: '#fff',
                },
                duration: 1000,
                style: {
                  border: '1px solid #000000',
                  padding: '16px',
                },
              })}
              colorClass="shadow-fuchsia-500"
            />
            <FeatureCard
              title="Editor"
              description="Editor with custom drawing feature, image editing with filters"
              icon="🧱"
              onclick={() => navigate('/editor')}
              colorClass="shadow-blue-500"
            />

          </div>
        </div>
      </section>


      <section id="testimonials" className="py-20 sm:py-24 bg-gray-800 border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16 text-white">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The speed of the smart resizer alone makes this app indispensable for my daily workflow. It truly glows!"
              name="Alex Chen"
              title="E-Commerce Photographer"
            />
            <TestimonialCard
              quote="I love the dark theme and the neon accents. It makes late-night editing sessions feel futuristic and fun."
              name="Sarah Velez"
              title="Digital Artist"
            />
            <TestimonialCard
              quote="Intuitive, powerful, and fast. Lumina-Studio replaced three different tools I used to rely on."
              name="Michael R."
              title="Social Media Manager"
            />
          </div>
        </div>
      </section>

      <Footer />
      <Toaster />

    </div>
  );
};

export default HomePage;