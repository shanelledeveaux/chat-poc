// app/profile/page.tsx
"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("Brian");
  const [sunSign, setSunSign] = useState("Cancer");
  const [motivation, setMotivation] = useState("personal");

  const save = async () => {
    // TODO: persist to Supabase (profiles table)
    // await supabase.from("profiles").upsert({ id: userId, name, sunSign, motivation })
    alert("Saved (stub).");
  };

  return (
    <section>
      <h1>Profile</h1>
      <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Sun sign
          <select value={sunSign} onChange={(e) => setSunSign(e.target.value)}>
            {[
              "Aries",
              "Taurus",
              "Gemini",
              "Cancer",
              "Leo",
              "Virgo",
              "Libra",
              "Scorpio",
              "Sagittarius",
              "Capricorn",
              "Aquarius",
              "Pisces",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Motivation
          <select
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
          >
            {["personal", "investigative", "accidental"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <button onClick={save}>Save</button>
      </div>
    </section>
  );
}
