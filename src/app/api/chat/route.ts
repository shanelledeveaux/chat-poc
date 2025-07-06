import { NextResponse } from "next/server";

export const runtime = "edge";

interface PlayerCharacter {
  name: string;
  sunSign: string;
  motivation: "personal" | "investigative" | "accidental";
}

function formatCharacters(characters: PlayerCharacter[]) {
  return characters
    .map(
      (c, i) =>
        `- **${c.name}** (${c.sunSign}) — drawn in by ${c.motivation} motives.`
    )
    .join("\n");
}

export async function POST(req: Request) {
  const { question, characters } = await req.json();
  console.log(characters);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      stream: true,
      messages: [
        // { role: 'system', content: 'Use the following search snippets to answer the question.' },
        // { role: 'user', content: `${context}\n\nQuestion: ${question}` },
        {
          role: "user",
          content: `Design a compact, investigative cosmic horror RPG scenario in alignment with: ${question}.
The mystery should center around disappearances, strange sightings, and an ancient otherworldly force.

Incorporate the following player characters into the story. Create character-specific hooks and interpersonal dynamics rooted in their zodiac archetypes:

${formatCharacters(characters)}

Include up to 2 interconnected locations, 1-3 clues per location, and a supernatural threat linked to forbidden knowledge or an artifact.
Build a mood of dread and reality distortion. Include rules-light scenario guidance and output in Markdown that can be displayed on the web.`,
        },
      ],
    }),
  });

  console.log({ response });

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
