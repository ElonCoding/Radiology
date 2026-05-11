# Radiology Copilot Design System & Style Guide

## 1. Visual Identity & Brand
Radiology Copilot is designed to be a professional, clinical-grade tool that feels modern, intelligent, and trustworthy. The interface utilizes a "Clinical Glass" aesthetic—combining clean, high-contrast typography with subtle depth, blur effects, and smooth transitions.

## 2. Color Palette

### Primary (Indigo/Violet)
Used for primary actions, active states, and brand recognition.
- **Primary 600 (Main):** `#7c3aed` (Indigo)
- **Gradient:** From `#6366f1` to `#8b5cf6`

### Secondary & Neutrals (Slate)
Used for backgrounds, borders, and secondary text to maintain a calm, clinical feel.
- **Background:** `#f8fafc` (Slate 50)
- **Borders:** `#e2e8f0` (Slate 200)
- **Text (Main):** `#0f172a` (Slate 900)
- **Text (Muted):** `#64748b` (Slate 500)

### Semantic Colors
- **Critical/Alert:** `#e11d48` (Rose 600)
- **Warning/Emergent:** `#f59e0b` (Amber 500)
- **Success/System Active:** `#10b981` (Emerald 500)

## 3. Typography Hierarchy
- **Font Family:** 'Inter', sans-serif (Optimized for readability and precision)
- **Headers:** Bold (700/800), tracking-tight, Slate 900.
- **Labels:** Semibold (600), uppercase, tracking-wider, Slate 500, size 11px.
- **Body:** Regular (400), Slate 700, size 14px (text-sm).
- **Monospace:** For raw findings data, size 13px.

## 4. Components & Styling

### Buttons
- **Primary Button:** Large, rounded-xl, shadow-lg, indigo background. Includes a "shimmer" hover effect.
- **Toggle Buttons:** Glass-style pill navigation with active white shadow state.

### Input Fields
- **Design:** Soft gray background (`slate-50/50`), subtle border, 2px focus ring.
- **Drop Zones:** Dashed indigo borders, animated scale effect on hover.

### Cards & Panels
- **Layout:** Sidebar-based navigation for maximum workspace efficiency.
- **Elevation:** Uses `shadow-soft` (subtle) for standard cards and `shadow-xl` for the main sidebar.

## 5. Motion & Interaction
- **Transitions:** `spring` physics (damping 25, stiffness 200) for sidebar and panel entries.
- **Micro-interactions:** 
  - Buttons scale down slightly on click (`active:scale-95`).
  - Cards lift slightly on hover (`hover:-translate-y-1`).
  - Loading states use sequenced animations with `framer-motion` AnimatePresence.

## 6. Spacing Guidelines
- **Grid:** Based on an 8px system.
- **Panel Padding:** `p-6` (24px) or `p-8` (32px) for high-focus areas.
- **Gap:** `gap-4` (16px) between related elements, `gap-8` (32px) between major sections.

---
*Developed for Radiology Copilot v1.0 Beta*
