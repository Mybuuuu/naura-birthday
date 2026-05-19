import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gamepad2 } from 'lucide-react';

interface IntroPageProps {
  onNext: () => void;
}

export function IntroPage({ onNext }: IntroPageProps) {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20 bg-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-60"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="text-center z-10 max-w-2xl px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Gamepad2 className="w-16 h-16 mx-auto text-purple-400 mb-8 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)] animate-bounce" />
        <h1 className="font-serif text-3xl md:text-5xl text-purple-700 leading-relaxed mb-10 drop-shadow-[0_0_20px_rgba(216,180,254,0.6)]">
          "Hi Naura 👋<br/><br/>
          <span className="text-2xl md:text-3xl text-purple-600">Ada sesuatu kecil dari teman-teman Roblox yang mau kamu lihat hari ini.</span><br/><br/>
          <span className="text-xl md:text-2xl text-purple-500">Tekan start ya ✨</span>"
        </h1>
        
        <button
          onClick={onNext}
          className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-purple-500 font-sans tracking-widest uppercase rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 shadow-xl shadow-purple-300 hover:scale-105"
        >
          <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
          START
        </button>
      </motion.div>
    </motion.div>
  );
}
