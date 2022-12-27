import { parseInput, progressStorms, searchPath, wrapPosition } from './index';

describe('tests day24', () => {
  const shortExample = `\
#.#####
#.....#
#>....#
#.....#
#...v.#
#.....#
#####.#
`;
  const longExample = `\
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`;

  describe('parseInput', () => {
    it('parses the long example', () => {
      // when
      const { start, finish, boundary, storms } = parseInput(longExample);

      // then
      expect(start).toEqual({ x: 0, y: -1 });
      expect(finish).toEqual({ x: 5, y: 4 });
      expect(boundary).toEqual({ x: 6, y: 4 });
      expect(storms.left.size).toEqual(7);
      expect(storms.right.size).toEqual(6);
      expect(storms.up.size).toEqual(4);
      expect(storms.down.size).toEqual(2);
    });
  });

  describe('wrapPosition', () => {
    it('wraps correctly', () => {
      // when
      const example1 = wrapPosition(5, 10);
      const example2 = wrapPosition(-1, 10);
      const example3 = wrapPosition(10, 10);
      const example4 = wrapPosition(-5, 10);
      const example5 = wrapPosition(15, 10);

      // then
      expect(example1).toEqual(5);
      expect(example2).toEqual(9);
      expect(example3).toEqual(0);
      expect(example4).toEqual(5);
      expect(example5).toEqual(5);
    });
  });

  describe('progressStorms', () => {
    it('progresses the storm correctly', () => {
      // given
      const { storms, boundary } = parseInput(shortExample);

      // when
      const afterOneRound = progressStorms(storms, boundary);
      const afterTwoRounds = progressStorms(afterOneRound, boundary);

      // then
      expect(afterOneRound.down).toContain('3,4');
      expect(afterOneRound.right).toContain('1,1');
      expect(afterTwoRounds.down).toContain('3,0');
      expect(afterTwoRounds.right).toContain('2,1');
    });
  });

  describe('searchPath', () => {
    it('finds a good path', () => {
      // given
      const { start, finish, storms, boundary } = parseInput(longExample);

      // when
      const { moves } = searchPath(start, finish, storms, boundary);

      // then
      expect(moves).toEqual(18);
    });

    it('works for multiple trips as well', () => {
      // given
      const { start, finish, storms, boundary } = parseInput(longExample);

      // when
      const { moves: moves1, stormsObject: storms1End } = searchPath(start, finish, storms, boundary);
      const { moves: moves2, stormsObject: storms2End } = searchPath(finish, start, storms1End, boundary);
      const { moves: moves3 } = searchPath(start, finish, storms2End, boundary);

      // then
      expect(moves1).toEqual(18);
      expect(moves2).toEqual(23);
      expect(moves3).toEqual(13);
    });
  });
});
