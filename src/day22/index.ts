import _ from 'lodash';
import { readInput } from '../utils';

export default function solveDay22() {
  const puzzleInput = readInput('inputs/day22.dat');
  const { map, directions, wraps, start } = parseInput(puzzleInput);

  const { position: position2D, facing: facing2D } = followDirections(map, directions, wraps, start, false);
  const password2D = calculatePassword(position2D, facing2D);
  console.log(`The password in 2D is: ${password2D}`);

  const { position, facing } = followDirections(map, directions, wraps, start, true);
  const password = calculatePassword(position, facing);
  console.log(`The password in 3D is: ${password}`);
}

export const calculatePassword = (position: Position, facing: Position) => {
  return (position[0] + 1) * 1000 + (position[1] + 1) * 4 + getFacingValue(facing);
};

export const getFacingValue = (facing: Position) => {
  if (facing[0] === 1) return 1;
  if (facing[0] === -1) return 3;
  return facing[1] === 1 ? 0 : 2;
};

export function followDirections(
  map: string[][],
  directions: Directions,
  wraps: Wrappings,
  start: Position,
  isCube = false,
  isExample = false,
  followTo = Number.MAX_VALUE
) {
  let facing: Position = [0, 1];
  let position: Position = [start[0], start[1]];
  const posFacHist: [Position, string][] = [];
  for (let instruction = 0; instruction < Math.min(directions.distance.length, followTo); instruction++) {
    for (let step = 0; step < directions.distance[instruction]; step++) {
      const [newPosition, newFacing] = isCube
        ? getNewFacingPosition(position, facing, isExample)
        : getNewPosition(position, facing, wraps);
      if (map[newPosition[0]][newPosition[1]] === '.') {
        position = [...newPosition];
        facing = newFacing;
      } else {
        step = directions.distance[instruction];
      }
      posFacHist.push([position, faceToString(facing)]);
    }
    if (instruction < directions.rotation.length) {
      facing = rotate(facing, directions.rotation[instruction]);
      posFacHist.push([position, faceToString(facing)]);
    }
  }
  return { position, facing };
}

function getNewFacingPosition(position: Position, facing: Position, isExample: boolean): [Position, Position] {
  if (isExample) {
    return wrapExample(position, facing);
  }
  return wrapRealInput(position, facing);
}

export function wrapRealInput([x, y]: Position, [dx, dy]: Position): [Position, Position] {
  if (x === 0 && y >= 50 && y < 100 && dx === -1) {
    return [
      [y + 100, 0],
      [0, 1]
    ];
  }
  if (y === 0 && x >= 150 && x < 200 && dy === -1) {
    return [
      [0, x - 100],
      [1, 0]
    ];
  }
  if (y === 0 && x >= 100 && x < 150 && dy === -1) {
    return [
      [149 - x, 50],
      [0, 1]
    ];
  }
  if (y === 50 && x >= 0 && x < 50 && dy === -1) {
    return [
      [149 - x, 0],
      [0, 1]
    ];
  }
  if (x === 100 && y >= 0 && y < 50 && dx === -1) {
    return [
      [50 + y, 50],
      [0, 1]
    ];
  }
  if (y === 50 && x >= 50 && x < 100 && dy === -1) {
    return [
      [100, x - 50],
      [1, 0]
    ];
  }
  if (x === 199 && y >= 0 && y < 50 && dx === 1) {
    return [
      [0, y + 100],
      [1, 0]
    ];
  }
  if (x === 0 && y >= 100 && y < 150 && dx === -1) {
    return [
      [199, y - 100],
      [-1, 0]
    ];
  }
  if (y === 49 && x >= 150 && x < 200 && dy === 1) {
    return [
      [149, x - 100],
      [-1, 0]
    ];
  }
  if (x === 149 && y >= 50 && y < 100 && dx === 1) {
    return [
      [y + 100, 49],
      [0, -1]
    ];
  }
  if (y === 99 && x >= 50 && x < 100 && dy === 1) {
    return [
      [49, 50 + x],
      [-1, 0]
    ];
  }
  if (y === 99 && x >= 100 && x < 150 && dy === 1) {
    return [
      [149 - x, 149],
      [0, -1]
    ];
  }
  if (y === 149 && x >= 0 && x < 50 && dy === 1) {
    return [
      [149 - x, 99],
      [0, -1]
    ];
  }
  if (x === 49 && y >= 100 && y < 150 && dx === 1) {
    return [
      [y - 50, 99],
      [0, -1]
    ];
  }
  return [
    [x + dx, y + dy],
    [dx, dy]
  ];
}

function wrapExample([x, y]: Position, [dx, dy]: Position): [Position, Position] {
  if (y === 0 && x > 3 && x < 8 && dy === -1) {
    return [
      [15, 19 - x],
      [dy, dx]
    ];
  }
  if (x === 11 && y > 11 && y < 16 && dx === 1) {
    return [
      [15 - y, 0],
      [dy, dx]
    ];
  }
  if (y === 8 && x >= 0 && x < 4 && dx === -1) {
    return [
      [4, 4 + x],
      [-dy, -dx]
    ];
  }
  if (x === 4 && y >= 4 && y < 8 && dy === -1) {
    return [
      [y - 4, 8],
      [-dy, -dx]
    ];
  }
  if (y === 8 && x >= 8 && x < 12 && dx === 1) {
    return [
      [7, 15 - x],
      [dy, dx]
    ];
  }
  if (x === 7 && y >= 4 && y < 8 && dy === -1) {
    return [
      [15 - y, 8],
      [dy, dx]
    ];
  }
  if (x === 4 && y >= 0 && y < 4 && dx === -1) {
    return [
      [0, 11 - y],
      [-dx, -dy]
    ];
  }
  if (x === 0 && y >= 8 && y < 12 && dx === -1) {
    return [
      [4, 11 - y],
      [-dx, -dy]
    ];
  }
  if (x === 7 && y >= 0 && y < 4 && dx === 1) {
    return [
      [11, 11 - y],
      [-dx, -dy]
    ];
  }
  if (x === 11 && y >= 8 && y < 12 && dx === 1) {
    return [
      [7, 11 - y],
      [-dx, -dy]
    ];
  }
  if (y === 15 && x >= 0 && x < 4 && dy === 1) {
    return [
      [11 - x, 11],
      [-dx, -dy]
    ];
  }
  if (y === 11 && x >= 8 && x < 12 && dy === 1) {
    return [
      [11 - x, 15],
      [-dx, -dy]
    ];
  }
  if (y === 11 && x > 3 && x < 8 && dy === 1) {
    return [
      [8, x + 9],
      [dy, dx]
    ];
  }
  if (x === 8 && y > 11 && y < 16 && dx === -1) {
    return [
      [x - 8, 11],
      [dy, dx]
    ];
  }
  return [
    [x + dx, y + dy],
    [dx, dy]
  ];
}

function getNewPosition(position: Position, facing: Position, wraps: Wrappings) {
  let newPosition: Position = [position[0] + facing[0], position[1] + facing[1]];
  if (newPosition[0] > wraps.ud[position[1]][1]) {
    newPosition = [wraps.ud[position[1]][0], position[1]];
  } else if (newPosition[0] < wraps.ud[position[1]][0]) {
    newPosition = [wraps.ud[position[1]][1], position[1]];
  } else if (newPosition[1] > wraps.lr[position[0]][1]) {
    newPosition = [position[0], wraps.lr[position[0]][0]];
  } else if (newPosition[1] < wraps.lr[position[0]][0]) {
    newPosition = [position[0], wraps.lr[position[0]][1]];
  }
  return [newPosition, facing];
}

export const rotate = (facing: Position, rotation: Rotation) => {
  switch (rotation) {
    case 'L':
      return [-facing[1], facing[0]] as Position;
    case 'R':
      return [facing[1], -facing[0]] as Position;
  }
};

function faceToString(facing: [number, number]) {
  return facing[0] === 1 ? 'v' : facing[0] === -1 ? '^' : facing[1] === 1 ? '>' : '<';
}

const printMap = (map: string[][], posFacHist: [Position, string][]) => {
  const mapCopy = _.cloneDeep(map);
  for (const [pos, fac] of posFacHist) {
    mapCopy[pos[0]][pos[1]] = fac;
  }
  console.log(mapCopy.map((line) => line.join('')).join('\n'));
};

export const parseInput = (puzzleInput: string) => {
  const [mapString, directions] = puzzleInput.trimEnd().split(/\n\n/);
  const { map, wraps, start } = parseMap(mapString);
  return { map, wraps, start, directions: parseDirections(directions) };
};

const parseMap = (map: string) => {
  const parsedMap = map.split(/\n/).map(_.toArray) as string[][];
  const maxLineLength = _.max(parsedMap.map((line) => line.length));
  const wrapMarkerLR: LineWrapping = _.range(0, parsedMap.length).map(() => [maxLineLength, 0]) as LineWrapping;
  const wrapMarkerUD: LineWrapping = _.range(0, maxLineLength).map(() => [parsedMap.length, 0]) as LineWrapping;
  for (let rowIndex = 0; rowIndex < parsedMap.length; rowIndex++) {
    const rowLength = parsedMap[rowIndex].length;
    for (let columnIndex = 0; columnIndex < rowLength; columnIndex++) {
      const element = parsedMap[rowIndex][columnIndex];
      if (element !== ' ') {
        const [wrapL, wrapR] = wrapMarkerLR[rowIndex];
        const [wrapU, wrapD] = wrapMarkerUD[columnIndex];
        wrapMarkerLR[rowIndex] = [Math.min(wrapL, columnIndex), Math.max(wrapR, columnIndex)];
        wrapMarkerUD[columnIndex] = [Math.min(wrapU, rowIndex), Math.max(wrapD, rowIndex)];
      }
    }
  }
  return {
    map: parsedMap,
    wraps: { lr: wrapMarkerLR, ud: wrapMarkerUD },
    start: [0, parsedMap[0].filter((value) => value === ' ').length] as Position
  };
};

const parseDirections = (directions: string) =>
  ({
    distance: directions.split(/[RL]+/).map(_.parseInt),
    rotation: _.initial(_.tail(directions.split(/\d+/))) as Rotation[]
  } as Directions);

type Directions = { distance: number[]; rotation: Rotation[] };
type Wrappings = { lr: LineWrapping; ud: LineWrapping };
type LineWrapping = [number, number][];
export type Position = [number, number];
type Rotation = 'L' | 'R';
