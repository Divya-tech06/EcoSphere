import React, { useState, useEffect } from 'react';
import { Users, Shield, ShieldCheck, UserCheck, Trash2, Search, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AdminUsersModule({ currentUser, currentRole, addToast }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const data = await api.fetchUsers(currentUser, currentRole);
      setUsers(data.users || []);
    } catch (e) {
      if (addToast) addToast('error', 'Fetch Error', 'Failed to retrieve users directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const handleRoleChange = async (targetUser, targetRole) => {
    try {
      const res = await api.updateUserRole(currentUser, currentRole, targetUser, targetRole);
      if (res.success) {
        if (addToast) addToast('success', 'User Promoted', `User ${targetUser} role updated to ${targetRole}.`);
        fetchUsersList();
      }
    } catch (e) {
      if (addToast) addToast('error', 'Promotion Failed', e.message);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser === currentUser) {
      if (addToast) addToast('error', 'Self-Termination Blocked', 'You cannot delete your own administrative account.');
      return;
    }
    if (!window.confirm(`Are you absolutely sure you want to permanently delete user "${targetUser}"?`)) {
      return;
    }
    try {
      const res = await api.deleteUser(currentUser, currentRole, targetUser);
      if (res.success) {
        if (addToast) addToast('success', 'User Removed', `Permanently deleted account ${targetUser}.`);
        fetchUsersList();
      }
    } catch (e) {
      if (addToast) addToast('error', 'Delete Failed', e.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const pendingRequests = users.filter(u => u.role === 'Pending Admin' || u.role === 'Pending Compliance Officer');

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-outfit text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-500" /> User Directory Manager
          </h1>
          <p className="text-xs text-slate-400">Review platform registry, adjust access clearance settings, and control roles.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 text-xs">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username, email or role..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100" 
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Pending Clearance Requests Panel */}
      {!loading && pendingRequests.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5 space-y-4">
          <h2 className="text-base font-extrabold font-outfit text-amber-400 flex items-center gap-2 animate-pulse">
            <Shield className="w-5 h-5" /> Pending Administrative Clearance Requests
          </h2>
          <p className="text-xs text-slate-350">
            The following users have registered requesting administrative clearance. Audit and verify their credentials before approving.
          </p>
          <div className="overflow-x-auto border border-white/5 rounded-xl">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-white/5 text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Requested Clearance</th>
                  <th className="p-3 text-right">Clearance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-205">
                {pendingRequests.map((req) => (
                  <tr key={req.username} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold">{req.username}</td>
                    <td className="p-3 text-slate-400 font-semibold">{req.email}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-black uppercase text-amber-450 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {req.role.replace('Pending ', '')}
                      </span>
                    </td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRoleChange(req.username, req.role.replace('Pending ', ''))}
                        className="px-2.5 py-1 bg-emerald-600/20 text-emerald-450 hover:bg-emerald-600 hover:text-white rounded border border-emerald-500/25 transition-colors cursor-pointer text-[10px] font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRoleChange(req.username, 'Employee')}
                        className="px-2.5 py-1 bg-rose-600/20 text-rose-450 hover:bg-rose-600 hover:text-white rounded border border-rose-500/25 transition-colors cursor-pointer text-[10px] font-bold"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 glass-panel rounded-2xl">
          <span className="text-sm font-semibold text-slate-500 animate-pulse">Loading directory entries...</span>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Authority Role</th>
                  <th className="p-4">Green Impact (XP / Points)</th>
                  <th className="p-4 text-right">Clearance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.username} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-slate-205">{user.username}</td>
                    <td className="p-4 text-slate-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        user.role === 'Admin' ? 'bg-red-500/10 text-red-405 border-red-500/20' :
                        user.role === 'Manager' ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20' :
                        user.role === 'Compliance Officer' ? 'bg-purple-500/10 text-purple-450 border-purple-500/20' :
                        'bg-slate-800 text-slate-400 border-white/5'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-350">
                      XP: {user.xp} · Pts: {user.points}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2 text-xs">
                      {/* Role selection switcher */}
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.username, e.target.value)}
                        className="bg-slate-900 border border-slate-700 outline-none p-1 rounded text-slate-200 cursor-pointer font-semibold"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Compliance Officer">Compliance Officer</option>
                        <option value="Manager">ESG Manager</option>
                        <option value="Admin">Admin</option>
                        {user.role.startsWith('Pending') && (
                          <option value={user.role}>{user.role}</option>
                        )}
                      </select>

                      {/* Delete account */}
                      <button 
                        onClick={() => handleDeleteUser(user.username)}
                        className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 font-semibold">No registered users matched the query filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
