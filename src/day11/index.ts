import _ from 'lodash';

const primes = [2, 3, 5, 7, 11, 13, 17, 19];

export class Item {
  public worryLevelMod: number[];

  constructor(startWorryLevel: number) {
    this.worryLevelMod = primes.map((prime) => startWorryLevel % prime);
  }

  addWorry(amount: number) {
    this.worryLevelMod = this.worryLevelMod.map((remainder, primeIndex) => (remainder + amount) % primes[primeIndex]);
  }

  multiplyWorry(amount: number) {
    this.worryLevelMod = this.worryLevelMod.map((remainder, primeIndex) => (remainder * amount) % primes[primeIndex]);
  }

  squareWorry() {
    this.worryLevelMod = this.worryLevelMod.map((remainder, primeIndex) => remainder ** 2 % primes[primeIndex]);
  }
}

export interface Monkey {
  items: number[];
  itemsInspected: number;
  divider: number;

  getWorryLevel: (item: number) => number;
  throwTo: (worryLevel: number) => number;
}

export interface Monkey2 {
  items: Item[];
  itemsInspected: number;

  setWorryLevel: (item: Item) => void;
  throwTo: (item: Item) => number;
}

const monkeys: Monkey[] = [
  {
    items: [73, 77],
    itemsInspected: 0,
    divider: 11,
    getWorryLevel: (item) => item * 5,
    throwTo: (worryLevel) => (worryLevel % 11 === 0 ? 6 : 5)
  },
  {
    items: [57, 88, 80],
    itemsInspected: 0,
    divider: 19,
    getWorryLevel: (item) => item + 5,
    throwTo: (worryLevel) => (worryLevel % 19 === 0 ? 6 : 0)
  },
  {
    items: [61, 81, 84, 69, 77, 88],
    itemsInspected: 0,
    divider: 5,
    getWorryLevel: (item) => item * 19,
    throwTo: (worryLevel) => (worryLevel % 5 === 0 ? 3 : 1)
  },
  {
    items: [78, 89, 71, 60, 81, 84, 87, 75],
    itemsInspected: 0,
    divider: 3,
    getWorryLevel: (item) => item + 7,
    throwTo: (worryLevel) => (worryLevel % 3 === 0 ? 1 : 0)
  },
  {
    items: [60, 76, 90, 63, 86, 87, 89],
    itemsInspected: 0,
    divider: 13,
    getWorryLevel: (item) => item + 2,
    throwTo: (worryLevel) => (worryLevel % 13 === 0 ? 2 : 7)
  },
  {
    items: [88],
    itemsInspected: 0,
    divider: 17,
    getWorryLevel: (item) => item + 1,
    throwTo: (worryLevel) => (worryLevel % 17 === 0 ? 4 : 7)
  },
  {
    items: [84, 98, 78, 85],
    itemsInspected: 0,
    divider: 7,
    getWorryLevel: (item) => item * item,
    throwTo: (worryLevel) => (worryLevel % 7 === 0 ? 5 : 4)
  },
  {
    items: [98, 89, 78, 73, 71],
    itemsInspected: 0,
    divider: 2,
    getWorryLevel: (item) => item + 4,
    throwTo: (worryLevel) => (worryLevel % 2 === 0 ? 3 : 2)
  }
];

const monkeys2: Monkey2[] = [
  {
    items: [new Item(73), new Item(77)],
    itemsInspected: 0,
    setWorryLevel: (item) => item.multiplyWorry(5),
    throwTo: (item) => (item.worryLevelMod[4] === 0 ? 6 : 5)
  },
  {
    items: [new Item(57), new Item(88), new Item(80)],
    itemsInspected: 0,
    setWorryLevel: (item) => item.addWorry(5),
    throwTo: (item) => (item.worryLevelMod[7] === 0 ? 6 : 0)
  },
  {
    items: [new Item(61), new Item(81), new Item(84), new Item(69), new Item(77), new Item(88)],
    itemsInspected: 0,
    setWorryLevel: (item) => item.multiplyWorry(19),
    throwTo: (item) => (item.worryLevelMod[2] === 0 ? 3 : 1)
  },
  {
    items: [
      new Item(78),
      new Item(89),
      new Item(71),
      new Item(60),
      new Item(81),
      new Item(84),
      new Item(87),
      new Item(75)
    ],
    itemsInspected: 0,
    setWorryLevel: (item) => item.addWorry(7),
    throwTo: (item) => (item.worryLevelMod[1] === 0 ? 1 : 0)
  },
  {
    items: [new Item(60), new Item(76), new Item(90), new Item(63), new Item(86), new Item(87), new Item(89)],
    itemsInspected: 0,
    setWorryLevel: (item) => item.addWorry(2),
    throwTo: (item) => (item.worryLevelMod[5] === 0 ? 2 : 7)
  },
  {
    items: [new Item(88)],
    itemsInspected: 0,
    setWorryLevel: (item) => item.addWorry(1),
    throwTo: (item) => (item.worryLevelMod[6] === 0 ? 4 : 7)
  },
  {
    items: [new Item(84), new Item(98), new Item(78), new Item(85)],
    itemsInspected: 0,
    setWorryLevel: (item) => item.squareWorry(),
    throwTo: (item) => (item.worryLevelMod[3] === 0 ? 5 : 4)
  },
  {
    items: [new Item(98), new Item(89), new Item(78), new Item(73), new Item(71)],
    itemsInspected: 0,
    setWorryLevel: (item) => item.addWorry(4),
    throwTo: (item) => (item.worryLevelMod[0] === 0 ? 3 : 2)
  }
];

export const decideThrowTo = (monkey: Monkey, item: number, worryLevelDivider: number) => {
  const worryLevel = monkey.getWorryLevel(item);
  const newWorryLevel = Math.floor(worryLevel / worryLevelDivider);
  return [monkey.throwTo(newWorryLevel), newWorryLevel];
};

export const doInspectAndThrowRound = (monkeys: Monkey[], worryLevelDivider: number) => {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      const [throwTo, newWorryLevel] = decideThrowTo(monkey, item, worryLevelDivider);
      monkeys[throwTo].items.push(newWorryLevel);
      monkey.itemsInspected++;
    }
    monkey.items = [];
  }
};

export const doInspectAndThrowMoreRounds = (monkeys: Monkey2[]) => {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      monkey.setWorryLevel(item);
      monkeys[monkey.throwTo(item)].items.push(item);
      monkey.itemsInspected++;
    }
    monkey.items = [];
  }
};

export const getItemsInspected = (monkeys: (Monkey | Monkey2)[]) =>
  monkeys.map((monkey) => monkey.itemsInspected).sort((a, b) => b - a);

export const doAllRounds = (monkeyList: Monkey[], numberOfRounds: number, worryLevelDivider: number) => {
  for (let round = 0; round < numberOfRounds; round++) {
    doInspectAndThrowRound(monkeyList, worryLevelDivider);
  }
};

export const doMoreRounds = (monkeys: Monkey2[]) => {
  for (let round = 0; round < 10_000; round++) {
    doInspectAndThrowMoreRounds(monkeys);
  }
};

export default function solveDay11() {
  const monkeyList = _.cloneDeep(monkeys);
  doAllRounds(monkeyList, 20, 3);
  const itemsInspected = getItemsInspected(monkeyList);
  const [mostActive, secondMostActive] = itemsInspected;
  console.log(mostActive * secondMostActive);

  const monkeyListMoreRounds = _.cloneDeep(monkeys2);
  doMoreRounds(monkeyListMoreRounds);
  const itemsInspectedMoreRounds = getItemsInspected(monkeyListMoreRounds);
  const [mostActiveMoreRounds, secondMostActiveMoreRounds] = itemsInspectedMoreRounds;
  console.log(mostActiveMoreRounds * secondMostActiveMoreRounds);
}

solveDay11();
