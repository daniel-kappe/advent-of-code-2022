import { aStar, parseHeightmap, reconstructPath } from './index';

describe('tests day12', () => {
  const exampleInput = `\
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;
  describe('aStar', () => {
    it('gets the correct path from start to finish', () => {
      // given
      const { heightmap, startPosition, endPosition } = parseHeightmap(exampleInput);

      // when
      const { cameFrom, currentNode } = aStar(heightmap, startPosition, endPosition);

      // then
      expect(reconstructPath(cameFrom, currentNode).length - 1).toEqual(31);
    });
  });
});
