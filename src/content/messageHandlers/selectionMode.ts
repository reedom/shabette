import { addSentenceHighlight, injectSentenceNodes, removeSentenceHighlight } from '../../utils/text';

export function startTextSelectionMode() {
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);
  // document.addEventListener('click', onClick, true);
}

export function stopTextSelectionMode() {
  document.removeEventListener('mouseover', onMouseOver);
  document.removeEventListener('mouseout', onMouseOut);
  // document.removeEventListener('click', onClick, true);
}

let hoveredElement: HTMLElement | null = null;

function hasTextContent(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return !!node.textContent?.trim();
  }

  if (node.childNodes.length === 0) {
    return false;
  }

  for (let child of node.childNodes) {
    if (hasTextContent(child)) {
      return true;
    }
  }

  return false;
}

function onMouseOver(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.tagName === 'HTML') return;
  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  if (!range) return;
  let node = range.commonAncestorContainer;
  if (node.nodeName === '#text') {
    node = node.parentNode!;
  }

  // parseForReader().then(article => {
  injectSentenceNodes({ document, node, /* lang: article?.lang */ });
  addSentenceHighlight({ document, el: target });
}

function onMouseOut(event: MouseEvent) {
  const target = event.target as HTMLElement
  removeSentenceHighlight({ document, el: target });
}

function onClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  console.log('Clicked Element:', hoveredElement);
}


