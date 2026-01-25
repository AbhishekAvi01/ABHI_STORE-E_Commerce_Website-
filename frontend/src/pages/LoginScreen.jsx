import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import api from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // Check if user is already logged in
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    }
  }, [userInfo, navigate, searchParams]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend se login request
      const { data } = await api.post('/users/login', { email, password });
      
      // Redux Store aur LocalStorage dono mein data save hoga
      dispatch(setCredentials({ ...data }));
      
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <Toaster />
      <form onSubmit={submitHandler} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-4xl font-black mb-8 text-center text-gray-900 tracking-tighter">SIGN IN</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="example@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-2">Password</label>
          <input 
            type="password" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-black hover:bg-gray-900 transition-all shadow-lg shadow-blue-100 uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login Now'}
        </button>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account? {' '}
            <Link 
              to="/signup" 
              className="text-blue-600 font-bold hover:underline transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;