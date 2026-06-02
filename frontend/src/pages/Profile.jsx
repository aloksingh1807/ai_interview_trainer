import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Briefcase, Cpu, ShieldCheck, 
  Award, RefreshCw, Trash2, CheckCircle2, Save, Key
} from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Load candidate properties
  const [name, setName] = useState(() => localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("userEmail") || "");
  const [targetRole, setTargetRole] = useState(() => {
    const rawRole = localStorage.getItem("userRole");
    return (!rawRole || rawRole === "undefined" || rawRole === "null") ? "Software Engineer" : rawRole;
  });
  const [skills, setSkills] = useState(() => localStorage.getItem("userSkills") || "");
  
  // Status hooks
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Target roles list
  const TARGET_ROLES = [
    "Software Engineer",
    "Full Stack Developer",
    "AI Engineer",
    "ML Engineer",
    "Data Scientist",
    "Product Manager",
    "DevOps Engineer"
  ];

  // Verify auth
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Handle profile edits save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", targetRole);
      localStorage.setItem("userSkills", skills);
      
      setSuccessMsg("Profile configuration updated successfully.");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      setErrorMsg("Failed to persist profile configuration updates.");
    } finally {
      setLoading(false);
    }
  };

  // Reset simulation storage metrics
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to clear your local simulated milestones and active roadmap compilation caches? This action is irreversible.")) {
      const keysToRemove = [
        `roadmap_pipeline_nodes_${targetRole}`,
        `roadmap_compiled_${targetRole}`,
        `roadmap_milestones_${targetRole}`,
        'interview_sessions_history'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      setSuccessMsg("Simulation datasets flushed successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-borderColor">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accentPrimary">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Candidate Credentials</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-textPrimary leading-none">
            User Settings
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary max-w-xl">
            Manage your personal active credentials, update your target job profile, and configure mock metrics.
          </p>
        </div>

        <MagneticButton
          onClick={() => navigate('/dashboard')}
          className="bg-bgSecondary hover:bg-bgPrimary border border-borderColor text-textPrimary px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
        >
          Return to Dashboard
        </MagneticButton>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/60 text-red-400 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60 text-emerald-400 text-xs font-semibold animate-pulse">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: General Profile Form Card (Col 8) */}
        <div className="lg:col-span-8 glass-panel bg-bgCard border-borderColor rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center justify-between border-b border-borderColor pb-4 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accentPrimary" />
              <h3 className="font-heading font-black text-base text-textPrimary">Profile Preferences</h3>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-textSecondary bg-bgPrimary border border-borderColor px-2.5 py-1 rounded-full">
              SV Platform Config
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Candidate Name */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-textSecondary uppercase tracking-widest">
                  Candidate Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-xs text-textPrimary font-semibold"
                  />
                </div>
              </div>

              {/* Candidate Email (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-textSecondary uppercase tracking-widest">
                  Authorized Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary/50" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    title="Email configuration is managed via main database auth scopes."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-bgSecondary/40 border border-borderColor/45 text-xs text-textSecondary/60 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Target Role Selector */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-textSecondary uppercase tracking-widest">
                  Active Target Career Track
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-xs text-textPrimary font-semibold appearance-none bg-bgSecondary"
                  >
                    {TARGET_ROLES.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills Tag string */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-textSecondary uppercase tracking-widest">
                  Custom Tech Stack Skills (comma split)
                </label>
                <div className="relative">
                  <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Python, Flask"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-xs text-textPrimary font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-borderColor pt-6 flex justify-end">
              <MagneticButton
                type="submit"
                disabled={loading}
                className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving Changes..." : "Save Configuration"}
              </MagneticButton>
            </div>

          </form>
        </div>

        {/* Right Side: Achievements / Maintenance Actions (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Achievements badge showcase */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-md flex flex-col justify-between flex-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accentSecondary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-widest text-textSecondary mb-4">Milestone Badges</h4>
              <div className="space-y-3.5">
                {[
                  { name: "First Step Mastered", desc: "Completed 1 simulated mock session.", active: true },
                  { name: "ATS Optimized", desc: "Attained ATS scan match rating > 80%.", active: true },
                  { name: "Continuous Learner", desc: "Maintained a 3-day active streak.", active: false }
                ].map((b, i) => (
                  <div key={i} className={`flex items-center gap-3.5 p-3 rounded-xl border ${b.active ? 'bg-bgSecondary/60 border-accentPrimary/20 opacity-100' : 'bg-bgPrimary/30 border-borderColor/40 opacity-40'}`}>
                    <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 border ${b.active ? 'bg-accentPrimary/10 border-accentPrimary/30 text-accentPrimary' : 'bg-zinc-800 border-zinc-700 text-textSecondary'}`}>
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-textPrimary leading-none">{b.name}</h5>
                      <span className="text-[9px] text-textSecondary font-semibold block mt-0.5">{b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-borderColor pt-4 mt-6 text-[8.5px] font-extrabold uppercase tracking-widest text-textSecondary text-center">
              Complete simulated milestones to unlock
            </div>
          </div>

          {/* Maintenance Actions (Reset, clear caches) */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-md space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-red-400">Maintenance & Security</h4>
            <p className="text-[10px] text-textSecondary leading-relaxed font-semibold">
              Warning: Resetting your candidate profile flushes all active simulated data nodes, Recharts trends history, and week checklist metrics.
            </p>
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Reset Simulation Data
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
