import { PlayerCharacter } from "./types";

export const formatCharacters = (chars: PlayerCharacter[]) =>
  chars.map(c => `- **${c.name}** (${c.sunSign}) — drawn in by ${c.motivation} motives.`).join("\n");

export const buildSystemPrompt = (isFirst: boolean, chars: PlayerCharacter[]) =>
  isFirst
    ? `Design the opening scene of a surreal investigative cosmic horror RPG. The setup should hint at an ancient force and strange disappearances.

Introduce characters using their zodiac archetypes:

${formatCharacters(chars)}

Begin with eerie tension and mystery. Return only the first short paragraph of the story in clean, spooky Markdown.`
    : `Continue the RPG story based on the following player input.

Characters:
${formatCharacters(chars)}

Respond with one short paragraph, max 2 sentences.`;
