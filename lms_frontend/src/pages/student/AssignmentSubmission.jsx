import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { sanitizeString } from '../../utils/sanitize';

/**
 * PUBLIC_INTERFACE
 * AssignmentSubmission renders instructions and a simple submission form (text or URL) using mock services.
 */
export default function AssignmentSubmission() {
  const { services } = React.useContext(AuthContext);
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [text, setText] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [submitted, setSubmitted] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    services.courses
      .getAssignment(courseId, assignmentId)
      .then(setAssignment)
      .finally(() => setLoading(false));
  }, [services, courseId, assignmentId]);

  async function onSubmit(e) {
    e.preventDefault();
    const payload = { text: sanitizeString(text), url: sanitizeString(url) };
    const res = await services.courses.submitAssignment(courseId, assignmentId, payload);
    setSubmitted(res);
  }

  if (loading) return <div>Loading...</div>;
  if (!assignment) return <div>Assignment not found.</div>;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>{assignment.title}</h1>
        <Link to={`/student/courses/${courseId}`} className="btn ghost">
          Back to Course
        </Link>
      </div>

      <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>
        Due: {new Date(assignment.dueAt).toLocaleString()}
      </div>

      <Card>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Instructions</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{assignment.instructions}</div>
        </div>
      </Card>

      <Card>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <Input
            label="Submission URL (optional)"
            placeholder="https://github.com/your-repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 14 }}>Submission Notes (optional)</label>
            <textarea
              className="input"
              rows={5}
              placeholder="Add any notes about your submission..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
        {submitted ? (
          <div style={{ marginTop: 10, fontSize: 14 }}>
            Submitted at {new Date(submitted.receivedAt).toLocaleString()} • Status: {submitted.status}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
