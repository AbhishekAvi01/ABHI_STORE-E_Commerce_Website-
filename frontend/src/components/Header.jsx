import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const [adminDropdown, setAdminDropdown] = useState(false);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  
  useEffect(() => {
    const closeDropdown = () => setAdminDropdown(false);
    if (adminDropdown) {
      window.addEventListener('click', closeDropdown);
    }
    return () => window.removeEventListener('click', closeDropdown);
  }, [adminDropdown]);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter uppercase text-gray-900">
          ABHI-STORE<span className="text-blue-600">.</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-gray-900 transition">Home</Link>
          
          <Link to="/cart" className="relative hover:text-gray-900 transition flex items-center">
            Cart 
            {cartItems.length > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="flex items-center space-x-6">
              
              {/* ADMIN DROPDOWN */}
              {userInfo.isAdmin && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setAdminDropdown(!adminDropdown)}
                    className="text-blue-600 font-black flex items-center hover:text-gray-900 transition uppercase"
                  >
                    Admin <span className="ml-1 text-[10px]">{adminDropdown ? '▲' : '▼'}</span>
                  </button>
                  
                  {adminDropdown && (
                    <div className="absolute top-full mt-4 right-0 bg-white shadow-2xl rounded-2xl border border-gray-100 py-4 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="px-6 mb-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">Management</p>
                      
                      <Link 
                        to="/admin/orderlist" 
                        onClick={() => setAdminDropdown(false)}
                        className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition font-bold"
                      >
                        All Orders
                      </Link>
                      
                      {/* Is link se ab ProductListScreen khulegi */}
                      <Link 
                        to="/admin/productlist" 
                        onClick={() => setAdminDropdown(false)}
                        className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition font-bold"
                      >
                        Products
                      </Link>
                      
                      <Link 
                        to="/admin/userlist" 
                        onClick={() => setAdminDropdown(false)}
                        className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition font-bold"
                      >
                        Users
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <Link 
                to="/profile" 
                className="italic text-gray-900 hover:text-blue-600 transition font-bold"
              >
                Hi, {userInfo.name.split(' ')[0]}
              </Link>
              
              <button 
                onClick={logoutHandler}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition font-black text-[10px] uppercase tracking-widest"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition font-black text-[10px] uppercase tracking-widest">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-gray-900 transition font-black text-[10px] uppercase tracking-widest">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;