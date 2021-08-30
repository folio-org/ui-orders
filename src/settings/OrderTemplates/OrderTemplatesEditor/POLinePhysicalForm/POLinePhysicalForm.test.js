import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import POLinePhysicalForm from './POLinePhysicalForm';
import { arrayMutators } from '../../../../../test/jest/arrayMutatorsMock';

const defaultProps = {
  formValues: {},
  materialTypes: [],
  change: jest.fn(),
};

const renderPOLinePhysicalForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    mutators={{ ...arrayMutators }}
    render={() => (
      <POLinePhysicalForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('POLinePhysicalForm', () => {
  it('should render \'POLine physical resources form\' fields', () => {
    renderPOLinePhysicalForm();

    expect(screen.getByText('ui-orders.physical.materialSupplier')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.receiptDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.expectedReceiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.addVolume')).toBeInTheDocument();
  });
});
