import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Decorative line */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-sys-label to-transparent" />
      
      {/* Logo text */}
      <h1 
        className="text-4xl font-bold tracking-tight"
        style={{
          background: 'linear-gradient(to right, var(--card-blue), var(--card-purple))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 2px rgba(0, 209, 255, 0.2)'
        }}
      >
        Nova
      </h1>
      
      {/* Decorative line */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-sys-label to-transparent" />
    </div>
  );
};

export default Logo;
