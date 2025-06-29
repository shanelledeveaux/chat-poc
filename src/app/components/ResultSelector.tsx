'use client';
import React, { useState } from 'react';

export function ResultSelector({ results = [], onConfirm }: { results?: any[], onConfirm: (selected: any[]) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (i: number) => {
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  if (!results.length) {
    return <p>No results to display. Try a different question.</p>;
  }

  return (
    <div>
      <h3>Select relevant results:</h3>
      <ul>
        {results.map((r, i) => (
          <li key={i} style={{ marginBottom: '1em' }}>
            <label>
              <input type="checkbox" onChange={() => toggle(i)} />
              <strong>{r.title}</strong><br />
              {r.snippet}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={() => onConfirm(selected.map(i => results[i]))}>Confirm</button>
    </div>
  );
}