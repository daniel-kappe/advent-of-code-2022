import _ from 'lodash';
import { readInput } from '../utils';

type Position = {
  x: number;
  y: number;
};

class HeadPointer {
  constructor(public x: number, public y: number) {}

  static create(position: Position, target: Position) {
    return new HeadPointer(target.x - position.x, target.y - position.y);
  }

  getdistance() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

type Direction = 'R' | 'L' | 'U' | 'D';

export type Move = {
  direction: Direction;
  amount: number;
};

export class Tail {
  public positionHistory: Set<string>;
  public nextTailElement: Tail | null;

  constructor(public position: Position = { x: 0, y: 0 }, public tailLength: number = 1) {
    this.positionHistory = new Set([`${position.x}, ${position.y}`]);
    this.nextTailElement = tailLength > 1 ? new Tail(position, tailLength - 1) : null;
  }

  updatePosition(headPosition: Position) {
    const { x, y } = this.position;
    const headPointer = HeadPointer.create(this.position, headPosition);
    const distance = headPointer.getdistance();
    if (distance < 2) {
      return;
    } else if (distance === 2) {
      this.position = { x: x + headPointer.x / 2, y: y + headPointer.y / 2 };
    } else {
      this.position = { x: x + Math.sign(headPointer.x), y: y + Math.sign(headPointer.y) };
    }
    this.positionHistory.add(`${this.position.x}, ${this.position.y}`);
    if (this.nextTailElement) {
      this.nextTailElement.updatePosition(this.position);
    }
  }

  getTailEnd(): Tail {
    if (this.nextTailElement) {
      return this.nextTailElement.getTailEnd();
    }
    return this;
  }
}

export class Head {
  constructor(public position: Position = { x: 0, y: 0 }, public tail: Tail = new Tail()) {}

  updatePosition(move: Move) {
    for (const i in _.range(move.amount)) {
      this.position = newPosition(this.position, move.direction);
      this.tail.updatePosition(this.position);
    }
  }
}

const newPosition = (oldPosition: Position, moveDirection: Direction) => {
  const { x, y } = oldPosition;
  switch (moveDirection) {
    case 'D':
      return { x, y: y - 1 };
    case 'U':
      return { x, y: y + 1 };
    case 'L':
      return { x: x - 1, y };
    case 'R':
      return { x: x + 1, y };
  }
};

export const parseMoves = (movesList: string) => movesList.trimEnd().split(/\n/).map(parseMove);

const parseMove = (move: string) => {
  const [direction, amount] = move.split(' ');
  return { direction, amount: parseInt(amount) } as Move;
};

export default function solveDay9() {
  const puzzleInput = readInput('./inputs/day9.dat');
  const moves = parseMoves(puzzleInput);
  const headFirst = new Head();
  for (const move of moves) {
    headFirst.updatePosition(move);
  }
  console.log(`The tail end visits ${headFirst.tail.positionHistory.size} positions in total`);

  const headSecond = new Head({ x: 0, y: 0 }, new Tail({ x: 0, y: 0 }, 9));
  for (const move of moves) {
    headSecond.updatePosition(move);
  }
  console.log(`The tail (length 9) end visits ${headSecond.tail.getTailEnd().positionHistory.size} positions in total`);
}

solveDay9();
