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

const endTags = new Set(['BODY', 'HEAD', 'HTML']);

type Callback = (arg: { node: Node, sentences: string[]}) => void;

export default class BlockTextCollector {
  private current: Node | null = null
  private readonly langCode: string;

  constructor({ langCode, start }: { langCode?: string, start: Node }) {
    this.langCode = langCode || 'en';
    this.current = start;
  }

  next(onFound: Callback): boolean {
    let text = '';
    let level = 0;
    let c = this.current;
    const anchorHolder = new AnchorHolder();

    const flush = (): boolean => {
      const s = text.trim();
      if (!s) {
        text = '';
        return false;
      }

      const sentences = this.splitToSentences({ langCode: this.langCode, text: s });
      onFound({ node: anchorHolder.anchor!, sentences });
      return true;
    }

    let found = false;
    while (!found && c) {
      if (c.nodeType == Node.TEXT_NODE) {
        anchorHolder.update(c);
        text += c.textContent;
      } else if (c.nodeType == Node.ELEMENT_NODE) {
        if (blockTags.has(c.nodeName)) {
          found = flush();
        }
      }

      if (!skipTags.has(c.nodeName) && c.hasChildNodes()) {
        ++level;
        c = c.childNodes[0];
        continue;
      }

      while (0 < level && !c.nextSibling) {
        --level;
        c = c.parentNode!;
      }
      if (c.nextSibling) {
        do {
          c = c.nextSibling;
        } while (skipTags.has(c.nodeName) && c.nextSibling);
        continue;
      }

      found = flush();
      c = null;
    }

    this.current = c;
    return found;
  }

  private splitToSentences({ langCode, text }: { langCode: string, text: string }): string[] {
    switch (langCode) {
    case 'ja':
    case 'zh':
      return text.split(/(?<=[。、！？!?])\s+/);
    default:
      return text.split(/(?<=[.?!])\s+/);
    }
  }

}

class AnchorHolder {
  private _anchor: Node | undefined;

  get anchor(): Node | undefined {
    return this._anchor;
  }

  update(c: Node) {
    if (!this._anchor) {
      this._anchor = c;
      return;
    } else if (this._anchor.parentNode === c.parentNode) {
      return;
    } else if (this._anchor === c) {
      return;
    }

    const anchorParents = this.getParents(this._anchor);
    if (anchorParents.includes(c)) {
      return;
    }

    const nodeParents = this.getParents(c);
    for (let iAnchor = 0; iAnchor < anchorParents.length; ++iAnchor) {
      for (let iNode = 0; iNode < nodeParents.length; ++iNode) {
        if (anchorParents[iAnchor] === nodeParents[iNode]) {
          this._anchor = anchorParents[iAnchor];
          return;
        }
      }
    }
  }

  private  getParents(node: Node): Node[] {
    const parents = [];
    while (node.parentNode && !endTags.has(node.nodeName)) {
      parents.push(node.parentNode);
      node = node.parentNode;
    }
    return parents;
  }
}
