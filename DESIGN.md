# Design System Inspired by Claude (Anthropic)

> Source: https://www.getdesign.md/claude/design-md
> Install: `npx getdesign@latest add claude`
> For: SBTI Tools Hub redesign

## 1. Visual Theme & Atmosphere

Claude's interface is a literary salon reimagined as a product page — warm, unhurried, and quietly intellectual. The entire experience is built on a parchment-toned canvas (#f5f4ed) that deliberately evokes the feeling of high-quality paper rather than a digital surface. Where most AI product pages lean into cold, futuristic aesthetics, Claude's design radiates human warmth, as if the AI itself has good taste in interior design.

The signature move is the custom Anthropic Serif typeface — a medium-weight serif with generous proportions that gives every headline the gravitas of a book title. Combined with organic, hand-drawn-feeling illustrations in terracotta (#c96442), black, and muted green, the visual language says "thoughtful companion" rather than "powerful tool."

What makes Claude's design truly distinctive is its warm neutral palette. Every gray has a yellow-brown undertone (#5e5d59, #87867f, #4d4c48) — there are no cool blue-grays anywhere. Borders are cream-tinted (#f0eee6, #e8e6dc), shadows use warm transparent blacks, and even the darkest surfaces (#141413, #30302e) carry a barely perceptible olive warmth.

### Key Characteristics

- Warm parchment canvas (#f5f4ed) evoking premium paper, not screens
- Custom Anthropic type family: Serif for headlines, Sans for UI, Mono for code
- Terracotta brand accent (#c96442) — warm, earthy, deliberately un-tech
- Exclusively warm-toned neutrals — every gray has a yellow-brown undertone
- Organic, editorial illustrations replacing typical tech iconography
- Ring-based shadow system (0px 0px 0px 1px) creating border-like depth without visible borders
- Magazine-like pacing with generous section spacing and serif-driven hierarchy

---

## 2. Color Palette & Roles

### Primary

| Color | Hex | Use |
|-------|-----|-----|
| Anthropic Near Black | #141413 | Primary text, dark-theme surface |
| Terracotta Brand | #c96442 | Primary CTA buttons, brand accent |
| Coral Accent | #d97757 | Text accents, links on dark surfaces |

### Secondary & Accent

| Color | Hex | Use |
|-------|-----|-----|
| Error Crimson | #b53333 | Error states |
| Focus Blue | #3898ec | Input focus rings (only cool color) |

### Surface & Background

| Color | Hex | Use |
|-------|-----|-----|
| Parchment | #f5f4ed | Primary page background |
| Ivory | #faf9f5 | Cards and elevated containers |
| Pure White | #ffffff | Button surfaces, max-contrast elements |
| Warm Sand | #e8e6dc | Button backgrounds, interactive surfaces |
| Dark Surface | #30302e | Dark-theme containers, nav borders |
| Deep Dark | #141413 | Dark-theme page background |

### Neutrals & Text

| Color | Hex | Use |
|-------|-----|-----|
| Charcoal Warm | #4d4c48 | Button text on light surfaces |
| Olive Gray | #5e5d59 | Secondary body text |
| Stone Gray | #87867f | Tertiary text, footnotes |
| Dark Warm | #3d3d3a | Dark text links |
| Warm Silver | #b0aea5 | Text on dark surfaces |

### Borders

| Color | Hex | Use |
|-------|-----|-----|
| Border Cream | #f0eee6 | Standard light-theme border |
| Border Warm | #e8e6dc | Prominent borders, section dividers |
| Border Dark | #30302e | Standard border on dark surfaces |
| Ring Warm | #d1cfc5 | Button hover/focus states |
| Ring Subtle | #dedc01 | Secondary ring variant |
| Ring Deep | #c2c0b6 | Active/pressed states |

---

## 3. Typography Rules

### Font Family

- **Headline**: Anthropic Serif, fallback: Georgia
- **Body / UI**: Anthropic Sans, fallback: system-ui/Inter
- **Code**: Anthropic Mono, fallback: Consolas

### Hierarchy

| Role | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Display / Hero | Serif | 64px | 500 | 1.10 |
| Section Heading | Serif | 52px | 500 | 1.20 |
| Sub-heading Large | Serif | 36px | 500 | 1.30 |
| Sub-heading | Serif | 32px | 500 | 1.10 |
| Sub-heading Small | Serif | 25px | 500 | 1.20 |
| Feature Title | Serif | 20.8px | 500 | 1.20 |
| Body Serif | Serif | 17px | 400 | 1.60 |
| Body Large | Sans | 20px | 400 | 1.60 |
| Body / Nav | Sans | 17px | 400-500 | 1.00-1.60 |
| Body Standard | Sans | 16px | 400-500 | 1.25-1.60 |
| Body Small | Sans | 15px | 400-500 | 1.00-1.60 |
| Caption | Sans | 14px | 400 | 1.43 |
| Label | Sans | 12px | 400-500 | 1.25-1.60 |

### Principles

- Serif for authority, sans for utility
- Single weight (500) for all serif headings — no bold
- Relaxed body line-height (1.60) for literary reading experience
- Tight-but-not-compressed headings (1.10-1.30)
- Micro letter-spacing on small labels (0.12px-0.5px)

---

## 4. Component Stylings

### Buttons

#### Warm Sand (Secondary)
- Background: #e8e6dc
- Text: #4d4c48
- Padding: 0px 12px 0px 8px (asymmetric)
- Radius: 8px (comfortably rounded)
- Shadow: ring-based

#### White Surface
- Background: #ffffff
- Text: #141413
- Padding: 8px 16px 8px 12px
- Radius: 12px (generously rounded)

#### Dark Charcoal
- Background: #30302e
- Text: #faf9f5
- Padding: 0px 12px 0px 8px
- Radius: 8px

#### Brand Terracotta (Primary CTA)
- Background: #c96442
- Text: #faf9f5
- Radius: 8-12px
- Only button with chromatic color

#### Dark Primary
- Background: #141413
- Text: #b0aea5
- Padding: 9.6px 16.8px
- Radius: 12px
- Border: 1px solid #30302e

### Cards & Containers

- Background: Ivory (#faf9f5) or White (#ffffff) on light; Dark Surface (#30302e) on dark
- Border: 1px solid #f0eee6 (light) or #30302e (dark)
- Radius: 8px (standard), 16px (featured), 32px (hero)
- Shadow: whisper-soft (rgba(0,0,0,0.05) 0px 4px 24px)

### Inputs & Forms

- Text: #141413
- Padding: 1.6px 12px (compact vertical)
- Border: standard warm borders
- Focus: ring with #3898ec border-color
- Radius: 12px (generously rounded)

### Navigation

- Sticky top nav with warm background
- Logo in Near Black
- Links: mix of #141413, #5e5d59, #3d3d3a
- CTA: Terracotta Brand or White Surface button

---

## 5. Layout Principles

### Spacing System

- Base unit: 8px
- Scale: 3px, 4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 30px
- Button padding: asymmetric or balanced
- Card internal padding: 24-32px
- Section vertical spacing: 80-120px

### Grid & Container

- Max container width: ~1200px, centered
- Hero: centered with editorial layout
- Feature sections: 1-3 column card grids
- Full-width dark sections for emphasis

### Border Radius Scale

| Name | Radius |
|------|--------|
| Sharp | 4px |
| Subtly rounded | 6-7.5px |
| Comfortably rounded | 8-8.5px |
| Generously rounded | 12px |
| Very rounded | 16px |
| Highly rounded | 24px |
| Maximum rounded | 32px |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow, no border | Parchment background |
| Contained (1) | 1px solid border | Standard cards, sections |
| Ring (2) | 0px 0px 0px 1px ring shadows | Interactive cards, buttons |
| Whisper (3) | rgba(0,0,0,0.05) 0px 4px 24px | Elevated cards |
| Inset (4) | inset 0px 0px 0px 1px at 15% | Active/pressed states |

### Shadow Philosophy

Claude communicates depth through warm-toned ring shadows rather than traditional drop shadows. The signature `0px 0px 0px 1px` pattern creates a border-like halo.

---

## 7. Do's and Don'ts

### Do

- ✅ Use Parchment (#f5f4ed) as primary background
- ✅ Use Anthropic Serif at weight 500 for all headlines
- ✅ Use Terracotta (#c96442) only for primary CTAs
- ✅ Keep all neutrals warm-toned
- ✅ Use ring shadows (0px 0px 0px 1px) for interactive states
- ✅ Maintain serif/sans hierarchy
- ✅ Use generous body line-height (1.60)
- ✅ Alternate light/dark sections for rhythm
- ✅ Apply generous border-radius (12-32px)

### Don't

- ❌ Use cool blue-grays anywhere
- ❌ Use bold (700+) weight on serif
- ❌ Introduce saturated colors beyond Terracotta
- ❌ Use sharp corners (< 6px)
- ❌ Apply heavy drop shadows
- ❌ Use pure white (#ffffff) as page background
- ❌ Use geometric/tech-style illustrations
- ❌ Reduce body line-height below 1.40
- ❌ Use monospace for non-code content
- ❌ Mix sans-serif for headlines

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Small Mobile | <479px | Minimum layout, stacked |
| Mobile | 479-640px | Single column, hamburger nav |
| Large Mobile | 640-767px | Slightly wider content |
| Tablet | 768-991px | 2-column grids begin |
| Desktop | 992px+ | Full multi-column layout |

### Touch Targets

- Buttons: 8-16px vertical minimum
- Minimum recommended: 44x44px

---

## 9. Example Prompts for AI Agents

### Hero Section
```
Create a hero section on Parchment (#f5f4ed) with a headline at 64px Anthropic Serif weight 500, line-height 1.10. Use Near Black (#141413) text. Add a subtitle in Olive Gray (#5e5d59) at 20px with 1.60 line-height. Place a Terracotta Brand (#c96442) CTA button with Ivory text, 12px radius.
```

### Feature Card
```
Design a feature card on Ivory (#faf9f5) with 1px solid Border Cream (#f0eee6) border and comfortably rounded corners (8px). Title in Anthropic Serif at 25px weight 500, description in Olive Gray at 16px. Add a whisper shadow.
```

### Dark Section
```
Build a dark section on Near Black (#141413) with Ivory headline text in Anthropic Serif at 52px weight 500. Use Warm Silver (#b0aea5) for body text. Borders in Dark Surface (#30302e).
```

### Button
```
Create a button in Warm Sand (#e8e6dc) with Charcoal Warm (#4d4c48) text, 8px radius, and ring shadow (0px 0px 0px 1px #d1cfc5). Padding: 0px 12px 0px 8px.
```

---

## Quick Color Reference

| Token | Hex | Use |
|-------|-----|-----|
| Terracotta Brand | #c96442 | Brand CTA |
| Parchment | #f5f4ed | Page Background |
| Ivory | #faf9f5 | Card Surface |
| Near Black | #141413 | Primary Text |
| Olive Gray | #5e5d59 | Secondary Text |
| Stone Gray | #87867f | Tertiary Text |
| Border Cream | #f0eee6 | Borders (light) |
| Dark Surface | #30302e | Dark Surface |
| Warm Sand | #e8e6dc | Button Background |
| Charcoal Warm | #4d4c48 | Button Text |
