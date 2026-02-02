const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const checkProducts = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const count = await Product.countDocuments();
    console.log(`\n📊 Total Products in Database: ${count}\n`);
    
    if (count > 0) {
      const products = await Product.find().limit(5);
      console.log('📦 Sample Products:\n');
      products.forEach((p, i) => {
        console.log(`${i+1}. ${p.name} - ₹${p.price} (${p.category})`);
      });
      console.log('\n✅ YOUR OLD PRODUCTS EXIST IN THE DATABASE!');
    } else {
      console.log('❌ NO PRODUCTS FOUND IN DATABASE');
      console.log('💡 Run: node seed.js to add sample products');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkProducts();
