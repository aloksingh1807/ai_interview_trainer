import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';
import Avatar from '../components/Avatar';
import MagneticButton from '../components/MagneticButton';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const user = res.data.user || {};
      
      // Store token and details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", user.name || "Candidate");
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userRole", user.target_role || "Software Engineer");
      localStorage.setItem("userSkills", user.skills || "");

      navigate('/dashboard');
      window.location.reload(); // Refresh to trigger layout locks
      
    } catch (err) {
      setError(err.response?.data?.error || "Authentication credentials rejected.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-[calc(100vh-100px)] flex items-center justify-center bg-bgPrimary">
      <div className="w-full glass-panel bg-bgCard border-borderColor rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        {/* Left Visual split-panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-bgSecondary via-bgPrimary to-bgSecondary p-8 flex flex-col justify-between items-center text-center relative overflow-hidden border-r border-borderColor">
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full text-left">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary bg-bgSecondary border border-borderColor px-3 py-1.5 rounded-full">
              Platform Gate
            </span>
          </div>

          <div className="my-8 flex flex-col items-center">
            <Avatar isSpeaking={loading} />
            <h3 className="font-heading font-extrabold text-xl mt-6 text-textPrimary">
              Holographic Portal
            </h3>
            <p className="text-xs text-textSecondary max-w-xs mt-1.5 leading-relaxed">
              Verify credentials to let Alok configure your active interview spaces.
            </p>
          </div>

          <div className="w-full flex items-center justify-between text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">
            <span>Interview Trainer</span>
            <span>SV Edition</span>
          </div>
        </div>

        {/* Right Form Card Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-bgCard flex flex-col justify-center">
          
          <div className="mb-8">
            <h2 className="font-heading font-extrabold text-2xl text-textPrimary">
              Sign In to Cockpit
            </h2>
            <p className="text-sm text-textSecondary mt-1">
              Select a pre-seeded candidate account below or enter details.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-800/60 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@domain.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary text-xs text-textPrimary font-semibold transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary text-xs text-textPrimary font-semibold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <MagneticButton
              type="submit"
              disabled={loading}
              className="w-full bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg mt-2"
            >
              {loading ? "Verifying..." : "Access Workspace"}
            </MagneticButton>
          </form>

          {/* Seeded shortcut buttons */}
          <div className="mt-8 border-t border-borderColor pt-8">
            <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary mb-3.5">
              🚀 pre-seeded developer accounts (quick login)
            </h4>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleQuickDemo("demo@interview.ai", "demo1234")}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-borderColor hover:border-accentPrimary bg-bgSecondary hover:bg-bgPrimary text-textSecondary transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-accentPrimary" />
                <span>Developer Mock</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("alok123@gmail.in", "alok1234")}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-borderColor hover:border-accentPrimary bg-bgSecondary hover:bg-bgPrimary text-textSecondary transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-accentPrimary" />
                <span>AI Engineer Mock</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-textSecondary mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-textPrimary hover:text-accentPrimary underline transition-colors">
              Create an Account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}
