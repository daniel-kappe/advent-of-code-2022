import {
  convertCaloriesAllElves,
  findTopCalorieCarringElf,
  findTopThreeCalorieElvesSummed,
  separateByElf,
  sumElfCalories
} from './index';

describe('test with example input', () => {
  const exampleInput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

  const expectedOutputTask1 = 24000;
  const expectedOutputTask2 = [24000, 11000, 10000];

  describe('findTopCalorieCarringElf', () => {
    it('finds the elf with the most calories and returns the calories', () => {
      // when
      const topElfCalories = findTopCalorieCarringElf(
        sumElfCalories(convertCaloriesAllElves(separateByElf(exampleInput)))
      );

      // then
      expect(topElfCalories).toEqual(expectedOutputTask1);
    });
  });

  describe('findTopThreeCalorieElvesSummed', () => {
    it('returns the summed calories of the three elves carrying the most calories', () => {
      const sumTopThreeCalorieCounts = findTopThreeCalorieElvesSummed(
        sumElfCalories(convertCaloriesAllElves(separateByElf(exampleInput)))
      );

      // then
      expect(sumTopThreeCalorieCounts).toEqual(expectedOutputTask2);
    });
  });
});
