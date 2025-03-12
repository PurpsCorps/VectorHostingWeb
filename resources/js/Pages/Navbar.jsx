import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";

const Navbar = () => {
    return(
      <>
        <nav className="fixed w-full z-50 backdrop-blur-md text-white">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <div className="text-2xl font-bold tracking-tight">
              Vector<span className="text-blue-500">Hosting</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/product" className="hover:text-blue-500 transition">Product</Link>
              <a href="#" className="hover:text-blue-500 transition">Fitur</a>
              <a href="#" className="hover:text-blue-500 transition">Kontak</a>
              <a href="/client" className="bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Client Panel
              </a>
            </div>
          </div>
        </nav>

        <Outlet />
      </>
    );
};

export default Navbar;