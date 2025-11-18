# Neon Wave Background Integration

This app applies a global neon wave background and cohesive neon theme:

- Global import: `src/index.css` imports `/assets/neon_wave_theme.css` and defines the background using the attached image path.
- Background: Implemented with `body::before` for the image and `body::after` for a dark-to-transparent overlay to improve readability.
- Performance: Uses `background-size: cover` with `position: fixed` and `transform: translateZ(0)` to leverage GPU and avoid layout thrashing.
- Accessibility: Respects `prefers-reduced-motion: reduce` by disabling any transitions/animations on background layers.
- Contrast: Cards, modals, panels, and layout shells use `.neon-surface` or `.card` glassmorphic surfaces to ensure text remains legible while retaining neon accents.

Tuning:
- Overlay strength: Adjust the alpha stops in `body::after` gradient inside `src/index.css`.
- Surface opacity: Modify `--glass-bg` and `--glass-border` variables in `:root` (defined in `src/index.css` and `src/styles/theme.css`).
- Accent colors: Use `--neon-accent` and `--neon-accent-2` variables (provided by `/assets/neon_wave_theme.css` with fallbacks).

Do not move or rename the attached image. It is referenced as:
`/attachments/20251118_075416_abstract-flowing-neon-wave-background.jpg`
