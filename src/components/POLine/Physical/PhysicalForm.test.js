import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import PhysicalForm from './PhysicalForm';

import { order } from '../../../../test/jest/fixtures';
import { arrayMutators } from '../../../../test/jest/arrayMutatorsMock';

const defaultProps = {
  materialTypes: [{
    label: 'label',
    value: 'value',
  }],
  formValues: {
    physical: {
      materialSupplier: 'materialSupplier',
      createInventory: 'Inventory',
    },
  },
  order,
  change: jest.fn(),
};

const renderPhysicalForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    mutators={{
      ...arrayMutators,
    }}
    render={() => (
      <PhysicalForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('PhysicalForm', () => {
  it('should render \'physical form\' fields', () => {
    renderPhysicalForm();

    expect(screen.getByText('ui-orders.physical.materialSupplier')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.receiptDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.expectedReceiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.addVolume')).toBeInTheDocument();
  });
});
