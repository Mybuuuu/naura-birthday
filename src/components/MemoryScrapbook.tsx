import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Camera, Sparkles, ChevronRight, ChevronLeft, X, Heart, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

// ... (keep MemoryItem and constants)
interface MemoryItem {
  id: string;
  type: 'image' | 'video' | 'collage' | 'grid';
  src: string | string[];
  caption: string;
  rotation: number;
}

const ROBLOX_STICKERS = [
  "https://cdn-icons-png.flaticon.com/512/588/588267.png",
  "https://cdn-icons-png.flaticon.com/512/188/188987.png",
];

const ROBLOX_WISHES = [
  "happy birthday nauraa 🎂",
  "semoga makin bahagia terus",
  "makasih udah selalu nemenin mabar kita",
  "semoga tahun ini banyak hal baik buat kamu",
  "jangan lupa mandi nau😆",
  "semoga tetap jadi naura yang seru",
  "sehat sehat selalu ya",
  "semoga semua wish kamu tercapai",
  "next mabar lagi yaa",
  "today is your special day ✨"
];

const DEFAULT_MEMORIES: MemoryItem[] = [
  { id: '1', type: 'image', src: '/assets/naura5.jpg', caption: 'Today is all about you 🌸', rotation: -1 },
  { id: '2', type: 'collage', src: ['/assets/naura1.jpg', '/assets/naura2.jpg'], caption: 'Moments where we laughed together in Roblox', rotation: 2 },
  { id: '3', type: 'image', src: '/assets/naura6.jpg', caption: 'Someone special celebrating another level up', rotation: -2 },
  { id: '4', type: 'grid', src: ['/assets/naura3.jpg', '/assets/naura4.jpg'], caption: 'The squad who stayed up just to make memories', rotation: 1 },
  { id: '5', type: 'video', src: '/assets/naura7.mp4', caption: 'Unforgettable moments ✨', rotation: 0 }
];

function TiltCard({ children, rotation }: { children: React.ReactNode, rotation: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformOrigin: 'center' }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative w-full h-full preserve-3d"
    >
      <div 
        className={cn(
          "relative bg-white p-4 pb-20 rounded-sm shadow-xl transition-all duration-300 flex flex-col items-center cursor-none interactive",
          "border border-gray-100"
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function ChatBubble({ message, position, delay }: { message: string, position: 'top-left' | 'bottom-right', delay: number }) {
  const [isTyping, setIsTyping] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reaction, setReaction] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      playSound('pop');
    }, delay * 1000 + 1500); // Wait for initial delay + 1.5s typing
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      className={`absolute ${position === 'top-left' ? '-top-12 -left-6 md:-left-16 rounded-bl-sm' : '-bottom-8 -right-6 md:-right-16 rounded-tr-sm'} bg-black/70 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 z-40 max-w-[250px] interactive cursor-none select-none`}
      initial={{ opacity: 0, scale: 0.5, [position === 'top-left' ? 'x' : 'x']: position === 'top-left' ? 50 : -50 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, type: 'spring', bounce: 0.6 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={() => {
        setIsExpanded(!isExpanded);
        setReaction(true);
        setTimeout(() => setReaction(false), 2000);
      }}
    >
      <AnimatePresence>
        {reaction && (
          <motion.div 
            className="absolute -top-6 -right-6 text-2xl"
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: -20, scale: 1.5 }}
            exit={{ opacity: 0 }}
          >
            💖
          </motion.div>
        )}
      </AnimatePresence>
      
      {isTyping ? (
        <div className="flex gap-1 items-center h-4">
          <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
          <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
          <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
        </div>
      ) : (
        <motion.p 
          className="font-sans font-semibold leading-relaxed tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: isExpanded ? '14px' : '11px' }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

export function MemoryScrapbook({ onComplete }: { onComplete: () => void }) {

  const [memories, setMemories] = useState<MemoryItem[]>(DEFAULT_MEMORIES);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const handleUpload = (id: string, file: File, index?: number) => {
    const url = URL.createObjectURL(file);
    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        if (Array.isArray(m.src) && typeof index === 'number') {
          const newSrc = [...m.src];
          newSrc[index] = url;
          return { ...m, src: newSrc };
        }
        return { ...m, src: url };
      }
      return m;
    }));
  };

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      playSound('flip');
    }
  };

  const handleNext = () => scrollBy(window.innerWidth * 0.8);
  const handlePrev = () => scrollBy(-(window.innerWidth * 0.8));

  const renderMedia = (item: MemoryItem) => {
    if (item.type === 'image' && typeof item.src === 'string') {
      return (
        <div 
          className="w-full aspect-[4/5] bg-gray-100 mb-4 overflow-hidden relative group rounded-md border-2 border-white shadow-inner"
          onClick={() => setZoomedImage(item.src as string)}
        >
           <img src={item.src} alt={item.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" onError={(e) => {
             e.currentTarget.style.display = 'none';
             e.currentTarget.parentElement?.classList.add('bg-pink-100');
           }} />
        </div>
      );
    }
    
    if (item.type === 'collage' && Array.isArray(item.src)) {
      return (
        <div className="w-full aspect-square mb-4 relative rounded-md">
           <div className="absolute top-0 left-0 w-[65%] h-[65%] bg-gray-100 z-10 rotate-[-4deg] border-4 border-white shadow-md overflow-hidden group hover:z-30 transition-transform hover:scale-110 will-change-transform" onClick={() => setZoomedImage(item.src[0])}>
             <img src={item.src[0]} alt="Collage 1" loading="lazy" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
           </div>
           <div className="absolute bottom-0 right-0 w-[65%] h-[65%] bg-gray-100 z-20 rotate-[5deg] border-4 border-white shadow-md overflow-hidden group hover:z-30 transition-transform hover:scale-110 will-change-transform" onClick={() => setZoomedImage(item.src[1])}>
             <img src={item.src[1]} alt="Collage 2" loading="lazy" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
           </div>
           <motion.img 
             src={ROBLOX_STICKERS[0]} 
             loading="lazy"
             className="absolute -top-2 -right-4 w-12 h-12 z-30 drop-shadow-md rotate-12 will-change-transform" 
             alt="sticker" 
             whileHover={{ rotate: 180, scale: 1.2 }}
           />
        </div>
      );
    }
    
    if (item.type === 'grid' && Array.isArray(item.src)) {
       return (
         <div className="w-full aspect-[4/3] mb-4 flex gap-2">
            <div className="flex-1 bg-gray-100 border-2 border-white shadow-inner overflow-hidden group relative" onClick={() => setZoomedImage(item.src[0])}>
               <img src={item.src[0]} alt="Grid 1" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <div className="flex-1 bg-gray-100 border-2 border-white shadow-inner overflow-hidden group relative" onClick={() => setZoomedImage(item.src[1])}>
               <img src={item.src[1]} alt="Grid 2" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
         </div>
       );
    }
    
    if (item.type === 'video' && typeof item.src === 'string') {
       return (
         <div className="w-full aspect-video bg-gray-900 mb-4 overflow-hidden relative group border-2 border-white shadow-md">
            <motion.video 
               src={item.src} 
               preload="metadata"
               className="w-full h-full object-cover" 
               controls 
               controlsList="nodownload"
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               onViewportEnter={(e) => {
                  const target = e?.target as HTMLVideoElement;
                  if (target) {
                    target.play().catch(() => {}); // handle autoplay policy mostly
                  }
               }}
               onViewportLeave={(e) => {
                  const target = e?.target as HTMLVideoElement;
                  if (target) {
                    target.pause();
                  }
               }}
            />
         </div>
       );
    }
    return null;
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col pt-20 pb-24 overflow-hidden z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <div className="text-center mb-6 px-4 z-10 shrink-0">
        <motion.h2 
          className="font-serif text-3xl md:text-4xl text-purple-800 mb-2 drop-shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Our Scrapbook
        </motion.h2>
        <p className="font-sans text-sm text-purple-600 tracking-wide">Swipe to view memories. Try hovering and clicking!</p>
      </div>

      <div className="relative flex-1 min-h-[400px]">
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev} 
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/40 backdrop-blur-md border border-white rounded-full items-center justify-center text-purple-600 shadow-xl hover:bg-white/80 hover:scale-110 active:scale-95 transition-all interactive"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={handleNext} 
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/40 backdrop-blur-md border border-white rounded-full items-center justify-center text-purple-600 shadow-xl hover:bg-white/80 hover:scale-110 active:scale-95 transition-all interactive"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Horizontal Carousel */}
        <div 
          ref={scrollRef}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar px-[10vw]"
          onScroll={() => {
            // Optional: debounce sound if needed, but omitted for simplicity
          }}
        >
          <div className="flex gap-[15vw] md:gap-32 items-center h-full pb-12 pt-8">
            {memories.map((memory, index) => {
              const wish1 = ROBLOX_WISHES[(index * 2) % ROBLOX_WISHES.length];
              const wish2 = ROBLOX_WISHES[(index * 2 + 1) % ROBLOX_WISHES.length];

              return (
              <motion.div 
                key={memory.id}
                className="shrink-0 w-[75vw] max-w-md snap-center relative perspective-[1000px] z-10"
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <ChatBubble message={wish1} position="top-left" delay={0.4} />
                <ChatBubble message={wish2} position="bottom-right" delay={0.7} />

                <TiltCard rotation={memory.rotation}>
                  {/* Tape decoration */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/50 backdrop-blur-md border border-white/40 rotate-[3deg] shadow-sm z-10" />

                  {/* Image Container */}
                  {renderMedia(memory)}

                  {/* Caption with draw text animation */}
                  <div className="absolute bottom-6 left-0 w-full text-center px-8">
                    <motion.p 
                      className="font-serif italic text-xl md:text-2xl leading-tight text-purple-900"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      {memory.caption}
                    </motion.p>
                  </div>
                  
                  {/* Random stickers */}
                  {(parseInt(memory.id) % 2 === 0) && (
                    <motion.div 
                      className="absolute -bottom-6 -right-6 z-20"
                      whileHover={{ scale: 1.5, rotate: 45 }}
                    >
                      <Sparkles className="text-yellow-400 w-12 h-12 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" fill="#facc15" />
                    </motion.div>
                  )}
                  {(parseInt(memory.id) % 3 === 0) && (
                    <motion.div 
                      className="absolute -top-6 -left-6 z-20 cursor-help"
                      whileHover={{ scale: 1.5, rotate: -45 }}
                      onClick={() => alert("You found a secret heart! Naura is loved! ♥")}
                    >
                      <Heart className="text-pink-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]" fill="#f472b6" />
                    </motion.div>
                  )}
                </TiltCard>
              </motion.div>
            )})}

            {/* End Card */}
             <motion.div 
                className="shrink-0 w-[80vw] max-w-sm snap-center flex flex-col items-center justify-center relative translate-y-[-20px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-gradient-to-br from-pink-100 to-white/90 p-10 rounded-full border border-white shadow-[0_0_50px_rgba(236,72,153,0.3)] flex items-center justify-center w-56 h-56 mb-10 overflow-hidden relative group">
                  <motion.div 
                    className="font-serif italic text-3xl text-purple-800 text-center leading-tight tracking-wide z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    To<br/>Be<br/>Continued
                  </motion.div>
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-all" />
                </div>
                <button
                  onClick={() => {
                    playSound('click');
                    onComplete();
                  }}
                  className="px-10 py-4 bg-white/80 backdrop-blur-xl border border-purple-200 font-sans font-bold text-purple-700 rounded-full shadow-2xl hover:bg-white hover:scale-105 transition-all text-sm uppercase tracking-widest interactive shadow-purple-200"
                >
                  See The Surprise Mode!
                </button>
             </motion.div>
             <div className="w-[10vw] shrink-0" /> {/* Buffer */}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 interactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
          >
            <motion.img 
              src={zoomedImage} 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border-2 border-white/20"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", bounce: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
