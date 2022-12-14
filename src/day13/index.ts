import { readInput } from '../utils';
import _ from 'lodash';

export type Pack = (Pack | number)[];
export type NestPack = Pack | number | undefined;
export type Pair = [Pack, Pack];

export function splitToPairs(puzzleInput: string) {
  return puzzleInput.trim().split(/\n\n/);
}

export function parsePairs(pairs: string[]) {
  return pairs.map((pair) => pair.split(/\n/).map((pack) => JSON.parse(pack))) as Pair[];
}

function isUndefined(pack: NestPack): pack is undefined {
  return typeof pack === 'undefined';
}

export function compairPair(pair: [Pack, Pack]): -1 | 0 | 1 {
  for (const [item1, item2] of _.zip(pair[0], pair[1])) {
    if (typeof item1 === 'undefined') return 1;
    if (typeof item2 === 'undefined') return -1;
    if (typeof item1 === 'number' && typeof item2 === 'number') {
      if (item1 > item2) return -1;
      if (item2 > item1) return 1;
    } else if (typeof item1 === 'object' && typeof item2 === 'object') {
      const lowLevelCompaired = compairPair([item1, item2]);
      if (lowLevelCompaired !== 0) return lowLevelCompaired;
      if (lowLevelCompaired === 0 && item1.length !== item2.length) return item1.length < item2.length ? 1 : -1;
    } else if (typeof item1 === 'object' && typeof item2 === 'number') {
      const lowLevelCompaired = compairPair([item1, [item2]]);
      if (lowLevelCompaired !== 0) return lowLevelCompaired;
      if (lowLevelCompaired === 0 && item1.length !== [item2].length) return item1.length < [item2].length ? 1 : -1;
    } else if (typeof item1 === 'number' && typeof item2 === 'object') {
      const lowLevelCompaired = compairPair([[item1], item2]);
      if (lowLevelCompaired !== 0) return lowLevelCompaired;
      if (lowLevelCompaired === 0 && [item1].length !== item2.length) return [item1].length < item2.length ? 1 : -1;
    }
  }
  return 0;
}

export function sumIndexCorrectPairs(pairs: Pair[]) {
  return _.sum(pairs.map((pair, index) => (compairPair(pair) === 1 ? index + 1 : 0)));
}

export function flattenPairs(pairs: Pair[]) {
  return [..._.flattenDepth(pairs, 1), [[2]], [[6]]] as Pack[];
}

export function sortPackages(packs: Pack[]) {
  return packs.sort((packA, packB) => -compairPair([packA, packB]));
}

export function getDecoderKey(sortedPacks: Pack[]) {
  const firstDividerPack = sortedPacks.findIndex((value) => JSON.stringify(value) === '[[2]]') + 1;
  const secondDividerPack = sortedPacks.findIndex((value) => JSON.stringify(value) === '[[6]]') + 1;
  return firstDividerPack * secondDividerPack;
}

export default function solveDay13() {
  const puzzleInput = readInput('./inputs/day13.dat');
  const pairs = splitToPairs(puzzleInput);
  const packagePairs = parsePairs(pairs);
  const correctIndexSum = sumIndexCorrectPairs(packagePairs);

  console.log(`The sum of the indices of correct packages is: ${correctIndexSum}`);

  const flattenedPackages = flattenPairs(packagePairs);
  const sortedPackages = sortPackages(flattenedPackages);
  const decoderKey = getDecoderKey(sortedPackages);
  console.log(`The decoder key is: ${decoderKey}`);
}
