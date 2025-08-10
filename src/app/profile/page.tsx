"use client";

import { useState } from "react";
import Image from "next/image";
import { PrimaryButton } from "../components/PrimaryButton/PrimaryButton";

export default function ProfilePage() {
  const [name, setName] = useState("Brian");
  const [sunSign, setSunSign] = useState("Cancer");
  const [motivation, setMotivation] = useState("personal");

  const save = async () => {
    // TODO: persist to Supabase
    alert("Profile saved!");
  };

  return (
    <section className="max-w-sm mx-auto">
      {/* Top bar like the mock */}
      <div className="flex items-center justify-between py-4">
        <span className="text-base font-semibold tracking-wide">LOGO</span>
        <div className="w-10" />
      </div>

      {/* Card container in the same style as /stories */}
      <div className="rounded-md overflow-hidden border border-gray-200 bg-white">
        {/* Avatar row */}
        <div className="relative px-4 py-5 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full overflow-hidden ring-4 ring-white shadow">
              <Image
                src="/user-avatar.jpg" // replace with user image
                alt="Avatar"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="px-4 py-5 border-b border-gray-200">
          <label className="block text-xs font-semibold text-gray-900 mb-2">
            NAME
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your name"
          />
        </div>

        {/* Sun Sign */}
        <div className="px-4 py-5 border-b border-gray-200">
          <label className="block text-xs font-semibold text-gray-900 mb-2">
            SUN SIGN
          </label>
          <select
            value={sunSign}
            onChange={(e) => setSunSign(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
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
        </div>

        {/* Motivation */}
        <div className="px-4 py-5">
          <label className="block text-xs font-semibold text-gray-900 mb-2">
            MOTIVATION
          </label>
          <select
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {["personal", "investigative", "accidental"].map((m) => (
              <option key={m} value={m}>
                {m.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CTA aligned with mock button style */}
      <div className="pt-4">
        <PrimaryButton onClick={save}>SAVE PROFILE</PrimaryButton>
      </div>
    </section>
  );
}
