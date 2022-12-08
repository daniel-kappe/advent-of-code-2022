import _ from 'lodash';
import { readInput } from '../utils';

export type TreePosition = number | null;
export type PositionTreeHeights = [
  TreePosition,
  TreePosition,
  TreePosition,
  TreePosition,
  TreePosition,
  TreePosition,
  TreePosition,
  TreePosition,
  TreePosition,
  TreePosition
];

export const getInitialPositionHeights = () => new Array<TreePosition>(10).fill(null) as PositionTreeHeights;

export const getScenicScoreByRow = (treeMatrix: number[][]) =>
  treeMatrix.map((treeRow) => {
    const treeHeightPositions = getInitialPositionHeights();
    return treeRow.map((tree, treeIndex) => {
      const scenicScore = _.min(
        treeHeightPositions.slice(tree, 10).map((index) => (index !== null ? treeIndex - index : treeIndex))
      );
      treeHeightPositions[tree] = treeIndex;
      return scenicScore;
    });
  }) as number[][];

export const getScenicScoreByColumn = (treeMatrix: number[][]) =>
  transposeMatrix(getScenicScoreByRow(transposeMatrix(treeMatrix)).reverse());

export const getScenicScoreByReversedRow = (treeMatrix: number[][]) =>
  getScenicScoreByRow(treeMatrix.map(_.reverse)).map(_.reverse);

export const getScenicScoreByReversedColumn = (treeMatrix: number[][]) =>
  getScenicScoreByColumn(transposeMatrix(transposeMatrix(treeMatrix).map(_.reverse))).reverse();

export const calculateScenicScore = (treeMatrix: number[][]) => {
  const scenicScoreRow = getScenicScoreByRow(treeMatrix);
  const scenicScoreRowReversed = getScenicScoreByReversedRow(treeMatrix);
  const scenicScoreColumn = getScenicScoreByColumn(treeMatrix);
  const scenicScoreColumnReversed = getScenicScoreByReversedColumn(treeMatrix);
  const scenicScore = _.cloneDeep(treeMatrix);
  for (let rowIndex = 0; rowIndex < scenicScore.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < scenicScore[0].length; columnIndex++) {
      scenicScore[rowIndex][columnIndex] =
        scenicScoreRow[rowIndex][columnIndex] *
        scenicScoreColumn[rowIndex][columnIndex] *
        scenicScoreRowReversed[rowIndex][columnIndex] *
        scenicScoreColumnReversed[rowIndex][columnIndex];
    }
  }
  return scenicScore;
};

export const buildTreeMatrix = (puzzleInput: string) =>
  puzzleInput
    .trim()
    .split(/\n/)
    .map((treeRow) => _.toArray(treeRow).map((tree) => parseInt(tree, 10)));

export const isTreeVisibleMatrix = (treeMatrix: number[][]) => {
  const rowVisibility = treeMatrix.map(getRowVisibility);
  const reverseRowVisibility = treeMatrix.map(getRowReversedVisibility);
  const columnVisibility = transposeMatrix(transposeMatrix(treeMatrix).map(getRowVisibility).reverse());
  const reversecolumnVisibility = transposeMatrix(transposeMatrix(treeMatrix).map(getRowReversedVisibility).reverse());
  return _.zip(rowVisibility, reverseRowVisibility, columnVisibility, reversecolumnVisibility).map(
    ([row, rowReversed, column, columnReversed]) =>
      unionVisibilties(row as boolean[], rowReversed as boolean[], column as boolean[], columnReversed as boolean[])
  ) as boolean[][];
};

const transposeMatrix = <T extends number | boolean>(matrix: T[][]) =>
  matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));

const getRowVisibility = (treeRow: number[]) => {
  let highestTree = -1;
  return treeRow.map((tree) => {
    if (highestTree < tree) {
      highestTree = tree;
      return true;
    }
    return false;
  });
};

const getRowReversedVisibility = (treeRow: number[]) => {
  let highestTree = -1;
  return treeRow
    .reverse()
    .map((tree) => {
      if (highestTree < tree) {
        highestTree = tree;
        return true;
      }
      return false;
    })
    .reverse();
};

const unionVisibilties = (
  matrix1Row: boolean[],
  matrix2Row: boolean[],
  matrix3Row: boolean[],
  matrix4Row: boolean[]
) => {
  return _.zip(matrix1Row, matrix2Row, matrix3Row, matrix4Row).map(
    ([element1, element2, element3, element4]) => element1 || element2 || element3 || element4
  );
};

export const getNumberOfVisibleTrees = (visibilityMatrix: boolean[][]) => _.sum(_.flatten(visibilityMatrix));

export const getMaxScenicScore = (treeMatrix: number[][]) => _.max(_.flatten(calculateScenicScore(treeMatrix)));

export default function solveDay8() {
  const puzzleInput = readInput('inputs/day8.dat');
  const treeMatrix = buildTreeMatrix(puzzleInput);
  const visibilityMatrix = isTreeVisibleMatrix(treeMatrix);
  console.log(`A total of: ${getNumberOfVisibleTrees(visibilityMatrix)} trees are visible`);
  console.log(`The highest Scenic Score is: ${getMaxScenicScore(treeMatrix)}`);
}
