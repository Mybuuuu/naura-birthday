import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface BirthdayWishesProps {
  onNext: () => void;
}

const WISHES = [
  { text: "Happy birthday Naura! semoga makin bahagia terus \ud83c\udf89", sender: "GamerGirl99", color: "bg-blue-100/90 text-blue-800 border-blue-200" },
  { text: "Terima kasih udah selalu seru mabar bareng \ud83d\ude06", sender: "ProNoob", color: "bg-pink-100/90 text-pink-800 border-pink-200" },
  { text: "Semoga semua harapan kamu tercapai tahun ini \u2728", sender: "StarPlayer", color: "bg-purple-100/90 text-purple-800 border-purple-200" },
  { text: "jangan lupa mandi nau\ud83d\ude0e", sender: "AfkMaster", color: "bg-green-100/90 text-green-800 border-green-200" },
  { text: "Jangan lupa tetap jadi Naura yang rame dan baik", sender: "RobloxKing", color: "bg-yellow-100/90 text-yellow-800 border-yellow-200" },
];

export function BirthdayWishes({ onNext }: BirthdayWishesProps) {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center p-6 z-20 overflow-y-auto overflow-x-hidden no-scrollbar pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div 
        className="w-full max-w-md mt-16 flex flex-col gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.6 }
          }
        }}
      >
        <div className="text-center mb-8">
          <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="font-serif italic text-3xl text-purple-800">Server Chat</h2>
        </div>

        {WISHES.map((wish, idx) => (
          <motion.div 
            key={idx}
            variants={{
              hidden: { opacity: 0, x: idx % 2 === 0 ? -50 : 50, y: 20 },
              show: { opacity: 1, x: 0, y: 0, transition: { type: "spring", bounce: 0.4 } }
            }}
            className={`relative p-4 rounded-2xl shadow-md border backdrop-blur-sm ${wish.color} ${idx % 2 === 0 ? 'rounded-tl-sm self-start mr-8' : 'rounded-tr-sm self-end ml-8'}`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60">[{wish.sender}]</div>
            <p className="font-sans font-medium text-lg">{wish.text}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        className="fixed bottom-10 px-8 py-3 bg-white/80 backdrop-blur-md font-sans font-bold text-purple-600 rounded-full shadow-xl border border-purple-100 hover:bg-white transition-all active:scale-95 uppercase tracking-widest text-sm z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.5 }}
        onClick={onNext}
      >
        Open Scrapbook \u2728
      </motion.button>
    </motion.div>
  );
}
