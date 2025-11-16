import { nanoid } from 'nanoid';

// PUBLIC_INTERFACE
export function useRequestId() {
  /** Generate a stable request id per session for diagnostics. */
  const id = nanoid(16);
  return () => id;
}
