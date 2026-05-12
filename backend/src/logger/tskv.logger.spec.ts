import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  const mockResult = 'level=log\tmessage=test\tparam1=param1\n';

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message to tskv', () => {
    const result = logger.formatMessage('log', 'test', 'param1');

    expect(result).toEqual(mockResult);
  });

  it('should send log message to console', () => {
    const spy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);

    logger.log('test', 'param1');

    expect(spy).toHaveBeenCalledWith(mockResult);
  });
});
