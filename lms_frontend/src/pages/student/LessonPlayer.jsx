import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { Skeleton } from '../../components/ui/Skeleton';
import { mockCourses } from '../../services/mockData';
import { LocalMemoryStore } from '../../services/localMemoryStore';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * LessonPlayer with mock content, in-memory bookmarks and notes (CRUD), and minimal breadcrumbs.
 * Resolves the lesson from route params: /student/courses/:courseId/lessons/:lessonId
 */
export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const [storeState, setStoreState] = useState(LocalMemoryStore.getState());
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = LocalMemoryStore.subscribe(setStoreState);
    return () => unsub();
  }, []);

  const resolved = useMemo(() => {
    const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
    let found = null;
    let foundModule = null;
    for (const m of course?.modules || []) {
      const f = (m.lessons || []).find((l) => l.id === lessonId);
      if (f) {
        found = f;
        foundModule = m;
        break;
      }
    }
    if (!found) {
      const firstModule = (course?.modules || [])[0];
      found = firstModule?.lessons?.[0] || null;
      foundModule = firstModule || null;
    }
    return { course, module: foundModule, lesson: found };
  }, [courseId, lessonId]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [courseId, lessonId]);

  const isBookmarked = LocalMemoryStore.isBookmarked(lessonId);
  const notes = LocalMemoryStore.getNotes(lessonId);

  function handleToggleBookmark() {
    LocalMemoryStore.toggleBookmark(lessonId);
  }
  function handleAddNote(e) {
    e.preventDefault();
    LocalMemoryStore.addNote(lessonId, newNote);
    setNewNote('');
  }
  function handleUpdateNote(noteId, text) {
    LocalMemoryStore.updateNote(lessonId, noteId, text);
  }
  function handleDeleteNote(noteId) {
    LocalMemoryStore.deleteNote(lessonId, noteId);
  }

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Student', to: '/student/overview' },
    resolved.course ? { label: resolved.course.title, to: `/student/courses/${resolved.course.id}` } : null,
    { label: resolved.lesson?.title || 'Lesson' },
  ].filter(Boolean);

  return (
    <div>
      <Breadcrumbs items={crumbs} />

      <div className="mb-4">
        {loading ? (
          <div className="skeleton" style={{ height: 26, width: '50%' }} />
        ) : (
          <h1 className="h1">{resolved.lesson?.title || 'Lesson'}</h1>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 md:col-span-2" role="region" aria-label="Lesson content">
          {loading ? (
            <>
              <div className="skeleton mb-4" style={{ height: 320, width: '100%', borderRadius: 12 }} />
              <div className="skeleton mb-2" style={{ height: 14, width: '80%' }} />
              <div className="skeleton mb-2" style={{ height: 14, width: '60%' }} />
              <div className="skeleton" style={{ height: 36, width: 160 }} />
            </>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="subtle" style={{ fontSize: 13 }}>
                    {resolved.module ? `Module ${resolved.module.id}` : 'Module'}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{resolved.lesson?.title || 'Lesson'}</h2>
                </div>
                <Button
                  variant={isBookmarked ? 'secondary' : 'primary'}
                  onClick={handleToggleBookmark}
                  aria-pressed={isBookmarked}
                  ariaLabel={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                {/* Mock lesson body */}
                This is the lesson player area. Content would appear here.
              </div>
              <div className="mt-4">
                <Link to="/student/courses" className="text-sm text-gray-600 underline" aria-label="Back to My Learning">
                  Back to My Learning
                </Link>
              </div>
            </>
          )}
        </Card>

        <Card role="region" aria-label="Lesson notes" className="p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Notes</h2>
          <form onSubmit={handleAddNote} className="mb-3" aria-label="Add note form">
            <label htmlFor="newNote" className="sr-only">Add a note</label>
            <Input
              id="newNote"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a quick note…"
              aria-label="Note text"
            />
            <div className="mt-2">
              <Button type="submit" variant="primary" ariaLabel="Save note">
                Save
              </Button>
            </div>
          </form>

          {notes.length === 0 ? (
            <div className="text-xs text-gray-500">No notes yet.</div>
          ) : (
            <ul className="space-y-2" aria-label="Notes list">
              {notes.map((n) => (
                <li key={n.id} className="group border border-gray-200 rounded p-2">
                  <div className="text-[11px] text-gray-500 mb-1" aria-label={`Created at ${new Date(n.createdAt).toLocaleString()}`}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                  <EditableNote
                    note={n}
                    onSave={(text) => handleUpdateNote(n.id, text)}
                    onDelete={() => handleDeleteNote(n.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function EditableNote({ note, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.text);

  function handleSave() {
    onSave(text);
    setEditing(false);
  }

  return (
    <div>
      {editing ? (
        <div>
          <label htmlFor={`edit-${note.id}`} className="sr-only">Edit note</label>
          <textarea
            id={`edit-${note.id}`}
            className="w-full border border-gray-300 rounded p-2 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Edit note text"
          />
          <div className="flex gap-2 mt-2">
            <Button variant="primary" onClick={handleSave} ariaLabel="Save note changes">Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)} ariaLabel="Cancel edit">Cancel</Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.text}</p>
          <div className="flex gap-2 mt-2">
            <Button variant="secondary" onClick={() => setEditing(true)} ariaLabel="Edit note">Edit</Button>
            <Button variant="danger" onClick={onDelete} ariaLabel="Delete note">Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
}
