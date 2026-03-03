import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface Props {
  docId: string;
  token: string;
}

const API_URL = "http://localhost:5000/api";

export const ProgressView = ({ docId, token }: Props) => {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/progress/${docId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProgress(res.data);
    } catch (err) {
      console.log("No progress found yet.");
      setProgress({
        flashcardsCompleted: 0,
        quizScore: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white">
        <Loader2 className="animate-spin" />
        Loading progress...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold">Your Progress</h2>

      {/* Flashcards */}
      <div className="bg-[#1e293b] p-6 rounded-2xl">
        <h3 className="mb-3 text-lg font-semibold">Flashcards Completed</h3>

        <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-4"
            style={{
              width: `${progress.flashcardsCompleted || 0}%`,
            }}
          />
        </div>

        <p className="mt-2 text-slate-400">
          {progress.flashcardsCompleted || 0}% mastered
        </p>
      </div>

      {/* Quiz Score */}
      <div className="bg-[#1e293b] p-6 rounded-2xl">
        <h3 className="mb-3 text-lg font-semibold">Quiz Score</h3>

        <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-4"
            style={{
              width: `${progress.quizScore || 0}%`,
            }}
          />
        </div>

        <p className="mt-2 text-slate-400">
          {progress.quizScore || 0}% average score
        </p>
      </div>

    </div>
  );
};