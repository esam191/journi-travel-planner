import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
  estimatedCost: string;
}

export interface GeneratedItinerary {
  tripTitle: string;
  overview: string;
  days: ItineraryDay[];
  tips: { category: string; advice: string }[];
  estimatedTotalCost: string;
}

function buildPrompt(
  tripTitle: string,
  description: string,
  days: number,
  country: string
): string {
  return `You are an expert travel planner. Generate a detailed ${days}-day travel itinerary.

Trip context:
- Title: ${tripTitle}
- Destination: ${country}
- Description: ${description}
- Duration: ${days} days

Use real, specific place names, restaurants, and attractions. Be practical and time-aware.

Respond ONLY with valid JSON — no markdown, no backticks, no explanation:

{
  "tripTitle": "string",
  "overview": "string (2-3 sentences)",
  "days": [
    {
      "dayNumber": 1,
      "theme": "string (4-6 words)",
      "morning": "string (specific activity + place names)",
      "afternoon": "string (specific activity + place names)",
      "evening": "string (dinner recommendation + evening plan)",
      "estimatedCost": "string (e.g. '$60–$90 per person')"
    }
  ],
  "tips": [
    { "category": "string", "advice": "string" }
  ],
  "estimatedTotalCost": "string (e.g. '$800–$1,200 per person')"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      tripTitle: string;
      description: string;
      days: number;
      country: string;
    };

    const { tripTitle, description, days, country } = body;

    if (!tripTitle || !days || !country) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: buildPrompt(tripTitle, description ?? "", days, country),
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const rawText = completion.choices[0]?.message?.content ?? "";
    const itinerary: GeneratedItinerary = JSON.parse(rawText);

    return NextResponse.json(itinerary);
  } 
  catch (err) {
    console.error("Itinerary generation failed:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}