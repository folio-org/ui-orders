import { Form } from 'react-final-form';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { FieldOrganization } from '@folio/stripes-acq-components';

import { handleOrganizationSelect } from './handleOrganizationSelect';
import PurchaseOrderInformationForm from './PurchaseOrderInformationForm';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldOrganization: jest.fn(() => 'ui-orders.orderDetails.vendor'),
}));

jest.mock('./handleOrganizationSelect', () => ({
  handleOrganizationSelect: jest.fn(),
}));

const defaultProps = {
  acqUnitIds: [],
  prefixesSetting: [],
  suffixesSetting: [],
  addresses: [],
  formValues: {},
  change: jest.fn(),
};

const queryClient = new QueryClient();
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
  beforeEach(() => {
    handleOrganizationSelect.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should call handleOrganizationSelect on vendor change', async () => {
    renderPurchaseOrderInformationForm();

    await FieldOrganization.mock.calls[0][0].onSelect({ id: 'vendorId' });

    expect(handleOrganizationSelect).toHaveBeenCalled();
  });
});
