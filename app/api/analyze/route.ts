import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { argumentType, content } = await request.json();

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ useMock: true });
    }

    const response = await fetch(process.env.HUGGINGFACE_URL || "", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: `Analyze this ${argumentType} for logical fallacies and argument strength. Respond ONLY with valid JSON in this exact format:
{"fallacies": ["fallacy1", "fallacy2"], "strength": 75, "feedback": "explanation"}

Argument to analyze: "${content}"

JSON response:`,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      console.error("HuggingFace API error:", response.status);
      return NextResponse.json({ useMock: true });
    }

    const data = await response.json();

    const generatedText = data[0]?.generated_text || "";

    const jsonMatch = generatedText.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        fallacies: analysis.fallacies || [],
        strength: analysis.strength || 50,
        feedback: analysis.feedback || "Analysis completed",
      });
    }

    return NextResponse.json({ useMock: true });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ useMock: true });
  }
}
