import { readInput } from '../utils';
import _ from 'lodash';

type Instruction = {
  name: 'noop' | 'addx';
  value: undefined | number;
  executionTime: 1 | 2;
};

export const splitInstructions = (instructionsString: string) => instructionsString.trim().split(/\n/);

export const parseInstructionsList = (instructions: string[]) =>
  instructions.map((instruction) => parseInstruction(instruction));

export const parseInstruction = (instruction: string) => {
  const [name, value] = instruction.split(' ');
  return { name, value: parseInt(value), executionTime: name === 'noop' ? 1 : 2 } as Instruction;
};

export const calculateXPerCycle = (instructions: Instruction[]) => {
  return instructions.reduce(
    (xPerCycle, instruction) => {
      const currentX = _.last(xPerCycle) as number;
      if (instruction.name === 'noop') {
        return [...xPerCycle, currentX];
      } else if (instruction.value) {
        return [...xPerCycle, currentX, currentX + instruction.value];
      } else {
        throw new Error(`What happend with: ${instruction}`);
      }
    },
    [1, 1]
  );
};

const countedSignals = [20, 60, 100, 140, 180, 220];

export const getSignalStrength = (xByCycle: number[]) =>
  xByCycle.reduce((signalStrength, currentX, index) => {
    return countedSignals.includes(index) ? signalStrength + currentX * index : signalStrength;
  }, 0);

export const renderRow = (xByCycle: number[]) =>
  xByCycle.reduce((row, currentX, index) => (Math.abs(currentX - index) <= 1 ? row + '#' : row + '.'), '');

export default function solveDay10() {
  const puzzleInput = readInput('./inputs/day10.dat');
  const instructionsList = splitInstructions(puzzleInput);
  const instructions = parseInstructionsList(instructionsList);
  const xPerCycle = calculateXPerCycle(instructions);
  console.log(`The signal strength is: ${getSignalStrength(xPerCycle)}`);
  const toRender = xPerCycle.slice(1, 241);
  const output = _.chunk(toRender, 40).map(renderRow);
  console.log(`The screen reads:\n${output.join('\n')}`);
}
