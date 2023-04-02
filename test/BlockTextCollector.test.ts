import { expect, test } from 'vitest';
import { promises as fs } from 'fs';
import { extractTextBlocks } from '../src/utils/text';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

test('BlockTextCollector', async () => {
  const content = await fs.readFile(`${__dirname}/fixtures/readability1.html`, 'utf8');
  const dom = new JSDOM(content);
  const result = extractTextBlocks(dom.window.document);
  const sentences = result.map(nodes =>
    nodes
      .filter(node => node.textContent?.trim())
      .map(node => node.textContent!.trim()));
  expect(sentences).toEqual([
    ['The', 'article', 'title'],
    ['The first sentence. And second.',
      'T', 'hird comes here.'],
    ['Fourth.'],
    ['Fifth.'],
  ]);
});
