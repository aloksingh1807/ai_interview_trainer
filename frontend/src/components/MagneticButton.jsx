import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({ children, onClick, className = "", style = {} }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Compute distance from center of the button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnetic intensity threshold (50% max drag offset)
    const x = (clientX - centerX) * 0.35;
    const y = (clientY - centerY) * 0.35;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      style={style}
      className={`relative inline-flex items-center justify-center font-semibold text-sm transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
}
