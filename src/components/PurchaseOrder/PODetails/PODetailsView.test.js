import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  ORDER_STATUSES,
  useFiscalYear,
} from '@folio/stripes-acq-components';

import { formatOpenedFiscalYear } from '../../../common/utils';
import PODetailsView from './PODetailsView';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiscalYear: jest.fn(),
}))
jest.mock('./UserValue', () => ({ userId }) => <span>{userId}</span>);

const fiscalYear = {
  code: 'TY2025',
  id: 'fiscalYearId',
  name: 'Test fiscal year',
};

const defaultProps = {
  order: {
    metadata: {},
    notes: ['note'],
  },
  addresses: [{
    id: 'id',
  }],
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderPODetailsView = (props = {}) => render(
  <PODetailsView
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('PODetailsView', () => {
  beforeEach(() => {
    useFiscalYear.mockReturnValue({ fiscalYear });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render \'PO details\' view', () => {
    renderPODetailsView();

    expect(screen.getByText('ViewMetaData')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.poNumber')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.vendor')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.orderType')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.label.acqUnits')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.assignedTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.billTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.approvalDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.assignedTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.shipTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.manualPO')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.reEncumber')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.createdBy')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.createdOn')).toBeInTheDocument();

    /* Approved order details */
    expect(screen.queryByText('ui-orders.orderDetails.approvedBy')).not.toBeInTheDocument();

    /* Opened order details */
    expect(screen.queryByText('ui-orders.orderDetails.dateOpened')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-orders.orderDetails.openedBy')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-orders.orderDetails.yearOpened')).not.toBeInTheDocument();
  });

  it('should render \'PO details\' view with approved and opened order details', () => {
    renderPODetailsView({
      order: {
        ...defaultProps.order,
        approvalDate: new Date('2023-01-01').toISOString(),
        approvedById: 'approvedById',
        dateOrdered: new Date('2023-01-02').toISOString(),
        fiscalYearId: fiscalYear.id,
        openedById: 'openedById',
        workflowStatus: ORDER_STATUSES.open,
      },
    });

    /* Approved order details */
    expect(screen.getByText('ui-orders.orderDetails.approvedBy')).toBeInTheDocument();
    expect(screen.getByText('approvedById')).toBeInTheDocument();

    /* Opened order details */
    expect(screen.getByText('ui-orders.orderDetails.dateOpened')).toBeInTheDocument();
    expect(screen.getByText('openedById')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.yearOpened')).toBeInTheDocument();
    expect(screen.getByText(formatOpenedFiscalYear(fiscalYear))).toBeInTheDocument();
  });
});
