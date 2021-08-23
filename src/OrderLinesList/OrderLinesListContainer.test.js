import React from 'react';
import queryString from 'query-string';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import {
  useList,
} from '@folio/stripes-acq-components';

import OrderLinesListContainer from './OrderLinesListContainer';
import OrderLinesList from './OrderLinesList';

import { order, orderLine } from '../../test/jest/fixtures';

const params = {
  qindex: 'productIdISBN',
  query: 'query',
};

jest.mock('query-string', () => ({
  ...jest.requireActual('query-string'),
  parse: jest.fn().mockReturnValue(params),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useList: jest.fn().mockReturnValue({}),
}));
jest.mock('./OrderLinesList', () => jest.fn().mockReturnValue('OrderLinesList'));

const defaultProps = {
  mutator: {
    orderLinesListRecords: {
      GET: jest.fn().mockResolvedValue([orderLine]),
    },
    identifierTypeISBN: {
      GET: jest.fn().mockResolvedValue([{ id: 'isbn-type-id' }]),
    },
    normalizeISBN: {
      GET: jest.fn().mockResolvedValue({ isbn: 'normalizedISBN' }),
    },
    lineOrders: {
      GET: jest.fn().mockResolvedValue([order]),
    },
  },
};

const renderOrderLinesListContainer = (props = {}) => render(
  <OrderLinesListContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderLinesListContainer', () => {
  const OFFSET = 0;
  const hasFilters = true;

  beforeEach(() => {
    queryString.parse.mockClear();
    useList.mockClear();
    defaultProps.mutator.orderLinesListRecords.GET.mockClear();
    defaultProps.mutator.identifierTypeISBN.GET.mockClear();
    defaultProps.mutator.normalizeISBN.GET.mockClear();
    defaultProps.mutator.lineOrders.GET.mockClear();
  });

  it('should render OrderLinesList', () => {
    renderOrderLinesListContainer();

    expect(screen.getByText('OrderLinesList')).toBeInTheDocument();
  });

  it('should pass useList result to OrderLinesList', () => {
    const records = [orderLine];

    OrderLinesList.mockClear();
    useList.mockReturnValue({ records });
    renderOrderLinesListContainer();

    expect(OrderLinesList.mock.calls[0][0].orderLines).toBe(records);
  });

  it('should call API and load order lines', async () => {
    await waitFor(() => renderOrderLinesListContainer());
    await waitFor(() => useList.mock.calls[0][1](OFFSET, hasFilters));

    expect(defaultProps.mutator.orderLinesListRecords.GET).toHaveBeenCalled();
  });

  describe('shoudn\'t call API if:', () => {
    it('should call API and load order lines', async () => {
      queryString.parse.mockReturnValue({ qindex: params.qindex, query: '' });

      await waitFor(() => renderOrderLinesListContainer());
      await waitFor(() => useList.mock.calls[0][1](OFFSET, hasFilters));

      expect(defaultProps.mutator.orderLinesListRecords.GET).not.toHaveBeenCalled();
    });

    it('ISBN type id was not found', async () => {
      defaultProps.mutator.identifierTypeISBN.GET.mockResolvedValue([]);

      await waitFor(() => renderOrderLinesListContainer());
      await waitFor(() => useList.mock.calls[0][1](OFFSET, hasFilters));

      expect(defaultProps.mutator.orderLinesListRecords.GET).not.toHaveBeenCalled();
    });
  });
});

describe('loadOrderLinesCB', () => {
  it('should update order lines', async () => {
    const orderLinesResponse = { poLines: [orderLine] };
    const setOrderLines = jest.fn();

    await waitFor(() => renderOrderLinesListContainer());
    await waitFor(() => useList.mock.calls[0][2](setOrderLines, orderLinesResponse));

    expect(setOrderLines).toHaveBeenCalled();
  });
});
