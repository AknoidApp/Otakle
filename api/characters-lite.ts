export const CHARACTERS_LITE = [
  // ...
] as const;

export const CHARACTER_IDS = CHARACTERS_LITE
  .filter((c) => c.active)
  .map((c) => c.id);
