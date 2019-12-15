import safeAreaInsets from 'safe-area-insets';
import { fontSize as f, lineHeight as l } from '@/config/read';
import { screenHeight, screenWidth } from '@/constants';

const safeTop = safeAreaInsets.top;
const safeBtm = safeAreaInsets.bottom;

const getTextWith = (() => {
  const sty = `24px sans-serif`;
  const canvas = document.createElement('canvas');
  let context: any = canvas.getContext('2d');
  context.font = sty;
  return (text: string) => {
    const dimension = context.measureText(text);
    return dimension.width;
  };
})();

export function newGetPageArr(testT: string, params?: any) {
  const { lineHeight = l } = params ?? {};
  // 32 是左右 padding
  const maxWidth = screenWidth - 32;

  const line = Math.floor(
    (screenHeight - 40 - 24 - 16 - 8 - safeTop - safeBtm) / lineHeight
  ); // 24 是标题高度，40 是上下 padding，16是底部页数的行高, 8 是留白
  const lines = newParse(testT, maxWidth);
  return getPages(lines, line);
}

function getPages(lines: string[], perPage: number) {
  const pages: any[] = [];

  const totalLines = lines.length;
  const prevCnt = Math.floor(totalLines / perPage);
  const pageCount = prevCnt + (totalLines % perPage > 1 ? 1 : 0);

  for (let i = 0; i < pageCount; i++) {
    pages[i] = [];
    let next = (i + 1) * perPage;
    if (next > totalLines) next = totalLines;

    for (let j = i * perPage; j < next; j++) {
      pages[i].push(lines[j]);
    }
  }
  return pages;
}

function newParse(str: string, width: number) {
  if (typeof str !== 'string' || str.length < 1) {
    return [];
  }
  str = cleanContent(str);
  const lines: any[] = [];
  let currentLine = '';
  for (let i = 0, j = str.length; i < j; i++) {
    const s = getExceptedChar(str.charAt(i));
    const code = s.codePointAt(0) as number;
    if (code == 10 || code == 13) {
      // 10是换行符
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = '';
      continue;
    }

    const sWidth = getTextWith(currentLine + s);
    if (sWidth > width) {
      lines.push(currentLine);
      currentLine = '';
    }

    currentLine += s;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

function getExceptedChar(char: string) {
  const code = char.codePointAt(0) as number;
  if (
    (code >= 48 && code <= 56) ||
    (code >= 65 && code <= 91) ||
    (code >= 97 && code <= 122)
  ) {
    return String.fromCharCode(code + 65248); //宽字符的数字、大小写字母转换
  }
  return char;
}

function cleanContent(str: string) {
  return str
    .split('\n')
    .filter(i => i.trim().length > 0)
    .map(i => '\u3000\u3000' + i.trim())
    .join('\n\n');
}
