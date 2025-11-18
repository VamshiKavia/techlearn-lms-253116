import { v4 as uuidv4 } from 'uuid';

/**
 * PUBLIC_INTERFACE
 * createCourse
 * Inserts a course into the 'courses' table via Supabase. Provides graceful error messaging
 * when the table is missing or RLS forbids insert.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {object} payload - Course fields to insert
 * @returns {Promise<{data:any,error:string|null}>}
 */
export async function createCourse(supabase, payload) {
  try {
    // Include created_by if available from auth session
    let createdBy = null;
    try {
      const { data } = await supabase.auth.getUser();
      createdBy = data?.user?.id || null;
    } catch {
      // ignore
    }

    const record = {
      id: uuidv4(),
      ...payload,
      created_by: createdBy,
    };

    const { data, error } = await supabase.from('courses').insert(record).select().single();
    if (error) {
      const msg = normalizeSupabaseError(error);
      return { data: null, error: msg };
    }
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e?.message || 'Unknown error while creating course' };
  }
}

/**
 * Normalize supabase-js error into a user-friendly message.
 * Attempts to detect missing table or RLS errors.
 */
function normalizeSupabaseError(error) {
  const raw = error?.message || String(error) || 'Unknown error';
  const lower = raw.toLowerCase();

  if (lower.includes('relation') && lower.includes('does not exist')) {
    // Table missing
    return "Courses table doesn't exist in Supabase. Please create it using the SQL in assets/supabase.md.";
  }
  if (lower.includes('permission') || lower.includes('rls') || lower.includes('policy')) {
    return 'Permission denied by Row Level Security policy. Ensure the signed-in user has the Admin role and insert policy is configured.';
  }
  return raw;
}
