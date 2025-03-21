import React, { useState } from 'react';
import Footer from '@/Components/Footer';
import ProductShow from '@/Components/ProductShow';

const CartPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      {/* <Navbar /> */}

      <section className="relative pt-40 pb-40 px-6 text-center bg-gradient-to-b from-blue-900/50 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-gray-900/80 to-gray-950"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-blue-400">Cart</h2>
        </div>

        {/* Decorative wave effect at the bottom of the hero */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-gray-950">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.32,118.92,119.09,102.34,181,79.36,232,61.12,273.88,47.79,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-900/20">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-white">a</h3>
            <p className="text-gray-400 mb-4 h-12 overflow-hidden">a</p>
            <div className="mt-4 mb-4">
            <span className="text-2xl font-bold text-blue-400">Rp1</span>
            </div>
            <div className="flex space-x-2">

            <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition duration-300">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;