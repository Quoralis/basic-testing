import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

afterEach(() => {
  (random as jest.Mock).mockReset();
});

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const acc1 = getBankAccount(100);
    const acc2 = getBankAccount(50);
    expect(() => acc1.transfer(200, acc2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const acc = getBankAccount(100);
    expect(() => acc.transfer(50, acc)).toThrow(TransferFailedError);
    expect(() => acc.transfer(50, acc)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const acc = getBankAccount(100);
    acc.deposit(50);
    expect(acc.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const acc = getBankAccount(100);
    acc.withdraw(40);
    expect(acc.getBalance()).toBe(60);
  });

  test('should transfer money', () => {
    const acc1 = getBankAccount(200);
    const acc2 = getBankAccount(50);
    acc1.transfer(100, acc2);
    expect(acc1.getBalance()).toBe(100);
    expect(acc2.getBalance()).toBe(150);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock)
      .mockImplementationOnce(() => 70)
      .mockImplementationOnce(() => 1);
    const acc = getBankAccount(0);
    const result = await acc.fetchBalance();
    expect(result).toBe(70);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock)
      .mockImplementationOnce(() => 80)
      .mockImplementationOnce(() => 1);
    const acc = getBankAccount(10);
    await acc.synchronizeBalance();
    expect(acc.getBalance()).toBe(80);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockImplementation((max) => {
      if (max === 100) return 50;
      if (max === 1) return 0;
      return 0;
    });
    const acc = getBankAccount(10);
    await expect(acc.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    await expect(acc.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
