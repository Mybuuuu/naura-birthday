import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Moon, Sparkles, RefreshCcw } from 'lucide-react';
import { playSound } from '../lib/audio';

const secretLines = [
  "eh bentar, belum selesai 😌",
  "",
  "sebenernya kita cuma mau bilang...",
  "",
  "makasih ya udah jadi naura yang kita kenal selama ini.",
  "",
  "yang selalu rame pas mabar,",
  "yang kadang random,",
  "yang suka bikin ketawa,",
  "dan somehow selalu bikin suasana jadi seru.",
  "",
  "mungkin ini cuma game,",
  "cuma roblox,",
  "cuma obrolan random tiap hari...",
  "",
  "tapi dari situ,",
  "ada banyak momen yang ternyata jadi kenangan juga.",
  "",
  "jadi di hari ulang tahun kamu ini,",
  "semoga semua hal baik dateng ke kamu.",
  "semoga yang kamu usahain pelan-pelan berhasil.",
  "semoga hari-hari kamu selalu ketemu alasan buat senyum.",
  "",
  "and yea...",
  "",
  "jangan sering g mandi 😭",
  "tetep jadi naura yang kita kenal.",
  "",
  "happy birthday once again 🎂",
  "see u in the next game ❤️"
];

export function FinalSurprise() {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [isBirthday, setIsBirthday] = useState(false);
  const [showOneMoreThing, setShowOneMoreThing] = useState(false);
  const [secretMessage, setSecretMessage] = useState(false);
  const [moonClicked, setMoonClicked] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showMontage, setShowMontage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target: May 24th of the current year
      let targetDate = new Date(now.getFullYear(), 4, 20); // 4 = May (0-indexed)
      
      // If today is past May 24, set for next year (we don't want this mostly, but good fallback)
      if (now.getTime() > targetDate.getTime() + 86400000) {
        targetDate = new Date(now.getFullYear() + 1, 4, 20);
      }

      const difference = targetDate.getTime() - now.getTime();

      // If it's the exact day (between 00:00 and 23:59 on May 24)
      if (difference <= 0 && difference > -86400000) {
        setIsBirthday(true);
        setTimeLeft(null);
        return;
      }

      setIsBirthday(false);
      
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isBirthday && !showOneMoreThing) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isBirthday, showOneMoreThing]);

  useEffect(() => {
    if (moonClicked && visibleLines < secretLines.length) {
      const line = secretLines[visibleLines];
      const delay = line.length === 0 ? 600 : 500 + line.length * 50;
      
      const timer = setTimeout(() => {
        setVisibleLines(v => v + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (moonClicked && visibleLines === secretLines.length && !showMontage) {
       const timer = setTimeout(() => {
           // Flower explosion
           confetti({
             particleCount: 200,
             spread: 160,
             origin: { y: 0.6 },
             colors: ['#ffb7b2', '#fbcfe8', '#f9a8d4', '#f472b6', '#cbd5e1']
           });
           confetti({
             particleCount: 150,
             spread: 360,
             origin: { y: 0.4 },
             colors: ['#f472b6', '#fbcfe8', '#f9a8d4'],
             shapes: ['circle']
           });
           playSound('magic');
           setShowMontage(true);
       }, 2000);
       return () => clearTimeout(timer);
    }
  }, [moonClicked, visibleLines, showMontage]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleLines]);

  const handleOneMoreThing = () => {
    playSound('magic');
    setShowOneMoreThing(true);
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-hidden z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Background continuous floaters */}
      {isBirthday && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute z-0 will-change-transform"
               initial={{ 
                 y: '-10vh', 
                 x: `${Math.random() * 100}vw`,
                 rotate: 0,
                 scale: Math.random() * 0.5 + 0.5
               }}
               animate={{ 
                 y: '110vh',
                 rotate: 360,
               }}
               transition={{
                 duration: Math.random() * 10 + 15,
                 repeat: Infinity,
                 ease: "linear",
                 delay: Math.random() * 5
               }}
             >
               <div className="w-4 h-4 bg-pink-200/40 rounded-tl-full rounded-br-full backdrop-blur-sm shadow-sm" />
             </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isBirthday ? (
          <motion.div 
            key="countdown"
            className="z-10 text-center flex flex-col items-center justify-center h-full bg-transparent relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <div className="text-xs md:text-sm uppercase tracking-[0.3em] text-pink-500 font-bold mb-6">Countdown</div>
            
            <div className="flex gap-4 sm:gap-6 justify-center bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-[0_0_50px_rgba(236,72,153,0.2)] border border-white/50">
              {Object.entries(timeLeft || { d:0, h:0, m:0, s:0 }).map(([label, value]) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="font-serif italic text-5xl sm:text-7xl text-pink-600 tabular-nums drop-shadow-sm">
                    {value.toString().padStart(2, '0')}
                  </span>
                  <span className="font-sans text-xs text-purple-500 uppercase tracking-[0.2em] mt-3 font-semibold">{label}</span>
                </div>
              ))}
            </div>

            <p className="mt-12 font-serif italic text-2xl text-purple-700 drop-shadow-sm">
               The big surprise is waiting! ✨
            </p>

            <button 
              onClick={() => window.location.reload()}
              className="absolute bottom-12 flex items-center gap-2 px-6 py-2 bg-white/40 backdrop-blur-md rounded-full text-purple-600 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white/60 transition-all shadow-lg border border-white interactive cursor-none"
            >
              <RefreshCcw className="w-4 h-4" />
              Restart Journey
            </button>
          </motion.div>
        ) : !showOneMoreThing ? (
          <motion.div 
            key="main"
            className="z-10 w-full h-full flex flex-col items-center justify-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
          >
            <div className="inline-block p-10 bg-white/70 backdrop-blur-xl rounded-[40px] shadow-[0_0_50px_rgba(236,72,153,0.2)] border border-white relative">
              <h1 className="font-serif italic text-6xl md:text-7xl text-purple-700 mb-8 drop-shadow-sm">It's May 20!</h1>
              <p className="font-sans text-lg md:text-xl text-purple-800 max-w-md mx-auto leading-relaxed font-medium mb-8">
                Thank you for every game,<br/>
                every laugh,<br/>
                and every random moment in Roblox.
              </p>
              <p className="font-serif text-2xl md:text-3xl text-pink-600 font-bold italic">
                Happy Birthday Naura ❤️<br/>
                from all of us.
              </p>

              <button 
                onClick={() => { playSound('pop'); setSecretMessage(!secretMessage); }}
                className="absolute -top-6 -right-6 p-4 rounded-full bg-white/40 backdrop-blur-md border border-white hover:bg-white transition-all hover:scale-110 shadow-lg interactive cursor-none"
              >
                <Moon className="w-8 h-8 text-purple-400" />
              </button>
            </div>

            <AnimatePresence>
              {secretMessage && (
                <motion.div 
                  className="absolute mt-[400px] bg-purple-900/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-purple-400/50 shadow-2xl"
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <p className="font-sans text-sm tracking-wider">🌟 You found the secret moon! Keep shining bright! 🌟</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-12 flex flex-col items-center gap-6 z-20">
              <button 
                onClick={handleOneMoreThing}
                className="group px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full text-white font-sans text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(216,180,254,0.6)] hover:shadow-[0_0_50px_rgba(216,180,254,0.8)] transition-all hover:scale-110 interactive cursor-none border border-white/30 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                One More Thing...
              </button>

              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-2 bg-white/40 backdrop-blur-md rounded-full text-purple-600 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white/60 transition-all shadow-lg border border-white interactive cursor-none"
              >
                <RefreshCcw className="w-4 h-4" />
                Restart Journey
              </button>
            </div>
          </motion.div>
        ) : !showMontage ? (
          <motion.div 
            key="secret" 
            className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl z-[40] flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
          >
             {/* Blurred stars optimized for performance */}
             <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                   <motion.div 
                     key={i} 
                     className="absolute bg-white rounded-full mix-blend-overlay blur-[2px] will-change-[opacity,transform]"
                     style={{
                       width: Math.random() * 3 + 1,
                       height: Math.random() * 3 + 1,
                       left: `${Math.random() * 100}%`,
                       top: `${Math.random() * 100}%`,
                     }}
                     animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.2, 1] }}
                     transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }}
                   />
                ))}
             </div>

             {!moonClicked ? (
                <motion.button 
                  className="z-10 interactive hover:scale-110 cursor-none"
                  onClick={() => { playSound('pop'); setMoonClicked(true); }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                   <Moon className="w-20 h-20 text-yellow-200 drop-shadow-[0_0_30px_rgba(254,240,138,0.8)] fill-yellow-200/50" />
                </motion.button>
             ) : (
                <div 
                  ref={containerRef}
                  className="w-full max-w-2xl h-[80vh] overflow-y-auto no-scrollbar flex flex-col items-center py-20 px-6 z-10 scroll-smooth"
                >
                  <AnimatePresence>
                      {secretLines.slice(0, visibleLines).map((line, i) => (
                           <motion.p
                             key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`font-sans text-center leading-relaxed ${
                                 i === secretLines.length - 1 ? 'text-2xl md:text-3xl text-pink-400 font-serif italic mt-12 font-bold' : 
                                 line === '' ? 'h-6' : 'text-lg md:text-xl text-white/90 my-3'
                              }`}
                           >
                              {line}
                           </motion.p>
                      ))}
                  </AnimatePresence>
                </div>
             )}
          </motion.div>
        ) : (
          <motion.div
            key="montage"
            className="absolute inset-0 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Exploding grid of wishes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`wish-${i}`}
                  className="absolute bg-white/90 backdrop-blur-sm text-purple-800 px-4 py-2 rounded-2xl shadow-xl font-sans text-xs font-bold border border-pink-100 whitespace-nowrap"
                  initial={{ 
                    x: '50vw', 
                    y: '50vh',
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    x: `${Math.random() * 90 + 5}vw`, 
                    y: `${Math.random() * 90 + 5}vh`,
                    scale: Math.random() * 0.5 + 0.8,
                    opacity: [0, 1, 0.8],
                    rotate: Math.random() * 40 - 20
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 2, 
                    ease: "easeOut",
                    delay: Math.random() * 0.5 
                  }}
                >
                  {["Happy Level Up!", "We love you!", "Best Roblox Friend!", "Stay Awesome!", "🎉🎉🎉", "You're the best!", "✨✨✨"][i % 7]}
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="z-10 bg-white/40 backdrop-blur-2xl p-12 rounded-[50px] shadow-[0_0_100px_rgba(255,255,255,0.8)] border-2 border-white flex flex-col items-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, delay: 1 }}
            >
              <Heart className="w-20 h-20 text-pink-500 fill-pink-400 mb-6 drop-shadow-xl animate-pulse" />
              <h2 className="font-serif italic text-4xl text-purple-900 mb-4">You are cherished.</h2>
              <p className="font-sans text-sm text-purple-700 uppercase tracking-widest font-bold">Never forget that.</p>
              
              <button 
                onClick={() => window.location.reload()}
                className="mt-12 flex items-center gap-2 px-6 py-3 bg-white/80 rounded-full text-purple-600 font-sans text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-white transition-all interactive cursor-none"
              >
                <RefreshCcw className="w-4 h-4" />
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
