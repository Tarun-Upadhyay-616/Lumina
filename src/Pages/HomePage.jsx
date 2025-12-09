import React, { Children } from 'react';
import { useNavigate } from 'react-router-dom';



const Navbar = () => (
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
          <a href="/resize" className="text-cyan-400 font-bold hover:text-cyan-300 transition duration-150">Start Editing &rarr;</a>
          <a href="/signin" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-150 border border-gray-600">Sign In</a>
        </div>
        

        <button 
          className="md:hidden p-2 text-gray-300 hover:text-cyan-400"
          aria-label="Toggle Menu"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-900 border-t border-cyan-800/50 pt-10 pb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <div className="mb-4">
        <span className="text-xl font-extrabold text-cyan-400 tracking-wider">LUMINA-STUDIO</span>
        <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} Lumina-Studio. All rights reserved.</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
        <a href="#" className="hover:text-cyan-400 transition duration-150">Privacy Policy</a>
        <a href="#" className="hover:text-cyan-400 transition duration-150">Terms of Service</a>
        <a href="#" className="hover:text-cyan-400 transition duration-150">Contact</a>
      </div>
    </div>
  </footer>
);



const FeatureCard = ({ title, description, icon, colorClass }) => (
  <div className={`bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl ${colorClass}/40 hover:shadow-2xl transition duration-300 ease-in-out`}>
    <div className={`text-4xl mb-4 ${colorClass} drop-shadow-[0_0_8px_rgba(45,212,255,0.7)]`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, name, title }) => (
  <div className="bg-gray-800 p-6 rounded-xl border-t-4 border-cyan-500 shadow-xl shadow-cyan-900/30">
    <p className="text-lg italic text-gray-300 mb-4">"{quote}"</p>
    <div className="text-sm font-semibold text-white">
      {name}
      <span className="block text-xs text-gray-500">{title}</span>
    </div>
  </div>
);


const HomePage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <section className="py-20 sm:py-24 text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
   
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 drop-shadow-[0_0_15px_rgba(45,212,255,0.3)]">
            Elevate Your <span className="text-cyan-400">Photos</span> Instantly
          </h1>
          <p className="text-base sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Lumina-Studio provides professional, AI-powered editing tools in a simple, elegant interface.
          </p>
          <a
            href="/resize"
            className="px-8 py-3 bg-cyan-500 text-gray-900 font-bold rounded-xl text-lg shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Launch Editor Now
          </a>
        </div>
      </section>


      <section id="features" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-white">
            Core Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard 
              title="Smart Resizing"
              description="Instantly change dimensions and optimize file size without losing quality."
              icon="⚡"
              colorClass="shadow-cyan-500"
            />
            <FeatureCard
              title="Background Removal"
              description="Use our AI tool to seamlessly clip subjects and replace or remove backgrounds."
              icon="✂️"
              colorClass="shadow-fuchsia-500"
            />
            <FeatureCard
              title="One-Click Filters"
              description="Apply professional-grade filters and effects with a single touch, built for speed."
              icon="✨"
              colorClass="shadow-lime-500"
            />
            <FeatureCard
              title="Batch Processing"
              description="Edit and export hundreds of images simultaneously, saving you precious time."
              icon="⏱️"
              colorClass="shadow-red-500"
            />
            <FeatureCard
              title="Layered Editing"
              description="Full support for layers, allowing complex compositions and non-destructive adjustments."
              icon="🧱"
              colorClass="shadow-blue-500"
            />
            <FeatureCard
              title="Advanced Color Grading"
              description="Precise control over HSL, curves, and split toning for cinematic results."
              icon="🌈"
              colorClass="shadow-yellow-500"
            />
          </div>
        </div>
      </section>


      <section id="testimonials" className="py-16 sm:py-20 bg-gray-800 border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-white">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
    </div>
  );
};

export default HomePage;
