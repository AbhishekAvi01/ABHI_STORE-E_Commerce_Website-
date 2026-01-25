import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';
import api from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('');
  const dispatch = useDispatch();

  // Professional category list
  const CATEGORIES = [
    { value: '', label: 'All Categories' },
    { value: 'Footwear', label: 'Footwear' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Accessories', label: 'Accessories' }
  ];

  // Fetch products with filters and sorting
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (search) params.append('search', search);
        if (selectedCategory) params.append('category', selectedCategory);
        if (sort) params.append('sort', sort);
        
        const { data } = await api.get(`/products?${params.toString()}`);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, selectedCategory, sort]);

  const addToCartHandler = (p) => {
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success(`${p.name} added to cart!`, {
      position: 'top-center',
      style: { borderRadius: '12px', background: '#111', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSort('');
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Toaster />
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
        </div>

        {/* Filter Bar - Premium Control Panel */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 mb-8 sticky top-0 z-40 backdrop-blur-sm bg-opacity-98 shadow-sm">
          {/* Search Input - Visually Dominant */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products by name, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-150"
            />
          </div>

          {/* Category & Sort Row */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-150 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Sort Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5 block">Sort by Price</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-150 cursor-pointer"
              >
                <option value="">Default</option>
                <option value="price_asc">Low to High</option>
                <option value="price_desc">High to Low</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          {(search || selectedCategory || sort) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-medium px-3 py-1.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-base mb-4">No products found</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Products Grid - Premium Density */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {products.map((p) => (
              <div 
                key={p._id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"
              >
                {/* Image Container - Fixed Height, Centered */}
                <Link 
                  to={`/product/${p._id}`} 
                  className="block bg-gray-50 relative overflow-hidden flex-shrink-0 group"
                  style={{ height: '220px' }}
                >
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-contain p-4 transition-transform duration-200 group-hover:scale-110"
                  />
                  
                  {/* Stock Badge - Top Left */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                      p.countInStock > 0 
                        ? 'bg-green-50 text-green-700 border-green-300' 
                        : 'bg-red-50 text-red-700 border-red-300'
                    }`}>
                      {p.countInStock > 0 ? 'In Stock' : 'Out'}
                    </span>
                  </div>
                </Link>

                {/* Content Section - Proper Hierarchy */}
                <div className="p-3.5 flex flex-col flex-grow">
                  {/* Product Name - Secondary */}
                  <Link to={`/product/${p._id}`}>
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors duration-150 mb-2.5">
                      {p.name}
                    </h3>
                  </Link>

                  {/* Price - PRIMARY, DOMINANT */}
                  <p className="text-base md:text-lg font-bold text-blue-600 mb-3.5">
                    ₹{p.price.toLocaleString('en-IN')}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCartHandler(p)}
                    disabled={p.countInStock === 0}
                    className={`py-2.5 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      p.countInStock > 0 
                        ? 'bg-gray-900 text-white hover:bg-blue-600 focus:ring-blue-600 active:scale-95' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {p.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;