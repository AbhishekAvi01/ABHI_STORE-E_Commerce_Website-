const http = require('http');

// पहले test user login करेंगे, फिर token से orders fetch करेंगे

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testOrders() {
  try {
    console.log('=== TESTING ORDER API ===\n');

    // Test 1: Get all products
    console.log('[1] Getting all products...');
    let res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products',
      method: 'GET',
    });
    console.log(`Status: ${res.statusCode}`);
    const products = JSON.parse(res.body);
    console.log(`✓ Found ${products.length} products\n`);

    // Test 2: Try to get orders without token (should fail)
    console.log('[2] Getting orders WITHOUT token (should fail)...');
    res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/orders/myorders',
      method: 'GET',
    });
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${res.body}\n`);

    // Test 3: Get all existing orders from database
    console.log('[3] Checking database for existing orders...');
    const { execSync } = require('child_process');
    const dbCheck = execSync(`
      cd "${process.cwd()}" && node -e "
        const mongoose = require('mongoose');
        const Order = require('./models/orderModel');
        require('dotenv').config({ path: '.env' });
        
        mongoose.connect(process.env.MONGO_URI).then(() => {
          Order.find({}).then(orders => {
            console.log('Total orders in DB:', orders.length);
            if(orders.length > 0) {
              console.log('Sample order user ID:', orders[0].user);
            }
            process.exit(0);
          });
        }).catch(e => {
          console.error('DB Error:', e.message);
          process.exit(1);
        });
      "
    `, { encoding: 'utf-8' });
    console.log(dbCheck);

    console.log('✓ Tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testOrders();
