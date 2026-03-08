# HatSafe Design System
**Version 2.0 - Premium Minimal**  
**Last Updated:** 2026-03-08

---

## Design Principles

1. **Clarity** - Every element serves a purpose
2. **Hierarchy** - Typography and spacing drive importance
3. **Spacing** - Generous whitespace, never cramped
4. **Simplicity** - Remove the unnecessary
5. **Consistency** - Predictable patterns throughout
6. **Subtle Polish** - Refined details, not decoration

**Aesthetic Reference:**
- Apple (calm, minimal, refined)
- Linear (clean, spacious, purposeful)
- Arc Browser (modern, uncluttered)
- Things 3 (soft, considered, elegant)

**NOT:**
- Generic SaaS dashboards
- Heavy borders and shadows
- Cluttered layouts
- Excessive colors

---

## Color System

### Single Accent Color Philosophy
Use **only one accent color** across the entire system.

**Accent Color: Safety Yellow**
- Primary: `#FFC107` (Safety Yellow - represents construction/safety)
- Use ONLY for:
  - Primary buttons
  - Links
  - Active navigation
  - Selected items
  - Focus states

### Neutrals (Soft & Calm)
- **Background:** `#FAFAFA` (soft off-white, not pure white)
- **Surface:** `#FFFFFF` (white cards on off-white background)
- **Border:** `#E5E5E5` (subtle, barely visible)
- **Text Primary:** `#1A1A1A` (near-black, softer than #000)
- **Text Secondary:** `#6B6B6B` (medium grey)
- **Text Tertiary:** `#A3A3A3` (light grey)

### Semantic Colors (Minimal Use)
- **Success:** `#10B981` (green, used sparingly)
- **Warning:** `#F59E0B` (amber)
- **Error:** `#EF4444` (red)
- **Info:** `#3B82F6` (blue)

**Rule:** Semantic colors only for status badges and alerts. Never for decoration.

---

## Typography

### Font Family
- **Primary:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Monospace:** `"SF Mono", Monaco, monospace` (for codes/numbers)

### Type Scale (8px grid aligned)
```
Hero:      32px / 2rem  (line-height: 40px)
H1:        24px / 1.5rem (line-height: 32px)
H2:        20px / 1.25rem (line-height: 28px)
H3:        18px / 1.125rem (line-height: 24px)
Body:      14px / 0.875rem (line-height: 20px)
Small:     12px / 0.75rem (line-height: 16px)
Tiny:      11px / 0.6875rem (line-height: 16px)
```

### Font Weights
- **Regular:** 400 (body text, secondary headings)
- **Medium:** 500 (buttons, labels)
- **Semibold:** 600 (primary headings, emphasis)

**Avoid:** Bold (700), Light (300)

### Hierarchy Rules
- Large headings with generous spacing
- Clear distinction between heading levels
- Minimal use of bold text (rely on size/weight/color instead)
- Single font family throughout

---

## Spacing System (8px Grid)

All spacing must be multiples of 8px:

```
XXS:  4px  (0.25rem) - tight elements
XS:   8px  (0.5rem)  - minimal gap
SM:   12px (0.75rem) - compact spacing
MD:   16px (1rem)    - default spacing
LG:   24px (1.5rem)  - section spacing
XL:   32px (2rem)    - major sections
2XL:  48px (3rem)    - page sections
3XL:  64px (4rem)    - hero spacing
```

**Vertical Rhythm:**
- Prefer strong vertical spacing over dense multi-column layouts
- Section spacing: 24px minimum, 32-48px preferred
- Card padding: 24px (not 16px)
- Between cards: 16px minimum, 24px preferred

**Layout Padding:**
- Page edges: 24px mobile, 32px desktop
- Container max-width: 1280px
- Content max-width: 768px (for reading)

---

## Border Radius

Soft, medium rounded corners (not sharp, not pill-shaped):

```
Small:  6px  (buttons, badges, inputs)
Medium: 10px (cards, modals)
Large:  14px (hero sections, containers)
```

**Never use:**
- Sharp corners (0px)
- Pill shapes (9999px) except for avatar circles

---

## Shadows (Minimal)

Use shadows **only** when needed for elevation:

```
Subtle:   0 1px 2px rgba(0,0,0,0.04)
Card:     0 1px 3px rgba(0,0,0,0.06)
Elevated: 0 4px 6px rgba(0,0,0,0.08)
Modal:    0 8px 16px rgba(0,0,0,0.12)
```

**Rule:** Default to no shadow. Add only when necessary for hierarchy.

---

## Surfaces

### Surface Hierarchy
1. **Background** (`#FAFAFA`) - page base
2. **Card** (`#FFFFFF`) - content containers
3. **Elevated** (`#FFFFFF` + shadow) - modals, dropdowns

### Separation Techniques
- Prefer **spacing** over borders
- Use **subtle background contrast** over heavy outlines
- Minimal borders: 1px `#E5E5E5` only when needed

**Cards:**
- White background on off-white base
- 10px border radius
- Subtle shadow (Card level)
- 24px padding
- 16-24px gap between cards

---

## Component Styling Rules

### Buttons

**Primary (Accent):**
```
Background: #FFC107 (Safety Yellow)
Text: #1A1A1A (near-black for contrast)
Padding: 12px 20px (vertical: 12px, horizontal: 20px)
Border Radius: 6px
Font Weight: 500
Hover: Darken 5%
```

**Secondary (Neutral):**
```
Background: #F5F5F5 (light grey)
Text: #1A1A1A
Border: 1px solid #E5E5E5
Padding: 12px 20px
Border Radius: 6px
Font Weight: 500
Hover: #EBEBEB
```

**Ghost (Minimal):**
```
Background: transparent
Text: #6B6B6B
Padding: 12px 20px
Border Radius: 6px
Hover: #F5F5F5
```

### Inputs

**Text Inputs:**
```
Background: #FFFFFF
Border: 1px solid #E5E5E5
Padding: 12px 16px
Border Radius: 6px
Font Size: 14px
Placeholder: #A3A3A3

Focus:
  Border: 1px solid #FFC107
  Outline: none
  Box Shadow: 0 0 0 3px rgba(255, 193, 7, 0.1)
```

### Cards

```
Background: #FFFFFF
Border: none (rely on shadow)
Border Radius: 10px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.06)
Gap (between cards): 16-24px
```

### Navigation

**Sidebar (Desktop):**
```
Background: #FFFFFF
Border Right: 1px solid #E5E5E5
Width: 240px
Padding: 24px 16px

Nav Items:
  Padding: 10px 12px
  Border Radius: 6px
  Font Size: 14px
  Font Weight: 400
  
  Active:
    Background: #FFF9E6 (very light yellow)
    Text: #1A1A1A
    Font Weight: 500
  
  Hover:
    Background: #F5F5F5
```

### Tables

**Simplified, airy, highly readable:**
```
Header:
  Background: #FAFAFA
  Text: 11px uppercase, tracking-wide
  Color: #6B6B6B
  Padding: 12px 16px
  Border Bottom: 1px solid #E5E5E5

Rows:
  Padding: 16px
  Border Bottom: 1px solid #F5F5F5
  Hover: #FAFAFA (subtle)

Text:
  Font Size: 14px
  Color: #1A1A1A
```

### Badges

```
Padding: 4px 10px
Border Radius: 6px
Font Size: 12px
Font Weight: 500

Status (use sparingly):
  Valid: bg-green-50, text-green-700, border-green-200
  Warning: bg-amber-50, text-amber-700, border-amber-200
  Error: bg-red-50, text-red-700, border-red-200
  Neutral: bg-gray-50, text-gray-700, border-gray-200
```

---

## Interaction States

### Hover
- Subtle background change (5-10% darker/lighter)
- No drastic color shifts
- Smooth transition: `transition: all 150ms ease`

### Active/Selected
- Clear but refined indication
- Use accent color background (very light tint)
- Increase font weight slightly (400 → 500)

### Focus
- Accent color ring (3px)
- Semi-transparent: `rgba(255, 193, 7, 0.1)`
- Remove default outline

### Disabled
- Opacity: 50%
- Cursor: not-allowed
- No hover state

---

## Layout Guidelines

### Page Structure
```
Page Padding: 32px (desktop), 24px (mobile)
Max Width: 1280px (centered)
Section Spacing: 48px (vertical rhythm)
```

### Grid System
- Prefer **single column** or **2-column max** layouts
- Avoid dense multi-column grids
- Use white space to create calm

### Content Width
- Reading content: 768px max
- Dashboard content: 1280px max
- Forms: 512px max (centered)

---

## Responsive Breakpoints

```
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px
```

**Mobile-First Approach:**
- Start with mobile layout
- Add complexity for larger screens
- Collapse navigation to mobile menu <640px
- Single column on mobile, 2-3 columns on desktop

---

## Animation

### Timing
```
Fast:   150ms (hover, focus)
Normal: 250ms (transitions, slides)
Slow:   350ms (modals, drawers)
```

### Easing
- `ease` (default)
- `ease-in-out` (smooth start/end)

**Rule:** Minimal animation. Only when it aids understanding.

---

## Accessibility

### Contrast Ratios
- Text on background: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus Indicators
- Always visible
- Accent color ring
- 3px minimum width

### Touch Targets
- Minimum 44x44px (mobile)
- 16px spacing between targets

---

## Implementation Rules

### Tailwind Classes (Preferred)
Use consistent Tailwind utility classes:

```
Spacing:   p-6, px-4, py-3, gap-4, space-y-6
Text:      text-sm, text-base, text-lg, font-medium
Colors:    text-gray-900, text-gray-600, bg-white
Radius:    rounded-md (6px), rounded-lg (10px)
```

### Custom Classes (When Needed)
Define reusable classes in `globals.css`:

```css
.btn-primary { ... }
.card { ... }
.badge-valid { ... }
```

### Component Consistency
- Same padding across similar components
- Consistent border radius sizes
- Predictable hover/focus states
- Uniform spacing patterns

---

## Quality Checklist

Before shipping any UI:

- [ ] Follows 8px spacing grid
- [ ] Uses only accent color where appropriate
- [ ] No heavy borders or shadows
- [ ] Generous whitespace between sections
- [ ] Clear typography hierarchy
- [ ] Calm, uncluttered layout
- [ ] Subtle, refined interactions
- [ ] Consistent with rest of app
- [ ] Feels more like Apple/Linear than generic SaaS

---

## Color Reference (Quick)

```css
/* Brand */
--accent: #FFC107;        /* Safety Yellow */
--black: #1A1A1A;         /* Near-black */

/* Neutrals */
--bg: #FAFAFA;            /* Soft off-white */
--surface: #FFFFFF;       /* White */
--border: #E5E5E5;        /* Subtle grey */

/* Text */
--text-primary: #1A1A1A;  /* Near-black */
--text-secondary: #6B6B6B;/* Medium grey */
--text-tertiary: #A3A3A3; /* Light grey */

/* Semantic */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

---

**End of Design System**
