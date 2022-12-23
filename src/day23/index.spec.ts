import { doSteps, ElvesMap, emtpyTiles, parseElfPositions, printElfDistribution, stepToEquilibrium } from './index';

describe('tests day 23', () => {
  const puzzleInput = `\
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
`;
  let elvesMap: ElvesMap;

  beforeEach(() => {
    elvesMap = parseElfPositions(puzzleInput);
  });

  it('runs for the example input', () => {
    // given
    const elf1 = elvesMap.get('0,1');
    const elf2 = elvesMap.get('3,1');
    const elf3 = elvesMap.get('6,1');

    // when
    const elf1NewPosition = elf1?.considerStep(elvesMap, 0);
    const elf2NewPosition = elf2?.considerStep(elvesMap, 0);
    const elf3NewPosition = elf3?.considerStep(elvesMap, 0);

    // then
    expect(elf1NewPosition).toEqual([-1, 1]);
    expect(elf2NewPosition).toEqual([3, 1]);
    expect(elf3NewPosition).toEqual([6, 2]);
  });

  it('collects next steps', () => {
    const newElvesMap = doSteps(elvesMap, 10);
    printElfDistribution(newElvesMap);
    console.log(emtpyTiles(newElvesMap));
  });

  it('steps to equi', () => {
    const { equilibrium, turns } = stepToEquilibrium(elvesMap);
    printElfDistribution(equilibrium);
    console.log(turns);
  });
});
