import React from 'react';
import { render, screen } from '@testing-library/react';
import { useModalToggle } from '@folio/stripes-acq-components';
import { MemoryRouter } from 'react-router-dom';
import { HasCommand } from '@folio/stripes/components';

import OrdersList, { resultsFormatter } from './OrdersList';

import { order } from '../../test/jest/fixtures';
import { history } from '../../test/jest/routerMocks';

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
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useLocalStorageFilters: jest.fn(() => Object.values(mockLocalStorageFilters)),
  useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
  useModalToggle: jest.fn().mockReturnValue([false, jest.fn((state) => !state)]),
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
});

describe('resultsFormatter', () => {
  it('should render formatted updated date', () => {
    render(resultsFormatter['metadata.updatedDate'](order));

    expect(screen.getByText('2021-08-15')).toBeInTheDocument();
  });

  it('should render formatted order status', () => {
    render(resultsFormatter.workflowStatus(order));

    expect(screen.getByText('stripes-acq-components.order.status.pending')).toBeInTheDocument();
  });
});
