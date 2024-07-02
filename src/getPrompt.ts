import fs from 'fs/promises';
import parseMD from 'parse-md';
import portfolioStructure from './portfolioStructure.js';

export async function getPrompt(promptSrc: string): Promise<string> {
  const fileContents = await fs.readFile(promptSrc, 'utf-8');
  const { content } = parseMD(fileContents);
  const resultPrompt = `${content}: ${JSON.stringify(portfolioStructure)}`;

  return resultPrompt;
}
