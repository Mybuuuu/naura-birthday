import React, { useEffect, useState, MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]);

  useEffect(() => {
    // Disable on touch devices to conserve CPU and battery
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, label, [role="button"], .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Spawn particles
      setParticles(prev => [
        ...prev,
        { id: Date.now(), x: e.clientX, y: e.clientY },
        { id: Date.now() + 1, x: e.clientX, y: e.clientY },
        { id: Date.now() + 2, x: e.clientX, y: e.clientY }
      ]);
    };
    
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-purple-400 pointer-events-none z-[100] mix-blend-difference hidden md:flex items-center justify-center"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(192, 132, 252, 0.2)' : 'transparent'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <Sparkles className={`w-3 h-3 text-purple-300 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-pink-400 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block shadow-[0_0_10px_rgba(244,114,182,0.8)]"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isClicking ? 0.5 : 1
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.1 }}
      />
      
      {/* Click Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="fixed pointer-events-none z-[100]"
            initial={{ opacity: 1, x: p.x - 10, y: p.y - 10, scale: 0.5 }}
            animate={{ 
              opacity: 0, 
              x: p.x - 10 + (Math.random() * 60 - 30), 
              y: p.y - 10 - (Math.random() * 50 + 20),
              scale: 1.5,
              rotate: Math.random() * 90 - 45
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => setParticles(prev => prev.filter(particle => particle.id !== p.id))}
          >
            <Heart className="w-5 h-5 text-pink-500 fill-pink-400 opacity-60" />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
