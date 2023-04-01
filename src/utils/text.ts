const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Node = new JSDOM('').window.Node;

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

const blockTags = [
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
];

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
      if (blockTags.includes(c.nodeName)) {
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
