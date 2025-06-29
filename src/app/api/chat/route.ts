import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { question, sources } = await req.json();
  const context = sources.map((s: any) => `Title: ${s.title}\nSnippet: ${s.snippet}`).join('\n\n');

 console.log({context})

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      stream: true,
      messages: [
        // { role: 'system', content: 'Use the following search snippets to answer the question.' },
        // { role: 'user', content: `${context}\n\nQuestion: ${question}` },
        {role: 'user', content: `Design a compact, investigative cosmic horror RPG scenario in alignment with ${question}. The mystery should center around unexplained disappearances, strange sightings, and the influence of an ancient, otherworldly force. Include a limited set of interconnected locations (6-8) with 3+ clues attached to each, a cast of flawed and secretive NPCs, and a supernatural threat tied to forbidden knowledge or an enigmatic artifact. Build an atmosphere of dread and psychological tension, where reality frays as the investigation deepens. Provide pre-generated character hooks (personal, investigative, or accidental), a logical flow of clues leading to revelation or doom, and simple rules or guidance for running the scenario in a rules-light style. write the scenario in Markdown`}
      ],
    }),
  });

  console.log({response})

  return new NextResponse(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}