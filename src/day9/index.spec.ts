import { Head, Move, parseMoves } from './index';

describe('test day 9', () => {
  const exampleInput = `\
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;
  const parsedMoves: Move[] = [
    { amount: 4, direction: 'R' },
    { amount: 4, direction: 'U' },
    { amount: 3, direction: 'L' },
    { amount: 1, direction: 'D' },
    { amount: 4, direction: 'R' },
    { amount: 1, direction: 'D' },
    { amount: 5, direction: 'L' },
    { amount: 2, direction: 'R' }
  ];

  describe('parseMoves', () => {
    it('parses moves correctly', () => {
      // when
      const moves = parseMoves(exampleInput);

      // then
      expect(moves).toEqual(parsedMoves);
    });
  });

  describe('Head', () => {
    it('moves with its tail according to the move set', () => {
      // given
      const head = new Head();

      // when
      for (const move of parsedMoves) {
        head.updatePosition(move);
      }

      // then
      expect(head.position).toEqual({ x: 2, y: 2 });
      expect(head.tail.position).toEqual({ x: 1, y: 2 });
      expect(head.tail.positionHistory.size).toEqual(13);
    });
  });
});
