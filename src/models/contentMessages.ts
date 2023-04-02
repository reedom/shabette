export type ContentMessage =
  | { type: 'parseForReader' }
  | { type: 'ui.startTextSelectionMode' }
  | { type: 'ui.stopTextSelectionMode' }

type ContentMessageReturnType<T> =
  T extends { type: 'parseForReader' } ? ResParseForReader | null :
  T extends { type: 'ui.startTextSelectionMode' } ? void :
  T extends { type: 'ui.stopTextSelectionMode' } ? void :
  never;

export interface ResParseForReader {
  title: string;
  content: string;
  textContent: string;
  excerpt: string;
  byline: string;
  lang: string;
}

export async function sendContentMessage<M extends ContentMessage>(msg: M): Promise<ContentMessageReturnType<M>> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(msg, resolve);
    } catch (e) {
      reject(e);
    }
  });
}

export async function parseForReader(): Promise<ResParseForReader | null> {
  return await sendContentMessage({ type: 'parseForReader' });
}

export function startTextSelectionMode() {
  chrome.tabs.query({ active: true, currentWindow: true }).then(([activeTab]) => {
    if (!activeTab?.id) return;
    chrome.tabs.sendMessage(activeTab.id!, { type: 'ui.startTextSelectionMode' }).catch(console.log);
  })
}

export function stopTextSelectionMode({ activeOnly }: { activeOnly?: boolean } = {}) {
  chrome.tabs.query({ active: activeOnly, currentWindow: activeOnly }).then(tabs => {
    for (const tab of tabs) {
      if (typeof tab.id === 'undefined') continue;
      chrome.tabs.sendMessage(tab.id!, { type: 'ui.stopTextSelectionMode' }).catch(console.log);
    }
  })
}
