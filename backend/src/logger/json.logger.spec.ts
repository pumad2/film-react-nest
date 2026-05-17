import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  const mockResult = {
    level: 'log',
    message: 'test',
    optionalParams: ['param1'],
  };

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message to JSON', () => {
    const result = logger.formatMessage('log', 'test', 'param1');

    expect(JSON.parse(result)).toEqual(mockResult);
  });

  it('should send log message to console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('test', 'param1');

    expect(spy).toHaveBeenCalledWith(JSON.stringify(mockResult));
  });
});
