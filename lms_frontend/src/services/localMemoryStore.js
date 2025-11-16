//
// Simple in-memory store for bookmarks and notes during a single session.
// No persistence; suitable for mock/demo usage only.
//
/* eslint-disable no-console */

// PUBLIC_INTERFACE
export const LocalMemoryStore = (() => {
  /** This is a simple in-memory storage for lesson bookmarks and notes. */
  const state = {
    bookmarks: {}, // { [lessonId]: true }
    notes: {},     // { [lessonId]: [{ id, text, createdAt }] }
  };

  const listeners = new Set();

  function emit() {
    listeners.forEach((l) => {
      try { l(getState()); } catch (e) { console.error(e); }
    });
  }

  // PUBLIC_INTERFACE
  function subscribe(listener) {
    /** Subscribe to store changes; returns unsubscribe */
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  // PUBLIC_INTERFACE
  function getState() {
    /** Returns a deep copy of the current state (to avoid mutating by ref) */
    return {
      bookmarks: { ...state.bookmarks },
      notes: Object.fromEntries(
        Object.entries(state.notes).map(([k, v]) => [k, v.map((n) => ({ ...n }))])
      ),
    };
  }

  // PUBLIC_INTERFACE
  function isBookmarked(lessonId) {
    /** Check if lesson is bookmarked */
    return !!state.bookmarks[lessonId];
  }

  // PUBLIC_INTERFACE
  function toggleBookmark(lessonId) {
    /** Toggle bookmark for a given lesson id */
    if (state.bookmarks[lessonId]) {
      delete state.bookmarks[lessonId];
    } else {
      state.bookmarks[lessonId] = true;
    }
    emit();
    return isBookmarked(lessonId);
  }

  // PUBLIC_INTERFACE
  function getNotes(lessonId) {
    /** Get notes array for a lesson */
    return (state.notes[lessonId] || []).map((n) => ({ ...n }));
  }

  // PUBLIC_INTERFACE
  function addNote(lessonId, text) {
    /** Add a note to a lesson; returns the created note */
    if (!text || !text.trim()) return null;
    const note = {
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    state.notes[lessonId] = state.notes[lessonId] || [];
    state.notes[lessonId].unshift(note);
    emit();
    return { ...note };
  }

  // PUBLIC_INTERFACE
  function updateNote(lessonId, noteId, newText) {
    /** Update a note text by id; returns updated note or null */
    const notes = state.notes[lessonId] || [];
    const idx = notes.findIndex((n) => n.id === noteId);
    if (idx === -1) return null;
    notes[idx] = { ...notes[idx], text: (newText || '').trim() };
    emit();
    return { ...notes[idx] };
  }

  // PUBLIC_INTERFACE
  function deleteNote(lessonId, noteId) {
    /** Delete a note by id; returns boolean */
    const notes = state.notes[lessonId] || [];
    const before = notes.length;
    state.notes[lessonId] = notes.filter((n) => n.id !== noteId);
    const removed = state.notes[lessonId].length !== before;
    if (removed) emit();
    return removed;
  }

  return {
    subscribe,
    getState,
    isBookmarked,
    toggleBookmark,
    getNotes,
    addNote,
    updateNote,
    deleteNote,
  };
})();
