import React from 'react';
import { AuthContext } from '../providers/AuthProvider';

/**
 * PUBLIC_INTERFACE
 * AuthProvider test mock to inject a specific role for ProtectedRoute tests.
 */
export const AuthProvider = ({ role = 'student', children }) => {
  const mockUser = { id: 'tuser', name: 'Test User', role };
  const value = {
    user: mockUser,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
