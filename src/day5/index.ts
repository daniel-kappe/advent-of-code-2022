import { readInput } from '../utils';
import _, { parseInt } from 'lodash';

export const parseContainers = (containersString: string) =>
  getContainerColumns(_.initial(containersString.split(/\n/)).map(parseContainerRow));

export const parseContainerRow = (containerRow: string) =>
  containerRow.match(/(\s{3}|\[\w])\s?/g)?.map((item) => item[1]) as string[];

export const getContainerColumns = (containerRows: string[][]) =>
  containerRows.map((_, columnIndex) => containerRows.map((row) => row[columnIndex]));

export type MoveOrder = {
  from: number;
  to: number;
  quantity: number;
};

export const splitContainersAndMoves = (puzzleInput: string) => puzzleInput.trimEnd().split(/\n\n/);

export const parseMoves = (movesInput: string) => {
  const moveStringList = movesInput.split(/\n/);
  return moveStringList.map(parseMove);
};

export const parseMove = (move: string) => {
  const matches = /\w+ (\d+) \w+ (\d+) \w+ (\d+)/.exec(move);
  if (matches) {
    return {
      quantity: parseInt(matches[1]),
      from: parseInt(matches[2]) - 1,
      to: parseInt(matches[3]) - 1
    } as MoveOrder;
  }
  return { quantity: 0, from: 0, to: 0 } as MoveOrder;
};

export const executeMove = (containers: string[][], move: MoveOrder, reversed: boolean) => {
  const moveStack = containers[move.from];
  const toMove = _.takeRight(moveStack, move.quantity);
  containers[move.from] = _.dropRight(moveStack, move.quantity);
  if (reversed) {
    containers[move.to].push(...toMove.reverse());
  } else {
    containers[move.to].push(...toMove);
  }
  return containers;
};

export const executeAllMovesCrane9000 = (containers: string[][], moves: MoveOrder[]) =>
  moves.reduce((previousContainers, move) => executeMove(previousContainers, move, true), containers);

export const executeAllMovesCrane9001 = (containers: string[][], moves: MoveOrder[]) =>
  moves.reduce((previousContainers, move) => executeMove(previousContainers, move, false), containers);

export default function solveDay5() {
  const puzzleInput = readInput('./inputs/day5.dat');
  const intialContainers = splitContainersAndMoves(puzzleInput)[0];
  console.log(parseContainers(intialContainers));
  // const moves = parseMoves(movesString);
  // const endConfig9000 = executeAllMovesCrane9000(_.cloneDeep(initialContainers), moves).map(_.last).join('');
  // const endConfig9001 = executeAllMovesCrane9001(_.cloneDeep(initialContainers), moves).map(_.last).join('');
  // console.log(`The crane 9000 moves result in: ${endConfig9000}`);
  // console.log(`The crane 9000 moves result in: ${endConfig9001}`);
}
