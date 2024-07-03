import { Form } from 'react-final-form';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import PurchaseOrderInformationForm from './PurchaseOrderInformationForm';

const defaultProps = {
  acqUnitIds: [],
  prefixesSetting: [],
  suffixesSetting: [],
  addresses: [],
  formValues: {},
  change: jest.fn(),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderPurchaseOrderInformationForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <PurchaseOrderInformationForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper },
);

describe('PurchaseOrderInformationForm', () => {
  it('should render \'PO information form\' fields', () => {
    renderPurchaseOrderInformationForm();

    expect(screen.getByText('ui-orders.orderDetails.orderNumberPrefix')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.orderNumberSuffix')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.vendor')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.assignedTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.billTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.shipTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.orderType')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.manualPO')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderDetails.reEncumber')).toBeInTheDocument();
  });
});
