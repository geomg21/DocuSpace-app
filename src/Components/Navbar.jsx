import React from 'react';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  return (
    <div>
      <div className="nav fixed w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 shadow-xl transition-all duration-300 ease-in-out hover:bg-gradient-to-l hover:from-pink-600 hover:to-indigo-600 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="Logo" 
              height={'50px'} 
              width={'50px'} 
              className="rounded-full border-2 border-white transition-all duration-300 ease-in-out hover:scale-110" 
            />
            <h1 className="ml-3 text-white font-extrabold text-5xl hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-widest font-lobster">
              DocuSpace
            </h1>
          </div>

          <div className="flex space-x-8">
            <a 
              href="#" 
              className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300 ease-in-out"
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300 ease-in-out"
            >
              Features
            </a>
            <a 
              href="#" 
              className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300 ease-in-out"
            >
              About
            </a>
            <a 
              href="#" 
              className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300 ease-in-out"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;



