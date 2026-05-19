import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Users, Droplet, Clock, CheckCircle, XCircle, Trash2, PieChart, Activity, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const [donors, setDonors] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'donors' | 'requests'>('donors');

  useEffect(() => {
    async function fetchData() {
      if (!db) return;
      try {
        const donorsRes = await getDocs(collection(db, 'donors'));
        setDonors(donorsRes.docs.map(d => ({ id: d.id, ...d.data() })));
        
        const requestsRes = await getDocs(query(collection(db, 'requests'), orderBy('createdAt', 'desc')));
        setRequests(requestsRes.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleApprove = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'donors', id), { isApproved: !currentStatus });
      setDonors(donors.map(d => d.id === id ? { ...d, isApproved: !currentStatus } : d));
    } catch (err) {
      alert("Error updating donor approval status");
    }
  };

  const handleDelete = async (id: string, col: 'donors' | 'requests') => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteDoc(doc(db, col, id));
      if (col === 'donors') setDonors(donors.filter(d => d.id !== id));
      else setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      alert("Error deleting record");
    }
  };

  const bloodGroupStats = donors.reduce((acc: any, d) => {
    acc[d.bloodGroup] = (acc[d.bloodGroup] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="text-center py-20 font-black tracking-widest text-slate-300">ADMINISTRATING SYSTEM...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center lg:text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">System Administration</h1>
          <p className="text-slate-500 text-sm font-medium">Global donor registry and emergency logistics management</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('donors')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'donors' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Donors Directory
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'requests' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Emergency Requests
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verified Donors</p>
           <div className="flex items-end gap-3">
             <span className="text-3xl font-bold text-slate-900">{donors.length}</span>
             <span className="text-[10px] font-bold text-emerald-600 pb-1">+5% ↑</span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Searches</p>
           <div className="flex items-end gap-3">
             <span className="text-3xl font-bold text-slate-900">{requests.filter(r => r.status === 'Pending').length}</span>
             <span className="text-[10px] font-bold text-red-600 pb-1">Urgent</span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity size={12} className="text-red-600" />
              Regional Inventory Stats
           </p>
           <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"].map(bg => (
                <div key={bg} className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase">{bg}</p>
                  <p className="text-sm font-black text-red-600 leading-none mt-1">{bloodGroupStats[bg] || 0}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 font-display capitalize">
            {activeTab} Management Module
          </h2>
          <button className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Export Data
          </button>
        </div>
        <div className="overflow-x-auto">
          {activeTab === 'donors' ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Donor Identity</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donors.map(donor => (
                  <tr key={donor.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{donor.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{donor.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-red-600 text-white w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shadow-sm">
                        {donor.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                          <MapPin size={10} className="text-red-600" />
                          {donor.city}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                        donor.isApproved ? 'text-emerald-600' : 'text-orange-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${donor.isApproved ? 'bg-emerald-600' : 'bg-orange-600'}`} />
                        {donor.isApproved ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(donor.id, donor.isApproved)}
                          className={`p-2 rounded-lg transition-colors border ${donor.isApproved ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                        >
                          {donor.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(donor.id, 'donors')}
                          className="p-2 bg-slate-900 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Facility / Case</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Logistics</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="font-semibold text-slate-900">{req.hospitalName}</div>
                       <div className="text-[11px] font-medium text-slate-400">Ref: #{req.id.slice(-8).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <span className="bg-slate-900 text-white w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs">
                             {req.bloodGroup}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{req.unitsNeeded} units</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                         req.urgency === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {req.urgency}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">
                       <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Fulfilled' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                          <span className={req.status === 'Fulfilled' ? 'text-emerald-600' : 'text-orange-500'}>{req.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => handleDelete(req.id, 'requests')}
                        className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                       >
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
