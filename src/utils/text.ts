export function newGetP(text: string) {
  const pages = text
    .split('\n')
    .filter(i => i.trim().length > 0)
    .map(i => i.trim());
  if (pages.length < 1) return ['获取失败'];
  return pages;
}
