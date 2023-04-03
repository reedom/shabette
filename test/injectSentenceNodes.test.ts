import { expect, test } from 'vitest';
import { promises as fs } from 'fs';
import { injectSentenceNodes } from '../src/utils/text';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

test('injectSentenceNodes', async () => {
  const content = await fs.readFile(`${__dirname}/fixtures/readability1.html`, 'utf8');
  const dom = new JSDOM(content);
  const document = dom.window.document;
  injectSentenceNodes({ document, lang: 'en', node: document.firstChild! });
  const html = document.documentElement.outerHTML;

  const golden = await fs.readFile(`${__dirname}/fixtures/readability1.golden.html`, 'utf8');
  expect(html.trim()).equals(golden.trim());
});
