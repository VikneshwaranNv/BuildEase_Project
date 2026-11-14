# -*- coding: utf-8 -*-
"""Chapters 1, 2, and 3 for BuildEase Design Thinking Report."""

def get_chapters_1_to_3_html():
    return """
<!-- ==================== CHAPTER 1: INTRODUCTION ==================== -->
<div class="page" id="chapter-1">
  <h1 style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 24pt;">
    CHAPTER 1<br />INTRODUCTION
  </h1>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    1.1 Introduction
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The construction sector forms the backbone of global physical infrastructure development and serves as the second-largest employer in developing economies such as India, engaging more than 74 million daily-wage laborers, masons, carpenters, bar-benders, and unskilled helpers. Despite the monumental scale and capital intensity of contemporary civil engineering projects, human capital management on ground-level jobsites remains trapped in archaic, manual practices established over a century ago. On the overwhelming majority of construction sites across urban and peri-urban India, workforce tracking and wage administration are conducted entirely through handwritten paper registers, colloquially known as &ldquo;muster rolls,&rdquo; maintained by field supervisors and petty labour contractors (&ldquo;maistries&rdquo;).
  </p>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    This reliance on paper-based record keeping introduces severe structural inefficiencies, pervasive financial leakage, and endemic labor friction. Daily-wage laborers operate in physically punishing conditions characterized by airborne abrasive cement dust, wet mortar, heavy aggregate handling, and extreme weather exposure. At the conclusion of a 6-day workweek, workers must undergo a protracted, non-transparent reconciliation process where supervisors manually tally shifts, deduct arbitrary amounts for mid-week tea and meal advances, and impose unverified late penalties. Because workers possess no tangible or immutable documentation of their daily hours, disputes are frequent and heated. Empirical studies indicate that more than 68% of construction laborers suffer from regular wage shortfalls, forfeiting between ₹1,000 and ₹1,500 every month&mdash;a substantial portion of their living income.
  </p>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    Simultaneously, general contractors and project developers face crippling operational and financial challenges under the legacy system. The lack of verifiable, real-time site verification enables widespread fraud, including the billing of &ldquo;ghost workers&rdquo; (individuals listed on muster rolls who were never physically present), buddy punching, and inflated labor rosters. Industry audits suggest that project developers experience 10% to 14% unauthorized payroll leakage on commercial sites. Attempts to deploy commercial enterprise biometric hardware (such as optical fingerprint scanners) have failed dramatically due to the abrasive erosion of workers&rsquo; epidermal ridges caused by caustic cement compounds, yielding field rejection rates upwards of 80%. Furthermore, standard modern attendance software requires individual smartphones and high-speed mobile data connections&mdash;technological luxuries absent among the 70%+ of the workforce who carry basic 2G keypad feature phones.
  </p>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    <strong>BuildEase</strong> emerges as an empathetic, socio-technically grounded intervention engineered specifically to dismantle these systemic bottlenecks. By reframing workforce management as an instrument of mutual transparency rather than top-down surveillance, BuildEase delivers a resilient multi-modal ecosystem combining edge-computed facial biometrics, inclusive 2G GSM cellular voice channels, offline-first data replication, and mathematical payroll automation.
  </p>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    1.2 Objective
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The primary objective of the BuildEase project is to design, develop, and empirically validate an equitable, transparent, and resilient workforce management and payroll platform tailored specifically to the operational constraints of construction sites. The specific sub-objectives are delineated below:
  </p>
  <ul style="line-height: 1.8; margin-left: 0.5in; margin-bottom: 12pt;">
    <li><strong>Eliminate Biometric Rejection on Abrasive Hands:</strong> Implement an edge-based, contactless facial recognition pipeline utilizing lightweight neural architectures (YuNet and SFace) that authenticates workers in under 3 seconds per entry, entirely eliminating dependence on damaged epidermal ridges.</li>
    <li><strong>Provide 100% Inclusive Access for 2G Keypad Users:</strong> Integrate a telecom-backed Interactive Voice Response (IVR) and missed-call telephony gateway featuring rotating gate PINs, enabling non-smartphone users to independently log and verify site attendance without mobile data.</li>
    <li><strong>Guarantee Continuous Offline-First Operation:</strong> Architect a robust client-side caching and synchronization engine utilizing IndexedDB, ensuring zero operational downtime in deep basements, elevator shafts, and remote peripheral sites lacking cellular connectivity.</li>
    <li><strong>Automate Transparent, Dispute-Free Wage Calculations:</strong> Enforce an immutable mathematical payroll engine based on the statutory formula <em>Wage = (Daily Rate &times; Verified Shifts) &minus; Documented Advances</em>, coupled with automated multi-lingual SMS wage receipts and 1-click bank transfer batch generation.</li>
    <li><strong>Eradicate Ghost Workers and Payroll Fraud:</strong> Couple GPS geofencing verification (100-meter radius) with rapid digital foreman muster sign-off workflows to eliminate fabricated headcounts and unauthorized labor inflation.</li>
    <li><strong>Align with Global Sustainable Development Goals:</strong> Promote United Nations SDG 8 (Decent Work and Economic Growth), SDG 9 (Industry, Innovation, and Infrastructure), and SDG 10 (Reduced Inequalities) by safeguarding worker wage entitlements and human dignity.</li>
  </ul>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    1.3 Scope
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The operational and technical scope of BuildEase encompasses all critical touchpoints across the daily shift lifecycle on small, medium, and mega construction projects:
  </p>
  <ul style="line-height: 1.8; margin-left: 0.5in; margin-bottom: 12pt;">
    <li><strong>Target Workforce:</strong> Daily-wage laborers, skilled artisans (masons, carpenters, bar-benders, plumbers, electricians), apprentice helpers, and interstate migrant workers across diverse linguistic backgrounds.</li>
    <li><strong>Hardware Deployment:</strong> Low-cost, ruggedized IP65 Android gate tablet kiosks for high-throughput facial capture, standard supervisor mobile tablets/smartphones for muster sign-offs, and ordinary 2G GSM cellular handsets.</li>
    <li><strong>Software Environment:</strong> Modern browser-compatible Progressive Web Application (PWA) operating on React 19, TypeScript, Tailwind CSS, Node.js/Express REST microservices, client-side ONNX Runtime Web, and IndexedDB persistent storage.</li>
    <li><strong>Administrative &amp; Compliance Domain:</strong> Shift scheduling, skill categorization, trade task allocation, daily site reports (DSR), advance payment tracking, automated muster roll generation, audit-ready CSV exports for BOCW (Building and Other Construction Workers) Welfare Board regulatory compliance, and multi-lingual worker SMS communication.</li>
  </ul>
</div>

<div class="page-break"></div>

<!-- ==================== CHAPTER 2: PROBLEM DEFINITION ==================== -->
<div class="page" id="chapter-2">
  <h1 style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 24pt;">
    CHAPTER 2<br />PROBLEM DEFINITION
  </h1>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    2.1 Existing System
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    In the contemporary construction ecosystem, workforce tracking is predominantly executed via two legacy modalities:
  </p>
  <ol style="line-height: 1.8; margin-left: 0.5in; margin-bottom: 12pt;">
    <li>
      <strong>Manual Paper-Based Muster Rolls:</strong> Site supervisors or labour contractors manually record names, morning arrival marks, and evening departure marks in paper notebooks. At mid-day, cash advances for tea, lunch, or emergency expenses are scribbled in margins or separate informal chits. At the close of the week, the supervisor attempts to mentally reconcile hours worked, advance deductions, and overtime adjustments. This modality is fraught with severe vulnerabilities:
      <ul style="margin-top: 4pt; margin-bottom: 6pt;">
        <li>Paper records are susceptible to physical damage, cement water contamination, ink smudging, and deliberate post-facto alterations.</li>
        <li>Supervisors spend 1.5 to 2.5 hours every evening transcribing, verifying, and computing headcounts, pulling critical technical personnel away from active site safety supervision.</li>
        <li>Workers have zero visibility into what has been written; their wages are subject to unilateral deductions without documented proof or recourse.</li>
      </ul>
    </li>
    <li>
      <strong>Traditional Optical Biometric Hardware (Fingerprint Scanners):</strong> On select large-scale infrastructure projects, developers have attempted to introduce wall-mounted biometric fingerprint attendance terminals. In site reality, these systems fail catastrophically:
      <ul style="margin-top: 4pt; margin-bottom: 6pt;">
        <li>Construction materials&mdash;specifically Portland cement, hydrated lime, coarse sand, and abrasive gravel&mdash;rapidly erode the papillary friction ridges of workers&rsquo; fingers.</li>
        <li>Dust, oil, slurry, and wet skin create extreme optical diffusion on glass scanner platen surfaces, generating false rejection rates (FRR) in excess of 80%.</li>
        <li>Prolonged scanner queues at dawn cause severe bottlenecking, leading supervisors to abandon the machines and revert back to manual registers.</li>
      </ul>
    </li>
  </ol>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    2.2 Problem Statement
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    Construction sites are plagued by an adversarial, non-transparent labor paradigm where daily-wage workers lose substantial portions of their entitled earnings to paper-record tampering, unrecorded advance deductions, and optical biometric failures, while developers and contractors suffer massive payroll losses (10&ndash;14%) to ghost workers and fabricated headcounts. The fundamental challenge is to engineer an inclusive, zero-fraud, offline-resilient workforce ecosystem that operates seamlessly without requiring smartphones from laborers, authenticates workers regardless of damaged hands, guarantees instant dispute-free mathematical wage payouts, and restores dignity and trust to the construction site.
  </p>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    2.3 Constraints
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The development and deployment of BuildEase are bounded by rigorous real-world field constraints:
  </p>
  <ul style="line-height: 1.8; margin-left: 0.5in; margin-bottom: 12pt;">
    <li><strong>Physical &amp; Environmental Constraints:</strong> Extreme outdoor ambient temperatures (10&deg;C to 45&deg;C), heavy direct solar glare, intense airborne abrasive cement dust, wet concrete slurry, and erratic grid electrical supply.</li>
    <li><strong>Connectivity Constraints:</strong> Deep subterranean basements (3 levels underground), reinforced concrete shear walls, and remote peri-urban greenfield locations where cellular 4G/5G signals drop to zero bars.</li>
    <li><strong>Device &amp; User Constraints:</strong> Over 70% of laborers do not possess smartphones, cannot read English text, and possess low digital literacy; interactive solutions must not demand complex app installations or touchscreen interactions from workers.</li>
    <li><strong>Throughput &amp; Timing Constraints:</strong> Site entry gates experience sharp rushes where 150 to 300 workers arrive between 07:15 AM and 07:35 AM; verification per individual must execute in under 3 seconds to prevent gate congestion.</li>
    <li><strong>Cost Constraints:</strong> System hardware must utilize accessible, off-the-shelf Android tablets rather than prohibitively expensive proprietary industrial biometric terminals.</li>
  </ul>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    2.4 People Affected
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The breakdown of manual workforce management directly damages several key demographic groups:
  </p>
  <ul style="line-height: 1.8; margin-left: 0.5in; margin-bottom: 12pt;">
    <li><strong>Daily-Wage Laborers &amp; Artisans (Primary Victims):</strong> Suffer immediate financial hardship from unrecorded hours and arbitrary wage cuts, experiencing severe emotional humiliation, anxiety, and distrust toward site authorities.</li>
    <li><strong>Interstate Migrant Workers:</strong> Laborers migrating from eastern or northern India (speaking Hindi, Bengali, or Assamese) working on southern sites face acute linguistic isolation, making them especially vulnerable to exploitative subcontractor deductions.</li>
    <li><strong>Site Civil Supervisors &amp; Foremen:</strong> Endure daily burnout, spending hours cross-verifying registers, handling volatile Saturday pay disputes, and risking personal liability for headcount discrepancies.</li>
    <li><strong>General Contractors &amp; Developers:</strong> Incur substantial unrecoverable financial overhead from ghost-worker invoices, project schedule delays resulting from labor walkouts, and exposure to statutory BOCW labor audit penalties.</li>
  </ul>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    2.5 Design Challenge
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    Following design thinking inquiry, the overarching design challenge was formulated into seven core <strong>&ldquo;How Might We&rdquo; (HMW)</strong> questions:
  </p>
  <ol style="line-height: 1.8; margin-left: 0.5in; margin-bottom: 12pt;">
    <li><strong>HMW-1 (Biometric Inclusion):</strong> How might we accurately authenticate daily-wage workers in under 3 seconds without relying on damaged or dust-coated fingertips?</li>
    <li><strong>HMW-2 (Device Accessibility):</strong> How might we empower workers who only possess basic 2G keypad feature phones to independently log attendance and verify wage records without internet access?</li>
    <li><strong>HMW-3 (Offline Resilience):</strong> How might we maintain complete, uninterrupted verification and muster functionality on construction sites with zero cellular or network connectivity?</li>
    <li><strong>HMW-4 (Wage Transparency):</strong> How might we eliminate end-of-month wage disputes by mathematically linking verified shift hours and mid-day advances directly to automated multi-lingual pay receipts?</li>
    <li><strong>HMW-5 (Fraud Prevention):</strong> How might we eradicate ghost-worker billing and proxy check-ins without imposing humiliating or time-consuming security checkpoints on laborers?</li>
    <li><strong>HMW-6 (Human-Centric Fail-Safe):</strong> How might we ensure that edge algorithm false rejections or lighting glitches never result in automatic wage forfeiture or worker penalties?</li>
    <li><strong>HMW-7 (Operational Efficiency):</strong> How might we compress the supervisor&rsquo;s evening muster reconciliation workflow from 2 hours of manual ledger tallying down to under 15 minutes of digital sign-off?</li>
  </ol>
</div>

<div class="page-break"></div>

<!-- ==================== CHAPTER 3: REQUIREMENTS AND ESTIMATES ==================== -->
<div class="page" id="chapter-3">
  <h1 style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 24pt;">
    CHAPTER 3<br />REQUIREMENTS AND ESTIMATES
  </h1>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    3.1 Hardware Requirements
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    BuildEase is architected to operate on accessible, cost-effective consumer and commercial hardware, avoiding expensive proprietary biometric infrastructure. The detailed hardware specifications across operational nodes are summarized in Table 3.1.
  </p>

  <p class="table-caption"><strong>Table 3.1: Hardware Specifications for Edge &amp; Kiosk Nodes</strong></p>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">System Node</th>
        <th style="width: 35%;">Minimum Specification</th>
        <th style="width: 40%;">Recommended / Production Deployment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Gate Tablet Kiosk</strong></td>
        <td>Quad-Core 2.0 GHz, 3 GB RAM, 32 GB Storage, 5MP front camera, Android 10+</td>
        <td>Ruggedized IP65 Android Tablet (8-inch, 4GB RAM, 64GB eMMC, 8MP HDR camera, 8000mAh battery with solar trickle charge)</td>
      </tr>
      <tr>
        <td><strong>Supervisor Device</strong></td>
        <td>Standard Android smartphone, 3 GB RAM, GPS receiver, Chrome / Edge browser</td>
        <td>Android / iOS Tablet or Smartphone with 4G LTE, 4GB RAM, high-brightness outdoor display (&gt;500 nits)</td>
      </tr>
      <tr>
        <td><strong>Worker Mobile Channel</strong></td>
        <td>Any GSM voice-capable feature phone (e.g., Nokia 105, itel 2163)</td>
        <td>Standard 2G / 3G / 4G cellular handset capable of receiving SMS in regional languages</td>
      </tr>
      <tr>
        <td><strong>Contractor Workstation</strong></td>
        <td>Dual-Core CPU, 4 GB RAM, 1366&times;768 display, Broadband internet</td>
        <td>Modern Desktop / Laptop, Intel Core i5 / AMD Ryzen 5, 8GB RAM, 1080p display, Chrome 120+</td>
      </tr>
      <tr>
        <td><strong>Central Cloud Server</strong></td>
        <td>Virtual Private Server (VPS), 2 vCPU, 4 GB RAM, 50 GB SSD</td>
        <td>Containerized Cloud Instance (Node.js/Express, PostgreSQL, Redis cache, automated daily backup snapshots)</td>
      </tr>
    </tbody>
  </table>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    3.2 Software Requirements
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The software architecture leverages an ultra-modern, cross-platform stack prioritizing zero-latency client rendering, on-device AI inference, and reliable asynchronous data persistence. Table 3.2 details the technology stack and software dependencies.
  </p>

  <p class="table-caption"><strong>Table 3.2: Software Technology Stack and Dependency Specifications</strong></p>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Tier / Layer</th>
        <th style="width: 35%;">Technology / Framework</th>
        <th style="width: 40%;">Role in BuildEase Architecture</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Frontend Framework</strong></td>
        <td>React 19, TypeScript 5.5, Vite 6.0</td>
        <td>High-performance reactive user interface, strict type safety, modular component architecture</td>
      </tr>
      <tr>
        <td><strong>Styling &amp; Design System</strong></td>
        <td>Tailwind CSS v4.0, Lucide React Icons</td>
        <td>Engineered construction UI, high-contrast outdoor readability, dark-slate visual theme</td>
      </tr>
      <tr>
        <td><strong>Client-Side Storage</strong></td>
        <td>IndexedDB API, LocalStorage cache</td>
        <td>Persistent offline-first attendance queue, cached rosters, asynchronous conflict-free sync</td>
      </tr>
      <tr>
        <td><strong>Edge Computer Vision</strong></td>
        <td>ONNX Runtime Web, YuNet (Detection), SFace (Embeddings)</td>
        <td>Client-side facial landmark detection and feature vector generation executed locally in WebAssembly/WebGL</td>
      </tr>
      <tr>
        <td><strong>Backend API Runtime</strong></td>
        <td>Node.js 22 LTS, Express.js REST Engine</td>
        <td>Lightweight microservices, muster lifecycle controllers, payroll computation, CSV export engine</td>
      </tr>
      <tr>
        <td><strong>Telephony Gateway</strong></td>
        <td>Cloud IVR REST Gateway, Twilio / Exotel GSM API</td>
        <td>Inbound 1800 missed-call routing, dual-tone multi-frequency (DTMF) PIN collection, 5-language TTS</td>
      </tr>
      <tr>
        <td><strong>Messaging Services</strong></td>
        <td>GSM SMS Gateway (DLT registered)</td>
        <td>Automated dispatch of verified shift receipts and weekly wage breakdowns in regional scripts</td>
      </tr>
    </tbody>
  </table>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    3.3 Software Description
  </h2>
  
  <h3 style="font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt;">
    3.3.1 Edge AI Biometric Subsystem (YuNet + SFace)
  </h3>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    Rather than streaming uncompressed video frames to remote cloud servers (which inevitably induces latency and fails in cellular dead zones), BuildEase utilizes client-side ONNX Runtime Web. The gate kiosk webcam stream feeds into YuNet, an ultra-compact convolutional neural network optimized for real-time edge face detection. Detected bounding boxes are aligned using 5 facial landmarks and passed to SFace, an 8-layer deep feature extraction network that outputs a compact 128-dimensional floating-point embedding vector. Cosine similarity matching is executed locally against pre-cached site workforce templates in under 300 milliseconds.
  </p>

  <h3 style="font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt;">
    3.3.2 2G GSM IVR &amp; PIN Telephony Subsystem
  </h3>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    To bridge the digital divide for workers lacking smartphones, BuildEase implements a carrier-grade telephony gateway. When a worker arrives at the gate, they place a toll-free missed call to the project&rsquo;s dedicated 1800-number. The system answers via an automated voice prompt in the worker&rsquo;s preferred language (e.g., Tamil or Hindi) and prompts them to enter the daily 4-digit &ldquo;Gate PIN&rdquo; written on the physical muster board. Upon entry, the system verifies caller-ID against the site roster and logs the check-in event, returning an automated SMS confirmation.
  </p>

  <h3 style="font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt;">
    3.3.3 Offline-First IndexedDB Replication Engine
  </h3>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    Recognizing that construction sites frequently operate in basements or remote rural zones, the BuildEase frontend treats the local device database (IndexedDB) as the primary source of truth. All check-in timestamps, GPS coordinates, supervisor verification signatures, and advance cash vouchers are committed instantly to an offline queue. A background Service Worker monitors network state; upon reconnecting to cellular data or Wi-Fi, the queue automatically reconciles with the central database using optimistic timestamps and cryptographic checksums.
  </p>

  <h3 style="font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt;">
    3.3.4 Transparent Payroll Engine and Compliance Exporter
  </h3>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The payroll core executes automated shift calculations using an immutable formula: <em>Net Wage = (Trade Daily Rate &times; Verified Shift Multiplier) &minus; Documented Advances</em>. Overtime hours (&gt;8.0 hours) are computed at 1.5&times; standard hourly rate. The module generates one-click National Electronic Funds Transfer (NEFT) bank disbursement batch files and exportable CSV audit sheets conforming to Form XVI and XVII of the Building and Other Construction Workers (Regulation of Employment and Conditions of Service) Act.
  </p>

  <h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">
    3.4 Estimates (Time and Cost)
  </h2>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The project lifecycle spanned an intensive 14-week engineering schedule, categorized across distinct design thinking phases:
  </p>
  <ul style="line-height: 1.8; margin-left: 0.5in; margin-bottom: 12pt;">
    <li><strong>Weeks 1&ndash;3: Problem Discovery, Ethnographic Fieldwork &amp; STEEP Exploration:</strong> On-site interviews with 15 masons, 4 subcontractors, and 2 developers across Tiruppur and Coimbatore sites.</li>
    <li><strong>Weeks 4&ndash;6: Empathy Synthesis, SPICE Framing &amp; Architecture Definition:</strong> Creation of personas, empathy maps, journey frameworks, and technical architecture trade-off analyses.</li>
    <li><strong>Weeks 7&ndash;10: Prototype Development &amp; Edge AI Integration:</strong> Implementation of React 19 UI, ONNX Web face pipeline, IndexedDB offline sync, and Express backend microservices.</li>
    <li><strong>Weeks 11&ndash;12: 2G IVR Integration, Geofencing &amp; Payroll Testing:</strong> End-to-end integration with cloud telephony gateways, simulated load testing, and multi-lingual SMS delivery.</li>
    <li><strong>Weeks 13&ndash;14: Field Validation, Success Criteria Audit &amp; Documentation:</strong> Live pilot trial on SKS Builders site, comparative benchmarking, and final thesis documentation.</li>
  </ul>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    The estimated capital and operational expenditure for deploying BuildEase on a typical mid-sized site (100 daily-wage workers over an 18-month project cycle) total approximately ₹38,500 ($460 USD), broken down as follows:
  </p>
  <ul style="line-height: 1.8; margin-left: 0.5in; margin-bottom: 12pt;">
    <li>Ruggedized Android Kiosk Tablet (8-inch, IP65 housing): ₹14,500 (one-time hardware capex).</li>
    <li>Adjustable site mounting kiosk stand with weather enclosure: ₹3,500.</li>
    <li>Cloud VPS hosting and database maintenance (18 months): ₹9,000 (₹500/month).</li>
    <li>Telecom 2G IVR toll-free number and SMS gateway balance: ₹11,500 (₹0.15/SMS).</li>
  </ul>
  <p style="text-align: justify; line-height: 1.8; text-indent: 0.5in; margin-bottom: 12pt;">
    In contrast, an average mid-sized construction site loses upwards of ₹4,20,000 annually to ghost-worker padding and payroll disputes under manual registers. BuildEase delivers a verified return on investment (ROI) within less than 60 days of site operation.
  </p>
</div>

<div class="page-break"></div>
"""

print("Chapters 1 to 3 defined successfully.")
