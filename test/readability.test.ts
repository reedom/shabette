import { expect, test } from 'vitest';
import { Readability } from '@mozilla/readability';
import { promises as fs } from 'fs';
import { extractSentences } from '../src/utils/text';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

test('readability', async () => {
  const content = await fs.readFile(`${__dirname}/fixtures/readability1.html`, 'utf8');
  const dom = new JSDOM(content);
  const article = new Readability(dom.window.document).parse();
  const sentences = extractSentences({ html: article!.content, lang: article!.lang });
  expect(sentences).toEqual([
    'The article title',
    'The first sentence.',
    'And second.',
    'Third comes here.',
    'Fourth.',
    'Fifth.'
  ]);
});
