import { doAllRounds, Monkey } from './index';
import _ from 'lodash';
import exp from 'constants';

describe('tests day 11', () => {
  const monkeys: Monkey[] = [
    {
      items: [79, 98],
      itemsInspected: 0,
      getWorryLevel: (item) => item * 19,
      throwTo: (worryLevel) => (worryLevel % 23 === 0 ? 2 : 3)
    },
    {
      items: [54, 65, 75, 74],
      itemsInspected: 0,
      getWorryLevel: (item) => item + 6,
      throwTo: (worryLevel) => (worryLevel % 19 === 0 ? 2 : 0)
    },
    {
      items: [79, 60, 97],
      itemsInspected: 0,
      getWorryLevel: (item) => item * item,
      throwTo: (worryLevel) => (worryLevel % 13 === 0 ? 1 : 3)
    },
    {
      items: [74],
      itemsInspected: 0,
      getWorryLevel: (item) => item + 3,
      throwTo: (worryLevel) => (worryLevel % 17 === 0 ? 0 : 1)
    }
  ];

  describe('doAllRounds', () => {
    let monkeyList: Monkey[];

    beforeEach(() => {
      monkeyList = _.cloneDeep(monkeys);
    });

    it('calculates first round correctly for worryLevelDivider 3', () => {
      // when
      doAllRounds(monkeyList, 1, 3);

      // then
      expect(monkeyList[0].items).toEqual([20, 23, 27, 26]);
      expect(monkeyList[1].items).toEqual([2080, 25, 167, 207, 401, 1046]);
      expect(monkeyList[2].items).toHaveLength(0);
      expect(monkeyList[3].items).toHaveLength(0);
    });

    it('calculates itemsInspeced correctly for 1 rounds with worryLevelDivider 1', () => {
      // when
      doAllRounds(monkeyList, 1, 1);

      // then
      expect(monkeyList[0].itemsInspected).toEqual(2);
      expect(monkeyList[1].itemsInspected).toEqual(4);
      expect(monkeyList[2].itemsInspected).toEqual(3);
      expect(monkeyList[3].itemsInspected).toEqual(6);
    });

    it('calculates itemsInspeced correctly for 20 rounds with worryLevelDivider 1', () => {
      // when
      doAllRounds(monkeyList, 20, 1);

      // then
      expect(monkeyList[0].itemsInspected).toEqual(99);
      expect(monkeyList[1].itemsInspected).toEqual(97);
      expect(monkeyList[2].itemsInspected).toEqual(8);
      expect(monkeyList[3].itemsInspected).toEqual(103);
    });

    it('calculates itemsInspeced correctly for 1000 rounds with worryLevelDivider 1', () => {
      // when
      doAllRounds(monkeyList, 1000, 1);

      // then
      expect(monkeyList[0].itemsInspected).toEqual(5204);
      expect(monkeyList[1].itemsInspected).toEqual(4792);
      expect(monkeyList[2].itemsInspected).toEqual(199);
      expect(monkeyList[3].itemsInspected).toEqual(5192);
    });
  });
});
