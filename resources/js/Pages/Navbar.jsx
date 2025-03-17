import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';

const Navbar = () => {
  const [users, setUsers] = useState([]);
  let link;

  if (sessionStorage.getItem('user')) {
    useEffect(() => {
      const fetchUsers = async () => {
          try {
              const response = await axios.get('http://VectorHosting.test/api/user/', {headers: {'X-Requested': import.meta.env.VITE_API_KEY}});
              setUsers(response.data);
          } catch (err) {
              console.error('Error fetching user data:', err);
          }
      };

      fetchUsers();
    }, []);

    const user = users.find(user =>
      user.token == JSON.parse(sessionStorage.getItem('user')).loginToken
    );

    if (user) {
      link = "/client";
    } else {
      link = "/login";
    }
  } else {
    link = "/login";
  }

  return(
    <>
      <nav className="fixed w-full z-50 backdrop-blur-md text-white">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold tracking-tight">
            Vector<span className="text-blue-500">Hosting</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-500 transition">Home</Link>
            <Link to="/product" className="hover:text-blue-500 transition">Product</Link>
            <a href="#" className="hover:text-blue-500 transition">Kontak</a>
            <a href={link} className="bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition">
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