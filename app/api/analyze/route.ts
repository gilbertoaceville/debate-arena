import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { argumentType, content } = await request.json();

    const response = await fetch(`${process.env.ANTHROPIC_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Analyze this ${argumentType} for logical fallacies and argument strength:

"${content}"

Provide your analysis in this exact JSON format (no markdown, just raw JSON):
{
  "fallacies": ["fallacy name 1", "fallacy name 2"],
  "strength": 75,
  "feedback": "Brief explanation of strengths and weaknesses"
}

If no fallacies found, use empty array. Strength is 0-100 where 100 is strongest.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Anthropic API error:", errorData);
      return NextResponse.json(
        { error: "Failed to analyze argument" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
