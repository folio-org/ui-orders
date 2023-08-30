import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import POLineOtherResourcesForm from './POLineOtherResourcesForm';

const defaultProps = {
  formValues: {},
  materialTypes: [],
  change: jest.fn(),
};

const renderPOLineOtherResourcesForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <POLineOtherResourcesForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('POLineOtherResourcesForm', () => {
  it('should render \'POLine other resources form\' fields', () => {
    renderPOLineOtherResourcesForm();

    expect(screen.getByText('ui-orders.physical.materialSupplier')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.receiptDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.expectedReceiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
  });
});
