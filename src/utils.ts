import { readFileSync } from 'fs';

export const readInput = (inputFile: string) => readFileSync(inputFile, { encoding: 'utf-8' });
