# دليل شامل: واجهات Help Offers المضافة حديثًا

هذا المستند يوثق كل ما تم إضافته في مرحلة Help Offers فقط، بدون تغيير أي API قديم.

## 1) ماذا تمت إضافته

تمت إضافة موديول جديد مستقل اسمه Help Offers يحقق السيناريو التالي:

- المستخدم يرى الطلبات العامة المعتمدة (موجودة مسبقًا).
- المستخدم يختار طلبًا ويقدم عرض مساعدة عليه.
- النظام يخزن العلاقة: من قدّم المساعدة + لأي طلب.
- الأدمن يتابع حالة العرض ويحدّثها حتى الإغلاق.

## 2) بنية الارتباط داخل النظام

### 2.1 الكيان الجديد

- جدول جديد: help_offers
- الكيان: src/entities/HelpOffer.ts

العلاقات:

- help_offers.requestId -> requests.id
- help_offers.helperUserId -> users.id
- help_offers.followedByAdminId -> users.id (اختياري)

### 2.2 الحقول الأساسية

- id
- requestId
- helperUserId
- followedByAdminId (nullable)
- message (nullable)
- adminNote (nullable)
- cancelReason (nullable)
- completedAt (nullable)
- status
- createdAt
- updatedAt

### 2.3 حالات العرض (HelpOfferStatus)

- NEW
- CONTACTED
- IN_PROGRESS
- COMPLETED
- REJECTED
- CANCELED

## 3) الملفات التي تم إضافتها/تعديلها

### 3.1 ملفات جديدة

- src/entities/HelpOffer.ts
- src/dtos/help-offer.dto.ts
- src/repositories/help-offer.repository.ts
- src/services/help-offer.service.ts
- src/controllers/help-offer.controller.ts
- src/controllers/admin-help-offer.controller.ts
- src/routes/help-offer.routes.ts
- src/routes/admin-help-offer.routes.ts

### 3.2 ملفات تم تعديلها للربط

- src/constants/enums.ts
- src/config/data-source.ts
- src/routes/index.ts
- api-tests.http
- API.md

## 4) المسارات الجديدة كاملة (بدون استثناء)

Base URL:

- http://localhost:5000/api/v1

### 4.1 User APIs

1. POST /help-offers
2. GET /help-offers/my
3. GET /help-offers/my/:id
4. PATCH /help-offers/my/:id/cancel

### 4.2 Admin APIs

1. GET /admin/help-offers
2. GET /admin/help-offers/:id
3. PATCH /admin/help-offers/:id/status

## 5) قواعد العمل (Business Rules)

1. لا يمكن تقديم مساعدة على طلب غير معتمد.

- يجب أن تكون حالة الطلب الهدف APPROVED.

2. لا يمكن للمستخدم تقديم مساعدة على طلبه الشخصي.

- إذا request.userId = helperUserId يتم الرفض.

3. منع تكرار العرض النشط لنفس المستخدم على نفس الطلب.

- الحالات النشطة: NEW, CONTACTED, IN_PROGRESS.
- إذا يوجد عرض نشط مسبقًا لنفس (helperUserId + requestId) يتم الرفض 409.

4. إلغاء العرض من المستخدم له قيود.

- لا يمكن إلغاء عرض بحالة COMPLETED أو REJECTED.
- لا يمكن إلغاء عرض تم إلغاؤه سابقًا.

5. الأدمن عند تحديث الحالة:

- يتم تسجيل followedByAdminId = adminId.
- عند التحويل إلى COMPLETED يتم تعيين completedAt تلقائيًا.

## 6) كيفية الاستدعاء (Calling) + الاستخدام (Usage)

ملاحظة: كل الأمثلة التالية موجودة أيضًا في api-tests.http.

### 6.1 POST /help-offers

الغرض:

- إنشاء عرض مساعدة جديد من مستخدم على طلب معتمد.

الصلاحية:

- USER فقط.

Headers:

- Authorization: Bearer USER_TOKEN
- Content-Type: application/json

Body:

```json
{
  "requestId": 15,
  "message": "I can provide support this week"
}
```

نجاح متوقع:

- 201 Created

أخطاء شائعة:

- 400 إذا الطلب غير APPROVED أو محاولة مساعدة طلبك الشخصي.
- 404 إذا الطلب غير موجود.
- 409 إذا يوجد عرض نشط سابق لنفس الطلب.

Flowchart:

```mermaid
flowchart TD
    A[POST /help-offers] --> B[Auth USER]
    B --> C[Validate DTO]
    C --> D{Request exists?}
    D -->|No| E[404 Request not found]
    D -->|Yes| F{Request status APPROVED?}
    F -->|No| G[400 Not eligible]
    F -->|Yes| H{Own request?}
    H -->|Yes| I[400 Cannot help own request]
    H -->|No| J{Active offer already exists?}
    J -->|Yes| K[409 Duplicate active offer]
    J -->|No| L[Create HelpOffer status=NEW]
    L --> M[201 Created]
```

---

### 6.2 GET /help-offers/my

الغرض:

- جلب كل عروض المساعدة الخاصة بالمستخدم الحالي مع Pagination/Filtering.

الصلاحية:

- USER فقط.

Headers:

- Authorization: Bearer USER_TOKEN

Query Parameters:

- page
- limit
- status
- requestId
- search

مثال:

- GET /help-offers/my?page=1&limit=10&status=NEW

نجاح متوقع:

- 200 OK

Flowchart:

```mermaid
flowchart TD
    A[GET /help-offers/my] --> B[Auth USER]
    B --> C[Validate Query DTO]
    C --> D[Build pagination]
    D --> E[Query by helperUserId + filters]
    E --> F[Return data + meta]
    F --> G[200 OK]
```

---

### 6.3 GET /help-offers/my/:id

الغرض:

- جلب تفاصيل عرض واحد يخص المستخدم الحالي فقط.

الصلاحية:

- USER فقط.

Headers:

- Authorization: Bearer USER_TOKEN

Path Param:

- id = helpOfferId

نجاح متوقع:

- 200 OK

أخطاء شائعة:

- 404 إذا العرض غير موجود.
- 403 إذا العرض لا يخص المستخدم.

Flowchart:

```mermaid
flowchart TD
    A[GET /help-offers/my/:id] --> B[Auth USER]
    B --> C[Find help offer by id]
    C --> D{Found?}
    D -->|No| E[404 Not found]
    D -->|Yes| F{Owned by req.user.id?}
    F -->|No| G[403 Forbidden]
    F -->|Yes| H[200 OK + offer details]
```

---

### 6.4 PATCH /help-offers/my/:id/cancel

الغرض:

- إلغاء عرض مساعدة للمستخدم الحالي.

الصلاحية:

- USER فقط.

Headers:

- Authorization: Bearer USER_TOKEN
- Content-Type: application/json

Body:

```json
{
  "cancelReason": "Unable to continue"
}
```

نجاح متوقع:

- 200 OK

أخطاء شائعة:

- 404 إذا العرض غير موجود.
- 403 إذا العرض لا يخص المستخدم.
- 400 إذا الحالة CANCELED مسبقًا أو COMPLETED أو REJECTED.

Flowchart:

```mermaid
flowchart TD
    A[PATCH /help-offers/my/:id/cancel] --> B[Auth USER]
    B --> C[Validate DTO]
    C --> D[Find help offer]
    D --> E{Found?}
    E -->|No| F[404 Not found]
    E -->|Yes| G{Owned by user?}
    G -->|No| H[403 Forbidden]
    G -->|Yes| I{Status cancelable?}
    I -->|No| J[400 Invalid state]
    I -->|Yes| K[Set status=CANCELED + reason]
    K --> L[200 OK]
```

---

### 6.5 GET /admin/help-offers

الغرض:

- قائمة عروض المساعدة للأدمن مع الفلترة والمتابعة.

الصلاحية:

- ADMIN فقط.

Headers:

- Authorization: Bearer ADMIN_TOKEN

Query Parameters:

- page
- limit
- status
- requestId
- helperUserId
- city
- search

مثال:

- GET /admin/help-offers?page=1&limit=20&status=NEW

نجاح متوقع:

- 200 OK

Flowchart:

```mermaid
flowchart TD
    A[GET /admin/help-offers] --> B[Auth ADMIN]
    B --> C[Validate Query DTO]
    C --> D[Build pagination]
    D --> E[Apply admin filters]
    E --> F[Return list + meta]
    F --> G[200 OK]
```

---

### 6.6 GET /admin/help-offers/:id

الغرض:

- جلب تفاصيل عرض مساعدة واحد بشكل كامل للأدمن.

الصلاحية:

- ADMIN فقط.

Headers:

- Authorization: Bearer ADMIN_TOKEN

Path Param:

- id = helpOfferId

نجاح متوقع:

- 200 OK

أخطاء شائعة:

- 404 إذا العرض غير موجود.

Flowchart:

```mermaid
flowchart TD
    A[GET /admin/help-offers/:id] --> B[Auth ADMIN]
    B --> C[Find help offer by id with relations]
    C --> D{Found?}
    D -->|No| E[404 Not found]
    D -->|Yes| F[200 OK + full details]
```

---

### 6.7 PATCH /admin/help-offers/:id/status

الغرض:

- تحديث حالة عرض المساعدة من قبل الأدمن وتسجيل ملاحظة متابعة.

الصلاحية:

- ADMIN فقط.

Headers:

- Authorization: Bearer ADMIN_TOKEN
- Content-Type: application/json

Body:

```json
{
  "status": "IN_PROGRESS",
  "adminNote": "Coordinator contacted both parties"
}
```

نجاح متوقع:

- 200 OK

أخطاء شائعة:

- 404 إذا العرض غير موجود.
- 400 إذا status غير صالح حسب enum.

Flowchart:

```mermaid
flowchart TD
    A[PATCH /admin/help-offers/:id/status] --> B[Auth ADMIN]
    B --> C[Validate DTO]
    C --> D[Find help offer by id]
    D --> E{Found?}
    E -->|No| F[404 Not found]
    E -->|Yes| G[Set status + adminNote]
    G --> H[Set followedByAdminId = adminId]
    H --> I{status == COMPLETED?}
    I -->|Yes| J[completedAt = now]
    I -->|No| K[completedAt = null]
    J --> L[Save]
    K --> L
    L --> M[200 OK]
```

## 7) الربط مع واجهاتك الحالية في الفرونت

التكامل المقترح خطوة بخطوة:

1. الشاشة الحالية للطلبات العامة تبقى كما هي (GET /requests/public).
2. عند ضغط زر تقديم مساعدة على بطاقة طلب:
   - استدعاء POST /help-offers مع requestId.
3. شاشة المتطوع/المساعد:
   - عرض طلباته عبر GET /help-offers/my.
   - إلغاء عرض عند الحاجة عبر PATCH /help-offers/my/:id/cancel.
4. لوحة الأدمن:
   - Inbox عروض جديدة عبر GET /admin/help-offers?status=NEW.
   - التفاصيل عبر GET /admin/help-offers/:id.
   - متابعة الحالة عبر PATCH /admin/help-offers/:id/status.

## 8) مخطط تدفقي شامل End-to-End

```mermaid
flowchart LR
    U[User sees approved requests] --> P[POST /help-offers]
    P --> N[Offer status NEW]
    N --> A1[Admin list: GET /admin/help-offers]
    A1 --> A2[Admin details: GET /admin/help-offers/:id]
    A2 --> A3[Admin updates status]
    A3 --> C{Status}
    C -->|CONTACTED| S1[Coordination started]
    C -->|IN_PROGRESS| S2[Help in progress]
    C -->|COMPLETED| S3[Process closed successfully]
    C -->|REJECTED| S4[Rejected by admin]
    U --> X[PATCH /help-offers/my/:id/cancel]
    X --> S5[Canceled]
```

## 9) أمثلة سريعة جاهزة (REST Client)

راجع الأمثلة الجاهزة في:

- api-tests.http

أقسام:

- HELP OFFERS - USER APIS
- HELP OFFERS - ADMIN APIS

## 10) التوافق مع النظام السابق

- لم يتم تعديل أي endpoint قديم.
- جميع الإضافات تمت تحت مسارات جديدة مستقلة.
- الربط مع قاعدة البيانات تم عبر Entity جديد فقط.

## 11) ملاحظات تشغيل

- لأن المشروع يعمل بـ synchronize، سيتم إنشاء جدول help_offers تلقائيًا عند تشغيل السيرفر إذا DB_SYNCHRONIZE=true.
- تأكد أن المستخدمين المستعملين في الاختبار عندهم أدوار صحيحة (USER / ADMIN).
