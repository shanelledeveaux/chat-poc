import { PrimaryButton } from "../components/PrimaryButton/PrimaryButton"; // Adjust the path as needed

type Story = {
  id: string;
  title: string;
  peopleRange: string;
  blurb: string;
  genre: string;
  badgeSrc?: string; // small circular avatar/badge (optional)
};

const STORIES: Story[] = [
  {
    id: "corporate",
    title: "Corporate Signs",
    peopleRange: "2–6 people",
    blurb:
      "At ZodiaCorp, every department runs on planetary energy, and your birth chart determines your role in the cosmic machine, but something has gone wrong. Your Mercury placement glitched during onboarding, and now you’ve been placed in the Scorpio Compliance Division. In this place, secrets are currency and coworkers vanish mid-meeting. A mysterious memo slides across your desk: “You weren’t sent here by accident. They’re watching your chart.” Do you play along, or dig deeper into the astrological chaos beneath the cubicles?",
    genre: "CORPORATE",
    badgeSrc: "/avatar1.jpg",
  },
  {
    id: "survival",
    title: "Zodiac Survivor",
    peopleRange: "2–6 people",
    blurb:
      "The sky cracked during the Great Conjunction, and the world hasn’t been the same since. Survivors have splintered into sign-based factions, each ruled by the traits and flaws of their ruling archetype. Today, a stranger finds you unconscious at the edge of a Scorpio camp, a birth chart is etched into your skin. A prophecy of: You’re the key to restoring the balance or breaking it for good, whispers in their mind. What sign guides your nature, and which one hunts you?",
    genre: "SURVIVAL",
  },
  {
    id: "hunter",
    title: "Zodiac Hunter",
    peopleRange: "2–6 people",
    blurb:
      "In a world where the stars dictate your fate, you are a Hunter, tracking down rogue celestial bodies that threaten the balance of the universe. But when you discover a hidden conspiracy among the Zodiac Council, you must decide whether to follow your duty or forge your own path. Will you become the hero the cosmos needs, or will you be consumed by the very forces you seek to control?",
    genre: "HUNTER",
  },
];

function StoryCard({ s }: { s: Story }) {
  return (
    <article className="relative border-t border-gray-200 bg-white p-4">
      <header className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{s.title}</h3>
        <span className="text-xs text-gray-500 shrink-0">{s.peopleRange}</span>
      </header>

      <p className="text-sm text-gray-600 mb-4">{s.blurb}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-gray-900">
          {s.genre}
        </span>
        <PrimaryButton href={`/stories/${s.id}/staging`}>
          START YOUR QUEST
        </PrimaryButton>
      </div>
    </article>
  );
}

export default function StoriesPage() {
  return (
    <section className="mx-auto h-full pb-12">
      <div className="flex items-center justify-between py-4">
        <span className="text-base font-semibold tracking-wide">LOGO</span>

        <div className="w-10" />
      </div>

      <div className="rounded-md overflow-y-auto h-full">
        {STORIES.map((s, i) => (
          <StoryCard key={s.id} s={s} />
        ))}
        {/* bottom border */}
        <div className="h-px bg-gray-200" />
      </div>
    </section>
  );
}
