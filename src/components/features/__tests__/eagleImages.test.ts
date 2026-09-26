import { getEagleImage } from '../eagleImages';

describe('getEagleImage', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])('has distinct color and locked sources for order %i', (order) => {
    const color = getEagleImage(order);
    const locked = getEagleImage(order, true);
    expect(color).toBeDefined();
    expect(locked).toBeDefined();
    expect(color).not.toEqual(locked);
  });

  it('has 10 distinct color sources', () => {
    const sources = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((order) => getEagleImage(order));
    expect(new Set(sources).size).toBe(10);
  });

  it('falls back to order 1 for unknown orders', () => {
    expect(getEagleImage(0)).toEqual(getEagleImage(1));
    expect(getEagleImage(11)).toEqual(getEagleImage(1));
    expect(getEagleImage(0, true)).toEqual(getEagleImage(1, true));
  });
});
