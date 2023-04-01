export type ContentMessage =
  | { type: 'parseForReader' }

type ContentMessageReturnType<T> =
  T extends { type: 'parseForReader' } ? ResParseForReader | null :
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
