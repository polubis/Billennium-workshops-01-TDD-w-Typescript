import { sum } from '..';

describe('sum()', () => {
  it('adds 2 numbers', () => {
    expect(sum(2, 4)).toBe(6);
  });
});
