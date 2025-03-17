import React from 'react';
import { Home, AlertTriangle, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center relative overflow-hidden pt-20">
      {/* Enhanced Background Gradient - same as login page */}
      <div className="absolute inset-0">
        {/* Primary gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-indigo-900/20"></div>

        {/* Animated glow spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #132f4c 1px, transparent 1px), linear-gradient(to bottom, #132f4c 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Error Indicator */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-800/60 flex items-center justify-center">
                <AlertTriangle size={64} className="text-yellow-400" />
              </div>
            </div>
            <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-500">
              404
            </h1>
            <h2 className="text-2xl font-bold text-white mt-2">Page Not Found</h2>
            <p className="text-gray-300 mt-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Error Card */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20">
            {/* Action Button */}
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-[1.02] shadow-lg shadow-blue-700/30"
            >
              <Home className="mr-2" size={18} />
              Back to Homepage
            </button>

            {/* Quick Links */}
            <div className="mt-6 border-t border-gray-800/50">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/login"
                  className="text-blue-400 hover:text-blue-300 bg-gray-800/50 rounded-lg p-3 text-center transition hover:bg-gray-800"
                >
                  Login
                </a>
                <a
                  href="/client"
                  className="text-blue-400 hover:text-blue-300 bg-gray-800/50 rounded-lg p-3 text-center transition hover:bg-gray-800"
                >
                  Client Area
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-300">
            <p>
              Need assistance?{' '}
              <a href="/contact" className="text-blue-400 hover:text-blue-300 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;