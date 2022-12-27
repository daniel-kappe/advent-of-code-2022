import { toArray, initial, tail, cloneDeep, values, range } from 'lodash';
import { readInput } from '../utils';

export function solveDay24() {
  const puzzleInput = readInput('inputs/day24.dat');
  const { start, finish, storms, boundary } = parseInput(puzzleInput);
  const { moves, stormsObject } = searchPath(start, finish, storms, boundary);

  console.log(`You need a minimum of ${moves} to reach your destination`);

  const { moves: movesBack, stormsObject: updatedStorms } = searchPath(finish, start, stormsObject, boundary);
  const { moves: movesLastTime } = searchPath(start, finish, updatedStorms, boundary);

  console.log(`You need a total of ${moves + movesBack + movesLastTime} to get the snacks`);
}

export function searchPath(start: string, finish: string, storms: Storms, boundary: Boundary) {
  let moves = 0;
  let elfPositions = new Set<string>([start]);
  let stormsObject = storms;
  while (!elfPositions.has(finish)) {
    const newElfPositions = new Set<string>();
    stormsObject = progressStorms(stormsObject, boundary);
    for (const position of elfPositions) {
      for (const newPosition of getNextPossiblePositions(position, boundary, start, finish)) {
        let coveredByStorm = false;
        for (const storm of values(stormsObject)) {
          if (!coveredByStorm && storm.has(newPosition)) {
            coveredByStorm = true;
          }
        }
        if (!coveredByStorm) {
          newElfPositions.add(newPosition);
        }
      }
    }
    elfPositions = cloneDeep(newElfPositions);
    moves++;
  }
  return { moves, stormsObject };
}

export function printField(storms: Storms, elfPositions: Set<string>, boundary: Boundary) {
  console.log(
    range(0, boundary.y)
      .map((rowIndex) =>
        range(0, boundary.x)
          .map((columnIndex) => {
            const positionString = positionToString(columnIndex, rowIndex);
            const hasLeftStorm = storms.left.has(positionString) ? 1 : 0;
            const hasRightStorm = storms.right.has(positionString) ? 1 : 0;
            const hasUpStorm = storms.up.has(positionString) ? 1 : 0;
            const hasDownStorm = storms.down.has(positionString) ? 1 : 0;
            const numberOfStorms = hasLeftStorm + hasRightStorm + hasUpStorm + hasDownStorm;
            const hasElf = elfPositions.has(positionString);
            if (hasElf && numberOfStorms > 0) return 'X';
            if (hasElf) return 'E';
            if (hasUpStorm === 1 && numberOfStorms === 1) return '^';
            if (hasDownStorm === 1 && numberOfStorms === 1) return 'v';
            if (hasLeftStorm === 1 && numberOfStorms === 1) return '<';
            if (hasRightStorm === 1 && numberOfStorms === 1) return '>';
            if (numberOfStorms === 0) return '.';
            return numberOfStorms.toString();
          })
          .join('')
      )
      .join('\n')
  );
}

export function progressStorms(storms: Storms, boundary: Boundary) {
  const updatedStorms = getStormsObject();
  for (const upStorm of storms.up) {
    const [x, y] = stringToPosition(upStorm);
    updatedStorms.up.add(positionToString(x, wrapPosition(y - 1, boundary.y)));
  }
  for (const downStorm of storms.down) {
    const [x, y] = stringToPosition(downStorm);
    updatedStorms.down.add(positionToString(x, wrapPosition(y + 1, boundary.y)));
  }
  for (const leftStorm of storms.left) {
    const [x, y] = stringToPosition(leftStorm);
    updatedStorms.left.add(positionToString(wrapPosition(x - 1, boundary.x), y));
  }
  for (const rightStorm of storms.right) {
    const [x, y] = stringToPosition(rightStorm);
    updatedStorms.right.add(positionToString(wrapPosition(x + 1, boundary.x), y));
  }
  return updatedStorms;
}

export function wrapPosition(position: number, bound: number) {
  if (position < 0) return bound + position;
  return position % bound;
}

export function getNextPossiblePositions(position: string, boundary: Boundary, start: string, finish: string) {
  const [startX, startY] = stringToPosition(start);
  const [finishX, finishY] = stringToPosition(finish);
  if (position === start) {
    return [start, startY === -1 ? positionToString(startX, startY + 1) : positionToString(startX, startY - 1)];
  }
  const [x, y] = stringToPosition(position);
  if (finishY === -1 && position === '0,0') {
    return [position, '0,-1'];
  } else if (finishY >= 0 && x === finishX && y === finishY - 1) {
    return [position, finish];
  }

  const nextPositions = [position];
  if (x - 1 >= 0) {
    nextPositions.push(positionToString(x - 1, y));
  }
  if (x + 1 <= boundary.x - 1) {
    nextPositions.push(positionToString(x + 1, y));
  }
  if (y - 1 >= 0) {
    nextPositions.push(positionToString(x, y - 1));
  }
  if (y + 1 <= boundary.y - 1) {
    nextPositions.push(positionToString(x, y + 1));
  }
  return nextPositions;
}

export function parseInput(puzzleInput: string) {
  const inputCroppedBoundary = initial(tail(puzzleInput.trim().split('\n'))).map((row) => initial(tail(toArray(row))));
  const boundary: Boundary = { x: inputCroppedBoundary[0].length, y: inputCroppedBoundary.length };
  const start = '0,-1';
  const finish = `${boundary.x - 1},${boundary.y}`;
  const storms = getStormsObject();
  inputCroppedBoundary.forEach((row, rowIndex) =>
    row.forEach((position, columnIndex) => {
      if (position === '<') {
        storms.left.add(positionToString(columnIndex, rowIndex));
      } else if (position === '>') {
        storms.right.add(positionToString(columnIndex, rowIndex));
      } else if (position === '^') {
        storms.up.add(positionToString(columnIndex, rowIndex));
      } else if (position === 'v') {
        storms.down.add(positionToString(columnIndex, rowIndex));
      }
    })
  );
  return { start, finish, boundary, storms };
}

const positionToString = (x: number, y: number) => `${x},${y}`;

const stringToPosition = (positionString: string) =>
  positionString.split(',').map((numString) => parseInt(numString, 10));

const getStormsObject = () => ({ up: new Set(), down: new Set(), left: new Set(), right: new Set() } as Storms);

type Boundary = { x: number; y: number };
type Storms = { up: Storm; down: Storm; right: Storm; left: Storm };
type Storm = Set<string>;
