import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Natural Language Search & Intent Parser
app.post("/api/ai/parse-intent", async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const ai = getAIClient();
    if (!ai) {
      // Fallback rule-based parsing if no API key is provided
      return res.json({
        parsed: fallbackParseQuery(query),
        source: "local-heuristic",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an Accra, Ghana experience recommendation assistant for "Micro Escapes".
Analyze the user's natural language search prompt: "${query}".
Extract structured recommendation inputs:
- intent: one of ["relax", "fun", "date", "explore", "eat", "create", "adventure", "party"] or null
- activity: specific activity (e.g. "bowling", "paint and sip", "pottery", "spa", "hiking", "swimming", "beach", "quad biking", "arcade", "comedy", "brunch", "dinner", "live music") or null
- group: one of ["solo", "partner", "friends", "family", "colleagues"] or null
- maxBudget: number in Ghana Cedis (GH₵) or null (e.g. 100 for "under 100 cedis")
- budgetTier: one of ["under_50", "50_100", "100_200", "200_500", "500_plus"] or null
- location: specific Accra neighborhood if mentioned (e.g. "Osu", "East Legon", "Labone", "Airport", "Cantonments", "Spintex", "Jamestown", "Kokrobite", "Aburi") or "Anywhere"
- timeOfDay: one of ["morning", "afternoon", "evening"] or null
- dayOfWeek: one of ["today", "tomorrow", "saturday", "sunday", "weekday", "weekend"] or null
- aiInsight: 1 warm, concise sentence advising on this escape in Accra.

Respond ONLY with valid JSON in this format:
{
  "intent": string | null,
  "activity": string | null,
  "group": string | null,
  "maxBudget": number | null,
  "budgetTier": string | null,
  "location": string | null,
  "timeOfDay": string | null,
  "dayOfWeek": string | null,
  "aiInsight": string
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({
      parsed: parsedJson,
      source: "gemini",
    });
  } catch (error) {
    console.warn("Gemini intent parse error, using fallback:", error);
    return res.json({
      parsed: fallbackParseQuery(query),
      source: "fallback",
    });
  }
});

// AI "Build My Day" Itinerary Generator
app.post("/api/ai/build-my-day", async (req, res) => {
  const { budget, area, day, group, mood } = req.body;
  try {
    const ai = getAIClient();
    if (!ai) {
      return res.json({
        itinerary: generateFallbackItinerary(budget, area, day, group, mood),
        source: "heuristic",
      });
    }

    const prompt = `Create a realistic, exciting Day Itinerary in Accra, Ghana for "Micro Escapes".
Context:
- Target Day: ${day || "Saturday"}
- Maximum Budget: GH₵${budget || 250}
- Neighborhood/Area: ${area || "Osu / Labone / East Legon"}
- Group Type: ${group || "Friends"}
- Mood / Intention: ${mood || "Have fun & unwind"}

Format the response as JSON:
{
  "title": "${day || "Saturday"} Micro Escape",
  "totalEstimatedCost": number,
  "curatorNote": "Short paragraph on why this itinerary works so well together",
  "timeline": [
    {
      "time": "10:30 AM",
      "activity": "Activity Name",
      "venueName": "Real or authentic Accra venue name",
      "neighborhood": "Osu",
      "estimatedCost": 45,
      "description": "What to do and why it fits the mood",
      "tag": "Brunch" | "Creative" | "Scenic" | "Adventure" | "Games" | "Nightlife"
    }
  ]
}
Ensure costs are realistic in Ghana Cedis (GH₵) and sum up to roughly <= ${budget || 250}. Include 3-4 distinct stops.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const itinerary = JSON.parse(response.text || "{}");
    return res.json({ itinerary, source: "gemini" });
  } catch (error) {
    console.warn("Gemini build-my-day error, using fallback:", error);
    return res.json({
      itinerary: generateFallbackItinerary(budget, area, day, group, mood),
      source: "fallback",
    });
  }
});

function fallbackParseQuery(query: string) {
  const q = query.toLowerCase();
  let intent: string | null = null;
  if (q.includes("relax") || q.includes("chill") || q.includes("peace") || q.includes("spa")) intent = "relax";
  else if (q.includes("fun") || q.includes("game") || q.includes("bowl") || q.includes("arcade")) intent = "fun";
  else if (q.includes("date") || q.includes("romantic") || q.includes("couple")) intent = "date";
  else if (q.includes("eat") || q.includes("food") || q.includes("dinner") || q.includes("lunch") || q.includes("brunch")) intent = "eat";
  else if (q.includes("create") || q.includes("paint") || q.includes("pottery") || q.includes("art")) intent = "create";
  else if (q.includes("adventure") || q.includes("hike") || q.includes("quad") || q.includes("horse")) intent = "adventure";
  else if (q.includes("party") || q.includes("club") || q.includes("lounge") || q.includes("dance")) intent = "party";
  else if (q.includes("explore") || q.includes("walk") || q.includes("sight")) intent = "explore";

  let group: string | null = null;
  if (q.includes("solo") || q.includes("myself") || q.includes("alone")) group = "solo";
  else if (q.includes("partner") || q.includes("date") || q.includes("girlfriend") || q.includes("boyfriend") || q.includes("wife") || q.includes("husband")) group = "partner";
  else if (q.includes("friend") || q.includes("crew") || q.includes("boys") || q.includes("girls")) group = "friends";
  else if (q.includes("family") || q.includes("kids")) group = "family";

  let location: string | null = null;
  const neighborhoods = ["Osu", "East Legon", "Labone", "Airport", "Cantonments", "Spintex", "Jamestown", "Kokrobite", "Aburi", "Dzorwulu"];
  for (const n of neighborhoods) {
    if (q.includes(n.toLowerCase())) {
      location = n;
      break;
    }
  }

  let activity: string | null = null;
  const activities = ["bowling", "paint and sip", "pottery", "spa", "hiking", "swimming", "beach", "go karting", "arcade", "comedy", "horse riding", "board games"];
  for (const act of activities) {
    if (q.includes(act)) {
      activity = act;
      break;
    }
  }

  let maxBudget: number | null = null;
  const budgetMatch = q.match(/(?:under|below|less than|budget of|for|gh[c₵]?\s*)(\d{2,4})/i);
  if (budgetMatch) {
    maxBudget = parseInt(budgetMatch[1], 10);
  }

  let dayOfWeek: string | null = null;
  if (q.includes("saturday")) dayOfWeek = "saturday";
  else if (q.includes("sunday")) dayOfWeek = "sunday";
  else if (q.includes("today")) dayOfWeek = "today";
  else if (q.includes("tomorrow")) dayOfWeek = "tomorrow";
  else if (q.includes("weekend")) dayOfWeek = "saturday";

  let timeOfDay: string | null = null;
  if (q.includes("morning")) timeOfDay = "morning";
  else if (q.includes("afternoon")) timeOfDay = "afternoon";
  else if (q.includes("evening") || q.includes("night")) timeOfDay = "evening";

  return {
    intent,
    activity,
    group,
    maxBudget,
    budgetTier: maxBudget ? (maxBudget <= 50 ? "under_50" : maxBudget <= 100 ? "50_100" : maxBudget <= 200 ? "100_200" : maxBudget <= 500 ? "200_500" : "500_plus") : null,
    location: location || "Anywhere",
    timeOfDay,
    dayOfWeek,
    aiInsight: "Filtered our curated Accra database to match your specific escape criteria."
  };
}

function generateFallbackItinerary(budget = 250, area = "Osu / Labone", day = "Saturday", group = "Friends", mood = "Have fun") {
  return {
    title: `${day} Accra Micro Escape`,
    totalEstimatedCost: Math.min(budget, 240),
    curatorNote: `Hand-crafted for ${group.toLowerCase()} looking to ${mood.toLowerCase()} in ${area} while staying under GH₵${budget}.`,
    timeline: [
      {
        time: "10:30 AM",
        activity: "Artisan Brunch & Fresh Juice",
        venueName: "Jamestown Coffee & Garden / Cafe Kwae",
        neighborhood: area === "Anywhere" ? "Labone" : area,
        estimatedCost: 65,
        description: "Start unhurried with specialty Ghanaian roast coffee, savory plantain waffles, and a calm courtyard breeze.",
        tag: "Brunch"
      },
      {
        time: "1:00 PM",
        activity: "Interactive Group Fun & Games",
        venueName: "Bliss Family Entertainment / The Alley Board Games",
        neighborhood: "Airport / East Legon",
        estimatedCost: 85,
        description: "High-energy bowling frames, nostalgic retro arcade bouts, and ice-breaker board games.",
        tag: "Games"
      },
      {
        time: "4:30 PM",
        activity: "Sunset Ocean Breeze Walk & Chill",
        venueName: "Sandbox Beach Club / Labadi Coast",
        neighborhood: "Labadi / South Osu",
        estimatedCost: 40,
        description: "Golden hour sea breeze, coconut water, fresh breeze, and good music as the Atlantic waves roll in.",
        tag: "Scenic"
      },
      {
        time: "7:00 PM",
        activity: "Cozy Open-Air Ghanaian Bites",
        venueName: "Buka Restaurant / Asanka Local Courtyard",
        neighborhood: "Osu",
        estimatedCost: 50,
        description: "Tender grilled tilapia, spicy kelewele, and chilled Bissap in an authentic bamboo-shaded courtyard.",
        tag: "Dinner"
      }
    ]
  };
}

async function startServer() {
  const landingPath = path.join(process.cwd(), "landing-page");
  app.use("/landing", express.static(landingPath));
  app.use("/landing-page", express.static(landingPath));
  app.use(express.static(landingPath));

  app.get("/", (_req, res) => {
    res.sendFile(path.join(landingPath, "index.html"));
  });

  app.get(["/landing", "/landing/*", "/landing-page", "/landing-page/*"], (_req, res) => {
    res.sendFile(path.join(landingPath, "index.html"));
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Micro Escapes server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
