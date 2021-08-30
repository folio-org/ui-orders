import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import VendorForm from './VendorForm';
import { arrayMutators } from '../../../../test/jest/arrayMutatorsMock';

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
