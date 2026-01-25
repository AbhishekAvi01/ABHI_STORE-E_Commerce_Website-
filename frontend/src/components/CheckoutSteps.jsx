import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex justify-center space-x-4 mb-8 font-bold uppercase text-xs">
      <div className={step1 ? 'text-blue-600' : 'text-gray-400'}>Login</div>
      <span>/</span>
      <div className={step2 ? 'text-blue-600' : 'text-gray-400'}>Shipping</div>
      <span>/</span>
      <div className={step3 ? 'text-blue-600' : 'text-gray-400'}>Payment</div>
      <span>/</span>
      <div className={step4 ? 'text-blue-600' : 'text-gray-400'}>Place Order</div>
    </nav>
  );
};
export default CheckoutSteps;