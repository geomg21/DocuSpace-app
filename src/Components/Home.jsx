import React from 'react';
import Create from './Create';
import View from './View';

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-pink-600 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-wide leading-tight font-serif hover:text-indigo-500 transition-colors duration-300 ease-in-out">
            Welcome to Your Notepad
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Manage your notes with ease. Create, view, and organize your thoughts in one professional place.
          </p>
        </div>

        {/* Main Content Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create a Note */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
              Create a Note
            </h2>
            <Create />
          </div>

          {/* View Notes */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
              View Notes
            </h2>
            <View />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


