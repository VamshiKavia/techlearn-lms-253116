/**
 * JS shim to re-export TS supabase client.
 * Logs a non-sensitive info line about env mode resolution.
 */
// eslint-disable-next-line no-console
console.info('Supabase env resolver: envMode=REACT_APP (CRA)');

export { default } from './supabaseClient.ts';
export * from './supabaseClient.ts';
