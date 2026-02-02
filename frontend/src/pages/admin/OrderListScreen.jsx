import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Link import kiya
import axios from 'axios';
import getApiUrl from '../../utils/getApiUrl';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(getApiUrl() + '/orders', config);
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
          console.error('API did not return an array:', data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setOrders([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
          Admin <span className="text-blue-600">Dashboard</span>
        </h1>
        <div className="bg-gray-900 text-white px-6 py-2 rounded-2xl font-bold text-sm">
          Total Orders: {orders.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl font-bold italic text-gray-400">Loading All Orders...</div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900 text-white uppercase text-xs tracking-widest">
              <tr>
                <th className="p-6">User</th>
                <th className="p-6">Date</th>
                <th className="p-6">Total</th>
                <th className="p-6">Paid</th>
                <th className="p-6">Delivered</th>
                <th className="p-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                <tr key={order._id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="p-6 font-bold text-gray-700">{order.user && order.user.name}</td>
                  <td className="p-6 text-gray-500">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-6 font-black text-blue-600">₹{order.totalPrice}</td>
                  <td className="p-6">
                    {order.isPaid ? (
                      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">Yes</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">No</span>
                    )}
                  </td>
                  <td className="p-6">
                    {order.isDelivered ? (
                      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">Yes</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">No</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    {/* FIX: Button ko Link se wrap kiya taaki click karne par details khulein */}
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-gray-100 group-hover:bg-blue-600 group-hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition-all">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;