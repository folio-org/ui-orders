import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import SummaryView from './SummaryView';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

const defaultProps = {
  fiscalYearsGrouped: {
    current: [{ id: 'fy-id', code: 'FY2026' }],
    previous: [],
  },
  onSelectFiscalYear: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <SummaryView
    {...defaultProps}
    {...props}
  />,
);

describe('SummaryView', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render summary view', () => {
    renderComponent();

    expect(screen.getByText(/order.fiscalYear/)).toBeInTheDocument();
    expect(screen.getByText(/orderSummary.approved/)).toBeInTheDocument();
    expect(screen.getByText(/orderSummary.workflowStatus/)).toBeInTheDocument();
    expect(screen.getByText(/orderSummary.totalEstimatedPrice/)).toBeInTheDocument();
    expect(screen.getByText(/orderSummary.totalExpended/)).toBeInTheDocument();
    expect(screen.getByText(/orderSummary.totalCredited/)).toBeInTheDocument();
  });

  it('should render loading state when FYs are refetching', () => {
    renderComponent({ isFiscalYearsFetching: true });

    expect(screen.queryByText(/order.fiscalYear/)).not.toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
