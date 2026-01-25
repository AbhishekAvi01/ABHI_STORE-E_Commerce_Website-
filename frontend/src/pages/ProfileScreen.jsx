// frontend/src/pages/ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfileScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // Backend API call
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Orders load nahi huye:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Order History</h2>
        <p className="text-gray-600">View and manage all your orders in one place</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8-4m0 0l8 4m-8 4v10l-8-4m0 0v10l8 4m0-10l8-4" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping now!</p>
          <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header - Summary */}
              <div 
                onClick={() => toggleOrderDetails(order._id)}
                className="p-5 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        order.isDelivered 
                          ? 'bg-green-100 text-green-700' 
                          : order.isPaid 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.isDelivered ? 'DELIVERED' : order.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  {/* Price & Items Count */}
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-600">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                      <svg className={`w-5 h-5 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details - Expandable */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-200 bg-gray-50 p-5 md:p-6 space-y-6">
                  {/* Items Ordered */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Items Ordered ({order.orderItems?.length})</h4>
                    <div className="space-y-3">
                      {order.orderItems?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-contain bg-gray-50 rounded p-2"
                          />
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/product/${item.product}`}
                              className="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate block"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-gray-600 mt-1">Qty: {item.qty}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-600">₹{item.price}</p>
                            <p className="text-sm font-bold text-gray-900">₹{(item.qty * item.price).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Shipping Address</h4>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <p className="text-sm text-gray-900 mb-2">
                        <strong>{order.user?.name}</strong>
                      </p>
                      <p className="text-sm text-gray-600 mb-1">{order.shippingAddress?.address}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">{order.shippingAddress?.country}</p>
                    </div>
                  </div>

                  {/* Payment & Delivery Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Payment Method</h4>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-900 font-semibold capitalize">{order.paymentMethod}</p>
                        <p className={`text-xs font-bold mt-2 px-2.5 py-1 rounded-full inline-block ${
                          order.isPaid 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {order.isPaid ? 'PAID' : 'NOT PAID'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Delivery Status</h4>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                          order.isDelivered 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.isDelivered 
                            ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-IN')}` 
                            : 'In Transit'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Price Summary</h4>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items Subtotal</span>
                        <span className="font-semibold text-gray-900">₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold text-gray-900">₹{order.shippingPrice?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold text-gray-900">₹{order.taxPrice?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base font-bold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-blue-600">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <Link 
                      to={`/order/${order._id}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      View Full Invoice
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;