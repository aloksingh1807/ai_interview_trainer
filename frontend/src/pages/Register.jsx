import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, Briefcase, Cpu } from 'lucide-react';
import Avatar from '../components/Avatar';
import MagneticButton from '../components/MagneticButton';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [skills, setSkills] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        target_role: targetRole,
        skills
      });

      const user = res.data.user || {};

      // Auto login upon registration
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", user.name || name);
      localStorage.setItem("userEmail", user.email || email);
      localStorage.setItem("userRole", user.target_role || targetRole);
      localStorage.setItem("userSkills", user.skills || skills);

      navigate('/dashboard');
      window.location.reload();
      
    } catch (err) {
      setError(err.response?.data?.error || "Registration validation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-[calc(100vh-100px)] flex items-center justify-center bg-bgPrimary">
      <div className="w-full glass-panel bg-bgCard border-borderColor rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        {/* Left Visual split-panel (Welcome holographic board) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-bgSecondary via-bgPrimary to-bgSecondary p-8 flex flex-col justify-between items-center text-center relative overflow-hidden border-r border-borderColor">
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full text-left">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary bg-bgSecondary border border-borderColor px-3 py-1.5 rounded-full">
              Platform registry
            </span>
          </div>

          <div className="my-8 flex flex-col items-center">
            <Avatar isSpeaking={loading} />
            <h3 className="font-heading font-extrabold text-xl mt-6 text-textPrimary">
              Candidate Register
            </h3>
            <p className="text-xs text-textSecondary max-w-xs mt-1.5 leading-relaxed">
              Design a mock cockpit targets profile to train with Alok.
            </p>
          </div>

          <div className="w-full flex items-center justify-between text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">
            <span>Interview Trainer</span>
            <span>SV Edition</span>
          </div>
        </div>

        {/* Right Form Card Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-bgCard flex flex-col justify-center">
          
          <div className="mb-6">
            <h2 className="font-heading font-extrabold text-2xl text-textPrimary">
              Create Candidate Account
            </h2>
            <p className="text-sm text-textSecondary mt-1">
              Initialize target credentials to configure mock rooms.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-950/20 border border-red-800/60 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary text-xs text-textPrimary font-semibold"
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary text-xs text-textPrimary font-semibold"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary text-xs text-textPrimary font-semibold"
                />
              </div>
            </div>

            {/* Target Role Selector */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">
                Target Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary text-xs text-textPrimary font-semibold bg-bgSecondary appearance-none"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                </select>
              </div>
            </div>

            {/* Core Tech Stack Skills */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">
                Tech Stack Skills (comma separated)
              </label>
              <div className="relative">
                <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Python, Flask, SQL"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary text-xs text-textPrimary font-semibold"
                />
              </div>
            </div>

            {/* Submit */}
            <MagneticButton
              type="submit"
              disabled={loading}
              className="w-full bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg mt-3"
            >
              {loading ? "Registering..." : "Create Account"}
            </MagneticButton>
          </form>

          <p className="text-center text-xs text-textSecondary mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-textPrimary hover:text-accentPrimary underline transition-colors">
              Sign In
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}
