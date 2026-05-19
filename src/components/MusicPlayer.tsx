import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Music, Upload, Disc } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

interface MusicPlayerProps {
  phase: 'intro' | 'main' | 'none';
}

export function MusicPlayer({ phase }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (phase === 'none' || !audioRef.current) return;
    
    const src = phase === 'intro' ? '/assets/intro1.mp3' : '/assets/main1.mp3';
    
    const changeTrack = () => {
      if (!audioRef.current) return;
      audioRef.current.src = src;
      setSongTitle(phase === 'intro' ? "Intro BGM" : "Main BGM");
      
      if (phase === 'main' || isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          // Fade in
          let vol = 0;
          audioRef.current!.volume = vol;
          const fade = setInterval(() => {
            vol += 0.05;
            if (vol >= 1) {
              clearInterval(fade);
              if (audioRef.current) audioRef.current.volume = 1;
            } else {
              if (audioRef.current) audioRef.current.volume = vol;
            }
          }, 50);
        }).catch(e => console.log('Autoplay prevented', e));
      }
    };
    
    // Check if source changed before resetting
    if (audioRef.current.src && !audioRef.current.src.endsWith(src)) {
       // Fade out then change
       if (isPlaying) {
         let vol = audioRef.current.volume;
         const fade = setInterval(() => {
           vol -= 0.1;
           if (vol <= 0) {
             clearInterval(fade);
             if (audioRef.current) audioRef.current.volume = 0;
             changeTrack();
           } else {
             if (audioRef.current) audioRef.current.volume = vol;
           }
         }, 50);
       } else {
         changeTrack();
       }
    } else if (!audioRef.current.src) {
        changeTrack();
    }
  }, [phase]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        let vol = 1;
        const fade = setInterval(() => {
           vol -= 0.1;
           if (vol <= 0) {
             clearInterval(fade);
             if (audioRef.current) {
               audioRef.current.volume = 0;
               audioRef.current.pause();
             }
           } else {
             if (audioRef.current) audioRef.current.volume = vol;
           }
        }, 30);
      } else {
        audioRef.current.volume = 0;
        const promise = audioRef.current.play();
        if (promise !== undefined) {
          promise.then(() => {
             let vol = 0;
             const fade = setInterval(() => {
                vol += 0.1;
                if (vol >= 1) {
                  clearInterval(fade);
                  if (audioRef.current) audioRef.current.volume = 1;
                } else {
                  if (audioRef.current) audioRef.current.volume = vol;
                }
             }, 30);
          }).catch((error) => {
            console.log("Audio play failed", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      setSongTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      audioRef.current.play();
      audioRef.current.volume = 1;
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);
    
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  if (phase === 'none') return null;

  return (
    <>
      <audio ref={audioRef} loop preload="auto" />
      
      <div className="fixed top-4 right-4 z-50 flex items-start justify-end interactive">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              className="mr-3 bg-black/80 backdrop-blur-md rounded-3xl p-3 flex items-center gap-4 text-white pr-6"
            >
              <div className={cn("w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center shrink-0 shadow-lg overflow-hidden", isPlaying && "animate-[pulse_2s_ease-in-out_infinite]")}>
                <Disc className={cn("w-6 h-6 text-white", isPlaying && "animate-[spin_4s_linear_infinite]")} />
              </div>
              <div className="flex flex-col flex-1 overflow-hidden min-w-[140px]">
                <span className="text-[10px] uppercase tracking-widest text-white/50">Now Playing</span>
                <span className="text-sm font-bold truncate max-w-[150px]">{songTitle}</span>
              </div>
              
              <div className="w-[1px] h-8 bg-white/20 mx-1" />
              
              <label 
                className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors group relative cursor-none" 
                title="Upload your own song"
                onClick={() => playSound('click')}
              >
                <input type="file" accept="audio/*" className="hidden" onChange={handleUpload} />
                <Upload className="w-4 h-4 text-white/70 group-hover:text-white" />
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => playSound('click')}
          onClick={() => {
             if(!isOpen && !isPlaying) togglePlay();
             if(isOpen) togglePlay();
             setIsOpen(true);
             playSound('click');
          }}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-md cursor-none",
            isPlaying ? "bg-black/40 text-pink-400 hover:bg-black/60" : "bg-white/40 text-purple-600 hover:bg-white/60"
          )}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
        </motion.button>
      </div>
    </>
  );
}
