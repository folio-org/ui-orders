import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import OtherForm from './OtherForm';

import { order } from '../../../../test/jest/fixtures';

const defaultProps = {
  materialTypes: [{
    label: 'label',
    value: 'value',
  }],
  formValues: {},
  order,
  initialValues: {},
  change: jest.fn(),
};

const renderOtherForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <OtherForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('OtherForm', () => {
  it('should render \'other form\' fields', () => {
    renderOtherForm();

    expect(screen.getByText('ui-orders.physical.materialSupplier')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.receiptDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.expectedReceiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
  });
});
