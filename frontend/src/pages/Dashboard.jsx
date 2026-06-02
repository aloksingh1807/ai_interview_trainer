import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Trophy, Clock, ChevronRight, Play, BookOpen, AlertTriangle, Cpu, Flame, Award, Calendar, CheckCircle2, ChevronDown, ChevronUp, Star, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../components/MagneticButton';

// Lightweight elegant CountUp component to avoid library footprint and ensure high FPS
function CountUpNumber({ endValue, duration = 1.2 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(endValue, 10) || 0;
    if (end === 0) return;
    
    const totalMiliseconds = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [endValue, duration]);

  return <>{count}</>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const rawRole = localStorage.getItem("userRole");
  const userRole = (!rawRole || rawRole === "undefined" || rawRole === "null") ? "Software Engineer" : rawRole;

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error loading dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] gap-4 bg-bgPrimary text-textSecondary transition-colors duration-300">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-textSecondary">Loading performance cockpit...</span>
      </div>
    );
  }

  const {
    readiness_score = 0,
    completed = 0,
    total = 0,
    avg_score = 0,
    best_score = 0,
    history = [],
    weak_topics = [],
    recommendations = []
  } = stats || {};

  // Custom calculate dynamic active streak based on consecutive dates in history
  const calculateStreak = () => {
    if (!history || history.length === 0) return 0;
    
    // Parse dates and sort descending
    const dates = history
      .map(item => new Date(item.date).toDateString())
      .filter((value, index, self) => self.indexOf(value) === index) // Unique dates only
      .map(dStr => new Date(dStr))
      .sort((a, b) => b - a);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // If the latest activity is not today or yesterday, streak is broken
    const latestDate = dates[0];
    if (!latestDate || (latestDate < yesterday && latestDate.toDateString() !== today.toDateString())) {
      return 0;
    }

    streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const current = dates[i];
      const next = dates[i + 1];
      const diffTime = Math.abs(current - next);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break; // Streak broken
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Custom pre-configured beautiful achievement badges
  const badgesList = [
    {
      id: "algo_master",
      title: "Algorithmic Master",
      desc: "Scored 80%+ on any Technical mock round problem.",
      unlocked: best_score >= 80,
      gradient: "from-blue-500 to-indigo-500",
      icon: <Cpu className="w-5 h-5" />
    },
    {
      id: "streak_leader",
      title: "Streak Leader",
      desc: "Practice active for 3+ consecutive simulator runs.",
      unlocked: completed >= 3,
      gradient: "from-orange-500 to-red-500",
      icon: <Flame className="w-5 h-5" />
    },
    {
      id: "sys_architect",
      title: "System Architect",
      desc: "Initiated 4+ comprehensive mock interviews.",
      unlocked: total >= 4,
      gradient: "from-purple-500 to-pink-500",
      icon: <Award className="w-5 h-5" />
    },
    {
      id: "speaker_elite",
      title: "STAR Communicator",
      desc: "Maintain an overall average score of 70% or more.",
      unlocked: avg_score >= 70,
      gradient: "from-emerald-500 to-teal-500",
      icon: <Star className="w-5 h-5" />
    },
    {
      id: "ats_champ",
      title: "ATS Champion",
      desc: "Achieve readiness score ranking higher than 75%.",
      unlocked: readiness_score >= 75,
      gradient: "from-cyan-500 to-blue-500",
      icon: <CheckCircle2 className="w-5 h-5" />
    },
    {
      id: "alok_elite",
      title: "Alok's Elite",
      desc: "Outstanding score index exceeding 85% average.",
      unlocked: avg_score >= 85,
      gradient: "from-yellow-500 to-amber-600",
      icon: <Trophy className="w-5 h-5" />
    }
  ];

  const getScoreRating = (score) => {
    if (score >= 85) return { label: "Superior", color: "bg-green-500/10 text-green-400 border-green-500/20" };
    if (score >= 70) return { label: "Passing", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    return { label: "Needs Prep", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
  };

  const toggleSessionExpand = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 bg-bgPrimary text-textSecondary transition-colors duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary bg-bgSecondary border border-borderColor px-3 py-1.5 rounded-full">
            Metrics Terminal
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-textPrimary mt-3.5">
            Your Performance Workspace
          </h1>
          <p className="text-xs text-textSecondary mt-1">
            Target Role: <strong className="text-textPrimary">{userRole}</strong> • Analyze technical benchmarks or launch active simulations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MagneticButton
            onClick={() => navigate('/preparation')}
            className="bg-bgSecondary text-textSecondary border border-borderColor hover:border-accentPrimary hover:bg-bgPrimary px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Ask AI Tutor
          </MagneticButton>
          <MagneticButton
            onClick={() => navigate('/interview')}
            className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-5.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            Launch Mock
            <Play className="w-3 h-3 ml-1.5 fill-current" />
          </MagneticButton>
        </div>
      </div>

      {/* Top Metrics Row - Circle Dial, Streak, Statistics Summary, Badge Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        
        {/* 1. Circle dial card (Col 4) */}
        <div className="lg:col-span-4 glass-panel bg-bgCard border-borderColor rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
          <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary mb-6">
            Overall Readiness Index
          </h3>
          
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="74" stroke="rgba(31,41,55,0.4)" strokeWidth="7" fill="transparent" />
              <motion.circle
                cx="88"
                cy="88"
                r="74"
                stroke="var(--accent-primary)"
                strokeWidth="7.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 74}
                initial={{ strokeDashoffset: 2 * Math.PI * 74 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 74 * (1 - (readiness_score || 5) / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_var(--accent-glow)]"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-heading font-extrabold text-4xl text-textPrimary">
                <CountUpNumber endValue={readiness_score} />%
              </span>
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-textSecondary mt-1">
                Readiness Score
              </span>
            </div>
          </div>

          <p className="text-xs text-textSecondary mt-6 max-w-[220px] leading-relaxed">
            {readiness_score >= 80 ? "🔥 Exceptional ranking! Alok approves your technical capabilities." : readiness_score >= 60 ? "📈 Stable performance. Refine specific concept threads below." : "⚠️ Baseline metrics. Complete multiple interviews to feed RAG logs."}
          </p>
        </div>

        {/* 2. Streak Tracker Widget (Col 4) */}
        <div className="lg:col-span-4 glass-panel bg-bgCard border-borderColor rounded-3xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary">
                Active Training Streak
              </h3>
              <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${currentStreak > 0 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-bgSecondary text-textSecondary'}`}>
                {currentStreak > 0 ? 'ACTIVE' : 'DORMANT'}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-7">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${currentStreak > 0 ? 'bg-orange-500/10 border-orange-500/25 text-orange-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-bgSecondary border-borderColor text-textSecondary'}`}>
                <Flame className={`w-7 h-7 ${currentStreak > 0 ? 'fill-orange-500/20' : ''}`} />
              </div>
              <div>
                <span className="font-heading font-extrabold text-3xl text-textPrimary leading-none">
                  {currentStreak} <span className="text-sm font-bold text-textSecondary">Days</span>
                </span>
                <p className="text-[10px] text-textSecondary font-bold uppercase tracking-wide mt-1">
                  Consecutive Mock Training
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 mt-6">
            <div className="w-full bg-bgSecondary rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(100, (currentStreak / 5) * 100)}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-textSecondary uppercase tracking-widest">
              <span>Next Milestone: 5 Days</span>
              <span>{Math.max(0, 5 - currentStreak)} runs to go</span>
            </div>
          </div>
        </div>

        {/* 3. Numeric Stats Cards Grid (Col 4) */}
        <div className="lg:col-span-4 grid grid-rows-3 gap-4">
          {/* Total interviews */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-2xl p-5 flex items-center gap-4 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-accentPrimary group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">Total Mocks</h4>
              <span className="text-2xl font-extrabold font-heading text-textPrimary leading-none mt-1 block">
                <CountUpNumber endValue={total} />
              </span>
            </div>
          </div>

          {/* Highest score */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-2xl p-5 flex items-center gap-4 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-accentSecondary group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">Highest Score</h4>
              <span className="text-2xl font-extrabold font-heading text-textPrimary leading-none mt-1 block">
                <CountUpNumber endValue={best_score} />%
              </span>
            </div>
          </div>

          {/* Average rank */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-2xl p-5 flex items-center gap-4 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">Average Rank</h4>
              <span className="text-2xl font-extrabold font-heading text-textPrimary leading-none mt-1 block">
                <CountUpNumber endValue={avg_score} />%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Achievement Badges Grid */}
      <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-accentPrimary" />
          <h3 className="font-heading font-extrabold text-lg text-textPrimary">
            Unlocked Technical Milestones
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badgesList.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`relative flex flex-col items-center justify-between p-5 rounded-2xl border text-center transition-all ${badge.unlocked ? 'bg-bgSecondary/45 border-borderColor shadow-lg' : 'bg-bgCard border-borderColor opacity-40 grayscale'}`}
            >
              {/* Badge Icon Core */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${badge.unlocked ? badge.gradient : 'from-zinc-800 to-zinc-900'} flex items-center justify-center text-white shadow-md relative group/tooltip`}>
                {badge.icon}
                
                {/* Floating tooltip */}
                <div className="absolute bottom-full mb-2 w-48 p-2.5 rounded-xl bg-bgSecondary border border-borderColor text-[10px] text-textSecondary leading-relaxed opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-20 shadow-xl text-center">
                  <span className="font-bold text-textPrimary block mb-0.5">{badge.title}</span>
                  {badge.desc}
                </div>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-extrabold tracking-tight text-textPrimary block">{badge.title}</span>
                <span className={`text-[7.5px] font-black uppercase mt-1 px-1.5 py-0.5 rounded-full inline-block ${badge.unlocked ? 'bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse' : 'bg-bgSecondary text-textSecondary border border-borderColor'}`}>
                  {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Column Breakdown - Performance Trend & History vs revision modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recharts Trend + Timeline Mock History (Col 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recharts progress trend block */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-lg">
            <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary mb-4">
              Mock Score Progression (Interactive Trend Lines)
            </h3>
            {history.length > 0 ? (
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <XAxis dataKey="date" stroke="#4B5563" fontSize={9} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#4B5563" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--accent-primary)"
                      strokeWidth={3.2}
                      dot={{ r: 4.5, stroke: 'var(--accent-primary)', strokeWidth: 2.2, fill: 'var(--bg-primary)' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-52 border border-dashed border-borderColor rounded-2xl bg-bgSecondary/10">
                <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">No mock timeline data found yet.</span>
              </div>
            )}
          </div>

          {/* Chronological Interview History Timeline */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-7 shadow-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-borderColor pb-4">
              <Calendar className="w-5 h-5 text-accentPrimary" />
              <div>
                <h3 className="font-heading font-extrabold text-lg text-textPrimary">
                  Chronological Mock Timeline
                </h3>
                <p className="text-[10px] text-textSecondary mt-0.5">Chronicle records of all simulated interview events.</p>
              </div>
            </div>

            {history && history.length > 0 ? (
              <div className="relative border-l border-borderColor pl-6 ml-4 space-y-6">
                {history.map((session, idx) => {
                  const rating = getScoreRating(session.score);
                  const isExpanded = expandedSessionId === session.index;
                  
                  return (
                    <div key={idx} className="relative group">
                      
                      {/* Timeline node dot indicator */}
                      <span className="absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full bg-bgPrimary border-2 border-accentPrimary group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(59,130,246,0.6)]" />

                      <div 
                        onClick={() => toggleSessionExpand(session.index)}
                        className="p-4 rounded-2xl bg-bgSecondary/20 border border-borderColor hover:border-accentPrimary transition-all shadow-sm cursor-pointer select-none"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-textSecondary flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {session.date}
                            </span>
                            <h4 className="text-xs font-black text-textPrimary uppercase tracking-tight group-hover:text-accentPrimary transition-colors">
                              {session.role} Mock Interview
                            </h4>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${rating.color}`}>
                              {rating.label}
                            </span>
                            <span className="text-sm font-extrabold font-heading text-textPrimary">
                              {session.score}%
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-textSecondary" /> : <ChevronDown className="w-4 h-4 text-textSecondary" />}
                          </div>

                        </div>

                        {/* Collapsible detail panel */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-borderColor space-y-3 text-left">
                                <div className="grid grid-cols-2 gap-4 text-[10px]">
                                  <div>
                                    <span className="font-bold text-textSecondary uppercase tracking-widest block">Role Target</span>
                                    <span className="font-bold text-textPrimary">{session.role}</span>
                                  </div>
                                  <div>
                                    <span className="font-bold text-textSecondary uppercase tracking-widest block">Index Code</span>
                                    <span className="font-bold text-textPrimary">#SESS-00{session.index}</span>
                                  </div>
                                </div>
                                <div className="rounded-xl bg-bgPrimary border border-borderColor p-3 text-[11px] leading-relaxed text-textSecondary">
                                  <span className="font-extrabold text-textPrimary block mb-1">🤖 AI Recruiter Feedback Notes:</span>
                                  Your structural responsiveness and system execution score reached {session.score}%. Key performance points demonstrate consistent mastery. Refine specific algorithmic complexity items to qualify for optimal Awwwards-level compliance.
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-borderColor rounded-2xl bg-bgSecondary/10">
                <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">No mock sessions completed yet.</span>
                <MagneticButton 
                  onClick={() => navigate('/interview')}
                  className="mt-4 bg-bgSecondary text-textSecondary border border-borderColor px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  Start First Simulation
                </MagneticButton>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Skill Gaps & Study Guides (Col 4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Card left: revision concepts */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-8 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
                <h3 className="font-heading font-extrabold text-lg text-textPrimary">
                  Skill Gaps Detected
                </h3>
              </div>
              {weak_topics.length > 0 ? (
                <ul className="space-y-3.5">
                  {weak_topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-bgSecondary/40 border border-borderColor">
                      <span className="w-5 h-5 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-bold flex items-center justify-center mt-0.5">
                        !
                      </span>
                      <span className="text-xs font-semibold text-textPrimary leading-relaxed">
                        {topic}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-textSecondary">Perfect standings. Alok detects zero core technical errors.</p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-borderColor flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary">Concepts Roadmap</span>
              <MagneticButton onClick={() => navigate('/preparation')} className="text-xs font-bold text-accentPrimary hover:text-textPrimary">
                Launch AI Tutor <ChevronRight className="w-4 h-4 ml-0.5" />
              </MagneticButton>
            </div>
          </div>

          {/* Card right: personalized study guides */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-8 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-textPrimary" />
                <h3 className="font-heading font-extrabold text-lg text-textPrimary">
                  Personalized Study Guides
                </h3>
              </div>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="group flex items-start gap-4 p-3.5 rounded-2xl bg-bgSecondary/40 border border-borderColor hover:border-accentPrimary transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-bgPrimary border border-borderColor flex items-center justify-center text-textPrimary shrink-0 group-hover:bg-blue-500 transition-colors">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-textSecondary group-hover:text-accentPrimary transition-colors">{rec.topic}</h4>
                        <p className="text-[11px] text-textSecondary leading-normal mt-0.5">{rec.resource}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-textSecondary">Practice mock sessions to generate customized study blueprint details.</p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-borderColor flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary">Resume Compliance</span>
              <MagneticButton onClick={() => navigate('/resume')} className="text-xs font-bold text-textPrimary hover:text-accentPrimary">
                Review ATS <ChevronRight className="w-4 h-4 ml-0.5" />
              </MagneticButton>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
