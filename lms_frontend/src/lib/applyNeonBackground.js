/// PUBLIC_INTERFACE
/**
 * applyNeonBackground
 * Previously initialized neon theme/background. Now intentionally a no-op.
 * It will clear any neon-related CSS variables/flags if they were set earlier.
 */
export function applyNeonBackground() {
  if (typeof document === 'undefined') return;
  try {
    const root = document.documentElement;
    const body = document.body;
    root.removeAttribute('data-neon-enabled');
    root.style.removeProperty('--neon-bg');
    root.style.removeProperty('--neon-primary');
    root.style.removeProperty('--neon-accent');
    root.style.removeProperty('--neon-surface');
    root.style.removeProperty('--neon-surface-2');
    root.style.removeProperty('--neon-glow');
    body && body.style.removeProperty('--neon-bg-url');
  } catch {
    // no-op
  }
}
