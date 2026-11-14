# -*- coding: utf-8 -*-
import os
import base64

assets_dir = r"f:\BuildEase\report_assets"
def get_b64(fname):
    p = os.path.join(assets_dir, fname)
    if os.path.exists(p):
        with open(p, "rb") as f:
            ext = os.path.splitext(fname)[1].lower().replace('.', '')
            if ext == 'jpg': ext = 'jpeg'
            return f"data:image/{ext};base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return ""

geo_photo_b64 = get_b64("BuildEase_Presentation_Screenshots_Deck_s8_sh2.jpg")
proto_hero_b64 = get_b64("proto_overview_hero.png")
proto_hologram_b64 = get_b64("proto_hologram_metrics.png")
proto_muster_b64 = get_b64("proto_attendance_muster.png")
proto_phone_b64 = get_b64("proto_2g_phone_kiosk.png")
proto_tasks_b64 = get_b64("proto_tasks_productivity.png")
proto_payroll_b64 = get_b64("proto_payroll_wages.png")
proto_roster_b64 = get_b64("proto_workforce_roster.png")
proto_docs_b64 = get_b64("proto_documents_blueprints.png")
proto_reports_b64 = get_b64("proto_reports_dsr.png")

print("Asset loading done.")
