# دليل الاختبار السريع - نظام طلبات المساعدة

## الاختبار باستخدام Postman أو cURL

### الخطوة الأولى: التسجيل والدخول

**1. إنشاء حساب جديد:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "محمد علي",
    "email": "mohammad@example.com",
    "password": "password123",
    "phone": "+963999999999",
    "city": "دمشق"
  }'
```

**2. تسجيل الدخول:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mohammad@example.com",
    "password": "password123"
  }'
```

**الاستجابة:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "محمد علي",
    "email": "mohammad@example.com",
    "phone": "+963999999999",
    "city": "دمشق",
    "role": "USER"
  }
}
```

### الخطوة الثانية: اختبار المسارات العامة (Public)

**1. عرض قائمة الطلبات المعتمدة:**
```bash
curl http://localhost:3000/requests/public
```

**2. البحث في الطلبات:**
```bash
curl "http://localhost:3000/requests/public?page=1&limit=5&city=دمشق"
```

**3. عرض طلب معتمد:**
```bash
curl http://localhost:3000/requests/public/1
```

### الخطوة الثالثة: اختبار المسارات الخاصة (Authenticated)

**احفظ التوكن في متغير:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**1. إنشاء طلب جديد:**
```bash
curl -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "serviceId": 2,
    "data": [
      {
        "fieldId": 10,
        "value": "5000 ليرة"
      },
      {
        "fieldId": 11,
        "value": "عائلة محتاجة من 4 أفراد"
      }
    ]
  }'
```

**2. عرض طلبات المستخدم:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/requests/my
```

**3. عرض طلب محدد:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/requests/1
```

**4. تحديث طلب:**
```bash
curl -X PATCH http://localhost:3000/requests/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "data": [
      {
        "fieldId": 10,
        "value": "7500 ليرة - مُحدّث"
      }
    ]
  }'
```

**5. حذف طلب:**
```bash
curl -X DELETE http://localhost:3000/requests/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## اختبار باستخدام HTTP ملف

أنشئ ملف `test-help-requests.http`:

```http
### متغيرات الاختبار
@host = http://localhost:3000
@token = YOUR_TOKEN_HERE

### 1️⃣ عرض جميع الطلبات المعتمدة
GET {{host}}/requests/public
Accept: application/json

### 2️⃣ عرض طلب محدد
GET {{host}}/requests/public/1
Accept: application/json

### 3️⃣ البحث حسب المدينة
GET {{host}}/requests/public?city=دمشق&page=1&limit=10
Accept: application/json

### 4️⃣ عرض طلبات المستخدم
GET {{host}}/requests/my
Authorization: Bearer {{token}}
Accept: application/json

### 5️⃣ إنشاء طلب جديد
POST {{host}}/requests
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "serviceId": 2,
  "data": [
    {
      "fieldId": 10,
      "value": "5000 ليرة"
    },
    {
      "fieldId": 11,
      "value": "عائلة محتاجة"
    }
  ]
}

### 6️⃣ تحديث طلب
PATCH {{host}}/requests/1
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "data": [
    {
      "fieldId": 10,
      "value": "7500 ليرة"
    }
  ]
}

### 7️⃣ حذف طلب
DELETE {{host}}/requests/1
Authorization: Bearer {{token}}
```

---

## اختبار باستخدام JavaScript (Frontend)

```javascript
// 1️⃣ جلب الطلبات المعتمدة
async function fetchPublicRequests(filters = {}) {
  const params = new URLSearchParams();
  if (filters.city) params.append('city', filters.city);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  const response = await fetch(`/requests/public?${params}`);
  const data = await response.json();
  return data;
}

// استخدام
const requests = await fetchPublicRequests({ city: 'دمشق', page: 1 });
console.log(requests.data);

// 2️⃣ جلب تفاصيل طلب معين
async function fetchRequestDetails(requestId) {
  const response = await fetch(`/requests/public/${requestId}`);
  return response.json();
}

// استخدام
const details = await fetchRequestDetails(1);
console.log(details.data);

// 3️⃣ إنشاء طلب جديد (بعد الدخول)
async function createRequest(serviceId, data, token) {
  const response = await fetch('/requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      serviceId,
      data
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create request: ${response.statusText}`);
  }
  
  return response.json();
}

// استخدام
try {
  const newRequest = await createRequest(2, [
    { fieldId: 10, value: '5000 ليرة' },
    { fieldId: 11, value: 'عائلة محتاجة' }
  ], token);
  console.log('تم إنشاء الطلب:', newRequest.data);
} catch (error) {
  console.error('خطأ:', error.message);
}

// 4️⃣ تحديث طلب
async function updateRequest(requestId, data, token) {
  const response = await fetch(`/requests/${requestId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ data })
  });
  
  return response.json();
}

// 5️⃣ حذف طلب
async function deleteRequest(requestId, token) {
  const response = await fetch(`/requests/${requestId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
}
```

---

## اختبار باستخدام React مثال عملي

```jsx
import React, { useState, useEffect } from 'react';

// مكون عرض الطلبات المعتمدة
function PublicRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.city) params.append('city', filters.city);
        params.append('page', filters.page);
        params.append('limit', filters.limit);

        const response = await fetch(`/requests/public?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setRequests(data.data);
        }
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filters]);

  return (
    <div>
      <h1>طلبات المساعدة المتاحة</h1>
      
      <div>
        <input
          type="text"
          placeholder="ابحث حسب المدينة..."
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value, page: 1 })}
        />
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div>
          {requests.length === 0 ? (
            <p>لا توجد طلبات</p>
          ) : (
            <div>
              {requests.map((request) => (
                <div key={request.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                  <h3>{request.service.name}</h3>
                  <p><strong>الاسم:</strong> {request.user.name}</p>
                  <p><strong>الهاتف:</strong> {request.user.phone}</p>
                  <p><strong>البريد:</strong> {request.user.email}</p>
                  <p><strong>المدينة:</strong> {request.user.city}</p>
                  <p><strong>التاريخ:</strong> {new Date(request.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PublicRequests;
```

---

## قائمة فحص الاختبار (Testing Checklist)

### ✅ المسارات العامة
- [ ] جلب جميع الطلبات المعتمدة
- [ ] البحث حسب المدينة
- [ ] البحث حسب نوع الخدمة
- [ ] البحث برقم الصفحة والحد
- [ ] جلب تفاصيل طلب معين
- [ ] محاولة جلب طلب غير معتمد (يجب أن ترجع 403)

### ✅ المسارات المحمية
- [ ] إنشاء طلب جديد بدون توكن (يجب أن ترجع 401)
- [ ] إنشاء طلب مع توكن صحيح
- [ ] إنشاء طلب بيانات ناقصة (يجب أن ترجع 400)
- [ ] جلب طلبات المستخدم
- [ ] تحديث طلب المستخدم
- [ ] محاولة تحديث طلب معتمد (يجب أن ترجع 400)
- [ ] حذف طلب المستخدم
- [ ] محاولة حذف طلب معتمد (يجب أن ترجع 400)

### ✅ التصفية والبحث
- [ ] البحث بالكلمات المفتاحية
- [ ] التصفية المتعددة
- [ ] الترقيم (Pagination)
- [ ] الترتيب

---

## استكشاف الأخطاء والأعطال

| المشكلة | الحل |
|-------|------|
| خطأ 401 عند الطلب | تأكد من إرسال التوكن في رأس `Authorization` |
| خطأ 404 | تحقق من رقم الطلب والمسار |
| خطأ 400 مع fieldId | تأكد من أن `fieldId` يطابق خدمة `serviceId` |
| لا تظهر البيانات العربية | تأكد من استخدام `URLSearchParams` للترميز الصحيح |

