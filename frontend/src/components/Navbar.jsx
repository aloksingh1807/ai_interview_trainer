import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Terminal, Compass, Award, FileSpreadsheet, LogOut, 
  Sun, Moon, Palette, Map, User, Check, Menu, X, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  // Safe profile parser to prevent undefined / null displays
  const rawName = localStorage.getItem("userName");
  const userName = (!rawName || rawName === "undefined" || rawName === "null") ? "Candidate" : rawName;

  // Appearance System States
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [tint, setTint] = useState(() => localStorage.getItem("tint") || "blue");
  
  // Controls hooks
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const popoverRef = useRef(null);

  // Sync theme & tint attributes in DOM
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-tint', tint);
    localStorage.setItem("tint", tint);
  }, [tint]);

  // Click outside to close settings popover
  useEffect(() => {
    const clickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Track window scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const rawRole = localStorage.getItem("userRole");
    const activeRole = (!rawRole || rawRole === "undefined" || rawRole === "null") ? "Software Engineer" : rawRole;
    localStorage.removeItem(`roadmap_compiled_${activeRole}`);

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userSkills");
    
    navigate('/');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  // Tint colors configuration palette
  const TINTS = [
    { name: 'blue', color: 'bg-blue-500', hex: '#3B82F6' },
    { name: 'purple', color: 'bg-purple-500', hex: '#A855F7' },
    { name: 'green', color: 'bg-green-500', hex: '#10B981' },
    { name: 'orange', color: 'bg-orange-500', hex: '#F97316' },
    { name: 'red', color: 'bg-red-500', hex: '#EF4444' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-4 sm:px-6 py-4 flex justify-center transition-all duration-300">
      <div 
        className={`w-full max-w-7xl rounded-2xl sm:rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled 
            ? 'glass-panel bg-bgSecondary/85 shadow-2xl border-borderColor/90' 
            : 'glass-panel bg-bgSecondary/45 border-borderColor/40 shadow-lg'
        }`}
      >
        
        {/* Apple style Badge Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8.5 h-8.5 rounded-full border border-borderColor bg-bgSecondary flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-accentPrimary transition-colors duration-300">
            <svg viewBox="0 0 100 100" className="w-6.5 h-6.5 animate-pulse-slow">
              <circle cx="50" cy="40" r="21" fill="var(--accent-primary)" />
              <path d="M15,100 C15,82 30,74 50,74 C70,74 85,82 85,100 Z" fill="var(--accent-secondary)" opacity="0.8" />
              <circle cx="50" cy="40" r="10" fill="#ffffff" />
            </svg>
          </div>
          <span className="font-heading font-black text-sm tracking-tight text-textPrimary capitalize group-hover:text-accentPrimary transition-colors duration-300">
            Alok AI
          </span>
        </Link>

        {/* Dynamic Route items */}
        {token ? (
          /* Authenticated Productivity Dock Menu */
          <div className="hidden md:flex items-center gap-6">
            {[
              { path: '/dashboard', label: 'Dashboard', icon: Compass },
              { path: '/interview', label: 'Simulator', icon: Award },
              { path: '/preparation', label: 'Doubt Hub', icon: Terminal },
              { path: '/roadmap', label: 'Roadmap', icon: Map },
              { path: '/resume', label: 'ATS Screener', icon: FileSpreadsheet },
              { path: '/profile', label: 'Profile', icon: User }
            ].map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    isActive(link.path) 
                      ? 'text-accentPrimary' 
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-[-10px] left-0 right-0 h-[2.5px] bg-gradient-to-r from-accentPrimary to-accentSecondary rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          /* Guest Experience Dock Menu */
          <div className="hidden md:flex items-center gap-7 text-[10px] font-black uppercase tracking-wider text-textSecondary">
            <a href="/" className="hover:text-textPrimary transition-colors">Home</a>
            <a href="#features-demo" className="hover:text-textPrimary transition-colors">Features</a>
            <a href="#pricing-matrix" className="hover:text-textPrimary transition-colors">Pricing</a>
          </div>
        )}

        {/* Action controls */}
        <div className="flex items-center gap-3">
          
          {/* Appearance Settings popover trigger */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              type="button"
              className={`p-2.5 rounded-xl border border-borderColor bg-bgSecondary/40 hover:bg-bgPrimary text-textSecondary hover:text-textPrimary transition-all duration-300 flex items-center justify-center cursor-pointer shrink-0 ${settingsOpen ? 'border-accentPrimary text-accentPrimary bg-bgPrimary' : ''}`}
              title="Appearance Settings"
            >
              <Palette className="w-4 h-4 text-accentPrimary animate-pulse" />
            </button>

            {/* Apple settings Popover panel */}
            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="absolute right-0 mt-3 w-64 p-5 rounded-2xl glass-panel bg-bgSecondary border-borderColor shadow-2xl space-y-4"
                >
                  <div>
                    <h4 className="text-[10px] font-black text-textPrimary uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Appearance Mode
                    </h4>
                    <div className="grid grid-cols-2 gap-2 bg-bgPrimary/60 border border-borderColor p-1 rounded-xl">
                      <button
                        onClick={() => setTheme('light')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          theme === 'light' 
                            ? 'bg-textPrimary text-bgPrimary shadow-sm' 
                            : 'text-textSecondary hover:text-textPrimary'
                        }`}
                      >
                        Light Mode
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          theme === 'dark' 
                            ? 'bg-textPrimary text-bgPrimary shadow-sm' 
                            : 'text-textSecondary hover:text-textPrimary'
                        }`}
                      >
                        Dark Mode
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-textPrimary uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-accentPrimary" />
                      Accent Tint Color
                    </h4>
                    <div className="flex items-center justify-between px-1.5 py-1 bg-bgPrimary/40 border border-borderColor rounded-xl">
                      {TINTS.map((t) => (
                        <button
                          key={t.name}
                          onClick={() => setTint(t.name)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${t.color} hover:scale-115 relative cursor-pointer`}
                          title={`Select ${t.name} accent`}
                        >
                          {tint === t.name && (
                            <div className="absolute inset-0 rounded-full border-2 border-white flex items-center justify-center shadow-inner">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-[8px] font-extrabold uppercase tracking-widest text-textSecondary text-center border-t border-borderColor pt-3">
                    Apple Tahoe Design System
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Authenticated user split controls */}
          {token ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[9px] font-extrabold text-textSecondary uppercase tracking-widest bg-bgPrimary border border-borderColor px-3 py-1.5 rounded-full shadow-inner select-none">
                {userName.split(' ')[0]}
              </span>
              <MagneticButton
                onClick={handleLogout}
                className="bg-bgSecondary hover:bg-red-500 hover:text-white border border-borderColor text-textPrimary px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </MagneticButton>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-wider text-textSecondary hover:text-textPrimary transition-colors mr-1">
                Sign In
              </Link>
              <MagneticButton
                onClick={() => navigate('/register')}
                className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-4.5 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Register
              </MagneticButton>
            </div>
          )}

          {/* Mobile responsive hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-borderColor bg-bgSecondary/45 text-textSecondary hover:text-textPrimary md:hidden flex items-center justify-center shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Responsive Navigation Drawers */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[80px] left-4 right-4 p-6 glass-panel bg-bgSecondary/95 border-borderColor rounded-3xl shadow-2xl flex flex-col md:hidden z-50 space-y-4"
          >
            {token ? (
              /* Authenticated Drawer Links */
              <div className="flex flex-col space-y-3.5 text-xs font-bold text-textSecondary uppercase tracking-widest">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary flex items-center gap-2"><Compass className="w-4 h-4 text-accentPrimary" /> Dashboard</Link>
                <Link to="/interview" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary flex items-center gap-2"><Award className="w-4 h-4 text-accentPrimary" /> Simulator</Link>
                <Link to="/preparation" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary flex items-center gap-2"><Terminal className="w-4 h-4 text-accentPrimary" /> Doubt Hub</Link>
                <Link to="/roadmap" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary flex items-center gap-2"><Map className="w-4 h-4 text-accentPrimary" /> Roadmap</Link>
                <Link to="/resume" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-accentPrimary" /> ATS Screener</Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary flex items-center gap-2"><User className="w-4 h-4 text-accentPrimary" /> Profile</Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 w-full text-left text-red-400 pt-3 border-t border-borderColor uppercase font-bold"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              /* Guest Drawer Links */
              <div className="flex flex-col space-y-4 text-xs font-bold text-textSecondary uppercase tracking-widest">
                <a href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary">Home</a>
                <a href="#features-demo" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary">Features</a>
                <a href="#pricing-matrix" onClick={() => setMobileMenuOpen(false)} className="hover:text-textPrimary">Pricing</a>
                <div className="border-t border-borderColor pt-4 flex gap-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-borderColor hover:border-textPrimary text-textPrimary">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-textPrimary text-bgPrimary font-black">Register</Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
