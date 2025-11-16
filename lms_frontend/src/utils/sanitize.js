export function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  // Basic sanitization to avoid script injections in forms
  return value.replace(/[<>]/g, '').trim();
}

export function safeJSONParse(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}
