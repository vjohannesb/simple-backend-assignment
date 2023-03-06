import { handler } from '../../../src/functions/hello';

describe('Hello', () => {
  it('Should be a function.', async () => {
    console.log('test');
    expect(typeof(handler)).toBe('function');
  });
});
