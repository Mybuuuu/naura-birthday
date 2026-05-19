import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface BirthdayLetterProps {
  onNext: () => void;
}

export function BirthdayLetter({ onNext }: BirthdayLetterProps) {
  const line1 = "Happy Birthday Naura 🎉";
  const line2 = "Selamat ulang tahun yaa!";
  const line3 = "Semoga di umur yang baru ini semua hal baik datang satu-satu ke hidup kamu.";
  const line4 = "Terima kasih karena selama ini udah jadi teman mabar yang seru,";
  const line5 = "teman ngobrol yang rame,";
  const line6 = "dan orang yang selalu bikin suasana jadi ga sepi.";
  const line7 = "Semoga semua yang kamu harapkan tahun ini pelan-pelan tercapai,";
  const line8 = "dan semoga kamu selalu dikelilingi orang-orang yang sayang sama kamu.";
  const line9 = "Have a wonderful level up day 🌸";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.8, delayChildren: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }}
    >
      <motion.div 
        className="relative w-full max-w-xl bg-white/90 p-8 md:p-12 pb-16 mt-32 mb-10 rounded-2xl shadow-2xl shadow-purple-200/50 border border-purple-100 backdrop-blur-md"
        initial={{ rotate: -2, y: 50, opacity: 0 }}
        animate={{ rotate: 1, y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Tape decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-blue-100/80 rounded border border-blue-200 opacity-80 rotate-[3deg] shadow-sm scale-110" />
        
        <div className="w-full h-2 bg-gradient-to-r from-blue-200 via-pink-300 to-purple-300 rounded mb-10 opacity-50"></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="font-serif italic text-lg md:text-xl leading-relaxed text-purple-800 space-y-4 text-center md:text-left"
        >
          <motion.p variants={itemVariants} className="text-3xl md:text-4xl mb-8 font-bold text-pink-500">{line1}</motion.p>
          <motion.p variants={itemVariants}>{line2}</motion.p>
          <motion.p variants={itemVariants}>{line3}</motion.p>
          <motion.p variants={itemVariants} className="pt-4">{line4}</motion.p>
          <motion.p variants={itemVariants}>{line5}</motion.p>
          <motion.p variants={itemVariants}>{line6}</motion.p>
          <motion.p variants={itemVariants} className="pt-4">{line7}</motion.p>
          <motion.p variants={itemVariants}>{line8}</motion.p>
          <motion.p variants={itemVariants} className="pt-8 text-2xl font-bold text-pink-500 drop-shadow-sm">{line9}</motion.p>
          
        </motion.div>

        {/* Floating tiny stickers decoration */}
        <div className="absolute bottom-6 right-8 opacity-60 flex gap-3">
          <Heart className="w-6 h-6 text-pink-400 fill-pink-300 rotate-12" />
          <Heart className="w-5 h-5 text-purple-300 fill-purple-300 -rotate-12" />
        </div>
      </motion.div>

      <motion.button
        className="px-10 py-4 mb-20 bg-white/90 backdrop-blur font-sans font-bold text-purple-600 rounded-full shadow-xl border border-purple-200 hover:bg-white hover:scale-105 transition-all active:scale-95 uppercase tracking-widest text-sm z-30 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 9, duration: 1 }}
        onClick={onNext}
      >
        See Memories ✨
      </motion.button>
    </motion.div>
  );
}
