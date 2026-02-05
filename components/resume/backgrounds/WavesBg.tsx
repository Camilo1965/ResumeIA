import React from 'react';

export const WavesBg = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 w-full opacity-5"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ height: '200px' }}
      >
        <path
          d="M0,64 C150,90 350,90 500,64 C650,38 850,38 1000,64 C1150,90 1200,90 1200,64 L1200,120 L0,120 Z"
          fill="#0D9488"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full opacity-3"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ height: '180px' }}
      >
        <path
          d="M0,76 C200,100 400,50 600,76 C800,100 1000,50 1200,76 L1200,120 L0,120 Z"
          fill="#06B6D4"
        />
      </svg>
    </div>
  );
};
