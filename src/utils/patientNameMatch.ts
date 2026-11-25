
import { Title } from "@/types/patient";
export const NAME_MATCH_THRESHOLD = 0.72;
export const MAX_NAME_MATCHES = 5;

const TITLE_WORDS = new Set(
  Object.values(Title).map((title) => title.toLowerCase()),
);

export function normalizeName(name: string | null | undefined): string[] {
  const words = (name ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.,'’\-_]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const withoutTitles = words.filter((word) => !TITLE_WORDS.has(word));

  return withoutTitles.length > 0 ? withoutTitles : words;
}
export function jaroWinkler(a: string, b: string): number {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;

  const matchWindow = Math.max(0, Math.floor(Math.max(a.length, b.length) / 2) - 1);
  const aMatches = new Array<boolean>(a.length).fill(false);
  const bMatches = new Array<boolean>(b.length).fill(false);

  let matches = 0;
  for (let i = 0; i < a.length; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, b.length);
    for (let j = start; j < end; j++) {
      if (bMatches[j] || a[i] !== b[j]) continue;
      aMatches[i] = true;
      bMatches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < a.length; i++) {
    if (!aMatches[i]) continue;
    while (!bMatches[k]) k++;
    if (a[i] !== b[k]) transpositions++;
    k++;
  }

  const jaro =
    (matches / a.length +
      matches / b.length +
      (matches - transpositions / 2) / matches) /
    3;

  let prefix = 0;
  while (prefix < 4 && prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) {
    prefix++;
  }

  return jaro + prefix * 0.1 * (1 - jaro);
}

function directionalScore(from: string[], to: string[]): number {
  const total = from.reduce(
    (sum, word) => sum + Math.max(...to.map((other) => jaroWinkler(word, other))),
    0,
  );
  return total / from.length;
}

export type NameMatch = "EXACT" | "CLOSE";

export interface NameScore {
  score: number;
  match: NameMatch;
}

export function scoreCandidate(
  searchWords: string[],
  candidateWords: string[],
): NameScore {
  if (searchWords.length === 0 || candidateWords.length === 0) {
    return { score: 0, match: "CLOSE" };
  }

  const similarity = Math.min(
    directionalScore(searchWords, candidateWords),
    directionalScore(candidateWords, searchWords),
  );

  const firstAndLastMatch =
    searchWords[0] === candidateWords[0] &&
    searchWords[searchWords.length - 1] ===
      candidateWords[candidateWords.length - 1];

  const score = Math.min(1, similarity + (firstAndLastMatch ? 0.1 : 0));

  const isExact =
    [...searchWords].sort().join(" ") === [...candidateWords].sort().join(" ");

  return { score, match: isExact ? "EXACT" : "CLOSE" };
}
