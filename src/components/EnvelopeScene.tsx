import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { playSound } from '../lib/audio';
import { Sparkles } from 'lucide-react';

interface EnvelopeSceneProps {
  onOpen: () => void;
}

export function EnvelopeScene({ onOpen }: EnvelopeSceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [shake, setShake] = useState(0);
  const [lightBurst, setLightBurst] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;

    if (clickCount < 2) {
      playSound('pop');
      setClickCount(c => c + 1);
      setShake(s => s + 1);
      
      // Mini confetti on click
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#ffb7b2', '#ffdac1', '#e2f0cb'],
        disableForReducedMotion: true,
      });
      return;
    }

    playSound('magic');
    setIsOpen(true);
    setLightBurst(true);
    
    // Fire confetti for celebration
    const duration = window.matchMedia("(max-width: 768px)").matches ? 1500 : 2500;
    const end = Date.now() + duration;
    
    // Throttle frames on mobile to save battery and reduce lag
    let lastFrameTime = Date.now();

    const frame = () => {
      const now = Date.now();
      // limit to roughly 30fps for confetti dropping on mobile
      if (window.matchMedia("(max-width: 768px)").matches && now - lastFrameTime < 30) {
        if (now < end) requestAnimationFrame(frame);
        return;
      }
      lastFrameTime = now;

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#ffb7b2', '#fbcfe8', '#f9a8d4']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#ffb7b2', '#fbcfe8', '#f9a8d4']
      });

      if (now < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(() => {
      onOpen();
    }, 2800);
  };

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden z-20 perspective-[1000px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(15px)' }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <AnimatePresence>
        {lightBurst && (
           <motion.div 
             className="absolute inset-0 bg-white z-[30] pointer-events-none"
             initial={{ opacity: 0 }}
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1.5, ease: "easeOut" }}
           />
        )}
      </AnimatePresence>

      <div 
        className="relative w-80 h-52 cursor-none group interactive"
        onClick={handleOpen}
      >
        <motion.div 
          animate={
            isOpen 
              ? { scale: 1.5, y: 150, opacity: 0, rotateX: 20 } 
              : { 
                  y: [0, -10, 0],
                  scale: clickCount > 0 ? 1 + (clickCount * 0.05) : 1,
                  x: shake ? [0, -10, 10, -10, 10, 0] : 0
                }
          }
          transition={isOpen ? { duration: 1.5, ease: 'easeOut' } : { duration: shake ? 0.4 : 3, repeat: shake ? 0 : Infinity, ease: 'easeInOut' }}
          onAnimationComplete={() => setShake(0)}
          className="w-full h-full relative preserve-3d"
        >
          {/* Back of Envelope */}
          <div className="absolute inset-0 bg-pink-200 rounded-lg shadow-xl" />
          
          {/* Light glow inside */}
          {isOpen && (
             <motion.div 
               className="absolute inset-0 bg-yellow-100 rounded-lg shadow-[0_0_100px_rgba(253,224,71,0.8)] z-0"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5 }}
             />
          )}

          {/* Paper peeking out */}
          <motion.div 
            className="absolute left-4 right-4 bg-white/90 top-4 bottom-4 rounded-md flex items-center justify-center shadow-inner border border-purple-100 z-10"
            animate={
              isOpen 
                ? { y: -160, opacity: 1, scale: 1.2, rotateX: -10 } 
                : { y: 0, opacity: 0.8 }
            }
            transition={{ duration: 1.2, delay: isOpen ? 0.4 : 0, ease: "easeOut" }}
          >
            <span className="font-serif italic text-2xl text-purple-500 rotate-[-5deg]">For Naura ♥</span>
          </motion.div>

          {/* Front Flaps */}
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-20">
             <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-pink-100 rotate-45 translate-y-[60%] shadow-[-5px_-5px_10px_rgba(0,0,0,0.05)]" />
          </div>
          
          {/* Top Flap */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-[120px] origin-top bg-pink-300 rounded-t-lg flex justify-center items-end pb-4 z-30"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            animate={isOpen ? { rotateX: 180, opacity: 0 } : { rotateX: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
             {!isOpen && (
               <motion.div 
                 className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                 whileHover={{ scale: 1.1 }}
               >
                 <Sparkles className="w-5 h-5 text-red-100" />
               </motion.div>
             )}
          </motion.div>
        
        </motion.div>

        {!isOpen && (
          <motion.p 
            className="absolute -bottom-20 w-full text-center font-serif italic text-xl text-purple-600 drop-shadow-sm pointer-events-none"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {clickCount === 0 ? "Tap to open..." : clickCount === 1 ? "Keep tapping!" : "Almost there..."}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
