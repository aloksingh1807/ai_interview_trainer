import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Laptop, Check, Sparkles, RefreshCw, ChevronRight, BookOpen, 
  Map, Award, Cpu, BookOpenCheck, Database, Terminal, ArrowRight
} from 'lucide-react';
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

export default function Roadmap() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Safe role parser to prevent undefined / null displays
  const getSafeRole = (role) => {
    if (!role || role === "undefined" || role === "null" || role.trim() === "") {
      return "Software Engineer";
    }
    // Normalize ML/Machine Learning roles to "Machine Learning Engineer" matching our CAREER_PATHS array
    if (role === "ML Engineer" || role === "Machine Learning") {
      return "Machine Learning Engineer";
    }
    return role;
  };

  // Read user context safely
  const [selectedRole, setSelectedRole] = useState(() => {
    return getSafeRole(localStorage.getItem("userRole"));
  });

  const [completedNodes, setCompletedNodes] = useState({});
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState('');

  // Mock score fallback metrics
  const mockAtsScore = 78;
  const mockBestScore = 82;

  // Verify authentication state
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Load user pipeline states
  useEffect(() => {
    const storedNodes = localStorage.getItem(`roadmap_pipeline_nodes_${selectedRole}`);
    if (storedNodes) {
      try {
        setCompletedNodes(JSON.parse(storedNodes));
      } catch (e) {
        setCompletedNodes({});
      }
    } else {
      // Seed default completed nodes
      const seed = { python: true, ds: true };
      setCompletedNodes(seed);
      localStorage.setItem(`roadmap_pipeline_nodes_${selectedRole}`, JSON.stringify(seed));
    }
    
    // Load compiled roadmap if existing
    const storedRoadmap = localStorage.getItem(`roadmap_compiled_${selectedRole}`);
    if (storedRoadmap) {
      try {
        setRoadmap(JSON.parse(storedRoadmap));
      } catch (e) {
        setRoadmap(null);
      }
    }
  }, [selectedRole]);

  // Toggle skill node completion state
  const togglePipelineNode = (nodeId) => {
    const next = { ...completedNodes, [nodeId]: !completedNodes[nodeId] };
    setCompletedNodes(next);
    localStorage.setItem(`roadmap_pipeline_nodes_${selectedRole}`, JSON.stringify(next));
  };

  // Compile mastery percentages
  const completedCount = Object.values(completedNodes).filter(Boolean).length;
  const nodesPercentage = Math.round((completedCount / PIPELINE_NODES.length) * 100);

  // Switch Target Career Path
  const handleSelectPath = (roleTitle) => {
    const safeRole = getSafeRole(roleTitle);
    setSelectedRole(safeRole);
    localStorage.setItem("userRole", safeRole);
  };

  // Compile Dynamic 4-Week Career Roadmap from Flask backend
  const fetchRoadmap = async (forceRegenerate = false) => {
    if (roadmap && !forceRegenerate) return;
    setRoadmapLoading(true);
    setRoadmapError('');

    try {
      const res = await axios.post('/api/roadmap/generate', {
        role: selectedRole,
        skills: localStorage.getItem("userSkills") || "React, Python, SQL"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRoadmap(res.data);
      localStorage.setItem(`roadmap_compiled_${selectedRole}`, JSON.stringify(res.data));
    } catch (err) {
      setRoadmapError(err.response?.data?.error || "Failed to generate preparation roadmap. Ensure backend is active.");
    } finally {
      setRoadmapLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-borderColor">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accentPrimary">
            <Map className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Candidate Compass</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-textPrimary leading-none">
            AI Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary max-w-xl">
            Select specialized career paths, toggle mastery milestone nodes, and compile a deep 4-week roadmap designed to optimize your simulated metrics.
          </p>
        </div>

        <MagneticButton
          onClick={() => navigate('/dashboard')}
          className="bg-bgSecondary hover:bg-bgPrimary border border-borderColor text-textPrimary px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
        >
          Return to Dashboard
        </MagneticButton>
      </div>

      {/* Career Track selector */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Laptop className="w-5 h-5 text-accentPrimary" />
          <h3 className="font-heading font-extrabold text-base text-textPrimary">
            Choose a Specialized Career Path
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CAREER_PATHS.map((path) => (
            <div
              key={path.id}
              onClick={() => handleSelectPath(path.title)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between h-40 text-left select-none relative group overflow-hidden ${selectedRole === path.title ? 'bg-bgSecondary border-accentPrimary shadow-lg scale-105' : 'bg-bgCard border-borderColor opacity-70 hover:opacity-100'}`}
            >
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${path.color} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity`} />
              <div>
                <span className="text-[8px] font-black text-accentSecondary uppercase tracking-widest block mb-1">{path.salary}</span>
                <h4 className="text-xs font-black text-textPrimary leading-tight group-hover:text-accentPrimary transition-colors">{path.title}</h4>
                <p className="text-[9.5px] text-textSecondary leading-normal mt-1.5 max-h-16 overflow-hidden">{path.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {path.skills.slice(0, 2).map((sk, idx) => (
                  <span key={idx} className="text-[7.5px] font-extrabold bg-bgPrimary px-1.5 py-0.5 rounded border border-borderColor text-textSecondary">{sk}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progression Pipeline & Central Mastery Index */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Visual 9-Node Roadmap Thread (Col 8) */}
        <div className="lg:col-span-8 glass-panel bg-bgCard border-borderColor rounded-3xl p-7 shadow-md flex flex-col justify-between">
          <div className="border-b border-borderColor pb-3.5 mb-6">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary block">Learning Pipeline</span>
            <h3 className="font-heading font-black text-base text-textPrimary mt-1">Interactive Progression Pipeline</h3>
          </div>

          {/* Connected Pipeline Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {PIPELINE_NODES.map((node, index) => {
              const isCompleted = !!completedNodes[node.id];
              return (
                <div key={node.id} className="relative">
                  <div
                    onClick={() => togglePipelineNode(node.id)}
                    className={`p-4.5 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between h-24 select-none group relative ${isCompleted ? 'bg-bgSecondary border-green-500/40 text-textSecondary shadow-md' : 'bg-bgPrimary border-borderColor text-textSecondary hover:border-accentPrimary'}`}
                  >
                    {/* Status Check badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${node.level === 'Expert' ? 'bg-red-500/10 text-red-400' : node.level === 'Advanced' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {node.level}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isCompleted ? 'bg-green-500 border-green-500 text-bgSecondary shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'border-zinc-700 bg-transparent'}`}>
                        {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] font-extrabold text-textSecondary uppercase tracking-wider block">Node 0{index + 1}</span>
                      <h4 className="text-[11.5px] font-black text-textPrimary leading-none mt-1 group-hover:text-accentPrimary transition-colors">{node.label}</h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-borderColor pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-textSecondary font-semibold">
            <span>💡 Click on any pipeline node card to toggle its skill mastery state.</span>
            <span className="font-bold text-textPrimary">Completing nodes raises your simulated Alok benchmark rating.</span>
          </div>
        </div>

        {/* Central Progress Ring & Recommendations (Col 4) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          
          {/* Dynamic Skill Progression Dial */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 flex flex-col items-center text-center justify-center shadow-lg relative overflow-hidden group flex-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
            <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary mb-6">Pipeline Mastery Index</h4>
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="rgba(31,41,55,0.4)" strokeWidth="6" fill="transparent" />
                <motion.circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="#22C55E"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 60}
                  initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - nodesPercentage / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-heading font-black text-3xl text-textPrimary">{nodesPercentage}%</span>
                <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-textSecondary mt-0.5">Mastery</span>
              </div>
            </div>

            <span className="text-[10px] text-textSecondary mt-6 max-w-[210px] font-semibold leading-relaxed">
              {nodesPercentage >= 70 ? "🚀 Superior tech stack coverage! Alok lists your resume as highly competitive." : "📈 Stable core progress. Click additional progression milestones."}
            </span>
          </div>

          {/* Dynamic AI recommendations based on metrics */}
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-textPrimary tracking-widest">Alok Automated Guidance</span>
              </div>
              <p className="text-[10.5px] font-semibold text-textSecondary leading-relaxed">
                Based on your active resume review benchmarks (ATS Score: **{mockAtsScore}%**) and peak coding scores (**{mockBestScore}%**), Alok recommends training on **Deep Learning** and **Deployment** nodes next.
              </p>
            </div>
            <div className="border-t border-borderColor pt-3 mt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-textSecondary">
              <span>ATS Target Index: 85%</span>
              <span className="text-accentPrimary font-bold">Level Optimized</span>
            </div>
          </div>

        </div>

      </div>

      {/* Week-by-week dynamic AI compiled checklist */}
      <div className="space-y-6">
        
        {/* Header and compile controls */}
        <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h3 className="font-heading font-extrabold text-base text-textPrimary">
                Personalized 4-Week Career Blueprint
              </h3>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary bg-bgSecondary border border-borderColor px-2.5 py-0.5 rounded-full inline-block w-fit mx-auto md:mx-0">
                {selectedRole} Focus
              </span>
            </div>
            <p className="text-xs text-textSecondary max-w-xl">
              A custom-curated roadmap generated specifically around your targets. Complete theories and challenges to optimize your scoring.
            </p>
          </div>

          <button
            onClick={() => fetchRoadmap(true)}
            disabled={roadmapLoading}
            className="flex items-center gap-2 bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shrink-0 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${roadmapLoading ? 'animate-spin' : ''}`} />
            {roadmapLoading ? "Compiling..." : "Regenerate Blueprint"}
          </button>
        </div>

        {/* Roadmap weeks list */}
        {roadmapLoading ? (
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-accentPrimary animate-spin" />
            <h3 className="font-heading font-extrabold text-textPrimary">Compiling Career Blueprint...</h3>
            <p className="text-xs text-textSecondary max-w-xs">Generating highly tailored prep pipelines. This will take just a few seconds.</p>
          </div>
        ) : roadmapError ? (
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-textPrimary text-sm">Failed to Retrieve Roadmap</h3>
            <p className="text-xs text-textSecondary max-w-md">{roadmapError}</p>
            <button
              onClick={() => fetchRoadmap(true)}
              className="px-4.5 py-2 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary text-[10px] font-bold uppercase tracking-wider hover:border-accentPrimary transition-all cursor-pointer"
            >
              Retry Compilation
            </button>
          </div>
        ) : (roadmap && Array.isArray(roadmap.weeks)) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.weeks.map((wk, wkIdx) => (
              <div key={wkIdx} className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-borderColor">
                    <span className="text-[10px] font-black uppercase text-accentSecondary tracking-widest">
                      Week 0{wkIdx + 1}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase text-textSecondary bg-bgSecondary px-2.5 py-1 rounded-full border border-borderColor">
                      {wk.milestone || `Milestone ${wkIdx + 1}`}
                    </span>
                  </div>
                  
                  <div className="space-y-3.5 pt-4">
                    <div>
                      <h4 className="text-[10px] font-black text-textPrimary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-accentPrimary" />
                        Core Focus Topics
                      </h4>
                      <p className="text-xs text-textSecondary leading-relaxed bg-bgPrimary/50 p-3 rounded-xl border border-borderColor">
                        {wk.topic || wk.focus || "Explore foundational architectural concepts and skill points."}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-textPrimary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-accentSecondary" />
                        Practical Challenges
                      </h4>
                      <p className="text-xs text-textSecondary leading-relaxed bg-bgPrimary/50 p-3 rounded-xl border border-borderColor">
                        {wk.challenge || "Solve custom coding challenges inside the doubt partner."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-borderColor pt-4 mt-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-textSecondary">
                  <span>Duration: 7 Days</span>
                  <button 
                    onClick={() => navigate('/preparation')}
                    className="flex items-center gap-1 text-accentPrimary hover:gap-1.5 transition-all"
                  >
                    Solve Inside Hub <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-md">
            <div className="w-16 h-16 rounded-full bg-accentPrimary/10 border border-accentPrimary/30 flex items-center justify-center text-accentPrimary">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-black text-base text-textPrimary">No Roadmap Compiled</h3>
            <p className="text-xs text-textSecondary max-w-sm">You haven't compiled a career blueprint for this target role. Compile one now to get started.</p>
            <button
              onClick={() => fetchRoadmap()}
              className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Compile Career Roadmap
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
