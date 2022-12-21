import _ from 'lodash';
import { readInput } from '../utils';

export const parseNumberList = (puzzleInput: string) =>
  puzzleInput
    .trim()
    .split(/\n/)
    .map((num) => parseInt(num, 10));

type LinkedList = { [from: string]: [string, string] };

export function getLinkedList(numberList: number[]) {
  const linkedList = {} as LinkedList;
  numberList.forEach((num, startPos) => {
    if (startPos < numberList.length - 1 && startPos > 0) {
      linkedList[JSON.stringify([num, startPos])] = [
        JSON.stringify([numberList[startPos - 1], startPos - 1]),
        JSON.stringify([numberList[startPos + 1], startPos + 1])
      ];
    } else if (startPos === 0) {
      linkedList[JSON.stringify([num, startPos])] = [
        JSON.stringify([numberList[numberList.length - 1], numberList.length - 1]),
        JSON.stringify([numberList[startPos + 1], startPos + 1])
      ];
    } else {
      linkedList[JSON.stringify([num, startPos])] = [
        JSON.stringify([numberList[startPos - 1], startPos - 1]),
        JSON.stringify([numberList[0], 0])
      ];
    }
  });
  return linkedList;
}

export function mixLinkedList(linkedList: LinkedList, numberList: number[], mixRounds = 1) {
  let updatedLinkedList = _.cloneDeep(linkedList);
  const listLength = numberList.length - 1;
  _.range(0, mixRounds).forEach(() => {
    numberList.forEach((num, index) => {
      if (num !== 0) {
        const elementToMix = JSON.stringify([num, index]);
        let [prevElement, nextElement] = updatedLinkedList[elementToMix];
        const linkedListWithoutElement = unlink(updatedLinkedList, elementToMix);
        _.range(0, num % listLength).forEach(() => {
          const [newPrevElement, newNextElement] = linkedListWithoutElement[num > 0 ? nextElement : prevElement];
          const oldPrevElement = prevElement;
          prevElement = num > 0 ? nextElement : newPrevElement;
          nextElement = num > 0 ? newNextElement : oldPrevElement;
        });
        updatedLinkedList = insert(linkedListWithoutElement, elementToMix, prevElement, nextElement);
      }
    });
  });
  return updatedLinkedList;
}

export function findCoordinates(linkedList: LinkedList, numberList: number[]) {
  let nextPoint = JSON.stringify([0, _.indexOf(numberList, 0)]);
  const coordinates: number[] = [];
  _.range(0, 1000).forEach(() => {
    nextPoint = linkedList[nextPoint][1];
  });
  coordinates.push(JSON.parse(nextPoint)[0]);
  _.range(0, 1000).forEach(() => {
    nextPoint = linkedList[nextPoint][1];
  });
  coordinates.push(JSON.parse(nextPoint)[0]);
  _.range(0, 1000).forEach(() => {
    nextPoint = linkedList[nextPoint][1];
  });
  coordinates.push(JSON.parse(nextPoint)[0]);
  return _.sum(coordinates);
}

export function insert(linkedList: LinkedList, element: string, prev: string, next: string) {
  const newLinkedList = _.cloneDeep(linkedList);
  newLinkedList[prev][1] = element;
  newLinkedList[next][0] = element;
  newLinkedList[element] = [prev, next];
  return newLinkedList;
}

export function unlink(linkedList: LinkedList, element: string) {
  const newLinkedList = _.cloneDeep(linkedList);
  const [prevElement, nextElement] = newLinkedList[element];
  delete newLinkedList[element];
  newLinkedList[prevElement][1] = nextElement;
  newLinkedList[nextElement][0] = prevElement;
  return newLinkedList;
}

export default function solveDay20() {
  const numberList = parseNumberList(readInput('inputs/day20.dat'));
  const linkedList = getLinkedList(numberList);
  const mixedList = mixLinkedList(linkedList, numberList);
  console.log(`The sum of coordinates is: ${findCoordinates(mixedList, numberList)}`);

  const numberListDecryption = numberList.map((num) => num * 811589153);
  const linkedListDecrypt = getLinkedList(numberListDecryption);
  const mixedListDecrypt = mixLinkedList(linkedListDecrypt, numberListDecryption, 10);
  console.log(
    `The sum of coordinates with the correct decryptionkey is: ${findCoordinates(
      mixedListDecrypt,
      numberListDecryption
    )}`
  );
}
