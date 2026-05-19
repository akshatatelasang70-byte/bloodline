import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search as SearchIcon, Filter, MapPin, Phone, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function Search() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!db) return;

    setLoading(true);
    try {
      const donorsRef = collection(db, 'donors');
      let q = query(donorsRef, where('isApproved', '==', true));
      
      if (bloodGroup) {
        q = query(q, where('bloodGroup', '==', bloodGroup));
      }
      
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side filtering for city (Firestore doesn't support easy case-insensitive matching without complex setup)
      const filteredResults = city 
        ? results.filter((d: any) => d.city.toLowerCase().includes(city.toLowerCase()))
        : results;
        
      setDonors(filteredResults);
      setSearched(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl">
            <SearchIcon className="text-red-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Find Registered Donors</h1>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Blood Group</label>
            <select 
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:border-red-600 transition-all outline-none text-sm"
            >
              <option value="">All Groups</option>
              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Location</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-semibold text-slate-900 focus:border-red-600 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full bg-red-600 text-white font-bold h-[46px] rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 active:scale-95 text-sm"
              disabled={loading}
            >
              {loading ? "Searching..." : (
                <>
                  <SearchIcon size={18} />
                  <span>Execute Search</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {searched ? `${donors.length} Verified Donors Matching` : 'Global Registry Registry'}
          </span>
          <Filter size={14} className="text-slate-400" />
        </div>

        <AnimatePresence mode="popLayout">
          {searched && donors.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-16 rounded-2xl text-center space-y-4 border border-slate-200 shadow-sm"
            >
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <SearchIcon size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">No Results Found</h3>
              <p className="text-slate-500 text-sm font-medium">Refine your search parameters to find available donors.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor, idx) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl shadow-lg shadow-red-100">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-none font-display text-lg">{donor.name}</h3>
                        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                          <MapPin size={12} className="text-red-600" />
                          {donor.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                       <p className="text-xs font-bold text-emerald-600">Available</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Last Gift</p>
                       <p className="text-xs font-bold text-slate-900">{donor.lastDonationDate || 'First Time'}</p>
                    </div>
                    <button className="col-span-2 mt-2 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg font-bold text-xs hover:bg-red-600 transition-colors">
                      <Phone size={14} />
                      INITIATE CONTACT
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
