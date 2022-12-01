import { readFileSync } from 'fs';
import _ from 'lodash';

const readInput = () => readFileSync('./inputs/day1.dat', { encoding: 'utf-8' });

export const separateByElf = (data: string) => data.split(/\n\n/);

export const convertCaloriesSingleElf = (caloriesString: string) =>
  caloriesString.split(/\n/).map((calory) => parseInt(calory));

export const convertCaloriesAllElves = (allElvesCalories: string[]) =>
  allElvesCalories.map((elfCalories) => convertCaloriesSingleElf(elfCalories));

export const sumElfCalories = (allElvesCalories: number[][]) =>
  allElvesCalories.map((elfCalories) => _.sum(elfCalories));

export const findTopCalorieCarringElf = (allElvesCaloriesSummed: number[]) => _.max(allElvesCaloriesSummed);

export const findTopThreeCalorieElvesSummed = (allElvesCaloriesSummed: number[]) =>
  allElvesCaloriesSummed.sort((a, b) => b - a).slice(0, 3);

export default function solveDay1() {
  const topCalorieCarryingElf = findTopCalorieCarringElf(
    sumElfCalories(convertCaloriesAllElves(separateByElf(readInput())))
  );
  const caloriesTopThreeElves = _.sum(
    findTopThreeCalorieElvesSummed(sumElfCalories(convertCaloriesAllElves(separateByElf(readInput()))))
  );

  console.log(`The most calories carried by one elf are: ${topCalorieCarryingElf}`);
  console.log(`The top 3 elves carry a total calorie count of: ${caloriesTopThreeElves}`);
}
