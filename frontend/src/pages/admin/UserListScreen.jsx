import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getApiUrl from '../../utils/getApiUrl';
import { useNavigate } from 'react-router-dom';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get userInfo from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  // Verify admin access on mount
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
  }, [userInfo, navigate]);

  const fetchUsers = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        console.error('❌ No auth token found. Please login first.');
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const url = getApiUrl() + '/users';
      console.log('🔍 Fetching users from:', url);
      const { data } = await axios.get(url, config);
      console.log('✅ Users fetched:', data);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        console.error('⚠️ API did not return an array:', data);
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (userInfo && userInfo.isAdmin) {
      fetchUsers(); 
    }
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm('Kya aap is user ko delete karna chahte hain?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(getApiUrl() + `/users/${id}`, config);
        fetchUsers(); // Table refresh karne ke liye
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Users...</div>;

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter">Manage <span className="text-blue-600">Users</span></h1>
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white text-xs uppercase tracking-widest">
            <tr>
              <th className="p-6">ID</th>
              <th className="p-6">Name</th>
              <th className="p-6">Email</th>
              <th className="p-6">Admin Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.isArray(users) && users.length > 0 ? (
              users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50 transition-all">
                <td className="p-6 text-xs font-mono text-gray-400">{user._id}</td>
                <td className="p-6 font-bold text-gray-800">{user.name}</td>
                <td className="p-6 text-gray-600">{user.email}</td>
                <td className="p-6">
                  {user.isAdmin ? (
                    <span className="text-green-500 font-black tracking-widest text-[10px] bg-green-50 px-3 py-1 rounded-full uppercase">Admin</span>
                  ) : (
                    <span className="text-gray-400 font-bold text-[10px] bg-gray-50 px-3 py-1 rounded-full uppercase">Customer</span>
                  )}
                </td>
                <td className="p-6 text-right">
                  {!user.isAdmin && ( // Admin khud ko delete nahi kar sakta
                    <button onClick={() => deleteHandler(user._id)} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition font-bold text-xs">
                      DELETE
                    </button>
                  )}
                </td>
              </tr>
            ))
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListScreen;