import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { clearCartItems } from '../slices/cartSlice';
import axios from 'axios';
import getApiUrl from '../utils/getApiUrl';
import toast, { Toaster } from 'react-hot-toast';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate('/shipping');
    else if (!cart.paymentMethod) navigate('/payment');
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      setIsLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data: result } = await axios.post(getApiUrl() + '/orders', {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }, config);

      dispatch(clearCartItems());
      setOrderId(result._id);
      setShowSuccess(true);
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate(`/order/${result._id}`);
      }, 2000);
      
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-10 min-h-screen">
      <Toaster />
      
      {/* Success Modal Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-11/12 text-center shadow-2xl animate-in">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Your Order is Successful! ✓
            </h2>
            <p className="text-gray-600 mb-4 text-base">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            
            {/* Order ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
              <p className="text-lg font-bold text-gray-900 break-all">{orderId}</p>
            </div>

            {/* Details */}
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to order details in a moment...
            </p>

            {/* Button */}
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              View Order Details
            </button>
          </div>
        </div>
      )}

      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border shadow-sm">
          <h2 className="text-xl font-black uppercase italic mb-6">Review Bag</h2>
          {cart.cartItems.map((item, index) => (
            <div key={index} className="flex justify-between py-4 border-b last:border-0">
              <span className="font-bold text-[10px] uppercase">{item.name} x {item.qty}</span>
              <span className="font-black text-blue-600 italic">₹{(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#111827] text-white p-10 rounded-[3rem] shadow-2xl h-fit">
          <h2 className="text-2xl font-black mb-8 border-b border-gray-800 pb-4 italic tracking-tighter uppercase">Summary</h2>
          <div className="flex justify-between text-2xl font-black text-blue-500 mb-8 italic">
            <span>Total Bill:</span> <span>₹{cart.totalPrice}</span>
          </div>
          <button 
            onClick={placeOrderHandler} 
            disabled={isLoading || cart.cartItems.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Place Order Now →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;