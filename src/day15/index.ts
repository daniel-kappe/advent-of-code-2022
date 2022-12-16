import _ from 'lodash/fp';
import { readInput } from '../utils';

export class Boundary {
  constructor(
    public readonly minX: number,
    public readonly maxX: number,
    public readonly minY: number,
    public readonly maxY: number
  ) {}

  public static fromSensor(sensor: Sensor) {
    return new Boundary(
      sensor.position.x - sensor.sensingRange,
      sensor.position.x + sensor.sensingRange,
      sensor.position.y - sensor.sensingRange,
      sensor.position.y + sensor.sensingRange
    );
  }

  public newWithIncludedSensor(sensor: Sensor) {
    const sensorBoundary = Boundary.fromSensor(sensor);
    return new Boundary(
      Math.min(this.minX, sensorBoundary.minX),
      Math.max(this.maxX, sensorBoundary.maxX),
      Math.min(this.minY, sensorBoundary.minY),
      Math.max(this.maxY, sensorBoundary.maxY)
    );
  }

  public getYRange() {
    return _.range(this.minY, this.maxY + 1);
  }

  public getXRange() {
    return _.range(this.minX, this.maxX + 1);
  }
}

export class Position {
  constructor(public readonly x: number, public readonly y: number) {}

  public static fromArray([x, y]: number[]) {
    return new Position(x, y);
  }

  public getManhattenDistanceTo(other: Position) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }

  public equals(other: Position) {
    return this.x === other.x && this.y === other.y;
  }
}

export class Sensor {
  public readonly sensingRange: number;
  constructor(public readonly position: Position, public readonly beaconPosition: Position) {
    this.sensingRange = this.position.getManhattenDistanceTo(this.beaconPosition);
  }

  public static fromString(sensorString: string) {
    const [sensor, beacon] = [...sensorString.matchAll(/x=(-?\d+), y=(-?\d+)/g)].map((match) => [
      parseInt(match[1]),
      parseInt(match[2])
    ]);
    return new Sensor(Position.fromArray(sensor), Position.fromArray(beacon));
  }

  public isRowInSensingRange(y: number) {
    return y >= this.position.y - this.sensingRange && y <= this.position.y + this.sensingRange;
  }

  public isColumnInSensingRange(x: number) {
    return x >= this.position.x - this.sensingRange && x <= this.position.x + this.sensingRange;
  }

  public getStartEndSensingInRow(y: number) {
    const sensingRangeX = this.sensingRange - Math.abs(this.position.y - y);
    return [this.position.x - sensingRangeX, this.position.x + sensingRangeX];
  }

  public isInSensingRange(position: Position) {
    return this.position.getManhattenDistanceTo(position) <= this.sensingRange;
  }

  public isBeaconPosition(position: Position) {
    return position.equals(this.beaconPosition);
  }
}

export function getAllSensors(puzzleInput: string) {
  return puzzleInput
    .trim()
    .split(/\n/)
    .map((sensorString) => Sensor.fromString(sensorString));
}

export function getAllSensorBoundary(sensors: Sensor[]) {
  return sensors.reduce((boundary, sensor) => boundary.newWithIncludedSensor(sensor), Boundary.fromSensor(sensors[0]));
}

export function getCoveredPositionsInRow(
  sensors: Sensor[],
  row: number,
  sensorBoundary: Boundary,
  withBeacons = true
): number[] {
  const sensorsSensingInRow = sensors.filter((sensor) => sensor.isRowInSensingRange(row));
  return sensorBoundary.getXRange().map((x) => {
    const position = Position.fromArray([x, row]);
    for (const sensor of sensorsSensingInRow) {
      if (withBeacons && sensor.isInSensingRange(position) && !sensor.isBeaconPosition(position)) return 1;
      if (!withBeacons && sensor.isInSensingRange(position)) return 1;
    }
    return 0;
  });
}

export function getUncoveredPositionInRow(sensors: Sensor[], row: number, boundary: Boundary) {
  const sensorsSensingInRow = sensors
    .filter((sensor) => sensor.isRowInSensingRange(row))
    .sort((sensorA, sensorB) => sensorA.getStartEndSensingInRow(row)[0] - sensorB.getStartEndSensingInRow(row)[0]);
  for (let column = boundary.minX; column <= boundary.maxX; column++) {
    for (let sensorIndex = 0; sensorIndex < sensorsSensingInRow.length; sensorIndex++) {
      const activeSensor = sensorsSensingInRow[sensorIndex];
      const [startSensing, endSensing] = activeSensor.getStartEndSensingInRow(row);
      if (column >= startSensing && column <= endSensing) {
        column = endSensing + 1;
      }
    }
    if (column < boundary.maxX) return column;
  }
  return -1;
}

export function getPrintableSensorArea(sensors: Sensor[], boundary: Boundary) {
  return boundary
    .getYRange()
    .map((y) => getCoveredPositionsInRow(sensors, y, boundary, false).join(''))
    .join('\n');
}

export function getDistressLocation(sensors: Sensor[], boundary: Boundary) {
  for (const y of boundary.getYRange()) {
    const coveredPosition = getUncoveredPositionInRow(sensors, y, boundary);
    if (coveredPosition !== -1) return Position.fromArray([coveredPosition, y]);
    // const progress = `${((y - boundary.minY) / (boundary.maxY - boundary.minY)) * 100}`;
    // console.log(progress + '%');
  }
  return undefined;
}

export function getTuningFrequency(sensors: Sensor[], boundary: Boundary) {
  const distressLocation = getDistressLocation(sensors, boundary);
  if (distressLocation) return distressLocation.x * 4000000 + distressLocation.y;
  return undefined;
}

export function getNumberCoveredPositionsInRow(sensors: Sensor[], row: number, sensorBoundary: Boundary) {
  return _.sum(getCoveredPositionsInRow(sensors, row, sensorBoundary));
}

export default function solveDay15() {
  const puzzleInput = readInput('./inputs/day15.dat');
  const sensors = getAllSensors(puzzleInput);
  const sensorsBoundary = getAllSensorBoundary(sensors);
  const coveredInRow2000000 = getNumberCoveredPositionsInRow(sensors, 2000000, sensorsBoundary);

  console.log(`There is a total of ${coveredInRow2000000} covered positions in row 2000000`);

  const tuningBoundary = new Boundary(0, 4000000, 0, 4000000);
  const tuningFrequency = getTuningFrequency(sensors, tuningBoundary);

  console.log(`The tuning frequency is: ${tuningFrequency}`);
}
