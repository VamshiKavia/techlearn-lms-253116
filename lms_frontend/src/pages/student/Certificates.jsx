import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * Certificates page shows earned certificates using mock service and allows viewing/downloading (mock).
 */
export default function Certificates() {
  const [loading, setLoading] = React.useState(true);
  const [certs, setCerts] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const svc = (await import('../../providers/AuthProvider')).AuthContext;
        // Context import trick not ideal; use window.__lms_ctx set by AuthProvider? Simpler: dynamic import not needed.
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // get from context properly
  const { services } = React.useContext(require('../../providers/AuthProvider').AuthContext);

  React.useEffect(() => {
    setLoading(true);
    setError('');
    services.certificates
      .list()
      .then((items) => setCerts(items))
      .catch(() => setError('Failed to load certificates'))
      .finally(() => setLoading(false));
  }, [services]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>Certificates</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          View your earned certificates and progress towards new ones.
        </p>
      </div>

      {error ? <div style={{ color: 'var(--color-error)' }}>{error}</div> : null}

      {loading ? (
        <div>Loading...</div>
      ) : certs.length === 0 ? (
        <Card>
          <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>
            No certificates earned yet. Keep learning!
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
          {certs.map((c) => (
            <Card key={c.id}>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ fontWeight: 800 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                  Issued: {new Date(c.issuedAt).toLocaleDateString()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Issuer: {c.issuer}</div>
                {typeof c.progress === 'number' && c.progress < 100 ? (
                  <>
                    <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Progress</div>
                    <ProgressBar value={c.progress} />
                  </>
                ) : null}
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button onClick={() => alert('Mock: open certificate viewer')}>View</Button>
                  <Button variant="ghost" onClick={() => alert('Mock: download certificate PDF')}>
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
