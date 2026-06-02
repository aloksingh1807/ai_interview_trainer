import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Terminal, HelpCircle, Code, ArrowRight, Sparkles, MessageSquare, Map, Check, BookOpen, FileText, ChevronRight, Award, RefreshCw, Star, Laptop, Database, Cpu, HardDrive, ShieldCheck, PlayCircle, BookOpenCheck } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

// Unified 7 Career Path Milestones & Targets
const CAREER_PATHS = [
  {
    id: "ai_eng",
    title: "AI Engineer",
    desc: "Build, orchestrate, and optimize production LLMs and Agentic workflows.",
    salary: "$165K avg",
    skills: ["Python", "PyTorch", "HuggingFace", "LangChain", "VectorDBs", "RAG Systems"],
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: "ml_eng",
    title: "Machine Learning Engineer",
    desc: "Train custom models, write optimized neural nets, and manage ML pipelines.",
    salary: "$172K avg",
    skills: ["Python", "TensorFlow", "Scikit-Learn", "CUDA", "MLOps", "Pandas"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "data_sci",
    title: "Data Scientist",
    desc: "Execute statistical models, parse deep analytics, and build predictive tools.",
    salary: "$145K avg",
    skills: ["R", "Python", "SQL", "Tableau", "Jupyter", "A/B Testing"],
    color: "from-teal-500 to-emerald-400"
  },
  {
    id: "soft_eng",
    title: "Software Engineer",
    desc: "Construct high-performance backends, clean APIs, and distributed architectures.",
    salary: "$150K avg",
    skills: ["Java", "Go", "System Design", "Docker", "Algorithms", "PostgreSQL"],
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: "full_stack",
    title: "Full Stack Developer",
    desc: "Design beautiful web views combined with robust API system layers.",
    salary: "$138K avg",
    skills: ["React", "Node.js", "TypeScript", "Vite", "Tailwind", "Next.js"],
    color: "from-pink-500 to-rose-400"
  },
  {
    id: "cloud_eng",
    title: "Cloud Engineer",
    desc: "Manage high-scale virtual clusters, cluster scaling, and CDN systems.",
    salary: "$155K avg",
    skills: ["AWS", "GCP", "Kubernetes", "Linux", "IAM", "Cloudflare"],
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    desc: "Write clean IaC setups, pipeline automation, and monitor telemetry stacks.",
    salary: "$158K avg",
    skills: ["Terraform", "GitHub Actions", "Docker", "Ansible", "Grafana", "Bash"],
    color: "from-orange-500 to-red-500"
  }
];

// Interactive 9-Node Progression Pipeline
const PIPELINE_NODES = [
  { id: "python", label: "Python Core", level: "Beginner" },
  { id: "ds", label: "Data Structures", level: "Beginner" },
  { id: "algo", label: "Algorithms", level: "Intermediate" },
  { id: "ml", label: "Machine Learning", level: "Intermediate" },
  { id: "dl", label: "Deep Learning", level: "Advanced" },
  { id: "rag", label: "RAG Systems", level: "Advanced" },
  { id: "llm", label: "LLMs & Fine-Tuning", level: "Expert" },
  { id: "deploy", label: "Deployment & MLOps", level: "Expert" },
  { id: "prep", label: "Interview Prep Mocks", level: "Expert" }
];

export default function PreparationHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chatbot'); // 'chatbot' or 'roadmap'
  const [activeResourceTab, setActiveResourceTab] = useState('docs'); // 'docs', 'youtube', 'questions'
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = localStorage.getItem("token");
  const rawRole = localStorage.getItem("userRole");
  const storedRole = (!rawRole || rawRole === "undefined" || rawRole === "null") ? "Software Engineer" : rawRole;
  const [selectedRole, setSelectedRole] = useState(storedRole);
  const userSkills = localStorage.getItem("userSkills") || "React, Node.js, Python, SQL";

  // Multi-turn chatbot message history state
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Greetings! I am Alok, your personal AI interview companion. As an aspiring ${selectedRole}, I am here to help you master algorithms, architecture, behavioral frameworks, or specialized technology stacks. What can we discuss today?`,
      code: null
    }
  ]);

  // Roadmap states
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState('');
  const [completedMilestones, setCompletedMilestones] = useState({});
  const [completedNodes, setCompletedNodes] = useState({});

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load saved milestones and pipeline progress nodes on mount
  useEffect(() => {
    const storedM = localStorage.getItem(`roadmap_milestones_${selectedRole}`);
    if (storedM) {
      try { setCompletedMilestones(JSON.parse(storedM)); } catch (e) { console.error(e); }
    }
    const storedN = localStorage.getItem(`roadmap_pipeline_nodes_${selectedRole}`);
    if (storedN) {
      try { setCompletedNodes(JSON.parse(storedN)); } catch (e) { console.error(e); }
    } else {
      // Seed default completed nodes for visual realism
      const seed = { "python": true, "ds": true };
      setCompletedNodes(seed);
      localStorage.setItem(`roadmap_pipeline_nodes_${selectedRole}`, JSON.stringify(seed));
    }
  }, [selectedRole]);

  // Quick suggestions for chat
  const SUGGESTIONS = [
    { 
      label: "Ask for Career Roadmap", 
      prompt: "Can you provide me with a solid preparation roadmap summary for my role and skills?",
      action: () => setActiveTab('roadmap')
    },
    { 
      label: "Design a Rate Limiter", 
      prompt: "How do you design a high-performance distributed rate limiter? Explain the token bucket algorithm." 
    },
    { 
      label: "LRU Cache Architecture", 
      prompt: "Explain the design and time complexity of a Least-Recently-Used (LRU) Cache." 
    },
    { 
      label: "STAR Behavioral Tips", 
      prompt: "Explain how to structure behavioral interview answers using the STAR method." 
    }
  ];

  // Send query to AI doubt companion
  const handleAskDoubt = async (textPrompt) => {
    const activeQuery = textPrompt || query;
    if (!activeQuery.trim()) return;

    const userMsg = { sender: 'user', text: activeQuery, code: null };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/doubt/ask', 
        { query: activeQuery, role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: res.data.reply,
        code: res.data.code
      }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Unable to reach Alok tutor. Please ensure the backend is running.";
      setError(errMsg);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `Error: ${errMsg}`,
        code: null
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch week-by-week roadmap from backend
  const fetchRoadmap = async (forceRegenerate = false) => {
    if (roadmap && !forceRegenerate) return;
    setRoadmapLoading(true);
    setRoadmapError('');
    try {
      const res = await axios.post('/api/roadmap/generate',
        { role: selectedRole, skills: userSkills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoadmap(res.data);
    } catch (err) {
      setRoadmapError(err.response?.data?.error || "Failed to generate preparation roadmap. Ensure backend is active.");
    } finally {
      setRoadmapLoading(false);
    }
  };

  // Trigger roadmap fetch when switching to roadmap tab
  useEffect(() => {
    if (activeTab === 'roadmap') {
      fetchRoadmap();
    }
  }, [activeTab, selectedRole]);

  // Toggle checklist milestone
  const toggleMilestone = (weekNum, type, itemIdx) => {
    const key = `${selectedRole}_w${weekNum}_${type}_${itemIdx}`;
    setCompletedMilestones(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`roadmap_milestones_${selectedRole}`, JSON.stringify(next));
      return next;
    });
  };

  // Toggle pipeline nodes
  const togglePipelineNode = (nodeId) => {
    setCompletedNodes(prev => {
      const next = { ...prev, [nodeId]: !prev[nodeId] };
      localStorage.setItem(`roadmap_pipeline_nodes_${selectedRole}`, JSON.stringify(next));
      return next;
    });
  };

  // Switch active career path
  const handleSelectPath = (pathRole) => {
    setSelectedRole(pathRole);
    setRoadmap(null); // Clear active cached roadmap to trigger compile
  };

  // Calculate Pipeline completion metrics
  const completedNodesCount = Object.values(completedNodes).filter(Boolean).length;
  const nodesPercentage = Math.round((completedNodesCount / PIPELINE_NODES.length) * 100);

  // Dynamic recommendations logic
  const mockAtsScore = 82; // Premium seeded fallback rating
  const mockBestScore = 85; 

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-bgPrimary text-textSecondary transition-colors duration-300">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-borderColor pb-6">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-accentPrimary bg-blue-500/10 border border-blue-500/25 px-3 py-1.5 rounded-full">
            Study Playground
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-textPrimary mt-3.5">
            Preparation & Doubt-Clearing Hub
          </h1>
          <p className="text-xs text-textSecondary mt-1">
            Solve algorithms, design systems, customize learning tracks, and chat directly with your AI tutor, Alok.
          </p>
        </div>

        {/* Sleek Direct Roadmap Shortcut */}
        <button
          onClick={() => navigate('/roadmap')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bgSecondary hover:bg-bgPrimary border border-borderColor text-textPrimary hover:border-accentPrimary text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
        >
          <Map className="w-4 h-4 text-accentPrimary" />
          <span>Interactive Career Roadmap</span>
        </button>
      </div>

      {/* --- TAB 1: CONVERSATIONAL AI CHATBOT COMPANION --- */}
      {activeTab === 'chatbot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Query Terminal & Prompts (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Context Widget Card */}
            <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-5 shadow-md space-y-3.5">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-textSecondary block">Current Focus Context</span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-accentPrimary font-heading font-black text-sm">
                  🎯
                </div>
                <div>
                  <h4 className="text-xs font-bold text-textPrimary leading-normal uppercase tracking-wider">{selectedRole}</h4>
                  <p className="text-[9px] text-textSecondary font-semibold max-w-[200px] truncate">Skills: {userSkills}</p>
                </div>
              </div>
            </div>

            {/* Quick Suggestions Cards */}
            <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-md space-y-4">
              <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary">
                💡 Conceptual Quick Shortcuts
              </h4>
              <div className="space-y-2.5">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (sug.action) {
                        sug.action();
                      } else {
                        handleAskDoubt(sug.prompt);
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 text-left rounded-xl bg-bgSecondary border border-borderColor hover:border-accentPrimary hover:bg-bgPrimary text-xs font-semibold text-textSecondary transition-all group"
                  >
                    <span className="truncate pr-2">{sug.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-textSecondary flex-shrink-0 group-hover:text-accentPrimary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Messaging Arena (Col 8) */}
          <div className="lg:col-span-8 flex flex-col glass-panel bg-bgCard border-borderColor rounded-3xl shadow-lg h-[620px] overflow-hidden">
            
            {/* Chat Banner Header */}
            <div className="px-6 py-4 border-b border-borderColor flex items-center justify-between bg-bgSecondary/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-accentPrimary font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-textPrimary tracking-widest uppercase">Alok Study Companion</h4>
                  <span className="text-[9px] text-textSecondary uppercase tracking-wider">AI Tutor Online • Continuous Multi-turn Practice</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse border border-green-500/20 shadow-glow" />
            </div>

            {/* Message History Scrolling */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Sender Avatar */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs border ${msg.sender === 'user' ? 'bg-bgSecondary border-borderColor text-textSecondary' : 'bg-blue-950/30 border-blue-900/40 text-accentPrimary'}`}>
                    {msg.sender === 'user' ? 'U' : 'A'}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-3.5">
                    <div className={`p-4.5 rounded-3xl text-xs font-semibold leading-relaxed whitespace-pre-line shadow-sm ${msg.sender === 'user' ? 'bg-bgSecondary border border-borderColor text-textPrimary rounded-tr-none' : 'bg-blue-950/20 border border-blue-900/25 text-textPrimary rounded-tl-none'}`}>
                      {msg.text}
                    </div>

                    {/* Code snippet panel */}
                    {msg.code && (
                      <div className="space-y-1.5 pl-3">
                        <span className="text-[8px] font-extrabold text-textSecondary uppercase tracking-widest flex items-center gap-1.5">
                          <Code className="w-3 h-3 text-textSecondary" />
                          Alok Dynamic Sample Snippet
                        </span>
                        <div className="rounded-2xl bg-bgPrimary p-4 border border-borderColor shadow-inner max-w-full overflow-x-auto">
                          <pre className="text-[10.5px] font-mono text-textPrimary leading-normal text-left font-semibold">
                            <code>{msg.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Bot thinking dots */}
              {loading && (
                <div className="flex gap-3 mr-auto max-w-[85%]">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-blue-950/30 border border-blue-900/40 text-accentPrimary flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div className="px-5 py-4 rounded-3xl bg-blue-950/10 border border-blue-900/15 rounded-tl-none flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="mx-6 mb-3 p-3 rounded-xl bg-red-950/20 border border-red-800/60 text-red-400 text-[10px] font-bold">
                ⚠️ {error}
              </div>
            )}

            {/* Messaging Input console */}
            <div className="p-4 border-t border-borderColor bg-bgSecondary">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskDoubt();
                }}
                className="flex gap-3 items-center bg-bgPrimary border border-borderColor rounded-2xl px-4 py-2 focus-within:border-accentPrimary transition-colors"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Query algorithms, ask how to optimize templates, or consult behavioral STAR blueprints..."
                  className="flex-1 bg-transparent py-2 text-xs font-semibold text-textPrimary focus:outline-none placeholder-zinc-550"
                  disabled={loading}
                />
                <MagneticButton
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="bg-white text-zinc-950 hover:bg-blue-500 hover:text-white p-2.5 rounded-xl transition-all"
                >
                  <Send className="w-3.5 h-3.5 animate-pulse" />
                </MagneticButton>
              </form>
              <div className="flex justify-between items-center px-2 mt-2">
                <span className="text-[8px] text-textSecondary font-bold uppercase tracking-wider">Secure sandbox active</span>
                <span className="text-[8px] text-textSecondary font-bold uppercase tracking-wider">Press Enter to Send</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 2: PERSONALIZED CAREER ROADMAP GENERATOR --- */}
      {activeTab === 'roadmap' && (
        <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-md">
          <div className="w-16 h-16 rounded-full bg-accentPrimary/10 border border-accentPrimary/30 flex items-center justify-center text-accentPrimary animate-pulse">
            <Map className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-base text-textPrimary">Career Roadmap Upgraded</h3>
          <p className="text-xs text-textSecondary max-w-sm">We have relocated the career learning pipeline, interactive mastery dials, and specialized track guides into their own dedicated premium page.</p>
          <button
            onClick={() => navigate('/roadmap')}
            className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            Go to Career Roadmap
          </button>
        </div>
      )}

    </div>
  );
}
