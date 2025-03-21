import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Navbar = () => {
  const [users, setUsers] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      const userSession = sessionStorage.getItem('user');

      if (userSession) {
        try {
          const userFromSession = JSON.parse(userSession);
          const response = await axios.get('/api/user/'+userFromSession.id, {
            headers: {'X-Requested': import.meta.env.VITE_API_KEY}
          });

          if (response.data.token == userFromSession.loginToken) {
            setUsers(response.data);
            // Fetch cart items count when user is logged in
            fetchCartCount(userFromSession.id);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }

      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  // Function to fetch cart count for logged in use
  const fetchCartCount = async (userId) => {
    try {
      const response = await axios.get(`/api/cart/${userId}`, {
        headers: {'X-Requested': import.meta.env.VITE_API_KEY}
      });
      setCartCount(response.data.count || 0);
    } catch (err) {
      console.error('Error fetching cart count:', err);
      setCartCount(0);
    }
  };

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
    setCartCount(0);
    navigate('/login');
  };

  // Default profile image if user has no avatar
  const defaultAvatar = "";

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

            {/* Shopping Cart Icon - Only show when logged in */}
            {!isLoading && users ? (
              <Link to="/cart" className="relative hover:text-blue-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            ):''}
            {isLoading ? (
              // Show loading state while determining user
              <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
            ) : users ? (
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
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 text-white">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium">{users.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{users.email || ''}</p>
                    </div>
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium">{"Rp. "+users.saldo || ''}</p>
                    </div>
                    <Link to="/client" className="block px-4 py-2 text-sm hover:bg-gray-800">
                      Client Panel
                    </Link>
                    {users.is_admin ? (
                    <a href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-800">
                      Admin Area
                      </a>
                    ): ''}
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-800">
                      Profile Settings
                    </Link>
                    <Link to="/cart" className="block px-4 py-2 text-sm hover:bg-gray-800">
                      Shopping Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" className="bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;