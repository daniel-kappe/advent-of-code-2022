import { readInput } from '../utils';
import _ from 'lodash';

export function findEndPackageStart(puzzleInput: string) {
  let quadlet = new Set();
  for (let index = 0; index < puzzleInput.length; index++) {
    quadlet = new Set(_.toArray(puzzleInput.slice(index, index + 4)));
    if (_.toArray(quadlet).length === 4) {
      return index + 4;
    }
  }
}

export function findEndMessageStart(puzzleInput: string) {
  let quadlet = new Set();
  for (let index = 0; index < puzzleInput.length; index++) {
    quadlet = new Set(_.toArray(puzzleInput.slice(index, index + 14)));
    if (_.toArray(quadlet).length === 14) {
      return index + 14;
    }
  }
}

export default function solveDay6() {
  const puzzleInput = readInput('./inputs/day6.dat');
  console.log(findEndPackageStart(puzzleInput));
  console.log(findEndMessageStart(puzzleInput));
}
