import { buildTreeMatrix, isTreeVisibleMatrix, getNumberOfVisibleTrees, getMaxScenicScore } from './index';

describe('Test day 8', () => {
  const exampleInput = `\
30373
25512
65332
33549
35390
`;

  describe('getNumberOfVisibleTrees', () => {
    it('calculates the correct visibility of the trees', () => {
      // when
      const treeMatrix = buildTreeMatrix(exampleInput);
      const visibilityMatrix = isTreeVisibleMatrix(treeMatrix);
      const visibleTrees = getNumberOfVisibleTrees(visibilityMatrix);

      // then
      expect(visibleTrees).toEqual(21);
    });
  });

  describe('getMaxScenicScore', () => {
    it('calculates the maximum scenic score for the trees', () => {
      // when
      const treeMatrix = buildTreeMatrix(exampleInput);
      const maxScenicScore = getMaxScenicScore(treeMatrix);

      // then
      expect(maxScenicScore).toEqual(8);
    });
  });
});
