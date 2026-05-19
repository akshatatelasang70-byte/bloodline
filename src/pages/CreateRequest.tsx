import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Droplet, Hospital, Phone, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function CreateRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState('');
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    bloodGroup: '',
    unitsNeeded: 1,
    urgency: 'Normal',
    contactName: '',
    contactPhone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'requests'), {
        ...formData,
        requesterId: user.uid,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      navigate('/requests');
    } catch (error) {
      console.error("Create request error:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithAI = async () => {
    setAiAnalyzing(true);
    try {
      const response = await axios.post('/api/ai/analyze-demand', {
        bloodGroup: formData.bloodGroup,
        unitsNeeded: formData.unitsNeeded,
        requests: [] // In a real app, pass recent requests
      });
      setAiReport(response.data.analysis);
    } catch (err) {
      setAiReport("Unable to generate AI analysis at this time.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden"
      >
        <div className="bg-rose-600 p-10 text-white relative">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-black italic">Submit Life Request</h1>
            <p className="text-rose-100 font-medium opacity-80">Provide accurate details for immediate assistance</p>
          </div>
          <AlertCircle className="absolute right-10 top-10 text-rose-500 opacity-20" size={120} />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <Droplet size={14} className="text-rose-500" />
                Required Blood Group
              </label>
              <select 
                required
                value={formData.bloodGroup}
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
              >
                <option value="">Select Group</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <Droplet size={14} className="text-rose-500" />
                Units Needed
              </label>
              <input 
                type="number"
                required
                min="1"
                value={formData.unitsNeeded}
                onChange={(e) => setFormData({...formData, unitsNeeded: parseInt(e.target.value)})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <Hospital size={14} className="text-rose-500" />
                Hospital Name & Location
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. City General Hospital, Downtown"
                value={formData.hospitalName}
                onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <Phone size={14} className="text-rose-500" />
                Contact Name
              </label>
              <input 
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <Phone size={14} className="text-rose-500" />
                Phone Number
              </label>
              <input 
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-rose-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <AlertCircle size={14} className="text-rose-500" />
                Urgency Level
              </label>
              <div className="flex gap-4">
                {['Normal', 'High', 'Critical'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({...formData, urgency: level})}
                    className={`flex-1 py-3 font-bold rounded-xl border-2 transition-all ${
                      formData.urgency === level 
                      ? 'bg-rose-50 border-rose-500 text-rose-600' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Helper */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-rose-400" />
                <span className="font-bold text-sm tracking-tight">BloodLine AI Assistant</span>
              </div>
              <button 
                type="button"
                onClick={analyzeWithAI}
                disabled={aiAnalyzing || !formData.bloodGroup}
                className="text-xs bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                {aiAnalyzing ? "Analyzing..." : "Analyze Demand"}
              </button>
            </div>
            {aiReport && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-sm text-slate-300 leading-relaxed italic"
              >
                "{aiReport}"
              </motion.p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 text-white text-xl font-black py-5 rounded-3xl hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Posting Request..." : "Post Emergency Request"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
