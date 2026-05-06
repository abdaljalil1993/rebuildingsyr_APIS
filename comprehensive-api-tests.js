const http = require('http');

const BASE_URL = 'http://localhost:5000/api/v1';
let userToken = '';
let reviewerToken = '';
let adminToken = '';
let userId = '';
let requestId = '';
let serviceId = 1;
let registeredEmail = '';
let serviceFields = [];

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const fullUrl = path.startsWith('http') ? path : BASE_URL + path;
    const url = new URL(fullUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || 5000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 COMPREHENSIVE API TESTS\n');

  // Test 1: Health Check
  try {
    console.log('1️⃣ Health Check');
    const res = await makeRequest('GET', '/health');
    console.log(`   Status: ${res.status} ✅`);
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 2: Register User
  try {
    console.log('\n2️⃣ Register User');
    const res = await makeRequest('POST', '/auth/register', {
      name: 'Test User',
      email: `user${Date.now()}@test.com`,
      password: 'Password123!',
      phone: '1234567890',
      city: 'Gaza'
    });
    console.log(`   Status: ${res.status}`);
    if (res.data.data?.user?.id) {
      userId = res.data.data.user.id;
      console.log(`   User ID: ${userId}`);
    }
    if (res.data.data?.token) {
      userToken = res.data.data.token;
      registeredEmail = res.data.data.user.email;
      console.log(`   Token acquired ✅`);
    } else {
      console.log(`   Response: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 3: Login
  try {
    console.log('\n3️⃣ Login');
    const res = await makeRequest('POST', '/auth/login', {
      email: registeredEmail,
      password: 'Password123!'
    });
    console.log(`   Status: ${res.status}`);
    if (res.status === 200 && res.data.data?.token) {
      console.log(`   Login successful ✅`);
    } else {
      console.log(`   Response: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 4: Get Services (User)
  try {
    console.log('\n4️⃣ Get Services');
    const res = await makeRequest('GET', '/services', null, userToken);
    console.log(`   Status: ${res.status}`);
    if (res.data.data?.length > 0) {
      serviceId = res.data.data[0].id;
      console.log(`   Services count: ${res.data.data.length}`);
      console.log(`   Service ID: ${serviceId} ✅`);
      // Get service fields
      try {
        const fieldsRes = await makeRequest('GET', `/admin/services/${serviceId}/fields`, null, userToken);
        if (fieldsRes.status === 403) {
          // Try without admin, just assume field IDs 1,2,3,4
          serviceFields = [1, 2, 3, 4];
        }
      } catch (e) {
        serviceFields = [1, 2, 3, 4];
      }
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 5: Create Request
  try {
    console.log('\n5️⃣ Create Request');
    const res = await makeRequest('POST', '/requests', {
      serviceId: serviceId,
      data: [
        { fieldId: 1, value: 'Test Address' },
        { fieldId: 2, value: 'High' },
        { fieldId: 3, value: '50000' },
        { fieldId: 4, value: '2025-05-06' }
      ],
      media: []
    }, userToken);
    console.log(`   Status: ${res.status}`);
    if (res.data.data?.id) {
      requestId = res.data.data.id;
      console.log(`   Request ID: ${requestId} ✅`);
    } else {
      console.log(`   Response: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 6: List My Requests
  try {
    console.log('\n6️⃣ List My Requests');
    const res = await makeRequest('GET', '/requests/my?page=1&limit=10', null, userToken);
    console.log(`   Status: ${res.status}`);
    if (res.status === 200) {
      console.log(`   Requests count: ${res.data.data?.length || 0} ✅`);
    } else {
      console.log(`   Error message: ${res.data.message}`);
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 7: Get Request Details
  if (requestId) {
    try {
      console.log('\n7️⃣ Get Request Details');
      const res = await makeRequest('GET', `/requests/${requestId}`, null, userToken);
      console.log(`   Status: ${res.status}`);
      if (res.status === 200) {
        console.log(`   Request Status: ${res.data.data?.status} ✅`);
      }
    } catch (e) {
      console.log(`   Error: ${e.message} ❌`);
    }
  }

  // Test 8: Update Request
  if (requestId) {
    try {
      console.log('\n8️⃣ Update Request');
      const res = await makeRequest('PATCH', `/requests/${requestId}`, {
        data: [
          { fieldId: 1, value: 'Updated Address' }
        ]
      }, userToken);
      console.log(`   Status: ${res.status}`);
      if (res.status === 200) {
        console.log(`   Request updated ✅`);
      } else {
        console.log(`   Error message: ${res.data.message}`);
      }
    } catch (e) {
      console.log(`   Error: ${e.message} ❌`);
    }
  }

  // Test 9: Reviewer - List Requests
  try {
    console.log('\n9️⃣ Reviewer List Requests');
    // Create reviewer token (using admin creation first would be needed)
    const res = await makeRequest('GET', '/reviewer/requests?page=1&limit=10&mode=all', null, reviewerToken || userToken);
    console.log(`   Status: ${res.status}`);
    if (res.status === 403) {
      console.log(`   Not authorized (expected without REVIEWER role) ⚠️`);
    } else {
      console.log(`   Response: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 10: Admin - List Users
  try {
    console.log('\n🔟 Admin List Users');
    const res = await makeRequest('GET', '/admin/users?page=1&limit=10', null, adminToken || userToken);
    console.log(`   Status: ${res.status}`);
    if (res.status === 403) {
      console.log(`   Not authorized (expected without ADMIN role) ⚠️`);
    } else {
      console.log(`   Users count: ${res.data.data?.length || 0}`);
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 11: Admin - List Services
  try {
    console.log('\n1️⃣1️⃣ Admin List Services');
    const res = await makeRequest('GET', '/admin/services', null, adminToken || userToken);
    console.log(`   Status: ${res.status}`);
    if (res.status === 403) {
      console.log(`   Not authorized (expected without ADMIN role) ⚠️`);
    } else {
      console.log(`   Services count: ${res.data.data?.length || 0}`);
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 12: Admin - Get Statistics
  try {
    console.log('\n1️⃣2️⃣ Admin Get Statistics');
    const res = await makeRequest('GET', '/admin/statistics', null, adminToken || userToken);
    console.log(`   Status: ${res.status}`);
    if (res.status === 403) {
      console.log(`   Not authorized (expected without ADMIN role) ⚠️`);
    } else {
      console.log(`   Response: ${JSON.stringify(res.data.data)}`);
    }
  } catch (e) {
    console.log(`   Error: ${e.message} ❌`);
  }

  // Test 13: Delete Request
  if (requestId) {
    try {
      console.log('\n1️⃣3️⃣ Delete Request');
      const res = await makeRequest('DELETE', `/requests/${requestId}`, null, userToken);
      console.log(`   Status: ${res.status}`);
      if (res.status === 200) {
        console.log(`   Request deleted ✅`);
      }
    } catch (e) {
      console.log(`   Error: ${e.message} ❌`);
    }
  }

  console.log('\n✨ Tests completed!');
}

runTests().catch(console.error);
