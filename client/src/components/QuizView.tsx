import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const QuizView = ({ quiz, docId }: { quiz: any[], docId: string }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (selected === quiz[currentIdx].correctIndex) {
      setScore(score + 1);
    }

    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl text-center shadow-lg border border-indigo-100 dark:border-slate-700"
      >
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">You scored {score} out of {quiz.length}</p>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 mb-8 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(score / quiz.length) * 100}%` }}
            className="bg-indigo-600 h-full"
          />
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Retake Quiz
        </button>
      </motion.div>
    );
  }

  const q = quiz[currentIdx];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 fle items-center justify-between">
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">QUESTION {currentIdx + 1} OF {quiz.length}</span>
      </div>
      
      <h3 className="text-xl font-semibold mb-8 text-slate-800 dark:text-white">{q.question}</h3>

      <div className="space-y-3">
        {q.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            disabled={selected !== null}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                selected === i 
                ? (i === q.correctIndex ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20')
                : (selected !== null && i === q.correctIndex ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600')
            } ${selected !== null ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span className="dark:text-slate-200">{opt}</span>
            {selected === i && (
              i === q.correctIndex ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />
            )}
            {selected !== null && i === q.correctIndex && i !== selected && <CheckCircle2 className="text-green-500" />}
          </button>
        ))}
      </div>

      {selected !== null && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
            <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold">Explanation:</span> {q.explanation}</p>
        </motion.div>
      )}

      <button
        disabled={selected === null}
        onClick={handleNext}
        className="mt-8 w-full py-4 bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2"
      >
        {currentIdx === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
