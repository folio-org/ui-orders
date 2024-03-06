import { MemoryRouter } from 'react-router-dom';

import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { HasCommand } from '@folio/stripes/components';
import { useModalToggle, ORDER_STATUSES } from '@folio/stripes-acq-components';

import { order } from 'fixtures';
import { history, location, match } from 'fixtures/routerMocks';
import { CANCEL_ORDER_REASON } from '../common/constants';
import OrdersList, { getResultsFormatter } from './OrdersList';

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  // eslint-disable-next-line react/prop-types
  withRouter: (Component) => (props) => <Component {...props} />,
}));
jest.mock('react-virtualized-auto-sizer', () => jest.fn(
  (props) => <div>{props.children({ width: 123 })}</div>,
));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-core/src/components/TitleManager/TitleManager', () => {
  return jest.fn(({ children }) => <div>{children}</div>);
});
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useLocalStorageFilters: jest.fn(() => Object.values(mockLocalStorageFilters)),
  useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
  useModalToggle: jest.fn().mockReturnValue([false, jest.fn((state) => !state)]),
  useItemToView: jest.fn().mockReturnValue({}),
  ResetButton: () => <span>ResetButton</span>,
  SingleSearchForm: () => <span>SingleSearchForm</span>,
}));
jest.mock('./OrdersListFiltersContainer', () => jest.fn().mockReturnValue('OrdersListFiltersContainer'));
jest.mock('./OrderExportSettingsModalContainer', () => jest.fn().mockReturnValue('OrderExportSettingsModalContainer'));

const defaultProps = {
  isLoading: false,
  onNeedMoreData: jest.fn(),
  orders: [order],
  ordersCount: 30,
  resetData: jest.fn(),
  refreshList: jest.fn(),
  history,
  location: {
    search: '',
  },
  match,
};

const renderOrdersList = (props = {}) => render(
  <OrdersList
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrdersList', () => {
  beforeEach(() => {
    defaultProps.history.push.mockClear();
    HasCommand.mockClear();
    useModalToggle.mockClear();
  });

  it('should display search control', () => {
    renderOrdersList();

    expect(screen.getByText('SingleSearchForm')).toBeInTheDocument();
  });

  it('should display reset filters control', () => {
    renderOrdersList();

    expect(screen.getByText('ResetButton')).toBeInTheDocument();
  });

  it('should display order list filters', () => {
    renderOrdersList();

    expect(screen.getByText('OrdersListFiltersContainer')).toBeInTheDocument();
  });

  describe('OrderExportSettingsModalContainer', () => {
    it('should not be rendered if not toggled', () => {
      renderOrdersList();

      expect(screen.queryByText('OrderExportSettingsModalContainer')).not.toBeInTheDocument();
    });

    it('should be rendered if toggled', () => {
      useModalToggle.mockReturnValue([true, jest.fn()]);

      renderOrdersList();

      expect(screen.getByText('OrderExportSettingsModalContainer')).toBeInTheDocument();
    });
  });

  describe('shortcuts', () => {
    it('should handle \'new\' shortcut', async () => {
      renderOrdersList();

      await act(async () => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler());

      expect(history.push).toHaveBeenCalled();
    });
  });
});

describe('getResultsFormatter', () => {
  it('should render formatted updated date', () => {
    render(getResultsFormatter(location)['metadata.updatedDate'](order));

    expect(screen.getByText('2021-08-15')).toBeInTheDocument();
  });

  it('should render formatted order status', () => {
    render(getResultsFormatter(location).workflowStatus(order));

    expect(screen.getByText('stripes-acq-components.order.status.pending')).toBeInTheDocument();
  });

  it('should render only order number', () => {
    render(getResultsFormatter(location).poNumber(order), { wrapper: MemoryRouter });

    expect(screen.getByText(order.poNumber)).toBeInTheDocument();
    expect(screen.queryByTestId('cancel-icon')).toBeNull();
  });

  it('should render order number with cancel icon', () => {
    render(getResultsFormatter(location).poNumber({
      ...order,
      workflowStatus: ORDER_STATUSES.closed,
      closeReason: { reason: CANCEL_ORDER_REASON },
    }), { wrapper: MemoryRouter });

    expect(screen.getByTestId('cancel-icon')).toBeInTheDocument();
  });
});
