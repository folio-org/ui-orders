import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { order } from 'fixtures';
import { arrayMutators } from 'fixtures/arrayMutatorsMock';
import PhysicalForm from './PhysicalForm';

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

  it('should `Create inventory` field be `disabled` when `isBinderyActive` value is `true`', () => {
    renderPhysicalForm({
      ...defaultProps,
      formValues: {
        ...defaultProps.formValues,
        details: {
          isBinderyActive: true,
        },
      },
    });

    expect(screen.getByRole('combobox', { name: 'ui-orders.physical.createInventory' })).toBeDisabled();
  });
});
