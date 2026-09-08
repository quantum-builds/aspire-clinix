export function capitalize(word: string) {
  return word.toUpperCase();
}

export function toTitleCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalize(value?: string) {
  return value?.toLowerCase().trim()
}