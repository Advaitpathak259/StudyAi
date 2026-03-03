import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BrainCircuit, Sparkles } from 'lucide-react';

export const Home = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8">
          <Sparkles size={16} />
          <span>Powered by Gemini 1.5 Professional</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
          Learn Faster with <span className="text-indigo-600">AI Assistance</span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          Upload your lecture notes, research papers, or textbooks. Lumina transforms them into interactive quizzes, flashcards, and a personal AI tutor.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
            Get Started Free <ArrowRight size={20} />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 transition">
            See How it Works
          </a>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 text-left" id="features">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
              <BrainCircuit size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">AI-Powered Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400">Deep context understanding ensures your study materials are accurate and concise.</p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Interactive Modules</h3>
            <p className="text-slate-600 dark:text-slate-400">Automatically generate flashcards and quizzes derived directly from your PDFs.</p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Contextual Chat</h3>
            <p className="text-slate-600 dark:text-slate-400">Query your documents like a pro. Our AI knows exactly what's inside the text.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
