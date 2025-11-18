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
 * PUBLIC_INTERFACE
 * listCourses
 * Fetch a paginated, optionally filtered list of courses with total count.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {{search?:string,status?:'draft'|'published',page?:number,pageSize?:number}} params
 * @returns {Promise<{data:any[],count:number,error:string|null}>}
 */
export async function listCourses(supabase, { search, status, page = 1, pageSize = 10 } = {}) {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase
      .from('courses')
      .select('id,title,status,created_at,created_by', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search && search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    query = query.range(from, to);
    const { data, count, error } = await query;
    if (error) {
      return { data: [], count: 0, error: normalizeSupabaseError(error) };
    }
    return { data: data || [], count: count || 0, error: null };
  } catch (e) {
    return { data: [], count: 0, error: e?.message || 'Unknown error while listing courses' };
  }
}

/**
 * PUBLIC_INTERFACE
 * getCourseById
 * Retrieve a single course record by id.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} id
 * @returns {Promise<{data:any|null,error:string|null}>}
 */
export async function getCourseById(supabase, id) {
  try {
    const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
    if (error) {
      return { data: null, error: normalizeSupabaseError(error) };
    }
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e?.message || 'Unknown error while retrieving course' };
  }
}

/**
 * PUBLIC_INTERFACE
 * updateCourse
 * Update a course by id with the provided payload.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<{data:any|null,error:string|null}>}
 */
export async function updateCourse(supabase, id, payload) {
  try {
    const { data, error } = await supabase.from('courses').update(payload).eq('id', id).select().single();
    if (error) {
      return { data: null, error: normalizeSupabaseError(error) };
    }
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e?.message || 'Unknown error while updating course' };
  }
}

/**
 * PUBLIC_INTERFACE
 * deleteCourse
 * Delete a course by id.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} id
 * @returns {Promise<{error:string|null}>}
 */
export async function deleteCourse(supabase, id) {
  try {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      return { error: normalizeSupabaseError(error) };
    }
    return { error: null };
  } catch (e) {
    return { error: e?.message || 'Unknown error while deleting course' };
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
    return 'Permission denied by Row Level Security policy. Ensure the signed-in user has the Admin role and relevant CRUD policies are configured.';
  }
  return raw;
}
