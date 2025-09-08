// app/page.tsx
import Image from "next/image";
import { PrimaryButton } from "./components/PrimaryButton/PrimaryButton";

export default function HomePage() {
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="flex flex-col items-center h-full text-left px-4 pt-6 pb-20 mx-auto">
      {/* Logo */}
      <div className="w-full flex justify-start mb-6">
        <span className="text-base font-semibold tracking-wide">LOGO</span>
      </div>
      <div>
        {/* Hero image */}
        <div className="mb-6">
          <Image
            src="/user-avatar.jpg" // replace with your asset
            alt="Hero"
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        </div>

        {/* Date */}
        <p className="text-xs text-gray-500 mb-2">{date}</p>

        {/* Headline */}
        <h1 className="text-2xl font-extrabold leading-snug mb-3">
          Your sign. Your fate. <br /> Infinite possibilities.
        </h1>

        {/* Body */}
        <p className="text-sm text-gray-600 mb-6">
          Jump into a wild, astrological adventure where your zodiac traits
          spark outrageous scenarios. Play solo or with friends and watch the
          cosmic drama unfold.
        </p>

        {/* CTA */}
        <PrimaryButton href="/stories">START YOUR QUEST</PrimaryButton>
      </div>
    </section>
  );
}
