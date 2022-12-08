import { findEndMessageStart, findEndPackageStart } from './index';

describe('', () => {
  const example1 = 'bvwbjplbgvbhsrlpgdmjqwftvncz';

  it('', () => {
    // when
    const bufferEnd1 = findEndPackageStart(example1);

    // then
    expect(bufferEnd1).toEqual(5);
  });

  it('', () => {
    // when
    const messageEnd1 = findEndMessageStart(example1);

    // then
    expect(messageEnd1).toEqual(19);
  });
});
