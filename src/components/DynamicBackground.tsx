import React from 'react';
import { motion } from 'motion/react';

export function DynamicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Moving clouds */}
      <motion.div 
        className="absolute top-10 left-[-20%] w-[400px] h-[100px] bg-white/20 blur-3xl rounded-full"
        animate={{ x: ['-20vw', '120vw'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="absolute top-40 left-[-30%] w-[500px] h-[150px] bg-blue-100/20 blur-3xl rounded-full"
        animate={{ x: ['-30vw', '120vw'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear', delay: 10 }}
      />
      
      {/* Twinkling stars - reduced count for performance */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute bg-white rounded-full mix-blend-overlay will-change-[opacity,transform]"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}
      
      {/* Ambient floating petals - reduced count */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`petal-${i}`}
          className="absolute w-3 h-3 bg-pink-200/40 rounded-tl-full rounded-br-full backdrop-blur-sm shadow-sm will-change-transform"
          initial={{ 
            y: '-10vh', 
            x: `${Math.random() * 100}vw`,
            rotate: 0 
          }}
          animate={{ 
            y: '110vh',
            rotate: 360
          }}
          transition={{
            duration: Math.random() * 15 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
        />
      ))}
    </div>
  );
}
