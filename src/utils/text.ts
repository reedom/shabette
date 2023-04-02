const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Node = new JSDOM('').window.Node;

const blockTags = new Set([
  'DIV',
  'P', 'PRE',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'TABLE', 'TR', 'TD', 'TH', 'TBODY', 'THEAD', 'TFOOT',
  'UL', 'OL', 'LI',
  'DL', 'DT', 'DD',
  'BLOCKQUOTE', 'FIGURE', 'FIGCAPTION',
  'SECTION', 'ARTICLE', 'MAIN', 'HEADER', 'FOOTER',
  'NAV', 'MENU', 'MENUITEM',
  'ADDRESS', 'FORM',
  'FIELDSET', 'LEGEND',
  'LABEL', 'BUTTON', 'SUMMARY', 'DETAILS', 'CAPTION',
  'COLGROUP', 'COL',
  'FRAMESET', 'FRAME', 'IFRAME',
]);

const skipTags = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE',
  'IMG', 'VIDEO', 'AUDIO', 'CANVAS', 'SVG', 'OBJECT',
  'IFRAME', 'EMBED', 'APPLET', 'MAP', 'AREA',
  'ASIDE', 'FOOTER', 'PICTURE',
]);

export function extractTextBlocks(parent: Node): Node[][] {
  const result: Node[][] = [];
  let textNodes: Node[] = [];

  const flush = () => {
    if (textNodes.some(c => c.textContent?.trim().length)) {
      result.push(textNodes);
      textNodes = [];
    }
  }

  let c: Node | null = parent.firstChild;
  let level = 0;
  while (c) {
    if (c.nodeType == Node.TEXT_NODE) {
      textNodes.push(c);
    } else if (c.nodeType == Node.ELEMENT_NODE) {
      if (blockTags.has(c.nodeName)) {
        flush();
      }
    }

    if (!skipTags.has(c.nodeName) && c.hasChildNodes()) {
      ++level;
      c = c.childNodes[0];
      continue;
    }

    while (0 < level && c && !c.nextSibling) {
      --level;
      c = c.parentNode!;
    }
    if (c.nextSibling) {
      do {
        c = c.nextSibling;
      } while (skipTags.has(c.nodeName) && c.nextSibling);
      continue;
    }

    flush();
    c = null;
    break;
  }
  return result;
}

export function extractSentences({ html, lang }: { html: string, lang: string }): string[] {
  const [langCode] = (lang || 'en').split('-');

  const dom = new JSDOM(html);
  const sentences: string[] = [];
  extractBlocks({
    langCode,
    node: dom.window.document.firstChild,
    found: text => sentences.push(...splitToSentences({ langCode, text })),
  });
  return sentences;
}

function extractBlocks({ node, found }: { langCode: string, node: Node, found: (block: string) => void }) {
  let text = '';
  let level = 0;
  let c = node;

  const flush = () => {
    const s = text.trim();
    if (s) {
      found(s);
      text = '';
    }
  }

  while (true) {
    if (c.nodeType == Node.TEXT_NODE) {
      text += c.textContent;
    } else if (c.nodeType == Node.ELEMENT_NODE) {
      if (blockTags.has(c.nodeName)) {
        flush();
      }
    }

    if (c.hasChildNodes()) {
      ++level;
      c = c.childNodes[0];
      continue;
    }

    while (0 < level && !c.nextSibling) {
      --level;
      c = c.parentNode!;
    }
    if (c.nextSibling) {
      c = c.nextSibling;
      continue;
    }

    flush();
    break;
  }
}

function splitToSentences({ langCode, text }: { langCode: string, text: string }): string[] {
  switch (langCode) {
  case 'ja':
  case 'zh':
    return text.split(/(?<=[。、！？!?])\s+/);
  default:
    return text.split(/(?<=[.?!])\s+/);
  }
}

const clsSentenceRoot = 'shabette-sentence-root';

export function injectSentenceNodes(node: Node) {
  const el = node as HTMLElement;
  if (el.classList.contains(clsSentenceRoot)) return;
  el.classList.add(clsSentenceRoot);


}
