export function newGetP(text: string) {
  return text
    .split('\n')
    .filter(i => i.trim().length > 0)
    .map(i => i.trim());
}
