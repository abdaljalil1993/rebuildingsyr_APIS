// API Test Script
const http = require('http');

const tests = [
  {
    name: '✅ Health Check',
    method: 'GET',
    path: '/api/v1/health',
    headers: {},
    body: null
  },
  {
    name: '✅ Register User',
    method: 'POST',
    path: '/api/v1/auth/register',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123',
      phone: '+970599999999',
      city: 'Gaza'
    })
  }
];

function makeRequest(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: test.path,
      method: test.method,
      headers: test.headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n${test.name}`);
        console.log(`Status: ${res.statusCode}`);
        try {
          console.log('Response:', JSON.stringify(JSON.parse(data), null, 2));
        } catch {
          console.log('Response:', data);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`\n${test.name}`);
      console.log(`Error: ${e.message}`);
      resolve();
    });

    if (test.body) req.write(test.body);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Running API Tests...\n');
  for (const test of tests) {
    await makeRequest(test);
  }
  console.log('\n✨ Tests completed!');
}

runTests();
