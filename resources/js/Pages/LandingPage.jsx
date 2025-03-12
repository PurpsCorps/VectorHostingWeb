import React, { useState } from 'react';
import {
  Server,
  Shield,
  Cloud,
  Rocket,
  Check,
  ChevronRight
} from 'lucide-react';
import Footer from '@/Components/Footer';
import ProductCompponent from '@/Components/ProductCompponent';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('shared');

  return (
<div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      <div className="relative">
        {/* Background Gradient dan Blur */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rotate-45"></div>
        </div>

        {/* Konten Hero */}
        <div className="container mx-auto px-6 pt-32 pb-48 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Hosting Cepat, Aman & Berkualitas
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            "Accelerate with Precision"
            <br/>
            Kami mengintegrasikan nilai kecepatan, kualitas, dan harga terjangkau untuk mendukung pertumbuhan digital pelanggan secara optimal, menjadikannya pilihan tepat bagi mereka yang mengutamakan efisiensi dan keandalan.
            </p>
            <div className="flex justify-center space-x-6">
              <button className="bg-blue-600 px-10 py-4 rounded-full text-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-500/30">
                Dapatkan Hosting Sekarang
              </button>
              <button className="border-2 border-gray-700 px-10 py-4 rounded-full text-lg hover:bg-gray-800 transition transform hover:scale-105">
                Lihat Fitur Lengkap
              </button>
            </div>

            {/* Statistik Singkat */}
            <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-500 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime Terjamin</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-500 mb-2">+10.000</div>
                <div className="text-gray-400">Pelanggan Aktif</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
                <div className="text-gray-400">Dukungan Teknis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Transisi Kurva */}
        <div className="absolute bottom-0 left-0 right-0 text-gray-950">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-24">
            <path
              d="M0,0 L0,100 L1440,100 L1440,0 C1080,50 720,75 360,75 C0,75 0,0 0,0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      {/* Hosting Plans */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pilih Paket Hosting</h2>
          <div className="flex justify-center space-x-4 mb-8">
            {['shared', 'vps'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`
                  px-6 py-2 rounded-full transition
                  ${activeTab === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
                `}
              >
                {type === 'shared' ? 'Shared Hosting' : 'VPS Hosting'}
              </button>
            ))}
          </div>
        </div>

        <ProductCompponent category={activeTab} />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Mengapa Memilih Kami</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: Server,
              title: 'Infrastruktur Handal',
              desc: 'Server terkini dengan performa tinggi'
            },
            {
              icon: Shield,
              title: 'Keamanan Canggih',
              desc: 'Perlindungan multi-layer'
            },
            {
              icon: Cloud,
              title: 'Teknologi Cloud',
              desc: 'Skalabilitas tanpa batas'
            },
            {
              icon: Rocket,
              title: 'Kecepatan Optimal',
              desc: 'Optimasi kinerja tercanggih'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center hover:border-blue-600 transition"
            >
              <feature.icon className="mx-auto mb-4 text-blue-500" size={48} />
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>



      <Footer />
    </div>
  );
};

export default LandingPage;