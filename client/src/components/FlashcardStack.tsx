import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

export const FlashcardStack = ({ cards }: { cards: any[] }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) return <div>No cards generated yet.</div>;

  const nextCard = () => { 
    setIndex((i) => (i + 1) % cards.length); 
    setFlipped(false); 
  };

  const prevCard = () => {
    setIndex((i) => (i - 1 + cards.length) % cards.length); 
    setFlipped(false); 
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto py-10">
      <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">
        Card {index + 1} of {cards.length}
      </div>
      
      <div 
        className="relative w-full aspect-[16/10] cursor-pointer perspective-1000"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="w-full h-full relative preserve-3d"
        >
          {/* Front */}
          <div className="absolute inset-0 bg-white dark:bg-slate-800 p-8 rounded-2xl border-2 dark:border-slate-700 flex flex-col items-center justify-center text-center backface-hidden shadow-xl">
            <span className="text-xs text-indigo-500 font-bold mb-4">QUESTION</span>
            <p className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white">{cards[index].question}</p>
            <div className="mt-8 text-slate-400 flex items-center gap-2 text-sm italic">
                <RefreshCw size={14} /> Click to flip
            </div>
          </div>
          
          {/* Back */}
          <div className="absolute inset-0 bg-indigo-600 p-8 rounded-2xl border-2 border-indigo-500 flex flex-col items-center justify-center text-center rotate-y-180 backface-hidden shadow-xl">
            <span className="text-xs text-indigo-100 font-bold mb-4">ANSWER</span>
            <p className="text-lg md:text-xl font-medium text-white">{cards[index].answer}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); prevCard(); }} 
          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }} 
          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
