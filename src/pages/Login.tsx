import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Droplet, LogIn } from 'lucide-react';
import { useState } from 'react';

export function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  if (user) {
    navigate('/');
  }

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-2xl space-y-8 text-center"
      >
        <div className="bg-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-rose-200">
          <Droplet className="text-white fill-white" size={32} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Connect to your BloodLine account</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-4 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:shadow-xl active:scale-95 group"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>

        <p className="text-xs text-slate-400 leading-relaxed px-4">
          By signing in, you agree to our terms of service and privacy policy. We use your Google account info to create your profile securely.
        </p>
      </motion.div>
    </div>
  );
}

export function Register() {
  return <Login />; // For this demo, login and register are the same flow with Google
}
