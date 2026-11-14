# -*- coding: utf-8 -*-
"""Preliminary sections for BuildEase Design Thinking Report."""

def get_preliminaries_html():
    return """
<!-- ==================== COVER / TITLE PAGE ==================== -->
<div class="page cover-page" style="text-align: center; padding-top: 40px;">
  <p style="font-size: 14pt; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
    KONGU ENGINEERING COLLEGE
  </p>
  <p style="font-size: 11pt; font-weight: normal; margin: 2px 0 0 0; font-style: italic;">
    (Autonomous)
  </p>
  <p style="font-size: 12pt; font-weight: bold; margin: 2px 0 0 0;">
    PERUNDURAI, ERODE &ndash; 638 060
  </p>
  
  <div style="margin: 35px 0 25px 0;">
    <div style="width: 90px; height: 90px; margin: 0 auto; border: 2px solid #1b365d; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f8fafc;">
      <span style="font-size: 13pt; font-weight: bold; color: #1b365d;">KEC</span>
    </div>
  </div>

  <p style="font-size: 11pt; letter-spacing: 3px; font-weight: bold; color: #475569; margin: 0 0 15px 0;">
    DEPARTMENT OF INFORMATION TECHNOLOGY
  </p>

  <hr style="border: 0; border-top: 1.5px solid #1b365d; width: 80%; margin: 0 auto 25px auto;" />

  <h1 style="font-size: 18pt; font-weight: bold; line-height: 1.4; color: #0f172a; margin: 0 0 15px 0; text-transform: uppercase;">
    BUILDEASE &ndash; A TRANSPARENT WORKFORCE MANAGEMENT SOLUTION FOR CONSTRUCTION SITES
  </h1>

  <p style="font-size: 13pt; font-weight: bold; color: #b45309; letter-spacing: 2px; margin: 0 0 30px 0;">
    DESIGN THINKING REPORT
  </p>

  <p style="font-size: 11pt; font-style: italic; line-height: 1.6; max-width: 520px; margin: 0 auto 30px auto;">
    Submitted in partial fulfillment of the requirements for the award of the degree of<br />
    <strong>BACHELOR OF TECHNOLOGY</strong><br />
    in<br />
    <strong>INFORMATION TECHNOLOGY</strong>
  </p>

  <div style="margin: 25px 0; font-size: 11pt; line-height: 1.8;">
    <p style="font-weight: bold; text-decoration: underline; margin-bottom: 8px;">Submitted by:</p>
    <table style="width: 70%; margin: 0 auto; border: none; font-size: 11pt;">
      <tr style="border: none;"><td style="border: none; text-align: left; font-weight: bold; padding: 2px 8px;">VIKNESHWARAN N</td><td style="border: none; text-align: right; padding: 2px 8px;">(Reg. No: 25ITR173)</td></tr>
      <tr style="border: none;"><td style="border: none; text-align: left; font-weight: bold; padding: 2px 8px;">SUSHMITHA T</td><td style="border: none; text-align: right; padding: 2px 8px;">(Reg. No: 25ITR150)</td></tr>
      <tr style="border: none;"><td style="border: none; text-align: left; font-weight: bold; padding: 2px 8px;">SASTITHARAN C</td><td style="border: none; text-align: right; padding: 2px 8px;">(Reg. No: 25ITR132)</td></tr>
      <tr style="border: none;"><td style="border: none; text-align: left; font-weight: bold; padding: 2px 8px;">SURIYA K</td><td style="border: none; text-align: right; padding: 2px 8px;">(Reg. No: 25ITR147)</td></tr>
    </table>
  </div>

  <div style="margin-top: 30px; font-size: 11pt; line-height: 1.6;">
    <p style="font-weight: bold; text-decoration: underline; margin-bottom: 4px;">Under the Guidance of:</p>
    <p style="font-weight: bold; margin: 0;">Ms. T. S. VISHNU PRIYA M.E.</p>
    <p style="margin: 0; font-size: 10.5pt; color: #334155;">Assistant Professor, Department of Information Technology</p>
  </div>

  <div style="margin-top: 45px; font-size: 11pt; font-weight: bold;">
    NOVEMBER 2026
  </div>
</div>

<div class="page-break"></div>

<!-- ==================== BONAFIDE CERTIFICATE ==================== -->
<div class="page" style="padding-top: 20px;">
  <p style="text-align: center; font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">
    KONGU ENGINEERING COLLEGE, PERUNDURAI, ERODE &ndash; 638 060
  </p>
  <p style="text-align: center; font-size: 11pt; font-style: italic; margin: 2px 0 20px 0;">
    (Autonomous Institution Affiliated to Anna University, Chennai)
  </p>

  <p style="text-align: center; font-size: 12pt; font-weight: bold; text-decoration: underline; margin-bottom: 30px;">
    DEPARTMENT OF INFORMATION TECHNOLOGY
  </p>

  <h2 style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 30px; letter-spacing: 1px;">
    BONAFIDE CERTIFICATE
  </h2>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    This is to certify that the Design Thinking Project Report entitled 
    <strong>&ldquo;BUILDEASE &ndash; A TRANSPARENT WORKFORCE MANAGEMENT SOLUTION FOR CONSTRUCTION SITES&rdquo;</strong> 
    is the bonafide work carried out by 
    <strong>VIKNESHWARAN N (Reg. No: 25ITR173)</strong>, 
    <strong>SUSHMITHA T (Reg. No: 25ITR150)</strong>, 
    <strong>SASTITHARAN C (Reg. No: 25ITR132)</strong>, and 
    <strong>SURIYA K (Reg. No: 25ITR147)</strong> 
    in partial fulfillment of the requirements for the course 
    <strong>24ITL32 &ndash; DESIGN THINKING LABORATORY</strong> 
    of the Bachelor of Technology in Information Technology degree at Kongu Engineering College (Autonomous), Perundurai, Erode during the academic year 2026&ndash;2027.
  </p>

  <div style="margin-top: 100px;">
    <table style="width: 100%; border: none;">
      <tr style="border: none;">
        <td style="border: none; text-align: left; width: 50%; vertical-align: top;">
          <p style="font-weight: bold; margin: 0;">Ms. T. S. VISHNU PRIYA M.E.</p>
          <p style="margin: 0; font-size: 11pt;">SUPERVISOR / FACULTY GUIDE</p>
          <p style="margin: 0; font-size: 10.5pt; color: #475569;">Assistant Professor</p>
          <p style="margin: 0; font-size: 10.5pt; color: #475569;">Department of Information Technology</p>
          <p style="margin: 0; font-size: 10.5pt; color: #475569;">Kongu Engineering College</p>
        </td>
        <td style="border: none; text-align: right; width: 50%; vertical-align: top;">
          <p style="font-weight: bold; margin: 0;">Dr. R. THANGARAJAN M.E., Ph.D.</p>
          <p style="margin: 0; font-size: 11pt;">HEAD OF THE DEPARTMENT</p>
          <p style="margin: 0; font-size: 10.5pt; color: #475569;">Professor &amp; Head</p>
          <p style="margin: 0; font-size: 10.5pt; color: #475569;">Department of Information Technology</p>
          <p style="margin: 0; font-size: 10.5pt; color: #475569;">Kongu Engineering College</p>
        </td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 70px;">
    <p style="font-size: 11pt; line-height: 1.6;">
      Submitted for the Design Thinking Laboratory Course Examination held on: ___________________
    </p>
    <div style="margin-top: 50px;">
      <table style="width: 100%; border: none;">
        <tr style="border: none;">
          <td style="border: none; text-align: left; width: 50%; font-weight: bold;">
            INTERNAL EXAMINER
          </td>
          <td style="border: none; text-align: right; width: 50%; font-weight: bold;">
            EXTERNAL EXAMINER
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- ==================== DECLARATION ==================== -->
<div class="page" style="padding-top: 20px;">
  <h2 style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 30px; letter-spacing: 1px;">
    DECLARATION
  </h2>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    We hereby declare that the project report entitled 
    <strong>&ldquo;BUILDEASE &ndash; A TRANSPARENT WORKFORCE MANAGEMENT SOLUTION FOR CONSTRUCTION SITES&rdquo;</strong> 
    submitted to <strong>KONGU ENGINEERING COLLEGE (Autonomous)</strong>, Perundurai, Erode in partial fulfillment of the requirements for the award of the Degree of <strong>BACHELOR OF TECHNOLOGY IN INFORMATION TECHNOLOGY</strong> is a record of original design thinking work done by us under the supervision of <strong>Ms. T. S. VISHNU PRIYA M.E.</strong>, Assistant Professor, Department of Information Technology.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    We further declare that this report has not formed the basis for the award of any Degree, Diploma, Associateship, Fellowship, or any other similar title to any candidate of any University or Institution.
  </p>

  <div style="margin-top: 80px;">
    <table style="width: 100%; border: none; font-size: 11pt;">
      <tr style="border: none;">
        <td style="border: none; text-align: left; width: 50%; vertical-align: top;">
          <p style="margin: 0 0 5px 0;"><strong>Place:</strong> Perundurai</p>
          <p style="margin: 0;"><strong>Date:</strong> 13-11-2026</p>
        </td>
        <td style="border: none; text-align: right; width: 50%; vertical-align: top;">
          <p style="margin: 0 0 35px 0;"><strong>Signature of the Candidates:</strong></p>
          <p style="margin: 0 0 25px 0;">1. __________________________________<br /><span style="font-size: 10pt;">(VIKNESHWARAN N - 25ITR173)</span></p>
          <p style="margin: 0 0 25px 0;">2. __________________________________<br /><span style="font-size: 10pt;">(SUSHMITHA T - 25ITR150)</span></p>
          <p style="margin: 0 0 25px 0;">3. __________________________________<br /><span style="font-size: 10pt;">(SASTITHARAN C - 25ITR132)</span></p>
          <p style="margin: 0;">4. __________________________________<br /><span style="font-size: 10pt;">(SURIYA K - 25ITR147)</span></p>
        </td>
      </tr>
    </table>
  </div>
</div>

<div class="page-break"></div>

<!-- ==================== ABSTRACT ==================== -->
<div class="page" style="padding-top: 20px;">
  <h2 style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 25px; letter-spacing: 1px;">
    ABSTRACT
  </h2>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    India&rsquo;s construction industry employs over 74 million unorganized daily-wage workers, representing the second-largest employer in the national economy. Despite rapid digitization across commercial infrastructure, construction sites continue to rely almost exclusively on manual, handwritten paper registers (&ldquo;muster rolls&rdquo;) maintained by site supervisors and petty subcontractors (&ldquo;maistries&rdquo;). This legacy system is severely broken: over 68% of daily-wage laborers report weekly wage disputes, losing an average of ₹1,150 to ₹1,400 monthly due to undocumented hour cuts, misplaced tea advances, and arbitrary attendance deductions. Concurrently, general contractors and developers suffer from an estimated 10% to 14% payroll leakage caused by ghost workers, proxy check-ins, and fabricated headcounts. While biometric fingerprint scanners have been attempted on tier-1 sites, they fail catastrophically in practice&mdash;demonstrating an 84.2% optical failure rate because abrasive cement dust, lime slurry, wet mortar, and heavy handling wear down workers&rsquo; epidermal ridges. Furthermore, 71.8% of daily-wage laborers own basic 2G keypad phones without touchscreen or mobile data capabilities, rendering modern smartphone-first attendance applications exclusionary and ineffective.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    To resolve this multi-faceted socio-technical crisis, <strong>BuildEase</strong> was conceived and developed following a rigorous 5-stage Design Thinking methodology (Empathize, Define, Ideate, Prototype, and Test). Grounded in direct ethnographic field interviews with site masons (such as 42-year-old Senior Mason Murugesan K. in Tiruppur) and site civil foremen, BuildEase reframes workforce management from a top-down surveillance mechanism into a transparent, inclusive, dual-sided ledger of trust. The proposed platform integrates three resilient architectural layers: (1) an edge AI biometric tablet kiosk utilizing lightweight YuNet face detection and SFace neural feature extraction running entirely client-side in under 3 seconds per worker, impervious to dust-covered hands; (2) a telecom-integrated 2G GSM Interactive Voice Response (IVR) missed-call gateway with daily rotating gate PINs, enabling workers with basic keypad feature phones to independently verify check-ins without internet connectivity; and (3) an offline-first Progressive Web Application (PWA) powered by IndexedDB with background optimistic sync, guaranteeing 100% operational uptime in cellular dead zones such as basement excavations and reinforced concrete towers.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    Crucially, BuildEase embeds human-centric fail-safes: optical recognition failures triggered by direct sunlight or medical bandages never automatically deduct wages; instead, shifts are preserved in a supervisor &ldquo;Pending Review&rdquo; queue. The automated payroll calculation engine transparently enforces the statutory wage formula [<em>Wage = (Rate &times; Verified Hours) &minus; Advances</em>], producing instant multi-lingual SMS receipts in 5 regional languages (Hindi, Tamil, Marathi, Bengali, and Assamese) and 1-click NPCI NACH/NEFT automated disbursement batches. BuildEase aligns directly with United Nations Sustainable Development Goals (SDG 8: Decent Work and Economic Growth, SDG 9: Industry, Innovation, and Infrastructure, and SDG 10: Reduced Inequalities), restoring fundamental dignity, trust, and fiscal accuracy to the construction ecosystem.
  </p>
</div>

<div class="page-break"></div>

<!-- ==================== ACKNOWLEDGEMENT ==================== -->
<div class="page" style="padding-top: 20px;">
  <h2 style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 25px; letter-spacing: 1px;">
    ACKNOWLEDGEMENT
  </h2>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    First and foremost, we express our profound gratitude to the <strong>Almighty God</strong> for bestowing upon us the wisdom, health, strength, and perseverance required to successfully complete this Design Thinking laboratory project.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    We express our deep sense of gratitude and sincere thanks to our respected Correspondent, <strong>Thiru. A. K. Ilango</strong>, and the esteemed Management of <strong>Kongu Engineering College</strong> for providing state-of-the-art laboratory facilities, academic resources, and an inspiring research environment.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    We express our heartfelt thanks to our respected Principal, <strong>Dr. V. Balusamy M.E., Ph.D.</strong>, for his continuous encouragement, dynamic administrative support, and steadfast guidance throughout our academic pursuits.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    We register our deepest gratitude to <strong>Dr. R. Thangarajan M.E., Ph.D.</strong>, Professor and Head of the Department of Information Technology, for his insightful advice, valuable suggestions, and constant encouragement throughout the progress of this project.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    We place on record our most sincere and heartfelt gratitude to our respected faculty guide, <strong>Ms. T. S. Vishnu Priya M.E.</strong>, Assistant Professor, Department of Information Technology, for her invaluable guidance, patient mentoring, rigorous critique, and continuous technical support from the inception of the problem definition to the final execution of the prototypes.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    We extend our sincere thanks to all faculty members, technical staff, and laboratory assistants of the Department of Information Technology for their cooperation and timely assistance during the course of our work.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    Our heartfelt gratitude goes to the daily-wage construction workers, masons, bar benders, and site foremen of the <strong>SKS Builders Site, Tiruppur &ndash; Erode region</strong>, especially <strong>Mr. Murugesan K. (42)</strong> and <strong>Mr. Aniket Patil (Site Civil Foreman)</strong>, who generously shared their lived experiences, challenges, and aspirations during our field interviews and observational studies.
  </p>

  <p style="text-align: justify; line-height: 1.8; font-size: 12pt; text-indent: 0.5in;">
    Finally, we owe our deepest gratitude to our beloved <strong>parents and family members</strong> whose endless prayers, unconditional love, sacrifices, and moral support have been the cornerstone of our academic journey and personal endeavors.
  </p>
</div>

<div class="page-break"></div>

<!-- ==================== TABLE OF CONTENTS ==================== -->
<div class="page" style="padding-top: 20px;">
  <h2 style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 25px; letter-spacing: 1px;">
    TABLE OF CONTENTS
  </h2>

  <table style="width: 100%; border: none; font-size: 11pt; line-height: 1.8;">
    <tr style="border-bottom: 1.5px solid #000; font-weight: bold;">
      <td style="border: none; width: 15%; text-align: left;">CHAPTER NO.</td>
      <td style="border: none; width: 70%; text-align: left;">TITLE</td>
      <td style="border: none; width: 15%; text-align: right;">PAGE NO.</td>
    </tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; font-weight: bold;">BONAFIDE CERTIFICATE</td><td style="border: none; text-align: right;">ii</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; font-weight: bold;">DECLARATION</td><td style="border: none; text-align: right;">iii</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; font-weight: bold;">ABSTRACT</td><td style="border: none; text-align: right;">iv</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; font-weight: bold;">ACKNOWLEDGEMENT</td><td style="border: none; text-align: right;">v</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; font-weight: bold;">LIST OF TABLES</td><td style="border: none; text-align: right;">viii</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; font-weight: bold;">LIST OF FIGURES</td><td style="border: none; text-align: right;">ix</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; font-weight: bold;">LIST OF ABBREVIATIONS</td><td style="border: none; text-align: right;">x</td></tr>

    <tr style="border: none;"><td style="border: none; font-weight: bold;">1</td><td style="border: none; font-weight: bold;">INTRODUCTION</td><td style="border: none; text-align: right; font-weight: bold;">1</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">1.1 Introduction</td><td style="border: none; text-align: right;">1</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">1.2 Objective</td><td style="border: none; text-align: right;">2</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">1.3 Scope</td><td style="border: none; text-align: right;">3</td></tr>

    <tr style="border: none;"><td style="border: none; font-weight: bold;">2</td><td style="border: none; font-weight: bold;">PROBLEM DEFINITION</td><td style="border: none; text-align: right; font-weight: bold;">4</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">2.1 Existing System</td><td style="border: none; text-align: right;">4</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">2.2 Problem Statement</td><td style="border: none; text-align: right;">5</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">2.3 Constraints</td><td style="border: none; text-align: right;">6</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">2.4 People Affected</td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">2.5 Design Challenge</td><td style="border: none; text-align: right;">8</td></tr>

    <tr style="border: none;"><td style="border: none; font-weight: bold;">3</td><td style="border: none; font-weight: bold;">REQUIREMENTS AND ESTIMATES</td><td style="border: none; text-align: right; font-weight: bold;">9</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">3.1 Hardware Requirements</td><td style="border: none; text-align: right;">9</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">3.2 Software Requirements</td><td style="border: none; text-align: right;">10</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">3.3 Software Description</td><td style="border: none; text-align: right;">11</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">3.4 Estimates (Time and Cost)</td><td style="border: none; text-align: right;">13</td></tr>

    <tr style="border: none;"><td style="border: none; font-weight: bold;">4</td><td style="border: none; font-weight: bold;">DESIGN THINKING PROCESS</td><td style="border: none; text-align: right; font-weight: bold;">14</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">4.1 Overview of Design Thinking Process</td><td style="border: none; text-align: right;">14</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">4.2 Problem Identification</td><td style="border: none; text-align: right;">16</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">4.3 Explore</td><td style="border: none; text-align: right;">18</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.3.1 STEEP Analysis</td><td style="border: none; text-align: right;">18</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.3.2 Activity System</td><td style="border: none; text-align: right;">22</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.3.3 Stakeholder Analysis</td><td style="border: none; text-align: right;">24</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.3.4 Reframing</td><td style="border: none; text-align: right;">28</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">4.4 Empathize</td><td style="border: none; text-align: right;">30</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.4.1 Empathy Map</td><td style="border: none; text-align: right;">30</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.4.2 Customer Journey Map</td><td style="border: none; text-align: right;">32</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.4.3 Field Interview and Observation</td><td style="border: none; text-align: right;">35</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.4.4 Desktop Research and Survey</td><td style="border: none; text-align: right;">37</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">4.5 Define</td><td style="border: none; text-align: right;">39</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.5.1 SPICE Framework</td><td style="border: none; text-align: right;">39</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.5.2 User Persona</td><td style="border: none; text-align: right;">41</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">4.6 Ideate</td><td style="border: none; text-align: right;">43</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.6.1 Brainstorming and Selection</td><td style="border: none; text-align: right;">43</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none; padding-left: 20px;">4.6.2 Storyboard</td><td style="border: none; text-align: right;">45</td></tr>

    <tr style="border: none;"><td style="border: none; font-weight: bold;">5</td><td style="border: none; font-weight: bold;">PROTOTYPE IMPLEMENTATION</td><td style="border: none; text-align: right; font-weight: bold;">47</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">5.1 Proposed System Architecture &amp; Workflow</td><td style="border: none; text-align: right;">47</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">5.2 Low-Fidelity Prototype</td><td style="border: none; text-align: right;">49</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">5.3 Medium-Fidelity Prototype</td><td style="border: none; text-align: right;">51</td></tr>

    <tr style="border: none;"><td style="border: none; font-weight: bold;">6</td><td style="border: none; font-weight: bold;">RESULTS AND DISCUSSION</td><td style="border: none; text-align: right; font-weight: bold;">55</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">6.1 Outcomes</td><td style="border: none; text-align: right;">55</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">6.2 Success Criteria Assessment</td><td style="border: none; text-align: right;">56</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">6.3 Discussion</td><td style="border: none; text-align: right;">58</td></tr>

    <tr style="border: none;"><td style="border: none; font-weight: bold;">7</td><td style="border: none; font-weight: bold;">CONCLUSION AND FUTURE WORK</td><td style="border: none; text-align: right; font-weight: bold;">60</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">7.1 Conclusion</td><td style="border: none; text-align: right;">60</td></tr>
    <tr style="border: none;"><td style="border: none;"></td><td style="border: none;">7.2 Future Work</td><td style="border: none; text-align: right;">61</td></tr>

    <tr style="border: none;"><td style="border: none; font-weight: bold;"></td><td style="border: none; font-weight: bold;">APPENDIX &ndash; 1: USER INTERVIEW DOCUMENTATION</td><td style="border: none; text-align: right; font-weight: bold;">62</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;"></td><td style="border: none; font-weight: bold;">REFERENCES</td><td style="border: none; text-align: right; font-weight: bold;">64</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;"></td><td style="border: none; font-weight: bold;">MAPPING OF PROJECT GOALS TO SDG</td><td style="border: none; text-align: right; font-weight: bold;">65</td></tr>
  </table>
</div>

<div class="page-break"></div>

<!-- ==================== LIST OF TABLES ==================== -->
<div class="page" style="padding-top: 20px;">
  <h2 style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 25px; letter-spacing: 1px;">
    LIST OF TABLES
  </h2>

  <table style="width: 100%; border: none; font-size: 11pt; line-height: 1.8;">
    <tr style="border-bottom: 1.5px solid #000; font-weight: bold;">
      <td style="border: none; width: 15%; text-align: left;">TABLE NO.</td>
      <td style="border: none; width: 70%; text-align: left;">TITLE</td>
      <td style="border: none; width: 15%; text-align: right;">PAGE NO.</td>
    </tr>
    <tr style="border: none;"><td style="border: none;">Table 3.1</td><td style="border: none;">Hardware Specifications for Edge &amp; Kiosk Nodes</td><td style="border: none; text-align: right;">9</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 3.2</td><td style="border: none;">Software Technology Stack and Dependency Specifications</td><td style="border: none; text-align: right;">10</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 4.1</td><td style="border: none;">Design Thinking Stages, Objectives, and Core Deliverables</td><td style="border: none; text-align: right;">15</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 4.2</td><td style="border: none;">STEEP Factor Categorization and Site Impact Severity</td><td style="border: none; text-align: right;">19</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 4.3</td><td style="border: none;">Activity System Cluster Priorities and Operational Levers</td><td style="border: none; text-align: right;">23</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 4.4</td><td style="border: none;">Empathy Map Synthesis for Primary User (Murugesan K.)</td><td style="border: none; text-align: right;">31</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 4.5</td><td style="border: none;">Worker Journey Map Touchpoints, Emotions, and Failure Modes</td><td style="border: none; text-align: right;">33</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 4.6</td><td style="border: none;">SPICE Framework Dimensions and Architecture Solutions</td><td style="border: none; text-align: right;">40</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 4.7</td><td style="border: none;">User Persona Specification (Senior Mason Murugesan K.)</td><td style="border: none; text-align: right;">42</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 4.8</td><td style="border: none;">SCAMPER Ideation Matrix and Feature Evaluation</td><td style="border: none; text-align: right;">44</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 5.1</td><td style="border: none;">Medium-Fidelity Component Specification and Technology Mapping</td><td style="border: none; text-align: right;">52</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 6.1</td><td style="border: none;">Empirical Field Trial Outcomes and Metric Comparisons</td><td style="border: none; text-align: right;">55</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 6.2</td><td style="border: none;">Success Criteria Verification Matrix</td><td style="border: none; text-align: right;">57</td></tr>
    <tr style="border: none;"><td style="border: none;">Table 6.3</td><td style="border: none;">Benchmarking Analysis: BuildEase vs Legacy Alternatives</td><td style="border: none; text-align: right;">58</td></tr>
    <tr style="border: none;"><td style="border: none;">Table A1.1</td><td style="border: none;">Ethnographic User Interview Transcript (Murugesan K., 42, Mason)</td><td style="border: none; text-align: right;">62</td></tr>
  </table>
</div>

<div class="page-break"></div>

<!-- ==================== LIST OF FIGURES ==================== -->
<div class="page" style="padding-top: 20px;">
  <h2 style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 25px; letter-spacing: 1px;">
    LIST OF FIGURES
  </h2>

  <table style="width: 100%; border: none; font-size: 11pt; line-height: 1.8;">
    <tr style="border-bottom: 1.5px solid #000; font-weight: bold;">
      <td style="border: none; width: 15%; text-align: left;">FIGURE NO.</td>
      <td style="border: none; width: 70%; text-align: left;">TITLE</td>
      <td style="border: none; width: 15%; text-align: right;">PAGE NO.</td>
    </tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.1</td><td style="border: none;">End-to-End Attendance and Payroll Automation Workflow</td><td style="border: none; text-align: right;">17</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.2</td><td style="border: none;">STEEP Macro-Environmental Analysis Framework</td><td style="border: none; text-align: right;">20</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.3</td><td style="border: none;">STEEP Impact vs. Likelihood Risk Assessment Matrix</td><td style="border: none; text-align: right;">21</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.4</td><td style="border: none;">Activity System Strategic Architecture (24 Interlocking Activities)</td><td style="border: none; text-align: right;">23</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.5</td><td style="border: none;">Stakeholder Power vs. Interest Mapping Matrix</td><td style="border: none; text-align: right;">25</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.6</td><td style="border: none;">Stakeholder Relationship and System Data Flow Diagram</td><td style="border: none; text-align: right;">26</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.7</td><td style="border: none;">Stakeholder Priority Quadrants and Engagement Strategies</td><td style="border: none; text-align: right;">27</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.8</td><td style="border: none;">Reframing Venn Diagram and Central Core Challenge (HMW)</td><td style="border: none; text-align: right;">29</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.9</td><td style="border: none;">Empathy Map Canvas: Senior Mason Murugesan K.</td><td style="border: none; text-align: right;">31</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.10</td><td style="border: none;">Daily Wage Shift Lifecycle Customer Journey Map and Emotion Curve</td><td style="border: none; text-align: right;">34</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.11</td><td style="border: none;">Geo-tagged Field Observational Study at SKS Construction Site</td><td style="border: none; text-align: right;">36</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.12</td><td style="border: none;">Quantitative Desktop Research &amp; Field Survey Analysis (N=120 Sites)</td><td style="border: none; text-align: right;">38</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.13</td><td style="border: none;">SPICE Framework Multi-Dimensional Analysis Canvas</td><td style="border: none; text-align: right;">40</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.14</td><td style="border: none;">Primary User Persona Profile: Murugesan K. (42, Senior Mason)</td><td style="border: none; text-align: right;">42</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 4.15</td><td style="border: none;">Six-Frame Contextual Narrative Storyboard: A Day with BuildEase</td><td style="border: none; text-align: right;">46</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 5.1</td><td style="border: none;">Low-Fidelity Paper Prototype &amp; Interface Wireframe Sketches</td><td style="border: none; text-align: right;">50</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 5.2</td><td style="border: none;">Medium-Fidelity Overview Dashboard &amp; Holographic Site Metrics</td><td style="border: none; text-align: right;">53</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 5.3</td><td style="border: none;">Biometric Geofenced Attendance Muster &amp; 2G IVR Phone Kiosk</td><td style="border: none; text-align: right;">53</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 5.4</td><td style="border: none;">Trade Tasks Allocation &amp; Productivity Tracking Engine</td><td style="border: none; text-align: right;">54</td></tr>
    <tr style="border: none;"><td style="border: none;">Figure 5.5</td><td style="border: none;">Automated Transparent Payroll Calculation &amp; Wage Slip Generator</td><td style="border: none; text-align: right;">54</td></tr>
  </table>
</div>

<div class="page-break"></div>

<!-- ==================== LIST OF ABBREVIATIONS ==================== -->
<div class="page" style="padding-top: 20px;">
  <h2 style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 25px; letter-spacing: 1px;">
    LIST OF ABBREVIATIONS
  </h2>

  <table style="width: 100%; border: none; font-size: 11pt; line-height: 1.8;">
    <tr style="border-bottom: 1.5px solid #000; font-weight: bold;">
      <td style="border: none; width: 25%; text-align: left;">ABBREVIATION</td>
      <td style="border: none; width: 75%; text-align: left;">EXPANSION</td>
    </tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">AAC</td><td style="border: none;">Autoclaved Aerated Concrete</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">AI</td><td style="border: none;">Artificial Intelligence</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">API</td><td style="border: none;">Application Programming Interface</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">BOCW</td><td style="border: none;">Building and Other Construction Workers (Welfare Board)</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">CSV</td><td style="border: none;">Comma-Separated Values</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">DSR</td><td style="border: none;">Daily Site Report</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">GIS</td><td style="border: none;">Geographic Information System</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">GPS</td><td style="border: none;">Global Positioning System</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">GSM</td><td style="border: none;">Global System for Mobile Communications</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">HMW</td><td style="border: none;">How Might We (Reframing Question)</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">IDB</td><td style="border: none;">Indexed Database (Client-Side Storage API)</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">IP65</td><td style="border: none;">Ingress Protection Rating (Dust-tight and water-jet protected)</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">IVR</td><td style="border: none;">Interactive Voice Response</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">JSON</td><td style="border: none;">JavaScript Object Notation</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">KEC</td><td style="border: none;">Kongu Engineering College</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">NACH</td><td style="border: none;">National Automated Clearing House</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">NEFT</td><td style="border: none;">National Electronic Funds Transfer</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">NPCI</td><td style="border: none;">National Payments Corporation of India</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">ONNX</td><td style="border: none;">Open Neural Network Exchange</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">PIN</td><td style="border: none;">Personal Identification Number</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">PWA</td><td style="border: none;">Progressive Web Application</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">RAM</td><td style="border: none;">Random Access Memory</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">REST</td><td style="border: none;">Representational State Transfer</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">RFID</td><td style="border: none;">Radio-Frequency Identification</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">SCAMPER</td><td style="border: none;">Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">SDG</td><td style="border: none;">Sustainable Development Goal (United Nations)</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">SMS</td><td style="border: none;">Short Message Service</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">SPICE</td><td style="border: none;">Social, Physical, Identity, Communication, Economic (Framework)</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">STEEP</td><td style="border: none;">Social, Technological, Economic, Environmental, Political (Framework)</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">UI / UX</td><td style="border: none;">User Interface / User Experience</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">UTC</td><td style="border: none;">Coordinated Universal Time</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">VAD</td><td style="border: none;">Voice Activity Detection</td></tr>
  </table>
</div>

<div class="page-break"></div>
"""

print("Preliminary sections defined successfully.")
