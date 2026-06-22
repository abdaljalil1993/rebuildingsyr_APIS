# نموذج الطلبات - دليل الاستخدام العملي والأمثلة

## الجدول السريع

### المسارات المتاحة

#### 🔓 عام (بدون مصادقة)
```
GET  /requests/public          - قائمة الطلبات المعتمدة
GET  /requests/public/:id      - تفاصيل طلب معتمد
```

#### 🔐 خاص بالمستخدم (مع مصادقة)
```
POST   /requests               - إنشاء طلب
GET    /requests/my            - طلباتي
GET    /requests/:id           - تفاصيل طلبي
PATCH  /requests/:id           - تحديث طلبي
DELETE /requests/:id           - حذف طلبي
```

---

## أمثلة مفصلة

### 1️⃣ إنشاء طلب تبرع جديد

**الطلب:**
```http
POST http://localhost:3000/requests
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "serviceId": 2,
  "data": [
    {
      "fieldId": 10,
      "value": "تبرع مالي بمبلغ 5000 ليرة"
    },
    {
      "fieldId": 11,
      "value": "مساعدة لعائلة مكونة من 5 أفراد تحت خط الفقر"
    },
    {
      "fieldId": 12,
      "value": "الاسم: محمد علي\nالعنوان: دمشق - المرجة"
    }
  ],
  "media": [
    {
      "filePath": "/uploads/family-photo.jpg",
      "type": "image"
    },
    {
      "filePath": "/uploads/verification-document.pdf",
      "type": "pdf"
    }
  ]
}
```

**الاستجابة (نجح 201):**
```json
{
  "success": true,
  "message": "تم إنشاء الطلب بنجاح",
  "data": {
    "id": 45,
    "userId": 12,
    "serviceId": 2,
    "status": "PENDING",
    "createdAt": "2024-01-20T15:30:45Z",
    "updatedAt": "2024-01-20T15:30:45Z",
    "rejectionReason": null,
    "user": {
      "id": 12,
      "name": "فاطمة محمود",
      "phone": "+963987654321",
      "email": "fatima@example.com",
      "city": "دمشق",
      "role": "USER",
      "createdAt": "2023-12-01T08:00:00Z"
    },
    "service": {
      "id": 2,
      "name": "تبرع مالي",
      "description": "تبرع مالي لمساعدة الأسر المحتاجة"
    },
    "data": [
      {
        "id": 120,
        "requestId": 45,
        "fieldId": 10,
        "value": "تبرع مالي بمبلغ 5000 ليرة",
        "field": {
          "id": 10,
          "name": "نوع التبرع",
          "type": "text",
          "required": true
        }
      },
      {
        "id": 121,
        "requestId": 45,
        "fieldId": 11,
        "value": "مساعدة لعائلة مكونة من 5 أفراد تحت خط الفقر",
        "field": {
          "id": 11,
          "name": "وصف الحالة",
          "type": "text",
          "required": true
        }
      }
    ],
    "media": [
      {
        "id": 65,
        "requestId": 45,
        "filePath": "/uploads/family-photo.jpg",
        "type": "image",
        "url": "http://localhost:3000/uploads/family-photo.jpg"
      }
    ],
    "notes": []
  }
}
```

---

### 2️⃣ عرض جميع الطلبات المعتمدة

**الطلب:**
```http
GET http://localhost:3000/requests/public?page=1&limit=10&city=دمشق
```

**الاستجابة:**
```json
{
  "success": true,
  "data": [
    {
      "id": 40,
      "status": "APPROVED",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-17T14:45:00Z",
      "service": {
        "id": 3,
        "name": "تطوع",
        "description": "التطوع لمساعدة المجتمع"
      },
      "user": {
        "id": 8,
        "name": "علي محمد أحمد",
        "phone": "+963912345678",
        "email": "ali.ahmed@example.com",
        "city": "دمشق"
      },
      "data": [
        {
          "id": 100,
          "requestId": 40,
          "fieldId": 15,
          "value": "بناء وإعادة تأهيل",
          "field": {
            "id": 15,
            "name": "مجال التطوع",
            "type": "text",
            "required": true
          }
        }
      ],
      "media": []
    },
    {
      "id": 38,
      "status": "APPROVED",
      "createdAt": "2024-01-12T08:15:00Z",
      "updatedAt": "2024-01-14T09:20:00Z",
      "service": {
        "id": 1,
        "name": "تبرع مالي",
        "description": "تبرع مالي للأسر المحتاجة"
      },
      "user": {
        "id": 5,
        "name": "سارة محمود",
        "phone": "+963988776655",
        "email": "sarah@example.com",
        "city": "دمشق"
      },
      "data": [
        {
          "id": 95,
          "requestId": 38,
          "fieldId": 10,
          "value": "10000 ليرة سورية",
          "field": {
            "id": 10,
            "name": "المبلغ المتبرع به",
            "type": "number",
            "required": true
          }
        }
      ],
      "media": [
        {
          "id": 45,
          "requestId": 38,
          "filePath": "/uploads/proof_payment.jpg",
          "type": "image"
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16
  }
}
```

---

### 3️⃣ عرض تفاصيل طلب معتمد (عام)

**الطلب:**
```http
GET http://localhost:3000/requests/public/40
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "id": 40,
    "status": "APPROVED",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-17T14:45:00Z",
    "service": {
      "id": 3,
      "name": "تطوع",
      "description": "التطوع لمساعدة المجتمع والمشاركة في المشاريع الخيرية"
    },
    "user": {
      "id": 8,
      "name": "علي محمد أحمد",
      "phone": "+963912345678",
      "email": "ali.ahmed@example.com",
      "city": "دمشق"
    },
    "data": [
      {
        "id": 100,
        "requestId": 40,
        "fieldId": 15,
        "value": "بناء وإعادة تأهيل",
        "field": {
          "id": 15,
          "name": "مجال التطوع",
          "type": "text",
          "required": true
        }
      },
      {
        "id": 101,
        "requestId": 40,
        "fieldId": 16,
        "value": "لدي خبرة في البناء والهندسة المدنية",
        "field": {
          "id": 16,
          "name": "الخبرات والمهارات",
          "type": "text",
          "required": true
        }
      },
      {
        "id": 102,
        "requestId": 40,
        "fieldId": 17,
        "value": "أيام الجمعة والسبت صباحاً",
        "field": {
          "id": 17,
          "name": "الأوقات المتاحة",
          "type": "text",
          "required": false
        }
      }
    ],
    "media": [
      {
        "id": 50,
        "requestId": 40,
        "filePath": "/uploads/certificate.pdf",
        "type": "pdf",
        "createdAt": "2024-01-15T10:35:00Z"
      }
    ]
  }
}
```

---

### 4️⃣ البحث والتصفية

#### أ) البحث حسب الكلمات المفتاحية
```http
GET http://localhost:3000/requests/public?search=بناء
```

#### ب) البحث حسب نوع الخدمة والمدينة
```http
GET http://localhost:3000/requests/public?serviceId=2&city=حلب
```

#### ج) عرض أحدث الطلبات
```http
GET http://localhost:3000/requests/public?sortBy=newest&limit=20
```

#### د) عرض الطلبات القديمة
```http
GET http://localhost:3000/requests/public?sortBy=oldest&page=2&limit=15
```

---

### 5️⃣ عرض طلبات المستخدم الخاصة

**الطلب:**
```http
GET http://localhost:3000/requests/my?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

**الاستجابة:**
```json
{
  "success": true,
  "data": [
    {
      "id": 45,
      "userId": 12,
      "serviceId": 2,
      "status": "PENDING",
      "createdAt": "2024-01-20T15:30:45Z",
      "updatedAt": "2024-01-20T15:30:45Z",
      "rejectionReason": null,
      "user": {...},
      "service": {...},
      "data": [...],
      "media": [...],
      "notes": []
    },
    {
      "id": 42,
      "userId": 12,
      "serviceId": 1,
      "status": "APPROVED",
      "createdAt": "2024-01-18T09:15:00Z",
      "updatedAt": "2024-01-19T16:20:00Z",
      "rejectionReason": null,
      "user": {...},
      "service": {...},
      "data": [...],
      "media": [...],
      "notes": [
        {
          "id": 5,
          "requestId": 42,
          "reviewerId": 20,
          "note": "تم الموافقة - البيانات كاملة وموثوقة",
          "createdAt": "2024-01-19T16:20:00Z"
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### 6️⃣ تحديث طلب معين

**الطلب:**
```http
PATCH http://localhost:3000/requests/45
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "data": [
    {
      "fieldId": 10,
      "value": "تبرع مالي مُحدّث: 7500 ليرة"
    },
    {
      "fieldId": 11,
      "value": "المزيد من التفاصيل عن الحالة..."
    }
  ]
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تحديث الطلب بنجاح",
  "data": {
    "id": 45,
    "userId": 12,
    "serviceId": 2,
    "status": "PENDING",
    "createdAt": "2024-01-20T15:30:45Z",
    "updatedAt": "2024-01-20T16:45:30Z",
    "user": {...},
    "service": {...},
    "data": [
      {
        "id": 120,
        "requestId": 45,
        "fieldId": 10,
        "value": "تبرع مالي مُحدّث: 7500 ليرة",
        "field": {...}
      }
    ],
    "media": [...],
    "notes": []
  }
}
```

---

### 7️⃣ حذف طلب

**الطلب:**
```http
DELETE http://localhost:3000/requests/45
Authorization: Bearer YOUR_TOKEN
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم حذف الطلب بنجاح"
}
```

---

## حالات الأخطاء

### 1. طلب غير موجود
```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "Request not found"
  }
}
```

### 2. عدم المصادقة
```json
{
  "success": false,
  "error": {
    "code": 401,
    "message": "Unauthorized - Please login first"
  }
}
```

### 3. طلب غير معتمد
```json
{
  "success": false,
  "error": {
    "code": 403,
    "message": "This request is not available for public view"
  }
}
```

### 4. بيانات غير صحيحة
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Invalid field ids for selected service: 99, 100"
  }
}
```

### 5. محاولة تحديث طلب معتمد
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Request can only be updated when status is PENDING or NEEDS_INFO"
  }
}
```

---

## نصائح مهمة للمطورين

### 1️⃣ التعامل مع التوكن (Token)
```javascript
const token = localStorage.getItem('token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### 2️⃣ التعامل مع الأخطاء
```javascript
try {
  const response = await fetch('/requests/public?city=دمشق');
  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.error.message);
  }
  const data = await response.json();
} catch (error) {
  console.error('Network error:', error);
}
```

### 3️⃣ ترميز البيانات العربية
```javascript
// استخدم URLSearchParams للبحث العربي
const params = new URLSearchParams({
  city: 'دمشق',
  search: 'تبرع مالي'
});
fetch(`/requests/public?${params}`);
```

### 4️⃣ معالجة الملفات
```javascript
// استخدم FormData للملفات
const formData = new FormData();
formData.append('serviceId', 2);
formData.append('file', fileInput.files[0]);

fetch('/requests', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

---

## مراجع إضافية

- [دليل الواجهات الكامل](./HELP_REQUESTS_API.md)
- [دليل المصادقة](./API.md)
- [معايير الأمان](./PROJECT_DOCUMENTATION.md)

