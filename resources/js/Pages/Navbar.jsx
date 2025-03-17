import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Navbar = () => {
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      const userSession = sessionStorage.getItem('user');

      if (userSession) {
        try {
          const userFromSession = JSON.parse(userSession);
          const response = await axios.get('http://VectorHosting.test/api/user/'+userFromSession.id, {
            headers: {'X-Requested': import.meta.env.VITE_API_KEY}
          });

          if (response.data.token == userFromSession.loginToken) {
            setUsers(response.data);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }

      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUsers(null);
    setShowDropdown(false);
    navigate('/login');
  };

  // Default profile image if user has no avatar
  const defaultAvatar = "";

  // Determine if user should go to client area or login
  const clientAreaLink = users ? "/client" : "/login";

  return(
    <>
      <nav className="fixed w-full z-50 backdrop-blur-md text-white">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/">
            <div className="text-2xl font-bold tracking-tight">
              Vector<span className="text-blue-500">Hosting</span>
            </div>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-500 transition">Home</Link>
            <Link to="/product" className="hover:text-blue-500 transition">Product</Link>
            <a href="#" className="hover:text-blue-500 transition">Kontak</a>

            {isLoading ? (
              // Show loading state while determining user
              <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
            ) : !users ? (
              <a href={clientAreaLink} className="bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Client Panel
              </a>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={users.avatar ? `${import.meta.env.VITE_URL}/storage/${users.avatar}` : defaultAvatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                  />
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium">{users.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{users.email || ''}</p>
                    </div>
                    <Link to="/client" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Client Panel
                    </Link>
                    {users.is_admin ? (
                      <a href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Admin Area
                      </a>
                    ): ''}
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;