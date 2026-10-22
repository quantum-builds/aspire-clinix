// Only allow same-site relative paths ("/foo?bar=1"). Rejects protocol-relative
// ("//host"), backslash tricks ("/\host") and absolute URLs.
export function safeRedirectPath(
  value: string | null | undefined,
  fallback: string,
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  return value;
}
