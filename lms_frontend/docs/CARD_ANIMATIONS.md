# Shared Card Hover Animations

All card-like components receive a slow, smooth premium hover animation via a shared stylesheet:

- Transition: 250–400ms (default 320ms) with ease-in-out
- Motion: translateY(-3px to -5px) and scale(1.02)
- Glow: faint #541161 shadow
- No opacity or mask/overlay changes to preserve visibility
- Reduced-motion users receive static, non-animated styles

Selectors covered: `.card`, `[data-card]`, `.courseCard`

File: `src/styles/premium-cards-shared.css`  
Imported in: `src/index.css` (global), and `components/layout/AppShell.css` (layout scope)

To disable animations on specific screens (e.g., for tests), use a page-level stylesheet that overrides transitions with `!important`, for example `pages/student/overview-disable-animations.css`.
