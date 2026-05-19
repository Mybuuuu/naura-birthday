import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { IntroPage } from './components/IntroPage';
import { LockScreen } from './components/LockScreen';
import { EnvelopeScene } from './components/EnvelopeScene';
import { BirthdayLetter } from './components/BirthdayLetter';
import { MemoryScrapbook } from './components/MemoryScrapbook';
import { FinalSurprise } from './components/FinalSurprise';
import { MusicPlayer } from './components/MusicPlayer';
import { CustomCursor } from './components/CustomCursor';
import { DynamicBackground } from './components/DynamicBackground';

type Scene = 'intro' | 'lock' | 'envelope' | 'letter' | 'scrapbook' | 'surprise';

export default function App() {
  const [currentScene, setCurrentScene] = useState<Scene>('intro');
  const [audioPhase, setAudioPhase] = useState<'intro' | 'main' | 'none'>('none');

  return (
    <div className="relative w-full h-screen overflow-hidden text-gray-800 antialiased font-sans flex flex-col items-center justify-center">
      <CustomCursor />
      <DynamicBackground />
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none bg-dot-pattern z-0" />

      
      <MusicPlayer phase={audioPhase} />
      
      <AnimatePresence mode="wait">
        {currentScene === 'intro' && (
          <IntroPage 
            key="intro" 
            onNext={() => {
              setCurrentScene('lock');
              setAudioPhase('intro');
            }} 
          />
        )}

        {currentScene === 'lock' && (
          <LockScreen key="lock" onUnlock={() => setCurrentScene('envelope')} />
        )}
        
        {currentScene === 'envelope' && (
          <EnvelopeScene 
            key="envelope" 
            onOpen={() => {
              setCurrentScene('letter');
              setAudioPhase('main');
            }} 
          />
        )}

        {currentScene === 'letter' && (
          <BirthdayLetter key="letter" onNext={() => setCurrentScene('scrapbook')} />
        )}

        {currentScene === 'scrapbook' && (
           <MemoryScrapbook key="scrapbook" onComplete={() => setCurrentScene('surprise')} />
        )}

        {currentScene === 'surprise' && (
           <FinalSurprise key="surprise" />
        )}
      </AnimatePresence>
    </div>
  );
}
