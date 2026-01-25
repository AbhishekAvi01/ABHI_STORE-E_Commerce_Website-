import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  return (
    <div className="container mx-auto p-10 min-h-screen bg-[#fcfcfc]">
      <h1 className="text-4xl font-black mb-12 uppercase italic tracking-tighter">
        SHOPPING <span className="text-blue-600">BAG</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold uppercase tracking-widest mb-6">Your bag is empty</p>
          <Link to="/" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-xl transition-all duration-500">
                <div className="flex items-center space-x-8">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mix-blend-multiply" />
                  <div>
                    <h2 className="text-[11px] font-black uppercase tracking-tight text-gray-900">{item.name}</h2>
                    <p className="text-blue-600 font-black text-lg italic">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  <button 
                    onClick={() => addToCartHandler(item, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm font-black text-lg hover:bg-gray-200 transition-all active:scale-90 disabled:opacity-30"
                  >-</button>
                  <span className="text-lg font-black w-8 text-center">{item.qty}</span>
                  <button 
                    onClick={() => addToCartHandler(item, item.qty + 1)}
                    disabled={item.qty >= item.countInStock}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm font-black text-lg hover:bg-gray-200 transition-all active:scale-90"
                  >+</button>
                </div>

                <button 
                  onClick={() => removeFromCartHandler(item._id)}
                  className="text-red-100 group-hover:text-red-500 transition-colors p-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 text-white p-10 rounded-[3rem] h-fit sticky top-24 shadow-2xl">
            <h2 className="text-2xl font-black mb-8 border-b border-gray-800 pb-4 italic tracking-tighter uppercase">Order Summary</h2>
            <div className="space-y-4 mb-10 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
               <div className="flex justify-between"><span>Items ({cartItems.reduce((a, c) => a + c.qty, 0)}):</span> <span className="text-white">₹{cart.itemsPrice}</span></div>
               <div className="flex justify-between border-t border-gray-800 pt-8 text-2xl font-black text-blue-500 italic">
                  <span>Total:</span> <span>₹{cart.totalPrice}</span>
               </div>
            </div>
            <button 
              onClick={checkoutHandler}
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl active:scale-95"
            >
              Checkout Now →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;