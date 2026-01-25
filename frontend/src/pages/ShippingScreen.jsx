import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    
    const shippingDetails = { address, city, postalCode, country };
    dispatch(saveShippingAddress(shippingDetails));
    
    navigate('/payment');
  };

  return (
    <div className="container mx-auto p-6">
      <CheckoutSteps step1 step2 />
      <div className="flex justify-center">
        <form onSubmit={submitHandler} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-100">
          <h2 className="text-3xl font-black mb-8 text-gray-900 uppercase text-center">Shipping Details</h2>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600" 
              required 
            />
            <input 
              type="text" 
              placeholder="City" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600" 
              required 
            />
            <input 
              type="text" 
              placeholder="Postal Code" 
              value={postalCode} 
              onChange={(e) => setPostalCode(e.target.value)} 
              className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600" 
              required 
            />
            <input 
              type="text" 
              placeholder="Country" 
              value={country} 
              onChange={(e) => setCountry(e.target.value)} 
              className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white mt-10 py-5 rounded-2xl font-black hover:bg-blue-600 transition-all uppercase tracking-widest cursor-pointer shadow-xl"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;