# -*- coding: utf-8 -*-
"""Assemble and generate the complete BuildEase Design Thinking Report."""

import os
import base64
import report_sections_prelims
import report_sections_ch1_ch3
import report_sections_ch4
import report_sections_ch5_ch7

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

images_dict = {
    'proto_hero': proto_hero,
    'proto_hologram': proto_hologram,
    'proto_muster': proto_muster,
    'proto_phone': proto_phone,
    'proto_tasks': proto_tasks,
    'proto_payroll': proto_payroll,
    'proto_roster': proto_roster,
    'proto_reports': proto_reports
}

html_header = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BuildEase - Design Thinking Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 25mm 20mm 25mm 25mm;
  }
  @media print {
    .page-break {
      page-break-after: always;
      break-after: page;
    }
    body {
      padding: 0;
      margin: 0;
      max-width: 100%;
    }
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.6;
    color: #000;
    background: #fff;
    margin: 0 auto;
    padding: 20px 40px;
    max-width: 900px;
    text-align: justify;
  }
  h1 {
    font-size: 16pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    margin-top: 24pt;
    margin-bottom: 18pt;
    page-break-before: always;
  }
  h2 {
    font-size: 13pt;
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 8pt;
  }
  h3 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 14pt;
    margin-bottom: 6pt;
  }
  p {
    margin-bottom: 10pt;
    text-indent: 0.5in;
  }
  p.no-indent {
    text-indent: 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0;
    font-size: 11pt;
  }
  th, td {
    border: 1px solid #333;
    padding: 6pt 8pt;
    vertical-align: top;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
  }
  .table-caption {
    font-weight: bold;
    margin-bottom: 4pt;
    font-size: 11pt;
    text-align: left;
    text-indent: 0;
  }
  .figure-container {
    text-align: center;
    margin: 20pt 0;
    page-break-inside: avoid;
  }
  .figure-caption {
    font-weight: bold;
    margin-top: 8pt;
    font-size: 11pt;
    text-align: center;
    text-indent: 0;
  }
  .page-break {
    page-break-after: always;
    break-after: page;
  }
  .cover-page p {
    text-indent: 0;
  }
</style>
</head>
<body>
"""

html_footer = """
</body>
</html>
"""

print("Building preliminaries...")
prelims_html = report_sections_prelims.get_preliminaries_html()

print("Building chapters 1 to 3...")
ch1_3_html = report_sections_ch1_ch3.get_chapters_1_to_3_html()

print("Building chapter 4 (Design Thinking Process)...")
ch4_html = report_sections_ch4.get_chapter_4_html(geo_photo)

print("Building chapters 5 to 7, Appendix, References, SDG...")
ch5_7_html = report_sections_ch5_ch7.get_chapters_5_to_7_html(images_dict)

full_html = html_header + prelims_html + ch1_3_html + ch4_html + ch5_7_html + html_footer

output_html_path = r"f:\BuildEase\BuildEase_Design_Thinking_Report.html"
with open(output_html_path, "w", encoding="utf-8") as f:
    f.write(full_html)

print(f"BuildEase Design Thinking Report generated successfully at: {output_html_path}")
print(f"Total HTML file size: {len(full_html):,} bytes")
