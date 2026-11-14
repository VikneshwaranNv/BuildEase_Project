process.env.BUILDEASE_NO_AUTO_START = 'true';

import http from 'http';
import fs from 'fs';
import path from 'path';
import { biometricDb } from '../server/db';
import { BiometricsEngine } from '../server/biometricsEngine';
import { createApiApp } from '../server';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details: string) {
  if (condition) {
    results.push({ suite, name, passed: true, details });
    console.log(`  [PASS] ${name}: ${details}`);
  } else {
    results.push({ suite, name, passed: false, details: `FAILED: ${details}` });
    console.error(`  [FAIL] ${name}: ${details}`);
  }
}

function fileToDataUrl(filePath: string): string {
  const buf = fs.readFileSync(filePath);
  return 'data:image/jpeg;base64,' + buf.toString('base64');
}

async function runAttendanceToPayrollWorkflowTests() {
  console.log('\n===============================================================');
  console.log(' BUILDEASE PHASE 4 — ATTENDANCE-TO-PAYROLL WORKFLOW VALIDATION ');
  console.log('===============================================================\n');

  const modelsDir = path.resolve(process.cwd(), 'server', 'models');
  const testImagesDir = path.join(modelsDir, 'test_images');
  const face1DataUrl = fileToDataUrl(path.join(testImagesDir, 'face1.jpg'));

  // Ensure clean test worker enrollment
  const testWorkerId = 'W-WORKFLOW-TEST-01';
  try {
    await BiometricsEngine.enrollWorker({
      workerId: testWorkerId,
      workerName: 'Deepak Sharma',
      trade: 'carpenter',
      siteId: 'proj-1',
      capturedFrameBase64: face1DataUrl,
      consentSigned: true,
      supervisorName: 'Aniket Patil (Site Supervisor)',
    });
  } catch {
    // Already enrolled or re-enrolled
  }

  // Spin up test server for integration checks
  const app = createApiApp();
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://localhost:${address.port}`;

  async function apiRequest(endpoint: string, options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {}) {
    const url = `${baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      ...options.headers,
    };
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  // -------------------------------------------------------------------------
  // SECTION 1: SERVER-GENERATED UTC TIMESTAMPS
  // -------------------------------------------------------------------------
  console.log('--- 1. SERVER UTC TIMESTAMPS & CLOCK AUTHORITY ---');

  const beforePunchTime = new Date().getTime();
  const punchRes = await BiometricsEngine.processPunchVerification({
    workerId: testWorkerId,
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    punchType: 'CHECK_IN',
    capturedFrameBase64: face1DataUrl,
  });
  const afterPunchTime = new Date().getTime();

  const utcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  assert(
    utcRegex.test(punchRes.punch.serverUtcTimestamp),
    'ServerTimestamps',
    'ISO 8601 UTC Format',
    `Timestamp [${punchRes.punch.serverUtcTimestamp}] is strict ISO 8601 UTC string`
  );

  const punchTimeMs = new Date(punchRes.punch.serverUtcTimestamp).getTime();
  assert(
    punchTimeMs >= beforePunchTime - 1000 && punchTimeMs <= afterPunchTime + 1000,
    'ServerTimestamps',
    'Server-Generated Temporal Bounds',
    `Punch timestamp is within server execution window (${beforePunchTime} <= ${punchTimeMs} <= ${afterPunchTime})`
  );

  assert(
    typeof punchRes.punch.siteLocalDisplayTime === 'string' && punchRes.punch.siteLocalDisplayTime.length > 0,
    'ServerTimestamps',
    'Site Local Display String',
    `Display time formatted for site locality: ${punchRes.punch.siteLocalDisplayTime}`
  );

  // -------------------------------------------------------------------------
  // SECTION 2: DUPLICATE PUNCH PROTECTION (< 5 MIN)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. DUPLICATE PUNCH PROTECTION (< 5 MIN) ---');

  try {
    await BiometricsEngine.processPunchVerification({
      workerId: testWorkerId,
      siteId: 'proj-1',
      siteName: 'Metro Elevated Corridor',
      punchType: 'CHECK_IN',
      capturedFrameBase64: face1DataUrl,
    });
    assert(false, 'DuplicateProtection', 'Immediate Duplicate Blocked', 'Should have thrown DUPLICATE_PUNCH');
  } catch (err: any) {
    assert(
      err.message.includes('DUPLICATE_PUNCH'),
      'DuplicateProtection',
      'Immediate Duplicate Blocked',
      `Safely rejected rapid duplicate punch: ${err.message}`
    );
  }

  // -------------------------------------------------------------------------
  // SECTION 3: RAW PUNCH SUPERVISOR REVIEW REQUIREMENT
  // -------------------------------------------------------------------------
  console.log('\n--- 3. RAW PUNCH SUPERVISOR REVIEW REQUIREMENT ---');

  assert(
    punchRes.session.supervisorReviewStatus === 'pending_review',
    'SupervisorReview',
    'Pending Review Initial State',
    `Newly created session is [${punchRes.session.supervisorReviewStatus}], NOT auto-verified for payroll`
  );

  assert(
    punchRes.session.sessionStatus === 'open',
    'SupervisorReview',
    'Open Session Status',
    `Session status is [${punchRes.session.sessionStatus}] awaiting completion & supervisor review`
  );

  // -------------------------------------------------------------------------
  // SECTION 4: STATE TRANSITION ANOMALIES (ORPHAN CHECK-OUT & DOUBLE CHECK-IN)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. ATTENDANCE ANOMALIES & STATE TRANSITIONS ---');

  // Test Orphan CHECK_OUT: worker with no open session
  const orphanWorkerId = 'W-ORPHAN-01';
  try {
    await BiometricsEngine.enrollWorker({
      workerId: orphanWorkerId,
      workerName: 'Sanjay Rawat',
      trade: 'electrician',
      siteId: 'proj-1',
      capturedFrameBase64: face1DataUrl,
      consentSigned: true,
      supervisorName: 'Aniket Patil',
    });
  } catch {
    // Already enrolled
  }

  // Orphan CHECK_OUT
  const orphanRes = await BiometricsEngine.processPunchVerification({
    workerId: orphanWorkerId,
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    punchType: 'CHECK_OUT',
    capturedFrameBase64: face1DataUrl,
  });

  assert(
    orphanRes.session.sessionStatus === 'flagged',
    'StateAnomalies',
    'Orphan CHECK_OUT Flagged',
    `Orphan check-out session flagged: ${orphanRes.session.sessionStatus}`
  );

  assert(
    orphanRes.session.supervisorReviewStatus === 'disputed',
    'StateAnomalies',
    'Orphan CHECK_OUT Disputed Status',
    `Supervisor review status is disputed: ${orphanRes.session.supervisorReviewStatus}`
  );

  assert(
    orphanRes.session.flagReason?.includes('ORPHAN_CHECK_OUT') === true,
    'StateAnomalies',
    'Orphan Reason Documented',
    `Audit reason: ${orphanRes.session.flagReason}`
  );

  // -------------------------------------------------------------------------
  // SECTION 5: RBAC & CROSS-SITE ACCESS CONTROL
  // -------------------------------------------------------------------------
  console.log('\n--- 5. RBAC & CROSS-SITE SECURITY CONTROLS ---');

  // 5.1 Worker cannot verify sessions
  const workerVerify = await apiRequest('/api/biometrics/verify-session', {
    method: 'POST',
    headers: { 'x-buildease-role': 'worker', 'x-buildease-user-id': testWorkerId },
    body: { sessionId: punchRes.session.id },
  });
  assert(
    workerVerify.status === 403,
    'RBAC',
    'Worker Blocked From Verifying Session',
    `Worker received HTTP 403 Forbidden: ${workerVerify.data?.error || ''}`
  );

  // 5.2 Worker cannot flag sessions
  const workerFlag = await apiRequest('/api/biometrics/flag-session', {
    method: 'POST',
    headers: { 'x-buildease-role': 'worker', 'x-buildease-user-id': testWorkerId },
    body: { sessionId: punchRes.session.id, reason: 'Unauthorized test' },
  });
  assert(
    workerFlag.status === 403,
    'RBAC',
    'Worker Blocked From Flagging Session',
    `Worker received HTTP 403 Forbidden: ${workerFlag.data?.error || ''}`
  );

  // 5.3 Worker cannot batch-verify
  const workerBatch = await apiRequest('/api/biometrics/batch-verify', {
    method: 'POST',
    headers: { 'x-buildease-role': 'worker', 'x-buildease-user-id': testWorkerId },
    body: { siteId: 'proj-1' },
  });
  assert(
    workerBatch.status === 403,
    'RBAC',
    'Worker Blocked From Batch Verification',
    `Worker received HTTP 403 Forbidden: ${workerBatch.data?.error || ''}`
  );

  // 5.4 Cross-site barrier: Supervisor assigned to proj-2 cannot verify proj-1 session
  const crossSiteVerify = await apiRequest('/api/biometrics/verify-session', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'site_supervisor',
      'x-buildease-user-id': 'SUP-VIKRAM-02',
      'x-buildease-site-id': 'proj-2',
      'x-buildease-user-name': 'Vikram Joshi',
    },
    body: { sessionId: punchRes.session.id },
  });
  assert(
    crossSiteVerify.status === 403,
    'CrossSite',
    'Cross-Site Verification Blocked',
    `Supervisor on proj-2 blocked from verifying proj-1 session: ${crossSiteVerify.data?.error || ''}`
  );

  // 5.5 Cross-site barrier: Supervisor assigned to proj-2 cannot enroll on proj-1
  const crossSiteEnroll = await apiRequest('/api/biometrics/enroll', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'site_supervisor',
      'x-buildease-user-id': 'SUP-VIKRAM-02',
      'x-buildease-site-id': 'proj-2',
      'x-buildease-user-name': 'Vikram Joshi',
    },
    body: {
      workerId: 'W-CROSS-SITE-99',
      workerName: 'Unauthorized Worker',
      trade: 'welder',
      siteId: 'proj-1', // Target site differs from supervisor site
      capturedFrameBase64: face1DataUrl,
      consentSigned: true,
    },
  });
  assert(
    crossSiteEnroll.status === 403,
    'CrossSite',
    'Cross-Site Worker Enrollment Blocked',
    `Supervisor on proj-2 blocked from enrolling worker on proj-1: ${crossSiteEnroll.data?.error || ''}`
  );

  // -------------------------------------------------------------------------
  // SECTION 6: PAYROLL ISOLATION & MUSTER RECONCILIATION
  // -------------------------------------------------------------------------
  console.log('\n--- 6. PAYROLL ISOLATION & MUSTER RECONCILIATION ---');

  // Baseline payroll query: unverified sessions must not count in verified hours
  const musterBefore = await apiRequest('/api/payroll/verified-muster', {
    headers: { 'x-buildease-role': 'contractor', 'x-buildease-user-id': 'ADMIN-01' },
  });
  assert(
    musterBefore.status === 200,
    'PayrollIsolation',
    'Payroll Muster Endpoint Accessible',
    `Muster retrieved successfully`
  );

  const initialVerifiedHours = musterBefore.data.payrollReconciliation.verifiedHours;
  const initialExcludedHours = musterBefore.data.payrollReconciliation.excludedHours;

  assert(
    musterBefore.data.payrollReconciliation.excludedUnverifiedSessionsCount > 0,
    'PayrollIsolation',
    'Unverified Sessions Excluded Count > 0',
    `Unverified sessions strictly tracked in excluded count (${musterBefore.data.payrollReconciliation.excludedUnverifiedSessionsCount})`
  );

  // Authorized supervisor of proj-1 verifies the session
  const authSupervisorVerify = await apiRequest('/api/biometrics/verify-session', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'site_supervisor',
      'x-buildease-user-id': 'SUP-ANIKET-01',
      'x-buildease-site-id': 'proj-1',
      'x-buildease-user-name': 'Aniket Patil',
    },
    body: { sessionId: punchRes.session.id },
  });

  assert(
    authSupervisorVerify.status === 200,
    'SupervisorVerification',
    'Authorized Supervisor Verified Session',
    `Session verified: ${authSupervisorVerify.data?.session?.supervisorReviewStatus}`
  );

  // Query payroll muster again: verified hours must have increased, excluded hours decreased
  const musterAfter = await apiRequest('/api/payroll/verified-muster', {
    headers: { 'x-buildease-role': 'contractor', 'x-buildease-user-id': 'ADMIN-01' },
  });

  const verifiedHoursDelta = musterAfter.data.payrollReconciliation.verifiedHours - initialVerifiedHours;
  assert(
    verifiedHoursDelta === punchRes.session.hoursWorked,
    'PayrollIsolation',
    'Verified Hours Transferred to Payroll',
    `Verified hours increased by exactly session hours (${punchRes.session.hoursWorked} hrs)`
  );

  // -------------------------------------------------------------------------
  // SECTION 7: AUDITABLE MANUAL ATTENDANCE REQUEST & AUDIT TRAIL
  // -------------------------------------------------------------------------
  console.log('\n--- 7. ACCESSIBLE MANUAL ATTENDANCE REQUEST & AUDIT TRAIL ---');

  const manualReq = await apiRequest('/api/biometrics/manual-request', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'worker',
      'x-buildease-user-id': testWorkerId,
      'x-buildease-user-name': 'Deepak Sharma',
    },
    body: {
      siteId: 'proj-1',
      siteName: 'Metro Elevated Corridor',
      punchType: 'CHECK_IN',
      reason: 'Temporary eye irritation prevents clear camera alignment',
      notes: 'Supervisor verified worker presence in morning muster',
    },
  });

  assert(
    manualReq.status === 200,
    'ManualRequest',
    'Manual Request Created',
    `Manual request submitted with ID: ${manualReq.data?.punch?.id}`
  );

  assert(
    manualReq.data?.punch?.verificationMethod === 'MANUAL_SUPERVISOR_REQUEST',
    'ManualRequest',
    'Manual Verification Method Tagged',
    `Verification method tagged: ${manualReq.data?.punch?.verificationMethod}`
  );

  assert(
    manualReq.data?.session?.supervisorReviewStatus === 'pending_review',
    'ManualRequest',
    'Manual Session Requires Review',
    `Manual session requires supervisor review before payroll approval`
  );

  // Check audit logs
  const auditLogsRes = await apiRequest('/api/biometrics/audit-logs', {
    headers: { 'x-buildease-role': 'site_supervisor', 'x-buildease-user-id': 'SUP-ANIKET-01' },
  });

  assert(
    auditLogsRes.status === 200,
    'AuditTrail',
    'Audit Logs Accessible',
    `Audit logs count: ${auditLogsRes.data?.logs?.length}`
  );

  const manualAuditLog = auditLogsRes.data?.logs?.find((l: any) => l.action === 'MANUAL_ATTENDANCE_REQUESTED');
  assert(
    Boolean(manualAuditLog),
    'AuditTrail',
    'Manual Request In Audit Trail',
    `Found MANUAL_ATTENDANCE_REQUESTED in immutable log: ${manualAuditLog?.id}`
  );

  // Clean close server
  server.close();

  // Print summary
  console.log('\n===============================================================');
  console.log('       WORKFLOW & PAYROLL AUDIT SUMMARY                        ');
  console.log('===============================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`TOTAL AUDIT CHECKS: ${total}`);
  console.log(`PASSED:             ${passed}`);
  console.log(`FAILED:             ${failed}`);
  console.log(`SUCCESS RATE:       ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

runAttendanceToPayrollWorkflowTests().catch((err) => {
  console.error('[WorkflowTest] Unexpected test harness crash:', err);
  process.exitCode = 1;
});
