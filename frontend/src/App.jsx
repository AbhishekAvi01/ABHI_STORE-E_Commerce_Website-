import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomeScreen from './pages/HomeScreen';
import CartScreen from './pages/CartScreen';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import ShippingScreen from './pages/ShippingScreen';
import PaymentScreen from './pages/PaymentScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import ProfileScreen from './pages/ProfileScreen';
import OrderScreen from './pages/OrderScreen';
import ProductScreen from './pages/ProductScreen'; 

// Admin Screens
import ProductListScreen from './pages/admin/ProductListScreen';
import OrderListScreen from './pages/admin/OrderListScreen';
import UserListScreen from './pages/admin/UserListScreen';
import ProductEditScreen from './pages/admin/ProductEditScreen';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
      <main className="min-h-[80vh] bg-gray-50">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />

          {/* Admin Routes */}
          <Route path="/admin/userlist" element={<UserListScreen />} />
          <Route path="/admin/productlist" element={<ProductListScreen />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
          <Route path="/admin/orderlist" element={<OrderListScreen />} />
        </Routes>
      </main>
      <footer className="text-center py-10 bg-white border-t border-gray-100 text-gray-400 font-bold text-sm uppercase">
        &copy; {new Date().getFullYear()} ABHI-STORE. All Rights Reserved.
      </footer> 
    </Router>
  );
}

export default App;