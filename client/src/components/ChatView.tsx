import { useState } from "react";
import axios from "axios";

interface Props {
  docId: string;
  token: string;
}

export const ChatView = ({ docId, token }: Props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    setLoading(true);
    setMessages([...messages, { role: "user", content: message }]);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/ai/chat/${docId}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.data.reply }
      ]);
    } catch (err) {
      console.error(err);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div>
      <div className="h-96 overflow-y-auto bg-[#1e293b] p-4 rounded-xl mb-4">
        {messages.map((m, i) => (
          <div key={i} className="mb-3">
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 rounded bg-slate-800"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};