'use client';
import React, { useState } from 'react';
import { ResultSelector } from './components/ResultSelector';

export default function Page() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [answer, setAnswer] = useState('');
  const [stage, setStage] = useState<'input' | 'select' | 'answer'>('input');
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    console.log({question});
    const res = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: question }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    console.log({data: data.results})

    setResults(data.results);
    setStage('select');
    setLoading(false);
  }

  async function handleConfirm(selected: any[]) {
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ question, sources: selected }),
      headers: { 'Content-Type': 'application/json' }
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let final = '';

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);

  for (const line of chunk.split('\n')) {
    if (line.startsWith('data: ')) {
      const json = line.replace('data: ', '').trim();
      if (json && json !== '[DONE]') {
        try {   
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            setAnswer(prev => prev + content);
          }
        } catch (e) {
          console.error('Failed to parse chunk:', json);
        }
      }
    }
  }
}


    setStage('answer');
    setLoading(false);
  }

  return (
    <main style={{ padding: 24 }}>
      {stage === 'input' && (
        <>
          <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask something..." style={{ width: '80%' }} />
          <button onClick={handleSearch} disabled={loading}>Search</button>
        </>
      )}

      {stage === 'select' && <ResultSelector results={results} onConfirm={handleConfirm} />}

      {stage === 'answer' && <pre>{answer}</pre>}
    </main>
  );
}