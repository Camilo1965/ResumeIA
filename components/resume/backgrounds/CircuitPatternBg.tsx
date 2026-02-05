import React from 'react';

export const CircuitPatternBg = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <defs>
          <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Horizontal lines */}
            <line x1="0" y1="20" x2="40" y2="20" stroke="#0D9488" strokeWidth="1" />
            <line x1="60" y1="20" x2="100" y2="20" stroke="#0D9488" strokeWidth="1" />
            <line x1="0" y1="80" x2="30" y2="80" stroke="#0D9488" strokeWidth="1" />
            <line x1="70" y1="80" x2="100" y2="80" stroke="#0D9488" strokeWidth="1" />
            
            {/* Vertical lines */}
            <line x1="20" y1="0" x2="20" y2="40" stroke="#0D9488" strokeWidth="1" />
            <line x1="20" y1="60" x2="20" y2="100" stroke="#0D9488" strokeWidth="1" />
            <line x1="80" y1="0" x2="80" y2="30" stroke="#0D9488" strokeWidth="1" />
            <line x1="80" y1="70" x2="80" y2="100" stroke="#0D9488" strokeWidth="1" />
            
            {/* Nodes/Dots */}
            <circle cx="20" cy="20" r="2" fill="#0D9488" />
            <circle cx="80" cy="20" r="2" fill="#0D9488" />
            <circle cx="20" cy="80" r="2" fill="#0D9488" />
            <circle cx="80" cy="80" r="2" fill="#0D9488" />
            <circle cx="50" cy="50" r="2" fill="#0D9488" />
            
            {/* Diagonal connections */}
            <line x1="20" y1="20" x2="50" y2="50" stroke="#0D9488" strokeWidth="0.5" />
            <line x1="80" y1="20" x2="50" y2="50" stroke="#0D9488" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="20" y2="80" stroke="#0D9488" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="80" y2="80" stroke="#0D9488" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  );
};
