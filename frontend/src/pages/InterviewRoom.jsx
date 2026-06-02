import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, Square, Sparkles, Send, Check, Info, AlertTriangle, Code, Play, Terminal, HelpCircle, ChevronRight, Award } from 'lucide-react';
import Editor from '@monaco-editor/react';
import Avatar from '../components/Avatar';
import MagneticButton from '../components/MagneticButton';

const CODING_TEMPLATES = {
  "Software Engineer": {
    title: "Two Sum Target Indices",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nInput: `nums = [2, 7, 11, 15]`, `target = 9`\nOutput: `[0, 1]`",
    python: "def twoSum(nums, target):\n    # Write your O(N) linear time code here\n    hash_map = {}\n    for idx, num in enumerate(nums):\n        complement = target - num\n        if complement in hash_map:\n            return [hash_map[complement], idx]\n        hash_map[num] = idx\n    return []\n\n# Dynamic local test run print execution:\nprint(twoSum([2, 7, 11, 15], 9))\n",
    javascript: "function twoSum(nums, target) {\n    // Write your O(N) linear time code here\n    const map = {};\n    for (let idx = 0; idx < nums.length; idx++) {\n        const complement = target - nums[idx];\n        if (map[complement] !== undefined) {\n            return [map[complement], idx];\n        }\n        map[nums[idx]] = idx;\n    }\n    return [];\n}\n\n// Dynamic local test run print execution:\nconsole.log(twoSum([2, 7, 11, 15], 9));\n"
  },
  "Full Stack Developer": {
    title: "Nested Objects Deep Clone",
    description: "Write an optimized algorithm to deep clone any given nested object structure. Do not use JSON.parse(JSON.stringify(obj)) to ensure high-performance execution of buffers and functions.\n\nInput: `{ a: 1, b: { c: 2 } }`\nOutput: Deep copied object reference",
    python: "import copy\ndef deepClone(obj):\n    # Write your deep clone method here\n    return copy.deepcopy(obj)\n\nprint(deepClone({'a': 1, 'b': {'c': 2}}))\n",
    javascript: "function deepClone(obj) {\n    // Write your recursive deep clone algorithm here\n    if (obj === null || typeof obj !== 'object') return obj;\n    if (Array.isArray(obj)) return obj.map(deepClone);\n    const cloned = {};\n    for (const key in obj) {\n        if (obj.hasOwnProperty(key)) {\n            cloned[key] = deepClone(obj[key]);\n        }\n    }\n    return cloned;\n}\n\nconsole.log(deepClone({ a: 1, b: { c: 2 } }));\n"
  },
  "AI Engineer": {
    title: "Dot Product of Sparse Tensors",
    description: "Given two high-dimensional vectors, compute their dot product efficiently without traversing zeros.\n\nInput: `nums1 = [1, 0, 0, 2, 3]`, `nums2 = [0, 3, 0, 4, 0]`\nOutput: `8` (since 2 * 4 = 8)",
    python: "class SparseVector:\n    def __init__(self, nums):\n        # Keep non-zero values in a dict mapping index to value\n        self.data = {idx: val for idx, val in enumerate(nums) if val != 0}\n        \n    def dotProduct(self, vec):\n        result = 0\n        # Traverse the smaller dict for maximum O(K) efficiency\n        for idx in self.data:\n            if idx in vec.data:\n                result += self.data[idx] * vec.data[idx]\n        return result\n\nv1 = SparseVector([1, 0, 0, 2, 3])\nv2 = SparseVector([0, 3, 0, 4, 0])\nprint(v1.dotProduct(v2))\n",
    javascript: "class SparseVector {\n    constructor(nums) {\n        this.data = {};\n        nums.forEach((val, idx) => {\n            if (val !== 0) this.data[idx] = val;\n        });\n    }\n    \n    dotProduct(vec) {\n        let result = 0;\n        for (const idx in this.data) {\n            if (vec.data[idx] !== undefined) {\n                result += this.data[idx] * vec.data[idx];\n            }\n        }\n        return result;\n    }\n}\n\nconst v1 = new SparseVector([1, 0, 0, 2, 3]);\nconst v2 = new SparseVector([0, 3, 0, 4, 0]);\nconsole.log(v1.dotProduct(v2));\n"
  },
  "Frontend Engineer": {
    title: "Interactive Array Prototype Last",
    description: "Write code that enhances all arrays such that you can call the `array.last()` method on any array and it will return the last element. If there are no elements in the array, it should return `-1`.\n\nInput: `[1, 2, 3].last()`\nOutput: `3`",
    python: "class CustomArray(list):\n    def last(self):\n        return self[-1] if self else -1\n\narr = CustomArray([1, 2, 3])\nprint(arr.last())\n",
    javascript: "Array.prototype.last = function() {\n    // Write array extension\n    return this.length > 0 ? this[this.length - 1] : -1;\n};\n\nconsole.log([1, 2, 3].last());\n"
  },
  "Data Scientist": {
    title: "Simple Gradient Descent Steps",
    description: "Implement a single gradient descent step for linear regression to calculate updated slope weights `m` and intercept weight `c` given inputs `X`, labels `y`, learning rate `alpha`, and current values.\n\nOutput: `m_new, c_new` parameters.",
    python: "def gd_step(X, y, m, c, alpha):\n    N = len(X)\n    m_grad = 0\n    c_grad = 0\n    for idx in range(N):\n        prediction = m * X[idx] + c\n        error = prediction - y[idx]\n        m_grad += error * X[idx]\n        c_grad += error\n        \n    m_new = m - alpha * (2/N) * m_grad\n    c_new = c - alpha * (2/N) * c_grad\n    return m_new, c_new\n\nprint(gd_step([1, 2, 3], [2, 4, 6], 0.5, 0.5, 0.01))\n",
    javascript: "function gdStep(X, y, m, c, alpha) {\n    const N = X.length;\n    let m_grad = 0;\n    let c_grad = 0;\n    for (let idx = 0; idx < N; idx++) {\n        const prediction = m * X[idx] + c;\n        const error = prediction - y[idx];\n        m_grad += error * X[idx];\n        c_grad += error;\n    }\n    const m_new = m - alpha * (2/N) * m_grad;\n    const c_new = c - alpha * (2/N) * c_grad;\n    return [m_new, c_new];\n}\n\nconsole.log(gdStep([1, 2, 3], [2, 4, 6], 0.5, 0.5, 0.01));\n"
  },
  "DevOps Engineer": {
    title: "Production Log Parse Filter",
    description: "Write a high-performance script to parse a web server access log, filter all HTTP status codes indicating internal failure (`500`), and aggregate error occurrences by their endpoint URI.\n\nOutput: Dict/Object grouping URLs to counts.",
    python: "def parse_logs(log_lines):\n    error_counts = {}\n    for line in log_lines:\n        if ' 500 ' in line:\n            parts = line.split()\n            if len(parts) > 6:\n                url = parts[6]\n                error_counts[url] = error_counts.get(url, 0) + 1\n    return error_counts\n\nprint(parse_logs([\n    '127.0.0.1 - - [02/Jun/2026] \"GET /api/dashboard HTTP/1.1\" 200 4588',\n    '127.0.0.1 - - [02/Jun/2026] \"POST /api/code/run HTTP/1.1\" 500 1205'\n]))\n",
    javascript: "function parseLogs(logLines) {\n    const counts = {};\n    logLines.forEach(line => {\n        if (line.includes(' 500 ')) {\n            const parts = line.split(' ');\n            if (parts.length > 6) {\n                const url = parts[6];\n                counts[url] = (counts[url] || 0) + 1;\n            }\n        }\n    });\n    return counts;\n}\n\nconsole.log(parseLogs([\n    '127.0.0.1 - - [02/Jun/2026] \"GET /api/dashboard HTTP/1.1\" 200 4588',\n    '127.0.0.1 - - [02/Jun/2026] \"POST /api/code/run HTTP/1.1\" 500 1205'\n]));\n"
  },
  "Product Manager": {
    title: "Agile RICE Prioritizer Matrix",
    description: "Calculate features prioritized lists based on descending RICE metric inputs: `Reach * Impact * Confidence / Effort`.\n\nInput: `[{ name: 'A', r: 100, i: 2, c: 0.8, e: 4 }]`\nOutput: Sorted array features.",
    python: "def prioritize(features):\n    for f in features:\n        f['rice'] = (f['r'] * f['i'] * f['c']) / f['e']\n    return sorted(features, key=lambda x: x['rice'], reverse=True)\n\nprint(prioritize([\n    {'name': 'Feature A', 'r': 100, 'i': 2, 'c': 0.8, 'e': 4},\n    {'name': 'Feature B', 'r': 500, 'i': 1.5, 'c': 0.9, 'e': 10}\n]))\n",
    javascript: "function prioritize(features) {\n    features.forEach(f => {\n        f.rice = (f.r * f.i * f.c) / f.e;\n    });\n    return features.sort((a, b) => b.rice - a.rice);\n}\n\nconsole.log(prioritize([\n    {name: 'Feature A', r: 100, i: 2, c: 0.8, e: 4},\n    {name: 'Feature B', r: 500, i: 1.5, c: 0.9, e: 10}\n]));\n"
  }
};

export default function InterviewRoom() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup');
  
  // Setup fields
  const [role, setRole] = useState('Software Engineer');
  const [type, setType] = useState('Technical');
  const [level, setLevel] = useState('Intermediate');
  
  // active Mock states
  const [sessionId, setSessionId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  
  // Hardware status
  const [micActive, setMicActive] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Monaco Coding States
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [codeText, setCodeText] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);
  const [codeEvaluation, setCodeEvaluation] = useState(null);

  // References
  const recognitionRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const webcamStreamRef = useRef(null);
  
  const token = localStorage.getItem("token");
  const [themeMode, setThemeMode] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      setThemeMode(currentTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Pre-seed template code when language or role changes
  useEffect(() => {
    const activeTemplate = CODING_TEMPLATES[role] || CODING_TEMPLATES["Software Engineer"];
    if (activeTemplate) {
      setCodeText(codeLanguage === 'python' ? activeTemplate.python : activeTemplate.javascript);
    }
  }, [role, codeLanguage]);

  // Alok TTS synthesized speech
  const speakQuestion = useCallback((text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Male") || v.lang.startsWith("en-US"));
    if (targetVoice) utterance.voice = targetVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Vocal STT transcribed voice loop
  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript + ' ';
        } else {
          interimStr += event.results[i][0].transcript;
        }
      }

      if (finalStr) {
        setAnswer(prev => prev + finalStr);
      }
      setInterimTranscript(interimStr);
    };

    rec.onerror = (e) => {
      console.error("Speech Recognition Error: ", e);
      setMicActive(false);
    };

    rec.onend = () => {
      if (micActive) {
        try { rec.start(); } catch (err) { console.error(err); }
      }
    };

    recognitionRef.current = rec;
  }, [micActive]);

  // Webcam stream toggle
  const toggleWebcam = async () => {
    if (camActive) {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
        webcamStreamRef.current = null;
      }
      setCamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 }, audio: false });
        webcamStreamRef.current = stream;
        setCamActive(true);
        if (webcamVideoRef.current) {
          webcamVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera Access Denied: ", err);
      }
    }
  };

  // Microphone toggle
  const toggleMicrophone = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Speech synthesis is unavailable.");
      return;
    }

    if (micActive) {
      rec.stop();
      setMicActive(false);
      setInterimTranscript('');
    } else {
      try {
        rec.start();
        setMicActive(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Start interview API
  const handleStartInterview = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post('/api/interview/start', 
        { role, type, level }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSessionId(res.data.session_id);
      setQuestion(res.data.first_question);
      setPhase('active');
      speakQuestion(res.data.first_question);
      
      setTimeout(() => toggleWebcam(), 300);
      
    } catch (err) {
      console.error("Start interview request error: ", err);
    }
  };

  // Submit Answer API
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    const finalAnswer = answer + (interimTranscript ? ' ' + interimTranscript : '');
    
    if (micActive && recognitionRef.current) {
      recognitionRef.current.stop();
      setMicActive(false);
    }
    setInterimTranscript('');
    
    try {
      const res = await axios.post('/api/interview/answer', 
        { session_id: sessionId, answer: finalAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAnswer('');
      setEvaluation(res.data);
      
      if (res.data.is_complete) {
        setPhase('complete');
        window.speechSynthesis.cancel();
      } else {
        setQuestion(res.data.next_question);
        speakQuestion(res.data.next_question);
      }
      
    } catch (err) {
      console.error("Answer submission failed", err);
    }
  };

  // Execute Code Sandbox on Backend
  const handleRunCode = async () => {
    if (!codeText.trim()) return;
    setCodeLoading(true);
    setTerminalOutput('');
    try {
      const res = await axios.post('/api/code/run',
        { code: codeText, language: codeLanguage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.stderr) {
        setTerminalOutput(`❌ ERROR:\n${res.data.stderr}`);
      } else {
        setTerminalOutput(`✨ SUCCESSFUL RUN:\n${res.data.stdout}`);
      }
    } catch (err) {
      setTerminalOutput(`❌ RUNTIME CRASH:\n${err.response?.data?.error || "Sandbox offline."}`);
    } finally {
      setCodeLoading(false);
    }
  };

  // Submit Monaco Code to Alok Evaluator
  const handleSubmitCode = async () => {
    if (!codeText.trim()) return;
    setEvalLoading(true);
    setCodeEvaluation(null);
    try {
      const activeTemplate = CODING_TEMPLATES[role] || CODING_TEMPLATES["Software Engineer"];
      const res = await axios.post('/api/code/evaluate',
        { 
          code: codeText, 
          language: codeLanguage, 
          problem_title: activeTemplate.title,
          role: role
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCodeEvaluation(res.data);
    } catch (err) {
      alert("Failed to submit code for AI evaluation.");
    } finally {
      setEvalLoading(false);
    }
  };

  // Fetch hint blueprint
  const handleRequestHint = async () => {
    try {
      const res = await axios.post('/api/interview/hint', 
        { session_id: sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`💡 Prompt Structure Blueprint:\n\n${res.data.hint}`);
    } catch (err) {
      console.error("Failed to fetch hints", err);
    }
  };

  // Force close session
  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end this interview session? Your progress will be recorded.")) {
      setPhase('complete');
      window.speechSynthesis.cancel();
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      window.speechSynthesis.cancel();
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [initializeSpeechRecognition]);

  // Bind the camera stream to the video DOM element once it renders
  useEffect(() => {
    if (phase === 'active' && camActive && webcamStreamRef.current && webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = webcamStreamRef.current;
    }
  }, [phase, camActive]);

  const activeProblem = CODING_TEMPLATES[role] || CODING_TEMPLATES["Software Engineer"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[calc(100vh-100px)] flex flex-col justify-between bg-transparent text-textSecondary">
      
      {/* PHASE 1: SETUP SCREEN */}
      {phase === 'setup' && (
        <div className="max-w-xl mx-auto w-full glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8 my-auto">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-textSecondary bg-bgSecondary border border-borderColor px-3.5 py-2 rounded-full shadow-inner">
              Simulator Setups
            </span>
            <h2 className="font-heading font-black text-2xl mt-5 text-textPrimary">
              Configure Mock Simulator
            </h2>
            <p className="text-xs text-textSecondary mt-1.5">
              Select targets below to generate a tailored interview stack.
            </p>
          </div>

          <div className="space-y-4.5 text-left">
            {/* Target Role */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-textSecondary uppercase tracking-widest">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary text-xs text-textPrimary font-bold"
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

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-textSecondary uppercase tracking-widest">
                Mock Focus Sector
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary text-xs text-textPrimary font-bold"
              >
                <option value="Technical">Technical (Coding & System design)</option>
                <option value="HR">HR / Leadership Principles</option>
                <option value="Behavioral">Behavioral (STAR Method)</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-textSecondary uppercase tracking-widest">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider cursor-pointer ${
                      level === lvl 
                        ? 'bg-textPrimary border-textPrimary text-bgPrimary shadow-sm' 
                        : 'bg-bgSecondary border-borderColor text-textSecondary hover:bg-bgPrimary hover:border-accentPrimary'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <MagneticButton
            onClick={handleStartInterview}
            className="w-full bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
          >
            Initialize Face-To-Face Room
          </MagneticButton>
        </div>
      )}

      {/* PHASE 2: ACTIVE INTERVIEW SCREEN */}
      {phase === 'active' && (
        <div className="space-y-8 my-auto">
          {/* Header dashboard controls */}
          <div className="flex justify-between items-center bg-bgSecondary/60 p-4 rounded-2xl glass-panel border-borderColor">
            <div>
              <span className="text-[9px] font-black text-accentPrimary uppercase tracking-widest bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-1 rounded-full">
                Active Mock Cockpit
              </span>
              <h2 className="text-xs font-bold text-textPrimary mt-2.5">{role} Mock Interview ({type})</h2>
            </div>
            <button
              onClick={handleEndInterview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              Close Session
            </button>
          </div>

          {/* DUAL WORKSPACE: TECHNICAL OR STANDARD */}
          {type === 'Technical' ? (
            
            // --- ULTIMATE SPLITSCREEN WORKSPACE (Left Feed, Right Monaco Editor) ---
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Recruiter Feed & Speech Panels (Col 4) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Visual Avatar Feed panel */}
                <div className="flex flex-col items-center justify-center p-6 bg-bgCard border border-borderColor rounded-3xl min-h-[300px] shadow-lg relative overflow-hidden">
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-bgSecondary/80 border border-borderColor px-3 py-1 rounded-full z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-accentPrimary animate-ping" />
                    <span className="text-[8px] font-black text-textPrimary tracking-widest uppercase">Alok Feed</span>
                  </div>
                  
                  <div className="scale-75 origin-center">
                    <Avatar isSpeaking={isSpeaking} isListening={micActive} />
                  </div>

                  {/* Speaks Waveform Voice Activity Visualizer */}
                  {isSpeaking && (
                    <div className="flex justify-center items-end gap-1 h-6 w-full mt-3">
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <div 
                           key={bar}
                           className="w-1 bg-accentPrimary rounded-full wave-visualizer-bar" 
                           style={{ 
                             height: `${Math.random() * 80 + 20}%`,
                             animationDelay: `${bar * 0.1}s` 
                           }} 
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Candidate camera stream */}
                <div className="flex flex-col items-center justify-center bg-bgCard border border-borderColor rounded-3xl min-h-[220px] relative overflow-hidden shadow-2xl">
                  {camActive ? (
                    <video
                      ref={webcamVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover min-h-[220px] max-h-[220px]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
                      <div className="w-9 h-9 rounded-full bg-bgSecondary border border-borderColor flex items-center justify-center text-textSecondary animate-pulse">
                        <VideoOff className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-textSecondary">Camera Feed Blocked</span>
                    </div>
                  )}

                  {/* Floating indicators */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/5">
                    <span className={`w-1 h-1 rounded-full ${camActive ? 'bg-green-400' : 'bg-red-500'}`} />
                    <span className="text-[7.5px] font-bold text-white uppercase tracking-wider">
                      {camActive ? 'LIVE' : 'BLOCKED'}
                    </span>
                  </div>

                  {micActive && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-accentPrimary backdrop-blur-md px-2.5 py-1 rounded-full border border-accentPrimary/20 shadow-md">
                      <span className="text-[7.5px] font-black text-white uppercase tracking-widest">Listening</span>
                    </div>
                  )}
                </div>

                {/* Question Dialog and audio controls */}
                <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-5 shadow-md space-y-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-textSecondary uppercase tracking-widest block">Question</span>
                    <p className="text-xs font-bold text-textPrimary leading-relaxed">{question}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={toggleMicrophone}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${micActive ? 'bg-accentPrimary border-accentPrimary text-white pulse-glow-ring' : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'}`}
                    >
                      {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                      {micActive ? 'Mic On' : 'Mic Off'}
                    </button>
                    <button
                      onClick={handleRequestHint}
                      className="px-3 rounded-xl bg-bgSecondary border border-borderColor hover:border-accentPrimary text-textPrimary cursor-pointer"
                      title="Request structural hint"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Premium Monaco Code Editor Sandbox (Col 8) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Problem Specs header card */}
                <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-borderColor pb-2">
                    <span className="text-[9px] font-black text-textSecondary uppercase tracking-widest flex items-center gap-1">
                      <Code className="w-3.5 h-3.5 text-accentPrimary" />
                      Active Coding Problem
                    </span>
                    <span className="text-[9px] font-black text-textPrimary bg-bgSecondary px-2.5 py-1 rounded border border-borderColor">
                      Target: {activeProblem.title}
                    </span>
                  </div>
                  <p className="text-[11.5px] font-semibold text-textSecondary leading-relaxed whitespace-pre-line bg-bgPrimary/60 p-3.5 border border-borderColor rounded-2xl shadow-inner">
                    {activeProblem.description}
                  </p>
                </div>

                {/* Editor container card */}
                <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-textSecondary">Monaco Sandbox Terminal</span>
                    
                    {/* Language Switcher dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[8.5px] font-black text-textSecondary uppercase">Language:</span>
                      <select
                        value={codeLanguage}
                        onChange={(e) => setCodeLanguage(e.target.value)}
                        className="px-2.5 py-1 rounded bg-bgSecondary border border-borderColor text-[10px] text-textPrimary font-black cursor-pointer focus:outline-none"
                      >
                        <option value="python">Python 3</option>
                        <option value="javascript">JavaScript ES6</option>
                      </select>
                    </div>
                  </div>

                  {/* The Monaco Editor */}
                  <div className="rounded-2xl overflow-hidden border border-borderColor bg-[#1e1e1e]">
                    <Editor
                      height="340px"
                      language={codeLanguage}
                      value={codeText}
                      theme={themeMode === 'light' ? 'light' : 'vs-dark'}
                      onChange={(val) => setCodeText(val || '')}
                      options={{
                        fontSize: 12,
                        minimap: { enabled: false },
                        scrollbar: { verticalScrollbarSize: 6 },
                        padding: { top: 12, bottom: 12 },
                        autoIndent: 'advanced'
                      }}
                    />
                  </div>

                  {/* Custom Action Group Buttons */}
                  <div className="flex gap-4">
                    <MagneticButton
                      onClick={handleRunCode}
                      disabled={codeLoading}
                      className="bg-bgSecondary text-textPrimary border border-borderColor hover:border-accentPrimary hover:bg-bgPrimary flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5 fill-current text-accentPrimary" />
                      {codeLoading ? 'Compiling...' : 'Run Code'}
                    </MagneticButton>
                    <MagneticButton
                      onClick={handleSubmitCode}
                      disabled={evalLoading}
                      className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {evalLoading ? 'Evaluating...' : 'Submit Solution'}
                    </MagneticButton>
                  </div>
                </div>

                {/* Output Terminal Console & AI feedback card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Local Run Terminal Output */}
                  <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-5 shadow-md flex flex-col h-[200px]">
                    <span className="text-[8.5px] font-black uppercase tracking-widest text-textSecondary mb-2 flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-textSecondary" />
                      Stdout Output Stream
                    </span>
                    <div className="flex-1 rounded-xl bg-bgSecondary border border-borderColor p-3 overflow-y-auto shadow-inner text-left">
                      {terminalOutput ? (
                        <pre className="text-[10px] font-mono text-textPrimary leading-normal font-semibold whitespace-pre-wrap">
                          {terminalOutput}
                        </pre>
                      ) : (
                        <span className="text-[9.5px] text-textSecondary font-semibold italic">Console outputs will load here. Click 'Run Code' above.</span>
                      )}
                    </div>
                  </div>

                  {/* AI Evaluation Assessment Scorecard */}
                  <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-5 shadow-md flex flex-col h-[200px]">
                    <span className="text-[8.5px] font-black uppercase tracking-widest text-textSecondary mb-2 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-accentPrimary animate-pulse" />
                      Interviewer Assessment Scorecard
                    </span>
                    <div className="flex-1 rounded-xl bg-bgSecondary border border-borderColor p-3.5 overflow-y-auto shadow-inner text-left space-y-2">
                      {codeEvaluation ? (
                        <>
                          <div className="flex justify-between items-center border-b border-borderColor pb-1.5">
                            <span className="text-[9.5px] font-black text-textPrimary uppercase">{codeEvaluation.complexity}</span>
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${codeEvaluation.is_optimal ? 'bg-green-500/10 text-green-400 border border-green-500/25' : 'bg-orange-500/10 text-orange-400 border border-orange-500/25'}`}>
                              {codeEvaluation.is_optimal ? 'Optimal' : 'Needs Optimization'}
                            </span>
                          </div>
                          <p className="text-[9.5px] font-semibold text-textSecondary leading-relaxed">{codeEvaluation.feedback}</p>
                          {Array.isArray(codeEvaluation.suggestions) && (
                            <ul className="text-[9px] font-black text-textSecondary space-y-1">
                              {codeEvaluation.suggestions.map((s, idx) => <li key={idx}>💡 {s}</li>)}
                            </ul>
                          )}
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-center">
                          <span className="text-[9.5px] text-textSecondary font-semibold italic">Submit solution to get evaluations & Alok tips.</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            
            // --- STANDARD CONVERSATIONAL MOCK SCREEN (HR / Behavioral Mode) ---
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Holographic Alok avatar panel (left) */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-bgCard border border-borderColor rounded-3xl min-h-[380px] shadow-lg relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-bgSecondary border border-borderColor px-3 py-1 z-10 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-accentPrimary animate-ping" />
                  <span className="text-[8px] font-bold text-textPrimary tracking-widest uppercase">
                    Feed 1: Alok AI
                  </span>
                </div>
                <Avatar isSpeaking={isSpeaking} isListening={micActive} />
              </div>

              {/* Candidate camera stream (right) */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center bg-bgCard border border-borderColor rounded-3xl min-h-[380px] relative overflow-hidden shadow-2xl">
                {camActive ? (
                  <video
                    ref={webcamVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover min-h-[380px] max-h-[380px]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-3.5">
                    <div className="w-12 h-12 rounded-full bg-bgSecondary border border-borderColor flex items-center justify-center text-textSecondary animate-pulse">
                      <VideoOff className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary">Camera Feed Blocked</span>
                    <p className="text-xs text-textSecondary max-w-xs leading-relaxed">
                      Activate camera switches below to establish physical mock presence inside the simulator cockpit.
                    </p>
                  </div>
                )}

                {/* Float badge indicators */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-bgSecondary/85 backdrop-blur-md px-3 py-1 rounded-full border border-borderColor">
                  <span className={`w-1.5 h-1.5 rounded-full ${camActive ? 'bg-green-400' : 'bg-red-500'}`} />
                  <span className="text-[8px] font-bold text-textPrimary uppercase tracking-wider">
                    {camActive ? 'Camera Active' : 'Camera Blocked'}
                  </span>
                </div>

                {micActive && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-accentPrimary backdrop-blur-md px-3 py-1.5 rounded-full border border-accentPrimary/20 shadow-md">
                    <div className="w-1 h-3 bg-white rounded-full wave-visualizer-bar" />
                    <div className="w-1 h-4 bg-white rounded-full wave-visualizer-bar" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-2 bg-white rounded-full wave-visualizer-bar" style={{ animationDelay: '0.2s' }} />
                    <span className="text-[8px] font-extrabold text-white uppercase tracking-widest ml-1 font-sans">Live transcription</span>
                  </div>
                )}
              </div>

              {/* Speech controls and response panel */}
              <div className="lg:col-span-12 glass-panel bg-bgCard border-borderColor rounded-3xl p-8 shadow-md space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accentPrimary" />
                    Interviewer Question
                  </span>
                  <p className="font-heading font-extrabold text-xl text-textPrimary leading-relaxed">
                    {question}
                  </p>
                </div>

                {/* Speech transcription container */}
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold text-textSecondary uppercase tracking-widest">Candidate Speech (Live Transcript)</span>
                  <div className="min-h-[85px] p-4 border border-borderColor rounded-2xl bg-bgSecondary/60 text-xs font-semibold leading-relaxed text-textSecondary">
                    {answer ? (
                      <p>{answer} <span className="text-accentPrimary animate-pulse">{interimTranscript}</span></p>
                    ) : interimTranscript ? (
                      <p className="text-accentPrimary animate-pulse">{interimTranscript}</p>
                    ) : (
                      <p className="text-textSecondary/60 font-normal">Click the central microphone or type in the console below. Submission requires active text.</p>
                    )}
                  </div>
                </div>

                {/* Consolidated input console */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your response here or speak..."
                    className="flex-1 px-4.5 py-3.5 bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary rounded-2xl text-xs text-textPrimary font-semibold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) handleSubmitAnswer();
                    }}
                  />
                  <MagneticButton
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() && !interimTranscript.trim()}
                    className="bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white px-6 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    Submit Response
                    <Send className="w-4 h-4 ml-2" />
                  </MagneticButton>
                </div>

                {/* Floating actions control bar */}
                <div className="max-w-md mx-auto flex items-center justify-center gap-4 bg-bgSecondary/80 backdrop-blur-md px-6 py-3 rounded-full border border-borderColor shadow-2xl">
                  <button
                    type="button"
                    onClick={toggleWebcam}
                    className={`p-3 rounded-full border transition-colors ${camActive ? 'bg-bgCard border-borderColor text-textPrimary hover:bg-bgPrimary' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                  >
                    {camActive ? <Video className="w-4.5 h-4.5" /> : <VideoOff className="w-4.5 h-4.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMicrophone}
                    className={`p-3.5 rounded-full border transition-all scale-110 ${micActive ? 'bg-accentPrimary border-accentPrimary text-white pulse-glow-ring' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                  >
                    {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestHint}
                    className="p-3 rounded-full bg-bgCard border border-borderColor text-textPrimary hover:bg-bgPrimary"
                  >
                    <Info className="w-4.5 h-4.5" />
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* PHASE 3: INTERVIEW COMPLETE SCREEN */}
      {phase === 'complete' && (
        <div className="max-w-xl mx-auto w-full glass-panel bg-bgCard border-borderColor rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8 my-auto">
          <div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary bg-bgSecondary border border-borderColor px-3 py-1.5 rounded-full">
              Mock Screen Completed
            </span>
            <h2 className="font-heading font-extrabold text-2xl mt-4 text-textPrimary">
              Mock Simulation Complete!
            </h2>
            <p className="text-xs text-textSecondary mt-1.5 leading-relaxed max-w-sm mx-auto">
              Evaluation metrics compiled. Review scorecards below or enter your dashboard.
            </p>
          </div>

          {evaluation && (
            <div className="p-6 rounded-2xl bg-bgSecondary/60 border border-borderColor text-left space-y-4 shadow-inner">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-textSecondary">Evaluation Scorecard</span>
              
              <div className="flex justify-between items-center border-b border-borderColor pb-3">
                <span className="text-xs font-bold text-textPrimary">Overall Readiness Score</span>
                <span className="font-heading font-extrabold text-xl text-accentPrimary">{evaluation.scores?.overall || 75}%</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-textSecondary">
                <div className="flex justify-between p-2 rounded-xl bg-bgCard border border-borderColor">
                  <span className="text-textSecondary/70">Technical</span>
                  <span className="text-textPrimary">{evaluation.scores?.technical || 70}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-bgCard border border-borderColor">
                  <span className="text-textSecondary/70">Communication</span>
                  <span className="text-textPrimary">{evaluation.scores?.communication || 75}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-bgCard border border-borderColor">
                  <span className="text-textSecondary/70">Problem Solving</span>
                  <span className="text-textPrimary">{evaluation.scores?.problem_solving || 70}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-bgCard border border-borderColor">
                  <span className="text-textSecondary/70">Confidence</span>
                  <span className="text-textPrimary">{evaluation.scores?.confidence || 75}%</span>
                </div>
              </div>

              {evaluation.tip && (
                <div className="pt-2">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-textSecondary font-sans">Actionable Recruiter Tip</span>
                  <p className="text-xs font-medium leading-relaxed text-textSecondary bg-accentPrimary/5 border border-accentPrimary/10 p-3 rounded-xl mt-1.5">
                    💡 {evaluation.tip}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <MagneticButton
              onClick={() => setPhase('setup')}
              className="w-full bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Start New Interview Session
            </MagneticButton>
            <MagneticButton
              onClick={() => navigate('/dashboard')}
              className="w-full bg-bgSecondary text-textPrimary border border-borderColor hover:border-accentPrimary hover:bg-bgPrimary py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Go to Cockpit Dashboard
            </MagneticButton>
          </div>
        </div>
      )}

    </div>
  );
}
