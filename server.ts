/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize the Google GenAI SDK gracefully
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Google GenAI SDK initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Google GenAI SDK:", err);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is missing. Running in simulator-fallback mode.");
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Translate API: One-click translate for comments, posts, messages
app.post("/api/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: "Missing required parameters: text, targetLanguage." });
  }

  // If Gemini is not configured, fallback to high-fidelity mock translation
  if (!ai) {
    console.log(`Fallback translation triggered for language: ${targetLanguage}`);
    const simulatedTranslations: Record<string, string> = {
      Spanish: `[Simulado] ${text} (Traducido al Español)`,
      German: `[Simuliert] ${text} (Ins Deutsche übersetzt)`,
      Russian: `[Имитация] ${text} (Переведено на Русский)`,
      French: `[Simulé] ${text} (Traduit en Français)`,
      Japanese: `[シミュレート済] ${text} (日本語訳)`,
    };
    const translatedText = simulatedTranslations[targetLanguage] || `[Simulated Translation to ${targetLanguage}] ${text}`;
    return res.json({ translatedText, isFallback: true });
  }

  try {
    const prompt = `Translate the following user text into the target language. Keep the original formatting and tone. Only return the translated text without any explanation, markdown boxes, or intro text.
Target Language: ${targetLanguage}
Text to translate:
"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const translatedText = response.text?.trim() || text;
    res.json({ translatedText, isFallback: false });
  } catch (error: any) {
    console.error("Translation API error:", error);
    res.json({ translatedText: `[Translation Error: ${error.message || error}] ${text}`, isFallback: true });
  }
});

// Moderation API: Profanity Filter & AI Toxicity Detection
app.post("/api/moderate", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing required parameter: text." });
  }

  // If Gemini is not configured, perform standard regex profanity check
  if (!ai) {
    const profaneWords = ["badword", "spam123", "abuse", "harass", "nudity"];
    const hasProfanity = profaneWords.some((word) => text.toLowerCase().includes(word));
    return res.json({
      flagged: hasProfanity,
      score: hasProfanity ? 0.95 : 0.05,
      reason: hasProfanity ? "Contains simulated blocked keywords" : "Passed offline checks",
      isFallback: true,
    });
  }

  try {
    const prompt = `Analyze the following text submitted by a user on a premium fitness creator platform. Determine if it violates safety standards (spam, extreme profanity, severe toxicity, explicit nudity mentions, abuse, or heavy harassment). 
Return a JSON response conforming strictly to the requested schema. Do not output anything other than raw JSON.

Text to analyze:
"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flagged: {
              type: Type.BOOLEAN,
              description: "Whether the content contains toxic language, spam, or abuse.",
            },
            score: {
              type: Type.NUMBER,
              description: "Toxicity level from 0.0 (completely safe) to 1.0 (highly toxic).",
            },
            reason: {
              type: Type.STRING,
              description: "Brief rationale of why the content was or was not flagged.",
            },
          },
          required: ["flagged", "score", "reason"],
        },
      },
    });

    const parsedResult = JSON.parse(response.text?.trim() || "{}");
    res.json({ ...parsedResult, isFallback: false });
  } catch (error: any) {
    console.error("Moderation API error:", error);
    res.json({ flagged: false, score: 0.1, reason: "Bypassed due to moderation offline state.", isFallback: true });
  }
});

// AI Coaching Assistant: Helps trainers draft professional responses
app.post("/api/ai-coaching", async (req, res) => {
  const { traineeName, questionTitle, questionText, fitnessData } = req.body;

  if (!questionTitle || !questionText) {
    return res.status(400).json({ error: "Missing required parameters: questionTitle, questionText." });
  }

  if (!ai) {
    const simulatedAdvice = `Hello ${traineeName || "Athlete"},\n\nThank you for reaching out regarding: "${questionTitle}". Based on your question, I recommend focusing on your movement mechanics at lower percentages first. Ensure you are maintaining a stable pelvis and solid foot contact. Add 3 sets of targeted activation work before your main sessions. Let's monitor this for the next week!\n\nBest,\nYour Coach [Simulated Draft]`;
    return res.json({ draft: simulatedAdvice, isFallback: true });
  }

  try {
    const prompt = `You are an elite professional personal trainer. Draft a constructive, highly expert, yet accessible athletic coaching response for a trainee client.
Trainee Name: ${traineeName || "Athlete"}
Trainee Fitness Background: ${fitnessData || "Regular Trainee"}
Client's Question: "${questionTitle} - ${questionText}"

Write the response in an encouraging, highly professional, gym-inspired, scientific tone. Break down the mechanical cue clearly. Keep it under 150 words. Do not prefix the draft with 'Here is your draft' or similar intro sentences.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const draft = response.text?.trim() || "Please follow up in your personal portal.";
    res.json({ draft, isFallback: false });
  } catch (error: any) {
    console.error("AI Coaching API error:", error);
    res.json({ draft: `Error generating draft: ${error.message || error}`, isFallback: true });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", geminiConfigured: !!ai });
});

// -------------------------------------------------------------
// Vite and Static File Handling
// -------------------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LEER Sports server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
