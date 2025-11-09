import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: any) => fn,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: {} });
    mockedAxios.create.mockReturnValue({ get: getMock } as any);

    await throttledGetDataFromApi('/posts');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: {} });
    mockedAxios.create.mockReturnValue({ get: getMock } as any);

    await throttledGetDataFromApi('/todos/1');

    expect(getMock).toHaveBeenCalledWith('/todos/1');
  });

  test('should return response data', async () => {
    const responseData = { id: 1, title: 'test' };
    const getMock = jest.fn().mockResolvedValue({ data: responseData });
    mockedAxios.create.mockReturnValue({ get: getMock } as any);

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(responseData);
  });
});
