import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Sparkles, Printer, RefreshCw, Briefcase, FileSpreadsheet } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

export default function ResumeAtsChecker() {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'text'
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [scanStep, setScanStep] = useState(0); // 0: input, 1: scanning, 2: results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const token = localStorage.getItem("token");

  // HTML5 Drag and Drop Event Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const nameParts = droppedFile.name.split('.');
      const extension = nameParts[nameParts.length - 1].toLowerCase();
      
      if (extension === 'pdf' || extension === 'txt') {
        setFile(droppedFile);
        setError('');
      } else {
        setError("Invalid file format. Please upload an industry-standard PDF or plain TXT document.");
      }
    }
  };

  const triggerScanningSequence = async () => {
    setError('');
    setLoading(true);
    setScanStep(1); // Shift to scanning step

    try {
      let res;
      if (inputMode === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_role', targetRole);

        res = await axios.post('/api/resume/analyze', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        res = await axios.post('/api/resume/analyze', {
          resume_text: resumeText,
          target_role: targetRole
        }, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      setResults(res.data);
      setScanStep(2); // Go to results step

    } catch (err) {
      setError(err.response?.data?.error || "Failed to screen resume. Ensure plain text parser configurations.");
      setScanStep(0); // Rollback to input
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResumeText('');
    setResults(null);
    setScanStep(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 bg-bgPrimary text-textSecondary print:p-0 print:m-0 print:bg-white print:text-black transition-colors duration-300">
      
      {/* Top Banner Header */}
      <div className="print:hidden">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary bg-bgSecondary border border-borderColor px-3 py-1.5 rounded-full">
          Screening Cockpit
        </span>
        <h1 className="font-heading font-extrabold text-3xl text-textPrimary mt-3.5">
          Enterprise ATS Resume Screener
        </h1>
        <p className="text-xs text-textSecondary mt-1">
          Scan your CV formatting and keywords matching corporate recruitment filters used by high-performance organizations.
        </p>
      </div>

      {/* STEP 1: RESUME INPUT */}
      {scanStep === 0 && (
        <div className="max-w-3xl mx-auto w-full glass-panel bg-bgCard border-borderColor rounded-3xl p-8 sm:p-12 shadow-lg space-y-8">
          <div className="text-center">
            <span className="text-[9px] font-extrabold text-accentPrimary bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded-full">
              Screener Inputs
            </span>
            <h3 className="font-heading font-extrabold text-xl mt-4 text-textPrimary">
              Resume Screening
            </h3>
            <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
              Upload your CV file or paste raw text to calculate ATS formatting compliance and matching filters.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/60 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Toggle Tabs (Upload File vs Copy-Paste) */}
          <div className="flex border-b border-borderColor justify-center gap-6">
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${inputMode === 'upload' ? 'border-accentPrimary text-textPrimary' : 'border-transparent text-textSecondary hover:text-textPrimary'}`}
            >
              Upload Document File
            </button>
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${inputMode === 'text' ? 'border-accentPrimary text-textPrimary' : 'border-transparent text-textSecondary hover:text-textPrimary'}`}
            >
              Copy & Paste Text
            </button>
          </div>

          <div className="space-y-4">
            {/* Target Role Selector */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-textSecondary uppercase tracking-widest">
                Target Professional Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary text-xs text-textPrimary font-semibold"
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

            {/* Input Mode 1: File Uploader */}
            {inputMode === 'upload' ? (
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-textSecondary uppercase tracking-widest">
                  Resume Document (.pdf or .txt)
                </label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragging 
                      ? 'border-accentPrimary bg-accentPrimary/10 scale-[1.01] shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                      : 'border-borderColor hover:border-accentPrimary bg-bgSecondary/20'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-3 pointer-events-none">
                    <UploadCloud className={`w-10 h-10 mx-auto transition-all ${isDragging ? 'text-accentPrimary scale-110 animate-bounce' : 'text-textSecondary animate-pulse'}`} />
                    <div>
                      {file ? (
                        <p className="text-xs font-bold text-textPrimary uppercase tracking-wider">
                          📁 Matched File: <span className="text-accentPrimary">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
                        </p>
                      ) : (
                        <>
                          <p className="text-xs text-textPrimary font-bold uppercase tracking-wider">
                            {isDragging ? "Drop Resume File Here!" : "Drag & Drop Resume File Here"}
                          </p>
                          <p className="text-[10px] text-textSecondary leading-normal mt-1">Accepts industry-standard PDF or plain TXT layouts</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Input Mode 2: Copy-Paste Text Area */
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-textSecondary uppercase tracking-widest">
                  Resume Content (Text format)
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste the full text of your CV/Resume here (including Work Experiences, Education, and Skills)..."
                  rows={8}
                  className="w-full p-4 bg-bgSecondary border border-borderColor focus:outline-none focus:border-accentPrimary rounded-2xl text-xs text-textPrimary font-semibold leading-relaxed focus:bg-bgPrimary transition-colors"
                />
              </div>
            )}
          </div>

          <MagneticButton
            onClick={triggerScanningSequence}
            disabled={inputMode === 'upload' ? !file : !resumeText.trim()}
            className="w-full bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            Scan CV against ATS Filter
          </MagneticButton>
        </div>
      )}

      {/* STEP 2: ANIMATED SCANNING CYCLE */}
      {scanStep === 1 && (
        <div className="max-w-xl mx-auto w-full glass-panel bg-bgCard border-borderColor rounded-3xl p-12 shadow-lg text-center space-y-6 my-auto">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 text-accentPrimary flex items-center justify-center animate-pulse">
              <UploadCloud className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-textPrimary">Screener Scanning...</h3>
            <p className="text-xs text-textSecondary mt-1 max-w-[280px] mx-auto leading-relaxed font-semibold">
              Evaluating layout formats, scanning keyword frequencies, and comparing tech stacks...
            </p>
          </div>
          {/* Animated scanning line */}
          <div className="w-full h-1.5 bg-bgSecondary rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 bg-blue-500 w-1/3 rounded-full" style={{ animation: 'shift-bar 1.5s linear infinite' }} />
          </div>
          
          <style>{`
            @keyframes shift-bar {
              0% { left: -30%; width: 30%; }
              50% { width: 50%; }
              100% { left: 100%; width: 30%; }
            }
          `}</style>
        </div>
      )}

      {/* STEP 3: ATS RESUME RESULTS */}
      {scanStep === 2 && results && (
        <div className="space-y-8 animate-fade-in print:shadow-none">
          {/* Action bar print header */}
          <div className="flex justify-between items-center glass-panel bg-bgCard border-borderColor p-4 rounded-2xl print:hidden">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary bg-bgSecondary border border-borderColor px-2.5 py-1 rounded-full">Report Compiled</span>
              <h2 className="text-xs font-bold text-textPrimary mt-2.5">Resume screening completed.</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 border border-borderColor hover:border-accentPrimary rounded-xl bg-bgSecondary text-textSecondary text-xs font-bold transition-all"
              >
                <Printer className="w-4 h-4" />
                Print Report
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 bg-textPrimary text-bgPrimary hover:bg-accentPrimary hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                New Scan
              </button>
            </div>
          </div>

          {/* Main Results grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Scorecard circular dial panel (Col 4) */}
            <div className="lg:col-span-4 glass-panel bg-bgCard border-borderColor rounded-3xl p-8 text-center flex flex-col items-center justify-center">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary mb-6 block">Screener Scorecard</span>
              
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="68" stroke="rgba(31,41,55,0.4)" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - (results.ats_score || 5) / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-heading font-extrabold text-3xl text-textPrimary">{results.ats_score}%</span>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-textSecondary mt-1">ATS Match</span>
                </div>
              </div>

              <div className="mt-8 space-y-2 max-w-[210px] mx-auto">
                <h4 className="text-xs font-bold text-textPrimary leading-none">
                  {results.ats_score >= 80 ? "✅ Enterprise Approved" : results.ats_score >= 60 ? "⚠️ Formatting Warnings" : "❌ Structural Gaps"}
                </h4>
                <p className="text-[10px] text-textSecondary leading-relaxed">
                  {results.ats_score >= 80 ? "Your CV features high keyword density matching standard filters." : "Your CV satisfies baseline criteria, but has critical keyword omissions."}
                </p>
              </div>
            </div>

            {/* Checklists (Col 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Keywords matched */}
              <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-md">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary flex items-center gap-1.5 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-accentPrimary" />
                  Identified Core Technologies Match
                </span>
                <div className="flex flex-wrap gap-2">
                  {results.keywords && results.keywords.length > 0 ? (
                    results.keywords.map((kw, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-full bg-bgSecondary border border-borderColor text-textPrimary text-xs font-bold">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-textSecondary">No industry keywords matched target role standards.</span>
                  )}
                </div>
              </div>

              {/* Strengths & Missing split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 bg-green-950/5">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-500 flex items-center gap-1.5 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Formatting Strengths
                  </span>
                  <ul className="space-y-3">
                    {results.strengths && results.strengths.map((str, i) => (
                      <li key={i} className="text-xs font-semibold text-textSecondary leading-normal list-disc pl-1 ml-4">
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing / Gaps */}
                <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 bg-red-950/5">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-500 flex items-center gap-1.5 mb-4">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    Missing Gaps / Keywords
                  </span>
                  <ul className="space-y-3">
                    {results.missing && results.missing.map((mis, i) => (
                      <li key={i} className="text-xs font-semibold text-textSecondary leading-normal list-disc pl-1 ml-4">
                        {mis}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recs */}
              <div className="glass-panel bg-bgCard border-borderColor rounded-3xl p-6 shadow-md">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-textSecondary mb-4 block">Actionable Recs Blueprint</span>
                <ul className="space-y-3">
                  {results.recommendations && results.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs font-semibold text-textPrimary leading-relaxed border-l-2 border-accentPrimary pl-3">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
