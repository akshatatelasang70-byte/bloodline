import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Droplet, MapPin, Phone, Calendar, Heart, ShieldCheck } from 'lucide-react';

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function Profile() {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [donorData, setDonorData] = useState<any>({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    phone: '',
    city: '',
    address: '',
    lastDonationDate: '',
    available: true,
  });

  useEffect(() => {
    async function fetchDonor() {
      if (!user || !db) return;
      const docRef = doc(db, 'donors', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDonorData(docSnap.data());
      } else {
        setDonorData(prev => ({ ...prev, name: user.displayName || '', email: user.email }));
      }
      setLoading(false);
    }
    fetchDonor();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'donors', user.uid), {
        ...donorData,
        userId: user.uid,
        updatedAt: serverTimestamp(),
        // For existing users, keep their approved status, for new, default to false (or true for demo)
        isApproved: donorData.isApproved ?? true, 
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-8 text-center pt-12 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-rose-500" />
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              <User size={48} className="text-slate-300" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white font-black">
              {donorData.bloodGroup || '?'}
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">{donorData.name || 'Anonymous'}</h2>
            <p className="text-slate-400 font-medium text-sm">{user?.email}</p>
          </div>

          <div className="flex justify-center gap-4 py-4 border-y border-slate-50">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</p>
                <p className="font-bold text-rose-600 capitalize">{userData?.role}</p>
             </div>
             <div className="w-px bg-slate-100" />
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <p className={`font-bold ${donorData.isApproved ? 'text-green-600' : 'text-orange-500'}`}>
                  {donorData.isApproved ? 'Verified' : 'Pending'}
                </p>
             </div>
          </div>

          <div className="pt-4">
             <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
               donorData.available ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'
             }`}
             onClick={() => setDonorData({...donorData, available: !donorData.available})}
             >
                <div className="flex items-center justify-between">
                   <p className="font-bold text-slate-900">Available to Donate</p>
                   <div className={`w-10 h-6 rounded-full relative transition-all ${donorData.available ? 'bg-green-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${donorData.available ? 'translate-x-4' : ''}`} />
                   </div>
                </div>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Donor Details</h1>
            <p className="text-slate-500 font-medium">Keep your information up to date to help more lives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <Heart size={14} className="text-rose-500" />
                Blood Group
              </label>
              <select 
                value={donorData.bloodGroup}
                onChange={(e) => setDonorData({...donorData, bloodGroup: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
              >
                <option value="">Select Group</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <Phone size={14} className="text-rose-500" />
                Mobile Number
              </label>
              <input 
                type="tel"
                value={donorData.phone}
                onChange={(e) => setDonorData({...donorData, phone: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
                placeholder="+1 234 567 890"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <MapPin size={14} className="text-rose-500" />
                City
              </label>
              <input 
                type="text"
                value={donorData.city}
                onChange={(e) => setDonorData({...donorData, city: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
                placeholder="e.g. New York"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <Calendar size={14} className="text-rose-500" />
                Last Donation Date
              </label>
              <input 
                type="date"
                value={donorData.lastDonationDate}
                onChange={(e) => setDonorData({...donorData, lastDonationDate: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <MapPin size={14} className="text-rose-500" />
                Full Address
              </label>
              <textarea 
                rows={2}
                value={donorData.address}
                onChange={(e) => setDonorData({...donorData, address: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none resize-none"
                placeholder="Where can users find you?"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-slate-900 text-white text-xl font-black py-5 rounded-3xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Profile Info"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
