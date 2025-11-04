// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 1, action: '+' })).toEqual(2);
    expect(simpleCalculator({ a: 1, b: 1, action: Action.Add })).toEqual(2);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 1, action: '-' })).toEqual(0);
    expect(simpleCalculator({ a: 1, b: 1, action: Action.Subtract })).toEqual(
      0,
    );
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 1, action: '*' })).toEqual(1);
    expect(simpleCalculator({ a: 1, b: 1, action: Action.Multiply })).toEqual(
      1,
    );
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 1, action: '/' })).toEqual(1);
    expect(simpleCalculator({ a: 1, b: 1, action: Action.Divide })).toEqual(1);
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 1, action: '^' })).toEqual(1);
    expect(
      simpleCalculator({ a: 1, b: 1, action: Action.Exponentiate }),
    ).toEqual(1);
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 1, b: 1, action: null })).toEqual(null);
  });

  test('should return null for invalid arguments', () => {
    expect(
      simpleCalculator({ a: '1', b: 'da', action: Action.Exponentiate }),
    ).toEqual(null);
  });
});
