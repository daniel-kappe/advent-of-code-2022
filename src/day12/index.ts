import { readInput } from '../utils';
import _ from 'lodash';

export type Point = [number, number];

export const parseHeightmap = (input: string) => {
  let startPosition: Point = [-1, -1];
  let endPosition: Point = [-1, -1];
  const heightmap = input
    .trim()
    .split(/\n/)
    .map((heightRow, row) =>
      _.toArray(heightRow).map((height, column) => {
        if (height === 'S') {
          startPosition = [row, column];
          return 0;
        } else if (height === 'E') {
          endPosition = [row, column];
          return 25;
        } else {
          return height.charCodeAt(0) - 97;
        }
      })
    );
  if (startPosition[0] >= 0 && endPosition[0] >= 0) {
    return { heightmap, startPosition, endPosition };
  }
  throw new Error('could not parse');
};

export const getManhattenDistance = (point1: Point, point2: Point) =>
  Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);

export const doPointsEqual = (point1: [number, number], point2: [number, number]) => _.isEqual(point1, point2);

export function aStar(heightmap: number[][], startPosition: Point, endPosition: Point) {
  let openSet: Point[] = [startPosition];
  const cameFrom: Map<string, Point> = new Map();
  const gScore: Map<string, number> = new Map();
  const fScore: Map<string, number> = new Map();
  gScore.set(JSON.stringify(startPosition), 0);
  fScore.set(JSON.stringify(startPosition), getManhattenDistance(startPosition, endPosition));
  while (openSet.length > 0) {
    openSet = openSet
      .map((point) => [point, fScore.get(JSON.stringify(point)) ?? Number.MAX_VALUE] as [Point, number])
      .sort((a, b) => b[1] - a[1])
      .map(([point]) => point);
    const currentNode = openSet.pop() ?? endPosition;
    if (doPointsEqual(currentNode, endPosition)) {
      return { cameFrom, currentNode };
    }
    for (const neighbour of getNeighbourPoints(currentNode, heightmap)) {
      const tentativeGScore = (gScore.get(JSON.stringify(currentNode)) ?? Number.MAX_VALUE) + 1;
      if (tentativeGScore < (gScore.get(JSON.stringify(neighbour)) ?? Number.MAX_VALUE)) {
        cameFrom.set(JSON.stringify(neighbour), currentNode);
        gScore.set(JSON.stringify(neighbour), tentativeGScore);
        fScore.set(JSON.stringify(neighbour), tentativeGScore + getManhattenDistance(neighbour, endPosition));
        if (openSet.filter((point) => doPointsEqual(point, neighbour)).length === 0) {
          openSet.push(neighbour);
        }
      }
    }
  }
  throw new Error('not found');
}

export const getNeighbourPoints = (currentNode: Point, heightmap: number[][]) => {
  const neighbourPoints: Point[] = [];
  if (currentNode[0] - 1 >= 0) {
    const neighbour = [currentNode[0] - 1, currentNode[1]] as Point;
    if (heightmap[neighbour[0]][neighbour[1]] - heightmap[currentNode[0]][currentNode[1]] <= 1) {
      neighbourPoints.push(neighbour);
    }
  }
  if (currentNode[0] + 1 < heightmap.length) {
    const neighbour = [currentNode[0] + 1, currentNode[1]] as Point;
    if (heightmap[neighbour[0]][neighbour[1]] - heightmap[currentNode[0]][currentNode[1]] <= 1) {
      neighbourPoints.push(neighbour);
    }
  }
  if (currentNode[1] - 1 >= 0) {
    const neighbour = [currentNode[0], currentNode[1] - 1] as Point;
    if (heightmap[neighbour[0]][neighbour[1]] - heightmap[currentNode[0]][currentNode[1]] <= 1) {
      neighbourPoints.push(neighbour);
    }
  }
  if (currentNode[1] + 1 < heightmap[0].length) {
    const neighbour = [currentNode[0], currentNode[1] + 1] as Point;
    if (heightmap[neighbour[0]][neighbour[1]] - heightmap[currentNode[0]][currentNode[1]] <= 1) {
      neighbourPoints.push(neighbour);
    }
  }
  return neighbourPoints;
};

export const reconstructPath = (cameFrom: Map<string, Point>, current: Point) => {
  const totalPath = [current];
  while (cameFrom.has(JSON.stringify(current))) {
    current = cameFrom.get(JSON.stringify(current)) ?? [-1, -1];
    totalPath.push(current);
  }
  return totalPath;
};

export default function solveDay12() {
  const pathLengths = [];
  const startsToCheck: Point[] = [];
  const heightmapInput = readInput('inputs/day12.dat');
  const { heightmap, startPosition, endPosition } = parseHeightmap(heightmapInput);
  const { cameFrom, currentNode } = aStar(heightmap, startPosition, endPosition);
  console.log(`Your shortest path has length: ${reconstructPath(cameFrom, currentNode).length - 1}`);
  heightmap.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (value === 0) {
        startsToCheck.push([rowIndex, columnIndex]);
      }
    });
  });
  for (const point of startsToCheck) {
    try {
      const { cameFrom, currentNode } = aStar(heightmap, point, endPosition);
      pathLengths.push(reconstructPath(cameFrom, currentNode).length - 1);
    } catch {
      /* empty */
    }
  }
  console.log(`The best hiking path has length: ${pathLengths.sort((a, b) => a - b)[0]}`);
}
