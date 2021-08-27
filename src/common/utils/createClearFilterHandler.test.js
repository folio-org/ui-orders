import { createClearFilterHandler } from './createClearFilterHandler';

it('\'createClearFilterHandler\' should return handler', () => {
  const fn = jest.fn();

  const handler = createClearFilterHandler(fn, 'filterName');

  expect(handler).toBeInstanceOf(Function);

  handler();

  expect(fn).toBeCalledWith({
    name: 'filterName',
    values: [],
  });
});
