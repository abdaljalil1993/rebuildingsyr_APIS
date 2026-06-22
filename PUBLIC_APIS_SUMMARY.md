# نظام طلبات المساعدة والتبرعات - دليل التكامل الشامل

## 📍 موقع المسارات العامة (Public APIs)

### 1. **ملف الاختبار** (api-tests.http)
```
📁 api-tests.http
├── السطر 20-51: المسارات العامة (Public APIs)
│   ├── Line 26-27: GET /requests/public (قائمة الطلبات)
│   ├── Line 29-30: GET /requests/public?page=1&limit=10&city=Gaza
│   ├── Line 32-33: GET /requests/public?serviceId=2
│   ├── Line 35-36: GET /requests/public?search=shelter
│   ├── Line 38-39: GET /requests/public?city=Gaza&serviceId=2
│   ├── Line 41-42: GET /requests/public?sortBy=newest
│   ├── Line 44-45: GET /requests/public?sortBy=oldest
│   └── Line 48: GET /requests/public/{{requestId}} (تفاصيل الطلب)
```

### 2. **التوثيق الرئيسي** (API.md)
```
📁 API.md
├── Table of Contents (السطور 8-18)
│   └── 5. 🌐 Public Endpoints (No Auth)
├── Role & Permission Overview (السطور 169-204)
│   └── مخطط Mermaid محدّث يوضح المسارات العامة
│   └── جدول الأدوار محدّث مع دعم "Public"
└── السطور 222-403: وثائق تفصيلية للمسارات العامة
    ├── GET /requests/public (226-313)
    │   ├── معاملات الاستعلام (Query Parameters)
    │   ├── أمثلة على الطلبات
    │   ├── استجابة ناجحة 200
    │   └── رسائل الخطأ
    └── GET /requests/public/:id (326-403)
        ├── معاملات المسار (Path Parameters)
        ├── مثال على الطلب
        ├── استجابة ناجحة 200
        └── رسائل الخطأ
```

### 3. **التوثيق التقني** (PROJECT_DOCUMENTATION.md)
```
📁 PROJECT_DOCUMENTATION.md
├── القسم 3: دور Public (بدون مصادقة)
├── القسم 4: دورة حياة الطلب (محدّثة)
├── القسم 5: مخططات الحالة والتدفق
│   ├── 5. State Diagram
│   ├── 5.1 Complete System Flow Diagram (مع المسارات العامة)
│   ├── 5.2 Synchronization & Concurrency Flow
│   ├── 5.3 Data Flow Architecture
│   ├── 5.4 Public API Request Processing Flow (جديد)
│   └── 5.5 Concurrent Request Handling (جديد)
├── القسم 6: Sequence Flow
│   └── Public Browsing Flow (جديد)
└── القسم 10: Public API Features & Privacy (جديد)
    ├── Data Exposed (البيانات المعروضة)
    ├── Data NOT Exposed (البيانات المخفية)
    ├── Public Endpoints
    ├── Use Cases
    └── Privacy Controls
```

### 4. **أمثلة التطبيق** (HELP_REQUESTS_EXAMPLES.md)
```
📁 HELP_REQUESTS_EXAMPLES.md
├── قائمة كاملة من الأمثلة العملية
├── أمثلة JSON مفصلة للطلبات والاستجابات
└── أكواد JavaScript و React
```

### 5. **دليل الاختبار** (HELP_REQUESTS_TESTING.md)
```
📁 HELP_REQUESTS_TESTING.md
├── اختبارات cURL للمسارات العامة
├── اختبارات HTTP file
├── أمثلة JavaScript
└── قائمة فحص الاختبار
```

---

## 🔗 المسارات الكاملة

### المسارات العامة (Public - بدون مصادقة) ✅

| المسار | الوصف | في api-tests.http | في API.md |
|-------|-------|-------------------|-----------|
| `GET /requests/public` | قائمة الطلبات المعتمدة | Line 27 | Line 226 |
| `GET /requests/public?page=...&limit=...` | مع الترقيم | Line 30 | Line 248 |
| `GET /requests/public?city=...` | البحث حسب المدينة | Line 30 | Line 248 |
| `GET /requests/public?serviceId=...` | البحث حسب الخدمة | Line 33 | Line 249 |
| `GET /requests/public?search=...` | البحث بالكلمات | Line 36 | Line 250 |
| `GET /requests/public?city=...&serviceId=...` | بحث متقدم | Line 39 | Line 252 |
| `GET /requests/public?sortBy=newest` | الأحدث أولاً | Line 42 | Line 251 |
| `GET /requests/public?sortBy=oldest` | الأقدم أولاً | Line 45 | Line 251 |
| `GET /requests/public/:id` | تفاصيل طلب | Line 48 | Line 326 |

### المسارات المحمية (Authenticated) ✅

| المسار | الوصف | نوع |
|-------|-------|------|
| `POST /requests` | إنشاء طلب | User |
| `GET /requests/my` | طلباتي | User |
| `GET /requests/:id` | تفاصيل طلبي | User |
| `PATCH /requests/:id` | تحديث طلبي | User |
| `DELETE /requests/:id` | حذف طلبي | User |
| `GET /reviewer/requests` | عرض الطلبات | Reviewer |
| `PATCH /reviewer/requests/:id/status` | تحديث الحالة | Reviewer |
| `POST /reviewer/requests/:id/note` | إضافة ملاحظة | Reviewer |
| `GET /admin/...` | إدارة النظام | Admin |

---

## 📊 مخططات التدفق المضافة

### 1. مخطط النظام الكامل (5.1)
```mermaid
يوضح تدفق الطلب الكامل من المستخدم العام والمستخدم المسجل والمراجع والإداري
```

### 2. مخطط المزامنة والتزامن (5.2)
```mermaid
يوضح كيفية التعامل مع الطلبات المتزامنة من مستخدمين متعددين
```

### 3. معمارية تدفق البيانات (5.3)
```mermaid
يوضح طبقات التطبيق: Client → API → Service → Repository → Database
```

### 4. معالجة طلبات API العامة (5.4) ⭐ جديد
```mermaid
يوضح بالتفصيل كيفية معالجة GET /requests/public:
- قبول الطلب بدون مصادقة
- الاستعلام عن البيانات المعتمدة فقط
- تعقيم البيانات (sanitization)
- إرجاع الاستجابة مع معلومات التلامس
```

### 5. معالجة الطلبات المتزامنة (5.5) ⭐ جديد
```mermaid
يوضح كيفية إدارة Node.js و MySQL Connection Pool:
- مستخدم ينشئ طلب (Write Transaction)
- مستخدم عام يبحث (Read Query)
- مراجع يوافق (Update Transaction)
- جميعها بشكل متزامن آمن
```

---

## ✨ المميزات الجديدة

### 1. **البحث والتصفية** 🔍
- تصفية حسب المدينة
- تصفية حسب نوع الخدمة
- البحث بالكلمات المفتاحية
- الترتيب (الأحدث/الأقدم)
- الترقيم (Pagination)

### 2. **الخصوصية والأمان** 🔒
- المسارات العامة **لا تتطلب مصادقة**
- البيانات الحساسة محمية (كلمات المرور، الملاحظات الداخلية)
- معلومات التلامس معروضة فقط للطلبات المعتمدة
- تحكم كامل على البيانات المعروضة

### 3. **حالات الاستخدام** 📋
- **للمتبرعين**: اكتشاف الطلبات في مناطقهم
- **للمتطوعين**: البحث عن فرص العمل التطوعي
- **للمنظمات**: إيجاد الأشخاص المحتاجين
- **للوعي المجتمعي**: عرض الاحتياجات الحالية
- **للتواصل المباشر**: معلومات التلامس الكاملة

### 4. **الأداء والمزامنة** ⚡
- دعم الطلبات المتزامنة
- استعلامات قاعدة البيانات محسّنة
- ترقيم فعال (Pagination)
- مزامنة آمنة للعمليات المتزامنة

---

## 🚀 كيفية الاستخدام

### 1. اختبار المسارات العامة
```bash
# افتح api-tests.http في VS Code
# استخدم REST Client extension
# اضغط "Send Request" على أي مسار
```

### 2. استدعاء من التطبيق الأمامي (Frontend)

**JavaScript:**
```javascript
const response = await fetch('/requests/public?city=Gaza&page=1');
const data = await response.json();
```

**React:**
```jsx
useEffect(() => {
  fetch(`/requests/public?city=${selectedCity}`)
    .then(r => r.json())
    .then(data => setRequests(data.data));
}, [selectedCity]);
```

### 3. التعامل مع الأخطاء
```javascript
if (!response.ok) {
  const error = await response.json();
  console.error(error.error.message);
}
```

---

## 📚 الملفات المرجعية

| الملف | الغرض | التحديثات |
|------|-------|-----------|
| `api-tests.http` | اختبار المسارات | ✅ 8 مسارات عامة جديدة |
| `API.md` | التوثيق الرسمي | ✅ قسم جديد + مخططات |
| `PROJECT_DOCUMENTATION.md` | الهندسة المعمارية | ✅ 5 أقسام جديدة + مخططات |
| `HELP_REQUESTS_API.md` | دليل شامل (عربي) | ✅ موجود |
| `HELP_REQUESTS_EXAMPLES.md` | أمثلة عملية (عربي) | ✅ موجود |
| `HELP_REQUESTS_TESTING.md` | دليل الاختبار (عربي) | ✅ موجود |

---

## 🎯 الخلاصة

✅ **تم إضافة** 8 مسارات عامة جديدة للبحث عن الطلبات المعتمدة  
✅ **تم توثيق** كاملة في API.md و PROJECT_DOCUMENTATION.md  
✅ **تم إضافة** 5 مخططات Mermaid توضيحية  
✅ **تم توثيق** حالات الاستخدام والخصوصية  
✅ **تم الاختبار** في api-tests.http  
✅ **لا توجد** أخطاء في الكود أو الملفات  

---

**التاريخ**: 2026-06-22  
**الإصدار**: 1.0 (مكتمل)  
**الحالة**: ✅ جاهز للاستخدام والنشر
