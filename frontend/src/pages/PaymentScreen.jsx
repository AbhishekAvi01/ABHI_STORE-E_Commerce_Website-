import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks add kiye
import { savePaymentMethod } from '../slices/cartSlice'; // Action import kiya
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux store se shipping address check karna
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // 1. Safety Check: Agar address nahi hai toh wapas shipping par bhejo
  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  // 2. Submit Handler
  const submitHandler = (e) => {
    e.preventDefault();
    
    // Payment method ko Redux aur LocalStorage dono mein save karna
    dispatch(savePaymentMethod(paymentMethod));
    
    // Final Summary page par bhejna
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto p-10 min-h-screen">
      {/* progress bar step 3 tak blue dikhayega */}
      <CheckoutSteps step1 step2 step3 />
      
      <div className="flex justify-center mt-10">
        <form onSubmit={submitHandler} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-xl border border-gray-50">
          <h2 className="text-3xl font-black mb-2 text-gray-900 uppercase italic tracking-tighter text-center">
            Payment <span className="text-blue-600">Method</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-12 text-center">
            Choose your preferred way to pay
          </p>
          
          <div className="space-y-4">
            {/* PayPal Option */}
            <label className={`flex items-center p-6 rounded-[2rem] cursor-pointer border-2 transition-all duration-300 ${
              paymentMethod === 'PayPal' ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-900/5' : 'border-gray-100 bg-gray-50'
            }`}>
              <input 
                type="radio" 
                name="payment" 
                value="PayPal" 
                checked={paymentMethod === 'PayPal'} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                className="w-5 h-5 accent-blue-600" 
              />
              <div className="ml-6">
                <span className="block font-black uppercase text-[11px] tracking-widest text-gray-900">PayPal / Credit Card</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Fast and secure global payments</span>
              </div>
            </label>

            {/* COD Option */}
            <label className={`flex items-center p-6 rounded-[2rem] cursor-pointer border-2 transition-all duration-300 ${
              paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-900/5' : 'border-gray-100 bg-gray-50'
            }`}>
              <input 
                type="radio" 
                name="payment" 
                value="COD" 
                checked={paymentMethod === 'COD'} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                className="w-5 h-5 accent-blue-600" 
              />
              <div className="ml-6">
                <span className="block font-black uppercase text-[11px] tracking-widest text-gray-900">Cash On Delivery</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Pay when you receive the product</span>
              </div>
            </label>
          </div>

          <button type="submit" className="w-full bg-gray-900 text-white mt-12 py-6 rounded-2xl font-black hover:bg-blue-600 transition-all uppercase tracking-[0.2em] text-[11px] cursor-pointer shadow-xl shadow-blue-900/10 active:scale-[0.98]">
            Continue to Place Order →
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;