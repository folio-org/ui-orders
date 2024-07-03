import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import PODetailsView from './PODetailsView';

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

// eslint-disable-next-line react/prop-types
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
  });
});
