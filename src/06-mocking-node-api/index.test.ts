import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);
    expect(spy).toHaveBeenCalledWith(callback, 1000);

    spy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);

    jest.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, 500);
    expect(spy).toHaveBeenCalledWith(callback, 500);

    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 500);
    jest.advanceTimersByTime(1500);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockJoin = join as jest.Mock;
  const mockExistsSync = existsSync as jest.Mock;
  const mockReadFile = readFile as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should call join with pathToFile', async () => {
    mockJoin.mockReturnValue('/full/path/file.txt');
    mockExistsSync.mockReturnValue(false);

    await readFileAsynchronously('file.txt');
    expect(mockJoin).toHaveBeenCalledWith(__dirname, 'file.txt');
  });

  test('should return null if file does not exist', async () => {
    mockJoin.mockReturnValue('/full/path/file.txt');
    mockExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously('file.txt');
    expect(result).toBeNull();
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    mockJoin.mockReturnValue('/full/path/file.txt');
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(Buffer.from('Hello World'));

    const result = await readFileAsynchronously('file.txt');
    expect(result).toBe('Hello World');
    expect(mockReadFile).toHaveBeenCalledWith('/full/path/file.txt');
  });
});
