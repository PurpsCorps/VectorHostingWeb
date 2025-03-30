import React from 'react';
import { Zap, Shield, Clock, DollarSign, MessageSquare, ArrowRight } from 'lucide-react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center relative overflow-hidden pt-20">
      {/* Enhanced Background Gradient - Same as LoginPage */}
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

      <div className="container mx-auto px-6 relative z-10 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-500 mb-4">
              About VectorHosting
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mb-6"></div>
          </div>

          {/* About Us Content */}
          <div className="space-y-10">
            {/* Who We Are Section */}
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400 mb-4">
                Who We Are
              </h2>
              <p className="text-gray-300 leading-relaxed">
                VectorHosting is a high-performance web hosting provider committed to delivering the fastest, most reliable, and cost-effective
                hosting solutions. We empower businesses, developers, and individuals with cutting-edge technology, ensuring optimal website
                performance and security.
              </p>
            </div>

            {/* Mission & Vision Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  To provide ultra-fast, secure, and affordable hosting solutions that help businesses scale effortlessly in the digital world.
                </p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400 mb-4">
                  Our Vision
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  To be the leading hosting provider known for innovation, speed, and unmatched reliability.
                </p>
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400 mb-6">
                Why Choose VectorHosting?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-blue-600/20 p-3 rounded-lg mr-4">
                    <Zap className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Blazing Fast Performance</h3>
                    <p className="text-gray-300">Optimized servers with the latest technologies to ensure your site loads at lightning speed.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600/20 p-3 rounded-lg mr-4">
                    <Clock className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">99.99% Uptime Guarantee</h3>
                    <p className="text-gray-300">Stay online 24/7 with our robust infrastructure.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600/20 p-3 rounded-lg mr-4">
                    <DollarSign className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Affordable Pricing</h3>
                    <p className="text-gray-300">Premium hosting services at the most competitive prices.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600/20 p-3 rounded-lg mr-4">
                    <Shield className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Top-Notch Security</h3>
                    <p className="text-gray-300">Advanced security measures to protect your data and website.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600/20 p-3 rounded-lg mr-4">
                    <MessageSquare className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">24/7 Expert Support</h3>
                    <p className="text-gray-300">Our dedicated team is always ready to assist you.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-8 text-center shadow-xl shadow-blue-700/30">
              <h2 className="text-3xl font-bold text-white mb-4">Join Us Today!</h2>
              <p className="text-white text-lg mb-6">Experience the future of hosting with VectorHosting. Accelerate your digital success!</p>
              <button className="bg-white text-blue-600 py-3 px-6 rounded-lg font-medium flex items-center mx-auto hover:bg-gray-100 transition transform hover:scale-105">
                Get Started
                <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;