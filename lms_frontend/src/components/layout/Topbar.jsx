import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Topbar: Displays minor app label and user actions (Home, Logout).
 */
export function Topbar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const onHome = () => navigate('/student/overview');
  const onLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch {
      // no-op
    }
  };

  return (
    <>
      <div style={{ color: '#64748B', fontSize: 12 }}>TechLearn LMS</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-outline" onClick={onHome}>Home</button>
        <button className="btn btn-primary" onClick={onLogout}>Logout</button>
      </div>
    </>
  );
}
