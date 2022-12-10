import { calculateXPerCycle, getSignalStrength, parseInstructionsList, splitInstructions } from './index';

describe('test day 10', () => {
  const exampleShort = `\
noop
addx 3
addx -5
`;
  const exampleLong = `\
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;
  describe('calculateXPerCycle', () => {
    it('is correct for the short example', () => {
      // when
      const instructions = parseInstructionsList(splitInstructions(exampleShort));
      const xPerCycle = calculateXPerCycle(instructions);

      // then
      expect(xPerCycle).toEqual([1, 1, 1, 1, 4, 4, -1]);
    });

    it('is correct for the 20th cycle on the long example', () => {
      // when
      const instructions = parseInstructionsList(splitInstructions(exampleLong));
      const xPerCycle = calculateXPerCycle(instructions);

      // then
      expect(xPerCycle[20]).toEqual(21);
    });

    it('is correct for the 60th cycle on the long example', () => {
      // when
      const instructions = parseInstructionsList(splitInstructions(exampleLong));
      const xPerCycle = calculateXPerCycle(instructions);

      // then
      expect(xPerCycle[60]).toEqual(19);
    });

    it('is correct for the 100th cycle on the long example', () => {
      // when
      const instructions = parseInstructionsList(splitInstructions(exampleLong));
      const xPerCycle = calculateXPerCycle(instructions);

      // then
      expect(xPerCycle[100]).toEqual(18);
    });

    it('is correct for the 140th cycle on the long example', () => {
      // when
      const instructions = parseInstructionsList(splitInstructions(exampleLong));
      const xPerCycle = calculateXPerCycle(instructions);

      // then
      expect(xPerCycle[140]).toEqual(21);
    });

    it('is correct for the 180th cycle on the long example', () => {
      // when
      const instructions = parseInstructionsList(splitInstructions(exampleLong));
      const xPerCycle = calculateXPerCycle(instructions);

      // then
      expect(xPerCycle[180]).toEqual(16);
    });

    it('is correct for the 220th cycle on the long example', () => {
      // when
      const instructions = parseInstructionsList(splitInstructions(exampleLong));
      const xPerCycle = calculateXPerCycle(instructions);

      // then
      expect(xPerCycle[220]).toEqual(18);
    });
  });

  describe('getSignalStrength', () => {
    it('is correct for the long example', () => {
      // given
      const instructions = parseInstructionsList(splitInstructions(exampleLong));
      const xPerCycle = calculateXPerCycle(instructions);

      // when
      const signalStrength = getSignalStrength(xPerCycle);

      // then
      expect(signalStrength).toEqual(13140);
    });
  });
});
