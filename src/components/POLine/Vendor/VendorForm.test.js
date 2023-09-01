import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { arrayMutators } from 'fixtures/arrayMutatorsMock';
import VendorForm from './VendorForm';

const defaultProps = {
  accounts: [{
    name: 'name',
    accountNo: 'accountNo',
  }],
  order: {
    workflowStatus: 'Pending',
  },
};

const renderVendorForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    mutators={{
      ...arrayMutators,
    }}
    render={() => (
      <VendorForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('VendorForm', () => {
  it('should render \'vendor form\' fields', () => {
    renderVendorForm();

    expect(screen.getByText('stripes-acq-components.referenceNumbers.addReferenceNumbers')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.vendor.accountNumber')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.vendor.instructions')).toBeInTheDocument();
  });
});
