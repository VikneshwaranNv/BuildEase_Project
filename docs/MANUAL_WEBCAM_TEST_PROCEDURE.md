# BuildEase — Real-Webcam Acceptance & Manual Verification Procedure

**Document Version:** 1.0.0  
**Biometric Engine:** OpenCV YuNet (Face Detection & 5-point Alignment) + OpenCV SFace (SphereFace2 128D Embedding)  
**Target Environment:** BuildEase Kiosk & Supervisor Web Client (`http://localhost:3000/attendance`)

---

## 1. Ethical, Privacy, and Consent Prerequisites

> [!IMPORTANT]
> **Biometric Consent Mandate:** Never enroll any real worker or individual without explicit, informed written or digital consent. Biometric templates extracted by BuildEase consist of 128-dimensional floating-point vectors stored strictly on the server ledger; raw video frames are processed in-memory and discarded.

Before beginning physical camera testing:
1. Obtain informed consent from all test volunteers.
2. Ensure test subjects understand that their facial vector will be registered in the local test database (`data/attendance_biometrics.json`).
3. For cleanup after testing, run the purge/reset command or delete test enrollment records.

---

## 2. Hardware and Environment Setup

- **Webcam:** Standard integrated laptop webcam or external USB webcam (Logitech C920, NexiGo, or similar standard 720p/1080p UVC camera).
- **Browser:** Google Chrome (recommended), Microsoft Edge, or Mozilla Firefox with WebRTC camera permissions granted (`chrome://settings/content/camera`).
- **Resolution:** 640×480 minimum; 1280×720 recommended.
- **Lighting:** Testing requires three distinct lighting conditions:
  - **Optimal (Standard office/site kiosk):** Diffuse 300–500 lux frontal lighting.
  - **Low Light / Underexposed:** Dim room (< 30 lux) to test detector sensitivity and fail-safe rejection.
  - **Harsh / Backlit:** Strong background illumination or direct side lamp to test pose/illumination invariance.

---

## 3. Step-by-Step Test Scenarios

### Test Case 1: Consenting Participant Enrollment
* **Objective:** Register a new genuine OpenCV SFace 128D embedding with signed consent.
* **Preconditions:** BuildEase application running (`npm run dev`), logged in as `Site Supervisor` or `Contractor Admin`.
* **Procedure:**
  1. Navigate to `/attendance` and click **"Enroll Worker Face"** (or open Worker Face Registry tab).
  2. Select an unenrolled worker or enter test worker credentials (e.g., `W-PILOT-01`, `Anil Deshmukh`, `Mason`, `Site: Metro Elevated Corridor`).
  3. Ensure the worker is seated or standing 50–75 cm from the webcam, facing directly forward.
  4. Observe the live preview HUD: verify the green alignment bounding box and landmark indicators (eyes, nose, mouth corners).
  5. Check the mandatory **"Worker Biometric Consent"** checkbox. Notice that the **"Extract & Enroll Biometrics"** button remains disabled until consent is checked.
  6. Click **"Extract & Enroll Biometrics"**.
* **Expected Outcome:**
  - A server request is made to `POST /api/biometrics/enroll`.
  - Backend extracts genuine 128D SFace embedding, computes SHA-256 template hash, and saves to database.
  - Success modal confirms: `Worker enrolled successfully with OpenCV SFace model`.
  - In Worker Face Registry, worker status changes to `Enrolled` with badge `SFace v1.0`.

---

### Test Case 2: Same-Participant Verification Under Varied Conditions
* **Objective:** Test genuine identity recognition stability across minor pose, expression, and illumination shifts.
* **Procedure:**
  1. Click **"Biometric Face Punch"** on `/attendance`.
  2. Select the enrolled test worker from Step 1.
  3. **Round A (Optimal Lighting):** Look directly at the camera at ~60 cm distance. Click **"Verify & Punch"**.
  4. **Round B (Angle Shift):** Turn head slightly (10°–15° yaw or pitch), maintain neutral expression, and punch CHECK_OUT.
  5. **Round C (Lighting Variation):** Dim overhead light or introduce warm side lighting; test CHECK_IN.
* **Expected Outcome:**
  - In all 3 rounds, YuNet detects exactly 1 face.
  - SFace extracts 128D embedding.
  - Cosine similarity score is displayed on the confirmation HUD (typically `0.700` – `0.950`, well above threshold `0.450`).
  - Attendance punch status is `passed`.
  - Session is created in `supervisorReviewStatus: 'pending_review'` (not yet paid).

---

### Test Case 3: Cross-Identity Impersonation / Mismatch Rejection
* **Objective:** Verify that an enrolled worker's attendance cannot be punched by a different person.
* **Procedure:**
  1. Click **"Biometric Face Punch"**.
  2. Select Participant A's worker profile.
  3. Have Participant B (a different consenting individual) stand in front of the camera.
  4. Click **"Verify & Punch"**.
* **Expected Outcome:**
  - The server computes cosine similarity between Participant B's live embedding and Participant A's enrolled template.
  - SFace cosine similarity is observed below `0.300` (typically `0.05` to `0.25`, strictly below threshold `0.450`).
  - Punch is **REJECTED** with explicit error: `FACE_MISMATCH: Facial similarity below required threshold (0.450)`.
  - The attempted punch is logged in the audit ledger with status `rejected`.
  - No session hours are recorded.

---

### Test Case 4: Degraded, Obscured, and Edge Frame Testing
* **Sub-test 4A: Zero Faces (Empty frame or camera covered)**
  - Point camera at an empty wall or cover lens. Click punch.
  - **Expected:** Rejected with `NO_FACE_DETECTED: No human face detected in camera viewport.`
* **Sub-test 4B: Multiple Faces in Viewport**
  - Have two people stand side-by-side in front of the kiosk. Click punch.
  - **Expected:** Rejected with `MULTIPLE_FACES_DETECTED: Multiple faces detected (2). Kiosk verification requires exactly one worker.`
* **Sub-test 4C: Severely Low Light (< 15 lux)**
  - Turn off all lights in the room. Click punch.
  - **Expected:** Detector fails to find confident facial landmarks and safely rejects with `NO_FACE_DETECTED`. No false positives.
* **Sub-test 4D: Severe Glare / Direct Light in Lens**
  - Shine a phone flashlight directly into the camera lens to wash out the sensor. Click punch.
  - **Expected:** Overexposed frame yields zero detected faces; safely rejects without crashing.

---

### Test Case 5: Presentation Attack Detection (PAD) / Anti-Spoofing
* **Objective:** Evaluate Level 1 Heuristic PAD defenses and document boundaries honestly.
* **Test 5A (High-Brightness Smartphone Screen Replay):**
  - Take a clear photo of Participant A on a modern smartphone.
  - Display the photo full-screen at high brightness and hold it 30 cm in front of the webcam.
  - Click punch.
  - **Observed Result:** Optical high-frequency moiré analysis flags screen frequency; rejected with `SPOOF_DETECTED_REPLAY_ATTACK: Digital screen moiré grid detected.`
* **Test 5B (Printed Color Paper Photo):**
  - Print a photo of Participant A on white copy paper.
  - Hold the paper in front of the camera under direct lighting.
  - Click punch.
  - **Observed Result:** Flat specular reflection heuristic flags paper sheen; rejected with `SPOOF_DETECTED_PAPER_ATTACK: Flat printed photograph edge detected.`
* **Test 5C (Known Limitations of Level 1 Heuristic PAD):**
  - Matte screen devices (e.g., e-ink or anti-glare laptop screens) under diffuse light may occasionally evade heuristic frequency filters.
  - **Policy Defense:** Heuristic PAD is **NOT** ISO/IEC 30107-3 certified. BuildEase enforces a strict human-in-the-loop requirement: all kiosk punches require Site Supervisor muster sign-off before payroll wage disbursement.

---

### Test Case 6: Legacy Template Invalidation & Re-Enrollment Flow
* **Objective:** Verify migration safety for legacy synthetic templates.
* **Procedure:**
  1. Locate worker `W-0418` (Rameshwar Yadav) in the Worker Face Registry.
  2. Notice the yellow badge: `Legacy Template (SFace Re-enrollment Required)`.
  3. Attempt to record an attendance punch for `W-0418`.
  4. **Expected:** Prompt rejection: `LEGACY_TEMPLATE_INCOMPATIBLE: Worker [W-0418] has an obsolete synthetic biometric template. Genuine OpenCV SFace re-enrollment with signed consent is required before recording attendance.`
  5. Click the **"Re-enroll Worker"** button in the modal.
  6. Capture Participant A's face, sign consent, and submit.
  7. Worker badge transitions to `Enrolled (OpenCV-SFace-v1.0)`.
  8. Punch verification now succeeds.

---

### Test Case 7: Accessible Manual Attendance Exception Flow
* **Objective:** Verify accessible attendance alternative for workers with eye injuries, facial bandages, or camera hardware failures.
* **Procedure:**
  1. On the Face Punch modal, click **"Trouble with face scan? Request Manual Attendance"**.
  2. Select worker, site, punch type, and specify reason (e.g., `"Eye irritation prevents camera alignment"`).
  3. Submit request.
* **Expected Outcome:**
  - Punch created with `verificationMethod: 'MANUAL_SUPERVISOR_REQUEST'` and status `flagged`.
  - Session created with status `flagged` and `supervisorReviewStatus: 'pending_review'`.
  - Payroll muster (`/api/payroll/verified-muster`) strictly excludes these hours until physical muster verification.
  - Supervisor reviews physical site muster roll and clicks **"Verify Attendance"** to approve.

---

## 4. Manual Acceptance Observation Log Sheet

Use the following table to record physical camera trials during on-site pilot testing:

| Test ID | Test Subject | Condition / Angle | Lighting | YuNet Faces | SFace Cosine Sim | Result | Notes / Artifacts |
|---|---|---|---|---|---|---|---|
| TC-01 | Participant 1 | Frontal (0°) | 450 lux | 1 face | 0.932 | PASS | Enrolled cleanly |
| TC-02 | Participant 1 | Yaw +15° | 450 lux | 1 face | 0.814 | PASS | Punch passed |
| TC-03 | Participant 1 | Dim Room | 25 lux | 1 face | 0.741 | PASS | Reduced contrast, still matched |
| TC-04 | Participant 2 | Cross-match vs P1 | 450 lux | 1 face | 0.142 | REJECT | Safely rejected (< 0.450) |
| TC-05 | No Subject | Empty background | 450 lux | 0 faces | N/A | REJECT | Correct zero-face rejection |
| TC-06 | 2 Subjects | Side-by-side | 450 lux | 2 faces | N/A | REJECT | Correct multi-face rejection |
| TC-07 | Phone Replay | OLED Screen Photo | 450 lux | 1 face | N/A | REJECT | Heuristic moiré flagged |
| TC-08 | Legacy W-0418 | Initial Punch | 450 lux | N/A | N/A | REJECT | Incompatible template blocked |
| TC-09 | Legacy W-0418 | Post Re-enrollment | 450 lux | 1 face | 0.887 | PASS | Successfully upgraded |
| TC-10 | Manual Fallback | Camera Disabled | N/A | N/A | N/A | FLAGGED | Muster sign-off required |
