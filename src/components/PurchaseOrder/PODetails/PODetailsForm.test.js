import { Form } from 'react-final-form';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { arrayMutators } from 'fixtures/arrayMutatorsMock';
import PODetailsForm from './PODetailsForm';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldTags: jest.fn(() => 'FieldTags'),
}))

const optionMock = {
  disabled: false,
  label: 'label',
  labelId: 'labelId',
  value: 'value',
};

const defaultProps = {
  generatedNumber: '',
  orderNumberSetting: {
    canUserEditOrderNumber: true,
  },
  prefixesSetting: [optionMock],
  suffixesSetting: [optionMock],
  formValues: {},
  addresses: [{}],
  order: {
    id: 'orderId',
    workflowStatus: 'Pending',
  },
  change: jest.fn(),
  validateNumber: jest.fn(),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderPODetailsForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    mutators={{
      ...arrayMutators,
    }}
    render={() => (
      <PODetailsForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper },
);

describe('PODetailsForm', () => {
  beforeEach(() => {
    defaultProps.change.mockClear();
  });

  it('should render \'PO details form\' fields', async () => {
    renderPODetailsForm();

    await waitFor(() => {
      expect(screen.getByText('ui-orders.orderDetails.orderNumberPrefix')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.poNumber')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.orderNumberSuffix')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.vendor')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.orderType')).toBeInTheDocument();
      expect(screen.getByText('stripes-acq-components.label.acqUnits')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.assignedTo')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.billTo')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.shipTo')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.manualPO')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.reEncumber')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.createdBy')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.orderDetails.createdOn')).toBeInTheDocument();
      expect(screen.getByText('FieldTags')).toBeInTheDocument();
    });
  });

  it('poNumber field should handle blur ', async () => {
    renderPODetailsForm();

    const f = await screen.findByLabelText('ui-orders.orderDetails.poNumber');

    f.focus();
    f.blur();

    expect(defaultProps.change).toHaveBeenCalled();
  });
});
