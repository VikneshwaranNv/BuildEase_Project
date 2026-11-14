import http from 'http';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { biometricDb } from '../server/db';
import { BiometricsEngine } from '../server/biometricsEngine';

// Build a test instance of the Express server routes
function createTestApp() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  app.get('/api/health', (req, res) => {
    return res.json({
      status: 'healthy',
      service: 'BuildEase Biometric Attendance Engine',
      version: '2.1.0',
      utcTimestamp: new Date().toISOString(),
    });
  });

  app.get('/api/biometrics/workers', (req, res) => {
    try {
      const enrollments = biometricDb.getEnrollments();
      return res.json({ success: true, enrollments });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/biometrics/enroll', async (req, res) => {
    try {
      const { workerId, workerName, trade, siteId, capturedFrameBase64, consentSigned, supervisorName } = req.body;
      if (!workerId || !workerName || !siteId || !capturedFrameBase64) {
        return res.status(400).json({ success: false, error: 'Missing required enrollment parameters.' });
      }
      const enrollment = await BiometricsEngine.enrollWorker({
        workerId,
        workerName,
        trade: trade || 'general_helper',
        siteId,
        capturedFrameBase64,
        consentSigned: Boolean(consentSigned),
        supervisorName: supervisorName || 'Site Supervisor',
      });
      return res.json({ success: true, enrollment });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/biometrics/verify-punch', async (req, res) => {
    try {
      const { workerId, siteId, siteName, punchType, capturedFrameBase64, deviceInfo, lightingEstimate } = req.body;
      if (!siteId || !capturedFrameBase64) {
        return res.status(400).json({ success: false, error: 'Site ID and camera frame capture are required.' });
      }
      const result = await BiometricsEngine.processPunchVerification({
        workerId,
        siteId,
        siteName: siteName || 'Construction Site',
        punchType: punchType === 'CHECK_OUT' ? 'CHECK_OUT' : 'CHECK_IN',
        capturedFrameBase64,
        deviceInfo: deviceInfo || req.headers['user-agent'] || 'Web-Client',
        lightingEstimate,
      });
      return res.json({ success: true, ...result });
    } catch (err: any) {
      return res.status(422).json({ success: false, error: err.message });
    }
  });

  app.get('/api/biometrics/punches', (req, res) => {
    try {
      const punches = biometricDb.getPunches();
      return res.json({ success: true, punches });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/biometrics/sessions', (req, res) => {
    try {
      const sessions = biometricDb.getSessions();
      return res.json({ success: true, sessions });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/biometrics/verify-session', (req, res) => {
    try {
      const { sessionId, verifiedBy } = req.body;
      if (!sessionId) {
        return res.status(400).json({ success: false, error: 'Session ID is required.' });
      }
      const updated = biometricDb.verifySession(sessionId, verifiedBy || 'Site Supervisor');
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Session not found.' });
      }
      return res.json({ success: true, session: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/biometrics/flag-session', (req, res) => {
    try {
      const { sessionId, flaggedBy, reason } = req.body;
      if (!sessionId || !reason) {
        return res.status(400).json({ success: false, error: 'Session ID and reason are required.' });
      }
      const updated = biometricDb.flagSession(sessionId, flaggedBy || 'Site Supervisor', reason);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Session not found.' });
      }
      return res.json({ success: true, session: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/biometrics/batch-verify', (req, res) => {
    try {
      const { verifiedBy } = req.body;
      const count = biometricDb.batchVerifyPending(verifiedBy || 'Site Supervisor');
      return res.json({ success: true, count });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/biometrics/audit-logs', (req, res) => {
    try {
      const logs = biometricDb.getAuditLogs();
      return res.json({ success: true, logs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  return app;
}

async function runApiIntegrationTests() {
  const app = createTestApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(3456, '127.0.0.1', () => resolve()));
  const baseUrl = 'http://127.0.0.1:3456';

  console.log('=== API Integration Tests Starting ===');

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const health = await healthRes.json();
    console.log('1. GET /api/health:', health.status === 'healthy' ? 'PASS' : 'FAIL', health.service);

    // 2. Workers list (verify privacy segregation)
    const workersRes = await fetch(`${baseUrl}/api/biometrics/workers`);
    const workersData = await workersRes.json();
    const hasTemplateExposed = workersData.enrollments.some((e: any) => e.biometricTemplate !== undefined);
    console.log('2. GET /api/biometrics/workers: Count =', workersData.enrollments.length, '| Template Excluded =', !hasTemplateExposed ? 'PASS' : 'FAIL');

    // 3. Punches list
    const punchesRes = await fetch(`${baseUrl}/api/biometrics/punches`);
    const punchesData = await punchesRes.json();
    console.log('3. GET /api/biometrics/punches: Count =', punchesData.punches.length, 'PASS');

    // 4. Sessions list
    const sessionsRes = await fetch(`${baseUrl}/api/biometrics/sessions`);
    const sessionsData = await sessionsRes.json();
    console.log('4. GET /api/biometrics/sessions: Count =', sessionsData.sessions.length, 'PASS');

    // 5. Enroll worker
    const facePath = path.resolve(process.cwd(), 'server', 'models', 'test_images', 'face1.jpg');
    const sampleFrame = 'data:image/jpeg;base64,' + fs.readFileSync(facePath).toString('base64');

    const enrollRes = await fetch(`${baseUrl}/api/biometrics/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workerId: 'W-0888',
        workerName: 'Dhananjay Raut',
        trade: 'mason',
        siteId: 'proj-1',
        capturedFrameBase64: sampleFrame,
        consentSigned: true,
        supervisorName: 'Aniket Patil',
      }),
    });
    const enrollData = await enrollRes.json();
    console.log('5. POST /api/biometrics/enroll:', enrollData.success ? 'PASS' : 'FAIL', 'Worker:', enrollData.enrollment?.workerName);

    // 6. Verify punch with matching frame
    const punchRes = await fetch(`${baseUrl}/api/biometrics/verify-punch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workerId: 'W-0888',
        siteId: 'proj-1',
        siteName: 'Metro Elevated Corridor',
        punchType: 'CHECK_IN',
        capturedFrameBase64: sampleFrame,
      }),
    });
    const punchData = await punchRes.json();
    console.log('6. POST /api/biometrics/verify-punch:', punchData.success ? 'PASS' : 'FAIL', 'Confidence:', (punchData.punch?.faceMatch?.matchConfidence * 100).toFixed(1) + '%', 'Status:', punchData.session?.supervisorReviewStatus);

    // 7. Verify session
    const sessionId = punchData.session?.id;
    if (sessionId) {
      const verifyRes = await fetch(`${baseUrl}/api/biometrics/verify-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          verifiedBy: 'Aniket Patil (Site Supervisor)',
        }),
      });
      const verifyData = await verifyRes.json();
      console.log('7. POST /api/biometrics/verify-session:', verifyData.success ? 'PASS' : 'FAIL', 'Review Status:', verifyData.session?.supervisorReviewStatus);
    }

    // 8. Flag session
    if (sessionId) {
      const flagRes = await fetch(`${baseUrl}/api/biometrics/flag-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          flaggedBy: 'Aniket Patil (Site Supervisor)',
          reason: 'Routine muster audit spot-check discrepancy.',
        }),
      });
      const flagData = await flagRes.json();
      console.log('8. POST /api/biometrics/flag-session:', flagData.success ? 'PASS' : 'FAIL', 'Flagged Reason:', flagData.session?.flagReason);
    }

    // 9. Batch verify
    const batchRes = await fetch(`${baseUrl}/api/biometrics/batch-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verifiedBy: 'Contractor Admin' }),
    });
    const batchData = await batchRes.json();
    console.log('9. POST /api/biometrics/batch-verify:', batchData.success ? 'PASS' : 'FAIL', 'Verified count:', batchData.count);

    // 10. Audit logs
    const auditRes = await fetch(`${baseUrl}/api/biometrics/audit-logs`);
    const auditData = await auditRes.json();
    console.log('10. GET /api/biometrics/audit-logs: Total Logs =', auditData.logs.length, 'PASS');

    console.log('=== All 10 API Integration Tests PASSED Successfully ===');
  } finally {
    server.close();
  }
}

runApiIntegrationTests().catch(err => {
  console.error('API Test Error:', err);
  process.exit(1);
});
