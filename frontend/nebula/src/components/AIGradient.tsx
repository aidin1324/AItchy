

import React from 'react';

const AIGradient: React.FC = () => {
  return (
    <div>
      {/* Inject keyframes into the document */}
      <style>{`
        @keyframes lavaLamp {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <h1 className="select-none text-6xl font-extrabold mb-12 text-center">
        <span style={{
          background: 'linear-gradient(-45deg, #f0b1e5, #b3a1fa, #d0a4f0, #a2e2e4)',
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          animation: 'lavaLamp 10s ease infinite'
        }}>
          AI
        </span>
        <span className="select-none text-6xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white-600">
          tchy
        </span>
      </h1>
    </div>
  );
};

export default AIGradient;
