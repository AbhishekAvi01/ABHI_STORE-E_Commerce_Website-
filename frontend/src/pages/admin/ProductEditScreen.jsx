import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORIES = [
  { value: 'Footwear', label: 'Footwear' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Accessories', label: 'Accessories' }
];

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  
  // State definitions
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description || '');
      } catch (error) {
        toast.error('Error fetching product');
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!name || !image || !price || !brand || !category) {
      toast.error('Please fill all required fields including image');
      return;
    }

    try {
      const config = { 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo.token}` 
        } 
      };
      
      await axios.put(
        `/api/products/${productId}`, 
        { name, price: Number(price), brand, category, countInStock: Number(countInStock), description, image }, 
        config
      );
      
      toast.success('Product updated successfully!');
      setTimeout(() => navigate('/admin/productlist'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setLoadingImage(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      
      setImage(data.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Image upload failed';
      toast.error(errorMsg);
      console.error('Upload error:', error);
    } finally {
      setLoadingImage(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-10 max-w-2xl">
      <Toaster />
      <Link to="/admin/productlist" className="text-blue-600 font-bold mb-5 block hover:underline flex items-center gap-2">
        ← Back to Products
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
        Edit <span className="text-blue-600">Product</span>
      </h1>
      
      <form onSubmit={submitHandler} className="bg-white p-6 md:p-8 rounded-xl shadow-md space-y-6 border border-gray-200">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Product Name *</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
            className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
            placeholder="Enter product name"
          />
        </div>

        {/* Price & Stock Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Price (₹) *</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              required
              step="0.01"
              min="0"
              className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Stock Count *</label>
            <input 
              type="number" 
              value={countInStock} 
              onChange={(e) => setCountInStock(e.target.value)}
              required
              min="0"
              className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
              placeholder="0"
            />
          </div>
        </div>

        {/* Brand & Category Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Brand *</label>
            <input 
              type="text" 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)}
              required
              className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
              placeholder="Brand name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Category *</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Description</label>
          <textarea 
            rows="4" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none" 
            placeholder="Enter product description..."
          />
        </div>

        {/* Image Upload - Improved */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-3">Product Image *</label>
          
          {/* Image Preview */}
          {image && (
            <div className="mb-4 relative">
              <img src={image} alt="Preview" className="w-full h-48 object-contain bg-gray-100 rounded-lg border border-gray-300" />
              <button
                type="button"
                onClick={() => setImage('')}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
              >
                ✕
              </button>
            </div>
          )}

          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={loadingImage}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {loadingImage ? (
              <div>
                <div className="text-blue-600 font-semibold mb-2">Uploading... {uploadProgress}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div>
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-gray-600 font-medium">Click or drag image here</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or WebP (Max 5MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loadingImage}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-4 rounded-lg font-bold uppercase tracking-wide transition-colors"
        >
          {loadingImage ? 'Uploading Image...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductEditScreen;