import { LogParser } from "./LogParser";

describe('LogParser', () => {
  it('should extract a creator from a line', () => {
    const logParser = new LogParser();
    logParser.readLine('[test creator] some thing | operation: test | hello');
    expect(logParser.getEntries()[0].creator).toBe('test creator');
  });

  it('should extract creator, action, operation, type and duration', () => {
    const logParser = new LogParser();
    logParser.readLine('[creator] operation | operation: testOperation | operationType: testType | duration: 0.982');
    expect(logParser.getEntries()[0]).toStrictEqual({
        creator: 'creator',
        action: 'operation',
        operation: 'testOperation',
        operationType: 'testType',
        duration: 0.982,
    });
  });

  it('uses -1 for missing duration values', () => {
    const logParser = new LogParser();
    logParser.readLine('[creator] operation | operation: testOperation');
    expect(logParser.getEntries()[0].duration).toBe(-1);
  });

  it('should not choke on lines that look strange and just use default values', () => {
    const logParser = new LogParser();
    logParser.readLine('lkjasd ij20 0-k jki');
    expect(logParser.getEntries()[0]).toStrictEqual({
        creator: '',
        action: '',
        operation: '',
        operationType: '',
        duration: -1,
    });
  });
})