import React, { useState } from 'react';
import Footer from '@/Components/Footer';
import ProductShow from '@/Components/ProductShow';

const ProductListPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      {/* <Navbar /> */}

      <section className="relative pt-40 pb-40 px-6 text-center bg-gradient-to-b from-blue-900/50 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-gray-900/80 to-gray-950"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-blue-400">Daftar Produk Unggulan</h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Temukan berbagai produk berkualitas dengan harga terbaik untuk memenuhi kebutuhan Anda
          </p>
        </div>

        {/* Decorative wave effect at the bottom of the hero */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-gray-950">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.32,118.92,119.09,102.34,181,79.36,232,61.12,273.88,47.79,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Product Categories - positioned to overlap with the wave */}
      <div className="max-w-6xl mx-auto px-4 mb-8 relative z-10">
        <div className="flex justify-center space-x-4 overflow-x-auto py-4">
          <button
            className={`px-6 py-2 rounded-full whitespace-nowrap ${
              activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => setActiveCategory('all')}
          >
            Semua Produk
          </button>
          <button
            className={`px-6 py-2 rounded-full whitespace-nowrap ${
              activeCategory === 'hosting' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => setActiveCategory('hosting')}
          >
            Hosting
          </button>
          <button
            className={`px-6 py-2 rounded-full whitespace-nowrap ${
              activeCategory === 'vps' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => setActiveCategory('vps')}
          >
            VPS
          </button>
          <button
            className={`px-6 py-2 rounded-full whitespace-nowrap ${
              activeCategory === 'rdp' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => setActiveCategory('rdp')}
          >
            RDP
          </button>
        </div>
      </div>

      {/* Gradient background for product section */}
      <div className="bg-gradient-to-b from-gray-950 to-gray-950 pb-16">
        {/* Product List */}
        <ProductShow activeCategory={activeCategory} />
      </div>

      {/* Features */}
      <section className="bg-gradient-to-b from-gray-950 to-gray-950 py-16 border-t border-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Keunggulan Berbelanja dengan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg text-center transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-900/20">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-gray-400">Dikirim dalam 24 jam setelah pembayaran</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-900/20">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Produk Asli</h3>
              <p className="text-gray-400">Jaminan keaslian semua produk</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-900/20">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pembayaran Aman</h3>
              <p className="text-gray-400">Berbagai metode pembayaran aman</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-900/20">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Layanan 24/7</h3>
              <p className="text-gray-400">Dukungan pelanggan 24 jam</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductListPage;