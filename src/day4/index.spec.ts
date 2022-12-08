import { parseAssignmentGroups, sumFullyOverlappingAssignments, sumPartiallyOverlappingAssignments } from './index';

describe('day 4 puzzle', () => {
  const exampleInput = `\
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

  it('correctly calculates the fully overlapping pairs', () => {
    // when
    const assignmentPairs = parseAssignmentGroups(exampleInput);
    const overlappingAssignments = sumFullyOverlappingAssignments(assignmentPairs);

    // then
    expect(overlappingAssignments).toEqual(2);
  });

  it('correctly calculates the partly overlapping pairs', () => {
    // when
    const assignmentPairs = parseAssignmentGroups(exampleInput);
    const overlappingAssignments = sumPartiallyOverlappingAssignments(assignmentPairs);

    // then
    expect(overlappingAssignments).toEqual(4);
  });
});
