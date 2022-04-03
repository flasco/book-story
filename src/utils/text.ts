export function formatPageContent(text: string, filters: string[] = []) {
  const regFilters = filters.filter(i => i.length).map(filter => new RegExp(filter, 'ig'));

  text = regFilters.reduce((prev, curr) => {
    prev = prev.replace(curr, '');
    return prev;
  }, text);

  const pages = text
    .split('\n')
    .filter(i => i.trim().length > 0)
    .map(i => i.trim());
  if (pages.length < 1) {
    return ['获取失败'];
  }
  return pages;
}
