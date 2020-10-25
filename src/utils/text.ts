export function newGetP(text: string) {
  return (text || '获取失败')
    .split('\n')
    .filter(i => i.trim().length > 0)
    .map(i => i.trim());
}
