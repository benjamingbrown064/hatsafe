# HatSafe Design System

**Brand Identity:** Construction safety meets modern software. Professional, trustworthy, high-visibility.

---

## Brand Colors

### Primary (Safety Yellow)
- **#FFC107** - Main brand color (high visibility, construction/safety association)
- Use for: Primary buttons, accents, alerts, key actions

### Secondary (Deep Black)
- **#1A1A1A** - Professional, strong, trustworthy
- Use for: Text, headers, secondary buttons, borders

### Status Colors (Compliance States)
- **Valid:** #10B981 (Green) - Documents current and valid
- **Expiring:** #F59E0B (Amber) - Approaching expiry (7-30 days)
- **Expired:** #EF4444 (Red) - Overdue, requires action
- **Missing:** #6B7280 (Grey) - Document not uploaded

### Neutrals
- **Background:** #FAFAFA (soft warm grey)
- **Surface:** #FFFFFF (clean white cards)
- **Border:** #E8E8E8 (subtle, minimal)
- **Text:** #1A1A1A (primary), #525252 (secondary), #7A7A7A (muted)

---

## Typography

**Font Stack:**
```css
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

**Weights:**
- Regular (400) - Body text
- Medium (500) - Labels, UI elements
- Semibold (600) - Headings, emphasis

**Sizes:**
- H1: 30px (text-3xl)
- H2: 24px (text-2xl)
- H3: 20px (text-xl)
- Body: 16px (text-base)
- Small: 14px (text-sm)
- Tiny: 12px (text-xs)

---

## Spacing

**8px Grid System:**
- Base unit: 8px
- Common spacing: 8px, 16px, 24px, 32px, 48px, 64px
- Card padding: 24px (p-6)
- Page margins: 32px (p-8)

---

## Border Radius

- **Small:** 6px (form inputs, small buttons)
- **Medium:** 10px (cards, standard buttons)
- **Large:** 14px (modals, large cards)
- **Extra Large:** 20px (special elements)

---

## Shadows

**Soft, subtle shadows (never harsh):**
- Card: `shadow-sm` - Subtle elevation
- Modal: `shadow-lg` - More prominent elevation
- Hover: `shadow-md` - Interactive feedback

---

## Components

### Buttons

**Primary (Yellow):**
```jsx
<button className="btn-primary">Upload Document</button>
```
- Yellow background (#FFC107)
- Black text (#1A1A1A)
- Hover: Slightly darker yellow
- Use for: Primary actions, CTAs

**Secondary (White/Grey):**
```jsx
<button className="btn-secondary">Cancel</button>
```
- White background
- Grey border
- Black text
- Use for: Secondary actions, cancel

### Status Badges

```jsx
<span className="badge-valid">Valid</span>
<span className="badge-expiring">Expiring Soon</span>
<span className="badge-expired">Expired</span>
<span className="badge-missing">Missing</span>
```

### Cards

```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```
- White background
- Subtle border
- 10px border radius
- 24px padding

---

## Design Principles

### 1. Safety First
- High contrast (WCAG AA compliant)
- Clear status indicators (color + text)
- Large touch targets (44px minimum on mobile)

### 2. Professional & Clean
- Generous whitespace
- Consistent alignment (8px grid)
- Minimal borders (only when needed)
- Soft shadows (never harsh)

### 3. Construction-Appropriate
- Yellow evokes high-visibility safety gear
- Black conveys strength and professionalism
- Status colors match universal traffic light system (green/amber/red)

### 4. Mobile-Friendly
- Works on building sites (outdoor visibility)
- Easy to use with gloves (large touch targets)
- Works offline (progressive web app features)

---

## Accessibility

### Color Contrast
- All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- Status never relies on color alone (always includes text/icon)

### Focus States
- Visible focus ring (yellow, 2px)
- Keyboard navigation fully supported

### Screen Readers
- Semantic HTML (proper heading hierarchy)
- ARIA labels on all interactive elements
- Alt text on all images

---

## Voice & Tone

**Be clear, direct, and helpful:**
- ✅ "MOT expires in 7 days" (clear, actionable)
- ❌ "Your vehicle documentation requires attention" (vague, corporate)

**Be human, not robotic:**
- ✅ "Upload Sarah's CSCS card" (natural)
- ❌ "Initiate document upload process for employee entity" (technical jargon)

**Be reassuring, not alarmist:**
- ✅ "3 documents expiring this month. Upload renewals when ready."
- ❌ "URGENT: COMPLIANCE FAILURE IMMINENT"

---

## Icon System

**Use Font Awesome Pro Duotone (if available) or Heroicons:**
- Document: 📄
- Person: 👤
- Vehicle: 🚗
- Equipment: 🔧
- Calendar: 📅
- Alert: ⚠️
- Check: ✓
- Upload: ⬆️

**Icon sizing:**
- Inline: 16px
- Standalone: 20px
- Large: 24px

---

## Layout Patterns

### Dashboard
- Urgent actions at top (expiring/expired)
- Calendar view center
- Summary widgets right sidebar

### Entity Profiles (People/Vehicles/Assets)
- Header: Name, photo, key details
- Documents: Grouped by type, status badges
- Timeline: Recent activity

### Document List
- Table view (desktop)
- Card view (mobile)
- Filters: Status, type, entity, date
- Sort: Expiry date (ascending)

---

## Animation

**Subtle, fast transitions:**
- Duration: 150ms (default)
- Easing: ease-in-out
- Never auto-animate large movements (accessibility)

**Use for:**
- Hover states
- Button clicks
- Modal open/close
- Toast notifications

**Don't use for:**
- Page transitions (too slow)
- Background animations (distracting)

---

## Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

**Mobile-first approach:**
- Stack layouts vertically on mobile
- Expand to multi-column on tablet/desktop
- Hide secondary info on mobile (show on click)

---

## File Structure

```
/app
  /dashboard        - Dashboard page
  /people           - People management
  /vehicles         - Vehicles management
  /assets           - Assets management
  /documents        - Document management
  /calendar         - Calendar view
  /reports          - Reporting
  /settings         - Settings
/components
  /ui               - Reusable UI components
  /forms            - Form components
  /layout           - Layout components (sidebar, header)
/lib
  /api              - API client functions
  /utils            - Utility functions
  /types            - TypeScript types
```

---

**Last updated:** 2026-03-08  
**Version:** 1.0  
**Maintained by:** Doug (Clawbot)
