import safeAreaInsets from 'safe-area-insets';

const screenWidth = window.screen.availWidth;
const screenHeight = window.screen.availHeight;
const safeTop = safeAreaInsets.top;
const safeBtm = safeAreaInsets.bottom;

export default function getPageArr(testT: string, {
  fontSize = 20,
  lineHeight = 32
}) {
  // 40 是左右 padding
  const lineWidth = Math.floor((screenWidth - 40) / fontSize);
  const line = Math.round((screenHeight - 40 - 24 - safeTop - safeBtm) / lineHeight) - 1; // 31 是行高，24 是标题高度，40 是上下 padding

  const lines = parseContent(testT, lineWidth * 2);
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

function parseContent(str: string, width: number) {
  if (typeof str !== 'string' || str.length < 1) {
    return [];
  }
  str = cleanContent(str);
  const lines: any[] = [];
  let currentLine = '';
  let currentLineWidth = 0;
  for (let i = 0, j = str.length; i < j; i++) {
    const s = getExceptedChar(str.charAt(i));
    const code = s.codePointAt(0) as number;
    if (code == 10 || code == 13) {
      // 10是换行符
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = '';
      currentLineWidth = 0;
      continue;
    }

    const sWidth = getCharLength(s);
    if (currentLineWidth + sWidth > width) {
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = '';
      currentLineWidth = 0;
    }

    currentLine += s;
    currentLineWidth += sWidth;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

function getExceptedChar(char: string) {
  const code = char.codePointAt(0) as number;
  if (code == 8220 || code == 8221) {
    return '"';
  } else if (code == 8216 || code == 8217) {
    return "'";
  } else if (
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

function getCharLength(str: string) {
  if (typeof str !== 'string' || str.length === 0) return 0;
  const charCode = str.charCodeAt(0);
  if (charCode >= 0x0000 && charCode <= 0x00ff) return 1;
  return 2;
}
