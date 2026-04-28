---
name: PRODUCT
description: Strategic design context for datagrid-shadcn — register, audience, personality, anti-references, principles
type: project
---

# Product

## Register

brand

## Users

Frontend developers evaluating UI libraries for their next project. They land on the showcase site from GitHub, the shadcn registry directory, X/Bluesky, or a colleague's link. They have a real DataGrid problem to solve in their own app — usually involving sorting, virtualization, inline editing, or server-side pagination — and they're sizing up whether to adopt this component or keep searching.

Their context when using the showcase site: a browser tab open next to their editor, scanning fast, looking for proof that the component is real, well-engineered, and won't bite them in production. They want to copy a `npx shadcn add` command, drop it into a sandbox, and decide within ten minutes.

Their context when using the DataGrid component itself: building data-heavy product UI inside their own app — internal tools, dashboards, admin surfaces. They will read the source, fork it, and theme it. They are more skeptical than typical end users — they'll judge code quality, prop ergonomics, and visual restraint.

The job to be done: "Show me, in under a minute, that this DataGrid is better-built and better-looking than what I could ship myself, and prove it by letting me poke at it."

## Product Purpose

datagrid-shadcn is a feature-rich, composable DataGrid component distributed via the shadcn registry. It exists because the shadcn ecosystem has excellent primitives but lacks a serious DataGrid — most production teams either fall back to AG Grid (heavy, license-encumbered, looks like 2014 enterprise SaaS) or hand-roll a TanStack Table wrapper from scratch every project.

The repository ships two artifacts that must succeed together:

1. **The DataGrid component** — installed into other projects. This is product-register UI: dense, keyboard-first, dashboard-grade. Composable so consumers can replace any sub-component (Header, Body, Pagination, ActionDock).
2. **The showcase site** — the public face at abaktiar.github.io/datagrid-shadcn. This is brand-register: it must convince a skeptical developer in under a minute that the component is worth installing. The site is the credibility. If the showcase is a stock shadcn template, no one will trust the component to be more than stock either.

Success looks like: a developer lands, plays with a real DataGrid above the fold (not a screenshot), trusts what they see, copies the install command, and ships it.

## Brand Personality

**Confident. Technical. Warm.**

- **Voice**: like a senior engineer demoing their tool to a peer. Direct, no marketing varnish, occasional dry wit. Assumes the reader knows what TanStack Table is. Never explains what a DataGrid is.
- **Tone**: serious about craft, relaxed about presentation. Comfortable with technical density — code samples, prop tables, keyboard shortcuts — but never cold.
- **Emotional goal**: the reader should feel "this person knows what they're doing, and they care about the same things I do." Not awe, not hype — recognition.

The existing amber/orange palette and dark default support this lane: warm enough to feel inviting, technical enough to look like a tool, distinct enough to not be confused with a generic shadcn scaffold.

## Anti-references

Explicitly NOT:

- **Generic shadcn demo clones.** Default zinc neutrals, stock dark-mode, identical icon-card-grid of features, no point of view. The "I scaffolded this in 30 minutes" look. If the site could be confused with someone's weekend project, it has failed.
- **Heavy enterprise admin (AG Grid / Material UI / Sencha).** Dense gray chrome, navy/corporate-blue accents, ribbon toolbars, settings dropdown soup, busy headers. Looks like procurement-driven 2014 enterprise SaaS. The DataGrid is enterprise-capable; the surface should not look enterprise-built.
- **Crypto / AI-startup neon-on-black.** Hot pink/cyan gradients on pure black, glassmorphism everywhere, glowing buttons, hero-metric templates ("10M+ rows!"), gradient text on the H1. This is the category-reflex AI-slop aesthetic. Avoid even when going dark.
- **Marketing-fluff landing (no substance).** Big vague claims, generic illustrations, testimonial carousels, fake usage metrics, "trusted by" logo strips. The site should feel like a tool, not a pitch deck. Skepticism is the default audience posture — earn trust with the actual component, not copy.

## Design Principles

1. **Show, don't tell.** The primary above-the-fold artifact is a real, fully interactive DataGrid — not a screenshot, not an illustration, not a hero-metric template. The user can sort, filter, edit, and right-click before they read a single marketing sentence. This is the single most important principle: the component IS the pitch.

2. **Practice what you preach.** The showcase site itself must demonstrate the visual quality the component enables. If our DataGrid is sharp, the page housing it must be sharper. Sloppy hero typography or generic feature cards on a site selling a "feature-rich, polished DataGrid" destroys credibility on contact.

3. **Engineering craft over marketing polish.** Treat the site like a great README rendered as an interface. Trust comes from clarity, prop tables, real code samples, accurate keyboard shortcuts — not from gradient backgrounds or animated illustrations. Reference set: Linear, Raycast, Vercel for confidence; Resend and Cal.com for warmth.

4. **Density without dread.** DataGrids are inherently dense. Both the component and the site must make density feel calm and scannable rather than overwhelming. This means generous spacing around dense regions, deliberate typographic hierarchy, and restraint with color inside data surfaces — saving the warm accent for moments that deserve attention.

5. **Composability is visible.** The component is built to be reshaped, themed, and extended. The showcase should reflect that variety somewhere — not one frozen canonical look. Even subtle signals (a section showing a different theme, or a dense vs. roomy variant) reinforce the message that this is meant to be your DataGrid, not theirs.

## Accessibility & Inclusion

**Target: WCAG 2.1 AA, keyboard-first.**

- **Contrast**: AA on all text and interactive elements in both light and dark themes. Validate with each theme variation, not just the default.
- **Keyboard navigation**: full keyboard support is already a documented feature of the DataGrid; the showcase site must match — every interactive element reachable via Tab, every dropdown / context menu navigable with arrow keys, Esc closes overlays. Tab order must be logical (top-to-bottom, left-to-right reading flow).
- **Focus indicators**: visible, high-contrast focus rings on every interactive element. Never `outline: none` without a replacement. The current amber accent can serve as the focus color in dark mode, but verify contrast on light backgrounds.
- **Screen readers**: semantic HTML for the showcase site (proper heading hierarchy, landmark regions, alt text on any decorative imagery). The DataGrid itself uses ARIA roles, labels, and descriptions — preserve those.
- **Reduced motion**: honor `prefers-reduced-motion`. Any decorative motion on the showcase site (entrance animations, hover transitions on cards) must shorten or disable when the user has requested it. The DataGrid's interactive feedback (hover, selection, editing transitions) should remain — those are functional, not decorative.
- **Color independence**: never rely on color alone to convey state (e.g., active/inactive/pending row status). Pair color with a label, icon, or shape.
- **Touch targets**: 44px minimum for interactive elements on touch devices, even though the DataGrid's primary audience is desktop. Pagination, action dock buttons, and filter inputs must work on tablet.
