import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, BookOpen, Brain, Loader2, Send } from 'lucide-react';
import { FlashcardStack } from '../components/FlashcardStack';
import { QuizView } from '../components/QuizView';

const API_URL = 'http://localhost:5000/api';

export const LearningHub = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [doc, setDoc] = useState<any>(null);
  const [tab, setTab] = useState(searchParams.get('tab') || 'chat');
  const [loading, setLoading] = useState(true);

  // Chat state
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Learning Tools State
  const [quiz, setQuiz] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [generatingTools, setGeneratingTools] = useState(false);

  useEffect(() => {
    fetchDoc();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const fetchDoc = async () => {
    try {
      const res = await axios.get(`${API_URL}/docs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDoc(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;

    const userMsg = { role: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setThinking(true);

    try {
      const res = await axios.post(`${API_URL}/ai/chat/${id}`, {
        message: input,
        history: messages
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setMessages(prev => [...prev, { role: 'model', text: res.data.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I keep having trouble reaching my brain cells. Check the API Key.' }]);
    } finally {
      setThinking(false);
    }
  };

  const generateQuiz = async () => {
    setGeneratingTools(true);
    try {
      const res = await axios.get(`${API_URL}/ai/quiz/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setQuiz(res.data);
    } catch (err) {
      alert("Failed to generate quiz. Try again.");
    } finally {
      setGeneratingTools(false);
    }
  };

  const generateFlashcards = async () => {
    setGeneratingTools(true);
    try {
      const res = await axios.get(`${API_URL}/ai/flashcards/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFlashcards(res.data);
    } catch (err) {
      alert("Failed to generate flashcards.");
    } finally {
      setGeneratingTools(false);
    }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      <div className="border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 dark:text-white truncate max-w-sm">{doc?.name}</h2>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setTab('chat')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${tab === 'chat' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500'}`}
          >
            <MessageSquare size={16} /> Chat
          </button>
          <button 
            onClick={() => setTab('cards')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${tab === 'cards' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500'}`}
          >
            <Brain size={16} /> Flashcards
          </button>
          <button 
            onClick={() => setTab('quiz')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${tab === 'quiz' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500'}`}
          >
            <BookOpen size={16} /> Quiz
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
          {tab === 'chat' && (
            <div className="max-w-3xl mx-auto h-full flex flex-col">
              <div ref={scrollRef} className="flex-1 space-y-6 mb-4 overflow-y-auto pr-2 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 font-bold text-2xl">L</div>
                    <h3 className="text-xl font-bold dark:text-white mb-2">How can I help you study?</h3>
                    <p className="text-slate-500 max-w-sm">Ask questions about specific concepts, ask for a summary, or let me clarify complex parts of the document.</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${m.role === 'user' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    </div>
                  </div>
                ))}
                {thinking && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3 flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                        </div>
                    </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about this document..."
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 pr-16 focus:border-indigo-500 outline-none transition dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          )}

          {tab === 'cards' && (
            <div className="h-full">
              {flashcards.length > 0 ? (
                <FlashcardStack cards={flashcards} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                  <Brain size={48} className="text-slate-300 mb-6" />
                  <h3 className="text-xl font-bold dark:text-white mb-2">Flashcards</h3>
                  <p className="text-slate-500 max-w-sm mb-6">Convert your PDF into active recall cards automatically using AI.</p>
                  <button 
                    onClick={generateFlashcards}
                    disabled={generatingTools}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2"
                  >
                    {generatingTools ? <Loader2 className="animate-spin" /> : 'Generate Flashcards'}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'quiz' && (
            <div className="h-full">
              {quiz.length > 0 ? (
                <QuizView quiz={quiz} docId={id!} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                  <BookOpen size={48} className="text-slate-300 mb-6" />
                  <h3 className="text-xl font-bold dark:text-white mb-2">Knowledge Quiz</h3>
                  <p className="text-slate-500 max-w-sm mb-6">Generate a 5-question multiple choice quiz based purely on your content.</p>
                  <button 
                    onClick={generateQuiz}
                    disabled={generatingTools}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2"
                  >
                    {generatingTools ? <Loader2 className="animate-spin" /> : 'Generate Quiz'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Text Context Sidebar (Hidden on mobile) */}
        <div className="hidden lg:block w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Document Content</h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
            {doc?.rawText}
          </p>
        </div>
      </div>
    </div>
  );
};
