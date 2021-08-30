import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import OrderLinesList, { resultsFormatter } from './OrderLinesList';
import { orderLine } from '../../test/jest/fixtures';

const mockLocalStorageFilters = {
  filters: {},
  searchQuery: '',
  applyFilters: jest.fn(),
  applySearch: jest.fn(),
  changeSearch: jest.fn(),
  resetFilters: jest.fn(),
  changeIndex: jest.fn(),
  searchIndex: '',
};

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useLocalStorageFilters: jest.fn(() => Object.values(mockLocalStorageFilters)),
    useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
    ResetButton: () => <span>ResetButton</span>,
    SingleSearchForm: () => <span>SingleSearchForm</span>,
  };
});
jest.mock('./OrderLinesFiltersContainer', () => jest.fn().mockReturnValue('OrderLinesFiltersContainer'));

const defaultProps = {
  onNeedMoreData: jest.fn(),
  resetData: jest.fn(),
  refreshList: jest.fn(),
  orderLine: [orderLine],
  orderLinesCount: 1,
};

const renderOrderLinesList = (props = {}) => render(
  <OrderLinesList
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderLinesList', () => {
  it('should display search control', () => {
    const { getByText } = renderOrderLinesList();

    expect(getByText('SingleSearchForm')).toBeDefined();
  });

  it('should display reset filters control', () => {
    const { getByText } = renderOrderLinesList();

    expect(getByText('ResetButton')).toBeDefined();
  });

  it('should display order lines filters', () => {
    const { getByText } = renderOrderLinesList();

    expect(getByText('OrderLinesFiltersContainer')).toBeDefined();
  });
});

describe('resultsFormatter', () => {
  it('should display formatted date', () => {
    const FormattedDate = resultsFormatter['metadata.updatedDate'](orderLine);

    const { getByText } = render(FormattedDate);

    expect(getByText('2021-08-15')).toBeInTheDocument();
  });

  it('should display comma separated product ids', () => {
    expect(resultsFormatter.productIds(orderLine)).toBe('0552142352, 9780552142352');
  });

  it('should display vendor refNumber', () => {
    expect(resultsFormatter['vendorDetail.refNumber'](orderLine)).toBe('refNumber');
  });

  it('should display a hypen if refNumber is missed', () => {
    const { getByText } = render(resultsFormatter['vendorDetail.refNumber']({}));

    expect(getByText('-')).toBeInTheDocument();
  });

  it('should display funcodes', () => {
    expect(resultsFormatter.funCodes(orderLine)).toBe('USHIST');
  });

  it('should display workflow status', () => {
    const { getByText } = render(resultsFormatter.orderWorkflow({ ...orderLine, orderWorkflow: 'Pending' }));

    expect(getByText('stripes-acq-components.order.status.pending')).toBeInTheDocument();
  });
});
