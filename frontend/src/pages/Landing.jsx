import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Video, GraduationCap, Compass, FileText, 
  CheckCircle2, Cpu, ShieldCheck, Sparkles, MessageSquare, 
  Terminal, Award, Layers, Star, Zap, DollarSign
} from 'lucide-react';
import Avatar from '../components/Avatar';
import MagneticButton from '../components/MagneticButton';

export default function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirection block for logged-in candidates
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  // Pricing toggle state (Annual vs Monthly)
  const [isAnnual, setIsAnnual] = useState(true);

  // Active feature preview tab
  const [activeTab, setActiveTab] = useState('simulator');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 16 }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bgPrimary px-4 sm:px-6 transition-colors duration-500">
      
      {/* Dynamic Animated Color Blobs behind glass cards */}
      <div className="absolute top-[10%] left-[5%] w-[32rem] h-[32rem] rounded-full bg-accentPrimary/10 blur-[130px] animate-blob-slow pointer-events-none -z-20" />
      <div className="absolute bottom-[20%] right-[10%] w-[38rem] h-[38rem] rounded-full bg-accentSecondary/10 blur-[150px] animate-blob-reverse pointer-events-none -z-20" />
      <div className="absolute top-1/2 left-1/3 w-[25rem] h-[25rem] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-20" />

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto pt-16 pb-24 md:pt-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel bg-bgSecondary/60 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-accentPrimary animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-textSecondary">
                Apple Intelligence Glass • Next-Gen AI interview cockpit
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-textPrimary leading-[1.08] max-w-3xl">
              Land your dream job with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentPrimary via-accentSecondary to-cyan-500">
                Alok AI Trainer.
              </span>
            </h1>

            <motion.p 
              variants={itemVariants}
              className="text-textSecondary text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed"
            >
              Train face-to-face in realistic virtual rooms, optimize your resume for automated applicant tracking systems (ATS), and conquer coding rounds with your dedicated 24/7 technical copilot.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <MagneticButton
                onClick={() => navigate('/register')}
                className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-8 py-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <a 
                href="#features-demo"
                className="px-8 py-4 rounded-2xl border border-borderColor hover:border-accentPrimary hover:bg-bgSecondary/40 text-textSecondary hover:text-textPrimary text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center"
              >
                Watch Simulator Demo
              </a>
            </motion.div>

            {/* Quick Metrics display */}
            <motion.div 
              variants={itemVariants}
              className="pt-6 grid grid-cols-3 gap-6 border-t border-borderColor max-w-md"
            >
              <div>
                <div className="text-2xl font-black text-textPrimary">98.4%</div>
                <div className="text-[9px] uppercase tracking-wider font-extrabold text-textSecondary mt-0.5">RAG Relevance</div>
              </div>
              <div>
                <div className="text-2xl font-black text-textPrimary">25k+</div>
                <div className="text-[9px] uppercase tracking-wider font-extrabold text-textSecondary mt-0.5">Mock Interviews</div>
              </div>
              <div>
                <div className="text-2xl font-black text-textPrimary">94.2%</div>
                <div className="text-[9px] uppercase tracking-wider font-extrabold text-textSecondary mt-0.5">Offer Success</div>
              </div>
            </motion.div>
          </div>

          {/* Right Interactive AI Portrait widget */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col items-center justify-center relative py-6"
          >
            <div className="relative p-8 rounded-3xl glass-panel bg-bgSecondary/45 border-borderColor shadow-2xl flex flex-col items-center text-center">
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-accentPrimary text-white text-[9px] font-black uppercase tracking-widest animate-bounce">
                Live Preview
              </div>
              
              <Avatar isSpeaking={true} />
              
              <h3 className="font-heading font-extrabold text-lg mt-6 text-textPrimary">
                Meet Alok
              </h3>
              <p className="text-xs text-textSecondary max-w-xs mt-1.5 leading-relaxed">
                "Hello! Ready to simulate a senior system architecture role or write some robust backend algorithms?"
              </p>
              
              <div className="mt-6 flex items-center gap-1.5 w-full bg-bgPrimary/60 border border-borderColor rounded-xl p-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-textSecondary">
                  Microphone & Camera active for real-time speech
                </span>
              </div>
            </div>

            {/* Float Achievement badges */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -4 }}
              className="absolute -bottom-4 -left-6 glass-panel bg-bgSecondary/85 border-borderColor rounded-2xl p-4 flex items-center gap-3 shadow-xl max-w-[210px]"
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-accentPrimary/10 border border-accentPrimary/35 flex items-center justify-center text-accentPrimary shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary">Face-To-Face Room</h4>
                <span className="text-xs font-bold text-textPrimary">Real-time Feedback</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- LIVE WORKSPACE SHOWCASE & PREVIEWS --- */}
      <div id="features-demo" className="max-w-7xl mx-auto py-20 border-t border-borderColor">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-accentPrimary">
            WORKSPACE SUITE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-textPrimary leading-none">
            An entire tech interview cockpit
          </h2>
          <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
            Toggle between our specialized workspaces designed to build confidence, polish technical skills, and beat the candidate pool.
          </p>

          {/* Interactive Showcase Tabs */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {[
              { id: 'simulator', label: 'Face-To-Face Simulator', icon: Video, color: 'text-accentPrimary' },
              { id: 'tutor', label: 'AI Doubt Companion', icon: Terminal, color: 'text-accentSecondary' },
              { id: 'ats', label: 'ATS Scan Hub', icon: FileText, color: 'text-emerald-500' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-textPrimary text-bgPrimary border-textPrimary shadow-md' 
                      : 'bg-bgSecondary/40 border-borderColor text-textSecondary hover:text-textPrimary hover:bg-bgSecondary/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-bgPrimary' : tab.color}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display Panel */}
        <div className="glass-panel bg-bgSecondary/30 border-borderColor rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {activeTab === 'simulator' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-5 space-y-6">
                <span className="px-3 py-1 rounded-full bg-accentPrimary/10 border border-accentPrimary/30 text-accentPrimary text-[9px] font-extrabold uppercase tracking-widest">
                  Real-time Simulation
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textPrimary leading-tight">
                  High-fidelity interview environment
                </h3>
                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                  Practice live with webcam, audio recording, and automated timer guidelines. Write clean algorithms inside our built-in programming terminal while Alok analyzes your solution structure.
                </p>
                <ul className="space-y-3.5 text-xs text-textSecondary">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accentPrimary shrink-0" />
                    Interactive Monaco-based Coding Arena.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accentPrimary shrink-0" />
                    Speech-To-Text analysis of your answers.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accentPrimary shrink-0" />
                    Rigorous evaluation with scores and custom tips.
                  </li>
                </ul>
              </div>
              
              <div className="lg:col-span-7 bg-bgSecondary/60 border border-borderColor rounded-2xl p-4 sm:p-6 shadow-inner relative">
                {/* Mock Simulator UI */}
                <div className="flex items-center justify-between pb-4 border-b border-borderColor mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] font-bold text-accentPrimary uppercase bg-bgPrimary border border-borderColor px-3 py-1 rounded-full">
                    SESS_9832A
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* AI Frame */}
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-bgPrimary/80 border border-borderColor flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 rounded-full bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary">
                      <Cpu className="w-8 h-8 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-textSecondary mt-3 font-semibold">Alok (AI Interviewer)</span>
                  </div>
                  {/* Candidate Frame */}
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-bgPrimary/80 border border-borderColor flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-textSecondary">
                      <Video className="w-8 h-8 text-zinc-500" />
                    </div>
                    <span className="text-[10px] text-textSecondary mt-3 font-semibold">Your Camera Preview</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tutor' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-5 space-y-6">
                <span className="px-3 py-1 rounded-full bg-accentSecondary/10 border border-accentSecondary/30 text-accentSecondary text-[9px] font-extrabold uppercase tracking-widest">
                  AI Study Companion
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textPrimary leading-tight">
                  Clear technical doubts instantly
                </h3>
                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                  Alok Study Companion acts as a senior developer mentoring you through complex data structures, architectural design patterns, and programming doubts.
                </p>
                <ul className="space-y-3.5 text-xs text-textSecondary">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accentSecondary shrink-0" />
                    Explain complex code blocks line by line.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accentSecondary shrink-0" />
                    Mock code reviews with optimization advice.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accentSecondary shrink-0" />
                    Interactive tech stack roadmaps.
                  </li>
                </ul>
              </div>
              
              <div className="lg:col-span-7 bg-bgSecondary/60 border border-borderColor rounded-2xl p-4 sm:p-6 shadow-inner space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-textPrimary">
                  <Terminal className="w-4 h-4 text-accentSecondary" />
                  Alok Technical Study Companion
                </div>
                <div className="bg-bgPrimary/70 rounded-xl p-4 border border-borderColor font-mono text-[10px] space-y-3">
                  <div className="text-textSecondary"># Query: Explain closures in Javascript</div>
                  <div className="text-accentSecondary">// Alok AI Assistant:</div>
                  <div className="text-textPrimary leading-relaxed">
                    "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function's scope even after the outer function has returned."
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ats' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-5 space-y-6">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[9px] font-extrabold uppercase tracking-widest">
                  ATS Optimizer
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textPrimary leading-tight">
                  Beat automated resume filters
                </h3>
                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                  Upload your resume to compare against real target job descriptions. Our parser analyzes skill density, grammar issues, format consistency, and provides immediate optimization suggestions.
                </p>
                <ul className="space-y-3.5 text-xs text-textSecondary">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Overall match percentage calculator.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Missing keywords and core skills extraction.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    PDF parsed structure validator.
                  </li>
                </ul>
              </div>
              
              <div className="lg:col-span-7 bg-bgSecondary/60 border border-borderColor rounded-2xl p-4 sm:p-6 shadow-inner space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-textPrimary">ATS Candidate Scorecard</span>
                  <span className="text-emerald-500 font-extrabold text-xs">A+ Rating</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-textSecondary mb-1">
                      <span>Keyword Relevance Match</span>
                      <span>85% Match</span>
                    </div>
                    <div className="h-2 w-full bg-bgPrimary rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-semibold">Matched: React</span>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-semibold">Matched: Python</span>
                    <span className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-semibold">Missing: Docker</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* --- PRICING MATRIX --- */}
      <div className="max-w-7xl mx-auto py-20 border-t border-borderColor text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-accentPrimary">
            FLEXIBLE PLANS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-textPrimary leading-none">
            Ready to upgrade your preparation?
          </h2>
          <p className="text-sm text-textSecondary max-w-xl mx-auto leading-relaxed">
            Unlock advanced role templates, granular skill scans, and unlimited interactive simulator durations.
          </p>
          
          {/* Billing Switch */}
          <div className="inline-flex items-center gap-3.5 bg-bgSecondary border border-borderColor p-1.5 rounded-2xl shadow-inner mt-4">
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isAnnual ? 'bg-textPrimary text-bgPrimary shadow-sm' : 'text-textSecondary hover:text-textPrimary'}`}
            >
              Annual Billing (Save 25%)
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${!isAnnual ? 'bg-textPrimary text-bgPrimary shadow-sm' : 'text-textSecondary hover:text-textPrimary'}`}
            >
              Monthly Billing
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          
          {/* Tier 1: Seed */}
          <div className="glass-panel bg-bgSecondary/20 border-borderColor rounded-3xl p-8 flex flex-col justify-between text-left relative">
            <div>
              <h3 className="font-heading font-black text-lg text-textPrimary">Seed Plan</h3>
              <p className="text-xs text-textSecondary mt-1 leading-relaxed">Essential AI prep tools for candidates kickstarting practice.</p>
              
              <div className="my-8 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-textPrimary">$0</span>
                <span className="text-xs text-textSecondary font-semibold">/ forever</span>
              </div>
              
              <ul className="space-y-3.5 text-xs text-textSecondary border-t border-borderColor pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentPrimary" />
                  3 Live AI simulations / mo.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentPrimary" />
                  Standard ATS Scanner parses.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentPrimary" />
                  15 Study companion queries.
                </li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-bgSecondary hover:bg-bgPrimary border border-borderColor text-textPrimary py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all mt-8"
            >
              Start Practice
            </button>
          </div>

          {/* Tier 2: Growth (Recommended) */}
          <div className="glass-panel bg-bgSecondary/40 border-accentPrimary/40 rounded-3xl p-8 flex flex-col justify-between text-left relative shadow-[0_20px_50px_var(--accent-glow)] scale-100 lg:scale-[1.03]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-accentPrimary text-white text-[9px] font-black uppercase tracking-widest shadow-md">
              Most Popular
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-textPrimary">Growth Plan</h3>
              <p className="text-xs text-textSecondary mt-1 leading-relaxed">Comprehensive coaching pipelines built for professionals seeking offers.</p>
              
              <div className="my-8 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-textPrimary">
                  {isAnnual ? '$15' : '$19'}
                </span>
                <span className="text-xs text-textSecondary font-semibold">/ month</span>
              </div>
              
              <ul className="space-y-3.5 text-xs text-textSecondary border-t border-borderColor pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentPrimary" />
                  Unlimited AI Simulations.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentPrimary" />
                  Advanced ATS Scans & structural advice.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentPrimary" />
                  Unlimited Study Companion questions.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentPrimary" />
                  9-Node gamified roadmap access.
                </li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-accentPrimary text-white hover:bg-accentPrimary/80 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all mt-8 shadow-md"
            >
              Get Growth Now
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="glass-panel bg-bgSecondary/20 border-borderColor rounded-3xl p-8 flex flex-col justify-between text-left relative">
            <div>
              <h3 className="font-heading font-black text-lg text-textPrimary">Enterprise</h3>
              <p className="text-xs text-textSecondary mt-1 leading-relaxed">Custom coaching rooms configured for universities and bootcamp teams.</p>
              
              <div className="my-8 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-textPrimary">Custom</span>
                <span className="text-xs text-textSecondary font-semibold">/ contact sales</span>
              </div>
              
              <ul className="space-y-3.5 text-xs text-textSecondary border-t border-borderColor pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentSecondary" />
                  Custom role template configurations.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentSecondary" />
                  Team dashboard & analytics tracking.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accentSecondary" />
                  Dedicated technical account team.
                </li>
              </ul>
            </div>
            <a 
              href="mailto:sales@interviewtrainer.ai?subject=Enterprise Inquiry"
              className="w-full bg-bgSecondary hover:bg-bgPrimary border border-borderColor text-textPrimary py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center block mt-8"
            >
              Contact Sales
            </a>
          </div>

        </div>
      </div>

      {/* --- PREMIUM TESTIMONIALS SECTION --- */}
      <div className="max-w-7xl mx-auto py-20 border-t border-borderColor space-y-12">
        <div className="text-center space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-accentPrimary">
            SUCCESS STORIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-textPrimary leading-none">
            Trusted by developers worldwide
          </h2>
          <p className="text-sm text-textSecondary max-w-xl mx-auto leading-relaxed">
            Read how candidates optimized their workflow, passed dynamic panels, and closed high-end Silicon Valley offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {[
            {
              name: 'Sarah Chen',
              role: 'Senior Frontend at Vercel',
              img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
              text: 'The Monaco Coding Room was a absolute game-changer. Alok analyzed my technical approach and taught me how to explain trade-offs clearly. Closed my offer in 2 weeks!'
            },
            {
              name: 'Arjun Mehta',
              role: 'AI Infrastructure at Stripe',
              img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
              text: 'The ATS scan was incredibly accurate. It extracted critical keywords I missed and helped me bypass resume filters instantly. Highly recommend the professional plans.'
            },
            {
              name: 'Emily Watson',
              role: 'Staff DevOps at Netflix',
              img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
              text: 'Practicing behavioral rounds with Alok relieved all my staging anxiety. The conversational speech analysis gave me custom guidelines to structure my Star Method answers.'
            }
          ].map((t, idx) => (
            <div key={idx} className="glass-panel bg-bgSecondary/30 border-borderColor rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3.5 border-t border-borderColor pt-4">
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full border border-borderColor object-cover" />
                <div>
                  <h4 className="text-xs font-black text-textPrimary">{t.name}</h4>
                  <span className="text-[10px] text-textSecondary font-semibold">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FINAL CTAS --- */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="glass-panel bg-bgSecondary/45 border-borderColor rounded-[2rem] p-8 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          {/* Orb glow inside CTA panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-accentPrimary/5 via-accentSecondary/5 to-transparent pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-black text-textPrimary leading-tight max-w-2xl mx-auto">
            Step into your upgraded interview cockpit today.
          </h2>
          <p className="text-sm text-textSecondary max-w-md mx-auto leading-relaxed">
            Practice for absolute technical confidence and beat applicant tracking system filters with Alok AI Interview Trainer.
          </p>
          <div className="flex justify-center pt-2">
            <MagneticButton
              onClick={() => navigate('/register')}
              className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-9 py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              Sign Up For Free Now
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="max-w-7xl mx-auto border-t border-borderColor py-8 flex flex-col sm:flex-row items-center justify-between text-textSecondary text-[10px] font-bold uppercase tracking-wider px-6">
        <span>© 2026 Alok AI Interview Trainer. All rights reserved.</span>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link to="/" className="hover:text-textPrimary transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-textPrimary transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-textPrimary transition-colors">Support</Link>
        </div>
      </footer>

    </div>
  );
}
