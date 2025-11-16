import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * PUBLIC_INTERFACE
 * QuizAttempt renders quiz questions and allows submitting answers using mock evaluation.
 */
export default function QuizAttempt() {
  const { services } = React.useContext(AuthContext);
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = React.useState(null);
  const [answers, setAnswers] = React.useState([]);
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    services.courses
      .getQuiz(courseId, quizId)
      .then((q) => {
        setQuiz(q);
        setAnswers(new Array(q.questions.length).fill(null));
      })
      .finally(() => setLoading(false));
  }, [services, courseId, quizId]);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await services.courses.submitQuiz(courseId, quizId, answers);
    setResult(res);
  }

  if (loading) return <div>Loading...</div>;
  if (!quiz) return <div>Quiz not found.</div>;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>{quiz.title}</h1>
        <Link to={`/student/courses/${courseId}`} className="btn ghost">
          Back to Course
        </Link>
      </div>

      <Card>
        {result ? (
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ fontWeight: 700 }}>Result</div>
            <div>
              Score: <strong>{result.score}%</strong> ({result.correct}/{result.total}) —{' '}
              {result.passed ? (
                <span style={{ color: 'var(--color-success)' }}>Passed</span>
              ) : (
                <span style={{ color: 'var(--color-error)' }}>Not Passed</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => setResult(null)} variant="secondary">
                Retry
              </Button>
              <Button onClick={() => navigate(`/student/courses/${courseId}`)}>Finish</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
            <ul style={{ display: 'grid', gap: 12 }}>
              {quiz.questions.map((q, idx) => (
                <li key={q.id} style={{ display: 'grid', gap: 8 }}>
                  <div style={{ fontWeight: 600 }}>
                    Q{idx + 1}. {q.prompt}
                  </div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          checked={answers[idx] === oIdx}
                          onChange={() => {
                            const clone = [...answers];
                            clone[idx] = oIdx;
                            setAnswers(clone);
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
