import { scoreIdenticalItem, scoreItem, splitRucksackCompartments } from './index';

describe('day 3', () => {
  const exampleInput = `\
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;
  const firstRucksack = ['vJrwpWtwJgWr', 'hcsFMMfFFhFp'];

  it('extracts the rucksacks and compartments', () => {
    // when
    const splitCompartments = splitRucksackCompartments(exampleInput)[0];

    // then
    expect(splitCompartments).toEqual(firstRucksack);
  });

  it('scores items correctly', () => {
    // given
    const item1 = 'a';
    const item2 = 'A';

    // when
    const score1 = scoreItem(item1);
    const score2 = scoreItem(item2);

    // then
    expect(score1).toEqual(1);
    expect(score2).toEqual(27);
  });

  it('scores identicalItems correctly', () => {
    // when
    const score = scoreIdenticalItem(firstRucksack);

    // then
    expect(score).toEqual(16);
  });
});
