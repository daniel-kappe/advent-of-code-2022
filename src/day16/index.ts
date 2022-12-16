import _ from 'lodash';
import { readInput } from '../utils';

type ValveMap = { [name: string]: Valve };

class Valve {
  constructor(public readonly pressure: number, public readonly tunnelsTo: string[]) {}

  public static fromString(inputString: string) {
    const [name, ...tunnelsTo] = inputString.match(/[A-Z]{2}/g) ?? [];
    const pressure = inputString.match(/\d+/) ?? ['0'];
    return { name, valve: new Valve(parseInt(pressure[0]), tunnelsTo) };
  }

  public static fromPuzzleInput(inputString: string) {
    const valveMap = {} as ValveMap;
    inputString
      .trim()
      .split(/\n/)
      .forEach((valveString) => {
        const { name, valve } = Valve.fromString(valveString);
        valveMap[name ?? ''] = valve;
      });
    return valveMap;
  }
}

export function getNamesList(valveMap: ValveMap) {
  return _.keys(valveMap);
}

export function getDistanceMatrix(valveMap: ValveMap, namesList: string[]) {
  return namesList.map((name, i) =>
    namesList.map((toName, j) => {
      return i === j ? 0 : valveMap[name].tunnelsTo.includes(toName) ? 1 : 10_000;
    })
  );
}

export function minSumDistanceMatrix(distanceMatrix: number[][]) {
  return distanceMatrix.map((row) =>
    row.map((value, j) => {
      return _.min(_.zip(row, distanceMatrix[j]).map(([iVal, jVal]) => (iVal ?? 0) + (jVal ?? 0)));
    })
  ) as number[][];
}

export function minimalDistances(distanceMatrix: number[][]) {
  let oldMatrix = _.cloneDeep(distanceMatrix);
  let newMatrix = minSumDistanceMatrix(oldMatrix);
  while (!_.isEqual(oldMatrix, newMatrix)) {
    oldMatrix = _.cloneDeep(newMatrix);
    newMatrix = minSumDistanceMatrix(oldMatrix);
  }
  return newMatrix;
}

export function getPressureArray(valveMap: ValveMap, namesList: string[]) {
  return namesList.map((name) => valveMap[name].pressure);
}

type Path = { positions: number[]; releasedPressure: number; yourTime: number; pressures: number[] };

export function maxPressureReleased(distanceMatrix: number[][], pressureArray: number[], position: number) {
  let pathsWithTimeLeft: Path[] = [
    { positions: [position], releasedPressure: 0, yourTime: 30, pressures: [...pressureArray] }
  ];
  const pathsWithoutTime: Path[] = [];
  while (pathsWithTimeLeft.length > 0) {
    pathsWithTimeLeft = _.flatten(
      pathsWithTimeLeft.map((path) => {
        const { pressureRelease, remainingTimes } = getExpectedPresssureRelease(
          distanceMatrix,
          path.pressures,
          _.last(path.positions) ?? -1,
          path.yourTime
        );
        const placesToVisit = findPositiveValueIndices(pressureRelease);
        if (placesToVisit.length === 0) {
          pathsWithoutTime.push(_.cloneDeep(path));
          return [] as Path[];
        }
        return placesToVisit.map((index) => {
          const updatedPressures = [...path.pressures];
          updatedPressures[index] = 0;
          return {
            positions: [...path.positions, index],
            releasedPressure: path.releasedPressure + pressureRelease[index],
            yourTime: remainingTimes[index],
            pressures: updatedPressures
          } as Path;
        });
      })
    );
  }
  return pathsWithoutTime.sort((pathA, pathB) => pathB.releasedPressure - pathA.releasedPressure)[0];
}

type PathWithHelp = Path & { positionsElefant: number[]; elefantTime: number };

function pathSortDesc(pathA: PathWithHelp, pathB: PathWithHelp) {
  return pathB.releasedPressure - pathA.releasedPressure;
}

export function maxPressureReleasedWithHelp(distanceMatrix: number[][], pressureArray: number[], position: number) {
  let paths = [
    {
      positions: [position],
      positionsElefant: [position],
      yourTime: 26,
      elefantTime: 26,
      releasedPressure: 0,
      pressures: [...pressureArray]
    } as PathWithHelp
  ];
  for (let time = 26; time > 0; time--) {
    paths = _.flatten(
      paths.map((path) => {
        let newPaths: PathWithHelp[] = [];
        if (path.yourTime === time) {
          const { pressureRelease, remainingTimes } = getExpectedPresssureRelease(
            distanceMatrix,
            path.pressures,
            _.last(path.positions) ?? -1,
            time
          );
          const placesToVisit = findPositiveValueIndices(pressureRelease);
          if (placesToVisit.length > 0) {
            placesToVisit.forEach((index) => {
              const updatedPressures = [...path.pressures];
              updatedPressures[index] = 0;
              newPaths.push({
                positions: [...path.positions, index],
                elefantTime: path.elefantTime,
                positionsElefant: path.positionsElefant,
                releasedPressure: path.releasedPressure + pressureRelease[index],
                yourTime: remainingTimes[index],
                pressures: updatedPressures
              } as PathWithHelp);
            });
          }
        }
        if (path.elefantTime === time) {
          const { pressureRelease, remainingTimes } = getExpectedPresssureRelease(
            distanceMatrix,
            path.pressures,
            _.last(path.positionsElefant) ?? -1,
            time
          );
          const placesToVisit = findPositiveValueIndices(pressureRelease);
          if (placesToVisit.length > 0 && newPaths.length === 0) {
            placesToVisit.forEach((index) => {
              const updatedPressures = [...path.pressures];
              updatedPressures[index] = 0;
              newPaths.push({
                positions: [...path.positions],
                elefantTime: remainingTimes[index],
                positionsElefant: [...path.positionsElefant, index],
                releasedPressure: path.releasedPressure + pressureRelease[index],
                yourTime: path.yourTime,
                pressures: updatedPressures
              } as PathWithHelp);
            });
          } else if (placesToVisit.length > 0 && newPaths.length > 0) {
            newPaths = _.flatten(
              newPaths.map((path) => {
                return placesToVisit
                  .filter((newPos) => _.last(path.positions) !== newPos)
                  .map((index) => {
                    const { releasedPressure, pressures, positionsElefant } = path;
                    const updatedPressures = [...pressures];
                    updatedPressures[index] = 0;
                    return {
                      ...path,
                      elefantTime: remainingTimes[index],
                      positionsElefant: [...positionsElefant, index],
                      releasedPressure: releasedPressure + pressureRelease[index],
                      pressures: updatedPressures
                    } as PathWithHelp;
                  });
              })
            );
          }
        }
        return newPaths.length === 0 ? [path] : newPaths;
      })
    );
    paths = paths.sort(pathSortDesc).slice(0, 5_000);
  }
  return paths.sort(pathSortDesc)[0];
}

export function getExpectedPresssureRelease(
  distanceMatrix: number[][],
  pressureArray: number[],
  currentPosition: number,
  remainingTime: number
) {
  const timeRemainingWhenThere = distanceMatrix[currentPosition].map((travelTime) => remainingTime - travelTime - 1);
  return {
    remainingTimes: timeRemainingWhenThere,
    pressureRelease: _.zip(timeRemainingWhenThere, pressureArray).map(
      ([time, pressure]) => (time ?? 0) * (pressure ?? 0)
    ) as number[]
  };
}

export function findPositiveValueIndices(array: number[]) {
  return array.reduce((indices, value, index) => (value > 0 ? [...indices, index] : indices), [] as number[]);
}

export default function solveDay16() {
  const realInput = readInput('./inputs/day16.dat');
  const valves = Valve.fromPuzzleInput(realInput);
  const namesList = getNamesList(valves).sort();
  const miniumDistancesMatrix = minimalDistances(getDistanceMatrix(valves, namesList));
  const initialPressureArray = getPressureArray(valves, namesList);
  const { releasedPressure } = maxPressureReleased(miniumDistancesMatrix, initialPressureArray, 0);
  console.log(`You can release a max of ${releasedPressure} pressure`);

  const { releasedPressure: releasedWithHelp } = maxPressureReleasedWithHelp(
    miniumDistancesMatrix,
    initialPressureArray,
    0
  );
  console.log(`With help you release a max of ${releasedWithHelp} pressure`);
}
