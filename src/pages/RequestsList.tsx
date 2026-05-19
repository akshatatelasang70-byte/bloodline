import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Droplet, MapPin, Phone, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

export function RequestsList() {
  const { userData, user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setRequests(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'requests', requestId), { status: newStatus });
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-bold tracking-widest">LOADING REQUESTS...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">Emergency Requests</h1>
          <p className="text-slate-500 text-sm font-medium">Real-time demand verification across regional medical centers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-50 rounded-lg border border-red-100 flex items-center gap-3">
             <span className="text-red-600 font-bold text-xl leading-none">{requests.filter(r => r.status === 'Pending').length}</span>
             <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">Active Search</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {requests.map((req, idx) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-sm hover:shadow-md ${
                req.status === 'Fulfilled' ? 'bg-slate-50/50 grayscale opacity-60' : ''
              }`}
            >
              <div className="p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-4 lg:w-1/4">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center font-black text-xl shadow-lg relative shrink-0 ${
                    req.status === 'Fulfilled' ? 'bg-slate-200 text-slate-500' : 'bg-red-600 text-white shadow-red-100'
                  }`}>
                    {req.bloodGroup}
                    {req.urgency === 'Critical' && req.status === 'Pending' && (
                      <div className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display leading-tight">{req.unitsNeeded} Units</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Requested {formatDistanceToNow(req.createdAt)} ago</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                   <div className="flex items-start gap-3">
                      <MapPin className="text-red-600 shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm font-bold text-slate-700 leading-tight">{req.hospitalName}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">Medical Facility Address</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <Phone className="text-slate-400 shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm font-bold text-slate-700 leading-tight">{req.contactName}</p>
                        <p className="text-xs font-semibold text-red-600 mt-1 uppercase tracking-wider">{req.contactPhone}</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3 lg:w-1/4 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                  <div className={`flex-1 px-4 py-3 rounded-lg text-center ${
                    req.status === 'Fulfilled' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : req.urgency === 'Critical' 
                      ? 'bg-red-50 text-red-700 border border-red-100' 
                      : 'bg-orange-50 text-orange-700 border border-orange-100'
                  }`}>
                    <span className="text-[10px] font-black uppercase tracking-widest items-center gap-2 flex justify-center">
                       {req.status === 'Fulfilled' ? (
                         <><CheckCircle2 size={12} /> Case Resolved</>
                       ) : (
                         <>{req.urgency} Priority</>
                       )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href={`tel:${req.contactPhone}`}
                      className="p-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-100"
                      title="Call Hospital"
                    >
                      <Phone size={18} />
                    </a>
                    {(userData?.role === 'admin' || req.requesterId === user?.uid) && req.status === 'Pending' && (
                      <button 
                        onClick={() => handleStatusChange(req.id, 'Fulfilled')}
                        className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                        title="Mark as Fulfilled"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {req.urgency === 'Critical' && req.status === 'Pending' && (
                <div className="bg-red-600 px-6 py-1.5 flex items-center justify-between">
                   <p className="text-[10px] text-red-100 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                      <AlertTriangle size={12} /> SEARCHING COMPATIBLE DONORS NOW
                   </p>
                   <div className="flex gap-1">
                      <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-75" />
                      <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-150" />
                   </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
