const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log(`[${options.method}] ${options.path}`);
        console.log(`Status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(body);
          console.log('Response:', JSON.stringify(parsed, null, 2));
        } catch {
          console.log('Response:', body);
        }
        console.log('---\n');
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  try {
    // Test getProducts
    console.log('=== TESTING PRODUCTS ENDPOINT ===\n');
    await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products',
      method: 'GET',
    });

    console.log('✓ All tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
}

runTests();
