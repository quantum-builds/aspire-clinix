
import { Title } from "@/types/patient";
export const NAME_MATCH_THRESHOLD = 0.50
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
// Matching uses only the first and last name; middle names are ignored.
export function firstAndLastWords(words: string[]): string[] {
  return words.length <= 2 ? words : [words[0], words[words.length - 1]];
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

// Minimum similarity for two words that sound the same (same Soundex code),
// e.g. "mahammad"/"muhammad" or "musab"/"massab".
export const SOUND_ALIKE_SCORE = 0.95;

const SOUNDEX_CODES: Record<string, string> = {
  b: "1", f: "1", p: "1", v: "1",
  c: "2", g: "2", j: "2", k: "2", q: "2", s: "2", x: "2", z: "2",
  d: "3", t: "3",
  l: "4",
  m: "5", n: "5",
  r: "6",
};

// Standard Soundex: first letter + 3 digits for the consonant sounds.
// Vowels separate repeated codes; "h" and "w" do not.
export function soundex(word: string): string {
  const letters = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!letters) return "";

  let code = letters[0].toUpperCase();
  let previous = SOUNDEX_CODES[letters[0]] ?? "";

  for (const letter of letters.slice(1)) {
    const digit = SOUNDEX_CODES[letter];

    if (digit) {
      if (digit !== previous) code += digit;
      previous = digit;
    } else if (letter !== "h" && letter !== "w") {
      previous = "";
    }

    if (code.length === 4) break;
  }

  return code.padEnd(4, "0");
}

// Letter similarity, raised for words that sound the same.
function wordSimilarity(a: string, b: string): number {
  const letters = jaroWinkler(a, b);
  const code = soundex(a);
  const soundsAlike = code !== "" && code === soundex(b);
  return soundsAlike ? Math.max(letters, SOUND_ALIKE_SCORE) : letters;
}

export interface WordMatchDetail {
  word: string;
  soundex: string;
  bestMatch: string;
  matchSoundex: string;
  letters: number;
  soundsAlike: boolean;
  wordScore: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

// Debug: for each searched word, the patient word it paired with and why.
// Uses the same wordSimilarity as the real score.
export function explainWordMatches(
  searchWords: string[],
  candidateWords: string[],
): WordMatchDetail[] {
  return searchWords.map((word) => {
    let bestMatch = "";
    let bestScore = 0;

    for (const other of candidateWords) {
      const score = wordSimilarity(word, other);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = other;
      }
    }

    const code = soundex(word);
    const matchCode = bestMatch ? soundex(bestMatch) : "";

    return {
      word,
      soundex: code,
      bestMatch,
      matchSoundex: matchCode,
      letters: round2(bestMatch ? jaroWinkler(word, bestMatch) : 0),
      soundsAlike: code !== "" && code === matchCode,
      wordScore: round2(bestScore),
    };
  });
}

function directionalScore(from: string[], to: string[]): number {
  const total = from.reduce(
    (sum, word) => sum + Math.max(...to.map((other) => wordSimilarity(word, other))),
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
