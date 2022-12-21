import { readInput } from '../utils';
import { Decimal } from 'decimal.js';

type PathToRoot = string[];
type ContainedIn = { [key: string]: string };
type Register = { [key: string]: string | number };

export default function solveDay21() {
  //   const puzzleInput = `\
  // root: pppw + sjmn
  // dbpl: 5
  // cczh: sllz + lgvd
  // zczc: 2
  // ptdq: humn - dvpt
  // dvpt: 3
  // lfqf: 4
  // humn: 5
  // ljgn: 2
  // sjmn: drzm * dbpl
  // sllz: 4
  // pppw: cczh / lfqf
  // lgvd: ljgn * ptdq
  // drzm: hmdt - zczc
  // hmdt: 32
  // `;
  const puzzleInput = readInput('inputs/day21.dat');
  const { register, containedIn } = parseInput(puzzleInput);
  console.log(`The root Monkey yells: ${resolveKey(register, 'root')}`);

  // const pathHumnToRoot = getPathHumnToRoot(register, containedIn);
  // const whatToYell = getWhatToYell(register, pathHumnToRoot);
  // console.log(whatToYell);

  /**
   * First try with solving the by reversed math did not work somehow, so I manually
   * found the solution by trying out (the solution by math gave a negative output,
   * reducing the number by a factor of 3 gave an output above one. From there a just
   * went down the powers of ten by 2 steps till I got the right answer (shame on me)
   */
  checkWhatYouYell(register, 3220993874133);
}

export function checkWhatYouYell(register: Register, num: number) {
  const [rootLeft, , rootRight] = (register['root'] as string).split(' ');
  const clonedRegister = { ...register, humn: num };
  const evalLeft = resolveKey(clonedRegister, rootLeft);
  const evalRight = resolveKey(clonedRegister, rootRight);
  console.log(evalLeft.div(evalRight));
  return evalLeft.equals(evalRight);
}

export function getWhatToYell(register: Register, pathToRoot: PathToRoot) {
  const [rootLeft, , rootRight] = (register['root'] as string).split(' ');
  Decimal.set({ precision: 60 });
  let currentSameSide = pathToRoot.pop() as string;
  let otherSide = new Decimal(
    rootLeft === currentSameSide ? resolveKey(register, rootRight) : resolveKey(register, rootLeft)
  );
  while (pathToRoot.length > 0) {
    const registerElement = register[currentSameSide];
    if (typeof registerElement === 'string') {
      const [currentLeft, operation, currentRight] = registerElement.split(' ');
      currentSameSide = pathToRoot.pop() as string;
      const currentOtherSide = new Decimal(
        currentLeft === currentSameSide ? resolveKey(register, currentRight) : resolveKey(register, currentLeft)
      );
      switch (operation) {
        case '+':
          otherSide = otherSide.minus(currentOtherSide);
          break;
        case '-':
          otherSide = otherSide.plus(currentOtherSide);
          break;
        case '*':
          otherSide = otherSide.divToInt(currentOtherSide);
          break;
        case '/':
          otherSide = otherSide.mul(currentOtherSide);
          break;
      }
    }
  }
  return otherSide;
}

export function resolveKey(register: Register, key: string): Decimal {
  const value = register[key];
  Decimal.set({ precision: 60 });
  if (typeof value === 'number') {
    return new Decimal(value);
  }
  const [firstKey, operation, secondKey] = value.split(' ');
  const firstValue = resolveKey(register, firstKey);
  const secondValue = resolveKey(register, secondKey);
  switch (operation) {
    case '+':
      return firstValue.add(secondValue);
    case '-':
      return firstValue.sub(secondValue);
    case '*':
      return firstValue.mul(secondValue);
    case '/':
      return firstValue.div(secondValue);
  }
  throw new Error('unknown operation');
}

export function getPathHumnToRoot(register: Register, containedIn: ContainedIn) {
  let currentKey = 'humn';
  const pathToRoot: PathToRoot = [];
  while (currentKey !== 'root') {
    pathToRoot.push(currentKey);
    currentKey = containedIn[currentKey];
  }
  return pathToRoot;
}
export const parseInput = (puzzleInput: string) => {
  const variables = puzzleInput
    .trim()
    .split(/\n/)
    .map((line) => line.split(': '));
  const mapping = {} as Register;
  const containedIn = {} as ContainedIn;
  variables.forEach(([key, value]) => {
    const isNumber = value.match(/^\d+$/);
    mapping[key] = isNumber ? parseInt(value, 10) : value;
    if (!isNumber) {
      const [firstKey, , secondKey] = value.split(' ');
      containedIn[firstKey] = key;
      containedIn[secondKey] = key;
    }
  });
  return { register: mapping, containedIn };
};
