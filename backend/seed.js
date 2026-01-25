const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('./models/productModel');

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    // Pehle existing products ko delete karein
    await Product.deleteMany({});

    const sampleProducts = [
      {
        name: 'Premium Wireless Headphones',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000001/products/headphones.jpg',
        description: 'High quality wireless headphones with noise cancellation',
        brand: 'AudioTech',
        category: 'Electronics',
        price: 4999,
        countInStock: 10,
      },
      {
        name: 'USB-C Charging Cable',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000002/products/cable.jpg',
        description: 'Fast charging USB-C cable, 2 meter length',
        brand: 'TechCable',
        category: 'Accessories',
        price: 499,
        countInStock: 25,
      },
      {
        name: 'Portable Power Bank',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000003/products/powerbank.jpg',
        description: '20000mAh portable power bank with dual USB ports',
        brand: 'PowerMax',
        category: 'Electronics',
        price: 1999,
        countInStock: 15,
      },
      {
        name: 'Phone Screen Protector',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000004/products/protector.jpg',
        description: 'Tempered glass screen protector for all phones',
        brand: 'ScreenGuard',
        category: 'Accessories',
        price: 299,
        countInStock: 50,
      },
      {
        name: 'Mechanical Keyboard',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000005/products/keyboard.jpg',
        description: 'RGB mechanical gaming keyboard with blue switches',
        brand: 'KeyMaster',
        category: 'Electronics',
        price: 3499,
        countInStock: 8,
      },
      {
        name: 'Wireless Mouse',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000006/products/mouse.jpg',
        description: 'Ergonomic wireless mouse with silent clicking',
        brand: 'Moustech',
        category: 'Electronics',
        price: 799,
        countInStock: 20,
      },
      {
        name: 'Phone Stand Holder',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000007/products/stand.jpg',
        description: 'Adjustable phone stand for desk',
        brand: 'StandPro',
        category: 'Accessories',
        price: 399,
        countInStock: 30,
      },
      {
        name: 'Laptop Cooling Pad',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000008/products/cooler.jpg',
        description: 'Laptop cooling pad with 2 USB ports',
        brand: 'CoolTech',
        category: 'Electronics',
        price: 1499,
        countInStock: 12,
      },
      {
        name: 'USB Hub Multi-Port',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000009/products/hub.jpg',
        description: '7-port USB 3.0 hub with power supply',
        brand: 'HubMaster',
        category: 'Accessories',
        price: 899,
        countInStock: 18,
      },
      {
        name: 'Wireless Charging Pad',
        image: 'https://res.cloudinary.com/dvwiv2cua/image/upload/v1000000010/products/charger.jpg',
        description: 'Fast wireless charging pad for all Qi-enabled devices',
        brand: 'ChargePro',
        category: 'Electronics',
        price: 1299,
        countInStock: 22,
      },
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`${createdProducts.length} products seeded successfully!`);
    
    // Display karenay products ko verify karne ke liye
    const allProducts = await Product.find({});
    console.log('\nAll Products in Database:');
    allProducts.forEach((p) => {
      console.log(`- ${p.name} (${p.price} Rs) - Stock: ${p.countInStock}`);
    });

  } catch (error) {
    console.error(`Error seeding products: ${error.message}`);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedProducts();
  await mongoose.connection.close();
  console.log('\nSeeding completed!');
};

runSeed();
