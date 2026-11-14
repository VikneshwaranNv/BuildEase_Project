---
name: design-section
description: Design a new UI section or component using the 5-dimension AntiGravity framework (pattern, style, color, typography, animation). Use when building a new visual section, hero, feature grid, or page layout.
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Design Section

Design and implement a UI section using the AntiGravity 5-dimension framework.

## The 5 Dimensions
For each section you build, explicitly decide on all 5 dimensions:

### 1. PATTERN & LAYOUT (The Skeleton)
- Choose a functional pattern based on the content type:
  - **Dashboard/Bento:** Modular card grid, varying sizes, consistent gaps (16-24px)
  - **Listing / Table:** Filter bar + data table + pagination/actions
  - **Kiosk / Modal:** Central visual focus + high-contrast action bar

### 2. STYLE & AESTHETIC (The Skin)
- Subtle depth through elevation and tone steps, not heavy borders
- Rounded corners (`rounded-xl`, `rounded-2xl`)
- Clean card-based layouts with generous whitespace (let content breathe)
- High outdoor contrast and tangible physical feel

### 3. COLOR & THEME (The Palette)
- 60-30-10 rule:
  - 60% background/canvas (`#0E141F`)
  - 30% surface/card (`#151F2E`)
  - 10% accent/CTA (`#D97706` Construction Safety Amber, `#059669` Biometric Green)
- WCAG AA compliant (4.5:1+ contrast for text)

### 4. TYPOGRAPHY (The Voice)
- Clear type scale:
  - Display / H1: 24–28px font-bold
  - Section Headings: 16–18px font-semibold
  - Body / Data: 13–14px font-normal with tabular figures (`tabular-nums`)
- Maximum 3 font sizes per section for visual clarity

### 5. ANIMATIONS & INTERACTIONS (The Soul)
- Micro-interactions: 150-250ms duration, ease-out
- Tap targets minimum 44x44px for touchscreens/gloves
- Transform and opacity only (no layout shifts)
- `prefers-reduced-motion` respected
