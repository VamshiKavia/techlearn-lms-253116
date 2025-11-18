/// PUBLIC_INTERFACE
/**
 * applyNeonBackground
 * Sets a CSS variable on the body that points to the neon background image.
 * This avoids CRA build-time asset resolution since the attachment lives outside /public.
 *
 * It respects user motion preference by not adding any animations, only a static image URL.
 */
export function applyNeonBackground() {
  try {
    const path = '/attachments/20251118_075416_abstract-flowing-neon-wave-background.jpg';
    const url = new URL(path, window.location.origin).toString();
    document.body.style.setProperty('--neon-bg-url', `url("${url}")`);
  } catch {
    // fail silently to not break the app
  }
}
