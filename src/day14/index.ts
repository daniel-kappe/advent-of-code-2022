import _ from 'lodash';
import { readInput } from '../utils';

enum CaveObject {
  Rock,
  Sand,
  Air,
  Start
}

class Position {
  constructor(public readonly x: number, public readonly y: number) {}

  public static fromString(positionString: string) {
    const [x, y] = positionString.split(',');
    return new Position(parseInt(x), parseInt(y));
  }

  public toString() {
    return `${this.x},${this.y}`;
  }

  public downString() {
    return `${this.x},${this.y + 1}`;
  }

  public downLeftString() {
    return `${this.x - 1},${this.y + 1}`;
  }

  public downRightString() {
    return `${this.x + 1},${this.y + 1}`;
  }

  public lineTo(other: Position): Position[] {
    const line = [];
    const thisXBigger = this.x > other.x ? -1 : 1;
    const thisYBigger = this.y > other.y ? -1 : 1;
    for (const x of _.range(this.x, other.x + thisXBigger, thisXBigger)) {
      for (const y of _.range(this.y, other.y + thisYBigger, thisYBigger)) {
        line.push(new Position(x, y));
      }
    }
    return line;
  }

  public isInBounds(bounds: CaveBoundary) {
    if (this.x > bounds.maxX) return false;
    if (this.x < bounds.minX) return false;
    if (this.y > bounds.maxY) return false;
    return this.y >= bounds.minY;
  }
}

type CaveBoundary = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

class Cave {
  sandInCave: number;

  constructor(public readonly objectPositions: Map<string, CaveObject>, public readonly bounds: CaveBoundary) {
    this.objectPositions.set('500,0', CaveObject.Start);
    this.sandInCave = 0;
  }

  public static fromPuzzleInput(puzzleInput: string) {
    const bounds: CaveBoundary = {
      minX: Number.MAX_VALUE,
      minY: 0,
      maxX: Number.MIN_VALUE,
      maxY: Number.MIN_VALUE
    };
    const filledPositions = _.flatten(
      puzzleInput
        .trim()
        .split(/\n/)
        .map((line) =>
          line.split(/ -> /).reduce(
            (previousValue, currentValue) => {
              const currentPosition = Position.fromString(currentValue);
              if (currentPosition.x > bounds.maxX) bounds.maxX = currentPosition.x;
              if (currentPosition.x < bounds.minX) bounds.minX = currentPosition.x;
              if (currentPosition.y > bounds.maxY) bounds.maxY = currentPosition.y;
              if (currentPosition.y < bounds.minY) bounds.minY = currentPosition.y;
              if (typeof previousValue.prevPosition !== 'undefined') {
                const filledPositions = currentPosition.lineTo(previousValue.prevPosition);
                filledPositions.forEach((position) => previousValue.filledPositions.add(position.toString()));
              }
              previousValue.prevPosition = currentPosition;
              return previousValue;
            },
            { prevPosition: undefined, filledPositions: new Set<string>() } as {
              prevPosition?: Position;
              filledPositions: Set<string>;
            }
          )
        )
        .map(({ filledPositions }) => _.toArray(filledPositions))
    ) as string[];
    return new Cave(
      filledPositions.reduce(
        (caveMap, currentPosition) => caveMap.set(currentPosition, CaveObject.Rock),
        new Map<string, CaveObject>()
      ),
      bounds
    );
  }

  public toString(biggerBounds = false) {
    const yAdditive = biggerBounds ? 2 : 1;
    const xAdditive = biggerBounds ? 140 : 0;
    return _.range(this.bounds.minY, this.bounds.maxY + yAdditive)
      .map((y) =>
        _.range(this.bounds.minX - xAdditive, this.bounds.maxX + 1 + xAdditive)
          .map((x) => {
            const caveObject = this.objectPositions.get(`${x},${y}`) ?? CaveObject.Air;
            if (caveObject === CaveObject.Rock) return '#';
            if (caveObject === CaveObject.Air) return '.';
            if (caveObject === CaveObject.Sand) return 'o';
            if (caveObject === CaveObject.Start) return '+';
          })
          .join('')
      )
      .join('\n');
  }

  public insertSand(untilStops = false) {
    let cameToRest = false;
    let sand = new Position(500, 0);
    while (!cameToRest) {
      if (!untilStops && !sand.isInBounds(this.bounds)) {
        throw new Error('out of bounds');
      } else if (untilStops && sand.y === this.bounds.maxY + 1) {
        cameToRest = true;
        this.objectPositions.set(sand.toString(), CaveObject.Sand);
      } else if (this.objectPositions.get(sand.downString()) === undefined) {
        sand = Position.fromString(sand.downString());
      } else if (this.objectPositions.get(sand.downLeftString()) === undefined) {
        sand = Position.fromString(sand.downLeftString());
      } else if (this.objectPositions.get(sand.downRightString()) === undefined) {
        sand = Position.fromString(sand.downRightString());
      } else if (sand.x === 500 && sand.y === 0) {
        this.objectPositions.set(sand.toString(), CaveObject.Sand);
        this.sandInCave++;
        throw new Error('out of bounds');
      } else {
        cameToRest = true;
        this.objectPositions.set(sand.toString(), CaveObject.Sand);
      }
    }
    this.sandInCave++;
  }

  public fillCave(untilStops = false) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        this.insertSand(untilStops);
      } catch (e) {
        return this.sandInCave;
      }
    }
  }
}

export default function solveDay14() {
  const puzzleInput = readInput('./inputs/day14.dat');
  // const puzzleInput = `498,4 -> 498,6 -> 496,6
  // 503,4 -> 502,4 -> 502,9 -> 494,9`;
  const bottomLessCave = Cave.fromPuzzleInput(puzzleInput);
  const sandInBottomLessCave = bottomLessCave.fillCave(false);
  console.log(bottomLessCave.toString(false));
  console.log(`The bottomless cave fills with ${sandInBottomLessCave} units of sand.`);

  const cave = Cave.fromPuzzleInput(puzzleInput);
  const sandInCave = cave.fillCave(true);
  console.log(cave.toString(true));
  console.log(`The real cave fills with ${sandInCave} units of sand.`);
}

solveDay14();
