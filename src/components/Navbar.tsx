import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Droplet, Search, PlusCircle, User, LogOut, LayoutDashboard, Menu, X, Home, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Navbar({ isMobile = false }: { isMobile?: boolean }) {
  const { user, userData, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavItem = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => (
    <NavLink
      to={to}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-transparent",
        isActive 
          ? "bg-red-50 text-red-700 border-red-100 shadow-sm" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon size={20} className={cn("transition-colors", "text-slate-400 group-hover:text-slate-600")} />
      {children}
    </NavLink>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 lg:p-8 flex items-center gap-3 border-b border-slate-100 mb-4">
        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-red-200">
          <Droplet size={20} fill="white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 font-display">BloodLine</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavItem to="/" icon={Home}>Overview</NavItem>
        <NavItem to="/search" icon={Search}>Find Donors</NavItem>
        <NavItem to="/requests" icon={Clock}>Emergency Requests</NavItem>
        
        {user && (
          <div className="pt-6 space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">User Portal</p>
            <NavItem to="/create-request" icon={PlusCircle}>Request Blood</NavItem>
            <NavItem to="/profile" icon={User}>My Profile</NavItem>
            {userData?.role === 'admin' && (
              <NavItem to="/admin" icon={LayoutDashboard}>Admin Console</NavItem>
            )}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto">
        {user ? (
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        ) : (
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <p className="text-[10px] text-slate-400 mb-1 font-bold tracking-widest uppercase">JOIN THE CAUSE</p>
            <Link to="/login" className="text-sm font-bold hover:text-red-400 transition-colors">Create Account &rarr;</Link>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-slate-600 hover:text-slate-900 transition-colors">
          <Menu size={24} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-72 bg-white z-[101] shadow-2xl"
              >
                <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={24} />
                </button>
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <aside className="w-64 xl:w-72 border-r border-slate-200 h-screen sticky top-0 bg-white">
      <SidebarContent />
    </aside>
  );
}
