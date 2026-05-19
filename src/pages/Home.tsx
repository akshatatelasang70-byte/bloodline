import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart, Search, Users, ShieldCheck, Activity, Droplet, ArrowRight } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: <Search className="text-red-600" />,
      title: "Find Donors",
      description: "Access our comprehensive directory of verified blood donors across multiple cities."
    },
    {
      icon: <Users className="text-red-600" />,
      title: "Emergency Requests",
      description: "Broadcast urgent requirements to hospitals and nearby donors in real-time."
    },
    {
      icon: <ShieldCheck className="text-red-600" />,
      title: "Verified Profiles",
      description: "Rigorous verification process for all healthcare providers and individual donors."
    },
    {
      icon: <Activity className="text-red-600" />,
      title: "Inventory Tracking",
      description: "Monitor real-time blood stock levels to prevent critical shortages in emergencies."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-red-100"
            >
              <Heart size={14} className="fill-red-600" />
              <span>Medical Emergency Network</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter font-display"
            >
              Strategic Blood <br />
              Logistics & <span className="text-red-600">Care.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              BloodLine Connect provides high-efficiency coordination between donors and hospitals to ensure no life is lost due to blood shortages. Professional, secure, and instant.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link 
                to="/create-request"
                className="w-full sm:w-auto bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2"
              >
                Create Emergency Request
                <ArrowRight size={18} />
              </Link>
              <Link 
                to="/register"
                className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold text-base hover:bg-slate-50 transition-all"
              >
                Register as Donor
              </Link>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative hidden lg:block"
          >
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xl relative z-10">
                <div className="bg-slate-50 rounded-xl aspect-[4/3] flex items-center justify-center overflow-hidden">
                   <Droplet size={120} className="text-red-600 opacity-20" />
                   <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm w-40">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Donors</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">14,291</p>
                         </div>
                         <div className="bg-red-600 p-4 rounded-xl shadow-lg shadow-red-200 w-32 text-white">
                            <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest leading-none mb-1">Stock Level</p>
                            <p className="text-2xl font-bold tracking-tight">Optimal</p>
                         </div>
                      </div>
                      <div className="flex justify-center">
                         <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-white/50 shadow-lg text-center w-full">
                            <p className="text-xs font-bold text-slate-600 mb-2">Average Response Time</p>
                            <div className="flex items-center justify-center gap-4">
                               <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-600 w-3/4" />
                               </div>
                               <span className="text-sm font-black text-red-600 tracking-tight">12.5m</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="absolute -top-12 -right-12 w-64 h-64 bg-red-100/50 rounded-full blur-3xl -z-10" />
             <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-slate-200/50 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-red-200 transition-colors group"
          >
            <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-50 transition-colors">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Info Split Section */}
      <section className="bg-slate-900 rounded-[32px] p-8 lg:p-16 text-white grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl lg:text-5xl font-black font-display tracking-tight leading-[1.1]">
            Global Standard for <br />
            <span className="text-red-500">Blood Management.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Our technology allows medical centers to communicate instantly with verified donors, drastically reducing wait times during critical golden hour emergencies.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
             <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">99.9%</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Network Uptime</p>
             </div>
             <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">2.5k+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hospitals Connected</p>
             </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
           {[
             { title: "Direct Hospital API", desc: "Automated logistics for healthcare providers." },
             { title: "Privacy First", desc: "Enterprise-grade encryption for all medical data." },
             { title: "Smart Demand Analysis", desc: "AI predictive modelling for regional blood stock." }
           ].map((item, i) => (
             <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <h4 className="font-bold text-red-500 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
