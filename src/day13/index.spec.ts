import {
  compairPair,
  flattenPairs,
  getDecoderKey,
  Pack,
  Pair,
  parsePairs,
  sortPackages,
  sumIndexCorrectPairs
} from './index';

describe('tests day 13', () => {
  const exampleInput = `\
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

  const bonusExample = `[[2],[[[3,4],2,[9],[5,8,8,0,2]]],[5],[1]]
[[[[2],7],[]]]`;

  const exampleList = exampleInput.trim().split(/\n\n/);

  const expectedSortedPackages = `[]
[[]]
[[[]]]
[1,1,3,1,1]
[1,1,5,1,1]
[[1],[2,3,4]]
[1,[2,[3,[4,[5,6,0]]]],8,9]
[1,[2,[3,[4,[5,6,7]]]],8,9]
[[1],4]
[[2]]
[3]
[[4,4],4,4]
[[4,4],4,4,4]
[[6]]
[7,7,7]
[7,7,7,7]
[[8,7,6]]
[9]`;

  const pairs = parsePairs(exampleList);
  const flattenedPairs = flattenPairs(pairs);

  describe('compairPair', () => {
    it('correctly compairs the bonus example', () => {
      // given
      const pair = parsePairs([bonusExample])[0];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(1);
    });
    it('correctly compairs example 1', () => {
      // given
      const pair = pairs[0];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(1);
    });

    it('correctly compairs example 2', () => {
      // given
      const pair = pairs[1];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(1);
    });

    it('correctly compairs example 3', () => {
      // given
      const pair = pairs[2];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(-1);
    });

    it('correctly compairs example 4', () => {
      // given
      const pair = pairs[3];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(1);
    });

    it('correctly compairs example 5', () => {
      // given
      const pair = pairs[4];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(-1);
    });

    it('correctly compairs example 6', () => {
      // given
      const pair = pairs[5];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(1);
    });

    it('correctly compairs example 7', () => {
      // given
      const pair = pairs[6];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(-1);
    });

    it('correctly compairs example 8', () => {
      // given
      const pair = pairs[7];

      // when
      const compared = compairPair(pair);

      // then
      expect(compared).toEqual(-1);
    });

    it('correctly compairs lines 1 and 3', () => {
      // given
      const [pairIndex1, pairIndex2] = [0, 2];
      const newPair = [flattenedPairs[pairIndex1], flattenedPairs[pairIndex2]] as Pair;
      const newPairReversed = [flattenedPairs[pairIndex2], flattenedPairs[pairIndex1]] as Pair;

      // when
      const compared = compairPair(newPair);
      const comparedReversed = compairPair(newPairReversed);

      // then
      expect(compared).toEqual(1);
      expect(comparedReversed).toEqual(-1);
    });

    it('correctly compairs lines 1 and 4', () => {
      // given
      const [pairIndex1, pairIndex2] = [0, 3];
      const newPair = [flattenedPairs[pairIndex1], flattenedPairs[pairIndex2]] as Pair;
      const newPairReversed = [flattenedPairs[pairIndex2], flattenedPairs[pairIndex1]] as Pair;

      // when
      const compared = compairPair(newPair);
      const comparedReversed = compairPair(newPairReversed);

      // then
      expect(compared).toEqual(1);
      expect(comparedReversed).toEqual(-1);
    });
  });
  describe('sumIndexCorrectPairs', () => {
    it('calculates the correct sum for the list of all examples', () => {
      // when
      const correctIndexSum = sumIndexCorrectPairs(pairs);

      // then
      expect(correctIndexSum).toEqual(13);
    });
  });

  describe('flattenPackages', () => {
    it('flattens correctly', () => {
      // when
      const allPackages = flattenPairs(pairs);

      // then
      expect(allPackages).toHaveLength(18);
    });
  });

  describe('sortPackages', () => {
    it('correctly sorts packages', () => {
      // given
      const pairs = parsePairs(exampleList);
      const allPackages = flattenPairs(pairs);

      // when
      const sortedPacks = sortPackages(allPackages);

      // then
      expect(stringifySortedPackages(sortedPacks)).toEqual(expectedSortedPackages);
    });
  });

  describe('getDecoderKey', () => {
    it('finds the correct decoder key', () => {
      // given
      const sortedPacks = sortPackages(flattenedPairs);

      // when
      const decoderKey = getDecoderKey(sortedPacks);

      // then
      expect(decoderKey).toEqual(140);
    });
  });
});

function stringifySortedPackages(sortedPacks: Pack[]) {
  return sortedPacks.map((pack) => JSON.stringify(pack)).join('\n');
}
