const { GoogleGenAI } = require("@google/genai");
const Document = require("../models/Document");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ========================================
// HELPER: Extract text safely
// ========================================
function extractText(response) {
  return (
    response?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  );
}

// ========================================
// HELPER: Generate with fallback
// ========================================
async function generateWithFallback(prompt, expectJson = false) {
  const modelsToTry = [
    "models/gemini-2.5-flash",
    "models/gemini-2.5-pro",
  ];

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: expectJson
          ? { responseMimeType: "application/json" }
          : {},
      });

      return response;
    } catch (err) {
      console.log(`Model ${modelName} failed, trying next...`);
    }
  }

  throw new Error("All models failed.");
}

// =====================================================
// CHAT WITH DOCUMENT
// =====================================================
exports.chatWithDoc = async (req, res) => {
  try {
    const { docId } = req.params;
    const { message } = req.body;

    const doc = await Document.findOne({
      _id: docId,
      userId: req.userData.userId,
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const prompt = `
Answer strictly using the document below.
If answer not found, say:
"I don't know based on this document."

Document:
${doc.rawText.substring(0, 10000)}

User Question:
${message}
`;

    const response = await generateWithFallback(prompt);

    const text = extractText(response);

    res.json({ text });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// =====================================================
// GENERATE QUIZ
// =====================================================
exports.generateQuiz = async (req, res) => {
  try {
    const { docId } = req.params;

    const doc = await Document.findOne({
      _id: docId,
      userId: req.userData.userId,
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const prompt = `
Generate 5 multiple choice questions from the document below.

Return STRICT JSON ONLY.
No markdown.
No extra text.

Format:
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "string"
  }
]

Document:
${doc.rawText.substring(0, 10000)}
`;

    const response = await generateWithFallback(prompt, true);

    const text = extractText(response);

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (error) {
    console.error("Quiz Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// =====================================================
// GENERATE FLASHCARDS
// =====================================================
exports.generateFlashcards = async (req, res) => {
  try {
    const { docId } = req.params;

    const doc = await Document.findOne({
      _id: docId,
      userId: req.userData.userId,
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const prompt = `
Generate 8 flashcards from the document below.

Return STRICT JSON ONLY.

Format:
[
  {
    "question": "string",
    "answer": "string"
  }
]

Document:
${doc.rawText.substring(0, 10000)}
`;

    const response = await generateWithFallback(prompt, true);

    const text = extractText(response);

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (error) {
    console.error("Flashcard Error:", error);
    res.status(500).json({ error: error.message });
  }
};