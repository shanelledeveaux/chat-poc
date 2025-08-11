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
    id: "game-show",
    title: "Name of story",
    peopleRange: "2–6 people",
    blurb:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incosti ididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    genre: "GAME SHOW",
    badgeSrc: "/avatar1.jpg",
  },
  {
    id: "survival",
    title: "Name of story",
    peopleRange: "2–6 people",
    blurb:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incosti ididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    genre: "SURVIVAL",
  },
  {
    id: "romance",
    title: "Name of story",
    peopleRange: "2–6 people",
    blurb:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incosti ididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    genre: "ROMANCE",
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
    <section className="max-w-sm mx-auto h-full pb-12">
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
