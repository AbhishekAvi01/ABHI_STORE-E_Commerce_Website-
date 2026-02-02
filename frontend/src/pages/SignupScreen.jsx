import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import axios from 'axios';
import getApiUrl from '../utils/getApiUrl';
import toast, { Toaster } from 'react-hot-toast';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Check if user is already logged in
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (name.trim().length < 3) {
      toast.error('Name must be at least 3 characters');
      return false;
    }
    if (!email.trim()) {
      toast.error('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!password) {
      toast.error('Password is required');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Backend se signup request
      const { data } = await axios.post(getApiUrl() + '/users', { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (data && data._id) {
        // Redux Store aur LocalStorage dono mein data save hoga
        dispatch(setCredentials(data));
        
        toast.success(`Welcome ${data.name}! Account created successfully!`);
        navigate('/');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-blue-50 to-gray-100 py-10">
      <Toaster />
      <form onSubmit={submitHandler} className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Header */}
        <h2 className="text-4xl font-black mb-2 text-center text-gray-900 tracking-tighter">CREATE ACCOUNT</h2>
        <p className="text-center text-gray-600 mb-8 text-sm">Join us and start shopping today</p>
        
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2 text-sm">Full Name</label>
          <input 
            type="text" 
            placeholder="Enter your full name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2 text-sm">Email Address</label>
          <input 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2 text-sm">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="At least 6 characters" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M15.171 13.576l1.414 1.414A2 2 0 0016.414 10c1.592-2.892.822-6.8-3.828-9.11m2.727 9.08A10 10 0 005.064 5.064M1.586 11.566A10.003 10.003 0 0010 19c4.478 0 8.268-2.943 9.542-7a9.972 9.972 0 00-.9-1.923" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-2 text-sm">Confirm Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Re-enter your password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
        </div>

        {/* Password Requirements */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className={password.length >= 6 ? "text-green-600 font-semibold" : ""}>✓ At least 6 characters</li>
            <li className={password === confirmPassword && password ? "text-green-600 font-semibold" : ""}>✓ Passwords match</li>
          </ul>
        </div>

        {/* Signup Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-black hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : 'Sign Up Now'}
        </button>

        {/* Already have account link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account? {' '}
            <Link 
              to="/login" 
              className="text-blue-600 font-bold hover:underline transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-gray-500 text-xs mt-4">
          By signing up, you agree to our{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span>
        </p>
      </form>
    </div>
  );
};

export default SignupScreen;
