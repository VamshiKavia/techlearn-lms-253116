import React, { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';

/**
 * PUBLIC_INTERFACE
 * AdminUsers - Simple search and role badge with mock role change (state only).
 */
const initialUsers = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'instructor' },
  { id: 'u3', name: 'Carol Jones', email: 'carol@example.com', role: 'student' },
  { id: 'u4', name: 'David Lee', email: 'david@example.com', role: 'admin' },
];

const AdminUsers = () => {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }, [q, users]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const changeRole = (id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Users</h1>
        <p className="text-gray-500">Search users and adjust roles (mock).</p>
      </section>

      <Card>
        <div className="flex items-center gap-3 mb-3">
          <Input
            placeholder="Search by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-12 bg-gray-50 border-b">
          <div className="col-span-4 p-3 text-sm text-gray-600">Name</div>
          <div className="col-span-4 p-3 text-sm text-gray-600">Email</div>
          <div className="col-span-2 p-3 text-sm text-gray-600">Role</div>
          <div className="col-span-2 p-3 text-sm text-gray-600">Change</div>
        </div>
        {current.length === 0 ? (
          <EmptyState title="No users" subtitle="Try adjusting your search." />
        ) : (
          current.map((u) => (
            <div key={u.id} className="grid grid-cols-12 border-b last:border-0">
              <div className="col-span-4 p-3 text-gray-800">{u.name}</div>
              <div className="col-span-4 p-3 text-gray-800">{u.email}</div>
              <div className="col-span-2 p-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                  {u.role}
                </span>
              </div>
              <div className="col-span-2 p-3">
                <select
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  <option value="student">student</option>
                  <option value="instructor">instructor</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
          ))
        )}

        {filtered.length > pageSize && (
          <div className="pt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminUsers;
