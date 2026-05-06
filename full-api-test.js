// Full API Test — tests every endpoint in the system
const BASE = "http://localhost:5000/api/v1";

let passed = 0;
let failed = 0;
const results = [];

async function req(method, url, body, token) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const r = await fetch(`${BASE}${url}`, opts);
  let data;
  try { data = await r.json(); } catch { data = {}; }
  return { status: r.status, data };
}

function check(label, status, expected, data) {
  const ok = Array.isArray(expected) ? expected.includes(status) : status === expected;
  const icon = ok ? "✅" : "❌";
  if (ok) passed++; else failed++;
  results.push(`${icon} [${status}] ${label}${ok ? "" : `  ← expected ${expected}, got: ${JSON.stringify(data || {}).slice(0,120)}`}`);
}

async function run() {
  console.log("=".repeat(60));
  console.log(" FULL API TEST");
  console.log("=".repeat(60));

  // ── HEALTH ─────────────────────────────────────────────────
  let r = await req("GET", "/health");
  check("GET /health", r.status, 200);

  // ── AUTH ────────────────────────────────────────────────────
  const email = `test_${Date.now()}@example.com`;
  const reviewerEmail = `reviewer_${Date.now()}@example.com`;
  const adminEmail = `admin_${Date.now()}@example.com`;

  // Register USER
  r = await req("POST", "/auth/register", { name: "Test User", phone: "0911111111", email, password: "password123", city: "Damascus" });
  check("POST /auth/register (USER)", r.status, 201);
  const userToken = r.data?.data?.token;

  // Register REVIEWER
  r = await req("POST", "/auth/register", { name: "Test Reviewer", phone: "0922222222", email: reviewerEmail, password: "password123", city: "Aleppo", role: "REVIEWER" });
  check("POST /auth/register (REVIEWER)", r.status, 201);
  const reviewerToken = r.data?.data?.token;

  // Register ADMIN
  r = await req("POST", "/auth/register", { name: "Test Admin", phone: "0933333333", email: adminEmail, password: "password123", city: "Homs", role: "ADMIN" });
  check("POST /auth/register (ADMIN)", r.status, 201);
  const adminToken = r.data?.data?.token;

  // Login
  r = await req("POST", "/auth/login", { email, password: "password123" });
  check("POST /auth/login (valid)", r.status, 200);

  r = await req("POST", "/auth/login", { email, password: "wrongpass" });
  check("POST /auth/login (wrong password → 401)", r.status, 401);

  r = await req("POST", "/auth/register", { name: "Valid Name", email, password: "password123", city: "Damascus", phone: "0911111111" });
  check("POST /auth/register (duplicate email → 409)", r.status, 409);

  // ── USER: GET /services ────────────────────────────────────
  r = await req("GET", "/services", null, userToken);
  check("GET /services (USER)", r.status, 200);
  const services = r.data?.data || [];

  r = await req("GET", "/services");
  check("GET /services (no auth → 401)", r.status, 401);

  r = await req("GET", "/services", null, reviewerToken);
  check("GET /services (REVIEWER → 403)", r.status, 403);

  // ── REQUESTS (USER) ────────────────────────────────────────
  // Find a service with fields to use
  const svc = services[0];
  let requestId = null;

  if (svc && svc.fields && svc.fields.length > 0) {
    const fieldData = svc.fields.map(f => ({ fieldId: f.id, value: "test value" }));

    r = await req("POST", "/requests", { serviceId: svc.id, data: fieldData }, userToken);
    check("POST /requests (create)", r.status, 201);
    requestId = r.data?.data?.id;

    r = await req("POST", "/requests", {}, userToken);
    check("POST /requests (invalid body → 400)", r.status, 400);
  } else {
    results.push("⚠️  No services with fields found — skipping request creation tests");
    failed++;
  }

  r = await req("GET", "/requests/my", null, userToken);
  check("GET /requests/my (USER)", r.status, 200);

  r = await req("GET", "/requests/my?page=1&limit=5", null, userToken);
  check("GET /requests/my (with pagination)", r.status, 200);

  r = await req("GET", "/requests/my?status=PENDING", null, userToken);
  check("GET /requests/my (filter by status)", r.status, 200);

  r = await req("GET", "/requests/my?status=INVALID", null, userToken);
  check("GET /requests/my (invalid status → 400)", r.status, 400);

  r = await req("GET", "/requests/my");
  check("GET /requests/my (no auth → 401)", r.status, 401);

  if (requestId) {
    r = await req("GET", `/requests/${requestId}`, null, userToken);
    check(`GET /requests/:id (own request)`, r.status, 200);

    r = await req("GET", `/requests/999999`, null, userToken);
    check("GET /requests/:id (not found → 404)", r.status, 404);

    // PATCH (only allowed when NEEDS_INFO — status is PENDING now so expect 409 or similar)
    r = await req("PATCH", `/requests/${requestId}`, { data: [{ fieldId: svc.fields[0].id, value: "updated" }] }, userToken);
    check("PATCH /requests/:id (status=PENDING → 200, allowed)", r.status, 200);
  }

  // ── REVIEWER ───────────────────────────────────────────────
  r = await req("GET", "/reviewer/requests", null, reviewerToken);
  check("GET /reviewer/requests (REVIEWER)", r.status, 200);

  r = await req("GET", "/reviewer/requests?mode=all", null, reviewerToken);
  check("GET /reviewer/requests?mode=all", r.status, 200);

  r = await req("GET", "/reviewer/requests", null, adminToken);
  check("GET /reviewer/requests (ADMIN)", r.status, 200);

  r = await req("GET", "/reviewer/requests");
  check("GET /reviewer/requests (no auth → 401)", r.status, 401);

  r = await req("GET", "/reviewer/requests", null, userToken);
  check("GET /reviewer/requests (USER → 403)", r.status, 403);

  if (requestId) {
    r = await req("PATCH", `/reviewer/requests/${requestId}/status`, { status: "UNDER_REVIEW" }, reviewerToken);
    check("PATCH /reviewer/requests/:id/status → UNDER_REVIEW", r.status, 200);

    r = await req("PATCH", `/reviewer/requests/${requestId}/status`, { status: "REJECTED" }, reviewerToken);
    check("PATCH /reviewer/requests/:id/status (REJECTED without reason → 400)", r.status, 400);

    r = await req("PATCH", `/reviewer/requests/${requestId}/status`, { status: "REJECTED", rejectionReason: "Not enough info" }, reviewerToken);
    check("PATCH /reviewer/requests/:id/status → REJECTED (with reason)", r.status, 200);

    // Now status=REJECTED — set back to NEEDS_INFO to test user PATCH
    r = await req("PATCH", `/reviewer/requests/${requestId}/status`, { status: "NEEDS_INFO" }, reviewerToken);
    check("PATCH /reviewer/requests/:id/status → NEEDS_INFO", r.status, 200);

    // Add reviewer note
    r = await req("POST", `/reviewer/requests/${requestId}/note`, { note: "Please provide property documents" }, reviewerToken);
    check("POST /reviewer/requests/:id/note", r.status, 201);

    r = await req("POST", `/reviewer/requests/${requestId}/note`, {}, reviewerToken);
    check("POST /reviewer/requests/:id/note (empty → 400)", r.status, 400);

    // USER can now PATCH (status=NEEDS_INFO)
    r = await req("PATCH", `/requests/${requestId}`, { data: [{ fieldId: svc.fields[0].id, value: "updated value" }] }, userToken);
    check("PATCH /requests/:id (status=NEEDS_INFO → 200)", r.status, 200);

    // After PATCH, status should be PENDING again
    r = await req("GET", `/requests/${requestId}`, null, userToken);
    const newStatus = r.data?.data?.status;
    const statusReset = newStatus === "PENDING";
    if (statusReset) passed++; else failed++;
    results.push(`${statusReset ? "✅" : "❌"} PATCH /requests/:id resets status to PENDING (got: ${newStatus})`);
  }

  // ── ADMIN: Users ────────────────────────────────────────────
  r = await req("GET", "/admin/users", null, adminToken);
  check("GET /admin/users", r.status, 200);

  r = await req("GET", "/admin/users?search=Test", null, adminToken);
  check("GET /admin/users?search=", r.status, 200);

  r = await req("GET", "/admin/users?role=USER", null, adminToken);
  check("GET /admin/users?role=USER", r.status, 200);

  r = await req("GET", "/admin/users", null, userToken);
  check("GET /admin/users (USER → 403)", r.status, 403);

  const newUserEmail = `newuser_${Date.now()}@example.com`;
  r = await req("POST", "/admin/users", { name: "New User", email: newUserEmail, password: "password123", phone: "0944444444", city: "Latakia", role: "USER" }, adminToken);
  check("POST /admin/users", r.status, 201);
  const newUserId = r.data?.data?.id;

  if (newUserId) {
    r = await req("PATCH", `/admin/users/${newUserId}`, { name: "Updated Name", city: "Tartus" }, adminToken);
    check("PATCH /admin/users/:id", r.status, 200);

    r = await req("DELETE", `/admin/users/${newUserId}`, null, adminToken);
    check("DELETE /admin/users/:id", r.status, 200);

    r = await req("DELETE", `/admin/users/${newUserId}`, null, adminToken);
    check("DELETE /admin/users/:id (already deleted → 404)", r.status, 404);
  }

  // ── ADMIN: Services ────────────────────────────────────────
  r = await req("GET", "/admin/services", null, adminToken);
  check("GET /admin/services", r.status, 200);

  r = await req("POST", "/admin/services", { name: `TestService_${Date.now()}`, description: "Test" }, adminToken);
  check("POST /admin/services", r.status, 201);
  const newSvcId = r.data?.data?.id;

  if (newSvcId) {
    r = await req("PATCH", `/admin/services/${newSvcId}`, { name: `UpdatedService_${Date.now()}` }, adminToken);
    check("PATCH /admin/services/:id", r.status, 200);

    // Add a field first
    r = await req("POST", "/admin/service-fields", { serviceId: newSvcId, fieldName: "testField", fieldType: "text", required: true }, adminToken);
    check("POST /admin/service-fields", r.status, 201);
    const newFieldId = r.data?.data?.id;

    r = await req("GET", `/admin/service-fields?serviceId=${newSvcId}`, null, adminToken);
    check("GET /admin/service-fields?serviceId=", r.status, 200);

    if (newFieldId) {
      r = await req("PATCH", `/admin/service-fields/${newFieldId}`, { required: false }, adminToken);
      check("PATCH /admin/service-fields/:id", r.status, 200);

      r = await req("DELETE", `/admin/service-fields/${newFieldId}`, null, adminToken);
      check("DELETE /admin/service-fields/:id", r.status, 200);
    }

    r = await req("DELETE", `/admin/services/${newSvcId}`, null, adminToken);
    check("DELETE /admin/services/:id", r.status, 200);
  }

  // ── ADMIN: Requests ────────────────────────────────────────
  r = await req("GET", "/admin/requests", null, adminToken);
  check("GET /admin/requests", r.status, 200);

  r = await req("GET", "/admin/requests?status=PENDING", null, adminToken);
  check("GET /admin/requests?status=PENDING", r.status, 200);

  if (requestId) {
    r = await req("GET", `/admin/requests/${requestId}`, null, adminToken);
    check("GET /admin/requests/:id", r.status, 200);

    r = await req("PATCH", `/admin/requests/${requestId}/status`, { status: "APPROVED" }, adminToken);
    check("PATCH /admin/requests/:id/status → APPROVED", r.status, 200);
  }

  r = await req("GET", "/admin/requests/999999", null, adminToken);
  check("GET /admin/requests/:id (not found → 404)", r.status, 404);

  // ── ADMIN: Statistics ──────────────────────────────────────
  r = await req("GET", "/admin/statistics", null, adminToken);
  check("GET /admin/statistics", r.status, 200);

  // DELETE request (USER) — status is APPROVED now so should fail
  if (requestId) {
    r = await req("DELETE", `/requests/${requestId}`, null, userToken);
    check("DELETE /requests/:id (status=APPROVED → 400)", r.status, 400);
  }

  // Create a second request just to test DELETE on PENDING
  if (svc && svc.fields && svc.fields.length > 0) {
    const fieldData2 = svc.fields.map(f => ({ fieldId: f.id, value: "delete test" }));
    r = await req("POST", "/requests", { serviceId: svc.id, data: fieldData2 }, userToken);
    if (r.status === 201) {
      const delId = r.data?.data?.id;
      r = await req("DELETE", `/requests/${delId}`, null, userToken);
      check("DELETE /requests/:id (status=PENDING → 200)", r.status, 200);
    }
  }

  // ── SUMMARY ─────────────────────────────────────────────────
  console.log("\n" + results.join("\n"));
  console.log("\n" + "=".repeat(60));
  console.log(` RESULT: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log("=".repeat(60));

  if (failed > 0) process.exit(1);
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
