import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 pb-8 pt-16">
        {/* Footer Top */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo dan Deskripsi */}
          <div>
            <div className="text-3xl font-bold mb-4">
              Vector<span className="text-blue-500">Hosting</span>
            </div>
            <p className="text-gray-400 mb-6">
              Solusi hosting profesional dengan performa tinggi dan keamanan terdepan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-xl font-bold mb-6">Layanan</h4>
            <ul className="space-y-4">
              {[
                'Shared Hosting',
                'VPS Hosting',
                'Domain',
                'Email Hosting',
                'Cloud Hosting'
              ].map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-500 transition"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tentang Kami */}
          <div>
            <h4 className="text-xl font-bold mb-6">Tentang Kami</h4>
            <ul className="space-y-4">
              {[
                'Tentang Vector Hosting',
                'Karir',
                'Tim Kami',
                'Artikel',
                'Kontak'
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-500 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-xl font-bold mb-6">Kontak</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-blue-500" />
                <span className="text-gray-400">support@vectorhosting.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-blue-500" />
                <span className="text-gray-400">+62 812-3456-7890</span>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-sm">
                  Senin - Jumat: 09:00 - 18:00 WIB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Vector Hosting. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;