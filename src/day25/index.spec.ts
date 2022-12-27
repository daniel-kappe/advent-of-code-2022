import { convertBase5ToSnafu, getFuelTotalInSnafu, parseAllSNAFUNumbers, parseSNAFU, toSNAFU } from './index';

describe('day 25 tests', () => {
  const exampleInput = `\
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`;

  const parsedInput = [1747, 906, 198, 11, 201, 31, 1257, 32, 353, 107, 7, 3, 37];
  describe('parseSNAFU', () => {
    it('parses the first two example numbers', () => {
      // when
      const parsedNumber1 = parseSNAFU('1=-0-2');
      const parsedNumber2 = parseSNAFU('12111');

      // then
      expect(parsedNumber1).toEqual(1747);
      expect(parsedNumber2).toEqual(906);
    });
  });

  describe('parseAllSNAFUNumbers', () => {
    it('parses the example correctly', () => {
      // when
      const parsedNumbers = parseAllSNAFUNumbers(exampleInput.trim().split('\n'));

      // then
      expect(parsedNumbers).toEqual(parsedInput);
    });
  });

  describe('convertBase5ToSnafu', () => {
    it('converts to snafu correctly', () => {
      // given
      const base5example = parsedInput.map((num) => num.toString(5));

      // when
      const snafus = base5example.map(convertBase5ToSnafu);

      // then
      expect(snafus).toEqual(exampleInput.trim().split('\n'));
    });
  });

  describe('toSNAFU', () => {
    it('converts an example base10 to snafu', () => {
      // given
      const example = 4890;

      // when
      const snafu = toSNAFU(example);

      // then
      expect(snafu).toEqual('2=-1=0');
    });
  });

  describe('getFuelTotalInSnafu', () => {
    it('gets the correct total snafu input', () => {
      // when
      const total = getFuelTotalInSnafu(exampleInput.trim().split('\n'));

      // then
      expect(total).toEqual('2=-1=0');
    });
  });
});
