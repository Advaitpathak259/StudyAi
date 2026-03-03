/* import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

import {ChatView} from "../components/ChatView";
import {QuizView} from "../components/QuizView";
import {ProgressView} from "../components/ProgressView";

interface DocumentType {
  _id: string;
  title: string;
  content: string;
}

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab");

  const [documentData, setDocumentData] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/docs/${id}`,
          { withCredentials: true }
        );

        setDocumentData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocument();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!documentData) return <div>Document not found</div>;

  return (
    <div className="p-6">
      {!activeTab && (
        <div>
          <h1 className="text-2xl font-bold">
            {documentData.title}
          </h1>

          <p className="mt-4 whitespace-pre-wrap">
            {documentData.content}
          </p>
        </div>
      )}

      {activeTab === "chat" && id && <ChatView docId={id} />}
      {activeTab === "quiz" && id && <QuizView docId={id} />}
      {activeTab === "progress" && id && <ProgressView docId={id} />}
    </div>
  );
};

export default DocumentView; */