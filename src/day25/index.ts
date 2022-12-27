import { toArray, trimStart, sum } from 'lodash';
import { readInput } from '../utils';

export function solveDay25() {
  const puzzleInput = readInput('inputs/day25.dat').trim().split('\n');

  const totalSNAFUFuel = getFuelTotalInSnafu(puzzleInput);
  console.log(`Input ${totalSNAFUFuel} to Bob's console.`);
}

export const getFuelTotalInSnafu = (fuelInSnafu: string[]) => toSNAFU(sum(parseAllSNAFUNumbers(fuelInSnafu)));

export const toSNAFU = (integer: number) => convertBase5ToSnafu(toBase5(integer));

export const convertBase5ToSnafu = (base5: string) =>
  trimStart(
    (toArray('0' + base5) as string[]).reverse().reduce(
      ({ base5String, carryover }, value) => {
        const newValue = parseInt(value, 5) + carryover;
        if (newValue < 3) return { base5String: newValue.toString(5) + base5String, carryover: 0 };
        if (newValue === 3) return { base5String: '=' + base5String, carryover: 1 };
        if (newValue === 4) return { base5String: '-' + base5String, carryover: 1 };
        return { base5String: (newValue - 5).toString(5) + base5String, carryover: 1 };
      },
      { base5String: '', carryover: 0 }
    ).base5String,
    '0'
  );

const toBase5 = (integer: number) => integer.toString(5);

export const parseAllSNAFUNumbers = (snafus: string[]) => snafus.map(parseSNAFU);

export const parseSNAFU = (snafu: string) =>
  (toArray(snafu) as SNAFUValue[]).reverse().reduce((previousValue, symbol, currentIndex) => {
    const place = Math.pow(5, currentIndex);
    switch (symbol) {
      case '2':
        return previousValue + 2 * place;
      case '1':
        return previousValue + place;
      case '0':
        return previousValue;
      case '-':
        return previousValue - place;
      case '=':
        return previousValue - 2 * place;
    }
  }, 0);

type SNAFUValue = '2' | '1' | '0' | '-' | '=';
