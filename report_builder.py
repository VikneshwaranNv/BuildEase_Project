# -*- coding: utf-8 -*-
"""Master Report Builder for BuildEase Design Thinking Report."""

import os
import base64
import generate_svgs

assets_dir = r"f:\BuildEase\report_assets"

def get_base64_image(image_path):
    if os.path.exists(image_path):
        with open(image_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            ext = os.path.splitext(image_path)[1].lower().replace('.', '')
            if ext == 'jpg': ext = 'jpeg'
            return f"data:image/{ext};base64,{encoded}"
    return ""

geo_photo = get_base64_image(os.path.join(assets_dir, "BuildEase_Presentation_Screenshots_Deck_s8_sh2.jpg"))
proto_hero = get_base64_image(os.path.join(assets_dir, "proto_overview_hero.png"))
proto_hologram = get_base64_image(os.path.join(assets_dir, "proto_hologram_metrics.png"))
proto_muster = get_base64_image(os.path.join(assets_dir, "proto_attendance_muster.png"))
proto_phone = get_base64_image(os.path.join(assets_dir, "proto_2g_phone_kiosk.png"))
proto_tasks = get_base64_image(os.path.join(assets_dir, "proto_tasks_productivity.png"))
proto_payroll = get_base64_image(os.path.join(assets_dir, "proto_payroll_wages.png"))
proto_roster = get_base64_image(os.path.join(assets_dir, "proto_workforce_roster.png"))
proto_reports = get_base64_image(os.path.join(assets_dir, "proto_reports_dsr.png"))

print("Loaded all image assets for Master Report Builder.")
