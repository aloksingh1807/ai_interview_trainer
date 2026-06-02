import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Avatar({ isSpeaking = false, isListening = false }) {
  const [mouthScaleY, setMouthScaleY] = useState(0.2);
  const [isBlinking, setIsBlinking] = useState(false);

  // Lip-sync speech height fluctuations
  useEffect(() => {
    let interval;
    if (isSpeaking) {
      interval = setInterval(() => {
        setMouthScaleY(Math.random() * 0.95 + 0.1);
      }, 90);
    } else {
      setMouthScaleY(0.18);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Periodic organic eye blinking
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.45) triggerBlink();
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-72 h-72 select-none">
      
      {/* Dynamic Silicon Valley Orbital Gradients (Rotating neon mesh backgrounds) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-76 h-76 rounded-full bg-gradient-to-tr from-blue-500/10 via-purple-500/15 to-cyan-500/10 blur-[10px] pointer-events-none"
      />
      
      {/* Speaker Glowing active ring */}
      <div className={`absolute w-72 h-72 rounded-full border border-blue-500/30 transition-all duration-700 ${isSpeaking ? 'scale-105 opacity-100 pulse-glow-ring' : 'scale-95 opacity-0'}`} />
      
      {/* Listening active ring */}
      <div className={`absolute w-76 h-76 rounded-full border border-dashed border-cyan-500/20 transition-all duration-700 ${isListening ? 'scale-110 opacity-100 border-orange-500/40 animate-pulse-slow' : 'scale-90 opacity-0'}`} />

      {/* Main Vector Frame */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-64 h-64 rounded-full overflow-hidden border border-zinc-800 bg-[#0d0d12] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-end justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="darkFaceGrad" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFF4EA" />
              <stop offset="100%" stopColor="#E6C0A3" />
            </radialGradient>
            <linearGradient id="cyberSuit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" /> {/* Deep Cyber Indigo */}
              <stop offset="100%" stopColor="#0F172A" /> {/* Deep Slate */}
            </linearGradient>
          </defs>

          {/* Shoulders & Cyber Collar */}
          <path d="M15,100 C15,82 30,74 50,74 C70,74 85,82 85,100 Z" fill="url(#cyberSuit)" stroke="#312E81" strokeWidth="0.8" />
          {/* Cyber Neck Tie/Trim */}
          <path d="M47,74 L53,74 L55,87 L50,94 L45,87 Z" fill="#3B82F6" opacity="0.9" />
          
          {/* Neck */}
          <rect x="44" y="55" width="12" height="20" rx="3" fill="#D4A385" />

          {/* Face */}
          <circle cx="50" cy="40" r="21" fill="url(#darkFaceGrad)" />
          
          {/* Hair (Sleek dark trim) */}
          <path d="M28,34 C28,14 40,13 50,13 C65,13 72,20 72,34 C70,24 64,20 50,20 C36,20 30,23 28,34 Z" fill="#09090B" />
          
          {/* Eyebrows */}
          <path d="M37,27 Q43,25 47,27" stroke="#09090B" strokeWidth="1.2" fill="none" />
          <path d="M63,27 Q57,25 53,27" stroke="#09090B" strokeWidth="1.2" fill="none" />

          {/* Eyeballs (Organically Blinking) */}
          {isBlinking ? (
            <>
              <line x1="38" y1="31.5" x2="46" y2="31.5" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="54" y1="31.5" x2="62" y2="31.5" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="42" cy="31.5" r="2.2" fill="#09090B" />
              <circle cx="58" cy="31.5" r="2.2" fill="#09090B" />
            </>
          )}

          {/* Cyber Glass Frames */}
          <rect x="35" y="28.5" width="12" height="6.2" rx="2" stroke="#3B82F6" strokeWidth="1.1" fill="none" />
          <rect x="53" y="28.5" width="12" height="6.2" rx="2" stroke="#3B82F6" strokeWidth="1.1" fill="none" />
          <line x1="47" y1="31" x2="53" y2="31" stroke="#3B82F6" strokeWidth="1.1" />

          {/* Nose */}
          <path d="M49,34 C49,34 50,38.5 52,38.5" stroke="#C49174" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Lipsync Mouth */}
          <motion.ellipse
            cx="50"
            cy="47.5"
            rx="5.5"
            ry={mouthScaleY * 7.5}
            fill="#09090B"
            animate={{ ry: mouthScaleY * 6 }}
            transition={{ type: "tween", duration: 0.08 }}
          />
          <path d="M43,47 Q50,48.5 57,47" stroke="#CF917A" strokeWidth="0.8" fill="none" />
        </svg>

        {/* Audio state badge overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 shadow-md">
          <div className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : isListening ? 'bg-cyan-400 animate-ping' : 'bg-zinc-600'}`} />
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-300 font-sans">
            {isSpeaking ? 'Alok Talking' : isListening ? 'Listening' : 'Alok Idle'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
