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
  console.log('onMouseOver', target.tagName, event);
  return;
  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  console.log(range);

  if (!hasTextContent(target)) {
    return;
  }

  if (target.nodeType === Node.TEXT_NODE) {
    target.parentElement?.classList.add('hovered-text');
    hoveredElement = target.parentElement;
  } else {
    target.classList.add('hovered-text');
    hoveredElement = target;
  }
}

function onMouseOut(event: MouseEvent) {
  const target = event.target as HTMLElement
  console.log('onMouseOut', target.tagName, event);
  hoveredElement?.classList.remove('hovered-text');
}

function onClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  console.log('Clicked Element:', hoveredElement);
}


