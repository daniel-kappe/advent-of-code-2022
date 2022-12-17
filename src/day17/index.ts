/**
 * The second part was more of a slight math exercise. Since the gas jets have a periodic pattern
 * it was natural to assume, that the stacked pyramid of rocks had to have some periodicity. With
 * some careful logging, I found the periodicity to start at the 1740th rock with a periodicity of
 * 1715 rocks. The rock before the periodic sections had a height of 2679, the periods a height of
 * 2690 i.e.:
 *
 * startOfNewPeriod    = 1740 + 1715 * n (n int >= 0)
 * heightOfPeriodStart = 2762 + 2690 * n (n int >= 0)
 *
 * Then I had to see where the current period ends just before the 1_000_000_000_000th rock.
 *
 * lastPeriodEnd    = (1_000_000_000_000 - 1740) // 1715 = 583_090_377
 * lastPeriodHeight = 2762 + 2690 * 583_090_377 = 1_568_513_116_892
 *
 * and then the number of rocks missing to 1_000_000_000_000
 *
 * remainderPeriod = (1000000000000 - 1740) % 1715 = 1705
 *
 * I ran a simulation for 1740 + 1705 rocks with a final height of 5441. Therefore the remainder
 * has a height of 5441 - 2762 = 2679. Which leads to a final height of:
 *
 * 1_568_513_116_892 + 2679 = 1_568_513_119_571
 * */

import _ from 'lodash';
import { readInput } from '../utils';

const rockOrder = ['-', '+', 'L', 'I', 'o'];

type IndexPair = [number, number][];

class Rock {
  public readonly width: number = 0;
  public readonly height: number = 0;
  public readonly shape: IndexPair = [];
  constructor(public leftEdge: number, public bottomEdge: number) {}

  public static insertRock(tetrisData: EasyTetrisData) {
    const leftEdge = 2;
    const bottomEdge = tetrisData.currentHighestRock + 3;
    switch (tetrisData.currentRock) {
      case '-':
        return new LineRock(leftEdge, bottomEdge);
      case '+':
        return new CrossRock(leftEdge, bottomEdge);
      case 'L':
        return new LRock(leftEdge, bottomEdge);
      case 'I':
        return new IRock(leftEdge, bottomEdge);
      case 'o':
        return new SquareRock(leftEdge, bottomEdge);
      default:
        return new Rock(leftEdge, bottomEdge);
    }
  }

  public processMoves(tetrisData: EasyTetrisData) {
    while (!tetrisData.rockStopped) {
      if (tetrisData.currentMoveIndex % tetrisData.moveInstructions.length === 0) {
        console.log(tetrisData.rockIndex, tetrisData.currentHighestRock);
      }
      const previousLeftEdge = this.leftEdge;
      const previousBottomEdge = this.bottomEdge;
      this.leftEdge += tetrisData.moveInstructions[tetrisData.currentMoveIndex % tetrisData.moveInstructions.length];
      if (this.doesCollide(tetrisData.currentPlayField)) {
        this.leftEdge = previousLeftEdge;
      }
      this.bottomEdge = this.bottomEdge - 1;
      if (this.doesCollide(tetrisData.currentPlayField)) {
        this.bottomEdge = previousBottomEdge;
        tetrisData.rockStopped = true;
      }
      tetrisData.currentMoveIndex++;
    }
    return this.updatePlayField(tetrisData);
  }

  doesCollide(playField: number[][]): boolean {
    const leftEdge = this.leftEdge;
    const bottomEdge = this.bottomEdge;
    if (leftEdge < 0 || leftEdge > 7 - this.width || bottomEdge < 0) return true;
    const positionsCovered = this.shape.map(([row, column]) => playField[row + bottomEdge][column + leftEdge]);
    return _.sum(positionsCovered) > 0;
  }

  updatePlayField(tetrisData: EasyTetrisData): EasyTetrisData {
    const bottomEdge = this.bottomEdge;
    tetrisData.currentHighestRock =
      bottomEdge + this.height > tetrisData.currentHighestRock
        ? bottomEdge + this.height
        : tetrisData.currentHighestRock;
    this.shape.forEach(([row, column]) => {
      tetrisData.currentPlayField[row + bottomEdge][column + this.leftEdge] = 1;
    });
    return tetrisData;
  }
}

class LineRock extends Rock {
  width = 4;
  height = 1;
  shape = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3]
  ] as IndexPair;
}
class CrossRock extends Rock {
  width = 3;
  height = 3;
  shape = [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2]
  ] as IndexPair;
}
class LRock extends Rock {
  width = 3;
  height = 3;
  shape = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2]
  ] as IndexPair;
}

class IRock extends Rock {
  width = 1;
  height = 4;
  shape = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0]
  ] as IndexPair;
}
class SquareRock extends Rock {
  width = 2;
  height = 2;
  shape = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ] as IndexPair;
}

type EasyTetrisData = {
  currentMoveIndex: number;
  moveInstructions: number[];
  currentRock: string;
  currentHighestRock: number;
  currentPlayField: number[][];
  rockStopped: boolean;
  rockIndex: number;
};

export const newRows = (numberOfRows: number) => _.range(numberOfRows).map(() => new Array(7).fill(0));

export function easyTetris(moveInstructions: number[], numberOfRocks: number) {
  const tetrisData: EasyTetrisData = {
    currentMoveIndex: 0,
    moveInstructions,
    currentRock: rockOrder[0],
    currentHighestRock: 0,
    currentPlayField: newRows(numberOfRocks * 2),
    rockStopped: false,
    rockIndex: 0
  };
  for (const rockIndex of _.range(numberOfRocks)) {
    tetrisData.currentRock = rockOrder[rockIndex % 5];
    tetrisData.rockStopped = false;
    tetrisData.rockIndex = rockIndex;
    const rock = Rock.insertRock(tetrisData);
    rock.processMoves(tetrisData);
  }
  return tetrisData;
}

export const parseMoveInstructions = (moveInstructions: string) =>
  _.toArray(moveInstructions).map((move) => (move === '>' ? 1 : -1));

export default function solveDay17() {
  const puzzleInput = readInput('inputs/day17.dat').trim();
  const moveInstructions = parseMoveInstructions(puzzleInput);
  const result = easyTetris(moveInstructions, 1705 + 1740);
  console.log(result.currentHighestRock);
}
