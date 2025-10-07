export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function toTitleCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}