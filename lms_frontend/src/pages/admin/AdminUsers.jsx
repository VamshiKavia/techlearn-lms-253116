import React, { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { getAdminUsers, assignUserRole } from '../../services/adminService';

/**
 * PUBLIC_INTERFACE
 * AdminUsers page lists users with search, role filters, and mock role assignment.
 */
const AdminUsers = () => {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { items, total } = useMemo(
    () => getAdminUsers({ query, role, page, pageSize }),
    [query, role, page]
  );

  const roles = ['All', 'Admin', 'Instructor', 'Student'];

  const handleAssign = (userId, newRole) => {
    assignUserRole(userId, newRole);
    // mock-only: no state change necessary since we re-derive from mock
    // a real impl would update state from response
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Users</h1>

      <Card>
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <label className="text-sm text-gray-600">Search</label>
            <Input value={query} onChange={(e) => { setPage(1); setQuery(e.target.value); }} placeholder="Search by name or email" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              className="border rounded px-3 py-2 text-gray-700"
              value={role}
              onChange={(e) => { setPage(1); setRole(e.target.value); }}
            >
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <Button onClick={() => { setQuery(''); setRole('All'); setPage(1); }} variant="secondary">Reset</Button>
        </div>
      </Card>

      <Card title={`Users (${total})`}>
        {items.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your filters or search keyword." />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((u) => (
              <div key={u.id} className="flex items-center justify-between border rounded p-3 bg-white">
                <div>
                  <div className="font-medium text-gray-800">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{u.role}</span>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={u.role}
                    onChange={(e) => handleAssign(u.id, e.target.value)}
                  >
                    {['Admin', 'Instructor', 'Student'].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalItems={total}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;
