import { calculatePassword, getFacingValue, Position, wrapRealInput } from './index';

describe('tests day 22', () => {
  describe('getFacingValue', () => {
    it('is correct for facing right', () => {
      // given
      const facing = [0, 1] as [number, number];

      // when
      const value = getFacingValue(facing);

      // then
      expect(value).toEqual(0);
    });

    it('is correct for facing left', () => {
      // given
      const facing = [0, -1] as [number, number];

      // when
      const value = getFacingValue(facing);

      // then
      expect(value).toEqual(2);
    });

    it('is correct for facing down', () => {
      // given
      const facing = [1, 0] as [number, number];

      // when
      const value = getFacingValue(facing);

      // then
      expect(value).toEqual(1);
    });

    it('is correct for facing up', () => {
      // given
      const facing = [-1, 0] as Position;

      // when
      const value = getFacingValue(facing);

      // then
      expect(value).toEqual(3);
    });
  });

  describe('calculatePassword', () => {
    it('is correct for the example', () => {
      // given
      const position = [5, 7] as Position;
      const facing = [0, 1] as Position;

      // when
      const password = calculatePassword(position, facing);

      // then
      expect(password).toEqual(6032);
    });

    it('is correct for some input', () => {
      // given
      const position = [72, 81] as Position;
      const facing = [-1, 0] as Position;

      // when
      const password = calculatePassword(position, facing);

      // then
      expect(password).toEqual(73331);
    });
  });

  describe('wrapRealInput', () => {
    describe('edge1', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [0, 50] as Position;
        const edgeRight = [0, 99] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, [-1, 0]);
        const newRight = wrapRealInput(edgeRight, [-1, 0]);

        // then
        expect(newLeft[0]).toEqual([150, 0]);
        expect(newLeft[1]).toEqual([0, 1]);
        expect(newRight[0]).toEqual([199, 0]);
        expect(newRight[1]).toEqual([0, 1]);
      });
    });

    describe('edge2', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [150, 0] as Position;
        const edgeRight = [199, 0] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, [0, -1]);
        const newRight = wrapRealInput(edgeRight, [0, -1]);

        // then
        expect(newLeft[0]).toEqual([0, 50]);
        expect(newLeft[1]).toEqual([1, 0]);
        expect(newRight[0]).toEqual([0, 99]);
        expect(newRight[1]).toEqual([1, 0]);
      });
    });

    describe('edge3', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [100, 0] as Position;
        const edgeRight = [149, 0] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, [0, -1]);
        const newRight = wrapRealInput(edgeRight, [0, -1]);

        // then
        expect(newLeft[0]).toEqual([49, 50]);
        expect(newLeft[1]).toEqual([0, 1]);
        expect(newRight[0]).toEqual([0, 50]);
        expect(newRight[1]).toEqual([0, 1]);
      });
    });

    describe('edge4', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [49, 50] as Position;
        const edgeRight = [0, 50] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, [0, -1]);
        const newRight = wrapRealInput(edgeRight, [0, -1]);

        // then
        expect(newLeft[0]).toEqual([100, 0]);
        expect(newLeft[1]).toEqual([0, 1]);
        expect(newRight[0]).toEqual([149, 0]);
        expect(newRight[1]).toEqual([0, 1]);
      });
    });
    describe('edge5', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [100, 0] as Position;
        const edgeRight = [100, 49] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, [-1, 0]);
        const newRight = wrapRealInput(edgeRight, [-1, 0]);

        // then
        expect(newLeft[0]).toEqual([50, 50]);
        expect(newLeft[1]).toEqual([0, 1]);
        expect(newRight[0]).toEqual([99, 50]);
        expect(newRight[1]).toEqual([0, 1]);
      });
    });

    describe('edge6', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [50, 50] as Position;
        const edgeRight = [99, 50] as Position;
        const outVector = [0, -1] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, outVector);
        const newRight = wrapRealInput(edgeRight, outVector);

        // then
        const inVector = [1, 0];
        expect(newLeft[0]).toEqual([100, 0]);
        expect(newLeft[1]).toEqual(inVector);
        expect(newRight[0]).toEqual([100, 49]);
        expect(newRight[1]).toEqual(inVector);
      });
    });

    describe('edge7', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [199, 0] as Position;
        const edgeRight = [199, 49] as Position;
        const outVector = [1, 0] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, outVector);
        const newRight = wrapRealInput(edgeRight, outVector);

        // then
        const inVector = [1, 0];
        expect(newLeft[0]).toEqual([0, 100]);
        expect(newLeft[1]).toEqual(inVector);
        expect(newRight[0]).toEqual([0, 149]);
        expect(newRight[1]).toEqual(inVector);
      });
    });

    describe('edge8', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [0, 100] as Position;
        const edgeRight = [0, 149] as Position;
        const outVector = [-1, 0] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, outVector);
        const newRight = wrapRealInput(edgeRight, outVector);

        // then
        const inVector = [-1, 0];
        expect(newLeft[0]).toEqual([199, 0]);
        expect(newLeft[1]).toEqual(inVector);
        expect(newRight[0]).toEqual([199, 49]);
        expect(newRight[1]).toEqual(inVector);
      });
    });

    describe('edge9', () => {
      it('works for edge points', () => {
        // given
        const edgeLeft = [150, 49] as Position;
        const edgeRight = [199, 49] as Position;
        const outVector = [0, 1] as Position;

        // when
        const newLeft = wrapRealInput(edgeLeft, outVector);
        const newRight = wrapRealInput(edgeRight, outVector);

        // then
        const inVector = [-1, 0];
        expect(newLeft[0]).toEqual([149, 50]);
        expect(newLeft[1]).toEqual(inVector);
        expect(newRight[0]).toEqual([149, 99]);
        expect(newRight[1]).toEqual(inVector);
      });
    });
  });
});
