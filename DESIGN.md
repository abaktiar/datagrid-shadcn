---
name: datagrid-shadcn
description: Engineering-craft DataGrid with a warm brand surface and a cool data surface
colors:
  forge-copper: "oklch(0.5553 0.1455 48.9975)"
  forge-copper-bright: "oklch(0.7049 0.1867 47.6044)"
  forge-copper-deep: "oklch(0.4400 0.1300 48.9975)"
  workshop-steel: "oklch(0.6847 0.1479 237.3225)"
  workshop-twilight: "oklch(0.3098 0.0397 229.3202)"
  parchment-cream: "oklch(0.9885 0.0057 84.5659)"
  parchment-warm: "oklch(0.9686 0.0091 78.2818)"
  parchment-edge: "oklch(0.8866 0.0404 89.6994)"
  ink-warm: "oklch(0.3660 0.0251 49.6085)"
  ink-muted: "oklch(0.5534 0.0116 58.0708)"
  workshop-near-black: "oklch(0.1661 0.0051 56.0434)"
  workshop-graphite: "oklch(0.2085 0.0063 34.2976)"
  workshop-bone: "oklch(0.9699 0.0013 106.4238)"
  workshop-edge: "oklch(0.3241 0.0087 67.5582)"
  ember-red: "oklch(0.5771 0.2152 27.3250)"
typography:
  display:
    fontFamily: "Geist, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "Geist, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
  mono:
    fontFamily: "Geist Mono, JetBrains Mono, Fira Code, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.forge-copper}"
    textColor: "{colors.parchment-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.forge-copper-deep}"
    textColor: "{colors.parchment-cream}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-warm}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.parchment-warm}"
    textColor: "{colors.ink-warm}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "36px"
  input-text:
    backgroundColor: "{colors.parchment-cream}"
    textColor: "{colors.ink-warm}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "36px"
  card-feature:
    backgroundColor: "{colors.parchment-warm}"
    textColor: "{colors.ink-warm}"
    rounded: "{rounded.lg}"
    padding: "20px"
  datagrid-cell:
    backgroundColor: "transparent"
    textColor: "{colors.ink-warm}"
    typography: "{typography.body}"
    padding: "10px 14px"
    height: "40px"
  datagrid-row-selected:
    backgroundColor: "{colors.workshop-steel}"
    textColor: "{colors.parchment-cream}"
---

# Design System: datagrid-shadcn

## 1. Overview

**Creative North Star: "The Lit Workbench"**

Imagine a workshop after hours: a warm task lamp pooling amber light over a steel workbench, precision tools laid out, the rest of the room receding into deep dusk. The brand surface is the warm task light — parchment cream in day, near-black with a warm tilt at night, copper as the ambient accent. The data surface is the steel — calmer, cooler, with a workshop-blue that carries through tables, charts, and selection states. Two color climates, one workshop. The warmth invites the developer in; the cool precision is what they came to use.

This system rejects four reflexes that haunt component-library showcases. It is not a generic shadcn demo (default zinc neutrals, stock dark mode, identical icon-card grids). It is not heavy enterprise admin (navy-on-gray chrome, ribbon toolbars, Material UI density). It is not crypto/AI-startup neon-on-black (gradient text, glassmorphism, hot-pink-on-cyan hero metrics). And it is not marketing-fluff landing (vague claims, generic illustrations, fake metrics, "trusted by" logo strips). The voice is a senior engineer demoing to a peer — warm, direct, technically dense, never hyped.

Density is the central craft challenge. A DataGrid is by nature dense. The system has to make density feel scannable rather than oppressive — generous whitespace around dense regions, deliberate type hierarchy, restraint with color inside data surfaces, and a single unmistakable accent for moments that genuinely deserve attention.

**Key Characteristics:**
- Warm copper as the brand voice; cool steel-blue as the data voice. The two never fight on the same surface.
- Dark mode is the default. Both themes are first-class — neither is an afterthought.
- Geometric sans (Geist) for everything. No serif. No display font. Hierarchy through weight + size + tracking, not family.
- Engineering-craft references: Linear, Raycast, Vercel for confidence; Resend, Cal.com for warmth.
- Above-the-fold artifact is a real, fully interactive DataGrid — not a screenshot, not a hero metric.

## 2. Colors: The Lit Workbench Palette

A warm-leaning system anchored on copper, with a contained cool secondary reserved for data surfaces. Neutrals are tinted toward the brand hue (warm yellow-orange in light, warm near-black in dark) — never pure gray.

### Primary
- **Forge Copper** (`oklch(0.5553 0.1455 48.9975)` — light mode default): The warm task-lamp glow. Used for primary buttons, links on hover, focus rings, sparingly for emphasis in body copy. This is the brand voice. Light mode default; in dark mode shifts to **Forge Copper Bright** (`oklch(0.7049 0.1867 47.6044)`) for contrast.
- **Forge Copper Deep** (`oklch(0.4400 0.1300 48.9975)`): Pressed/active states, deeper hover treatments on light mode primary buttons.

### Secondary (data surface only — see The Workshop Voltage Rule)
- **Workshop Steel** (`oklch(0.6847 0.1479 237.3225)` ≈ `#5e94d6`): Cool periwinkle-blue. Reserved for **inside the DataGrid surface**: row selection highlight, data charts, secondary chart series, sortable column hover indicator. Never appears on the marketing surface (hero, feature cards, nav, CTAs).
- **Workshop Twilight** (`oklch(0.3098 0.0397 229.3202)` ≈ `#3a4458`): Deep desaturated navy. Used as a contained dark-mode panel tint behind data regions in dark theme — the "workbench surface" the steel tools sit on. Never used as page chrome or background.

### Neutral — Day (light mode)
- **Parchment Cream** (`oklch(0.9885 0.0057 84.5659)`): Page background. Not white. Has a perceptible warm yellow-orange tilt that reads as "lamp light on aged paper."
- **Parchment Warm** (`oklch(0.9686 0.0091 78.2818)`): Card and popover surfaces. One step deeper than the page.
- **Parchment Edge** (`oklch(0.8866 0.0404 89.6994)`): Borders and input outlines.
- **Ink Warm** (`oklch(0.3660 0.0251 49.6085)`): Body text. A warm dark brown, not black.
- **Ink Muted** (`oklch(0.5534 0.0116 58.0708)`): Secondary text, captions, disabled states.

### Neutral — Night (dark mode)
- **Workshop Near-Black** (`oklch(0.1661 0.0051 56.0434)`): Page background. Warm-tilted near-black — never `#000`.
- **Workshop Graphite** (`oklch(0.2085 0.0063 34.2976)`): Card, popover, and side surfaces.
- **Workshop Edge** (`oklch(0.3241 0.0087 67.5582)`): Borders.
- **Workshop Bone** (`oklch(0.9699 0.0013 106.4238)`): Body text. Warm off-white.

### Destructive
- **Ember Red** (`oklch(0.5771 0.2152 27.3250)`): Destructive actions, error states. Slightly warm, sits in the same hue family as copper rather than fighting it.

### Named Rules

**The Workshop Voltage Rule.** Workshop Steel and Workshop Twilight are forbidden on the marketing surface (hero, feature cards, nav, footer, CTAs). They live exclusively inside the DataGrid and adjacent data UI (filters, action dock, pagination chrome). The page is warm; the tool is cool. If you put steel-blue on a CTA button, you've collapsed the dual-register story into generic enterprise admin.

**The One Glow Rule.** Forge Copper appears on no more than ~10% of any given marketing screen. Its rarity is the point. If the whole hero glows copper, nothing glows copper.

**The Tinted-Neutral Rule.** Every neutral carries a warm hue tilt (chroma 0.005–0.025). Pure-gray neutrals (`oklch(L 0 H)`) are forbidden — they read as Material/enterprise. Every "white" is a parchment, every "black" is a near-black with warm cast.

## 3. Typography

**Display / Body / Label Font:** Geist Sans (with Inter as the closest substitution fallback)
**Mono Font:** Geist Mono (with JetBrains Mono as fallback)

**Character:** A single geometric humanist sans carries the entire system — display, body, and label all live in one family. Geist's tight tracking at large sizes, generous counters at small sizes, and excellent number rendering are why it's chosen: a DataGrid lives or dies on tabular numerals. There is no serif. There is no display font. Hierarchy comes from weight, size, and tracking — not from typeface contrast. This restraint is the typography statement: the work speaks, the typeface is the vehicle.

### Hierarchy

- **Display** (Geist 600, `clamp(2.5rem, 6vw, 4.5rem)`, line-height 1.05, tracking -0.025em): Hero headline only. Used once per page, max.
- **Headline** (Geist 600, `clamp(1.75rem, 3.5vw, 2.5rem)`, line-height 1.15, tracking -0.02em): Section openers.
- **Title** (Geist 500, `1.125rem`, line-height 1.4, tracking -0.01em): Card and component headings.
- **Body** (Geist 400, `1rem`, line-height 1.6, tracking 0): Prose. Cap line length at 65–75ch.
- **Label** (Geist 500, `0.8125rem`, line-height 1.3, tracking 0.01em): Buttons, form labels, table headers, micro-copy. Sentence-case, never UPPERCASE.
- **Mono** (Geist Mono 400, `0.875rem`, line-height 1.5): Code samples, prop tables, keyboard shortcuts, the install command. Mono carries technical authority — use it where the reader expects code.

### Named Rules

**The No-Caps Rule.** Section headers, button labels, and tabs are sentence-case. UPPERCASE LABELS are forbidden — they are the most reliable signal of generic SaaS templates. Tracking-wide small caps are acceptable only in chart axes and table header micro-copy where typographic differentiation is functional, not decorative.

**The Tabular Numerals Rule.** Inside the DataGrid (any data cell containing numbers), Geist's tabular-numerals OpenType feature must be enabled (`font-feature-settings: "tnum" 1`). Numbers must align column-down, every digit. Misaligned digits in a financial column are unforgivable.

**The One Family Rule.** No serif. No second sans. No script. The whole system is one geometric sans family. Variety comes from weight (400, 500, 600) and size, not from typeface contrast.

## 4. Elevation

The system is mostly flat. Surfaces are distinguished by tonal layering — page → card → popover, each one step deeper in the warm/dark scale — with shadows used sparingly and only on genuinely floating elements (popovers, dropdowns, the action dock when hovering over selected rows).

The shadow vocabulary is warm-tinted, low-blur, low-spread — a quiet 28° hue cast pulled from the brand warm hue. No black drop shadows; black on a warm surface reads as a void. In dark mode, shadows deepen toward `hsl(0 0% 0%)` since pure black is what's behind the surface anyway.

### Shadow Vocabulary

- **shadow-xs** (`0 2px 3px hsl(28 18% 25% / 0.09)`): Resting elevation on outline buttons, inputs. Barely-there.
- **shadow-sm** (`0 2px 3px hsl(28 18% 25% / 0.18), 0 1px 2px -1px hsl(28 18% 25% / 0.18)`): Default lifted elements (dropdowns, tooltips).
- **shadow-md** (`0 2px 3px / 0.18, 0 2px 4px -1px / 0.18`): Popovers, the action dock when active.
- **shadow-lg** (`0 2px 3px / 0.18, 0 4px 6px -1px / 0.18`): Modals (used sparingly — see Modal philosophy below).
- **shadow-xl / 2xl**: Reserved for the rare hero moment. Avoid by default.

### Named Rules

**The Flat-By-Default Rule.** Cards, sections, and tables sit flat on the surface. Shadows appear only as a response to state (hover, focus, active dropdown) or to indicate genuine floating (popover, tooltip, dropdown menu).

**The Warm-Shadow Rule.** Light-mode shadows carry the brand warm hue (`hsl(28 18% 25%)` — a warm brown tint at 9–18% opacity). Pure-black shadows on warm parchment read as dirty smudges, not depth. Use the warm-tinted shadow tokens — never `rgba(0, 0, 0, X)` directly.

**Modal As Last Resort.** Modals are usually laziness. Exhaust inline editing, popovers, and progressive-disclosure alternatives first. The DataGrid already does this well (inline cell editing, popover filters) — the showcase site should follow the same discipline.

## 5. Components

### Buttons
- **Shape:** Gently curved corners (8px / `{rounded.md}`). Pill buttons (>16px radius) are forbidden — they read as marketing landing.
- **Primary:** Forge Copper background, parchment-cream text, label-weight Geist 500. `10px 20px` internal padding, `40px` height. Shadow-xs at rest. Hover: depth shifts to Forge Copper Deep with a 150ms ease-out-quart transition. Active: same dark, no transition.
- **Outline:** Transparent background, ink-warm text, parchment-edge border. Hover fills with parchment-warm. Used for secondary CTAs (e.g., "View on GitHub" next to "Install").
- **Ghost:** No background, ink-muted text. Hover lifts to a subtle parchment-warm wash. Used for tertiary actions (toolbar buttons inside the DataGrid).
- **Focus:** A 3px Forge Copper ring at 50% opacity, offset 2px from the button edge. Never `outline: none` without a replacement.

### Cards (Feature Cards)
- **Corner Style:** 10px (`{rounded.lg}`).
- **Background:** Parchment-warm (light) / workshop-graphite (dark). One step deeper than the page.
- **Border:** 1px parchment-edge / workshop-edge. Hairline.
- **Internal Padding:** 20px on three sides, 24px on top to seat the icon area.
- **Hover:** Translate-Y -4px with a soft warm-tinted shadow-lg, 300ms ease-out-quart. No scaling, no border color change.
- **Identical Card Grid Ban.** Six identical icon-heading-text cards in a 3-column grid is the generic shadcn-demo template. Vary card sizes, mix in screenshot-cards or quote-cards, or skip the card grid entirely.

### Inputs / Fields
- **Style:** 1px parchment-edge border, 6px (`{rounded.sm}`) corners, parchment-cream background, 8px×12px padding, 36px height.
- **Focus:** Border shifts to Forge Copper, plus a 3px ring at 50% opacity. No glow. No animated border.
- **Inside the DataGrid:** The cell-edit input is borderless and inherits the cell padding — it's part of the table, not a popover.

### Navigation (Showcase Site)
- **Style:** A single horizontal bar, parchment-cream background with a hairline parchment-edge bottom border. Logo left, sparse links right (max 4: Demo, Docs, GitHub, NPM).
- **Link Default:** Ink-warm, label-size, weight 500.
- **Link Hover:** Forge copper, no underline by default — the color shift is the hover.
- **Active Link:** Forge copper with a 1px copper underline 4px below the baseline.

### DataGrid (Signature Component)

The DataGrid is the centerpiece of the entire project — it gets its own component vocabulary distinct from the surrounding marketing surface.

- **Surface:** Parchment-warm (light) / workshop-twilight (dark). Has its own background distinct from the page — sits ON the workbench, not in the page flow.
- **Header Row:** label-weight Geist 500, ink-muted color, parchment-edge bottom border. Sortable columns get a subtle workshop-steel hover hint (the cool data voice surfacing).
- **Cells:** Body typography with `font-feature-settings: "tnum" 1` for tabular numerals. 10px×14px padding, 40px row height by default, 32px in dense mode.
- **Row Hover:** Parchment-cream wash (light) / workshop-graphite wash (dark). 100ms ease-out, no transform.
- **Row Selected:** Workshop-steel at ~12% opacity background, with a 2px workshop-steel left edge (this is the ONE permitted left-edge stripe in the system — reserved for selected data rows, never for marketing callouts).
- **Cell Edit Mode:** Cell border-edges become Forge Copper while the editor is active. The component visually transitions from "data" voice (steel) to "action" voice (copper) — the user is doing something, not viewing.
- **Action Dock:** Appears at the bottom of the table when rows are selected. Workshop-graphite surface (light AND dark — yes, intentionally dark in light mode), parchment-cream text. Reads as a tool tray sliding out from under the workbench. Slides in with translate-Y, 200ms ease-out-quart.
- **Pagination:** Ghost buttons at the bottom-right, label-size, label-weight. The current-page indicator is the only place outside row-select where workshop-steel appears in the table chrome.

### Code Block (Install Command)
The above-the-fold install command is a critical component — many visitors will copy it before reading anything.
- **Surface:** Workshop-near-black background (in BOTH light and dark themes — the install command lives on its own dark slab, like a terminal pane, even on the warm light page).
- **Type:** Geist Mono, workshop-bone color, 0.875rem.
- **Padding:** 16px×20px.
- **Copy Button:** Top-right corner, ghost button on the dark surface, parchment-edge text. Hover: forge-copper-bright text. Click: animates to a check icon for 1.5s, then back.

## 6. Do's and Don'ts

### Do:
- **Do** keep the marketing surface warm (parchment + copper) and the DataGrid surface cool-tinted (steel for selection/data accents, twilight for dark-mode panels). The dual-register story is the whole point.
- **Do** use Geist Sans + Geist Mono only. One family for type, period.
- **Do** tilt every neutral toward the brand warm hue. Chroma 0.005–0.025, never 0.
- **Do** put a real, fully interactive DataGrid above the fold on the showcase. The component IS the pitch.
- **Do** enable tabular numerals (`font-feature-settings: "tnum" 1`) in every numeric DataGrid cell.
- **Do** keep `prefers-reduced-motion` honored: decorative animations (float, shimmer, fade-in-up) shorten or disable; functional state transitions (hover, focus, edit) remain.
- **Do** ship both dark and light themes. Dark is the default; light must be equally polished, not an afterthought.

### Don't:
- **Don't** put Workshop Steel or Workshop Twilight on the marketing surface (hero, CTAs, feature cards, nav). That collapses the dual-register story into generic enterprise admin (the AG Grid / Material lane we explicitly reject in PRODUCT.md).
- **Don't** use gradient text. Specifically: **delete the `.gradient-text` utility from `index.css`** — `background-clip: text` over a copper-to-yellow gradient is the absolute-banned hero treatment. Replace with solid Forge Copper at heavier weight if emphasis is needed.
- **Don't** use glassmorphism. Specifically: **delete the `.glass-panel` utility** — the blurred-translucent-card aesthetic is the crypto/AI-startup neon-on-black anti-reference made manifest. Use solid surfaces.
- **Don't** ship UPPERCASE LABELS or tracking-wide small-cap section headers. That's the most reliable "generic SaaS" tell.
- **Don't** ship pure black (`#000`) or pure white (`#fff`) anywhere. The neutrals are tinted parchment and warm near-black.
- **Don't** ship pure-gray borders, surfaces, or text. Every neutral has a warm hue tilt.
- **Don't** ship a 3-column 6-card identical-icon feature grid. That's the generic shadcn-demo silhouette.
- **Don't** ship hero-metric template ("10M+ rows!", "<1ms render!"). Even if true, it reads as marketing fluff. Show the metric by demonstrating it, not announcing it.
- **Don't** ship gradient buttons, glowing buttons, or animated borders. Buttons are flat surfaces with hover-state color shifts.
- **Don't** ship a "Trusted by" logo strip. There are no logos to put there, and forging social proof destroys credibility.
- **Don't** ship side-stripe colored borders >1px on cards, callouts, or list items. The single permitted left-edge stripe in the entire system is the 2px Workshop Steel selected-row indicator inside the DataGrid.
- **Don't** ship `border-radius` greater than 14px on any element except a circular avatar. Pill buttons read as marketing-landing, not engineering-craft.
- **Don't** ship modals as a first thought. Inline editing, popovers, and progressive disclosure are the discipline — match the DataGrid's own pattern.
- **Don't** introduce a serif. Merriweather has been removed from the font stack on purpose; do not re-add it.
- **Don't** introduce a display font (no Cal Sans, no Inter Display, no display-only third family). Geist Sans at 600 weight handles all display needs.
