const NodeTypeElement = 1;
const NodeTypeText = 3;

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

const tagSentence = 'shabette-sentence';

let clsId = 0;
const nextClsId = () => `shabette-sentence-${clsId++}`;

const clsHighlight = 'shabette-hover';

export function addSentenceHighlight({ document, el }: { document: Document, el: HTMLElement }) {
  if (el.tagName.toLowerCase() !== tagSentence) {
    return;
  }
  for (const [_, cls] of el.classList.entries()) {
    if (cls.match(/^shabette-sentence-\d+$/)) {
      document.querySelectorAll(`.${cls}`).forEach(el => el.classList.add(clsHighlight));
      return;
    }
  }
}

export function removeSentenceHighlight({ document, el }: { document: Document, el: HTMLElement }) {
  if (el.tagName.toLowerCase() !== tagSentence) {
    return;
  }
  for (const [_, cls] of el.classList.entries()) {
    if (cls.match(/^shabette-sentence-\d+$/)) {
      document.querySelectorAll(`.${cls}`).forEach(el => el.classList.remove(clsHighlight));
      return;
    }
  }
}

export function injectSentenceNodes({ document, node, lang }: { document: Document, node: Node, lang?: string }) {
  if (!node.firstChild) return;

  const [langCode] = (lang || 'en').split('-');

  for (const block of extractTextBlocks(node)) {
    while (block.length && !block[0].textContent?.trim()) {
      block.shift();
    }
    while (block.length && !block[block.length - 1].textContent?.trim()) {
      block.pop();
    }
    if (!block.length) {
      continue;
    }

    let cls = nextClsId();
    let blockText = '';
    let start = 0;
    let end = 0;
    let sentenceCount = 0;
    let newSentenceCount = 0;
    for (let i = 0; i < block.length; ++i, start = end, sentenceCount = newSentenceCount) {
      const textNode = block[i];
      const text = textNode.textContent!;
      const sentences = splitToSentences({ langCode, text: blockText + text });

      let s = 0;
      let e = 0;
      newSentenceCount = 0;
      let prevNode: Node;
      while (sentences.length) {
        const sentence = sentences.shift()!;
        s = e;
        e += sentence.length;
        newSentenceCount++;
        if (e < start) continue;

        if (sentenceCount < newSentenceCount && start <= e) {
          // sentence starts in this text node.
          cls = nextClsId();
        }

        if (textNode.parentNode!.nodeName.toLowerCase() !== tagSentence) {
          const wrapper = document.createElement(tagSentence);
          wrapper.classList.add(cls);
          textNode.parentNode!.insertBefore(wrapper, textNode);
          wrapper.appendChild(textNode);
          textNode.textContent = sentence.substring(start - s, e - s);
          prevNode = wrapper;
        } else {
          prevNode = textNode.parentNode!;
        }
        break;
      }

      while (sentences.length) {
        cls = nextClsId();
        const sentence = sentences.shift()!;
        newSentenceCount++;

        const wrapper = document.createElement(tagSentence);
        wrapper.classList.add(cls);
        wrapper.textContent = sentence;
        // @ts-ignore
        prevNode.after(wrapper);
        prevNode = wrapper;
      }
    }
  }
}

export function extractTextBlocks(parent: Node): Node[][] {
  const result: Node[][] = [];
  let textNodes: Node[] = [];

  const flush = () => {
    result.push(textNodes);
    textNodes = [];
  }

  let c: Node | null = parent.firstChild;
  let level = 0;
  while (c) {
    if (c.nodeType == NodeTypeText) {
      textNodes.push(c);
    } else if (c.nodeType == NodeTypeElement) {
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

export function extractSentences({ node, lang }: { node: Node, lang: string }): string[] {
  const [langCode] = (lang || 'en').split('-');

  return extractTextBlocks(node)
    .map(block => block.map(c => c.textContent).join('').trim())
    .filter(text => text.length)
    .flatMap(text => splitToSentences({ langCode, text }));
}

function splitToSentences({ langCode, text }: { langCode: string, text: string }): string[] {
  switch (langCode) {
  case 'ja':
  case 'zh':
    return text.split(/(?<=[。、！？!?]+)\s*/);
  default:
    return text.split(/(?<=[.?!]\s+)/);
  }
}
