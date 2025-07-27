// /api/chat/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/app/lib/supabaseClient";

export const runtime = "nodejs";

interface PlayerCharacter {
  name: string;
  sunSign: string;
  motivation: "personal" | "investigative" | "accidental";
}

function formatCharacters(characters: PlayerCharacter[]) {
  return characters
    .map(
      (c) =>
        `- **${c.name}** (${c.sunSign}) — drawn in by ${c.motivation} motives.`
    )
    .join("\n");
}

export async function POST(req: Request) {
  const body = await req.json();
  const { game_id, characters, new_response } = body || {};

  const isFirstStep = new_response?.step_number === 0;

  const { data: priorResponses } = await supabase
    .from("player_responses")
    .select("content, player_id")
    .eq("game_id", game_id)
    .order("created_at", { ascending: true });

  const responseMessages =
    priorResponses?.map((r: any) => ({
      role: "user",
      content: `${r.player_id} responds: ${r.content}`,
    })) || [];

  if (new_response?.player_id && new_response?.content) {
    responseMessages.push({
      role: "user",
      content: `${new_response.player_id} responds: ${new_response.content}`,
    });
  }

  const systemPrompt = isFirstStep
    ? `Design the opening scene of a surreal investigative cosmic horror RPG. The setup should hint at an ancient force and strange disappearances.

Introduce characters using their zodiac archetypes:

${formatCharacters(characters)}

Begin with eerie tension and mystery. Return only the first short paragraph of the story in clean, spooky Markdown.`
    : `Continue the cosmic horror RPG story based on the following player input.

Reinforce surreal dread, character dynamics, and unfolding mystery.

Characters:
${formatCharacters(characters)}

Respond with one short paragraph in clean, spooky Markdown.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      stream: true,
      messages: [{ role: "user", content: systemPrompt }, ...responseMessages],
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let cleanNarrative = "";

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);

          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const json = line.replace("data: ", "").trim();
              if (json && json !== "[DONE]") {
                try {
                  const parsed = JSON.parse(json);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    cleanNarrative += content;
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  console.error("Error parsing chunk", json);
                }
              }
            }
          }
        }

        // determine step number
        let stepNumber = 0;
        if (new_response?.step_number !== undefined) {
          stepNumber = new_response.step_number;
        } else {
          const { data: existing } = await supabase
            .from("scenario_steps")
            .select("step_number")
            .eq("game_id", game_id)
            .order("step_number", { ascending: false })
            .limit(1);

          stepNumber = existing?.[0]?.step_number + 1 || 0;
        }

        await supabase.from("scenario_steps").insert([
          {
            game_id,
            step_number: stepNumber,
            ai_markdown: cleanNarrative.trim(),
          },
        ]);
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
