import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini to prevent crashes on startup if key is missing
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// API recommendation endpoint
app.post("/api/recommend", async (req: express.Request, res: express.Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const client = getGeminiClient();
  if (!client) {
    // If key is missing, throw to let the client trigger local lightweight fallback
    return res.status(503).json({ error: "Gemini Key not configured" });
  }

  try {
    const systemPrompt = `
      Ты — искусственный интеллект системы Ritual (приложение для восстановления внимания и состояния).
      Пользователь высказывает свое текущее состояние, усталость или тревогу на русском языке.
      Тебе нужно проанализировать его слова и подобрать ОДИН самый полезный ритуал из следующих категорий:
      
      Группа "Исток" (для паники, острой тревоги, сильного физического зажима):
      - Идентификатор: "5-4-3-2-1" | Название: "5-4-3-2-1: Нейро-сброс" | Длительность: "5:30"
      - Идентификатор: "physiological_breath" | Название: "Физиологический вздох" | Длительность: "4:30"
      - Идентификатор: "square_breath" | Название: "Квадратное дыхание" | Длительность: "5:15"
      - Идентификатор: "body_scan" | Название: "Сканирование тела" | Длительность: "7:00"

      Группа "Тишина" (для утомления, бессонницы, вечернего хаоса, отпускания контроля):
      - Идентификатор: "night_journal" | Название: "Ночной дневник" | Длительность: "7:30"
      - Идентификатор: "night_scan" | Название: "Сканирование отпускания" | Длительность: "7:00"
      - Идентификатор: "compassion" | Название: "Самосострадание" | Длительность: "7:00"
      - Идентификатор: "zero_point" | Название: "Нулевая точка" | Длительность: "15:00"

      Группа "Энергия" (для упадка сил, апатии, сонного утра, восстановления воли):
      - Идентификатор: "day_code" | Название: "Код дня" | Длительность: "5:20"
      - Идентификатор: "fire_breath" | Название: "Огненное дыхание" | Длительность: "5:05"
      - Идентификатор: "internal_sun" | Название: "Внутренний жар" | Длительность: "9:20"

      Группа "Ясность" (для путаницы в целях, рассеянности, планирования):
      - Идентификатор: "goals_map" | Название: "Карта целей" | Длительность: "15:00"
      - Идентификатор: "priorities" | Название: "Расстановка приоритетов" | Длительность: "5:00"
      - Идентификатор: "evening_reflection" | Название: "Вечерняя рефлексия" | Длительность: "5:00"

      Ответь строго в формате JSON, без кавычек markdown (без \`\`\`json). Формат объекта:
      {
        "response": "короткое эмпатичное сопроводительное предложение на русском языке с уважением и теплотой (максимум 2 предложения), описывающее его состояние",
        "ritual": {
          "id": "выбранный идентификатор",
          "title": "выбранное название",
          "duration": "длительность",
          "group": "Исток" или "Тишина" или "Энергия" или "Ясность",
          "whyText": "краткое научное объяснение в 1 предложении, почему именно этот ритуал отлично поможет сейчас"
        }
      }
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nПользователь сказал: "${query}"` }] }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const outputText = response.text || "{}";
    const cleanedText = outputText
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    const recommendation = JSON.parse(cleanedText);
    res.json(recommendation);
  } catch (error) {
    console.error("Gemini model error:", error);
    res.status(500).json({ error: "Fail to retrieve model recommendation" });
  }
});

// Health data sync endpoint
app.post("/api/sync-health", express.json(), async (req, res) => {
  const { userId, metrics, timestamp } = req.body;
  const { steps, heartRate, sleepHours, hrv, spo2, bodyTemperature } = metrics || {};

  console.log(`[HealthSync] User ${userId}: steps=${steps}, hr=${heartRate}, sleep=${sleepHours}h, hrv=${hrv}, spo2=${spo2}, temp=${bodyTemperature}`);

  let evaluatedState = 'Balance';
  if (heartRate > 95 && steps < 1000) {
    evaluatedState = 'Tension';
  } else if (sleepHours < 5.5) {
    evaluatedState = 'Overload';
  } else if (steps > 8000 && heartRate < 75) {
    evaluatedState = 'Shining';
  } else if (hrv && hrv < 40) {
    evaluatedState = 'Tension';
  } else if (spo2 && spo2 < 95) {
    evaluatedState = 'Overload';
  }

  res.json({
    success: true,
    recommendedState: evaluatedState,
    message: "Метрики успешно проанализированы системой Ritual"
  });
});

// Configure Vite or serve build output
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ritual Server running on http://localhost:${PORT}`);
  });
}

startServer();
