import { ResParseForReader } from '../../../models/contentMessages';
import { Readability } from '@mozilla/readability';

export async function parseForReader(): Promise<ResParseForReader | null> {
  const article = await new Readability(document).parse();

  return !article ? null : {
    title: article.title,
    content: article.textContent,
    byline: article.byline,
    excerpt: article.excerpt,
    lang: article.lang,
  }
}
