import { parseContainers, splitContainersAndMoves } from './index';

describe('tests for day 5', () => {
  const exampleInput = `\
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;
  describe('splitContainersAndMoves', () => {
    it('splits off moves from container orders', () => {
      // when
      const [containerString, moves] = splitContainersAndMoves(exampleInput)[0];

      // then
      expect(containerString).toEqual(`\
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 `);
      expect(moves).toEqual(`\
move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`);
    });
  });

  describe('parseContainers', () => {
    it('parses Container Stacks correctly', () => {
      // when
      const containerString = splitContainersAndMoves(exampleInput)[0];
      const containers = parseContainers(containerString);

      // then
      expect(containers).toEqual([['Z', 'N'], ['M', 'C', 'D'], ['P']]);
    });
  });
});
