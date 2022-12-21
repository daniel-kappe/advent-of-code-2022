import _ from 'lodash';
import { readInput } from '../utils';
import { totalmem } from 'os';

type Coordinate = [number, number, number];

interface BoundingBox {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

interface LavaObject {
  cubes: Coordinate[];
  surfaceArea: number;
  boundingBox: BoundingBox;
  outerSurfaceArea?: number;
}

export const updateBoundingBox = (newCoordinate: Coordinate, boundingBox: BoundingBox) => {
  const [x, y, z] = newCoordinate;
  return {
    minX: Math.min(boundingBox.minX, x),
    minY: Math.min(boundingBox.minY, y),
    minZ: Math.min(boundingBox.minZ, z),
    maxX: Math.max(boundingBox.maxX, x),
    maxY: Math.max(boundingBox.maxY, y),
    maxZ: Math.max(boundingBox.maxZ, z)
  } as BoundingBox;
};

export const getBoundingBoxVolumn = (boundingBox: BoundingBox) =>
  (boundingBox.maxX - boundingBox.minX + 1) *
  (boundingBox.maxY - boundingBox.minY + 1) *
  (boundingBox.maxZ - boundingBox.minZ + 1);

export const getBoundingBoxMinDimension = (boundingBox: BoundingBox) =>
  _.min([
    boundingBox.maxX - boundingBox.minX + 1,
    boundingBox.maxY - boundingBox.minY + 1,
    boundingBox.maxZ - boundingBox.minZ + 1
  ]) as number;

export const parseCoordinates = (coordinateString: string) =>
  coordinateString.split(',').map((num) => parseInt(num, 10)) as Coordinate;

export const neighbourNodes = (coordinateString: string) => {
  const [x, y, z] = parseCoordinates(coordinateString);
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y - 1, z],
    [x, y + 1, z],
    [x, y, z - 1],
    [x, y, z + 1]
  ].map((coordinate) => coordinate.join(','));
};

export const neighbourNodesDiag = (coordinateString: string) => {
  const [x, y, z] = parseCoordinates(coordinateString);
  return _.flattenDeep([
    _.range(-1, 2).map((modX) =>
      _.range(-1, 2).map((modY) => _.range(-1, 2).map((modZ) => [x + modX, y + modY, z + modZ].join(',')))
    )
  ]).filter((coordinate) => coordinate !== coordinateString);
};

export const buildQueue = (puzzleInput: string) => puzzleInput.trim().split(/\n/);

function getBoundingBoxInitial() {
  return {
    minX: Number.MAX_VALUE,
    minY: Number.MAX_VALUE,
    minZ: Number.MAX_VALUE,
    maxX: Number.MIN_VALUE,
    maxY: Number.MIN_VALUE,
    maxZ: Number.MIN_VALUE
  };
}

export const getNewLavaObject = () =>
  ({
    cubes: [],
    surfaceArea: 0,
    boundingBox: getBoundingBoxInitial()
  } as LavaObject);

export const getMeasuringBox = (boundingBox: BoundingBox) => {
  const { minX, minY, minZ, maxX, maxY, maxZ } = boundingBox;
  return {
    minX: minX - 1,
    minY: minY - 1,
    minZ: minZ - 1,
    maxX: maxX + 1,
    maxY: maxY + 1,
    maxZ: maxZ + 1
  } as BoundingBox;
};

export function processQueue(coordinateQueue: string[]) {
  const knownCubes = new Set<string>(coordinateQueue);
  const visitedCubes = new Set<string>();
  const lavaObjects: LavaObject[] = [getNewLavaObject()];
  while (coordinateQueue.length > 0) {
    const currentPosition = coordinateQueue.pop() as string;
    let coveredFaces = 0;
    let newCubeFound = false;
    for (const newPosition of neighbourNodes(currentPosition)) {
      if (knownCubes.has(newPosition)) coveredFaces++;
      if (!visitedCubes.has(newPosition) && knownCubes.has(newPosition)) {
        coordinateQueue.push(newPosition);
        newCubeFound = true;
      }
    }
    const lavaObject = lavaObjects[lavaObjects.length - 1];
    const currentCoordinate = parseCoordinates(currentPosition);
    lavaObject.cubes.push(currentCoordinate);
    lavaObject.boundingBox = updateBoundingBox(currentCoordinate, lavaObject.boundingBox);
    lavaObject.surfaceArea += 6 - coveredFaces;
    if (!newCubeFound) lavaObjects.push(getNewLavaObject());
    visitedCubes.add(currentPosition);
    coordinateQueue = coordinateQueue.filter((cube) => !visitedCubes.has(cube));
  }
  lavaObjects.pop();
  return lavaObjects;
}

export function getBoundingBox(coordinateQueue: string[]) {
  let boundingBox: BoundingBox = getBoundingBoxInitial();
  for (const coordinateString of coordinateQueue) {
    const coordinate = parseCoordinates(coordinateString);
    boundingBox = updateBoundingBox(coordinate, boundingBox);
  }
  return boundingBox;
}

export function measureExteriorSurface(coordinateQueue: string[]) {
  const measureBox = getMeasuringBox(getBoundingBox(coordinateQueue));
  const rockPositions = new Set(coordinateQueue);
  let currentPosition = '';
  let totalSurface = 0;
  let positionsToVisit = [`${measureBox.minX},${measureBox.minY},${measureBox.minZ}`];
  const visitedPositions: Set<string> = new Set();
  while (positionsToVisit.length > 0) {
    currentPosition = positionsToVisit.shift() ?? '';
    visitedPositions.add(currentPosition);
    for (const neighbourPosition of neighbourNodes(currentPosition)) {
      if (rockPositions.has(neighbourPosition)) {
        totalSurface++;
      }
      if (!visitedPositions.has(neighbourPosition) && inBoundingBox(neighbourPosition, measureBox)) {
        if (!rockPositions.has(neighbourPosition)) {
          positionsToVisit.push(neighbourPosition);
        }
      }
    }
    positionsToVisit = positionsToVisit.filter((position) => !visitedPositions.has(position));
  }
  return totalSurface;
}

export function inBoundingBox(currentPosition: string, boundingBox: BoundingBox) {
  const [x, y, z] = parseCoordinates(currentPosition);
  return (
    x >= boundingBox.minX &&
    x <= boundingBox.maxX &&
    y >= boundingBox.minY &&
    y <= boundingBox.maxY &&
    z >= boundingBox.minZ &&
    z <= boundingBox.maxZ
  );
}

export const getLavaObjectsTotalSurface = (lavaObjects: LavaObject[]) =>
  _.sum(lavaObjects.map((lavaObject) => lavaObject.surfaceArea));

export default function solveDay18() {
  const puzzleInput = readInput('inputs/day18.dat');
  const lavaObjects = processQueue(buildQueue(puzzleInput));
  console.log(`The lava droplets have a total surface area of: ${getLavaObjectsTotalSurface(lavaObjects)}`);

  const exteriorSurface = measureExteriorSurface(buildQueue(puzzleInput));
  console.log(`The lava droplets have an exterior surface of: ${exteriorSurface}`);
}
