import _ from 'lodash';
import { readInput } from '../utils';

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
  const inputFile = './inputs/day1.dat';
  const fileContent = readInput(inputFile);
  const inputByElf = separateByElf(fileContent);
  const caloriesByElf = convertCaloriesAllElves(inputByElf);
  const topCalorieCarryingElf = findTopCalorieCarringElf(sumElfCalories(caloriesByElf));
  const caloriesTopThreeElves = _.sum(findTopThreeCalorieElvesSummed(sumElfCalories(caloriesByElf)));

  console.log(`The most calories carried by one elf are: ${topCalorieCarryingElf}`);
  console.log(`The top 3 elves carry a total calorie count of: ${caloriesTopThreeElves}`);
}
