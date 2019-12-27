export function getItem(key: string) {
  const value = localStorage.getItem(key);
  if (value != null) return JSON.parse(value).content;
  return null;
}

export function setItem(key: string, value: any) {
  const payload = { content: value };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function clearItem(key: string) {
  localStorage.removeItem(key);
}

export function clearAll() {
  localStorage.clear();
}
