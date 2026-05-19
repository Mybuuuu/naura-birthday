import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { cn } from '../lib/utils';

interface LockScreenProps {
  onUnlock: () => void;
}

const ERROR_MESSAGES = [
  "Oops! Not that one \ud83d\ude1c",
  "Try again cutie \u2728",
  "Did you forget? \ud83d\ude31",
  "Hint: A very special day \ud83d\udc96"
];

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeyPress = (num: number) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (newPin === "0520") {
          setTimeout(onUnlock, 400);
        } else {
          setIsError(true);
          setErrorMsg(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);
          setTimeout(() => {
            setPin('');
            setIsError(false);
          }, 1500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      {/* Floating glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-pink-200/50 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-purple-200/50 rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        <Heart className="w-12 h-12 text-purple-400 mb-6 drop-shadow-md" fill="#c084fc" />
        <h1 className="text-xs uppercase tracking-[0.3em] text-purple-400 font-bold mb-1 text-center">Secret Access</h1>
        <p className="font-sans text-xs text-gray-500 mb-8 tracking-widest text-center uppercase">
          Enter Naura's birthday PIN
        </p>

        <motion.div 
          className="flex gap-4 mb-8"
          animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-14 h-16 rounded-xl flex items-center justify-center text-4xl font-mono shadow-sm transition-all duration-300 bg-white/60 backdrop-blur-md border border-white/80 text-purple-700",
                pin[i] ? "border-purple-400 shadow-purple-200/50 shadow-lg" : "text-transparent",
                isError && "border-red-400 text-red-500 bg-red-50/80"
              )}
            >
              {pin[i] ? "•" : ""}
            </div>
          ))}
        </motion.div>

        <div className="h-6 mb-8 text-center">
          <AnimatePresence mode="wait">
            {isError && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-pink-500 font-sans font-medium text-sm"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-full aspect-square rounded-full flex items-center justify-center text-2xl text-purple-700 font-serif active:bg-white/40 transition-colors bg-white/20 backdrop-blur border border-white/50"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress(0)}
            className="w-full aspect-square rounded-full flex items-center justify-center text-2xl text-purple-700 font-serif active:bg-white/40 transition-colors bg-white/20 backdrop-blur border border-white/50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-full aspect-square rounded-full flex items-center justify-center text-sm text-purple-700 font-sans tracking-widest active:bg-white/40 transition-colors bg-white/10 backdrop-blur"
          >
            DEL
          </button>
        </div>
      </div>
    </motion.div>
  );
}
