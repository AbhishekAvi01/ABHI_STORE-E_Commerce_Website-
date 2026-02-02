import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getApiUrl from '../utils/getApiUrl';
import toast, { Toaster } from 'react-hot-toast';

const OrderScreen = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check authentication and fetch order
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(userInfo);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(getApiUrl() + `/orders/${orderId}`, config);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Order Not Found');
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [navigate, orderId]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const deliverHandler = async () => {
    try {
      setIsUpdating(true);
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(getApiUrl() + `/orders/${orderId}/deliver`, {}, config);
      toast.success('Order status updated to Delivered!', {
        position: 'top-center',
        style: { borderRadius: '12px', background: '#111', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
      });
      // Refresh order
      const { data } = await axios.get(getApiUrl() + `/orders/${orderId}`, config);
      setOrder(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="p-10 font-bold text-center">Loading Invoice...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">Error: {error?.data?.message || 'Order Not Found'}</div>;
  if (!order) return <div className="p-10 text-red-500 text-center">Order Not Found</div>;

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h1 className="text-2xl font-black mb-6 uppercase tracking-tight">
        Order <span className="text-blue-600">#{order._id}</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-tighter">Shipping Details</h2>
            
            {/* FIX: Optional Chaining use ki hai takki crash na ho */}
            <p className="text-gray-600 mb-1"><strong>Name:</strong> {order.user?.name || 'Customer'}</p>
            <p className="text-gray-600 mb-1"><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
            <p className="text-gray-600">
              <strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            
            <div className={`mt-4 p-3 rounded-xl text-xs font-bold uppercase inline-block ${order.isDelivered ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
               {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt || new Date()).toLocaleDateString()}` : 'Not Delivered'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-tighter">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                    <Link to={`/product/${item.product}`} className="font-bold text-sm hover:text-blue-600 transition">{item.name}</Link>
                  </div>
                  <div className="text-sm font-bold">
                    {item.qty} x ₹{item.price} = <span className="text-blue-600">₹{item.qty * item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] h-fit sticky top-24 shadow-2xl">
          <h2 className="text-xl font-black mb-6 uppercase tracking-tighter">Order Summary</h2>
          <div className="space-y-4 text-sm font-bold">
            <div className="flex justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-400 uppercase">Payment Method</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-xl pt-2">
              <span className="uppercase tracking-tighter">Total Amount</span>
              <span className="text-blue-400">₹{order.totalPrice}</span>
            </div>
            
            <div className={`mt-6 text-center py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${order.isPaid ? 'bg-green-500' : 'bg-red-500'}`}>
              {order.isPaid ? 'Payment Received' : 'Payment Pending'}
            </div>

            {userInfo?.isAdmin && !order.isDelivered && (
              <button
                onClick={deliverHandler}
                disabled={isUpdating}
                className="w-full mt-4 bg-white text-gray-900 font-black py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Mark As Delivered'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;