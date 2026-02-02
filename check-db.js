const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const Order = require('./backend/models/orderModel');
const User = require('./backend/models/userModel');

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    // Check users
    const users = await User.find().select('_id name email');
    console.log(`Total Users: ${users.length}`);
    if (users.length > 0) {
      console.log('Sample User:', users[0]);
      console.log('');
    }

    // Check orders
    const orders = await Order.find().populate('user', 'name email');
    console.log(`Total Orders: ${orders.length}`);
    if (orders.length > 0) {
      console.log('Sample Order:', {
        _id: orders[0]._id,
        user: orders[0].user,
        totalPrice: orders[0].totalPrice,
        itemCount: orders[0].orderItems?.length || 0
      });
    } else {
      console.log('No orders found in database');
    }

    console.log('\n✓ Database check completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
