import { AmazonPolly } from '../amazonPolly';
import { GoogleTts } from '../googleTts';

export async function listLangs(): Promise<string[]> {
  const [googleVoices, amazonVoices] = await Promise.all([
    GoogleTts.listVoices(),
    AmazonPolly.listVoices(),
  ]);

  if (typeof googleVoices === 'string') {
    throw Error(googleVoices);
  } else if (typeof amazonVoices === 'string') {
    throw Error(amazonVoices);
  }

  const langs = new Set<string>();
  for (const voice of googleVoices) {
    langs.add(voice.lang);
  }
  for (const voice of amazonVoices) {
    langs.add(voice.lang);
  }
  return Array.from(langs.values()).sort();
}
