'use client';

import React, { useState, useEffect } from 'react';
import { usePartnershipStore } from '../../../store/partnershipStore';
import { useToastStore } from '../../../store/toastStore';
import { useLocalDB } from '../../../store/localDB';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'Client' | 'Mechanic' | 'Merchant' | 'Admin';
  status: 'Active' | 'Suspended' | 'Pending Vetting';
  phone?: string;
  businessName?: string;
}

const LOCAL_USERS_KEY = 'automate-admin-users-list';

export default function AdminUsersPage() {
  const { applications, approveApplication } = usePartnershipStore();
  const registerMechanic = useLocalDB((s) => s.registerMechanic);
  const addToast = useToastStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<'All' | 'Client' | 'Mechanic' | 'Merchant'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Initialize and load users list from localStorage or seed
  useEffect(() => {
    setHydrated(true);
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      const initialUsers: UserRow[] = [
        { id: 'usr_c1', name: 'Ahmed Al-Masri', email: 'ahmed@automate.com', role: 'Client', status: 'Active', phone: '+20 10 1234 5678' },
        { id: 'usr_c2', name: 'Tariq Al-Fayed', email: 'tariq@automate.com', role: 'Client', status: 'Active', phone: '+20 11 8765 4321' },
        { id: 'usr_m1', name: 'Marcus Vance', email: 'm1@automate.com', role: 'Mechanic', status: 'Active', phone: '+20 12 9981 1273', businessName: 'Apex Precision Automotive' },
        { id: 'usr_m2', name: 'Sarah Connor', email: 'm2@automate.com', role: 'Mechanic', status: 'Active', phone: '+20 15 5543 9122', businessName: 'Electric Garage Co.' },
        { id: 'usr_merch1', name: 'Turbo Parts Inc.', email: 'turbo@automate.com', role: 'Merchant', status: 'Active', phone: '+20 10 7766 8899', businessName: 'Turbo Parts Store' },
      ];
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialUsers));
      setUsers(initialUsers);
    }
  }, []);

  // Sync users to localStorage whenever they change
  const saveUsers = (updatedUsers: UserRow[]) => {
    setUsers(updatedUsers);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsers));
  };

  // Compile active users + pending candidates
  const allData: UserRow[] = [...users];

  // Map pending partnership applications as "Pending Vetting" candidate rows
  applications.forEach((app) => {
    if (app.status === 'pending') {
      // Avoid duplicates if already registered or mapped
      if (!allData.some((u) => u.id === app.id)) {
        allData.push({
          id: app.id,
          name: app.applicantName,
          email: app.email,
          role: app.roleApplied as 'Mechanic' | 'Merchant',
          status: 'Pending Vetting',
          phone: app.phone,
          businessName: app.businessName,
        });
      }
    }
  });

  const handleSuspend = (userId: string, currentStatus: string) => {
    const isSuspending = currentStatus === 'Active';
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: (isSuspending ? 'Suspended' : 'Active') as 'Active' | 'Suspended' };
      }
      return u;
    });
    saveUsers(updated);

    addToast({
      type: isSuspending ? 'info' : 'success',
      title: isSuspending ? 'Account Suspended' : 'Account Re-Activated',
      message: `Account associated with ID ${userId} has been successfully ${isSuspending ? 'suspended' : 're-activated'}.`,
    });
  };

  const handleApproveCandidate = (candidateId: string) => {
    // 1. Mark in partnership store as approved
    approveApplication(candidateId);

    // 2. Add to active users
    const app = applications.find((a) => a.id === candidateId);
    if (app) {
      const newUser: UserRow = {
        id: `usr_${app.id}`,
        name: app.applicantName,
        email: app.email,
        role: app.roleApplied as 'Mechanic' | 'Merchant',
        status: 'Active',
        phone: app.phone,
        businessName: app.businessName,
      };

      saveUsers([...users, newUser]);

      // If it's a mechanic, register in localDB mechanics registry
      if (app.roleApplied === 'Mechanic') {
        registerMechanic({
          id: `usr_${app.id}`,
          name: app.applicantName,
          email: app.email,
          specialization: app.roleData.specialization || 'General Maintenance',
          rating: 5.0,
          garageName: app.businessName,
          available: true,
        });
      }

      addToast({
        type: 'success',
        title: 'Candidate Approved',
        message: `${app.applicantName} has been vetted and granted credentials.`,
      });
    }
  };

  // Filter based on selected tab and search query
  const filteredUsers = allData.filter((user) => {
    const matchesTab = activeTab === 'All' || user.role === activeTab;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.businessName && user.businessName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  if (!hydrated) {
    return (
      <div className="flex flex-col h-96 bg-[#F8FAFC] items-center justify-center font-sans">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* HEADER SECTION */}
      <div>
        <span className="text-[10px] font-black uppercase text-[#E62424] bg-red-50 px-3 py-1 rounded-full tracking-wider">
          Identity Access Control
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 uppercase">User Directory</h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Tabular platform logs listing registered clients, mechanics, merchants, and candidate review pipelines.
        </p>
      </div>

      {/* FILTER & SEARCH TOOLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Sorting Category Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start">
          {(['All', 'Client', 'Mechanic', 'Merchant'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === 'All' ? 'All Users' : tab + 's';
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="SEARCH BY NAME, EMAIL, OR SHOP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200/80 rounded-xl text-xs font-bold placeholder-slate-400/80 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors uppercase tracking-wider"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        </div>

      </div>

      {/* TABULAR LOG GRID DISPLAY */}
      <div className="bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-8 py-4">Account Profile Details</th>
                <th className="px-8 py-4">Phone / contact</th>
                <th className="px-8 py-4">Assigned Role</th>
                <th className="px-8 py-4">Status Node</th>
                <th className="px-8 py-4 text-right">Actions Override</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* User Profile */}
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-slate-950 font-black uppercase tracking-tight text-sm">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                          {user.email}
                        </p>
                        {user.businessName && (
                          <span className="inline-block text-[9px] bg-slate-100 text-slate-600 font-extrabold uppercase px-2 py-0.5 rounded mt-1.5 tracking-wider">
                            🏢 {user.businessName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-8 py-5 text-slate-500 font-mono">
                      {user.phone || 'N/A'}
                    </td>

                    {/* Role */}
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        user.role === 'Client'
                          ? 'bg-blue-50 text-blue-600'
                          : user.role === 'Mechanic'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status Node */}
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        user.status === 'Active'
                          ? 'bg-green-50 text-green-600'
                          : user.status === 'Suspended'
                          ? 'bg-red-50 text-[#E62424]'
                          : 'bg-amber-50 text-amber-600 border border-amber-200/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'Active'
                            ? 'bg-green-500'
                            : user.status === 'Suspended'
                            ? 'bg-[#E62424]'
                            : 'bg-amber-500 animate-pulse'
                        }`} />
                        {user.status}
                      </span>
                    </td>

                    {/* Actions Override */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {user.status === 'Pending Vetting' ? (
                          <button
                            onClick={() => handleApproveCandidate(user.id)}
                            className="px-3 py-2 bg-slate-950 hover:bg-[#E62424] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Approve Candidate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspend(user.id, user.status)}
                            className={`px-3 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-colors cursor-pointer ${
                              user.status === 'Active'
                                ? 'bg-white hover:bg-red-50 border-slate-200 hover:border-red-200 text-[#E62424]'
                                : 'bg-slate-950 hover:bg-slate-800 border-slate-950 text-white'
                            }`}
                          >
                            {user.status === 'Active' ? 'Suspend Token' : 'Reactivate'}
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-semibold uppercase tracking-wider">
                    No matching users cataloged in database.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
