'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { WorkspaceLayout } from '../../../components/dashboard/WorkspaceLayout';
import { AdminService } from '../../../lib/services/adminApi';
import { Activity, Server, Database, HardDrive, Search, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [logs, setLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentTab]);

  const fetchData = async () => {
    if (currentTab === 'overview') setLogs(await AdminService.getSystemLogs());
    if (currentTab === 'users') setUsers(await AdminService.getUsers());
    if (currentTab === 'verification') setQueue(await AdminService.getProvidersQueue());
    if (currentTab === 'catalog') setCatalog(await AdminService.getCatalog());
  };

  const handleUserStatus = async (userId: string, status: 'Active' | 'Suspended') => {
    await AdminService.updateUserStatus(userId, status);
    fetchData();
  };

  const handleProviderAction = async (providerId: string, action: 'Approved' | 'Rejected') => {
    await AdminService.verifyProvider(providerId, action);
    fetchData();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total GMV', value: '$14,520', color: 'text-emerald-500' },
          { title: 'Registered Users', value: '1,204', color: 'text-blue-500' },
          { title: 'Active Workshops', value: '45', color: 'text-purple-500' },
          { title: 'Open Tickets', value: '12', color: 'text-[#E62424]' },
        ].map(stat => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase">{stat.title}</p>
            <p className={`text-2xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-900">
            <Activity className="w-5 h-5 text-[#E62424]" />
            Recent Global Logs
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map(log => (
              <div key={log.id} className="text-sm p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
                <span className="font-medium text-slate-700">{log.message}</span>
                <span className="text-xs text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white text-slate-800 p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold flex items-center gap-2 text-slate-900">
            <Server className="w-5 h-5 text-slate-400" /> System Health
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1 flex justify-between">
                <span>API Latency</span>
                <span className="text-emerald-600">42ms</span>
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[20%]" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1 flex justify-between">
                <span>DB Connection</span>
                <span className="text-emerald-600">Stable</span>
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1 flex justify-between">
                <span>Storage Capacity</span>
                <span className="text-red-600">89%</span>
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-[#E62424] h-1.5 rounded-full w-[89%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => {
    const filtered = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#E62424]"
            />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-900">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold">{u.name}</td>
                <td className="px-6 py-4 text-slate-500">{u.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-md font-bold ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleUserStatus(u.id, u.status === 'Active' ? 'Suspended' : 'Active')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-md"
                  >
                    {u.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1.5 rounded-md bg-blue-50">
                    Impersonate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderVerification = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
        <ShieldAlert className="w-5 h-5 text-[#E62424]" /> Review Queue
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {queue.filter(q => q.status === 'Pending').map(provider => (
          <div key={provider.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-black text-slate-900">{provider.name}</h4>
              <p className="text-xs font-bold text-[#E62424] mb-3">{provider.type}</p>
              <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 mb-4 border border-slate-100">
                Documents: {provider.documents}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleProviderAction(provider.id, 'Approved')}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button 
                onClick={() => handleProviderAction(provider.id, 'Rejected')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        ))}
        {queue.filter(q => q.status === 'Pending').length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No pending providers in queue.
          </div>
        )}
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Master SKU Dataset</h3>
          <button className="bg-[#E62424] hover:bg-[#c51d1d] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer">
            + New Category
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Market MSRP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-900">
            {catalog.map(item => (
              <tr key={item.sku} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.sku}</td>
                <td className="px-6 py-4 font-bold">{item.name}</td>
                <td className="px-6 py-4 text-slate-500">{item.category}</td>
                <td className="px-6 py-4 font-medium">${item.msrp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <WorkspaceLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-display text-slate-900 mb-6 capitalize">{currentTab}</h2>
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTab === 'overview' && renderOverview()}
          {currentTab === 'users' && renderUsers()}
          {currentTab === 'verification' && renderVerification()}
          {currentTab === 'catalog' && renderCatalog()}
        </motion.div>
      </div>
    </WorkspaceLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <WorkspaceLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E62424]"></div>
        </div>
      </WorkspaceLayout>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
