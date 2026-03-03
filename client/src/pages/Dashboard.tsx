import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [docs, setDocs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await axios.get(`${API_URL}/docs`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${API_URL}/docs/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setFile(null);

      // 🔥 Immediately open document after upload
      navigate(`/learn/${res.data._id}?tab=document`);
    } catch (err) {
      alert("Upload failed. Ensure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const deleteDoc = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete(`${API_URL}/docs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const openDocument = (docId: string) => {
    navigate(`/learn/${docId}?tab=document`);
  };

  const StatCard = ({ title, value }: any) => (
    <div className="bg-[#1e293b] p-6 rounded-2xl">
      <h4 className="text-slate-400 text-sm mb-2">{title}</h4>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <p className="text-slate-400">
          Upload and manage your PDF documents for learning
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Documents" value={docs.length} />
        <StatCard title="Flashcards" value="0" />
        <StatCard title="Quizzes Taken" value="0" />
        <StatCard title="Avg Score" value="0%" />
      </div>

      {/* UPLOAD AREA */}
      <div className="bg-[#1e293b] border border-dashed border-slate-600 rounded-2xl p-16 text-center mb-12">
        <FileUp className="mx-auto mb-4 text-slate-400" size={40} />
        <h3 className="text-xl font-semibold mb-2">Upload Your PDF</h3>
        <p className="text-slate-400 mb-6">
          Drag and drop your PDF here, or click to select a file
        </p>

        <form
          onSubmit={handleUpload}
          className="flex flex-col items-center gap-4"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="hidden"
            id="fileUpload"
          />

          <label
            htmlFor="fileUpload"
            className="px-6 py-3 bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700"
          >
            {file ? file.name : "Choose File"}
          </label>

          {file && (
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </form>
      </div>

      {/* RECENT DOCUMENTS */}
      <h2 className="text-xl font-semibold mb-6">Recent Documents</h2>

      {docs.length === 0 ? (
        <div className="bg-[#1e293b] p-6 rounded-xl text-slate-400">
          No documents yet. Upload your first PDF to get started!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <div
              key={doc._id}
              className="bg-[#1e293b] p-6 rounded-2xl hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-3 text-white">
                {doc.name}
              </h3>

              <p className="text-sm text-slate-400 mb-6">
                Added on{" "}
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openDocument(doc._id)}
                  className="bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Study
                </button>

                <button
                  onClick={() => deleteDoc(doc._id)}
                  className="bg-red-600 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};