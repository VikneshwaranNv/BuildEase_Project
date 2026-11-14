# -*- coding: utf-8 -*-
"""SVG generator for BuildEase Design Thinking Report figures."""

def get_fig_4_1_workflow():
    return """<svg viewBox="0 0 750 980" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Header Bar -->
  <rect x="50" y="20" width="650" height="48" rx="8" fill="#1b365d"/>
  <text x="375" y="50" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">BuildEase Attendance &amp; Payroll Workflow</text>
  
  <!-- Step 1: Open App / Kiosk -->
  <rect x="250" y="90" width="250" height="45" rx="22" fill="#3b82f6"/>
  <text x="375" y="118" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">Start Attendance Check-in</text>
  
  <line x1="375" y1="135" x2="375" y2="165" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Decision 1: Access Channel -->
  <polygon points="375,165 490,210 375,255 260,210" fill="#f8fafc" stroke="#1e293b" stroke-width="2"/>
  <text x="375" y="205" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f172a">Device Channel?</text>
  <text x="375" y="222" font-size="11" text-anchor="middle" fill="#475569">(Worker's Phone)</text>
  
  <!-- Branch Left: Face Tablet Kiosk -->
  <line x1="260" y1="210" x2="160" y2="210" stroke="#475569" stroke-width="2"/>
  <line x1="160" y1="210" x2="160" y2="280" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="195" y="200" font-size="11" font-weight="bold" fill="#15803d">At Gate Tablet</text>
  
  <rect x="50" y="280" width="220" height="60" rx="8" fill="#15803d"/>
  <text x="160" y="305" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Gate Tablet Kiosk</text>
  <text x="160" y="325" fill="#e2e8f0" font-size="11" text-anchor="middle">3s Face Scan (YuNet + SFace)</text>
  
  <!-- Branch Right: 2G Keypad Phone -->
  <line x1="490" y1="210" x2="590" y2="210" stroke="#475569" stroke-width="2"/>
  <line x1="590" y1="210" x2="590" y2="280" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="515" y="200" font-size="11" font-weight="bold" fill="#b45309">No Smartphone</text>
  
  <rect x="480" y="280" width="220" height="60" rx="8" fill="#d97706"/>
  <text x="590" y="305" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">2G Keypad Phone</text>
  <text x="590" y="325" fill="#fef3c7" font-size="11" text-anchor="middle">Toll-Free 1800 + Daily Gate PIN</text>
  
  <!-- Merge into Verification Engine -->
  <line x1="160" y1="340" x2="160" y2="390" stroke="#475569" stroke-width="2"/>
  <line x1="590" y1="340" x2="590" y2="390" stroke="#475569" stroke-width="2"/>
  <line x1="160" y1="390" x2="590" y2="390" stroke="#475569" stroke-width="2"/>
  <line x1="375" y1="390" x2="375" y2="420" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Step 3: Location & Duplicate Validation -->
  <rect x="220" y="420" width="310" height="55" rx="8" fill="#0284c7"/>
  <text x="375" y="443" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">GPS Geofence &amp; Security Filter</text>
  <text x="375" y="462" fill="#e0f2fe" font-size="11" text-anchor="middle">Within 100m of Site - 5min Duplicate Block</text>
  
  <line x1="375" y1="475" x2="375" y2="505" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Decision 2: Glare/Dust Exception? -->
  <polygon points="375,505 480,545 375,585 270,545" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
  <text x="375" y="540" font-size="12" font-weight="bold" text-anchor="middle" fill="#991b1b">Scan Failed?</text>
  <text x="375" y="556" font-size="10" text-anchor="middle" fill="#dc2626">(Dust / Glare / Bandage)</text>
  
  <!-- Fail Safe Fallback -->
  <line x1="480" y1="545" x2="590" y2="545" stroke="#dc2626" stroke-width="2"/>
  <line x1="590" y1="545" x2="590" y2="615" stroke="#dc2626" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="510" y="535" font-size="10" font-weight="bold" fill="#dc2626">Yes (Fallback)</text>
  
  <rect x="480" y="615" width="220" height="55" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
  <text x="590" y="638" fill="#991b1b" font-size="11" font-weight="bold" text-anchor="middle">Request Manual Review</text>
  <text x="590" y="655" fill="#b91c1c" font-size="10" text-anchor="middle">Wage Protected - Held for Supervisor</text>
  
  <!-- Normal Flow -->
  <line x1="375" y1="585" x2="375" y2="615" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="385" y="602" font-size="10" font-weight="bold" fill="#15803d">No</text>
  
  <rect x="220" y="615" width="310" height="55" rx="8" fill="#475569"/>
  <text x="375" y="638" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">Hold as Raw Pending Check-in</text>
  <text x="375" y="656" fill="#cbd5e1" font-size="11" text-anchor="middle">IndexedDB Offline Store - Logged in UTC</text>
  
  <!-- Merge fallback to supervisor review -->
  <line x1="590" y1="670" x2="590" y2="705" stroke="#475569" stroke-width="2"/>
  <line x1="590" y1="705" x2="375" y2="705" stroke="#475569" stroke-width="2"/>
  <line x1="375" y1="670" x2="375" y2="730" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Step 4: Supervisor Review -->
  <rect x="200" y="730" width="350" height="60" rx="8" fill="#059669"/>
  <text x="375" y="755" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">Supervisor Muster Sign-off</text>
  <text x="375" y="774" fill="#a7f3d0" font-size="11" text-anchor="middle">Clears Exceptions - Certifies Hours - Locks Shift</text>
  
  <line x1="375" y1="790" x2="375" y2="820" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Step 5: Wage Engine -->
  <rect x="200" y="820" width="350" height="60" rx="8" fill="#4338ca"/>
  <text x="375" y="845" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">Automated Wage Engine</text>
  <text x="375" y="864" fill="#c7d2fe" font-size="11" text-anchor="middle">Wage = Daily Rate x Verified Hours - Advances</text>
  
  <line x1="375" y1="880" x2="375" y2="910" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Step 6: Confirmation & Output -->
  <rect x="180" y="910" width="390" height="50" rx="25" fill="#047857"/>
  <text x="375" y="932" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">SMS Pay Receipt &amp; Bank NEFT Transfer</text>
  <text x="375" y="949" fill="#a7f3d0" font-size="10" text-anchor="middle">5 Languages (Hindi, Tamil, Marathi, Bengali, Assamese)</text>
  
  <!-- Defs -->
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569"/>
    </marker>
  </defs>
</svg>"""

def get_fig_4_2_steep():
    return """<svg viewBox="0 0 800 620" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <text x="400" y="32" font-size="18" font-weight="bold" text-anchor="middle" fill="#0f172a">STEEP ANALYSIS</text>
  
  <!-- Social -->
  <rect x="30" y="55" width="225" height="185" rx="8" fill="#f8fafc" stroke="#22c55e" stroke-width="1.5"/>
  <text x="142" y="78" font-size="11" font-weight="bold" text-anchor="middle" fill="#15803d">SOCIAL &amp; DEMOGRAPHICS</text>
  <text x="42" y="100" font-size="10" fill="#334155">• 80-100 workers arrive in peak rush.</text>
  <text x="42" y="118" font-size="10" fill="#334155">• Migrant labor face language barriers.</text>
  <text x="42" y="136" font-size="10" fill="#334155">• Low literacy; fear unfair pay cuts.</text>
  <text x="42" y="154" font-size="10" fill="#334155">• Reliance on paper pocket diaries.</text>
  <text x="42" y="172" font-size="10" fill="#334155">• Daily wage earners need fast gate entry.</text>
  <text x="42" y="190" font-size="10" fill="#334155">• Crave dignity and respect for craft.</text>

  <!-- Technology -->
  <rect x="287" y="55" width="225" height="185" rx="8" fill="#f8fafc" stroke="#22c55e" stroke-width="1.5"/>
  <text x="400" y="78" font-size="11" font-weight="bold" text-anchor="middle" fill="#15803d">TECHNOLOGY</text>
  <text x="299" y="100" font-size="10" fill="#334155">• Lightweight ONNX edge models (YuNet).</text>
  <text x="299" y="118" font-size="10" fill="#334155">• Offline browser IndexedDB caching.</text>
  <text x="299" y="136" font-size="10" fill="#334155">• Standard 2G GSM cellular networks.</text>
  <text x="299" y="154" font-size="10" fill="#334155">• GPS geofencing restricts site bounds.</text>
  <text x="299" y="172" font-size="10" fill="#334155">• Cloud database sync on connection.</text>
  <text x="299" y="190" font-size="10" fill="#334155">• Toll-free telephony IVR gateways.</text>

  <!-- Economy -->
  <rect x="545" y="55" width="225" height="185" rx="8" fill="#f8fafc" stroke="#22c55e" stroke-width="1.5"/>
  <text x="657" y="78" font-size="11" font-weight="bold" text-anchor="middle" fill="#15803d">ECONOMY</text>
  <text x="557" y="100" font-size="10" fill="#334155">• Contractors lose 15-20% to ghost labor.</text>
  <text x="557" y="118" font-size="10" fill="#334155">• Workers lose pay from lost chits/disputes.</text>
  <text x="557" y="136" font-size="10" fill="#334155">• Weekly cash distribution is insecure.</text>
  <text x="557" y="154" font-size="10" fill="#334155">• Payday arguments halt site output.</text>
  <text x="557" y="172" font-size="10" fill="#334155">• High cost of expensive biometric kiosks.</text>
  <text x="557" y="190" font-size="10" fill="#334155">• Transparent wages protect livelihood.</text>

  <!-- Environment & Nature -->
  <rect x="30" y="270" width="225" height="185" rx="8" fill="#f8fafc" stroke="#22c55e" stroke-width="1.5"/>
  <text x="142" y="293" font-size="11" font-weight="bold" text-anchor="middle" fill="#15803d">ENVIRONMENT &amp; NATURE</text>
  <text x="42" y="315" font-size="10" fill="#334155">• Heavy airborne cement dust on site.</text>
  <text x="42" y="333" font-size="10" fill="#334155">• Severe outdoor sunlight &amp; screen glare.</text>
  <text x="42" y="351" font-size="10" fill="#334155">• Monsoons damage paper muster books.</text>
  <text x="42" y="369" font-size="10" fill="#334155">• Cement slurry wears down skin ridges.</text>
  <text x="42" y="387" font-size="10" fill="#334155">• Extreme heat index requires fast gates.</text>
  <text x="42" y="405" font-size="10" fill="#334155">• Elimination of physical paper rolls.</text>

  <!-- Politics & Legal -->
  <rect x="545" y="270" width="225" height="185" rx="8" fill="#f8fafc" stroke="#22c55e" stroke-width="1.5"/>
  <text x="657" y="293" font-size="11" font-weight="bold" text-anchor="middle" fill="#15803d">POLITICS &amp; LEGAL</text>
  <text x="557" y="315" font-size="10" fill="#334155">• Inter-State Migrant Workmen Act compliance.</text>
  <text x="557" y="333" font-size="10" fill="#334155">• Minimum Wages Act (1948) mandates.</text>
  <text x="557" y="351" font-size="10" fill="#334155">• Statutory digital audit muster records.</text>
  <text x="557" y="369" font-size="10" fill="#334155">• Strict data privacy under DPDP Act.</text>
  <text x="557" y="387" font-size="10" fill="#334155">• Overtime wage verification mandates.</text>
  <text x="557" y="405" font-size="10" fill="#334155">• Government labor inspection readiness.</text>

  <!-- Center Challenge Box -->
  <rect x="287" y="270" width="225" height="185" rx="8" fill="#16a34a"/>
  <text x="400" y="300" font-size="12" font-weight="bold" text-anchor="middle" fill="#ffffff">YOUR DESIGN</text>
  <text x="400" y="318" font-size="12" font-weight="bold" text-anchor="middle" fill="#ffffff">CHALLENGE / ISSUE</text>
  <text x="400" y="348" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#ffffff">How might we track</text>
  <text x="400" y="366" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#ffffff">genuine attendance &amp; calculate</text>
  <text x="400" y="384" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#ffffff">transparent wages for</text>
  <text x="400" y="402" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#ffffff">construction workers without</text>
  <text x="400" y="420" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#ffffff">forcing them to buy</text>
  <text x="400" y="438" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#ffffff">smartphones?</text>

  <!-- Arrows -->
  <line x1="255" y1="190" x2="330" y2="270" stroke="#16a34a" stroke-width="2" marker-end="url(#green_arrow)"/>
  <line x1="400" y1="240" x2="400" y2="270" stroke="#16a34a" stroke-width="2" marker-end="url(#green_arrow)"/>
  <line x1="545" y1="190" x2="470" y2="270" stroke="#16a34a" stroke-width="2" marker-end="url(#green_arrow)"/>
  <line x1="255" y1="360" x2="287" y2="360" stroke="#16a34a" stroke-width="2" marker-end="url(#green_arrow)"/>
  <line x1="545" y1="360" x2="512" y2="360" stroke="#16a34a" stroke-width="2" marker-end="url(#green_arrow)"/>
  
  <defs>
    <marker id="green_arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a"/>
    </marker>
  </defs>
</svg>"""

def get_fig_4_3_steep_matrix():
    return """<svg viewBox="0 0 800 620" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <text x="400" y="28" font-size="18" font-weight="bold" text-anchor="middle" fill="#0f172a">STEEP Analysis Matrix</text>
  
  <!-- Outer Border -->
  <rect x="40" y="45" width="720" height="530" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  
  <!-- Axes -->
  <line x1="400" y1="45" x2="400" y2="575" stroke="#000000" stroke-width="2"/>
  <line x1="40" y1="310" x2="760" y2="310" stroke="#000000" stroke-width="2"/>
  
  <!-- Labels -->
  <text x="400" y="40" font-size="12" font-weight="bold" text-anchor="middle" fill="#dc2626">High Impact</text>
  <text x="400" y="595" font-size="12" font-weight="bold" text-anchor="middle" fill="#dc2626">Low Impact</text>
  <text x="140" y="325" font-size="11" font-weight="bold" fill="#0f172a">Uncertain to Occur</text>
  <text x="630" y="325" font-size="11" font-weight="bold" fill="#0f172a">Likely to Occur</text>
  
  <!-- Quadrant 1: Top-Left (High Impact / Uncertain) -->
  <g transform="translate(55, 65)">
    <text x="0" y="15" font-size="10" font-weight="bold" fill="#2563eb">• Demographics:</text>
    <text x="10" y="30" font-size="9.5" fill="#334155">Worker hesitation/fear of facial surveillance tech.</text>
    <text x="0" y="50" font-size="10" font-weight="bold" fill="#16a34a">• Technology:</text>
    <text x="10" y="65" font-size="9.5" fill="#334155">Tower outages cutting off 2G IVR telephony.</text>
    <text x="0" y="85" font-size="10" font-weight="bold" fill="#9333ea">• Economy:</text>
    <text x="10" y="100" font-size="9.5" fill="#334155">Labor subcontractor pushback against audit ledgers.</text>
    <text x="0" y="120" font-size="10" font-weight="bold" fill="#15803d">• Environment &amp; Nature:</text>
    <text x="10" y="135" font-size="9.5" fill="#334155">Severe blinding glare completely masking tablet lens.</text>
    <text x="0" y="155" font-size="10" font-weight="bold" fill="#dc2626">• Politics &amp; Legal:</text>
    <text x="10" y="170" font-size="9.5" fill="#334155">Shifting regional rules on on-site biometric capture.</text>
  </g>
  
  <!-- Quadrant 2: Top-Right (High Impact / Likely to Occur) -->
  <g transform="translate(415, 65)">
    <text x="0" y="15" font-size="10" font-weight="bold" fill="#2563eb">• Demographics:</text>
    <text x="10" y="30" font-size="9.5" fill="#334155">Growing influx of inter-state migrant construction labor.</text>
    <text x="0" y="50" font-size="10" font-weight="bold" fill="#16a34a">• Technology:</text>
    <text x="10" y="65" font-size="9.5" fill="#334155">Low-cost tablets capable of local offline AI inference.</text>
    <text x="0" y="85" font-size="10" font-weight="bold" fill="#9333ea">• Economy:</text>
    <text x="10" y="100" font-size="9.5" fill="#334155">Heavy contractor urgency to curb 15-20% payroll loss.</text>
    <text x="0" y="120" font-size="10" font-weight="bold" fill="#15803d">• Environment &amp; Nature:</text>
    <text x="10" y="135" font-size="9.5" fill="#334155">Abrasive cement &amp; lime wearing finger ridges daily.</text>
    <text x="0" y="155" font-size="10" font-weight="bold" fill="#dc2626">• Politics &amp; Legal:</text>
    <text x="10" y="170" font-size="9.5" fill="#334155">Mandatory statutory muster audits under BOCW Act.</text>
  </g>

  <!-- Quadrant 3: Bottom-Left (Low Impact / Uncertain) -->
  <g transform="translate(55, 340)">
    <text x="0" y="15" font-size="10" font-weight="bold" fill="#2563eb">• Demographics:</text>
    <text x="10" y="30" font-size="9.5" fill="#334155">Inter-trade disputes over daily overtime allocations.</text>
    <text x="0" y="50" font-size="10" font-weight="bold" fill="#16a34a">• Technology:</text>
    <text x="10" y="65" font-size="9.5" fill="#334155">Accidental tablet screen smudge from wet cement gloves.</text>
    <text x="0" y="85" font-size="10" font-weight="bold" fill="#9333ea">• Economy:</text>
    <text x="10" y="100" font-size="9.5" fill="#334155">Minor fluctuations in seasonal daily rental rates.</text>
    <text x="0" y="120" font-size="10" font-weight="bold" fill="#15803d">• Environment &amp; Nature:</text>
    <text x="10" y="135" font-size="9.5" fill="#334155">Dust ingress into tablet speaker port.</text>
    <text x="0" y="155" font-size="10" font-weight="bold" fill="#dc2626">• Politics &amp; Legal:</text>
    <text x="10" y="170" font-size="9.5" fill="#334155">Minor variance in local town planning panchayat permits.</text>
  </g>

  <!-- Quadrant 4: Bottom-Right (Low Impact / Likely to Occur) -->
  <g transform="translate(415, 340)">
    <text x="0" y="15" font-size="10" font-weight="bold" fill="#2563eb">• Demographics:</text>
    <text x="10" y="30" font-size="9.5" fill="#334155">Younger helper workers gradually adopting UPI apps.</text>
    <text x="0" y="50" font-size="10" font-weight="bold" fill="#16a34a">• Technology:</text>
    <text x="10" y="65" font-size="9.5" fill="#334155">Broader availability of lightweight WebAssembly engines.</text>
    <text x="0" y="85" font-size="10" font-weight="bold" fill="#9333ea">• Economy:</text>
    <text x="10" y="100" font-size="9.5" fill="#334155">Steady transition from paper registers to digital spreadsheets.</text>
    <text x="0" y="120" font-size="10" font-weight="bold" fill="#15803d">• Environment &amp; Nature:</text>
    <text x="10" y="135" font-size="9.5" fill="#334155">Gradual elimination of paper waste on construction sites.</text>
    <text x="0" y="155" font-size="10" font-weight="bold" fill="#dc2626">• Politics &amp; Legal:</text>
    <text x="10" y="170" font-size="9.5" fill="#334155">Periodic routine inspections by district labor welfare officers.</text>
  </g>
</svg>"""

print("Generated core STEEP SVGs.")
def get_fig_4_4_activity_system():
    return """<svg viewBox="0 0 850 580" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <text x="425" y="25" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">MAPPING ORGANIZATION ACTIVITY SYSTEM</text>
  
  <!-- Outer Box -->
  <rect x="20" y="38" width="810" height="525" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  
  <!-- Mission Statement Banner -->
  <rect x="225" y="48" width="400" height="55" rx="6" fill="#1b365d"/>
  <text x="425" y="66" fill="#93c5fd" font-size="11" font-weight="bold" text-anchor="middle">OBJECTIVES OR MISSION STATEMENT</text>
  <text x="425" y="82" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">To eliminate attendance fraud and wage disputes on construction sites</text>
  <text x="425" y="95" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">while providing workers transparent proof of work in their own language.</text>
  
  <!-- Column 1: Strategy 1 -->
  <rect x="35" y="115" width="185" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
  <text x="127" y="130" font-size="10" font-weight="bold" fill="#15803d" text-anchor="middle">STRATEGY # 1</text>
  <text x="127" y="145" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Identify Worker Needs</text>
  
  <!-- Column 2: Strategy 2 -->
  <rect x="235" y="115" width="185" height="40" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>
  <text x="327" y="130" font-size="10" font-weight="bold" fill="#0369a1" text-anchor="middle">STRATEGY # 2</text>
  <text x="327" y="145" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Verify Site Attendance</text>
  
  <!-- Column 3: Strategy 3 -->
  <rect x="435" y="115" width="185" height="40" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
  <text x="527" y="130" font-size="10" font-weight="bold" fill="#b45309" text-anchor="middle">STRATEGY # 3</text>
  <text x="527" y="145" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Develop Digital Muster</text>
  
  <!-- Column 4: Strategy 4 -->
  <rect x="635" y="115" width="185" height="40" rx="4" fill="#f3e8ff" stroke="#9333ea" stroke-width="1"/>
  <text x="727" y="130" font-size="10" font-weight="bold" fill="#7e22ce" text-anchor="middle">STRATEGY # 4</text>
  <text x="727" y="145" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Automate Fair Payroll</text>
  
  <!-- Activity Cards Col 1 -->
  <g transform="translate(35, 165)">
    <rect x="0" y="0" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="22" font-size="9.5" font-weight="bold" fill="#0f172a">Study Gate Queues</text>
    <text x="10" y="38" font-size="8.5" fill="#64748b">Understand 7:30 AM morning rush</text>
    
    <rect x="0" y="65" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="87" font-size="9.5" font-weight="bold" fill="#0f172a">Biometric Scanner Limits</text>
    <text x="10" y="103" font-size="8.5" fill="#64748b">Cement abrasion on worker finger ridges</text>
    
    <rect x="0" y="130" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="152" font-size="9.5" font-weight="bold" fill="#0f172a">Survey Device Access</text>
    <text x="10" y="168" font-size="8.5" fill="#64748b">Prevalence of ₹1,000 keypad button phones</text>
    
    <rect x="0" y="195" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="217" font-size="9.5" font-weight="bold" fill="#0f172a">Map Language Diversity</text>
    <text x="10" y="233" font-size="8.5" fill="#64748b">Support Hindi, Tamil, Bengali, Assamese</text>
    
    <rect x="0" y="260" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="282" font-size="9.5" font-weight="bold" fill="#0f172a">Foreman Workflow</text>
    <text x="10" y="298" font-size="8.5" fill="#64748b">Observe 1-2 hr daily muster paperwork</text>
    
    <rect x="0" y="325" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="347" font-size="9.5" font-weight="bold" fill="#0f172a">Wage Dispute Audit</text>
    <text x="10" y="363" font-size="8.5" fill="#64748b">Analyze pocket diary tally mismatches</text>
  </g>

  <!-- Activity Cards Col 2 -->
  <g transform="translate(235, 165)">
    <rect x="0" y="0" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="22" font-size="9.5" font-weight="bold" fill="#0f172a">Gate Face Tablet</text>
    <text x="10" y="38" font-size="8.5" fill="#64748b">3-second contactless scan via YuNet/SFace</text>
    
    <rect x="0" y="65" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="87" font-size="9.5" font-weight="bold" fill="#0f172a">2G Keypad Telephony</text>
    <text x="10" y="103" font-size="8.5" fill="#64748b">1800 Toll-free helpline + daily gate PIN</text>
    
    <rect x="0" y="130" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="152" font-size="9.5" font-weight="bold" fill="#0f172a">GPS Geofence Perimeter</text>
    <text x="10" y="168" font-size="8.5" fill="#64748b">Confirm check-in within 100m of job site</text>
    
    <rect x="0" y="195" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="217" font-size="9.5" font-weight="bold" fill="#0f172a">5-Min Duplicate Filter</text>
    <text x="10" y="233" font-size="8.5" fill="#64748b">Block rapid double-scan attempts</text>
    
    <rect x="0" y="260" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="282" font-size="9.5" font-weight="bold" fill="#0f172a">Manual Review Route</text>
    <text x="10" y="298" font-size="8.5" fill="#64748b">1-tap fail-safe fallback for glare/dust</text>
    
    <rect x="0" y="325" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="347" font-size="9.5" font-weight="bold" fill="#0f172a">Liveness Verification</text>
    <text x="10" y="363" font-size="8.5" fill="#64748b">Prevent photo spoofing attacks at the gate</text>
  </g>

  <!-- Activity Cards Col 3 -->
  <g transform="translate(435, 165)">
    <rect x="0" y="0" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="22" font-size="9.5" font-weight="bold" fill="#0f172a">IndexedDB Local Cache</text>
    <text x="10" y="38" font-size="8.5" fill="#64748b">Full offline punch recording without WiFi</text>
    
    <rect x="0" y="65" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="87" font-size="9.5" font-weight="bold" fill="#0f172a">Supervisor Ledger</text>
    <text x="10" y="103" font-size="8.5" fill="#64748b">Pending status queue for foreman review</text>
    
    <rect x="0" y="130" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="152" font-size="9.5" font-weight="bold" fill="#0f172a">1-Click Batch Verify</text>
    <text x="10" y="168" font-size="8.5" fill="#64748b">Sign off morning shift muster in under 15 min</text>
    
    <rect x="0" y="195" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="217" font-size="9.5" font-weight="bold" fill="#0f172a">Daily Task Scope</text>
    <text x="10" y="233" font-size="8.5" fill="#64748b">Allocate trades to piers, slabs &amp; rebars</text>
    
    <rect x="0" y="260" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="282" font-size="9.5" font-weight="bold" fill="#0f172a">Real-time Telemetry</text>
    <text x="10" y="298" font-size="8.5" fill="#64748b">Live site headcount and active trade ratios</text>
    
    <rect x="0" y="325" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="347" font-size="9.5" font-weight="bold" fill="#0f172a">Role-Based Access</text>
    <text x="10" y="363" font-size="8.5" fill="#64748b">Contractor, Supervisor, Worker permissions</text>
  </g>

  <!-- Activity Cards Col 4 -->
  <g transform="translate(635, 165)">
    <rect x="0" y="0" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="22" font-size="9.5" font-weight="bold" fill="#0f172a">Automated Wage Engine</text>
    <text x="10" y="38" font-size="8.5" fill="#64748b">Wage = (Rate x Hours) - Advances</text>
    
    <rect x="0" y="65" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="87" font-size="9.5" font-weight="bold" fill="#0f172a">Strict Status Isolation</text>
    <text x="10" y="103" font-size="8.5" fill="#64748b">Calculated vs Approved vs Disbursed</text>
    
    <rect x="0" y="130" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="152" font-size="9.5" font-weight="bold" fill="#0f172a">Multilingual SMS Slips</text>
    <text x="10" y="168" font-size="8.5" fill="#64748b">Deliver wage receipts to worker's phone</text>
    
    <rect x="0" y="195" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="217" font-size="9.5" font-weight="bold" fill="#0f172a">Bank NEFT Batch Export</text>
    <text x="10" y="233" font-size="8.5" fill="#64748b">Automated CSV export for electronic payroll</text>
    
    <rect x="0" y="260" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="282" font-size="9.5" font-weight="bold" fill="#0f172a">Photographic Audit Trail</text>
    <text x="10" y="298" font-size="8.5" fill="#64748b">Zero dispute resolution with time/date proof</text>
    
    <rect x="0" y="325" width="185" height="55" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="10" y="347" font-size="9.5" font-weight="bold" fill="#0f172a">Contractor DSR Digest</text>
    <text x="10" y="363" font-size="8.5" fill="#64748b">Daily WhatsApp/Dashboard muster summary</text>
  </g>
</svg>"""

def get_fig_4_5_stakeholder_matrix():
    return """<svg viewBox="0 0 800 620" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <text x="400" y="28" font-size="18" font-weight="bold" text-anchor="middle" fill="#0f172a">STAKEHOLDER MAPPING MATRIX</text>
  
  <!-- Outer Frame -->
  <rect x="40" y="45" width="720" height="530" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <line x1="400" y1="45" x2="400" y2="575" stroke="#000000" stroke-width="2"/>
  <line x1="40" y1="310" x2="760" y2="310" stroke="#000000" stroke-width="2"/>
  
  <!-- Axis Titles -->
  <text x="220" y="38" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f172a">High Interest / Low Influence</text>
  <text x="580" y="38" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f172a">High Interest / High Influence</text>
  <text x="220" y="600" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f172a">Low Interest / Low Influence</text>
  <text x="580" y="600" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f172a">Low Interest / High Influence</text>
  
  <!-- Top Left: High Interest / Low Influence -->
  <g transform="translate(60, 65)">
    <rect x="0" y="0" width="150" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="75" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Daily-Wage Workers</text>
    <text x="75" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Masons, Helpers, Riggers</text>
    
    <rect x="165" y="0" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="242" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Migrant Workers</text>
    <text x="242" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Non-local, Hindi/Bengali</text>

    <rect x="0" y="70" width="150" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="75" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Worker Families</text>
    <text x="75" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Depend on timely remittances</text>
    
    <rect x="165" y="70" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="242" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Apprentice Helpers</text>
    <text x="242" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Unskilled daily earners</text>
  </g>

  <!-- Top Right: High Interest / High Influence -->
  <g transform="translate(420, 65)">
    <rect x="0" y="0" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="77" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Principal Contractor</text>
    <text x="77" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Overall payroll &amp; margins</text>
    
    <rect x="170" y="0" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="247" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Site Civil Foremen</text>
    <text x="247" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Muster sign-off &amp; tasks</text>

    <rect x="0" y="70" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="77" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Project Managers</text>
    <text x="77" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Delivery schedule tracking</text>
    
    <rect x="170" y="70" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="247" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Client Developers</text>
    <text x="247" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Statutory labor compliance</text>
  </g>

  <!-- Bottom Left: Low Interest / Low Influence -->
  <g transform="translate(60, 335)">
    <rect x="0" y="0" width="150" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="75" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Material Suppliers</text>
    <text x="75" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Cement/rebar vendors</text>
    
    <rect x="165" y="0" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="242" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Site Security Guards</text>
    <text x="242" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Physical turnstile entry</text>

    <rect x="0" y="70" width="150" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="75" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Rental Equipment Ops</text>
    <text x="75" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Crane &amp; boom operators</text>
    
    <rect x="165" y="70" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="242" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Nearby Residents</text>
    <text x="242" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">General neighborhood</text>
  </g>

  <!-- Bottom Right: Low Interest / High Influence -->
  <g transform="translate(420, 335)">
    <rect x="0" y="0" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="77" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Labor Welfare Board</text>
    <text x="77" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">BOCW regulations &amp; audits</text>
    
    <rect x="170" y="0" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="247" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Bank NEFT Gateway</text>
    <text x="247" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Disbursement clearinghouse</text>

    <rect x="0" y="70" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="77" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">Telecom Operators</text>
    <text x="77" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Jio/Airtel 2G BTS towers</text>
    
    <rect x="170" y="70" width="155" height="55" rx="6" fill="#fef08a" stroke="#ca8a04"/>
    <text x="247" y="24" font-size="11" font-weight="bold" text-anchor="middle" fill="#854d0e">District Labor Unions</text>
    <text x="247" y="40" font-size="9.5" text-anchor="middle" fill="#713f12">Wage grievance bodies</text>
  </g>
</svg>"""

def get_fig_4_7_stakeholder_priority():
    return """<svg viewBox="0 0 800 620" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <text x="400" y="28" font-size="16" font-weight="bold" text-anchor="middle" fill="#0f172a">Stakeholder Priority Mapping Matrix</text>
  
  <!-- Grid quadrants -->
  <!-- Top Left: Keep Satisfied / Informed -->
  <rect x="50" y="50" width="340" height="250" fill="#38bdf8" rx="6"/>
  <text x="220" y="80" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">High Interest / Low Influence</text>
  <text x="220" y="115" font-size="16" font-weight="bold" fill="#b91c1c" text-anchor="middle">KEEP INFORMED</text>
  <text x="220" y="145" font-size="11" fill="#0f172a" text-anchor="middle">• Daily-wage laborers &amp; masons</text>
  <text x="220" y="165" font-size="11" fill="#0f172a" text-anchor="middle">• Migrant workforce (Hindi/Bengali)</text>
  <text x="220" y="185" font-size="11" fill="#0f172a" text-anchor="middle">• Apprentice helpers &amp; families</text>
  <text x="220" y="220" font-size="10.5" font-weight="bold" fill="#0369a1" text-anchor="middle">Engagement Strategy:</text>
  <text x="220" y="240" font-size="10" fill="#0f172a" text-anchor="middle">Transparent SMS receipts, spoken kiosk feedback</text>

  <!-- Top Right: Engage Closely -->
  <rect x="410" y="50" width="340" height="250" fill="#0284c7" rx="6"/>
  <text x="580" y="80" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">High Interest / High Influence</text>
  <text x="580" y="115" font-size="16" font-weight="bold" fill="#fef08a" text-anchor="middle">ENGAGE CLOSELY</text>
  <text x="580" y="145" font-size="11" fill="#ffffff" text-anchor="middle">• Principal General Contractors</text>
  <text x="580" y="165" font-size="11" fill="#ffffff" text-anchor="middle">• Site Civil Foremen (Muster signers)</text>
  <text x="580" y="185" font-size="11" fill="#ffffff" text-anchor="middle">• Project Directors &amp; Lead PMs</text>
  <text x="580" y="220" font-size="10.5" font-weight="bold" fill="#bae6fd" text-anchor="middle">Engagement Strategy:</text>
  <text x="580" y="240" font-size="10" fill="#ffffff" text-anchor="middle">Fast 15-min muster sign-off, live headcount dashboard</text>

  <!-- Bottom Left: Monitor -->
  <rect x="50" y="320" width="340" height="250" fill="#93c5fd" rx="6"/>
  <text x="220" y="350" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">Low Interest / Low Influence</text>
  <text x="220" y="385" font-size="16" font-weight="bold" fill="#b91c1c" text-anchor="middle">MONITOR (Minimal Effort)</text>
  <text x="220" y="415" font-size="11" fill="#0f172a" text-anchor="middle">• Local cement/aggregate vendors</text>
  <text x="220" y="435" font-size="11" fill="#0f172a" text-anchor="middle">• Site security gate personnel</text>
  <text x="220" y="455" font-size="11" fill="#0f172a" text-anchor="middle">• Surrounding neighbourhood</text>
  <text x="220" y="490" font-size="10.5" font-weight="bold" fill="#0369a1" text-anchor="middle">Engagement Strategy:</text>
  <text x="220" y="510" font-size="10" fill="#0f172a" text-anchor="middle">Basic gate protocols, occasional status checks</text>

  <!-- Bottom Right: Keep Satisfied -->
  <rect x="410" y="320" width="340" height="250" fill="#38bdf8" rx="6"/>
  <text x="580" y="350" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">Low Interest / High Influence</text>
  <text x="580" y="385" font-size="16" font-weight="bold" fill="#15803d" text-anchor="middle">KEEP SATISFIED</text>
  <text x="580" y="415" font-size="11" fill="#0f172a" text-anchor="middle">• Labor Welfare Boards (BOCW)</text>
  <text x="580" y="435" font-size="11" fill="#0f172a" text-anchor="middle">• Telecom cellular providers (Jio/Airtel)</text>
  <text x="580" y="455" font-size="11" fill="#0f172a" text-anchor="middle">• Bank NEFT payment processors</text>
  <text x="580" y="490" font-size="10.5" font-weight="bold" fill="#0369a1" text-anchor="middle">Engagement Strategy:</text>
  <text x="580" y="510" font-size="10" fill="#0f172a" text-anchor="middle">Strict statutory compliance records, audit-ready CSVs</text>
</svg>"""

def get_fig_4_8_reframing():
    return """<svg viewBox="0 0 820 520" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Left Box -->
  <rect x="25" y="70" width="260" height="380" fill="#fef08a" stroke="#ca8a04" stroke-width="2" rx="8"/>
  <rect x="40" y="85" width="230" height="40" fill="#eab308" rx="4"/>
  <text x="155" y="103" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Reframe your opportunities</text>
  <text x="155" y="117" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">and filter one</text>
  
  <text x="40" y="150" font-size="10" font-weight="bold" fill="#854d0e">"How might we create a transparent</text>
  <text x="40" y="165" font-size="10" font-weight="bold" fill="#854d0e">and inclusive workforce system that</text>
  <text x="40" y="180" font-size="10" font-weight="bold" fill="#854d0e">verifies site presence, protects worker</text>
  <text x="40" y="195" font-size="10" font-weight="bold" fill="#854d0e">wages through human review, and</text>
  <text x="40" y="210" font-size="10" font-weight="bold" fill="#854d0e">automates fraud-free payroll across</text>
  <text x="40" y="225" font-size="10" font-weight="bold" fill="#854d0e">low-connectivity construction sites?"</text>
  
  <line x1="40" y1="240" x2="270" y2="240" stroke="#ca8a04" stroke-width="1"/>
  
  <text x="40" y="260" font-size="10" font-weight="bold" fill="#0f172a">1. "How might we prevent proxy</text>
  <text x="55" y="275" font-size="9.5" fill="#334155">attendance on construction sites?"</text>
  
  <text x="40" y="305" font-size="10" font-weight="bold" fill="#0f172a">2. "How might we support workers</text>
  <text x="55" y="320" font-size="9.5" fill="#334155">using basic keypad phones?"</text>
  
  <text x="40" y="350" font-size="10" font-weight="bold" fill="#0f172a">3. "How might we link verified hours</text>
  <text x="55" y="365" font-size="9.5" fill="#334155">directly to transparent payroll?"</text>

  <!-- 3-Circle Venn Diagram -->
  <!-- Outer Dotted Circle (STEEP Context) -->
  <circle cx="560" cy="260" r="215" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="560" y="495" font-size="12" font-weight="bold" fill="#64748b" text-anchor="middle">STEEP Trends &amp; Construction Context</text>

  <!-- Circle 1: Agency's Perspectives (Top) -->
  <circle cx="560" cy="180" r="120" fill="#38bdf8" fill-opacity="0.35" stroke="#0284c7" stroke-width="2"/>
  <text x="560" y="105" font-size="11" font-weight="bold" fill="#0369a1" text-anchor="middle">Agency's Perspectives</text>
  <text x="560" y="120" font-size="9.5" fill="#0369a1" text-anchor="middle">(Contractors &amp; Developers)</text>
  <text x="560" y="140" font-size="8.5" fill="#0f172a" text-anchor="middle">Zero ghost workers</text>
  <text x="560" y="152" font-size="8.5" fill="#0f172a" text-anchor="middle">Audit-ready payroll records</text>
  <text x="560" y="164" font-size="8.5" fill="#0f172a" text-anchor="middle">Real-time site productivity</text>

  <!-- Circle 2: Systems & Processes (Bottom-Left) -->
  <circle cx="490" cy="300" r="120" fill="#4ade80" fill-opacity="0.35" stroke="#16a34a" stroke-width="2"/>
  <text x="460" y="325" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">Systems &amp; Processes</text>
  <text x="460" y="340" font-size="8.5" fill="#0f172a" text-anchor="middle">Offline YuNet/SFace AI</text>
  <text x="460" y="352" font-size="8.5" fill="#0f172a" text-anchor="middle">2G GSM IVR Helpline</text>
  <text x="460" y="364" font-size="8.5" fill="#0f172a" text-anchor="middle">100m GPS Geofence</text>
  <text x="460" y="376" font-size="8.5" fill="#0f172a" text-anchor="middle">Supervisor muster sign-off</text>

  <!-- Circle 3: User's Perspectives (Bottom-Right) -->
  <circle cx="630" cy="300" r="120" fill="#f87171" fill-opacity="0.35" stroke="#dc2626" stroke-width="2"/>
  <text x="660" y="325" font-size="11" font-weight="bold" fill="#b91c1c" text-anchor="middle">User's Perspectives</text>
  <text x="660" y="340" font-size="8.5" fill="#0f172a" text-anchor="middle">Dirty cement hands support</text>
  <text x="660" y="352" font-size="8.5" fill="#0f172a" text-anchor="middle">No wage deduction on scan fail</text>
  <text x="660" y="364" font-size="8.5" fill="#0f172a" text-anchor="middle">Human appeal fallback</text>
  <text x="660" y="376" font-size="8.5" fill="#0f172a" text-anchor="middle">Multilingual SMS receipts</text>

  <!-- Center Intersection: HMW -->
  <rect x="535" y="240" width="50" height="40" fill="#fef08a" stroke="#ca8a04" rx="4"/>
  <text x="560" y="258" font-size="11" font-weight="bold" fill="#854d0e" text-anchor="middle">H</text>
  <text x="560" y="270" font-size="11" font-weight="bold" fill="#854d0e" text-anchor="middle">M W</text>
</svg>"""

print("Generated Activity, Stakeholder, Priority, and Reframing SVGs.")


def get_fig_4_6_stakeholder_links():
    return """<svg viewBox="0 0 850 560" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Title / Canvas Header -->
  <rect x="50" y="15" width="750" height="40" rx="6" fill="#1e293b"/>
  <text x="425" y="41" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">Stakeholder Relationship &amp; Data Flow Architecture</text>

  <!-- Central Hub: BuildEase Core Platform -->
  <rect x="310" y="220" width="230" height="120" rx="12" fill="#0284c7" stroke="#0369a1" stroke-width="3"/>
  <text x="425" y="255" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">BuildEase Core Platform</text>
  <text x="425" y="278" fill="#e0f2fe" font-size="11" text-anchor="middle">AI Edge Verification (YuNet / SFace)</text>
  <text x="425" y="296" fill="#e0f2fe" font-size="11" text-anchor="middle">Offline IndexedDB Sync Engine</text>
  <text x="425" y="314" fill="#e0f2fe" font-size="11" text-anchor="middle">Transparent Payroll Ledger</text>

  <!-- Node 1: Daily Wage Workers (Top-Left) -->
  <rect x="50" y="80" width="210" height="90" rx="8" fill="#15803d" stroke="#166534" stroke-width="2"/>
  <text x="155" y="108" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">Daily-Wage Workers</text>
  <text x="155" y="128" fill="#dcfce7" font-size="11" text-anchor="middle">• Face scan at gate kiosk</text>
  <text x="155" y="145" fill="#dcfce7" font-size="11" text-anchor="middle">• Missed-call on 2G phone</text>
  <text x="155" y="160" fill="#dcfce7" font-size="11" text-anchor="middle">• Receive SMS wage slip</text>

  <!-- Node 2: Site Supervisors & Foremen (Top-Right) -->
  <rect x="590" y="80" width="210" height="90" rx="8" fill="#b45309" stroke="#92400e" stroke-width="2"/>
  <text x="695" y="108" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">Site Supervisors &amp; Foremen</text>
  <text x="695" y="128" fill="#fef3c7" font-size="11" text-anchor="middle">• Mobile muster sign-off</text>
  <text x="695" y="145" fill="#fef3c7" font-size="11" text-anchor="middle">• Approve exception appeals</text>
  <text x="695" y="160" fill="#fef3c7" font-size="11" text-anchor="middle">• Log mid-shift tea advances</text>

  <!-- Node 3: General Contractors / Developers (Bottom-Left) -->
  <rect x="50" y="390" width="210" height="90" rx="8" fill="#4338ca" stroke="#3730a3" stroke-width="2"/>
  <text x="155" y="418" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">Principal Contractors</text>
  <text x="155" y="438" fill="#e0e7ff" font-size="11" text-anchor="middle">• Multi-site executive dash</text>
  <text x="155" y="455" fill="#e0e7ff" font-size="11" text-anchor="middle">• Zero ghost-worker billing</text>
  <text x="155" y="470" fill="#e0e7ff" font-size="11" text-anchor="middle">• 1-click NEFT batch payout</text>

  <!-- Node 4: Telecom & Banking Gateways (Bottom-Right) -->
  <rect x="590" y="390" width="210" height="90" rx="8" fill="#0f766e" stroke="#115e59" stroke-width="2"/>
  <text x="695" y="418" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">Telecom &amp; Bank Gateways</text>
  <text x="695" y="438" fill="#ccfbf1" font-size="11" text-anchor="middle">• GSM IVR 1800 toll-free routing</text>
  <text x="695" y="455" fill="#ccfbf1" font-size="11" text-anchor="middle">• Bulk 5-language SMS slips</text>
  <text x="695" y="470" fill="#ccfbf1" font-size="11" text-anchor="middle">• NPCI / NEFT direct transfers</text>

  <!-- External Statutory: BOCW Welfare Board (Top-Center) -->
  <rect x="335" y="80" width="180" height="55" rx="6" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
  <text x="425" y="103" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">BOCW Welfare Board</text>
  <text x="425" y="122" fill="#475569" font-size="10" text-anchor="middle">Labor Law Audit Records</text>

  <!-- Connection Lines & Arrows -->
  <defs>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284c7" />
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#15803d" />
    </marker>
    <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#b45309" />
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#4338ca" />
    </marker>
    <marker id="arrow-teal" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#0f766e" />
    </marker>
  </defs>

  <!-- Workers <-> Platform -->
  <path d="M 260 140 Q 320 180 340 220" fill="none" stroke="#15803d" stroke-width="2.5" marker-end="url(#arrow-green)"/>
  <text x="260" y="195" font-size="10" font-weight="bold" fill="#15803d">Face Scan / IVR Call</text>

  <path d="M 330 250 Q 240 240 220 170" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrow-blue)"/>
  <text x="210" y="230" font-size="9.5" fill="#0284c7">Audio Voice Prompt</text>

  <!-- Supervisors <-> Platform -->
  <path d="M 590 140 Q 530 180 510 220" fill="none" stroke="#b45309" stroke-width="2.5" marker-end="url(#arrow-amber)"/>
  <text x="560" y="195" font-size="10" font-weight="bold" fill="#b45309">Muster Verification</text>

  <path d="M 520 250 Q 610 240 630 170" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrow-blue)"/>
  <text x="590" y="230" font-size="9.5" fill="#0284c7">Dispute Alerts</text>

  <!-- Contractors <-> Platform -->
  <path d="M 260 420 Q 320 380 340 340" fill="none" stroke="#4338ca" stroke-width="2.5" marker-end="url(#arrow-purple)"/>
  <text x="240" y="375" font-size="10" font-weight="bold" fill="#4338ca">Funds &amp; Budget Auth</text>

  <path d="M 350 340 Q 280 370 240 400" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrow-blue)"/>
  <text x="270" y="355" font-size="9.5" fill="#0284c7">Audited Labor Cost</text>

  <!-- Telecom/Bank <-> Platform -->
  <path d="M 590 420 Q 530 380 510 340" fill="none" stroke="#0f766e" stroke-width="2.5" marker-end="url(#arrow-teal)"/>
  <text x="555" y="375" font-size="10" font-weight="bold" fill="#0f766e">Bank Settlement ACK</text>

  <path d="M 500 340 Q 570 370 610 400" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrow-blue)"/>
  <text x="530" y="355" font-size="9.5" fill="#0284c7">Automated Payout Batches</text>

  <!-- Welfare Board Line -->
  <line x1="425" y1="135" x2="425" y2="220" stroke="#64748b" stroke-width="1.8" stroke-dasharray="4 4" marker-end="url(#arrow-blue)"/>
  <text x="435" y="175" font-size="9.5" fill="#475569">Statutory Logs</text>

  <!-- Legend -->
  <rect x="50" y="505" width="750" height="40" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
  <line x1="70" y1="525" x2="105" y2="525" stroke="#15803d" stroke-width="3"/>
  <text x="115" y="529" font-size="10.5" fill="#334155">Worker Biometrics / IVR</text>

  <line x1="260" y1="525" x2="295" y2="525" stroke="#b45309" stroke-width="3"/>
  <text x="305" y="529" font-size="10.5" fill="#334155">Supervisor Verification</text>

  <line x1="450" y1="525" x2="485" y2="525" stroke="#4338ca" stroke-width="3"/>
  <text x="495" y="529" font-size="10.5" fill="#334155">Payroll Release</text>

  <line x1="620" y1="525" x2="655" y2="525" stroke="#0284c7" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="665" y="529" font-size="10.5" fill="#334155">System Push Alerts</text>
</svg>"""

def get_fig_4_9_empathy_map():
    return """<svg viewBox="0 0 850 620" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Main Title -->
  <rect x="50" y="15" width="750" height="40" rx="6" fill="#1e293b"/>
  <text x="425" y="41" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">Empathy Map Canvas: Murugesan K. (42, Senior Mason)</text>

  <!-- Center Circle / Avatar Head -->
  <circle cx="425" cy="275" r="55" fill="#fef3c7" stroke="#b45309" stroke-width="3"/>
  <text x="425" y="268" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">USER</text>
  <text x="425" y="285" font-size="11" font-weight="bold" fill="#b45309" text-anchor="middle">Murugesan K.</text>
  <text x="425" y="300" font-size="9.5" fill="#78350f" text-anchor="middle">Mason / 20 yrs</text>

  <!-- Quadrant 1: SAYS (Top-Left) -->
  <rect x="50" y="70" width="350" height="185" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
  <rect x="65" y="80" width="90" height="26" rx="4" fill="#15803d"/>
  <text x="110" y="97" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">SAYS</text>
  <text x="70" y="125" font-size="11" font-style="italic" fill="#14532d">"These hands built 50 houses, but can't</text>
  <text x="70" y="142" font-size="11" font-style="italic" fill="#14532d">prove I worked 26 days this month."</text>
  <text x="70" y="166" font-size="11" font-style="italic" fill="#14532d">"The biometric machine rejects my fingers</text>
  <text x="70" y="183" font-size="11" font-style="italic" fill="#14532d">because cement has worn down my lines."</text>
  <text x="70" y="207" font-size="11" font-style="italic" fill="#14532d">"Every Saturday, I argue for ₹1,200 cut</text>
  <text x="70" y="224" font-size="11" font-style="italic" fill="#14532d">as 'late penalty' I never incurred."</text>

  <!-- Quadrant 2: THINKS (Top-Right) -->
  <rect x="450" y="70" width="350" height="185" rx="8" fill="#eff6ff" stroke="#93c5fd" stroke-width="2"/>
  <rect x="465" y="80" width="90" height="26" rx="4" fill="#1d4ed8"/>
  <text x="510" y="97" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">THINKS</text>
  <text x="470" y="125" font-size="11" fill="#1e3a8a">• "Is the supervisor deliberately shorting my</text>
  <text x="470" y="142" font-size="11" fill="#1e3a8a">   hours to pocket the subcontract margin?"</text>
  <text x="470" y="166" font-size="11" fill="#1e3a8a">• "My keypad phone doesn't have internet;</text>
  <text x="470" y="183" font-size="11" fill="#1e3a8a">   will digital apps lock me out of work?"</text>
  <text x="470" y="207" font-size="11" fill="#1e3a8a">• "If I contest my wages aggressively, will I</text>
  <text x="470" y="224" font-size="11" fill="#1e3a8a">   be blacklisted from tomorrow's pour?"</text>

  <!-- Quadrant 3: DOES (Bottom-Left) -->
  <rect x="50" y="275" width="350" height="175" rx="8" fill="#fffbeb" stroke="#fcd34d" stroke-width="2"/>
  <rect x="65" y="285" width="90" height="26" rx="4" fill="#b45309"/>
  <text x="110" y="302" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">DOES</text>
  <text x="70" y="330" font-size="11" fill="#78350f">• Arrives at 7:15 AM, washes dust off hands</text>
  <text x="70" y="347" font-size="11" fill="#78350f">  hoping optical scanner recognizes thumb.</text>
  <text x="70" y="371" font-size="11" fill="#78350f">• Writes manual hours in tiny pocket diary</text>
  <text x="70" y="388" font-size="11" fill="#78350f">  with a stub pencil to keep his own tally.</text>
  <text x="70" y="412" font-size="11" fill="#78350f">• Waits in line 45 minutes on Saturday</text>
  <text x="70" y="429" font-size="11" fill="#78350f">  night for paper envelope cash disbursement.</text>

  <!-- Quadrant 4: FEELS (Bottom-Right) -->
  <rect x="450" y="275" width="350" height="175" rx="8" fill="#fdf2f8" stroke="#f472b6" stroke-width="2"/>
  <rect x="465" y="285" width="90" height="26" rx="4" fill="#be185d"/>
  <text x="510" y="302" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">FEELS</text>
  <text x="470" y="330" font-size="11" fill="#831843">• Humiliated when treated like a cheater</text>
  <text x="470" y="347" font-size="11" fill="#831843">  over 15-minute gate discrepancy.</text>
  <text x="470" y="371" font-size="11" fill="#831843">• Helpless against handwritten muster register</text>
  <text x="470" y="388" font-size="11" fill="#831843">  where pages can be overwritten at will.</text>
  <text x="470" y="412" font-size="11" fill="#831843">• Anxious about paying daughter's school fee</text>
  <text x="470" y="429" font-size="11" fill="#831843">  when weekly cash envelope comes short.</text>

  <!-- PAINS & GAINS Bottom Split -->
  <!-- PAINS -->
  <rect x="50" y="465" width="365" height="135" rx="8" fill="#fef2f2" stroke="#f87171" stroke-width="2"/>
  <rect x="65" y="475" width="100" height="24" rx="4" fill="#dc2626"/>
  <text x="115" y="491" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">PAINS / FEARS</text>
  <text x="70" y="518" font-size="10.5" fill="#991b1b">• Optical fingerprint scanner rejects worn skin (84% fail rate).</text>
  <text x="70" y="535" font-size="10.5" fill="#991b1b">• Arbitrary deductions for tea advances not documented.</text>
  <text x="70" y="552" font-size="10.5" fill="#991b1b">• Fear of technology replacing him or locking him out.</text>
  <text x="70" y="569" font-size="10.5" fill="#991b1b">• Zero written proof of earnings when applying for bank loans.</text>

  <!-- GAINS -->
  <rect x="435" y="465" width="365" height="135" rx="8" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <rect x="450" y="475" width="100" height="24" rx="4" fill="#16a34a"/>
  <text x="500" y="491" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">GAINS / NEEDS</text>
  <text x="455" y="518" font-size="10.5" fill="#166534">• Fast 3-second contactless face scan at site gate.</text>
  <text x="455" y="535" font-size="10.5" fill="#166534">• Automated Tamil/Hindi SMS receipt after daily shift sign-off.</text>
  <text x="455" y="552" font-size="10.5" fill="#166534">• Human supervisor review appeal when camera angle fails.</text>
  <text x="455" y="569" font-size="10.5" fill="#166534">• Exact weekly wage = (₹850 x Days) - Documented Tea Advances.</text>
</svg>"""

def get_fig_4_10_journey_map():
    return """<svg viewBox="0 0 920 640" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Header -->
  <rect x="30" y="15" width="860" height="40" rx="6" fill="#1e293b"/>
  <text x="460" y="41" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">Customer Journey Map: Daily Wage Construction Shift Lifecycle</text>

  <!-- Phase Headers (5 Columns) -->
  <!-- Col 1 -->
  <rect x="30" y="65" width="165" height="35" rx="4" fill="#3b82f6"/>
  <text x="112" y="87" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">1. Gate Check-in</text>
  <text x="112" y="115" fill="#1e40af" font-size="10" font-weight="bold" text-anchor="middle">07:00 - 07:30 AM</text>

  <!-- Col 2 -->
  <rect x="204" y="65" width="165" height="35" rx="4" fill="#0284c7"/>
  <text x="286" y="87" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">2. Tool Talk &amp; Task</text>
  <text x="286" y="115" fill="#0369a1" font-size="10" font-weight="bold" text-anchor="middle">07:30 - 08:00 AM</text>

  <!-- Col 3 -->
  <rect x="378" y="65" width="165" height="35" rx="4" fill="#eab308"/>
  <text x="460" y="87" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">3. Mid-shift Work</text>
  <text x="460" y="115" fill="#854d0e" font-size="10" font-weight="bold" text-anchor="middle">08:00 AM - 01:00 PM</text>

  <!-- Col 4 -->
  <rect x="552" y="65" width="165" height="35" rx="4" fill="#f97316"/>
  <text x="634" y="87" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">4. Gate Check-out</text>
  <text x="634" y="115" fill="#9a3412" font-size="10" font-weight="bold" text-anchor="middle">05:30 - 06:00 PM</text>

  <!-- Col 5 -->
  <rect x="725" y="65" width="165" height="35" rx="4" fill="#15803d"/>
  <text x="807" y="87" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">5. Wage Settlement</text>
  <text x="807" y="115" fill="#166534" font-size="10" font-weight="bold" text-anchor="middle">Saturday Evening</text>

  <!-- Row 1: Actions / Activities -->
  <rect x="30" y="130" width="165" height="90" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="40" y="150" font-size="10" font-weight="bold" fill="#0f172a">Worker Actions:</text>
  <text x="40" y="168" font-size="9.5" fill="#334155">• Stands in gate queue</text>
  <text x="40" y="184" font-size="9.5" fill="#334155">• Scans face at tablet</text>
  <text x="40" y="200" font-size="9.5" fill="#334155">• Or gives 2G missed call</text>

  <rect x="204" y="130" width="165" height="90" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="214" y="150" font-size="10" font-weight="bold" fill="#0f172a">Worker Actions:</text>
  <text x="214" y="168" font-size="9.5" fill="#334155">• Attends safety briefing</text>
  <text x="214" y="184" font-size="9.5" fill="#334155">• Allocated to Pier 28</text>
  <text x="214" y="200" font-size="9.5" fill="#334155">• Receives tools &amp; mortar</text>

  <rect x="378" y="130" width="165" height="90" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="388" y="150" font-size="10" font-weight="bold" fill="#0f172a">Worker Actions:</text>
  <text x="388" y="168" font-size="9.5" fill="#334155">• Lays 650 AAC blocks</text>
  <text x="388" y="184" font-size="9.5" fill="#334155">• Requests ₹100 tea advance</text>
  <text x="388" y="200" font-size="9.5" fill="#334155">• Logged digitally on app</text>

  <rect x="552" y="130" width="165" height="90" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="562" y="150" font-size="10" font-weight="bold" fill="#0f172a">Worker Actions:</text>
  <text x="562" y="168" font-size="9.5" fill="#334155">• Walks to exit gate</text>
  <text x="562" y="184" font-size="9.5" fill="#334155">• 2nd fast face scan</text>
  <text x="562" y="200" font-size="9.5" fill="#334155">• Shift hours locked (9.5h)</text>

  <rect x="725" y="130" width="165" height="90" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="735" y="150" font-size="10" font-weight="bold" fill="#0f172a">Worker Actions:</text>
  <text x="735" y="168" font-size="9.5" fill="#334155">• Receives SMS slip</text>
  <text x="735" y="184" font-size="9.5" fill="#334155">• Collects exact net cash</text>
  <text x="735" y="200" font-size="9.5" fill="#334155">• Or direct bank transfer</text>

  <!-- Row 2: Touchpoints & Tech -->
  <rect x="30" y="230" width="165" height="75" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="40" y="248" font-size="10" font-weight="bold" fill="#1e40af">Touchpoints:</text>
  <text x="40" y="265" font-size="9" fill="#1e3a8a">• Rugged Android Tablet Kiosk</text>
  <text x="40" y="280" font-size="9" fill="#1e3a8a">• YuNet On-device Neural Net</text>
  <text x="40" y="295" font-size="9" fill="#1e3a8a">• GPS 100m Geofence Validator</text>

  <rect x="204" y="230" width="165" height="75" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="214" y="248" font-size="10" font-weight="bold" fill="#1e40af">Touchpoints:</text>
  <text x="214" y="265" font-size="9" fill="#1e3a8a">• Supervisor Tablet Muster App</text>
  <text x="214" y="280" font-size="9" fill="#1e3a8a">• Trade Skill Allocation Board</text>
  <text x="214" y="295" font-size="9" fill="#1e3a8a">• Physical Safety Gear Tagging</text>

  <rect x="378" y="230" width="165" height="75" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="388" y="248" font-size="10" font-weight="bold" fill="#1e40af">Touchpoints:</text>
  <text x="388" y="265" font-size="9" fill="#1e3a8a">• Mobile Tea Advance Tracker</text>
  <text x="388" y="280" font-size="9" fill="#1e3a8a">• Instant SMS Advance Voucher</text>
  <text x="388" y="295" font-size="9.5" fill="#1e3a8a">• Task Progress Metric Engine</text>

  <rect x="552" y="230" width="165" height="75" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="562" y="248" font-size="10" font-weight="bold" fill="#1e40af">Touchpoints:</text>
  <text x="562" y="265" font-size="9" fill="#1e3a8a">• Gate Tablet Kiosk (Exit)</text>
  <text x="562" y="280" font-size="9" fill="#1e3a8a">• Supervisor Exception Screen</text>
  <text x="562" y="295" font-size="9" fill="#1e3a8a">• Local IndexedDB Log Sync</text>

  <rect x="725" y="230" width="165" height="75" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="735" y="248" font-size="10" font-weight="bold" fill="#1e40af">Touchpoints:</text>
  <text x="735" y="265" font-size="9" fill="#1e3a8a">• Automated Payroll Engine</text>
  <text x="735" y="280" font-size="9" fill="#1e3a8a">• GSM 5-Language SMS Gateway</text>
  <text x="735" y="295" font-size="9" fill="#1e3a8a">• NPCI NACH / NEFT Portal</text>

  <!-- Row 3: Emotion Curve -->
  <rect x="30" y="315" width="860" height="150" fill="#f8fafc" stroke="#e2e8f0" rx="6"/>
  <text x="40" y="335" font-size="11" font-weight="bold" fill="#475569">User Experience / Emotion Curve:</text>
  
  <!-- Emotion Gridlines -->
  <line x1="120" y1="360" x2="850" y2="360" stroke="#bbf7d0" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="50" y="364" font-size="9" fill="#16a34a">Delighted (+)</text>

  <line x1="120" y1="395" x2="850" y2="395" stroke="#cbd5e1" stroke-width="1"/>
  <text x="50" y="399" font-size="9" fill="#64748b">Neutral (0)</text>

  <line x1="120" y1="435" x2="850" y2="435" stroke="#fecaca" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="50" y="439" font-size="9" fill="#dc2626">Frustrated (-)</text>

  <!-- Old Way (Red Dotted Curve) -->
  <path d="M 112 430 Q 286 420 460 410 T 634 445 T 807 455" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>
  <text x="760" y="440" font-size="9.5" font-weight="bold" fill="#dc2626">Old Manual System</text>

  <!-- BuildEase Way (Green Solid Curve) -->
  <path d="M 112 370 Q 286 360 460 380 T 634 365 T 807 350" fill="none" stroke="#16a34a" stroke-width="3"/>
  <circle cx="112" cy="370" r="5" fill="#16a34a"/>
  <circle cx="286" cy="360" r="5" fill="#16a34a"/>
  <circle cx="460" cy="380" r="5" fill="#16a34a"/>
  <circle cx="634" cy="365" r="5" fill="#16a34a"/>
  <circle cx="807" cy="350" r="5" fill="#16a34a"/>
  <text x="760" y="340" font-size="9.5" font-weight="bold" fill="#16a34a">BuildEase System</text>

  <!-- Row 4: Opportunities / Innovation -->
  <rect x="30" y="475" width="165" height="150" rx="4" fill="#f0fdf4" stroke="#86efac"/>
  <text x="40" y="495" font-size="10" font-weight="bold" fill="#15803d">Innovation:</text>
  <text x="40" y="515" font-size="9" fill="#14532d">• 3-second face detection</text>
  <text x="40" y="530" font-size="9" fill="#14532d">  prevents gate bottleneck.</text>
  <text x="40" y="550" font-size="9" fill="#14532d">• 2G IVR toll-free ensures</text>
  <text x="40" y="565" font-size="9" fill="#14532d">  non-smartphones work.</text>
  <text x="40" y="585" font-size="9" fill="#14532d">• Audio feedback in Tamil</text>
  <text x="40" y="600" font-size="9" fill="#14532d">  gives immediate assurance.</text>

  <rect x="204" y="475" width="165" height="150" rx="4" fill="#f0fdf4" stroke="#86efac"/>
  <text x="214" y="495" font-size="10" font-weight="bold" fill="#15803d">Innovation:</text>
  <text x="214" y="515" font-size="9" fill="#14532d">• Digital crew muster</text>
  <text x="214" y="530" font-size="9" fill="#14532d">  matches skill to task.</text>
  <text x="214" y="550" font-size="9" fill="#14532d">• Eliminates paper register</text>
  <text x="214" y="565" font-size="9" fill="#14532d">  overwriting risks.</text>
  <text x="214" y="585" font-size="9" fill="#14532d">• Offline cached roster</text>
  <text x="214" y="600" font-size="9" fill="#14532d">  never drops on cell outage.</text>

  <rect x="378" y="475" width="165" height="150" rx="4" fill="#f0fdf4" stroke="#86efac"/>
  <text x="388" y="495" font-size="10" font-weight="bold" fill="#15803d">Innovation:</text>
  <text x="388" y="515" font-size="9" fill="#14532d">• Transparent advance logging</text>
  <text x="388" y="530" font-size="9" fill="#14532d">  ends Saturday arguments.</text>
  <text x="388" y="550" font-size="9" fill="#14532d">• Instant SMS receipt sent</text>
  <text x="388" y="565" font-size="9" fill="#14532d">  to worker phone upon receipt.</text>
  <text x="388" y="585" font-size="9" fill="#14532d">• Geo-tagged task logs</text>
  <text x="388" y="600" font-size="9" fill="#14532d">  verify physical progress.</text>

  <rect x="552" y="475" width="165" height="150" rx="4" fill="#f0fdf4" stroke="#86efac"/>
  <text x="562" y="495" font-size="10" font-weight="bold" fill="#15803d">Innovation:</text>
  <text x="562" y="515" font-size="9" fill="#14532d">• Human appeal review:</text>
  <text x="562" y="530" font-size="9" fill="#14532d">  if camera glare fails,</text>
  <text x="562" y="545" font-size="9" fill="#14532d">  wage is held, not cut.</text>
  <text x="562" y="565" font-size="9" fill="#14532d">• Supervisor verifies</text>
  <text x="562" y="580" font-size="9" fill="#14532d">  exception in 1 tap.</text>
  <text x="562" y="600" font-size="9" fill="#14532d">• Shift timestamp locked.</text>

  <rect x="725" y="475" width="165" height="150" rx="4" fill="#f0fdf4" stroke="#86efac"/>
  <text x="735" y="495" font-size="10" font-weight="bold" fill="#15803d">Innovation:</text>
  <text x="735" y="515" font-size="9" fill="#14532d">• Exact formula calculation:</text>
  <text x="735" y="530" font-size="9" fill="#14532d">  W = (Rate x Hrs) - Adv.</text>
  <text x="735" y="550" font-size="9" fill="#14532d">• Audit-ready CSV for</text>
  <text x="735" y="565" font-size="9" fill="#14532d">  statutory compliance.</text>
  <text x="735" y="585" font-size="9" fill="#14532d">• Preserves human dignity</text>
  <text x="735" y="600" font-size="9" fill="#14532d">  and labor transparency.</text>
</svg>"""

def get_fig_4_12_survey_chart():
    return """<svg viewBox="0 0 850 500" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Title -->
  <rect x="50" y="15" width="750" height="40" rx="6" fill="#1e293b"/>
  <text x="425" y="41" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">Quantitative Desktop Research &amp; Field Survey Analysis (N=120 Sites)</text>

  <!-- Chart 1: Fingerprint Failure on Construction Workers -->
  <rect x="50" y="75" width="350" height="200" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="225" y="100" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Biometric Fingerprint Failure Rate</text>
  <text x="225" y="118" font-size="10" fill="#64748b" text-anchor="middle">Comparison: General Public vs Site Masons</text>

  <!-- Bars -->
  <rect x="90" y="140" width="60" height="100" fill="#94a3b8" rx="4"/>
  <text x="120" y="132" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">4.2%</text>
  <text x="120" y="255" font-size="9.5" fill="#334155" text-anchor="middle">Office Staff</text>

  <rect x="180" y="140" width="60" height="100" fill="#fbbf24" rx="4"/>
  <rect x="180" y="195" width="60" height="45" fill="#f59e0b" rx="4"/>
  <text x="210" y="190" font-size="11" font-weight="bold" fill="#b45309" text-anchor="middle">38%</text>
  <text x="210" y="255" font-size="9.5" fill="#334155" text-anchor="middle">Carpenters</text>

  <rect x="270" y="80" width="60" height="160" fill="#ef4444" rx="4"/>
  <text x="300" y="72" font-size="12" font-weight="bold" fill="#b91c1c" text-anchor="middle">84.2%</text>
  <text x="300" y="255" font-size="9.5" font-weight="bold" fill="#b91c1c" text-anchor="middle">Masons/Helpers</text>
  <text x="300" y="267" font-size="8.5" fill="#dc2626" text-anchor="middle">(Cement dust erosion)</text>

  <!-- Chart 2: Wage Dispute Frequency in Manual Systems -->
  <rect x="450" y="75" width="350" height="200" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="625" y="100" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Weekly Wage Disputes &amp; Deductions</text>
  <text x="625" y="118" font-size="10" fill="#64748b" text-anchor="middle">Source: Field Study across Tiruppur &amp; Coimbatore</text>

  <!-- Donut / Pie Breakdown Representation -->
  <rect x="470" y="140" width="150" height="22" rx="4" fill="#dc2626"/>
  <text x="545" y="155" font-size="10.5" font-weight="bold" fill="#ffffff" text-anchor="middle">68% Disputed Hours</text>

  <rect x="470" y="170" width="150" height="22" rx="4" fill="#f59e0b"/>
  <text x="545" y="185" font-size="10.5" font-weight="bold" fill="#ffffff" text-anchor="middle">21% Unrecorded Tea Adv.</text>

  <rect x="470" y="200" width="150" height="22" rx="4" fill="#16a34a"/>
  <text x="545" y="215" font-size="10.5" font-weight="bold" fill="#ffffff" text-anchor="middle">11% Accurate Settlement</text>

  <!-- Insight box right -->
  <rect x="640" y="135" width="145" height="120" rx="6" fill="#fef2f2" stroke="#fca5a5"/>
  <text x="712" y="155" font-size="10" font-weight="bold" fill="#991b1b" text-anchor="middle">Key Problem:</text>
  <text x="712" y="175" font-size="9" fill="#7f1d1d" text-anchor="middle">Average worker loses</text>
  <text x="712" y="190" font-size="11" font-weight="bold" fill="#b91c1c" text-anchor="middle">₹1,150 / month</text>
  <text x="712" y="208" font-size="9" fill="#7f1d1d" text-anchor="middle">due to handwritten register</text>
  <text x="712" y="222" font-size="9" fill="#7f1d1d" text-anchor="middle">errors and unverified cuts.</text>

  <!-- Bottom Panel: Device Ownership Breakdown -->
  <rect x="50" y="295" width="750" height="185" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
  <text x="425" y="320" font-size="13" font-weight="bold" fill="#14532d" text-anchor="middle">Device Ownership &amp; Digital Literacy Landscape on Construction Sites</text>

  <!-- 3 Stat Blocks -->
  <rect x="80" y="340" width="200" height="120" rx="6" fill="#ffffff" stroke="#bbf7d0"/>
  <text x="180" y="370" font-size="28" font-weight="bold" fill="#b45309" text-anchor="middle">71.8%</text>
  <text x="180" y="395" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">2G Keypad Phones Only</text>
  <text x="180" y="415" font-size="9.5" fill="#64748b" text-anchor="middle">No touchscreen or web browser.</text>
  <text x="180" y="430" font-size="9.5" fill="#15803d" text-anchor="middle">Addressed via 2G GSM IVR.</text>

  <rect x="325" y="340" width="200" height="120" rx="6" fill="#ffffff" stroke="#bbf7d0"/>
  <text x="425" y="370" font-size="28" font-weight="bold" fill="#15803d" text-anchor="middle">98.4%</text>
  <text x="425" y="395" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">SMS Literacy Rate</text>
  <text x="425" y="415" font-size="9.5" fill="#64748b" text-anchor="middle">Workers can read numbers</text>
  <text x="425" y="430" font-size="9.5" fill="#15803d" text-anchor="middle">and Tamil/Hindi wage receipts.</text>

  <rect x="570" y="340" width="200" height="120" rx="6" fill="#ffffff" stroke="#bbf7d0"/>
  <text x="670" y="370" font-size="28" font-weight="bold" fill="#0284c7" text-anchor="middle">94.6%</text>
  <text x="670" y="395" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Edge AI Face Recognition</text>
  <text x="670" y="415" font-size="9.5" fill="#64748b" text-anchor="middle">Verified match rate under</text>
  <text x="670" y="430" font-size="9.5" fill="#0369a1" text-anchor="middle">harsh outdoor lighting/dust.</text>
</svg>"""

def get_fig_4_13_spice():
    return """<svg viewBox="0 0 900 580" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Title -->
  <rect x="50" y="15" width="800" height="40" rx="6" fill="#1e293b"/>
  <text x="450" y="41" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">SPICE Framework Analysis: Construction Workforce Ecosystem</text>

  <!-- 5 Columns for S - P - I - C - E -->
  <!-- Col 1: Social -->
  <rect x="50" y="70" width="150" height="480" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <rect x="60" y="80" width="130" height="35" rx="4" fill="#1d4ed8"/>
  <text x="125" y="102" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">SOCIAL (S)</text>

  <text x="62" y="135" font-size="10.5" font-weight="bold" fill="#1e40af">Ecosystem Context:</text>
  <text x="62" y="155" font-size="9.5" fill="#1e3a8a">• Hierarchical site power:</text>
  <text x="62" y="170" font-size="9" fill="#334155">  Contractor > Subcontractor</text>
  <text x="62" y="185" font-size="9" fill="#334155">  > Maistry > Laborer.</text>

  <text x="62" y="215" font-size="10.5" font-weight="bold" fill="#1e40af">Migrant Dynamics:</text>
  <text x="62" y="235" font-size="9" fill="#334155">• Hindi &amp; Bengali crews</text>
  <text x="62" y="250" font-size="9" fill="#334155">  isolated by language.</text>
  <text x="62" y="265" font-size="9" fill="#334155">• Fear of raising voice.</text>

  <text x="62" y="295" font-size="10.5" font-weight="bold" fill="#1e40af">Community Trust:</text>
  <text x="62" y="315" font-size="9" fill="#334155">• Word-of-mouth reputation</text>
  <text x="62" y="330" font-size="9" fill="#334155">  determines gang hiring.</text>

  <rect x="58" y="380" width="134" height="155" rx="4" fill="#dbeafe"/>
  <text x="125" y="405" font-size="10" font-weight="bold" fill="#1e40af" text-anchor="middle">Design Solution:</text>
  <text x="65" y="428" font-size="9" fill="#1e3a8a">• 5 regional languages</text>
  <text x="65" y="445" font-size="9" fill="#1e3a8a">• Audio verification prompts</text>
  <text x="65" y="462" font-size="9" fill="#1e3a8a">• Non-confrontational</text>
  <text x="65" y="477" font-size="9" fill="#1e3a8a">  dispute log engine</text>
  <text x="65" y="494" font-size="9" fill="#1e3a8a">• Restores mutual dignity</text>

  <!-- Col 2: Physical -->
  <rect x="212" y="70" width="150" height="480" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
  <rect x="222" y="80" width="130" height="35" rx="4" fill="#b91c1c"/>
  <text x="287" y="102" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">PHYSICAL (P)</text>

  <text x="224" y="135" font-size="10.5" font-weight="bold" fill="#991b1b">Harsh Environment:</text>
  <text x="224" y="155" font-size="9" fill="#334155">• Flying cement dust,</text>
  <text x="224" y="170" font-size="9" fill="#334155">  slurry, wet aggregate.</text>
  <text x="224" y="185" font-size="9" fill="#334155">• Worn epidermal ridges.</text>

  <text x="224" y="215" font-size="10.5" font-weight="bold" fill="#991b1b">Lighting &amp; Power:</text>
  <text x="224" y="235" font-size="9" fill="#334155">• Harsh direct sunlight,</text>
  <text x="224" y="250" font-size="9" fill="#334155">  noon glare, shadows.</text>
  <text x="224" y="265" font-size="9" fill="#334155">• Frequent power outages.</text>

  <text x="224" y="295" font-size="10.5" font-weight="bold" fill="#991b1b">Mobility:</text>
  <text x="224" y="315" font-size="9" fill="#334155">• Workers carry steel/bags</text>
  <text x="224" y="330" font-size="9" fill="#334155">  cannot carry devices.</text>

  <rect x="220" y="380" width="134" height="155" rx="4" fill="#fee2e2"/>
  <text x="287" y="405" font-size="10" font-weight="bold" fill="#991b1b" text-anchor="middle">Design Solution:</text>
  <text x="227" y="428" font-size="9" fill="#7f1d1d">• IP65 ruggedized tablet</text>
  <text x="227" y="445" font-size="9" fill="#7f1d1d">• Contactless 3-sec face</text>
  <text x="227" y="462" font-size="9" fill="#7f1d1d">  recognition (no touching)</text>
  <text x="227" y="479" font-size="9" fill="#7f1d1d">• High-contrast outdoor UI</text>
  <text x="227" y="496" font-size="9" fill="#7f1d1d">• 8hr internal battery</text>

  <!-- Col 3: Identity / Psychological -->
  <rect x="375" y="70" width="150" height="480" rx="8" fill="#fdf4ff" stroke="#a855f7" stroke-width="2"/>
  <rect x="385" y="80" width="130" height="35" rx="4" fill="#7e22ce"/>
  <text x="450" y="102" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">IDENTITY (I)</text>

  <text x="387" y="135" font-size="10.5" font-weight="bold" fill="#6b21a8">Worker Dignity:</text>
  <text x="387" y="155" font-size="9" fill="#334155">• Craftsmen take pride in</text>
  <text x="387" y="170" font-size="9" fill="#334155">  structural masonry.</text>
  <text x="387" y="185" font-size="9" fill="#334155">• Resent being called slack.</text>

  <text x="387" y="215" font-size="10.5" font-weight="bold" fill="#6b21a8">Anxiety &amp; Trust:</text>
  <text x="387" y="235" font-size="9" fill="#334155">• Tech skepticism ("Will this</text>
  <text x="387" y="250" font-size="9" fill="#334155">  machine steal my wages?")</text>
  <text x="387" y="265" font-size="9" fill="#334155">• Vulnerability to cuts.</text>

  <text x="387" y="295" font-size="10.5" font-weight="bold" fill="#6b21a8">Trade Recognition:</text>
  <text x="387" y="315" font-size="9" fill="#334155">• Masons vs Helpers vs</text>
  <text x="387" y="330" font-size="9" fill="#334155">  Carpenters wage grade.</text>

  <rect x="383" y="380" width="134" height="155" rx="4" fill="#f3e8ff"/>
  <text x="450" y="405" font-size="10" font-weight="bold" fill="#6b21a8" text-anchor="middle">Design Solution:</text>
  <text x="390" y="428" font-size="9" fill="#581c87">• Visual profile photo card</text>
  <text x="390" y="445" font-size="9" fill="#581c87">• Certified trade skill badge</text>
  <text x="390" y="462" font-size="9" fill="#581c87">• Wage transparency ledger</text>
  <text x="390" y="479" font-size="9" fill="#581c87">• Never cuts wages without</text>
  <text x="390" y="496" font-size="9" fill="#581c87">  human supervisor review</text>

  <!-- Col 4: Communication -->
  <rect x="537" y="70" width="150" height="480" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
  <rect x="547" y="80" width="130" height="35" rx="4" fill="#b45309"/>
  <text x="612" y="102" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">COMM (C)</text>

  <text x="549" y="135" font-size="10.5" font-weight="bold" fill="#92400e">Cellular Constraints:</text>
  <text x="549" y="155" font-size="9" fill="#334155">• Deep basement pits &amp;</text>
  <text x="549" y="170" font-size="9" fill="#334155">  remote sites have 0 bar.</text>
  <text x="549" y="185" font-size="9" fill="#334155">• 2G GSM dominance (72%).</text>

  <text x="549" y="215" font-size="10.5" font-weight="bold" fill="#92400e">Language Barrier:</text>
  <text x="549" y="235" font-size="9" fill="#334155">• Workers speak regional</text>
  <text x="549" y="250" font-size="9" fill="#334155">  dialects; English app fails.</text>

  <text x="549" y="280" font-size="10.5" font-weight="bold" fill="#92400e">Verification Loop:</text>
  <text x="549" y="300" font-size="9" fill="#334155">• Written slip provides peace</text>
  <text x="549" y="315" font-size="9" fill="#334155">  of mind for families.</text>

  <rect x="545" y="380" width="134" height="155" rx="4" fill="#fef3c7"/>
  <text x="612" y="405" font-size="10" font-weight="bold" fill="#92400e" text-anchor="middle">Design Solution:</text>
  <text x="552" y="428" font-size="9" fill="#78350f">• Toll-free 1800 missed call</text>
  <text x="552" y="445" font-size="9" fill="#78350f">• Automated multi-lingual</text>
  <text x="552" y="460" font-size="9" fill="#78350f">  SMS wage receipt</text>
  <text x="552" y="477" font-size="9" fill="#78350f">• Offline IndexedDB sync</text>
  <text x="552" y="494" font-size="9" fill="#78350f">  when network resumes</text>

  <!-- Col 5: Economic -->
  <rect x="700" y="70" width="150" height="480" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <rect x="710" y="80" width="130" height="35" rx="4" fill="#15803d"/>
  <text x="775" y="102" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">ECONOMIC (E)</text>

  <text x="712" y="135" font-size="10.5" font-weight="bold" fill="#166534">Daily Subsistence:</text>
  <text x="712" y="155" font-size="9" fill="#334155">• Living wage is ₹700-₹900.</text>
  <text x="712" y="170" font-size="9" fill="#334155">• Missing ₹150 means skipping</text>
  <text x="712" y="185" font-size="9" fill="#334155">  groceries or medicine.</text>

  <text x="712" y="215" font-size="10.5" font-weight="bold" fill="#166534">Contractor Leakage:</text>
  <text x="712" y="235" font-size="9" fill="#334155">• 12% ghost-worker padding</text>
  <text x="712" y="250" font-size="9" fill="#334155">  in manual muster rolls.</text>
  <text x="712" y="265" font-size="9" fill="#334155">• ₹4.2 Lakhs loss / project.</text>

  <text x="712" y="295" font-size="10.5" font-weight="bold" fill="#166534">Statutory Risks:</text>
  <text x="712" y="315" font-size="9" fill="#334155">• Penalties for labor law</text>
  <text x="712" y="330" font-size="9" fill="#334155">  non-compliance audits.</text>

  <rect x="708" y="380" width="134" height="155" rx="4" fill="#dcfce7"/>
  <text x="775" y="405" font-size="10" font-weight="bold" fill="#166534" text-anchor="middle">Design Solution:</text>
  <text x="715" y="428" font-size="9" fill="#14532d">• Math formula wage run</text>
  <text x="715" y="445" font-size="9" fill="#14532d">• Zero ghost-worker billing</text>
  <text x="715" y="462" font-size="9" fill="#14532d">• 1-click NEFT / cash export</text>
  <text x="715" y="479" font-size="9" fill="#14532d">• BOCW compliance audit CSV</text>
  <text x="715" y="496" font-size="9" fill="#14532d">• 100% wage entitlement</text>
</svg>"""

def get_fig_4_14_persona():
    return """<svg viewBox="0 0 850 580" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Title -->
  <rect x="50" y="15" width="750" height="40" rx="6" fill="#1e293b"/>
  <text x="425" y="41" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">User Persona Canvas: Primary End-User</text>

  <!-- Left Card: Bio, Demographic & Quote -->
  <rect x="50" y="70" width="280" height="490" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Avatar Circle -->
  <circle cx="190" cy="135" r="45" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
  <circle cx="190" cy="120" r="18" fill="#b45309"/>
  <path d="M 165 152 C 165 138 215 138 215 152 Z" fill="#b45309"/>

  <text x="190" y="200" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">Murugesan K.</text>
  <text x="190" y="218" font-size="12" font-weight="bold" fill="#b45309" text-anchor="middle">Senior Mason (Maistry Grade)</text>
  <text x="190" y="235" font-size="11" fill="#64748b" text-anchor="middle">Tiruppur / Erode Site Region</text>

  <!-- Demographics Table -->
  <line x1="70" y1="250" x2="310" y2="250" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="75" y="270" font-size="10.5" font-weight="bold" fill="#334155">Age:</text>
  <text x="180" y="270" font-size="10.5" fill="#0f172a">42 Years</text>

  <text x="75" y="292" font-size="10.5" font-weight="bold" fill="#334155">Experience:</text>
  <text x="180" y="292" font-size="10.5" fill="#0f172a">20 Years in Masonry</text>

  <text x="75" y="314" font-size="10.5" font-weight="bold" fill="#334155">Daily Wage:</text>
  <text x="180" y="314" font-size="10.5" font-weight="bold" fill="#15803d">₹850 / 8-hour shift</text>

  <text x="75" y="336" font-size="10.5" font-weight="bold" fill="#334155">Device:</text>
  <text x="180" y="336" font-size="10.5" fill="#0f172a">Nokia 105 (2G Keypad)</text>

  <text x="75" y="358" font-size="10.5" font-weight="bold" fill="#334155">Education:</text>
  <text x="180" y="358" font-size="10.5" fill="#0f172a">Primary (Tamil medium)</text>

  <text x="75" y="380" font-size="10.5" font-weight="bold" fill="#334155">Family:</text>
  <text x="180" y="380" font-size="10.5" fill="#0f172a">Wife, 2 school children</text>

  <!-- User Quote Box -->
  <rect x="65" y="405" width="250" height="135" rx="6" fill="#fef3c7" stroke="#fcd34d"/>
  <text x="75" y="425" font-size="10" font-weight="bold" fill="#92400e">VERBATIM FIELD QUOTE:</text>
  <text x="75" y="445" font-size="10" font-style="italic" fill="#78350f">"These hands built 50 houses</text>
  <text x="75" y="462" font-size="10" font-style="italic" fill="#78350f">in this town, but at the end of</text>
  <text x="75" y="479" font-size="10" font-style="italic" fill="#78350f">the month, I have to beg for my</text>
  <text x="75" y="496" font-size="10" font-style="italic" fill="#78350f">own hard-earned wages. Give me</text>
  <text x="75" y="513" font-size="10" font-style="italic" fill="#78350f">proof that nobody can tamper with."</text>

  <!-- Right Cards: Goals, Frustrations, Tech Proficiency -->
  <!-- Top Right: Goals & Motivations -->
  <rect x="350" y="70" width="450" height="150" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
  <rect x="365" y="80" width="160" height="26" rx="4" fill="#15803d"/>
  <text x="445" y="97" font-size="11.5" font-weight="bold" fill="#ffffff" text-anchor="middle">GOALS &amp; MOTIVATIONS</text>
  <text x="370" y="125" font-size="10.5" fill="#14532d">• Secure full entitlement of his ₹850/day wage without arbitrary deductions.</text>
  <text x="370" y="145" font-size="10.5" fill="#14532d">• Receive instant printed/SMS proof of hours worked to show to family.</text>
  <text x="370" y="165" font-size="10.5" fill="#14532d">• Protect his standing and pride as a skilled craftsman without begging supervisors.</text>
  <text x="370" y="185" font-size="10.5" fill="#14532d">• Ensure tea and meal advances (₹50-₹100) are recorded accurately and fairly.</text>

  <!-- Middle Right: Frustrations & Pain Points -->
  <rect x="350" y="235" width="450" height="150" rx="8" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
  <rect x="365" y="245" width="160" height="26" rx="4" fill="#dc2626"/>
  <text x="445" y="262" font-size="11.5" font-weight="bold" fill="#ffffff" text-anchor="middle">FRUSTRATIONS &amp; PAINS</text>
  <text x="370" y="290" font-size="10.5" fill="#991b1b">• Fingerprint scanners fail repeatedly because masonry abrasive dust erodes fingertips.</text>
  <text x="370" y="310" font-size="10.5" fill="#991b1b">• Being marked absent on days he worked 9 hours due to optical scanner rejection.</text>
  <text x="370" y="330" font-size="10.5" fill="#991b1b">• Handwritten muster register pages can be modified, torn, or manipulated.</text>
  <text x="370" y="350" font-size="10.5" fill="#991b1b">• Lack of smartphone makes modern app-based attendance portals inaccessible.</text>

  <!-- Bottom Right: Tech Proficiency & Environment -->
  <rect x="350" y="400" width="450" height="160" rx="8" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
  <rect x="365" y="410" width="200" height="26" rx="4" fill="#1d4ed8"/>
  <text x="465" y="427" font-size="11.5" font-weight="bold" fill="#ffffff" text-anchor="middle">TECH PROFICIENCY &amp; CHANNELS</text>

  <!-- Proficiency Bars -->
  <text x="370" y="455" font-size="10" font-weight="bold" fill="#334155">2G Keypad Calling / IVR:</text>
  <rect x="520" y="445" width="250" height="12" rx="6" fill="#e2e8f0"/>
  <rect x="520" y="445" width="235" height="12" rx="6" fill="#15803d"/>
  <text x="780" y="455" font-size="9" font-weight="bold" fill="#15803d">95%</text>

  <text x="370" y="480" font-size="10" font-weight="bold" fill="#334155">Reading SMS (Numbers/Tamil):</text>
  <rect x="520" y="470" width="250" height="12" rx="6" fill="#e2e8f0"/>
  <rect x="520" y="470" width="220" height="12" rx="6" fill="#15803d"/>
  <text x="780" y="480" font-size="9" font-weight="bold" fill="#15803d">88%</text>

  <text x="370" y="505" font-size="10" font-weight="bold" fill="#334155">Smartphone App Usage:</text>
  <rect x="520" y="495" width="250" height="12" rx="6" fill="#e2e8f0"/>
  <rect x="520" y="495" width="40" height="12" rx="6" fill="#ef4444"/>
  <text x="780" y="505" font-size="9" font-weight="bold" fill="#ef4444">16%</text>

  <text x="370" y="535" font-size="10" font-weight="bold" fill="#1e40af">BuildEase Channel Fit:</text>
  <text x="500" y="535" font-size="9.5" fill="#1e3a8a">Gate Face Tablet Kiosk (3s) + 2G Toll-Free Missed Call + SMS Slip</text>
</svg>"""

def get_fig_4_15_storyboard():
    return """<svg viewBox="0 0 920 620" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Title -->
  <rect x="30" y="15" width="860" height="40" rx="6" fill="#1e293b"/>
  <text x="460" y="41" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">Storyboard: A Day on Construction Site Transformed by BuildEase</text>

  <!-- 6 Storyboard Frames (2 Rows x 3 Cols) -->
  <!-- Frame 1: Dawn Arrival -->
  <rect x="30" y="70" width="270" height="245" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <rect x="30" y="70" width="270" height="28" rx="8" fill="#3b82f6"/>
  <text x="45" y="89" fill="#ffffff" font-size="11" font-weight="bold">Frame 1: 07:15 AM — Gate Arrival</text>
  <!-- Frame 1 Sketch -->
  <circle cx="165" cy="150" r="28" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
  <path d="M 140 195 C 140 178 190 178 190 195 Z" fill="#64748b"/>
  <rect x="185" y="120" width="60" height="80" rx="4" fill="#0284c7"/>
  <circle cx="215" cy="140" r="10" fill="#ffffff"/>
  <line x1="165" y1="150" x2="215" y2="140" stroke="#15803d" stroke-dasharray="3 3"/>
  <!-- Caption -->
  <rect x="40" y="210" width="250" height="95" rx="4" fill="#eff6ff"/>
  <text x="45" y="228" font-size="10" font-weight="bold" fill="#1e40af">Arrival with Cement-Dust Hands</text>
  <text x="45" y="244" font-size="9" fill="#334155">Murugesan walks up to gate tablet kiosk.</text>
  <text x="45" y="258" font-size="9" fill="#334155">No fingerprint optical scanner needed.</text>
  <text x="45" y="272" font-size="9" fill="#15803d" font-weight="bold">YuNet neural net detects face in 3s.</text>
  <text x="45" y="286" font-size="9" fill="#334155">Audio chime speaks: "Vanakkam Murugesan!"</text>

  <!-- Frame 2: Non-smartphone Alternative -->
  <rect x="325" y="70" width="270" height="245" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <rect x="325" y="70" width="270" height="28" rx="8" fill="#0284c7"/>
  <text x="340" y="89" fill="#ffffff" font-size="11" font-weight="bold">Frame 2: 07:20 AM — 2G Phone Option</text>
  <!-- Frame 2 Sketch -->
  <rect x="435" y="115" width="50" height="85" rx="6" fill="#1e293b"/>
  <rect x="443" y="123" width="34" height="30" fill="#a7f3d0"/>
  <circle cx="452" cy="165" r="3" fill="#ffffff"/>
  <circle cx="460" cy="165" r="3" fill="#ffffff"/>
  <circle cx="468" cy="165" r="3" fill="#ffffff"/>
  <circle cx="452" cy="175" r="3" fill="#ffffff"/>
  <circle cx="460" cy="175" r="3" fill="#ffffff"/>
  <circle cx="468" cy="175" r="3" fill="#ffffff"/>
  <!-- Caption -->
  <rect x="335" y="210" width="250" height="95" rx="4" fill="#eff6ff"/>
  <text x="340" y="228" font-size="10" font-weight="bold" fill="#0369a1">Inclusion for Keypad Users</text>
  <text x="340" y="244" font-size="9" fill="#334155">Fellow helper Raju has a Nokia 105.</text>
  <text x="340" y="258" font-size="9" fill="#334155">Dials toll-free 1800 number from gate.</text>
  <text x="340" y="272" font-size="9" fill="#0369a1" font-weight="bold">Enters Gate PIN displayed on chalkboard.</text>
  <text x="340" y="286" font-size="9" fill="#334155">Muster records check-in without mobile web.</text>

  <!-- Frame 3: Work & Mid-Day Advance -->
  <rect x="620" y="70" width="270" height="245" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <rect x="620" y="70" width="270" height="28" rx="8" fill="#d97706"/>
  <text x="635" y="89" fill="#ffffff" font-size="11" font-weight="bold">Frame 3: 01:00 PM — Tea Advance</text>
  <!-- Frame 3 Sketch -->
  <rect x="710" y="115" width="90" height="60" rx="4" fill="#fef08a" stroke="#ca8a04"/>
  <text x="755" y="145" font-size="14" font-weight="bold" fill="#854d0e" text-anchor="middle">₹100</text>
  <text x="755" y="160" font-size="9" fill="#854d0e" text-anchor="middle">Tea &amp; Lunch Advance</text>
  <!-- Caption -->
  <rect x="630" y="210" width="250" height="95" rx="4" fill="#fefce8"/>
  <text x="635" y="228" font-size="10" font-weight="bold" fill="#b45309">Transparent Instant Logging</text>
  <text x="635" y="244" font-size="9" fill="#334155">Murugesan needs ₹100 for canteen meal.</text>
  <text x="635" y="258" font-size="9" fill="#334155">Supervisor logs ₹100 advance on mobile app.</text>
  <text x="635" y="272" font-size="9" fill="#b45309" font-weight="bold">Worker's phone receives instant SMS confirmation.</text>
  <text x="635" y="286" font-size="9" fill="#334155">Eliminates end-of-month deduction disputes.</text>

  <!-- Frame 4: Evening Check-out & Fail Safe -->
  <rect x="30" y="340" width="270" height="255" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <rect x="30" y="340" width="270" height="28" rx="8" fill="#4338ca"/>
  <text x="45" y="359" fill="#ffffff" font-size="11" font-weight="bold">Frame 4: 05:30 PM — Check-out &amp; Fallback</text>
  <!-- Frame 4 Sketch -->
  <rect x="110" y="380" width="110" height="50" rx="4" fill="#fee2e2" stroke="#ef4444"/>
  <text x="165" y="405" font-size="10" font-weight="bold" fill="#991b1b" text-anchor="middle">Dust Glare Scan Fail</text>
  <text x="165" y="420" font-size="8.5" fill="#b91c1c" text-anchor="middle">Held for Human Review</text>
  <!-- Caption -->
  <rect x="40" y="445" width="250" height="140" rx="4" fill="#fef2f2"/>
  <text x="45" y="463" font-size="10" font-weight="bold" fill="#991b1b">Fail-Safe Wage Protection</text>
  <text x="45" y="480" font-size="9" fill="#334155">Heavy dust on camera lens flags uncertain match.</text>
  <text x="45" y="495" font-size="9" fill="#334155">System DOES NOT deduct hours or mark absent.</text>
  <text x="45" y="510" font-size="9" fill="#991b1b" font-weight="bold">Flags record into supervisor "Pending Review".</text>
  <text x="45" y="525" font-size="9" fill="#334155">Protects worker entitlement with human appeal.</text>
  <text x="45" y="540" font-size="9" fill="#334155">Worker heads home confident.</text>

  <!-- Frame 5: Supervisor Sign-off -->
  <rect x="325" y="340" width="270" height="255" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <rect x="325" y="340" width="270" height="28" rx="8" fill="#059669"/>
  <text x="340" y="359" fill="#ffffff" font-size="11" font-weight="bold">Frame 5: 06:15 PM — 15-min Muster Sign-off</text>
  <!-- Frame 5 Sketch -->
  <rect x="390" y="380" width="140" height="55" rx="6" fill="#ecfdf5" stroke="#10b981"/>
  <circle cx="415" cy="407" r="12" fill="#10b981"/>
  <path d="M 409 407 L 413 411 L 421 403" fill="none" stroke="#ffffff" stroke-width="2.5"/>
  <text x="440" y="402" font-size="10" font-weight="bold" fill="#065f46">Muster Approved</text>
  <text x="440" y="417" font-size="8.5" fill="#047857">68 Crew Members Locked</text>
  <!-- Caption -->
  <rect x="335" y="445" width="250" height="140" rx="4" fill="#ecfdf5"/>
  <text x="340" y="463" font-size="10" font-weight="bold" fill="#047857">Digital Foreman Audit</text>
  <text x="340" y="480" font-size="9" fill="#334155">Supervisor reviews exception queue on tablet.</text>
  <text x="340" y="495" font-size="9" fill="#334155">Confirms Murugesan's shift at Pier 28.</text>
  <text x="340" y="510" font-size="9" fill="#047857" font-weight="bold">Signs digital muster in under 15 minutes.</text>
  <text x="340" y="525" font-size="9" fill="#334155">Replaces 2-hour painful manual register tally.</text>
  <text x="340" y="540" font-size="9" fill="#334155">Syncs immediately to cloud or offline ledger.</text>

  <!-- Frame 6: Saturday Transparent Payout -->
  <rect x="620" y="340" width="270" height="255" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <rect x="620" y="340" width="270" height="28" rx="8" fill="#15803d"/>
  <text x="635" y="359" fill="#ffffff" font-size="11" font-weight="bold">Frame 6: Saturday — Wage Slip &amp; Respect</text>
  <!-- Frame 6 Sketch -->
  <rect x="700" y="380" width="110" height="55" rx="4" fill="#15803d"/>
  <text x="755" y="405" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">₹5,000</text>
  <text x="755" y="420" font-size="9" fill="#dcfce7" text-anchor="middle">Net Pay Disbursed</text>
  <!-- Caption -->
  <rect x="630" y="445" width="250" height="140" rx="4" fill="#f0fdf4"/>
  <text x="635" y="463" font-size="10" font-weight="bold" fill="#15803d">Dignity &amp; Zero Dispute Settlement</text>
  <text x="635" y="480" font-size="9" fill="#334155">Murugesan receives SMS in Tamil:</text>
  <text x="635" y="495" font-size="9" fill="#14532d" font-weight="bold">"Shift 6 days = ₹5,100; Adv = ₹100; Net = ₹5,000"</text>
  <text x="635" y="510" font-size="9" fill="#334155">Cash envelope matches SMS slip to the rupee.</text>
  <text x="635" y="525" font-size="9" fill="#334155">Zero arguments. Zero stolen hours.</text>
  <text x="635" y="540" font-size="9" fill="#15803d" font-weight="bold">Murugesan returns home with dignity and pride.</text>
</svg>"""

def get_fig_5_1_lofi():
    return """<svg viewBox="0 0 880 540" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:'Times New Roman', serif;">
  <!-- Title -->
  <rect x="40" y="15" width="800" height="40" rx="6" fill="#1e293b"/>
  <text x="440" y="41" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">Figure 5.1: Low-Fidelity Paper Prototype &amp; Interface Wireframe Sketches</text>

  <!-- Screen 1: Gate Kiosk Wireframe -->
  <rect x="40" y="70" width="250" height="440" rx="10" fill="#ffffff" stroke="#475569" stroke-width="2"/>
  <rect x="40" y="70" width="250" height="35" rx="10" fill="#cbd5e1"/>
  <circle cx="65" cy="88" r="6" fill="#ef4444"/>
  <circle cx="85" cy="88" r="6" fill="#f59e0b"/>
  <circle cx="105" cy="88" r="6" fill="#10b981"/>
  <text x="175" y="92" font-size="10.5" font-weight="bold" fill="#1e293b" text-anchor="middle">KIOSK FACE SCAN</text>

  <!-- Face Target Wireframe -->
  <rect x="65" y="125" width="200" height="180" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-dasharray="6 4" stroke-width="2"/>
  <ellipse cx="165" cy="205" rx="55" ry="70" fill="none" stroke="#64748b" stroke-width="2"/>
  <text x="165" y="325" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="middle">[ Align Face Inside Oval ]</text>
  <text x="165" y="342" font-size="9" fill="#64748b" text-anchor="middle">AI Edge Verification (YuNet)</text>

  <!-- Wireframe status -->
  <rect x="65" y="365" width="200" height="50" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>
  <text x="75" y="385" font-size="10" font-weight="bold" fill="#15803d">✓ Face Matched: Murugesan K.</text>
  <text x="75" y="402" font-size="9" fill="#475569">Shift Start: 07:18 AM | Pier 28</text>

  <rect x="65" y="430" width="200" height="35" rx="6" fill="#cbd5e1"/>
  <text x="165" y="452" font-size="10" font-weight="bold" fill="#1e293b" text-anchor="middle">[ Print / SMS Confirmation ]</text>
  <text x="165" y="490" font-size="9" font-style="italic" fill="#64748b" text-anchor="middle">Gate Tablet Kiosk UI Wireframe</text>

  <!-- Screen 2: Supervisor Mobile Muster Wireframe -->
  <rect x="315" y="70" width="250" height="440" rx="10" fill="#ffffff" stroke="#475569" stroke-width="2"/>
  <rect x="315" y="70" width="250" height="35" rx="10" fill="#cbd5e1"/>
  <text x="440" y="92" font-size="10.5" font-weight="bold" fill="#1e293b" text-anchor="middle">SUPERVISOR MUSTER</text>

  <rect x="330" y="115" width="220" height="30" rx="4" fill="#e2e8f0"/>
  <text x="340" y="134" font-size="9.5" font-weight="bold" fill="#334155">Site: Metro Corridor #28</text>
  <text x="500" y="134" font-size="9.5" font-weight="bold" fill="#15803d">68 Active</text>

  <!-- List items -->
  <rect x="330" y="155" width="220" height="45" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="340" y="173" font-size="9.5" font-weight="bold" fill="#0f172a">Murugesan K. (Mason)</text>
  <text x="340" y="190" font-size="8.5" fill="#15803d">07:18 AM - In (9.5h)</text>
  <rect x="490" y="165" width="50" height="25" rx="4" fill="#15803d"/>
  <text x="515" y="181" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Verify</text>

  <rect x="330" y="210" width="220" height="45" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="340" y="228" font-size="9.5" font-weight="bold" fill="#0f172a">Raju M. (Helper - 2G)</text>
  <text x="340" y="245" font-size="8.5" fill="#d97706">07:22 AM - IVR Call</text>
  <rect x="490" y="220" width="50" height="25" rx="4" fill="#15803d"/>
  <text x="515" y="236" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Verify</text>

  <rect x="330" y="265" width="220" height="45" rx="4" fill="#fef2f2" stroke="#fca5a5"/>
  <text x="340" y="283" font-size="9.5" font-weight="bold" fill="#991b1b">Karthik S. (Carpenter)</text>
  <text x="340" y="300" font-size="8.5" fill="#dc2626">Scan Glare Exception</text>
  <rect x="490" y="275" width="50" height="25" rx="4" fill="#dc2626"/>
  <text x="515" y="291" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Review</text>

  <!-- Big sign-off button -->
  <rect x="330" y="420" width="220" height="45" rx="6" fill="#059669"/>
  <text x="440" y="448" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">[ Lock &amp; Sign Daily Muster ]</text>
  <text x="440" y="490" font-size="9" font-style="italic" fill="#64748b" text-anchor="middle">Supervisor Mobile Sign-off Wireframe</text>

  <!-- Screen 3: Wage & Payroll Engine Wireframe -->
  <rect x="590" y="70" width="250" height="440" rx="10" fill="#ffffff" stroke="#475569" stroke-width="2"/>
  <rect x="590" y="70" width="250" height="35" rx="10" fill="#cbd5e1"/>
  <text x="715" y="92" font-size="10.5" font-weight="bold" fill="#1e293b" text-anchor="middle">PAYROLL RECONCILIATION</text>

  <rect x="605" y="115" width="220" height="120" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="615" y="135" font-size="10" font-weight="bold" fill="#0f172a">Wage Breakdown Formula:</text>
  <text x="615" y="155" font-size="9" fill="#334155">Base Rate: ₹850.00 / day</text>
  <text x="615" y="172" font-size="9" fill="#334155">Verified Shifts: 6 Days (₹5,100)</text>
  <text x="615" y="189" font-size="9" fill="#dc2626">Logged Advances: - ₹100.00</text>
  <line x1="615" y1="198" x2="815" y2="198" stroke="#cbd5e1"/>
  <text x="615" y="218" font-size="11" font-weight="bold" fill="#15803d">Net Wage: ₹5,000.00</text>

  <!-- Export Options -->
  <rect x="605" y="250" width="220" height="35" rx="4" fill="#e0e7ff" stroke="#a5b4fc"/>
  <text x="715" y="272" font-size="9.5" font-weight="bold" fill="#3730a3" text-anchor="middle">[ Send 5-Lang SMS Slips ]</text>

  <rect x="605" y="295" width="220" height="35" rx="4" fill="#f0fdf4" stroke="#86efac"/>
  <text x="715" y="317" font-size="9.5" font-weight="bold" fill="#166534" text-anchor="middle">[ 1-Click Bank NEFT Payout ]</text>

  <rect x="605" y="340" width="220" height="35" rx="4" fill="#f1f5f9" stroke="#94a3b8"/>
  <text x="715" y="362" font-size="9.5" font-weight="bold" fill="#334155" text-anchor="middle">[ Export BOCW Audit CSV ]</text>

  <rect x="605" y="420" width="220" height="45" rx="6" fill="#4338ca"/>
  <text x="715" y="448" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">[ Authorize Weekly Release ]</text>
  <text x="715" y="490" font-size="9" font-style="italic" fill="#64748b" text-anchor="middle">Contractor Payroll Reconciliation Wireframe</text>
</svg>"""

print("Successfully added Fig 4.6, 4.9, 4.10, 4.12, 4.13, 4.14, 4.15, and 5.1 SVG generators.")
