// app/api/chat/route.ts (or route.js if you prefer JS)
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { buildSystemPrompt } from "@/app/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PlayerCharacter {
  name: string;
  sunSign: string;
  motivation: "personal" | "investigative" | "accidental";
}

type ChatRole = "system" | "user" | "assistant";

function asOpenAIMsg(role: ChatRole, content: string) {
  return { role, content };
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { gameId, characters = [], new_response } = body || {};

    // Basic input checks (keep lightweight, avoid hard deps)
    if (!gameId || typeof gameId !== "string") {
      return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });
    }
    const validChars =
      Array.isArray(characters) &&
      characters.every(
        (c: any) =>
          c &&
          typeof c.name === "string" &&
          typeof c.sunSign === "string" &&
          ["personal", "investigative", "accidental"].includes(c.motivation)
      );

    if (!validChars) {
      return NextResponse.json({ error: "Invalid characters array" }, { status: 400 });
    }

    // Load history from both tables, oldest->newest
    const [{ data: players, error: pErr }, { data: systems, error: sErr }] = await Promise.all([
      supabase
        .from("player_responses")
        .select("user_id, content, created_at")
        .eq("room", gameId),
      supabase
        .from("system_responses")
        .select("content, created_at")
        .eq("room", gameId),
    ]);

    if (pErr || sErr) {
      return NextResponse.json({ error: pErr?.message || sErr?.message }, { status: 500 });
    }

    const chronological = [
      ...(players ?? []).map((r) => ({
        role: "user" as const,
        // Keep speaker tag to preserve attribution in context
        content: `${r.user_id}: ${r.content}`,
        at: r.created_at,
      })),
      ...(systems ?? []).map((s) => ({
        role: "assistant" as const,
        content: s.content,
        at: s.created_at,
      })),
    ].sort((a, b) => +new Date(a.at) - +new Date(b.at));

    // Consider it "first step" if no prior system responses exist
    const isFirstStep = (systems?.length ?? 0) === 0;

    // Include the newest user input at the end (if provided)
    if (new_response?.user_id && new_response?.content) {
      chronological.push({
        role: "user",
        content: `${new_response.user_id}: ${new_response.content}`, // <-- fixed from player_id
        at: new Date().toISOString(),
      });
    }

    const systemPrompt = buildSystemPrompt(isFirstStep, characters as PlayerCharacter[]);

    // Non-streaming completion
    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        stream: false,
        messages: [
          asOpenAIMsg("system", systemPrompt),
          ...chronological.map(({ role, content }) => asOpenAIMsg(role, content)),
        ],
        // You can tune temperature etc. here
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      return NextResponse.json({ error: `OpenAI error: ${errText}` }, { status: 502 });
    }

    const completion = await aiResp.json();
    const content: string =
      completion?.choices?.[0]?.message?.content?.trim?.() ?? "";

    // Persist one durable system message; clients will receive via Realtime
    if (content) {
      // Optional step_number logic removed while you’re simplifying. Re-add later if needed.
      const { error: insErr } = await supabase
        .from("system_responses")
        .insert([{ room: gameId, content }]);

      if (insErr) {
        return NextResponse.json({ error: insErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, content });
  } catch (e: any) {
    console.error("chat route error", e);
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
