import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Search } from './pages/Search';
import { CreateRequest } from './pages/CreateRequest';
import { RequestsList } from './pages/RequestsList';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';

function PrivateRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading, userData } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && userData?.role !== role && userData?.role !== 'admin') return <Navigate to="/" />;

  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar - only on desktop or if you want it mobile too */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="lg:hidden">
            <Navbar isMobile />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">
              BloodLine <span className="text-red-600">Connect</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-900">{user.displayName}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Registered User</span>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-xl border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full bg-red-600/10 flex items-center justify-center text-red-600 font-black">
                     {user.displayName?.charAt(0) || 'U'}
                   </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/requests" element={<RequestsList />} />
              
              <Route path="/create-request" element={
                <PrivateRoute>
                  <CreateRequest />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              <Route path="/admin" element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </div>
          <footer className="px-8 py-10 border-t border-slate-200 text-center lg:text-left text-slate-400 text-xs font-medium">
             <div className="container mx-auto lg:mx-0 flex flex-col lg:flex-row justify-between gap-4">
                <p>&copy; {new Date().getFullYear()} BloodLine Management. All rights reserved.</p>
                <div className="flex justify-center lg:justify-end gap-6">
                   <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                   <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                   <a href="#" className="hover:text-slate-900 transition-colors">Help Center</a>
                </div>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
