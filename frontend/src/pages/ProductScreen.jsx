import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import axios from 'axios';
import getApiUrl from '../utils/getApiUrl';
import toast, { Toaster } from 'react-hot-toast';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1); // Naya state quantity ke liye
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(getApiUrl() + `/products/${productId}`);
        setProduct(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Quantity badhane ka function
  const incrementQty = () => {
    if (qty < product.countInStock) {
      setQty(qty + 1);
    }
  };

  // Quantity ghatane ka function
  const decrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const addToCartHandler = () => {
    if (product.countInStock > 0) {
      // Ab hum fixed 1 ke bajaye select ki gayi 'qty' bhej rahe hain
      dispatch(addToCart({ ...product, qty }));
      
      toast.success(`${qty} Item(s) successfully added to bag!`, {
        position: 'top-center',
        style: {
          borderRadius: '12px',
          background: '#111',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });
    }
  };

  return (
    <div className="container mx-auto p-10 min-h-screen">
      <Toaster />
      
      <Link to="/" className="text-gray-400 font-bold uppercase text-[10px] mb-10 block hover:text-blue-600 tracking-[0.2em] transition-colors">
        ← Back to Store
      </Link>

      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-10">
          <p className="text-red-600 font-bold">{error}</p>
        </div>
      )}

      {!loading && !error && Object.keys(product).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        {/* Left: Big Image */}
        <div className="bg-gray-50 rounded-[3rem] p-10 md:p-20 flex items-center justify-center shadow-inner aspect-square">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-700" 
          />
        </div>

        {/* Right: Full Info */}
        <div className="flex flex-col justify-center">
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            Premium Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-6">
            {product.name}
          </h1>
          
          <div className="flex items-center space-x-6 mb-10">
            <p className="text-3xl font-black italic text-gray-900">₹{product.price}</p>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              product.countInStock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Selector Section */}
          {product.countInStock > 0 && (
            <div className="flex items-center space-x-4 mb-10 bg-gray-100 w-fit p-2 rounded-2xl border border-gray-200">
              <button 
                onClick={decrementQty}
                className="w-10 h-10 bg-white rounded-xl shadow-sm font-black text-lg hover:bg-gray-200 transition-all active:scale-90"
              >
                -
              </button>
              <span className="text-lg font-black w-8 text-center">{qty}</span>
              <button 
                onClick={incrementQty}
                className="w-10 h-10 bg-white rounded-xl shadow-sm font-black text-lg hover:bg-gray-200 transition-all active:scale-90"
              >
                +
              </button>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">
                Only {product.countInStock} Left
              </span>
            </div>
          )}

          <div className="border-t border-gray-100 pt-10">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Description</h3>
            <p className="text-gray-500 leading-relaxed text-sm font-medium mb-10">
              {product.description || "No detailed description available for this premium item."}
            </p>
          </div>

          <button 
            onClick={addToCartHandler} 
            disabled={product.countInStock === 0} 
            className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl active:scale-95 ${
              product.countInStock > 0 
              ? 'bg-gray-900 text-white hover:bg-blue-600 cursor-pointer' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.countInStock > 0 ? `Add ${qty} to Shopping Bag` : 'Sold Out'}
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default ProductScreen;