import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

DARK_BG = RGBColor(15, 23, 42)      # #0F172A
CARD_BG = RGBColor(30, 41, 59)      # #1E293B
INNER_BG = RGBColor(41, 53, 72)     # #293548
BORDER_COLOR = RGBColor(71, 85, 105)# #475569
GOLD = RGBColor(245, 158, 11)       # #F59E0B
GREEN = RGBColor(16, 185, 129)      # #10B981
BLUE = RGBColor(14, 165, 233)       # #0EA5E9
WHITE = RGBColor(255, 255, 255)
LIGHT_GRAY = RGBColor(226, 232, 240)# #E2E8F0
MUTED_GRAY = RGBColor(148, 163, 184)# #94A3B8

def create_base_slide(slide_num, title, subtitle):
    slide = prs.slides.add_slide(blank_layout)
    
    # Background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = DARK_BG
    bg.line.fill.background()
    
    # Top header bar
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.1))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.text = f"BUILDEASE SYSTEM WALKTHROUGH | SLIDE {slide_num} OF 9"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = GOLD
    
    p2 = tf.add_paragraph()
    p2.text = title
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    
    p3 = tf.add_paragraph()
    p3.text = subtitle
    p3.font.size = Pt(12)
    p3.font.color.rgb = MUTED_GRAY
    
    return slide

def add_feature_slide(slide_num, title, subtitle, bullets, key_elements, talk_track, screen_label, screen_desc):
    slide = create_base_slide(slide_num, title, subtitle)
    
    # Left Column: Function & Value card
    left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(6.0), Inches(4.3))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = CARD_BG
    left_card.line.color.rgb = BORDER_COLOR
    left_card.line.width = Pt(1)
    
    tb = slide.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(5.6), Inches(4.0))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.text = "PAGE FUNCTION & OPERATIONAL VALUE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = BLUE
    
    for b_title, b_desc in bullets:
        p_b = tf.add_paragraph()
        p_b.space_before = Pt(8)
        run_b = p_b.add_run()
        run_b.text = f"• {b_title}: "
        run_b.font.bold = True
        run_b.font.size = Pt(11)
        run_b.font.color.rgb = WHITE
        
        run_t = p_b.add_run()
        run_t.text = b_desc
        run_t.font.size = Pt(11)
        run_t.font.color.rgb = LIGHT_GRAY
        
    p_k = tf.add_paragraph()
    p_k.space_before = Pt(12)
    run_k = p_k.add_run()
    run_k.text = "Key UI Elements Visible: "
    run_k.font.bold = True
    run_k.font.size = Pt(10.5)
    run_k.font.color.rgb = GOLD
    run_kt = p_k.add_run()
    run_kt.text = key_elements
    run_kt.font.size = Pt(10.5)
    run_kt.font.color.rgb = LIGHT_GRAY
    
    # Right Column: Screenshot Placeholder Frame
    right_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(1.6), Inches(5.4), Inches(4.3))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = INNER_BG
    right_card.line.color.rgb = BLUE
    right_card.line.width = Pt(1.5)
    
    tb_sc = slide.shapes.add_textbox(Inches(7.3), Inches(2.2), Inches(5.0), Inches(3.0))
    tf_sc = tb_sc.text_frame
    tf_sc.word_wrap = True
    
    p_sc = tf_sc.paragraphs[0]
    p_sc.text = f"[ SCREENSHOT: {screen_label} ]"
    p_sc.alignment = PP_ALIGN.CENTER
    p_sc.font.size = Pt(14)
    p_sc.font.bold = True
    p_sc.font.color.rgb = WHITE
    
    p_sc2 = tf_sc.add_paragraph()
    p_sc2.space_before = Pt(10)
    p_sc2.text = screen_desc
    p_sc2.alignment = PP_ALIGN.CENTER
    p_sc2.font.size = Pt(11)
    p_sc2.font.color.rgb = LIGHT_GRAY
    
    p_sc3 = tf_sc.add_paragraph()
    p_sc3.space_before = Pt(12)
    p_sc3.text = "Paste or insert page screenshot directly into this container"
    p_sc3.alignment = PP_ALIGN.CENTER
    p_sc3.font.size = Pt(9.5)
    p_sc3.font.color.rgb = MUTED_GRAY
    
    # Bottom Viva Talk Track Card
    bot_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.1), Inches(11.7), Inches(0.95))
    bot_card.fill.solid()
    bot_card.fill.fore_color.rgb = CARD_BG
    bot_card.line.color.rgb = GOLD
    bot_card.line.width = Pt(1)
    
    tb_bot = slide.shapes.add_textbox(Inches(1.0), Inches(6.15), Inches(11.3), Inches(0.85))
    tf_bot = tb_bot.text_frame
    tf_bot.word_wrap = True
    
    p_v = tf_bot.paragraphs[0]
    r_vh = p_v.add_run()
    r_vh.text = "Oral Presentation / Viva Talk Track: "
    r_vh.font.bold = True
    r_vh.font.size = Pt(11)
    r_vh.font.color.rgb = GOLD
    
    r_vt = p_v.add_run()
    r_vt.text = f'"{talk_track}"'
    r_vt.font.size = Pt(11)
    r_vt.font.color.rgb = WHITE

# Slide 1: Overview
add_feature_slide(
    1,
    "Overview Dashboard",
    "Real-Time Manpower Telemetry, Trade Distribution & Project Health",
    [
        ("Live Workforce Visibility", "Displays verified on-site labor count in real time, categorized by active construction trades (masons, carpenters, helpers)."),
        ("Site Safety & Gate Status", "Tracks morning safety toolbox talks and logs instant emergency gate muster roll calls."),
        ("Cost & Output Alignment", "Correlates planned vs. actual project completion percentage against cumulative daily labor expenditure.")
    ],
    "Live Headcount Counter, Active Trade Split Bar, Emergency Muster Trigger, Gate PIN Banner.",
    "This dashboard gives project managers and remote contractors a real-time pulse of site manpower and safety compliance without relying on manual phone calls.",
    "OVERVIEW DASHBOARD (OverviewPage.tsx)",
    "Captures live site headcount (e.g. 48/52 workers), trade breakdown charts, emergency muster status, and morning gate PIN header."
)

# Slide 2: Workforce Registry
add_feature_slide(
    2,
    "Workforce Registry & Biometric Enrollment",
    "Consent-Driven Labor Registry & 128-d SFace Biometric Vector Generation",
    [
        ("One-Time Digital Onboarding", "Captures worker photo, trade classification, base daily wage rate, and emergency contacts with informed digital consent."),
        ("128-d Biometric Extraction", "Extracts an encrypted 128-dimensional facial feature embedding using SFace AI stored locally for fast verification."),
        ("Zero Ghost Worker Duplication", "Prevents proxy identity creation by cross-checking Euclidean distance against existing registered crew members.")
    ],
    "Worker Profile Cards, Trade Skill Badges, Biometric Enrollment Modal, Daily Wage Configurator.",
    "Workers are enrolled once in under 60 seconds. BuildEase extracts a lightweight 128-d vector, ensuring privacy and rapid offline recognition.",
    "WORKFORCE REGISTRY & ENROLLMENT (WorkforcePage.tsx)",
    "Shows worker directory cards with trade badges (Mason, Bar Bender), wage rates, and the SFace camera enrollment pop-up."
)

# Slide 3: Face Biometric Attendance Kiosk
add_feature_slide(
    3,
    "Face Biometric Attendance Kiosk",
    "High-Speed OpenCV YuNet + SFace Gate Punch with Anti-Spoofing & GPS",
    [
        ("Sub-Second Touchless Punch", "Workers look into the turnstile tablet camera for instant face detection and matching in under 0.8 seconds."),
        ("Passive Liveness (PAD) Shield", "Blocks photo printouts and mobile video spoof attacks using eye-blink and micro-motion validation."),
        ("GPS Geofence Perimeter Lock", "Enforces a strict 250m site boundary so biometric punches can only execute inside the physical gate."),
        ("Multilingual Audio Feedback", "Confirms successful check-in aloud in Tamil, Hindi, Telugu, Kannada, or English.")
    ],
    "YuNet Green Face Bounding Box, Liveness Score Meter, GPS Geofence Pill, 5-Language Audio HUD.",
    "Our gate kiosk processes worker check-in at turnstiles in under a second with anti-spoofing and audio confirmation in the worker's mother tongue.",
    "FACE ATTENDANCE KIOSK (FacePunchModal.tsx)",
    "Shows the live camera HUD with YuNet face tracking box, liveness score, GPS coordinates, and language voice confirmation indicator."
)

# Slide 4: 2G Button Phone Kiosk
add_feature_slide(
    4,
    "2G Button Phone & Toll-Free IVR Kiosk",
    "Inclusive Digital Attendance for Migrant Workers via Basic Keypad Phones",
    [
        ("No Smartphone / Zero Internet Required", "Migrant workers dial a toll-free number (1800-284-533) from any basic 2G feature phone."),
        ("Physical Morning Gate PIN", "Worker inputs the 3-digit PIN (e.g., 582) written fresh daily on the site entrance blackboard."),
        ("Cell Tower BTS Verification", "Cross-verifies caller location against the site's local telecom tower to eliminate remote proxy calling."),
        ("Instant Worker SMS Slip", "Delivers an instant confirmation SMS to the worker's phone, giving them personal proof of daily attendance.")
    ],
    "Nokia 2G Keypad Simulator, 1800 Toll-Free Dial HUD, Morning Gate PIN (582), SMS Confirmation Slip.",
    "For laborers without smartphones, BuildEase uses a toll-free call and morning gate PIN, giving every worker personal attendance proof on a basic Nokia phone.",
    "2G BUTTON PHONE KIOSK (ButtonPhonePunchModal.tsx)",
    "Shows the interactive 2G keypad dialer, toll-free number input, daily gate PIN 582 verification, and the generated SMS voucher."
)

# Slide 5: Offline Punch Queue
add_feature_slide(
    5,
    "Offline Punch Queue & Network Resiliency",
    "Zero-Downtime Attendance Buffering for Basement & Remote Blackouts",
    [
        ("100% Offline Site Continuity", "Continues processing gate punches even when 4G cellular drops in deep basements or remote rural zones."),
        ("Tamper-Resistant Local Queue", "Punches are buffered in encrypted browser LocalStorage stamped with hardware device timestamps."),
        ("Background Auto-Sync Engine", "Automatically flushes buffered punches to the cloud as soon as network reconnects without stopping turnstile flow.")
    ],
    "Offline Status Banner ('OFFLINE - 12 Punches Buffered'), Manual Sync Button, Network Latency Meter.",
    "Construction sites suffer constant connectivity drops. BuildEase buffers punches locally and automatically syncs them as soon as connectivity resumes.",
    "OFFLINE QUEUE & SYNC (AttendancePage.tsx)",
    "Shows the amber offline warning strip, buffered punch count counter, and auto-sync reconnection status."
)

# Slide 6: Trade Task Allocation
add_feature_slide(
    6,
    "Trade Task Allocation & Progress Tracking",
    "Daily Work Orders, Skill-Based Crew Allocation & Output Stepper",
    [
        ("Skill-Matched Crew Allocation", "Supervisors assign daily tasks (e.g. Block Masonry, Rebar Tying) strictly to qualified trade workers."),
        ("One-Tap Output Stepper", "Supervisors log physical output (+5, +10, +25 sq ft / units) directly on site with simple one-tap buttons."),
        ("Labor Productivity Linkage", "Directly links deployed daily manpower to completed task output to identify construction bottlenecks immediately.")
    ],
    "Task Progress Bar, Trade Assignment Badges, Quick Increment Buttons (+5, +10, +25), Daily Target Meter.",
    "Instead of rough pocket notebooks, supervisors assign crew tasks and update daily trade output with one-tap steppers in real time.",
    "TRADE TASKS & PROGRESS (TasksPage.tsx)",
    "Shows active work orders, assigned workers with trade tags, progress percentage bars, and the quick increment stepper buttons."
)

# Slide 7: Automated Payroll Ledger
add_feature_slide(
    7,
    "Automated Payroll Ledger & Bank CSV Payout",
    "Dispute-Free Wage Calculation, Overtime Audit & 1-Click Bank Transfer",
    [
        ("Automated Wage Computation", "Calculates base wages, shift hours, and overtime directly from verified biometric punch timestamps."),
        ("Transparent Advance Deductions", "Automatically deducts mid-week cash advances with full audit history, ending Saturday payout disputes."),
        ("1-Click Bank CSV Export", "Generates ready-to-upload NEFT/RTGS/UPI batch CSV files formatted for instant bank portal disbursement."),
        ("Printable Official Payslips", "Generates physical bilingual wage slips with itemized overtime for unbanked migrant laborers.")
    ],
    "Overtime Audit Table, Cash Advance Deductions, 1-Click Bank CSV Button, Printable Payslip Voucher.",
    "BuildEase transforms verified gate punches into an audited payroll ledger and exports a 1-click Bank CSV file, eliminating Saturday payout arguments.",
    "PAYROLL & BANK CSV EXPORT (PayrollPage.tsx)",
    "Shows the payroll summary table, overtime hours, advance deduction column, 1-Click Bank CSV button, and printable payslip."
)

# Slide 8: Hardware Architecture Slide
slide8 = create_base_slide(8, "Hardware Architecture & Site Gate Deployment", "Industrial Turnstile Station Built for Heat, Dust, and Sunlight")
cards_data = [
    ("Gate Tablet Kiosk", "10.1-inch IP65 Industrial Android tablet mounted at main site turnstile with dust-proof enclosure."),
    ("Wide-Angle HDR Camera", "1080p wide-angle camera with High Dynamic Range to handle blinding direct midday sun and heavy shadow."),
    ("GNSS / GPS Sensor", "High-accuracy GPS/NavIC hardware receiver enforcing strict 250m site perimeter boundary."),
    ("2G Telephony Gateway", "Telecom Toll-Free IVR server linked to the local site BTS cell tower for keypad phone punches."),
    ("Morning PIN Blackboard", "Physical high-contrast board at site entrance displaying the rotating 3-digit daily PIN (e.g. 582).")
]

for i, (c_title, c_desc) in enumerate(cards_data):
    left_pos = Inches(0.8 + (i * 2.38))
    card_shape = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(1.6), Inches(2.25), Inches(4.3))
    card_shape.fill.solid()
    card_shape.fill.fore_color.rgb = CARD_BG
    card_shape.line.color.rgb = BORDER_COLOR
    card_shape.line.width = Pt(1)
    
    tb = slide8.shapes.add_textbox(left_pos + Inches(0.15), Inches(1.8), Inches(1.95), Inches(3.9))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.text = f"0{i+1}"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = GOLD
    
    p2 = tf.add_paragraph()
    p2.space_before = Pt(8)
    p2.text = c_title
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    
    p3 = tf.add_paragraph()
    p3.space_before = Pt(8)
    p3.text = c_desc
    p3.font.size = Pt(10.5)
    p3.font.color.rgb = LIGHT_GRAY

# Slide 8 bottom viva
bot_card8 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.1), Inches(11.7), Inches(0.95))
bot_card8.fill.solid()
bot_card8.fill.fore_color.rgb = CARD_BG
bot_card8.line.color.rgb = GOLD
bot_card8.line.width = Pt(1)

tb_b8 = slide8.shapes.add_textbox(Inches(1.0), Inches(6.15), Inches(11.3), Inches(0.85))
tf_b8 = tb_b8.text_frame
tf_b8.word_wrap = True
p_v8 = tf_b8.paragraphs[0]
r_vh8 = p_v8.add_run()
r_vh8.text = "Oral Presentation / Viva Talk Track: "
r_vh8.font.bold = True
r_vh8.font.size = Pt(11)
r_vh8.font.color.rgb = GOLD
r_vt8 = p_v8.add_run()
r_vt8.text = '"Our hardware uses low-cost, ruggedized components: an IP65 gate tablet, wide-angle HDR camera, GPS receiver, and a physical morning gate PIN board."'
r_vt8.font.size = Pt(11)
r_vt8.font.color.rgb = WHITE

# Slide 9: Working Video & Field Validation
slide9 = create_base_slide(9, "Working Field Video & On-Site Validation", "Field Implementation at Tiruppur Block Site & End-to-End Live Workflow")

# Left Side: Authentic Field Interview Photo
photo_path = r"C:\Users\vigne\.gemini\antigravity\brain\744903b3-6a60-4035-a99f-ec31cf3b83ca\.user_uploaded\media_1792591666694_1626c463.jpg"
if os.path.exists(photo_path):
    slide9.shapes.add_picture(photo_path, Inches(0.8), Inches(1.6), width=Inches(5.6), height=Inches(4.3))
    # Caption box
    cap_box = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(5.45), Inches(5.6), Inches(0.45))
    cap_box.fill.solid()
    cap_box.fill.fore_color.rgb = DARK_BG
    cap_box.line.fill.background()
    tb_c = slide9.shapes.add_textbox(Inches(0.9), Inches(5.47), Inches(5.4), Inches(0.4))
    tf_c = tb_c.text_frame
    p_c = tf_c.paragraphs[0]
    p_c.text = "Authentic Field Interview & Site Validation — Tiruppur Block Site"
    p_c.font.size = Pt(9.5)
    p_c.font.bold = True
    p_c.font.color.rgb = GOLD
else:
    left_ph = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.6), Inches(4.3))
    left_ph.fill.solid()
    left_ph.fill.fore_color.rgb = INNER_BG

# Right Side: Working Video & Workflow Demonstration card
right_card9 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.7), Inches(1.6), Inches(5.8), Inches(4.3))
right_card9.fill.solid()
right_card9.fill.fore_color.rgb = CARD_BG
right_card9.line.color.rgb = GREEN
right_card9.line.width = Pt(1.5)

tb9 = slide9.shapes.add_textbox(Inches(6.9), Inches(1.75), Inches(5.4), Inches(4.0))
tf9 = tb9.text_frame
tf9.word_wrap = True
tf9.margin_left = tf9.margin_top = tf9.margin_right = tf9.margin_bottom = 0

p9 = tf9.paragraphs[0]
p9.text = "LIVE SYSTEM EXECUTION & WORKING VIDEO"
p9.font.size = Pt(12)
p9.font.bold = True
p9.font.color.rgb = GREEN

flow_steps = [
    ("1. Biometric Gate Punch", "Worker stands before gate camera; YuNet detects face and SFace verifies in 0.7s with Tamil voice greeting."),
    ("2. 2G Button Phone Punch", "Worker dials 1800-284-533, enters PIN 582, and receives instant SMS confirmation on a Nokia 105."),
    ("3. Offline Network Drop", "Wi-Fi cut simulated: punches buffer locally and instantly auto-flush upon reconnection."),
    ("4. Daily Task & Payroll", "Supervisor increments trade output; Accountant exports bank CSV in 1-click for zero-dispute payout.")
]

for s_num, s_desc in flow_steps:
    p_s = tf9.add_paragraph()
    p_s.space_before = Pt(6)
    r_sh = p_s.add_run()
    r_sh.text = f"• {s_num}: "
    r_sh.font.bold = True
    r_sh.font.size = Pt(10.5)
    r_sh.font.color.rgb = WHITE
    r_st = p_s.add_run()
    r_st.text = s_desc
    r_st.font.size = Pt(10.5)
    r_st.font.color.rgb = LIGHT_GRAY

p_vid = tf9.add_paragraph()
p_vid.space_before = Pt(10)
r_vh = p_vid.add_run()
r_vh.text = "Working Video / QR Link: "
r_vh.font.bold = True
r_vh.font.size = Pt(10.5)
r_vh.font.color.rgb = GOLD
r_vt = p_vid.add_run()
r_vt.text = "[ Embed MP4 Video / Screen Recording or QR Code Here ]"
r_vt.font.size = Pt(10)
r_vt.font.color.rgb = BLUE

# Slide 9 bottom viva
bot_card9 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.1), Inches(11.7), Inches(0.95))
bot_card9.fill.solid()
bot_card9.fill.fore_color.rgb = CARD_BG
bot_card9.line.color.rgb = GOLD
bot_card9.line.width = Pt(1)

tb_b9 = slide9.shapes.add_textbox(Inches(1.0), Inches(6.15), Inches(11.3), Inches(0.85))
tf_b9 = tb_b9.text_frame
tf_b9.word_wrap = True
p_v9 = tf_b9.paragraphs[0]
r_vh9 = p_v9.add_run()
r_vh9.text = "Oral Presentation / Viva Talk Track: "
r_vh9.font.bold = True
r_vh9.font.size = Pt(11)
r_vh9.font.color.rgb = GOLD
r_vt9 = p_v9.add_run()
r_vt9.text = '"Here is our authentic field interview at the Tiruppur site along with the working video demonstrating the end-to-end punch-to-payroll pipeline."'
r_vt9.font.size = Pt(11)
r_vt9.font.color.rgb = WHITE

# Save to both locations
out1 = r"f:\BuildEase\BuildEase_Presentation_Screenshots_Deck.pptx"
out2 = r"C:\Users\vigne\.gemini\antigravity\brain\744903b3-6a60-4035-a99f-ec31cf3b83ca\BuildEase_Presentation_Screenshots_Deck.pptx"
prs.save(out1)
prs.save(out2)
print("SUCCESS")
print(f"File 1 size: {os.path.getsize(out1)} bytes")
print(f"File 2 size: {os.path.getsize(out2)} bytes")
