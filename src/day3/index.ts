import { readInput } from '../utils';
import _ from 'lodash';

export const splitIntoRucksacks = (puzzleInput: string) => puzzleInput.trimEnd().split(/\n/);

export const splitRucksackIntoCompartments = (rucksack: string) => [
  rucksack.slice(0, rucksack.length / 2),
  rucksack.slice(rucksack.length / 2, rucksack.length)
];

export const splitRucksackCompartments = (rucksacks: string) =>
  splitIntoRucksacks(rucksacks).map((rucksack) => splitRucksackIntoCompartments(rucksack));

export const scoreIdenticalItem = ([compartment1, compartment2]: string[]) => {
  for (const item of _.toArray(compartment2)) {
    if (compartment1.includes(item)) {
      return scoreItem(item);
    }
  }
};

export const scoreItem = (item: string) => (isLowerCase(item) ? item.charCodeAt(0) - 96 : item.charCodeAt(0) - 38);

export const scoreAllRucksacks = (rucksacks: string[][]) => rucksacks.map((rucksack) => scoreIdenticalItem(rucksack));

export const splitInGroupsOfThree = (rucksacks: string[]) => {
  const groups: string[][] = [];
  for (let index = 0; index < rucksacks.length; index++) {
    if (index % 3 === 0) {
      groups.push([rucksacks[index]]);
    } else {
      groups[groups.length - 1].push(rucksacks[index]);
    }
  }
  return groups;
};

export const findCommonItem = ([rucksack1, rucksack2, rucksack3]: string[]) => {
  for (const item of _.toArray(rucksack1)) {
    if (rucksack2.includes(item) && rucksack3.includes(item)) {
      return item;
    }
  }
  return '';
};

export const scoreAllGroups = (groups: string[][]) => groups.map((group) => scoreItem(findCommonItem(group)));

export default function solveDay3() {
  const content = readInput('inputs/day3.dat');
  const rucksacks = splitRucksackCompartments(content);
  const score = _.sum(scoreAllRucksacks(rucksacks));
  console.log(`The total score of all rucksacks is: ${score}`);

  console.log(
    `The total score of the teams is: ${_.sum(scoreAllGroups(splitInGroupsOfThree(splitIntoRucksacks(content))))}`
  );
}

const isLowerCase = (character: string) => character.toLowerCase() === character;
