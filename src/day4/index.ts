import { parseInt } from 'lodash';
import { readInput } from '../utils';

export type Assignment = {
  start: number;
  end: number;
};

export type ElfPair = {
  firstElf: Assignment;
  secondElf: Assignment;
};

export const parseAssignmentGroups = (puzzleInput: string) => {
  const elfPairs = puzzleInput.trimEnd().split(/\n/);
  return elfPairs.map((elfPair) => {
    const [firstElf, secondElf] = elfPair.split(',');
    const [firstElfStart, firstElfEnd] = firstElf.split('-').map(parseInt);
    const [secondElfStart, secondElfEnd] = secondElf.split('-').map(parseInt);
    return {
      firstElf: { start: firstElfStart, end: firstElfEnd },
      secondElf: { start: secondElfStart, end: secondElfEnd }
    } as ElfPair;
  });
};

export const doAssignmentsFullyOverlap = (elfPair: ElfPair) => {
  const { firstElf, secondElf } = elfPair;
  if (firstElf.start <= secondElf.start && firstElf.end >= secondElf.end) {
    return true;
  }
  return firstElf.start >= secondElf.start && firstElf.end <= secondElf.end;
};

export const doAssignmentsPartiallyOverlap = (elfPair: ElfPair) => {
  const { firstElf, secondElf } = elfPair;
  if (firstElf.start <= secondElf.start && firstElf.end >= secondElf.start) {
    return true;
  }
  if (firstElf.start <= secondElf.end && firstElf.end >= secondElf.end) {
    return true;
  }
  if (secondElf.start <= firstElf.start && secondElf.end >= firstElf.start) {
    return true;
  }
  return secondElf.start <= firstElf.end && secondElf.end >= firstElf.end;
};

export const sumFullyOverlappingAssignments = (elfPairs: ElfPair[]) => {
  return elfPairs.reduce<number>((currentSum, currentPair) => {
    return doAssignmentsFullyOverlap(currentPair) ? currentSum + 1 : currentSum;
  }, 0);
};

export const sumPartiallyOverlappingAssignments = (elfPairs: ElfPair[]) => {
  return elfPairs.reduce<number>((currentSum, currentPair) => {
    return doAssignmentsPartiallyOverlap(currentPair) ? currentSum + 1 : currentSum;
  }, 0);
};

export default function solveDay4() {
  const puzzleInput = readInput('./inputs/day4.dat');
  const assignmentPairs = parseAssignmentGroups(puzzleInput);
  const fullyOverlappingAssignments = sumFullyOverlappingAssignments(assignmentPairs);
  const partiallyOverlappingAssignments = sumPartiallyOverlappingAssignments(assignmentPairs);

  console.log(`${fullyOverlappingAssignments} assignments fully overlap`);
  console.log(`${partiallyOverlappingAssignments} assignments partially overlap`);
}
