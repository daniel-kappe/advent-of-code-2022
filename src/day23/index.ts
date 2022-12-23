import { toArray, cloneDeep, range } from 'lodash';
import { readInput } from '../utils';

export default function solveDay23() {
  const puzzleInput = readInput('inputs/day23.dat');
  let elvesMap = parseElfPositions(puzzleInput);
  elvesMap = doSteps(elvesMap, 10);
  console.log(`There are: ${emtpyTiles(elvesMap)} empty tiles`);

  elvesMap = parseElfPositions(puzzleInput);
  const { turns } = stepToEquilibrium(elvesMap);
  console.log(`The elves reach equilibrium after ${turns} turns.`);
}

export const stepToEquilibrium = (elvesMap: ElvesMap) => {
  let turn = 0;
  let equilibriumFound = false;
  while (!equilibriumFound) {
    const nextSteps = collectNextSteps(elvesMap, turn);
    if (nextSteps.size === 0) {
      equilibriumFound = true;
    } else {
      elvesMap = doStep(elvesMap, nextSteps);
      turn++;
    }
  }
  return { equilibrium: elvesMap, turns: turn + 1 };
};

export const doSteps = (elvesMap: ElvesMap, turns: number) => {
  for (let turn = 0; turn < turns; turn++) {
    const nextSteps = collectNextSteps(elvesMap, turn);
    elvesMap = doStep(elvesMap, nextSteps);
  }
  return elvesMap;
};

export const emtpyTiles = (elvesMap: ElvesMap) => {
  const { minX, minY, maxX, maxY } = getContainer(elvesMap);
  return (maxX - minX + 1) * (maxY - minY + 1) - elvesMap.size;
};

export const doStep = (elvesMap: ElvesMap, nextSteps: NextStepMap) => {
  const newMap = cloneDeep(elvesMap);
  for (const [newPosition, elf] of nextSteps.entries()) {
    const oldPosition = elf.toString();
    elf.updatePosition(newPosition);
    newMap.delete(oldPosition);
    newMap.set(newPosition, elf);
  }
  return newMap;
};

export const collectNextSteps = (elvesMap: ElvesMap, turn: number) => {
  const nextSteps = new Map<string, Elf | null>();
  elvesMap.forEach((elf) => {
    const nextStep = elf.considerStep(elvesMap, turn);
    if (nextStep === null) return;
    const nextStepString = positionToString(nextStep);
    if (nextSteps.has(nextStepString)) {
      nextSteps.set(nextStepString, null);
    } else {
      nextSteps.set(nextStepString, elf);
    }
  });
  for (const key of nextSteps.keys()) {
    if (nextSteps.get(key) === null) {
      nextSteps.delete(key);
    }
  }
  return nextSteps as NextStepMap;
};

export class Elf {
  constructor(public x: number, public y: number) {}

  public considerStep(elvesMap: ElvesMap, turnNumber: number) {
    const directionOrder: Direction[] = ['N', 'S', 'W', 'E', 'N', 'S', 'W', 'E'];
    const isNorthEmpty = this.isNorthFree(elvesMap);
    const isSouthEmpty = this.isSouthFree(elvesMap);
    const isWestEmpty = this.isWestFree(elvesMap);
    const isEastEmpty = this.isEastFree(elvesMap);
    if (isNorthEmpty && isSouthEmpty && isWestEmpty && isEastEmpty) return null;
    for (const direction of directionOrder.slice(turnNumber % 4, (turnNumber % 4) + 4)) {
      switch (direction) {
        /* eslint-disable no-fallthrough */
        case 'N':
          if (isNorthEmpty) return [this.x, this.y + 1];
        case 'S':
          if (isSouthEmpty) return [this.x, this.y - 1];
        case 'W':
          if (isWestEmpty) return [this.x - 1, this.y];
        case 'E':
          if (isEastEmpty) return [this.x + 1, this.y];
        /* eslint-enable no-fallthrough */
      }
    }
    return null;
  }

  public static fromString(positionString: string) {
    const [x, y] = positionString.split(',').map((coordinate) => parseInt(coordinate, 10));
    return new Elf(x, y);
  }

  public updatePosition(positionString: string) {
    const [x, y] = positionString.split(',').map((coordinate) => parseInt(coordinate, 10));
    this.x = x;
    this.y = y;
  }

  public toString() {
    return `${this.x},${this.y}`;
  }

  public isNorthFree(elvesMap: ElvesMap) {
    return (
      !elvesMap.has(`${this.x},${this.y + 1}`) &&
      !elvesMap.has(`${this.x + 1},${this.y + 1}`) &&
      !elvesMap.has(`${this.x - 1},${this.y + 1}`)
    );
  }

  public isEastFree(elvesMap: ElvesMap) {
    return (
      !elvesMap.has(`${this.x + 1},${this.y - 1}`) &&
      !elvesMap.has(`${this.x + 1},${this.y}`) &&
      !elvesMap.has(`${this.x + 1},${this.y + 1}`)
    );
  }

  public isWestFree(elvesMap: ElvesMap) {
    return (
      !elvesMap.has(`${this.x - 1},${this.y - 1}`) &&
      !elvesMap.has(`${this.x - 1},${this.y}`) &&
      !elvesMap.has(`${this.x - 1},${this.y + 1}`)
    );
  }

  public isSouthFree(elvesMap: ElvesMap) {
    return (
      !elvesMap.has(`${this.x},${this.y - 1}`) &&
      !elvesMap.has(`${this.x + 1},${this.y - 1}`) &&
      !elvesMap.has(`${this.x - 1},${this.y - 1}`)
    );
  }
}

export const getContainer = (elvesMap: ElvesMap) => {
  let [minX, minY] = [Number.MAX_VALUE, Number.MAX_VALUE];
  let [maxX, maxY] = [Number.MIN_VALUE, Number.MIN_VALUE];
  for (const elf of elvesMap.values()) {
    minX = Math.min(minX, elf.x);
    minY = Math.min(minY, elf.y);
    maxX = Math.max(maxX, elf.x);
    maxY = Math.max(maxY, elf.y);
  }
  return { minX, minY, maxX, maxY };
};

export const printElfDistribution = (elvesMap: ElvesMap) => {
  const { minX, minY, maxX, maxY } = getContainer(elvesMap);
  console.log(
    range(maxY, minY - 1, -1)
      .map((y) => {
        return range(minX, maxX + 1)
          .map((x) => {
            return elvesMap.has(`${x},${y}`) ? '#' : '.';
          })
          .join('');
      })
      .join('\n')
  );
};

export const positionToString = ([x, y]: number[]) => `${x},${y}`;

export const parseElfPositions = (puzzleInput: string) => {
  return puzzleInput
    .trim()
    .split(/\n/)
    .reverse()
    .reduce((elvesMap, currentRow, rowIndex) => {
      toArray(currentRow).forEach((marker, columnIndex) => {
        if (marker === '#') {
          elvesMap.set(`${columnIndex},${rowIndex}`, new Elf(columnIndex, rowIndex));
        }
      });
      return elvesMap;
    }, new Map<string, Elf>()) as ElvesMap;
};

export type ElvesMap = Map<string, Elf>;
type NextStepMap = Map<string, Elf>;
type Direction = 'N' | 'E' | 'S' | 'W';
