import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
      const { query } = await req.json();

    const res = await fetch('https://gilded-babka-8cebdc.netlify.app/.netlify/functions/serp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });
    const json = await res.json();
    const results = json.organic_results;
    return NextResponse.json({ results });

}