import { MemoryRouter } from 'react-router';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import {
  PAYMENT_STATUS,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

import { location, orderLine } from 'fixtures';
import OrderLinesList, { getResultsFormatter } from './OrderLinesList';

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

jest.mock('react-virtualized-auto-sizer', () => jest.fn(
  (props) => <div>{props.children({ width: 123 })}</div>,
));
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
    useItemToView: jest.fn().mockReturnValue({}),
    ResetButton: () => <span>ResetButton</span>,
    SingleSearchForm: () => <span>SingleSearchForm</span>,
  };
});
jest.mock('./Details', () => jest.fn().mockReturnValue('OrderLineDetails'));
jest.mock('./OrderLinesFiltersContainer', () => jest.fn().mockReturnValue('OrderLinesFiltersContainer'));

const defaultProps = {
  onNeedMoreData: jest.fn(),
  resetData: jest.fn(),
  refreshList: jest.fn(),
  orderLines: [orderLine],
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

  it('should display order line details pane', async () => {
    const { getByText } = renderOrderLinesList();

    await act(async () => user.click(getByText(defaultProps.orderLines[0].poLineNumber)));

    expect(getByText('OrderLineDetails')).toBeInTheDocument();
  });
});

describe('getResultsFormatter', () => {
  it('should display formatted date', () => {
    const FormattedDate = getResultsFormatter(location)['metadata.updatedDate'](orderLine);

    const { getByText } = render(FormattedDate);

    expect(getByText('2021-08-15')).toBeInTheDocument();
  });

  it('should display comma separated product ids', () => {
    expect(getResultsFormatter(location).productIds(orderLine)).toBe('0552142352, 9780552142352');
  });

  it('should display vendor refNumber', () => {
    expect(getResultsFormatter(location)['vendorDetail.refNumber'](orderLine)).toBe('refNumber');
  });

  it('should display a hypen if refNumber is missed', () => {
    const { getByText } = render(getResultsFormatter(location)['vendorDetail.refNumber']({}));

    expect(getByText('-')).toBeInTheDocument();
  });

  it('should display funcodes', () => {
    expect(getResultsFormatter(location).funCodes(orderLine)).toBe('USHIST');
  });

  it('should display workflow status', () => {
    const { getByText } = render(getResultsFormatter(location).orderWorkflow({ ...orderLine, orderWorkflow: 'Pending' }));

    expect(getByText('stripes-acq-components.order.status.pending')).toBeInTheDocument();
  });

  it('should display only order line number', () => {
    render(getResultsFormatter(location).poLineNumber(orderLine), { wrapper: MemoryRouter });

    expect(screen.getByText(orderLine.poLineNumber)).toBeInTheDocument();
    expect(screen.queryByTestId('cancel-icon')).toBeNull();
  });

  it('should display order line number with cancel icon', () => {
    render(getResultsFormatter(location).poLineNumber({
      ...orderLine,
      paymentStatus: PAYMENT_STATUS.cancelled,
      receiptStatus: RECEIPT_STATUS.cancelled,
    }), { wrapper: MemoryRouter });

    expect(screen.getByTestId('cancel-icon')).toBeInTheDocument();
  });
});
