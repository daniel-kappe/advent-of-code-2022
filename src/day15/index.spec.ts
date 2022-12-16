import {
  Boundary,
  getAllSensorBoundary,
  getAllSensors,
  getDistressLocation,
  getNumberCoveredPositionsInRow,
  getPrintableSensorArea,
  getTuningFrequency,
  Position
} from './index';

describe('tests day 15', () => {
  const exampleInput = `\
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

  describe('getAllSensors', () => {
    it('gets all sensors', () => {
      // when
      const sensors = getAllSensors(exampleInput);

      // then
      expect(sensors).toHaveLength(14);
    });
  });

  describe('getAllSensorBoundary', () => {
    it('calculates the upper bound of area covered by the sensors', () => {
      // given
      const sensors = getAllSensors(exampleInput);

      // when
      const boundary = getAllSensorBoundary(sensors);

      // then
      expect(boundary).toEqual(new Boundary(-8, 28, -10, 26));
    });
  });

  describe('getCoveredPositionsInRow', () => {
    it('calculates the correct number of covered Positions in row 10', () => {
      // given
      const sensors = getAllSensors(exampleInput);
      const boundary = getAllSensorBoundary(sensors);

      // when
      const numberCoveredPositions = getNumberCoveredPositionsInRow(sensors, 10, boundary);

      // then
      expect(numberCoveredPositions).toEqual(26);
    });
  });

  describe('getDistressLocation', () => {
    it('gets the right position', () => {
      // given
      const sensors = getAllSensors(exampleInput);
      const boundary = new Boundary(0, 20, 0, 20);

      // when
      const distressLocation = getDistressLocation(sensors, boundary);

      // then
      expect(distressLocation).toEqual(Position.fromArray([14, 11]));
    });
  });

  describe('getTuningFrequency', () => {
    it('gets the right tuning frequency', () => {
      // given
      const sensors = getAllSensors(exampleInput);
      const boundary = new Boundary(0, 20, 0, 20);

      // when
      const tuningFrequency = getTuningFrequency(sensors, boundary);

      // then
      expect(tuningFrequency).toEqual(56000011);
    });
  });
});
