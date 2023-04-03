import { ResParseForReader } from '../../models/contentMessages';
import { Readability } from '@mozilla/readability';

let parsed: ResParseForReader | null | undefined;

export async function parseForReader(): Promise<ResParseForReader | null> {
  if (typeof parsed !== 'undefined') {
    return parsed;
  }

  const article = await new Readability(document).parse();

  return parsed = !article ? null : {
    title: article.title,
    content: article.content,
    textContent: article.textContent,
    byline: article.byline,
    excerpt: article.excerpt,
    lang: article.lang,
  }
}
