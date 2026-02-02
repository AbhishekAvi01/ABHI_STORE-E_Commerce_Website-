import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getApiUrl from '../../utils/getApiUrl';
import { useNavigate } from 'react-router-dom';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // LocalStorage se userInfo nikalna
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(getApiUrl() + '/products');
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
        console.error('API did not return an array:', data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error.message);
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => { 
    // Agar user admin nahi hai toh wapas bhej dein
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      fetchProducts(); 
    }
  }, [navigate]);

  // Naya product banane ka handler
  const createProductHandler = async () => {
    if (window.confirm('Naya sample product banayein?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post(getApiUrl() + '/products', {}, config);
        
        fetchProducts(); // List refresh karein
        alert('Sample Product Created Successfully!');
        
        // Optionally: seedha edit page par bhej sakte hain
        // navigate(`/admin/product/${data._id}/edit`);
      } catch (error) {
        alert(error.response?.data?.message || 'Error creating product');
      }
    }
  };

  // Product delete karne ka handler
  const deleteHandler = async (id) => {
    if (window.confirm('Kya aap is product ko hamesha ke liye delete karna chahte hain?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(getApiUrl() + `/products/${id}`, config);
        
        fetchProducts(); // List update karein
        alert('Product Deleted!');
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Manage <span className="text-blue-600">Products</span>
        </h1>
        
        <button 
          onClick={createProductHandler}
          className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest"
        >
          + Create New Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl font-bold italic text-gray-400">Loading All Products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-300">
           <p className="text-gray-400 font-bold uppercase tracking-widest">No Products Found. Create one!</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900 text-white text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="p-6">Name</th>
                <th className="p-6">Price</th>
                <th className="p-6">Category</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                <tr key={product._id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="p-6 font-bold text-gray-800">{product.name}</td>
                  <td className="p-6 font-black text-blue-600 italic">₹{product.price}</td>
                  <td className="p-6 text-gray-400 font-bold uppercase text-[10px]">{product.category}</td>
                  <td className="p-6 text-right space-x-2">
                     <button 
                        onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                        className="text-blue-600 font-black text-[10px] px-4 py-2 hover:bg-blue-600 hover:text-white border border-blue-600 rounded-xl transition-all uppercase"
                     >
                        EDIT
                     </button>
                     <button 
                        onClick={() => deleteHandler(product._id)}
                        className="text-red-600 font-black text-[10px] px-4 py-2 hover:bg-red-600 hover:text-white border border-red-600 rounded-xl transition-all uppercase"
                     >
                        DELETE
                     </button>
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

export default ProductListScreen;