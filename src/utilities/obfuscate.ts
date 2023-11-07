export function obfuscate(value: string, showFirst: number = 0): string {
  const visibleChars = (value.length <= showFirst) ? 0 : showFirst;
  return value.substring(0, visibleChars) + "*".repeat(value.length - visibleChars);
}