import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';

import PODetailsForm from './PODetailsForm';
import { arrayMutators } from '../../../../test/jest/arrayMutatorsMock';

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
      expect(screen.getByText('stripes-acq-components.label.tags')).toBeInTheDocument();
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
