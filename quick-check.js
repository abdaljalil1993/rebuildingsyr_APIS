const http = require('http');

const base = 'http://localhost:5000/api/v1';

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(base + path);
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const r = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => {
        data += c;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    r.on('error', reject);

    if (body) {
      r.write(JSON.stringify(body));
    }

    r.end();
  });
}

(async () => {
  const email = `u${Date.now()}@t.com`;
  const reg = await req('POST', '/auth/register', {
    name: 'User Test',
    email,
    password: 'Password123!',
    phone: '123456789',
    city: 'Gaza'
  });

  const token = reg.body?.data?.token;
  const list = await req('GET', '/requests/my?page=1&limit=10', null, token);

  console.log('REGISTER', reg.status);
  console.log('LIST', list.status, JSON.stringify(list.body));
})();
