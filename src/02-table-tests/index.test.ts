import { simpleCalculator, Action } from './index';

describe('simpleCalculator', () => {
  test.each([
    { a: 1, b: 2, action: Action.Add,          expected: 3 },
    { a: 2, b: 2, action: Action.Divide,       expected: 1 },
    { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
    { a: 3, b: 2, action: Action.Multiply,     expected: 6 },
    { a: 3, b: 2, action: Action.Subtract,     expected: 1 },
  ] as const)('$a $action $b = $expected', ({ a, b, action, expected }) => {
    expect(simpleCalculator({ a, b, action })).toBe(expected);
  });

  test.each([
    { a: 1, b: 1, action: null as unknown as Action },
    { a: 1, b: 1, action: undefined as unknown as Action },
  ])('returns null for invalid action: %p', (raw) => {
    expect(simpleCalculator(raw)).toBeNull();
  });

  test.each([
    { a: '1', b: 'da', action: Action.Exponentiate },
    { a: '1', b: 2,    action: Action.Add },
  ])('returns null for invalid arguments: %p', (raw) => {
    expect(simpleCalculator(raw)).toBeNull();
  });
});
